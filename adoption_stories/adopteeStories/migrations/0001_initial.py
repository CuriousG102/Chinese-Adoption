# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import embed_video.fields
import adopteeStories.custom_model_fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Adoptee',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('english_name', models.CharField(max_length=150, null=True, blank=True, verbose_name='English Name', db_index=True)),
                ('pinyin_name', models.CharField(max_length=150, null=True, blank=True, verbose_name='Pinyin Name', db_index=True)),
                ('chinese_name', models.CharField(max_length=50, null=True, blank=True, verbose_name='Chinese Name', db_index=True)),
                ('photo_front_story', adopteeStories.custom_model_fields.RestrictedImageField(upload_to='', blank=True, verbose_name='Photo Front Story', null=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Adoptees',
                'verbose_name': 'Adoptee',
                'ordering': ['-created'],
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('english_caption', models.CharField(max_length=200, blank=True, verbose_name='English Caption', null=True)),
                ('chinese_caption', models.CharField(max_length=200, blank=True, verbose_name='Chinese Caption', null=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('audio', embed_video.fields.EmbedSoundcloudField(verbose_name='Audio Soundcloud Embed')),
            ],
            options={
                'verbose_name_plural': 'Audio items',
                'abstract': False,
                'verbose_name': 'Audio item',
                'ordering': ['-created'],
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('english_caption', models.CharField(max_length=200, blank=True, verbose_name='English Caption', null=True)),
                ('chinese_caption', models.CharField(max_length=200, blank=True, verbose_name='Chinese Caption', null=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('photo_file', models.ImageField(upload_to='', verbose_name='Photo File')),
            ],
            options={
                'verbose_name_plural': 'Photos',
                'abstract': False,
                'verbose_name': 'Photo',
                'ordering': ['-created'],
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('english_name', models.CharField(max_length=30, blank=True, verbose_name='English Name', null=True)),
                ('chinese_name', models.CharField(max_length=30, blank=True, verbose_name='Chinese Name', null=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('order', models.IntegerField(blank=True, verbose_name='Position of relationship category', null=True)),
            ],
            options={
                'verbose_name_plural': 'Relationship Categories',
                'verbose_name': 'Relationship Category',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('story_text', models.TextField(verbose_name='Story Text')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('english_name', models.CharField(max_length=150, blank=True, verbose_name='English Name', null=True)),
                ('chinese_name', models.CharField(max_length=50, blank=True, verbose_name='Chinese Name', null=True)),
                ('pinyin_name', models.CharField(max_length=150, blank=True, verbose_name='Pinyin Name', null=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('related_adoptee', models.ForeignKey(verbose_name='Related Adoptee', to='adopteeStories.Adoptee', related_name='stories')),
                ('relationship_to_story', models.ForeignKey(to='adopteeStories.RelationshipCategory', verbose_name='Relationship to Story')),
            ],
            options={
                'verbose_name_plural': 'Story Tellers',
                'verbose_name': 'Story Teller',
                'ordering': ['-created'],
            },
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('english_caption', models.CharField(max_length=200, blank=True, verbose_name='English Caption', null=True)),
                ('chinese_caption', models.CharField(max_length=200, blank=True, verbose_name='Chinese Caption', null=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('video', embed_video.fields.EmbedYoutubeField(verbose_name='Video Youtube Embed')),
                ('story_teller', models.ForeignKey(verbose_name='Story Teller', null=True, to='adopteeStories.StoryTeller')),
            ],
            options={
                'verbose_name_plural': 'Video items',
                'abstract': False,
                'verbose_name': 'Video item',
                'ordering': ['-created'],
            },
        ),
        migrations.AddField(
            model_name='photo',
            name='story_teller',
            field=models.ForeignKey(verbose_name='Story Teller', null=True, to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='audio',
            name='story_teller',
            field=models.ForeignKey(verbose_name='Story Teller', null=True, to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='front_story',
            field=models.ForeignKey(blank=True, verbose_name='Front Story', null=True, to='adopteeStories.StoryTeller'),
        ),
    ]
