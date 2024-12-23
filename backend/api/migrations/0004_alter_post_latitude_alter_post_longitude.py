# Generated by Django 5.0.4 on 2024-11-23 23:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_nowplaying'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='latitude',
            field=models.DecimalField(decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='longitude',
            field=models.DecimalField(decimal_places=6, max_digits=9, null=True),
        ),
    ]
