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
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('english_name', models.CharField(db_index=True, blank=True, max_length=150, null=True, verbose_name='English Name')),
                ('pinyin_name', models.CharField(db_index=True, blank=True, max_length=150, null=True, verbose_name='Pinyin Name')),
                ('chinese_name', models.CharField(db_index=True, blank=True, max_length=50, null=True, verbose_name='Chinese Name')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
            ],
            options={
                'verbose_name': 'Adoptee',
                'ordering': ['created'],
                'verbose_name_plural': 'Adoptees',
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('english_caption', models.CharField(blank=True, max_length=200, null=True, verbose_name='English Caption')),
                ('chinese_caption', models.CharField(blank=True, max_length=200, null=True, verbose_name='Chinese Caption')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
                ('audio', embed_video.fields.EmbedSoundcloudField(verbose_name='Audio Soundcloud Embed')),
            ],
            options={
                'verbose_name': 'Audio item',
                'verbose_name_plural': 'Audio items',
                'ordering': ['created'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('english_caption', models.CharField(blank=True, max_length=200, null=True, verbose_name='English Caption')),
                ('chinese_caption', models.CharField(blank=True, max_length=200, null=True, verbose_name='Chinese Caption')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
                ('photo_file', models.ImageField(upload_to='', verbose_name='Photo File')),
            ],
            options={
                'verbose_name': 'Photo',
                'verbose_name_plural': 'Photos',
                'ordering': ['created'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('english_name', models.CharField(blank=True, max_length=30, null=True, verbose_name='English Name')),
                ('chinese_name', models.CharField(blank=True, max_length=30, null=True, verbose_name='Chinese Name')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
            ],
            options={
                'verbose_name': 'Relationship Category',
                'verbose_name_plural': 'Relationship Categories',
            },
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('story_text', models.TextField(verbose_name='Story Text')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('english_name', models.CharField(blank=True, max_length=150, null=True, verbose_name='English Name')),
                ('chinese_name', models.CharField(blank=True, max_length=50, null=True, verbose_name='Chinese Name')),
                ('pinyin_name', models.CharField(blank=True, max_length=150, null=True, verbose_name='Pinyin Name')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
                ('related_adoptee', models.ForeignKey(verbose_name='Related Adoptee', related_name='stories', to='adopteeStories.Adoptee')),
                ('relationship_to_story', models.ForeignKey(to='adopteeStories.RelationshipCategory', verbose_name='Relationship to Story')),
            ],
            options={
                'verbose_name': 'Story Teller',
                'ordering': ['created'],
                'verbose_name_plural': 'Story Tellers',
            },
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, serialize=False, verbose_name='ID')),
                ('english_caption', models.CharField(blank=True, max_length=200, null=True, verbose_name='English Caption')),
                ('chinese_caption', models.CharField(blank=True, max_length=200, null=True, verbose_name='Chinese Caption')),
                ('approved', models.BooleanField(default=False, verbose_name='Approved')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
                ('video', embed_video.fields.EmbedYoutubeField(verbose_name='Video Youtube Embed')),
                ('story_teller', models.ForeignKey(null=True, verbose_name='Story Teller', to='adopteeStories.StoryTeller')),
            ],
            options={
                'verbose_name': 'Video item',
                'verbose_name_plural': 'Video items',
                'ordering': ['created'],
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='photo',
            name='story_teller',
            field=models.ForeignKey(null=True, verbose_name='Story Teller', to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='audio',
            name='story_teller',
            field=models.ForeignKey(null=True, verbose_name='Story Teller', to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='front_story',
            field=models.ForeignKey(blank=True, null=True, verbose_name='Front Story', to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='photo_front_story',
            field=models.ForeignKey(blank=True, null=True, verbose_name='Photo Front Story', to='adopteeStories.Photo'),
        ),
    ]
