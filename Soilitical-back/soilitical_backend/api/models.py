from django.db import models
from django.contrib.auth.models import User

class UserHistory(models.Model):
    SOIL_TYPE_CHOICES = [
        ('loamy soil', 'loamy soil'),
        ('clayey soil - loamy soil', 'clayey soil - loamy soil'),
        ('well-drained - loamy soil', 'well-drained - loamy soil'),
        ('sandy clay', 'sandy clay'),
        ('sandy loam - silt loam', 'sandy loam - silt loam')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    soil_type = models.CharField(
        max_length=100, 
        choices=SOIL_TYPE_CHOICES, 
        default='loamy soil'
    )
    n_value = models.FloatField(help_text="Nitrogen value in soil")
    p_value = models.FloatField(help_text="Phosphorous value in soil")
    k_value = models.FloatField(help_text="Potassium value in soil")
    ec_value = models.FloatField(help_text="Electrical conductivity of the soil")
    temperature = models.FloatField(help_text="Temperature in degrees Celsius")
    prediction = models.CharField(max_length=255, null=True, blank=True)

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Soil Test for {self.user.username} at {self.timestamp}"
