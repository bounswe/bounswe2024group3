# Generated by Django 5.0.4 on 2024-12-15 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_spotifytoken'),
    ]

    operations = [
        migrations.AddField(
            model_name='spotifytoken',
            name='spotify_user_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
