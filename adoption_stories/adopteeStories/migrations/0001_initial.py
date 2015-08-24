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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('english_name', models.CharField(verbose_name='English Name', blank=True, db_index=True, max_length=150, null=True)),
                ('pinyin_name', models.CharField(verbose_name='Pinyin Name', blank=True, db_index=True, max_length=150, null=True)),
                ('chinese_name', models.CharField(verbose_name='Chinese Name', blank=True, db_index=True, max_length=50, null=True)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
            ],
            options={
                'verbose_name': 'Adoptee',
                'verbose_name_plural': 'Adoptees',
                'ordering': ['-created'],
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('english_caption', models.CharField(verbose_name='English Caption', blank=True, max_length=200, null=True)),
                ('chinese_caption', models.CharField(verbose_name='Chinese Caption', blank=True, max_length=200, null=True)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('audio', embed_video.fields.EmbedSoundcloudField(verbose_name='Audio Soundcloud Embed')),
            ],
            options={
                'verbose_name': 'Audio item',
                'verbose_name_plural': 'Audio items',
                'ordering': ['-created'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('english_caption', models.CharField(verbose_name='English Caption', blank=True, max_length=200, null=True)),
                ('chinese_caption', models.CharField(verbose_name='Chinese Caption', blank=True, max_length=200, null=True)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('photo_file', models.ImageField(verbose_name='Photo File', upload_to='')),
            ],
            options={
                'verbose_name': 'Photo',
                'verbose_name_plural': 'Photos',
                'ordering': ['-created'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('english_name', models.CharField(verbose_name='English Name', blank=True, max_length=30, null=True)),
                ('chinese_name', models.CharField(verbose_name='Chinese Name', blank=True, max_length=30, null=True)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('order', models.IntegerField(verbose_name='Position of relationship category', blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Relationship Category',
                'verbose_name_plural': 'Relationship Categories',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('story_text', models.TextField(verbose_name='Story Text')),
                ('email', models.EmailField(verbose_name='Email', max_length=254)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('english_name', models.CharField(verbose_name='English Name', blank=True, max_length=150, null=True)),
                ('chinese_name', models.CharField(verbose_name='Chinese Name', blank=True, max_length=50, null=True)),
                ('pinyin_name', models.CharField(verbose_name='Pinyin Name', blank=True, max_length=150, null=True)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('related_adoptee', models.ForeignKey(verbose_name='Related Adoptee', to='adopteeStories.Adoptee', related_name='stories')),
                ('relationship_to_story', models.ForeignKey(verbose_name='Relationship to Story', to='adopteeStories.RelationshipCategory')),
            ],
            options={
                'verbose_name': 'Story Teller',
                'verbose_name_plural': 'Story Tellers',
                'ordering': ['-created'],
            },
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('english_caption', models.CharField(verbose_name='English Caption', blank=True, max_length=200, null=True)),
                ('chinese_caption', models.CharField(verbose_name='Chinese Caption', blank=True, max_length=200, null=True)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('video', embed_video.fields.EmbedYoutubeField(verbose_name='Video Youtube Embed')),
                ('story_teller', models.ForeignKey(verbose_name='Story Teller', null=True, to='adopteeStories.StoryTeller')),
            ],
            options={
                'verbose_name': 'Video item',
                'verbose_name_plural': 'Video items',
                'ordering': ['-created'],
                'abstract': False,
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
            field=models.ForeignKey(verbose_name='Front Story', null=True, to='adopteeStories.StoryTeller', blank=True),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='photo_front_story',
            field=models.ForeignKey(verbose_name='Photo Front Story', null=True, to='adopteeStories.Photo', blank=True),
        ),
    ]
