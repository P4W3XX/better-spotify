# Generated by Django 5.1.1 on 2025-04-21 17:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='album',
            name='theme',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
