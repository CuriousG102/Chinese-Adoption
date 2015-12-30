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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('english_name', models.CharField(blank=True, null=True, db_index=True, verbose_name='English Name', max_length=150)),
                ('pinyin_name', models.CharField(blank=True, null=True, db_index=True, verbose_name='Pinyin Name', max_length=150)),
                ('chinese_name', models.CharField(blank=True, null=True, db_index=True, verbose_name='Chinese Name', max_length=50)),
                ('photo_front_story', adopteeStories.custom_model_fields.RestrictedImageField(blank=True, null=True, verbose_name='Photo Front Story', upload_to='')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
            ],
            options={
                'verbose_name': 'Adoptee',
                'ordering': ['-created'],
                'verbose_name_plural': 'Adoptees',
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('english_caption', models.CharField(blank=True, null=True, verbose_name='English Caption', max_length=200)),
                ('chinese_caption', models.CharField(blank=True, null=True, verbose_name='Chinese Caption', max_length=200)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('audio', embed_video.fields.EmbedSoundcloudField(verbose_name='Audio Soundcloud Embed')),
            ],
            options={
                'verbose_name': 'Audio item',
                'abstract': False,
                'ordering': ['-created'],
                'verbose_name_plural': 'Audio items',
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('english_caption', models.CharField(blank=True, null=True, verbose_name='English Caption', max_length=200)),
                ('chinese_caption', models.CharField(blank=True, null=True, verbose_name='Chinese Caption', max_length=200)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('photo_file', models.ImageField(verbose_name='Photo File', upload_to='')),
            ],
            options={
                'verbose_name': 'Photo',
                'abstract': False,
                'ordering': ['-created'],
                'verbose_name_plural': 'Photos',
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('english_name', models.CharField(blank=True, null=True, verbose_name='English Name', max_length=30)),
                ('chinese_name', models.CharField(blank=True, null=True, verbose_name='Chinese Name', max_length=30)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('order', models.IntegerField(blank=True, null=True, verbose_name='Position of relationship category')),
            ],
            options={
                'verbose_name': 'Relationship Category',
                'ordering': ['order'],
                'verbose_name_plural': 'Relationship Categories',
            },
        ),
        migrations.CreateModel(
            name='StoryTeller',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('story_text', models.TextField(verbose_name='Story Text')),
                ('email', models.EmailField(verbose_name='Email', max_length=254)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('english_name', models.CharField(blank=True, null=True, verbose_name='English Name', max_length=150)),
                ('chinese_name', models.CharField(blank=True, null=True, verbose_name='Chinese Name', max_length=50)),
                ('pinyin_name', models.CharField(blank=True, null=True, verbose_name='Pinyin Name', max_length=150)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('related_adoptee', models.ForeignKey(verbose_name='Related Adoptee', related_name='stories', to='adopteeStories.Adoptee')),
                ('relationship_to_story', models.ForeignKey(verbose_name='Relationship to Story', to='adopteeStories.RelationshipCategory')),
            ],
            options={
                'verbose_name': 'Story Teller',
                'ordering': ['-created'],
                'verbose_name_plural': 'Story Tellers',
            },
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('english_caption', models.CharField(blank=True, null=True, verbose_name='English Caption', max_length=200)),
                ('chinese_caption', models.CharField(blank=True, null=True, verbose_name='Chinese Caption', max_length=200)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('video', embed_video.fields.EmbedYoutubeField(verbose_name='Video Youtube Embed')),
                ('story_teller', models.ForeignKey(verbose_name='Story Teller', null=True, to='adopteeStories.StoryTeller')),
            ],
            options={
                'verbose_name': 'Video item',
                'abstract': False,
                'ordering': ['-created'],
                'verbose_name_plural': 'Video items',
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
