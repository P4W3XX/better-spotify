from rest_framework import serializers
from api.models import CustomUser
from django.contrib.auth import authenticate
from django.templatetags.static import static
from datetime import timedelta
from django.utils import timezone
from api.models import SongPlayback, Song
from django.db.models import Count
from api.serializers import SongSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    top_listened_songs = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'number_of_followed_artists', 'number_of_followers', 'type', 'image', 'top_listened_songs']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.image == '' or not instance.image:
            request = self.context.get('request')
            if request:
                representation['image'] = request.build_absolute_uri(static('default.jpg'))
            else:
                representation['image'] = static('default.jpg')

        return representation
    

    def get_top_listened_songs(self, obj):
        last_month = timezone.now() - timedelta(days=30)
        songs_ids = SongPlayback.objects.filter(
            user=obj,
            played_at__gte=last_month
        ).values(
            'song__id'
        ).annotate(
            play_count=Count('id')
        ).order_by('-play_count')[:10]

        songs = Song.objects.filter(id__in=[song['song__id'] for song in songs_ids])
        serializer = SongSerializer(songs, many=True, context=self.context, nested=True)
        return serializer.data




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