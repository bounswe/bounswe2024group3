# Generated by Django 5.0.4 on 2024-12-11 14:41

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_post_latitude_alter_post_longitude'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='content',
            name='description',
        ),
        migrations.AddField(
            model_name='content',
            name='album_name',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='content',
            name='artist_names',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, default=list, size=None),
        ),
        migrations.AddField(
            model_name='content',
            name='genres',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, default=list, size=None),
        ),
        migrations.AddField(
            model_name='content',
            name='playlist_name',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='content',
            name='song_name',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='content',
            name='content_type',
            field=models.CharField(choices=[('artist', 'Artist'), ('album', 'Album'), ('track', 'Track')], default='track', max_length=20),
        ),
    ]