from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import foodItem
from .serializer import FoodItemSerializer

@api_view((['GET']))
def get_foods(request):
    foods = foodItem.objects.all()
    serializedData = FoodItemSerializer(foods, many=True).data
    return Response(serializedData)

@api_view((['POST']))
def create_food(request):
    data = request.data
    serializer = FoodItemSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE', 'PUT'])
def food_detail(request, pk):
    try:
        food = foodItem.objects.get(pk=pk)
        
    except foodItem.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        food.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'PUT':
        data = request.data
        serializer = FoodItemSerializer(food, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)