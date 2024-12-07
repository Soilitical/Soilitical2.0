from django.urls import path
from .views import UserHistoryListCreate, UserHistoryDelete

urlpatterns = [
    path("history/", UserHistoryListCreate.as_view(), name="user-history"),
    path("history/<int:pk>/", UserHistoryDelete.as_view(), name="delete-history"),
]
