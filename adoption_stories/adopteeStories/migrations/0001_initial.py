# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import embed_video.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Adoptee',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('english_name', models.CharField(db_index=True, max_length=150, verbose_name='English Name', blank=True, null=True)),
                ('pinyin_name', models.CharField(db_index=True, max_length=150, verbose_name='Pinyin Name', blank=True, null=True)),
                ('chinese_name', models.CharField(db_index=True, max_length=50, verbose_name='Chinese Name', blank=True, null=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
            ],
            options={
                'ordering': ['created'],
                'verbose_name': 'Adoptee',
                'verbose_name_plural': 'Adoptees',
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('english_caption', models.CharField(max_length=200, verbose_name='English Caption', blank=True, null=True)),
                ('chinese_caption', models.CharField(max_length=200, verbose_name='Chinese Caption', blank=True, null=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('audio', embed_video.fields.EmbedSoundcloudField(verbose_name='Audio Soundcloud Embed')),
            ],
            options={
                'ordering': ['created'],
                'verbose_name': 'Audio item',
                'verbose_name_plural': 'Audio items',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('english_caption', models.CharField(max_length=200, verbose_name='English Caption', blank=True, null=True)),
                ('chinese_caption', models.CharField(max_length=200, verbose_name='Chinese Caption', blank=True, null=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('photo_file', models.ImageField(upload_to='', verbose_name='Photo File')),
            ],
            options={
                'ordering': ['created'],
                'verbose_name': 'Photo',
                'verbose_name_plural': 'Photos',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('english_name', models.CharField(max_length=30, verbose_name='English Name', null=True)),
                ('chinese_name', models.CharField(max_length=30, verbose_name='Chinese Name', null=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
            ],
            options={
                'verbose_name': 'Relationship Category',
                'verbose_name_plural': 'Relationship Categories',
            },
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('story_text', models.TextField(verbose_name='Story Text')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('english_name', models.CharField(max_length=150, verbose_name='English Name', null=True)),
                ('chinese_name', models.CharField(max_length=50, verbose_name='Chinese Name', null=True)),
                ('pinyin_name', models.CharField(max_length=150, verbose_name='Pinyin Name', null=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('related_adoptee', models.ForeignKey(related_name='stories', verbose_name='Related Adoptee', to='adopteeStories.Adoptee')),
                ('relationship_to_story', models.ForeignKey(verbose_name='Relationship to Story', to='adopteeStories.RelationshipCategory')),
            ],
            options={
                'ordering': ['created'],
                'verbose_name': 'Story Teller',
                'verbose_name_plural': 'Story Tellers',
            },
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('english_caption', models.CharField(max_length=200, verbose_name='English Caption', blank=True, null=True)),
                ('chinese_caption', models.CharField(max_length=200, verbose_name='Chinese Caption', blank=True, null=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('video', embed_video.fields.EmbedYoutubeField(verbose_name='Youtube Soundcloud Embed')),
                ('story_teller', models.ForeignKey(verbose_name='Story Teller', to='adopteeStories.StoryTeller', null=True)),
            ],
            options={
                'ordering': ['created'],
                'verbose_name': 'Video item',
                'verbose_name_plural': 'Video items',
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='photo',
            name='story_teller',
            field=models.ForeignKey(verbose_name='Story Teller', to='adopteeStories.StoryTeller', null=True),
        ),
        migrations.AddField(
            model_name='audio',
            name='story_teller',
            field=models.ForeignKey(verbose_name='Story Teller', to='adopteeStories.StoryTeller', null=True),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='front_story',
            field=models.ForeignKey(verbose_name='Front Story', to='adopteeStories.StoryTeller', null=True),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='photo_front_story',
            field=models.ForeignKey(to='adopteeStories.Photo', verbose_name='Photo Front Story', blank=True, null=True),
        ),
    ]
