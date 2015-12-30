from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core import validators


# Create your models here.
from embed_video.fields import EmbedYoutubeField, EmbedSoundcloudField

from .custom_model_fields import RestrictedImageField
from .default_settings import ADOPTEE_STORIES_CONFIG as config


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

    photo_front_story = RestrictedImageField(maximum_size=config['PHOTO_FRONT_STORY_MAX_SIZE'],
                                             required_width=config['PHOTO_FRONT_STORY_WIDTH'],
                                             required_height=config['PHOTO_FRONT_STORY_HEIGHT'],
                                             required_formats=config['FORMATS'],
                                             null=True, blank=True,
                                             # Translators: Name of a field in the admin page
                                             verbose_name=_('Photo Front Story'))

    # Translators: Name of a field in the admin page
    front_story = models.ForeignKey('StoryTeller', null=True, verbose_name=_('Front Story'), blank=True,
                                    limit_choices_to={'approved': True})
    # Translators: Name of a field in the admin page
    created = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    # Translators: Name of a field in the admin page
    updated = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        ordering = ['-created']
        # Translators: Name of a field in the admin page
        verbose_name = _('Adoptee')
        # Translators: Name of a field in the admin page
        verbose_name_plural = _('Adoptees')

    def __str__(self):
        to_string_stuff = [self.english_name, self.chinese_name, self.pinyin_name]
        string = []
        for field in to_string_stuff:
            if field is not None:
                string.append(field)
        string = " ".join(["Adoptee:", " ".join(string)])

        return string


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
        ordering = ['-created']

    def __str__(self):
        return " ".join([str(self.story_teller), str(self.created)])


class Audio(MultimediaItem):
    # Translators: name of field in the admin page
    audio = EmbedSoundcloudField(verbose_name=_('Audio Soundcloud Embed'))

    class Meta(MultimediaItem.Meta):
        abstract = False
        # Translators: Name of a field in the admin page
        verbose_name = _('Audio item')
        # Translators: Name of a field in the admin page
        verbose_name_plural = _('Audio items')


class Video(MultimediaItem):
    # Translators: name of field in the admin page
    video = EmbedYoutubeField(verbose_name=_('Video Youtube Embed'))

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
    english_name = models.CharField(max_length=30, null=True, verbose_name=_('English Name'),
                                    blank=True)
    # Translators: Name of a field in the admin page
    chinese_name = models.CharField(max_length=30, null=True, verbose_name=_('Chinese Name'),
                                    blank=True)

    # Translators: Name of a field in the admin page
    approved = models.BooleanField(default=False, verbose_name=_('Approved'))
    # Translators: Name of a field in the admin page
    created = models.DateTimeField(auto_now_add=True,
                                   verbose_name=_('Created At'))
    # Translators: Name of a field in the admin page
    updated = models.DateTimeField(auto_now=True,
                                   verbose_name=_('Updated At'))
    # Translators: Label for the number determining the order of the relationship category for admins
    order = models.IntegerField(null=True, blank=True, verbose_name=_('Position of relationship category'))

    class Meta:
        ordering = ['order']
        # Translators: Name of a field in the admin page
        verbose_name = _('Relationship Category')
        # Translators: Name of a field in the admin page
        verbose_name_plural = _('Relationship Categories')

    def __str__(self):
        to_string_stuff = [self.english_name, self.chinese_name]
        string = []
        for field in to_string_stuff:
            if field is not None:
                string.append(field)
        string = " ".join(["Relationship:", " ".join(string)])

        return string


class StoryTeller(models.Model):
    relationship_to_story = models.ForeignKey('RelationshipCategory',
                                              # Translators: Name of a field in the admin page
                                              verbose_name=_('Relationship to Story'))
    # One version of story text because I don't want adoptee's stories to be different between who is viewing it
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
                                    verbose_name=_('English Name'),
                                    blank=True)
    chinese_name = models.CharField(max_length=50, null=True,
                                    # Translators: Name of a field in the admin page
                                    verbose_name=_('Chinese Name'),
                                    blank=True)
    pinyin_name = models.CharField(max_length=150, null=True,
                                   # Translators: Name of a field in the admin page
                                   verbose_name=_('Pinyin Name'),
                                   blank=True)
    created = models.DateTimeField(auto_now_add=True,
                                   # Translators: Name of a field in the admin page
                                   verbose_name=_('Created At'))
    updated = models.DateTimeField(auto_now=True,
                                   # Translators: Name of a field in the admin page
                                   verbose_name=_('Updated At'))

    class Meta:
        ordering = ['-created']
        # Translators: Name of a field in the admin page
        verbose_name = _('Story Teller')
        # Translators: Name of a field in the admin page
        verbose_name_plural = _('Story Tellers')

    def __str__(self):
        to_string_stuff = [self.english_name, self.chinese_name, self.pinyin_name]
        string = []
        for field in to_string_stuff:
            if field is not None:
                string.append(field)
        string = " ".join(["Storyteller:", " ".join(string)])

        return string
