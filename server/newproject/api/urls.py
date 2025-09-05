from django.urls import path
from .views import get_foods, create_food, food_detail

urlpatterns = [
    path('foods/', get_foods, name='get_foods'),
    path('foods/create/', create_food, name='create_food'),
    path('foods/<int:pk>/', food_detail, name='food_detail')
]