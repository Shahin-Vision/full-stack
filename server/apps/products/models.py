from django.db import models
from apps.users.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    def __str__(self): return self.name

class Product(models.Model):
    STYLE_CHOICES = [('casual','Casual'),('formal','Formal'),('party','Party'),('gym','Gym')]
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    review_count = models.IntegerField(default=0)
    colors = models.JSONField(default=list)
    sizes = models.JSONField(default=list)
    style = models.CharField(max_length=20, choices=STYLE_CHOICES, default='casual')
    is_new = models.BooleanField(default=False)
    is_sale = models.BooleanField(default=False)
    stock = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(default=5)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
