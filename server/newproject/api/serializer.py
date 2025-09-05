from rest_framework import serializers
from .models import foodItem

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = foodItem
        fields = '__all__'