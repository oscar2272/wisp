# Generated by Django 5.1.9 on 2025-05-19 06:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('note', '0011_remove_note_expires_at_note_expired_at'),
    ]

    operations = [
        migrations.RenameField(
            model_name='note',
            old_name='expired_at',
            new_name='expires_at',
        ),
    ]
