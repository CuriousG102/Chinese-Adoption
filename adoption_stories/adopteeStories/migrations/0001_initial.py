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
                ('english_name', models.CharField(verbose_name='English Name', null=True, max_length=150, blank=True, db_index=True)),
                ('pinyin_name', models.CharField(verbose_name='Pinyin Name', null=True, max_length=150, blank=True, db_index=True)),
                ('chinese_name', models.CharField(verbose_name='Chinese Name', null=True, max_length=50, blank=True, db_index=True)),
                ('created_at', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated_at', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('english_caption', models.CharField(verbose_name='English Caption', null=True, blank=True, max_length=200)),
                ('chinese_caption', models.CharField(verbose_name='Chinese Caption', null=True, blank=True, max_length=200)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created_at', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated_at', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('audio_file', models.FileField(verbose_name='Audio File', upload_to='')),
            ],
            options={
                'abstract': False,
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('english_caption', models.CharField(verbose_name='English Caption', null=True, blank=True, max_length=200)),
                ('chinese_caption', models.CharField(verbose_name='Chinese Caption', null=True, blank=True, max_length=200)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
                ('created_at', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated_at', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('photo_file', models.ImageField(verbose_name='Photo File', upload_to='')),
            ],
            options={
                'abstract': False,
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='RelationshipCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('english_name', models.CharField(verbose_name='English Name', null=True, max_length=30)),
                ('chinese_name', models.CharField(verbose_name='Chinese Name', null=True, max_length=30)),
                ('approved', models.BooleanField(verbose_name='Approved', default=False)),
            ],
            options={
                'verbose_name_plural': 'Relationship categories',
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
                ('created_at', models.DateTimeField(verbose_name='Created At', auto_now_add=True)),
                ('updated_at', models.DateTimeField(verbose_name='Updated At', auto_now=True)),
                ('related_adoptee', models.ForeignKey(verbose_name='Related Adoptee', to='adopteeStories.Adoptee', related_name='stories')),
                ('relationship_to_story', models.ForeignKey(verbose_name='Relationship to Story', to='adopteeStories.RelationshipCategory')),
            ],
            options={
                'ordering': ['created_at'],
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
            field=models.ForeignKey(verbose_name='Front Story', null=True, to='adopteeStories.StoryTeller'),
        ),
        migrations.AddField(
            model_name='adoptee',
            name='photo_front_story',
            field=models.ForeignKey(verbose_name='Photo Front Story', to='adopteeStories.Photo', null=True, blank=True),
        ),
    ]
