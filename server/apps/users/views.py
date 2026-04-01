from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

def get_tokens(user):
    r = RefreshToken.for_user(user)
    return {'refresh': str(r), 'access': str(r.access_token)}

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if s.is_valid():
            user = s.save()
            return Response({'user': UserSerializer(user).data, **get_tokens(user)}, status=201)
        return Response(s.errors, status=400)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = LoginSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        user = authenticate(username=s.validated_data['email'], password=s.validated_data['password'])
        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)
        return Response({'user': UserSerializer(user).data, **get_tokens(user)})

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    def get_object(self): return self.request.user
