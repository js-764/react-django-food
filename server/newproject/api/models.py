from django.db import models

class foodItem(models.Model):
    name=models.CharField(max_length=70)
    category=models.CharField(max_length=70)
    expiration_date=models.DateField()
    count=models.IntegerField()
    price=models.DecimalField(max_digits=6, decimal_places=2)
    is_in_pantry=models.BooleanField(default=False)

    def __str__(self):
        return self.name
    

#{"name":"ground beef", "category":"meats", "expiration_date":"2025-10-2", "count":1, "price":9.90}