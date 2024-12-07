from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserHistory
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserHistorySerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer




class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserHistoryListCreate(generics.ListCreateAPIView):
    """
    View to list and create UserHistory records.
    """
    serializer_class = UserHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return history records belonging to the logged-in user
        return UserHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate the logged-in user with the history record
        serializer.save(user=self.request.user)


class UserHistoryDelete(generics.DestroyAPIView):
    """
    View to delete a UserHistory record.
    """
    serializer_class = UserHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Allow deletion of history records belonging to the logged-in user
        return UserHistory.objects.filter(user=self.request.user)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
