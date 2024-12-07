INSTALLED_APPS += [
    'rest_framework_simplejwt',
    'corsheaders',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

# During development
CORS_ALLOW_ALL_ORIGINS = True  # Only use this in development!

# For production, specify allowed origins:
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",  # Your React dev server
#     "http://your-production-domain.com",
# ]

# If you need cookies/credentials
CORS_ALLOW_CREDENTIALS = True 