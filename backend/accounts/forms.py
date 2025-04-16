from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from api.models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('email',)

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'type',)

    def clean_username(self):
        return self.cleaned_data.get('username')