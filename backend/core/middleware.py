import re
from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import AuthenticationFailed

class JWTAuthMiddleware:
    """
    Custom Middleware to handle JWT Authentication globally.
    This replaces DRF's standard permission_classes mechanism, enforcing
    authentication at the Django request/response level.
    """
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_authenticator = JWTAuthentication()

        # Use sets for cleaner structure and faster exact-match lookups
        self.public_prefixes = {
            '/admin/',
            '/api/token/',
            '/api/public/jobs/',
            '/media/',
            '/api/ping/', # Including the test endpoint
        }

        self.public_exact = {
            ('/api/applications/', 'POST'),
        }

    def __call__(self, request):
        path = request.path_info
        method = request.method

        is_public = False

        # 1. Check exact matches first (O(1) fast lookup)
        if (path, method) in self.public_exact or (path, None) in self.public_exact:
            is_public = True
        else:
            # 2. Check prefix matches (Iterate over set)
            for prefix in self.public_prefixes:
                if path.startswith(prefix):
                    is_public = True
                    break

        # 2. If the route is private, manually enforce JWT Authentication
        if not is_public:
            try:
                # Explicitly read the "Authorization: Bearer <token>" header
                auth_tuple = self.jwt_authenticator.authenticate(request)
                if auth_tuple is None:
                    return JsonResponse({"detail": "Authentication credentials were not provided."}, status=401)
                
                # Attach the authenticated user to the request so views can use it
                request.user = auth_tuple[0]
            except (AuthenticationFailed, InvalidToken) as e:
                return JsonResponse({"detail": str(e)}, status=401)

        # 3. Allow the request to proceed to the Views
        return self.get_response(request)
