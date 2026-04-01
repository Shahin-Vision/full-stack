# apps/products/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Review
from .serializers import ProductListSerializer, ProductDetailSerializer, CategorySerializer, ReviewSerializer
from .filters import ProductFilter

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.select_related('category').all().order_by('-created_at')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'style', 'category__name']
    ordering_fields = ['price', 'rating', 'created_at']
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        return ProductDetailSerializer if self.action == 'retrieve' else ProductListSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def reviews(self, request, pk=None):
        product = self.get_object()

        # ── Prevent duplicate reviews ──
        if product.reviews.filter(user=request.user).exists():
            return Response(
                {'detail': 'You have already reviewed this product.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        s = ReviewSerializer(data=request.data)
        if s.is_valid():
            s.save(product=product, user=request.user)
            # Recalculate rating + count from DB
            reviews = product.reviews.all()
            product.review_count = reviews.count()
            product.rating = round(
                sum(r.rating for r in reviews) / reviews.count(), 1
            )
            product.save(update_fields=['rating', 'review_count'])
            return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        return Response(CategorySerializer(Category.objects.all(), many=True).data)