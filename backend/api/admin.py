from django.contrib import admin
from .models import Album, Song, CustomUser, CurrentPlayback, SongPlayback, Playlist, PlaylistSong, Library, LibraryItem, PlaybackHistory

from accounts.forms import CustomUserCreationForm, CustomUserChangeForm
from django.contrib.auth.admin import UserAdmin

# Register your models here.
admin.site.register(Album)
admin.site.register(Song)
admin.site.register(CurrentPlayback)
admin.site.register(SongPlayback)
admin.site.register(Playlist)
admin.site.register(PlaylistSong)
admin.site.register(Library)
admin.site.register(LibraryItem)
admin.site.register(PlaybackHistory)

# admin.site.register(CustomUser)

@admin.register(CustomUser)
class CustomAdminUser(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm

    model = CustomUser

    list_display = ('email', 'username', 'type', 'is_staff', 'is_active',)
    list_filter = ('is_staff', 'is_active', 'type')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password', 'username', 'type', 'image')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'type', 'is_staff', 'is_active')}
        ),
    )

    search_fields = ('email',)