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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('english_name', models.CharField(max_length=150, blank=True, null=True, db_index=True, verbose_name='English Name')),
                ('pinyin_name', models.CharField(max_length=150, blank=True, null=True, db_index=True, verbose_name='Pinyin Name')),
                ('chinese_name', models.CharField(max_length=50, blank=True, null=True, db_index=True, verbose_name='Chinese Name')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
            ],
            options={
                'verbose_name_plural': 'Adoptees',
                'verbose_name': 'Adoptee',
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('english_caption', models.CharField(max_length=200, blank=True, null=True, verbose_name='English Caption')),
                ('chinese_caption', models.CharField(max_length=200, blank=True, null=True, verbose_name='Chinese Caption')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
                ('audio_file', models.FileField(upload_to='', verbose_name='Audio File')),
            ],
            options={
                'verbose_name_plural': 'Audio Recordings',
                'verbose_name': 'Audio Recording',
                'abstract': False,
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('english_caption', models.CharField(max_length=200, blank=True, null=True, verbose_name='English Caption')),
                ('chinese_caption', models.CharField(max_length=200, blank=True, null=True, verbose_name='Chinese Caption')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
                ('photo_file', models.ImageField(upload_to='', verbose_name='Photo File')),
            ],
            options={
                'verbose_name_plural': 'Photos',
                'verbose_name': 'Photo',
                'abstract': False,
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('english_name', models.CharField(max_length=30, null=True, verbose_name='English Name')),
                ('chinese_name', models.CharField(max_length=30, null=True, verbose_name='Chinese Name')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
            ],
            options={
                'verbose_name_plural': 'Relationship Categories',
                'verbose_name': 'Relationship Category',
            },
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('story_text', models.TextField(verbose_name='Story Text')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('english_name', models.CharField(max_length=150, null=True, verbose_name='English Name')),
                ('chinese_name', models.CharField(max_length=50, null=True, verbose_name='Chinese Name')),
                ('pinyin_name', models.CharField(max_length=150, null=True, verbose_name='Pinyin Name')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
                ('related_adoptee', models.ForeignKey(related_name='stories', to='adopteeStories.Adoptee', verbose_name='Related Adoptee')),
                ('relationship_to_story', models.ForeignKey(to='adopteeStories.RelationshipCategory', verbose_name='Relationship to Story')),
            ],
            options={
                'verbose_name_plural': 'Story Tellers',
                'verbose_name': 'Story Teller',
                'ordering': ['created'],
            },
        ),
        migrations.AddField(
            model_name='photo',
            name='story_teller',
            field=models.ForeignKey(to='adopteeStories.StoryTeller', verbose_name='Story Teller', null=True),
        ),
        migrations.AddField(
            model_name='audio',
            name='story_teller',
            field=models.ForeignKey(to='adopteeStories.StoryTeller', verbose_name='Story Teller', null=True),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='front_story',
            field=models.ForeignKey(to='adopteeStories.StoryTeller', verbose_name='Front Story', null=True),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='photo_front_story',
            field=models.ForeignKey(verbose_name='Photo Front Story', blank=True, to='adopteeStories.Photo', null=True),
        ),
    ]
