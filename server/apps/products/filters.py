import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    is_new = django_filters.BooleanFilter()
    is_sale = django_filters.BooleanFilter()
    style = django_filters.CharFilter(lookup_expr='iexact')
    category = django_filters.CharFilter(field_name='category__slug')
    class Meta:
        model = Product
        fields = ['min_price','max_price','is_new','is_sale','style','category']
