from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        # ✅ exclude 'order' — it's set in create(), not sent by frontend
        fields = ['id', 'product_id', 'product_name', 'product_image',
                  'quantity', 'price', 'size', 'color']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

class CreateOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    class Meta:
        model = Order
        fields = [
            'shipping_address', 'payment_method', 'total_amount',
            'subtotal', 'delivery_fee', 'discount_amount', 'notes', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item in items_data:
            # ✅ Truncate product_image URL to fit CharField(max_length=500)
            img = item.get('product_image', '') or ''
            OrderItem.objects.create(
                order=order,
                product_id=item['product_id'],
                product_name=item['product_name'],
                product_image=img[:500],
                quantity=item['quantity'],
                price=item['price'],
                size=item.get('size', ''),
                color=item.get('color', ''),
            )
        return order