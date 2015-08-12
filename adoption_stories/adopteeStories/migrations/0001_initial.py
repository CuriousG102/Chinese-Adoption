# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Adoptee',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('english_name', models.CharField(null=True, max_length=150, blank=True, db_index=True)),
                ('pinyin_name', models.CharField(null=True, max_length=150, blank=True, db_index=True)),
                ('chinese_name', models.CharField(null=True, max_length=50, blank=True, db_index=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('english_caption', models.CharField(null=True, max_length=200, blank=True)),
                ('chinese_caption', models.CharField(null=True, max_length=200, blank=True)),
                ('approved', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('audio_file', models.FileField(upload_to='')),
            ],
            options={
                'ordering': ['created_at'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('english_caption', models.CharField(null=True, max_length=200, blank=True)),
                ('chinese_caption', models.CharField(null=True, max_length=200, blank=True)),
                ('approved', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('photo_file', models.ImageField(upload_to='')),
            ],
            options={
                'ordering': ['created_at'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('english_name', models.CharField(null=True, max_length=30)),
                ('chinese_name', models.CharField(null=True, max_length=30)),
                ('approved', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('story_text', models.TextField()),
                ('email', models.EmailField(max_length=254)),
                ('approved', models.BooleanField(default=False)),
                ('english_name', models.CharField(null=True, max_length=150)),
                ('chinese_name', models.CharField(null=True, max_length=50)),
                ('pinyin_name', models.CharField(null=True, max_length=150)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('related_adoptee', models.ForeignKey(to='adopteeStories.Adoptee', related_name='stories')),
                ('relationship_to_story', models.ForeignKey(to='adopteeStories.RelationshipCategory')),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.AddField(
            model_name='photo',
            name='story_teller',
            field=models.ForeignKey(null=True, to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='audio',
            name='story_teller',
            field=models.ForeignKey(null=True, to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='front_story',
            field=models.ForeignKey(null=True, to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='photo_front_story',
            field=models.ForeignKey(blank=True, null=True, to='adopteeStories.Photo'),
        ),
    ]
