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
                ('english_name', models.CharField(db_index=True, blank=True, null=True, verbose_name='English Name', max_length=150)),
                ('pinyin_name', models.CharField(db_index=True, blank=True, null=True, verbose_name='Pinyin Name', max_length=150)),
                ('chinese_name', models.CharField(db_index=True, blank=True, null=True, verbose_name='Chinese Name', max_length=50)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
            ],
            options={
                'verbose_name': 'Adoptee',
                'verbose_name_plural': 'Adoptees',
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('english_caption', models.CharField(verbose_name='English Caption', blank=True, null=True, max_length=200)),
                ('chinese_caption', models.CharField(verbose_name='Chinese Caption', blank=True, null=True, max_length=200)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('audio_file', models.FileField(verbose_name='Audio File', upload_to='')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'Audio Recording',
                'verbose_name_plural': 'Audio Recordings',
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('english_caption', models.CharField(verbose_name='English Caption', blank=True, null=True, max_length=200)),
                ('chinese_caption', models.CharField(verbose_name='Chinese Caption', blank=True, null=True, max_length=200)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('photo_file', models.ImageField(verbose_name='Photo File', upload_to='')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'Photo',
                'verbose_name_plural': 'Photos',
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('english_name', models.CharField(verbose_name='English Name', null=True, max_length=30)),
                ('chinese_name', models.CharField(verbose_name='Chinese Name', null=True, max_length=30)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('story_text', models.TextField(verbose_name='Story Text')),
                ('email', models.EmailField(verbose_name='Email', max_length=254)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('english_name', models.CharField(verbose_name='English Name', null=True, max_length=150)),
                ('chinese_name', models.CharField(verbose_name='Chinese Name', null=True, max_length=50)),
                ('pinyin_name', models.CharField(verbose_name='Pinyin Name', null=True, max_length=150)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('related_adoptee', models.ForeignKey(verbose_name='Related Adoptee', to='adopteeStories.Adoptee', related_name='stories')),
                ('relationship_to_story', models.ForeignKey(to='adopteeStories.RelationshipCategory', verbose_name='Relationship to Story')),
            ],
            options={
                'verbose_name': 'Story Teller',
                'verbose_name_plural': 'Story Tellers',
                'ordering': ['created'],
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
            field=models.ForeignKey(verbose_name='Photo Front Story', blank=True, to='adopteeStories.Photo', null=True),
        ),
    ]
