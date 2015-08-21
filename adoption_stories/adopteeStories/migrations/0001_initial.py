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
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('english_name', models.CharField(max_length=150, db_index=True, verbose_name='English Name', null=True, blank=True)),
                ('pinyin_name', models.CharField(max_length=150, db_index=True, verbose_name='Pinyin Name', null=True, blank=True)),
                ('chinese_name', models.CharField(max_length=50, db_index=True, verbose_name='Chinese Name', null=True, blank=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
            ],
            options={
                'ordering': ['created'],
                'verbose_name_plural': 'Adoptees',
                'verbose_name': 'Adoptee',
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('english_caption', models.CharField(max_length=200, verbose_name='English Caption', null=True, blank=True)),
                ('chinese_caption', models.CharField(max_length=200, verbose_name='Chinese Caption', null=True, blank=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('audio', embed_video.fields.EmbedSoundcloudField(verbose_name='Audio Soundcloud Embed')),
            ],
            options={
                'ordering': ['created'],
                'verbose_name_plural': 'Audio items',
                'verbose_name': 'Audio item',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('english_caption', models.CharField(max_length=200, verbose_name='English Caption', null=True, blank=True)),
                ('chinese_caption', models.CharField(max_length=200, verbose_name='Chinese Caption', null=True, blank=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('photo_file', models.ImageField(verbose_name='Photo File', upload_to='')),
            ],
            options={
                'ordering': ['created'],
                'verbose_name_plural': 'Photos',
                'verbose_name': 'Photo',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('english_name', models.CharField(max_length=30, verbose_name='English Name', null=True, blank=True)),
                ('chinese_name', models.CharField(max_length=30, verbose_name='Chinese Name', null=True, blank=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Relationship Categories',
                'verbose_name': 'Relationship Category',
            },
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('story_text', models.TextField(verbose_name='Story Text')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('english_name', models.CharField(max_length=150, verbose_name='English Name', null=True, blank=True)),
                ('chinese_name', models.CharField(max_length=50, verbose_name='Chinese Name', null=True, blank=True)),
                ('pinyin_name', models.CharField(max_length=150, verbose_name='Pinyin Name', null=True, blank=True)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('related_adoptee', models.ForeignKey(verbose_name='Related Adoptee', to='adopteeStories.Adoptee', related_name='stories')),
                ('relationship_to_story', models.ForeignKey(verbose_name='Relationship to Story', to='adopteeStories.RelationshipCategory')),
            ],
            options={
                'ordering': ['created'],
                'verbose_name_plural': 'Story Tellers',
                'verbose_name': 'Story Teller',
            },
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('english_caption', models.CharField(max_length=200, verbose_name='English Caption', null=True, blank=True)),
                ('chinese_caption', models.CharField(max_length=200, verbose_name='Chinese Caption', null=True, blank=True)),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('video', embed_video.fields.EmbedYoutubeField(verbose_name='Video Youtube Embed')),
                ('story_teller', models.ForeignKey(to='adopteeStories.StoryTeller', verbose_name='Story Teller', null=True)),
            ],
            options={
                'ordering': ['created'],
                'verbose_name_plural': 'Video items',
                'verbose_name': 'Video item',
                'abstract': False,
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
            field=models.ForeignKey(to='adopteeStories.StoryTeller', verbose_name='Front Story', null=True, blank=True),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='photo_front_story',
            field=models.ForeignKey(to='adopteeStories.Photo', verbose_name='Photo Front Story', null=True, blank=True),
        ),
    ]
