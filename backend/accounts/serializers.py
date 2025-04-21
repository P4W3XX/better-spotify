from rest_framework import serializers
from api.models import CustomUser
from django.contrib.auth import authenticate
from django.templatetags.static import static

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'type', 'image']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.image == '' or not instance.image:
            request = self.context.get('request')
            if request:
                representation['image'] = request.build_absolute_uri(static('default.jpg'))
            else:
                representation['image'] = static('default.jpg')

        return representation


class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password1', 'password2')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError("Passwords do not match")
        
        password = attrs.get('password1', '')
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')

        return CustomUser.objects.create_user(password=password, **validated_data)
    

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")