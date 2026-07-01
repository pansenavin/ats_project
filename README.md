# Applicant Tracking System (ATS)

This is a full-stack ATS built with Django and React.

## Tech Stack
- **Backend**: Django, Django REST Framework, SimpleJWT, PostgreSQL
- **Frontend**: React, Vite, Axios, React Router, Lucide Icons

## Setup Instructions (Docker)

The easiest way to run the project is using Docker Compose.

1. Make sure you have Docker and Docker Compose installed.
2. Run the following command from the root directory:
   ```bash
   docker-compose up --build
   ```
3. The services will be available at:
   - **Frontend**: http://localhost:5173, http://localhost:5173/login
   - **Backend API**: http://localhost:8000
   - **Adminer (Database GUI)**: http://localhost:8080

### Database Migrations
On the first run, you need to apply migrations. Run this in a new terminal:
```bash
docker-compose exec backend python manage.py migrate
```

### Create Superuser
To create an admin account:
```bash
docker-compose exec backend python manage.py createsuperuser 
```

## Admin Details
- **Username**: `admin`
- **Password**: `admin123`
