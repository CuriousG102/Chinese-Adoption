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
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('english_name', models.CharField(null=True, max_length=150, blank=True)),
                ('pinyin_name', models.CharField(null=True, max_length=150, blank=True)),
                ('chinese_name', models.CharField(null=True, max_length=50, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('english_caption', models.CharField(null=True, max_length=200, blank=True)),
                ('chinese_caption', models.CharField(null=True, max_length=200, blank=True)),
                ('approved', models.BooleanField(default=False)),
                ('audio_file', models.FileField(upload_to='')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('english_caption', models.CharField(null=True, max_length=200, blank=True)),
                ('chinese_caption', models.CharField(null=True, max_length=200, blank=True)),
                ('approved', models.BooleanField(default=False)),
                ('photo_file', models.ImageField(upload_to='')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('english_name', models.CharField(max_length=30)),
                ('chinese_name', models.CharField(max_length=30)),
                ('approved', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('storyText', models.TextField()),
                ('email', models.EmailField(max_length=254)),
                ('approved', models.BooleanField(default=False)),
                ('related_adoptee', models.ForeignKey(to='adopteeStories.Adoptee')),
                ('relationshipToStory', models.ForeignKey(to='adopteeStories.RelationshipCategory')),
            ],
        ),
        migrations.AddField(
            model_name='photo',
            name='story_teller',
            field=models.ForeignKey(to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='audio',
            name='story_teller',
            field=models.ForeignKey(to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='front_story',
            field=models.ForeignKey(to='adopteeStories.StoryTeller', null=True),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='photo_front_story',
            field=models.ForeignKey(null=True, to='adopteeStories.Photo', blank=True),
        ),
    ]
