from django.db import models
import uuid

class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
        ('internship', 'Internship'),
        ('contract', 'Contract'),
    ]
    
    LOCATION_TYPE_CHOICES = [
        ('remote', 'Remote'),
        ('on-site', 'On-Site'),
        ('hybrid', 'Hybrid'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('live', 'Live'),
        ('closed', 'Closed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    pay_range_start = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    pay_range_end = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=255)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='full-time')
    location_type = models.CharField(max_length=20, choices=LOCATION_TYPE_CHOICES, default='on-site')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    
    # Configuration for the application form
    # Example: {"require_covering_letter": true, "custom_questions": [{"label": "Portfolio URL", "type": "url", "required": false}]}
    application_config = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Application(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, related_name='applications', on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    covering_letter = models.TextField(null=True, blank=True)
    
    # Store answers to custom questions defined in Job.application_config
    custom_answers = models.JSONField(default=dict, blank=True)
    
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.job.title}"
