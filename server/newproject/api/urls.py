from django.urls import path
from .views import get_foods, create_food

urlpatterns = [
    path('foods/', get_foods, name='get_foods'),
    path('foods/create/', create_food, name='create_food')
]