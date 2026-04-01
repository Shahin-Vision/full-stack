from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer

class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    def get_queryset(self): return Order.objects.filter(user=self.request.user).prefetch_related('items').order_by('-created_at')
    def get_serializer_class(self): return CreateOrderSerializer if self.request.method == 'POST' else OrderSerializer
    def perform_create(self, s): s.save(user=self.request.user)

class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    def get_queryset(self): return Order.objects.filter(user=self.request.user)
