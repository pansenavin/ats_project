from rest_framework import generics
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer, PublicJobSerializer, PublicApplicationSerializer

# --- Admin Job Views ---
class JobListCreateAPIView(generics.ListCreateAPIView):
    """Admin endpoint for listing and creating jobs."""
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class JobRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """Admin endpoint for retrieving, updating, and deleting a specific job."""
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class JobApplicationsListAPIView(generics.ListAPIView):
    """Admin endpoint to list all applications for a specific job."""
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        # Fetch applications related to the specific job ID provided in the URL
        return Application.objects.filter(job_id=self.kwargs['pk'])


# --- Public Job Views ---
class PublicJobListAPIView(generics.ListAPIView):
    """Public endpoint to list all live jobs."""
    queryset = Job.objects.filter(status='live')
    serializer_class = PublicJobSerializer

class PublicJobRetrieveAPIView(generics.RetrieveAPIView):
    """Public endpoint to retrieve a specific live job."""
    queryset = Job.objects.filter(status='live')
    serializer_class = PublicJobSerializer
    lookup_field = 'id'


# --- Application Views ---
class ApplicationListCreateAPIView(generics.ListCreateAPIView):
    """Endpoint for listing (Admin) and creating (Public) applications."""
    queryset = Application.objects.all()

    def get_serializer_class(self):
        # Use the public serializer for submissions, and the full serializer for admins viewing the list
        if self.request.method == 'POST':
            return PublicApplicationSerializer
        return ApplicationSerializer


