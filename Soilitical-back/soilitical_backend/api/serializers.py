from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserHistory
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'confirm_password')

    def validate(self, data):
        # Ensure passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        # Remove the confirm_password field before creating the user
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')

        # Create the user instance
        user = User(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()  # Save the user to the database
        return user
class UserHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHistory
        fields = [
            'id', 'soil_type', 'n_value', 'p_value', 
            'k_value', 'ec_value', 'temperature', 'timestamp', 'prediction'
        ]
        read_only_fields = ['timestamp']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["email"] = user.email

        return token
