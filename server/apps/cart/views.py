from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
class CartView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, r): return Response({'message': 'Cart is managed client-side with Redux'})
    def post(self, r): return Response({'message': 'Item received', 'data': r.data}, status=201)
