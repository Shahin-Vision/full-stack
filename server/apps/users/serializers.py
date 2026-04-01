from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email','first_name','last_name','phone','address']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    class Meta:
        model = User
        fields = ['email','first_name','last_name','password']
    def create(self, v):
        return User.objects.create_user(
            username=v['email'], email=v['email'],
            first_name=v.get('first_name',''), last_name=v.get('last_name',''),
            password=v['password'])

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
