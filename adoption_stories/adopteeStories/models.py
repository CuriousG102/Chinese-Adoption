from django.db import models
from django.utils.translation import ugettext_lazy as _


# Create your models here.
from embed_video import backends
from embed_video.fields import EmbedBackendFormField


class Adoptee(models.Model):
    # english_name must have a value || (pinyin_name && chinese_name)
    # must have a value implemented form level
    english_name = models.CharField(max_length=150, null=True, blank=True,
                                    # Translators: Name of a field in the admin page
                                    db_index=True, verbose_name=_('English Name'))
    pinyin_name = models.CharField(max_length=150, null=True, blank=True,
                                   # Translators: Name of a field in the admin page
                                   db_index=True, verbose_name=_('Pinyin Name'))
    chinese_name = models.CharField(max_length=50, null=True, blank=True,
                                    # Translators: Name of a field in the admin page
                                    db_index=True, verbose_name=_('Chinese Name'))

    # TODO: photo_front_story is restricted to photos tied to a story teller tied to the current adoptee in custom form logic
    # TODO: Layers of prevention around admin selecting non-approved content for front_story
    photo_front_story = models.ForeignKey('Photo', null=True, blank=True,
                                          # Translators: Name of a field in the admin page
                                          verbose_name=_('Photo Front Story'))

    # TODO: front_story is restricted to story tellers tied to the current adoptee in custom form logic
    # Translators: Name of a field in the admin page
    front_story = models.ForeignKey('StoryTeller', null=True, verbose_name=_('Front Story'))
    # Translators: Name of a field in the admin page
    created = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    # Translators: Name of a field in the admin page
    updated = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        # TODO: Change to descending order
        ordering = ['created']
        # Translators: Name of a field in the admin page
        verbose_name = _('Adoptee')
        # Translators: Name of a field in the admin page
        verbose_name_plural = _('Adoptees')


class MultimediaItem(models.Model):
    # english_caption || chinese_caption must have a value implemented
    # form level
    english_caption = models.CharField(max_length=200, null=True, blank=True,
                                       # Translators: Name of a field in the admin page
                                       verbose_name=_('English Caption'))
    chinese_caption = models.CharField(max_length=200, null=True, blank=True,
                                       # Translators: Name of a field in the admin page
                                       verbose_name=_('Chinese Caption'))

    # Translators: Name of a field in the admin page
    approved = models.BooleanField(default=False, verbose_name=_('Approved'))
    # Translators: Name of a field in the admin page
    story_teller = models.ForeignKey('StoryTeller', null=True, verbose_name=_('Story Teller'))

    # Translators: Name of a field in the admin pages
    created = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    # Translators: Name of a field in the admin page
    updated = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        abstract = True
        # TODO: Change to descending order
        ordering = ['created']


class Audio(MultimediaItem):
    audio = EmbedBackendFormField(backend_class=backends.SoundCloudBackend)

    class Meta(MultimediaItem.Meta):
        abstract = False
        # Translators: Name of a field in the admin page
        verbose_name = _('Audio item')
        # Translators: Name of a field in the admin page
        verbose_name_plural = _('Audio items')


class Video(MultimediaItem):
    video = EmbedBackendFormField(backend_class=backends.YoutubeBackend)

    class Meta(MultimediaItem.Meta):
        abstract = False
        # Translators: Name of a field in the admin page
        verbose_name = _('Video item')
        # Translators: Name of a field in the admin page
        verbose_name_plural = _('Video items')

class Photo(MultimediaItem):
    # file size and type checking added on form level

    # Translators: Name of a field in the admin page
    photo_file = models.ImageField(verbose_name=_('Photo File'))

    class Meta(MultimediaItem.Meta):
        abstract = False
        # Translators: Name of a field in the admin page
        verbose_name = _('Photo')
        # Translators: Name of a field in the admin page
        verbose_name_plural = _('Photos')

class RelationshipCategory(models.Model):
    # english_name must have a value || chinese name must have a value at first
    # but to publish both must have a value or all stories with an untranslated
    # category must only show up english side/chinese side
    # Translators: Name of a field in the admin page
    english_name = models.CharField(max_length=30, null=True, verbose_name=_('English Name'))
    # Translators: Name of a field in the admin page
    chinese_name = models.CharField(max_length=30, null=True, verbose_name=_('Chinese Name'))

    # Translators: Name of a field in the admin page
    approved = models.BooleanField(default=False, verbose_name=_('Approved'))
    # Translators: Name of a field in the admin page
    created = models.DateTimeField(auto_now_add=True,
                                   verbose_name=_('Created At'))
    # Translators: Name of a field in the admin page
    updated = models.DateTimeField(auto_now=True,
                                   verbose_name=_('Updated At'))

    class Meta:
        # Translators: Name of a field in the admin page
        verbose_name = _('Relationship Category')
        # Translators: Name of a field in the admin page
        verbose_name_plural = _('Relationship Categories')


class StoryTeller(models.Model):
    category_is_approved = {'approved': True}
    relationship_to_story = models.ForeignKey('RelationshipCategory',
                                              limit_choices_to=category_is_approved,
                                              # Translators: Name of a field in the admin page
                                              verbose_name=_('Relationship to Story'))
    # Translators: Name of a field in the admin page
    story_text = models.TextField(verbose_name=_('Story Text'))
    # Translators: Name of a field in the admin page
    email = models.EmailField(verbose_name=_('Email'))
    # Translators: Name of a field in the admin page
    approved = models.BooleanField(default=False, verbose_name=_('Approved'))
    related_adoptee = models.ForeignKey('Adoptee', related_name='stories',
                                        # Translators: Name of a field in the admin page
                                        verbose_name=_('Related Adoptee'))

    # english_name must have a value || (pinyin_name && chinese_name)
    # must have a value implemented form level
    english_name = models.CharField(max_length=150, null=True,
                                    # Translators: Name of a field in the admin page
                                    verbose_name=_('English Name'))
    chinese_name = models.CharField(max_length=50, null=True,
                                    # Translators: Name of a field in the admin page
                                    verbose_name=_('Chinese Name'))
    pinyin_name = models.CharField(max_length=150, null=True,
                                   # Translators: Name of a field in the admin page
                                   verbose_name=_('Pinyin Name'))
    created = models.DateTimeField(auto_now_add=True,
                                   # Translators: Name of a field in the admin page
                                   verbose_name=_('Created At'))
    updated = models.DateTimeField(auto_now=True,
                                   # Translators: Name of a field in the admin page
                                   verbose_name=_('Updated At'))

    class Meta:
        # TODO: Change to descending order
        ordering = ['created']
        # Translators: Name of a field in the admin page
        verbose_name = _('Story Teller')
        # Translators: Name of a field in the admin page
        verbose_name_plural = _('Story Tellers')
