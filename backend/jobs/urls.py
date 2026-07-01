from django.urls import path
from .views import (
    JobListCreateAPIView, JobRetrieveUpdateDestroyAPIView, JobApplicationsListAPIView,
    PublicJobListAPIView, PublicJobRetrieveAPIView,
    ApplicationListCreateAPIView
)

urlpatterns = [
    # Admin Jobs
    path('admin/jobs/', JobListCreateAPIView.as_view(), name='admin-job-list'),
    path('admin/jobs/<uuid:pk>/', JobRetrieveUpdateDestroyAPIView.as_view(), name='admin-job-detail'),
    path('admin/jobs/<uuid:pk>/applications/', JobApplicationsListAPIView.as_view(), name='admin-job-applications'),

    # Public Jobs
    path('public/jobs/', PublicJobListAPIView.as_view(), name='public-job-list'),
    path('public/jobs/<uuid:id>/', PublicJobRetrieveAPIView.as_view(), name='public-job-detail'),

    # Applications
    path('applications/', ApplicationListCreateAPIView.as_view(), name='application-list-create'),
]
