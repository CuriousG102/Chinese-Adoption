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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('english_name', models.CharField(blank=True, max_length=150, null=True)),
                ('pinyin_name', models.CharField(blank=True, max_length=150, null=True)),
                ('chinese_name', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('english_caption', models.CharField(blank=True, max_length=200, null=True)),
                ('chinese_caption', models.CharField(blank=True, max_length=200, null=True)),
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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('english_caption', models.CharField(blank=True, max_length=200, null=True)),
                ('chinese_caption', models.CharField(blank=True, max_length=200, null=True)),
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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('english_name', models.CharField(max_length=30)),
                ('chinese_name', models.CharField(max_length=30)),
                ('approved', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('story_text', models.TextField()),
                ('email', models.EmailField(max_length=254)),
                ('approved', models.BooleanField(default=False)),
                ('english_name', models.CharField(max_length=150)),
                ('chinese_name', models.CharField(max_length=50)),
                ('pinyin_name', models.CharField(max_length=150)),
                ('related_adoptee', models.ForeignKey(related_name='stories', to='adopteeStories.Adoptee')),
                ('relationshipToStory', models.ForeignKey(to='adopteeStories.RelationshipCategory')),
            ],
        ),
        migrations.AddField(
            model_name='photo',
            name='story_teller',
            field=models.ForeignKey(to='adopteeStories.StoryTeller', null=True),
        ),
        migrations.AddField(
            model_name='audio',
            name='story_teller',
            field=models.ForeignKey(to='adopteeStories.StoryTeller', null=True),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='front_story',
            field=models.ForeignKey(to='adopteeStories.StoryTeller', null=True),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='photo_front_story',
            field=models.ForeignKey(to='adopteeStories.Photo', blank=True, null=True),
        ),
    ]
