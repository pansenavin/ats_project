from rest_framework import serializers
from .models import Job, Application

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'

class PublicJobSerializer(serializers.ModelSerializer):
    """Serializer for public view, might want to hide some fields if necessary."""
    job_type = serializers.CharField(source='get_job_type_display')
    location_type = serializers.CharField(source='get_location_type_display')

    class Meta:
        model = Job
        exclude = ('created_at', 'updated_at')

class PublicApplicationSerializer(serializers.ModelSerializer):
    """Serializer for public job submission."""
    class Meta:
        model = Application
        fields = ('job', 'full_name', 'email', 'resume', 'covering_letter', 'custom_answers')
