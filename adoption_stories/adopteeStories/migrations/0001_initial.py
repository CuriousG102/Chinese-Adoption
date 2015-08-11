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
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('english_name', models.CharField(max_length=150, null=True, blank=True)),
                ('pinyin_name', models.CharField(max_length=150, null=True, blank=True)),
                ('chinese_name', models.CharField(max_length=50, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('english_caption', models.CharField(max_length=200, null=True, blank=True)),
                ('chinese_caption', models.CharField(max_length=200, null=True, blank=True)),
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
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('english_caption', models.CharField(max_length=200, null=True, blank=True)),
                ('chinese_caption', models.CharField(max_length=200, null=True, blank=True)),
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
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('english_name', models.CharField(max_length=30)),
                ('chinese_name', models.CharField(max_length=30)),
                ('approved', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('story_text', models.TextField()),
                ('email', models.EmailField(max_length=254)),
                ('approved', models.BooleanField(default=False)),
                ('english_name', models.CharField(max_length=150)),
                ('chinese_name', models.CharField(max_length=50)),
                ('pinyin_name', models.CharField(max_length=150)),
                ('related_adoptee', models.ForeignKey(to='adopteeStories.Adoptee')),
                ('relationshipToStory', models.ForeignKey(to='adopteeStories.RelationshipCategory')),
            ],
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
            field=models.ForeignKey(null=True, blank=True, to='adopteeStories.Photo'),
        ),
    ]
