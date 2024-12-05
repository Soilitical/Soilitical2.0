from django.db import models
from django.contrib.auth.models import User  

class UserHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Foreign key to the User model
    n_value = models.FloatField()
    p_value = models.FloatField()
    k_value = models.FloatField()
    ph_values = models.FloatField()
    humidity = models.FloatField()
    temperature = models.FloatField()
    rainfall = models.FloatField()
    prediction = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)  # Automatically set the timestamp to the current date and time when a record is created

    def __str__(self):
        return f"UserHistory for {self.user.username} at {self.timestamp}"
