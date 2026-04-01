from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as Base
from .models import User
@admin.register(User)
class UserAdmin(Base):
    list_display = ['email','first_name','last_name','is_staff']
