# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import adopteeStories.custom_model_fields
import embed_video.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AboutPerson',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('photo', adopteeStories.custom_model_fields.RestrictedImageField(upload_to='', verbose_name='Picture of person on about page')),
                ('english_caption', models.CharField(null=True, verbose_name='English Caption', max_length=200, blank=True)),
                ('chinese_caption', models.CharField(null=True, verbose_name='Chinese Caption', max_length=200, blank=True)),
                ('about_text', models.TextField(verbose_name='About text for that person.', help_text='Should include paragraph markup:e.g. <p>This is a paragraph</p><p>This is a different paragraph</p>')),
                ('published', models.BooleanField(verbose_name='Published status')),
            ],
        ),
        migrations.CreateModel(
            name='Adoptee',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('english_name', models.CharField(null=True, verbose_name='English Name', max_length=150, blank=True, db_index=True)),
                ('pinyin_name', models.CharField(null=True, verbose_name='Pinyin Name', max_length=150, blank=True, db_index=True)),
                ('chinese_name', models.CharField(null=True, verbose_name='Chinese Name', max_length=50, blank=True, db_index=True)),
                ('photo_front_story', adopteeStories.custom_model_fields.RestrictedImageField(null=True, upload_to='', verbose_name='Photo Front Story', blank=True)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Adoptees',
                'ordering': ['-created'],
                'verbose_name': 'Adoptee',
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('english_caption', models.CharField(null=True, verbose_name='English Caption', max_length=200, blank=True)),
                ('chinese_caption', models.CharField(null=True, verbose_name='Chinese Caption', max_length=200, blank=True)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('audio', embed_video.fields.EmbedSoundcloudField(verbose_name='Audio Soundcloud Embed')),
            ],
            options={
                'verbose_name_plural': 'Audio items',
                'ordering': ['-created'],
                'verbose_name': 'Audio item',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('english_caption', models.CharField(null=True, verbose_name='English Caption', max_length=200, blank=True)),
                ('chinese_caption', models.CharField(null=True, verbose_name='Chinese Caption', max_length=200, blank=True)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('photo_file', models.ImageField(upload_to='', verbose_name='Photo File')),
            ],
            options={
                'verbose_name_plural': 'Photos',
                'ordering': ['-created'],
                'verbose_name': 'Photo',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('english_name', models.CharField(null=True, verbose_name='English Name', max_length=30, blank=True)),
                ('chinese_name', models.CharField(null=True, verbose_name='Chinese Name', max_length=30, blank=True)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('order', models.IntegerField(null=True, verbose_name='Position of relationship category', blank=True)),
            ],
            options={
                'verbose_name_plural': 'Relationship Categories',
                'ordering': ['order'],
                'verbose_name': 'Relationship Category',
            },
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('story_text', models.TextField(verbose_name='Story Text')),
                ('email', models.EmailField(verbose_name='Email', max_length=254)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('english_name', models.CharField(null=True, verbose_name='English Name', max_length=150, blank=True)),
                ('chinese_name', models.CharField(null=True, verbose_name='Chinese Name', max_length=50, blank=True)),
                ('pinyin_name', models.CharField(null=True, verbose_name='Pinyin Name', max_length=150, blank=True)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('related_adoptee', models.ForeignKey(verbose_name='Related Adoptee', to='adopteeStories.Adoptee', related_name='stories')),
                ('relationship_to_story', models.ForeignKey(verbose_name='Relationship to Story', to='adopteeStories.RelationshipCategory')),
            ],
            options={
                'verbose_name_plural': 'Story Tellers',
                'ordering': ['-created'],
                'verbose_name': 'Story Teller',
            },
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('english_caption', models.CharField(null=True, verbose_name='English Caption', max_length=200, blank=True)),
                ('chinese_caption', models.CharField(null=True, verbose_name='Chinese Caption', max_length=200, blank=True)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('video', embed_video.fields.EmbedYoutubeField(verbose_name='Video Youtube Embed')),
                ('story_teller', models.ForeignKey(verbose_name='Story Teller', null=True, to='adopteeStories.StoryTeller')),
            ],
            options={
                'verbose_name_plural': 'Video items',
                'ordering': ['-created'],
                'verbose_name': 'Video item',
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
            field=models.ForeignKey(verbose_name='Front Story', blank=True, null=True, to='adopteeStories.StoryTeller'),
        ),
    ]
