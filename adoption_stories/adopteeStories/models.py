from django.db import models
from django.utils.translation import ugettext_lazy as _

# Create your models here.


class Adoptee(models.Model):
    # english_name must have a value || (pinyin_name && chinese_name)
    # must have a value implemented form level
    english_name = models.CharField(max_length=150, null=True, blank=True,
                                    db_index=True, verbose_name=_('English Name'))
    pinyin_name = models.CharField(max_length=150, null=True, blank=True,
                                   db_index=True, verbose_name=_('Pinyin Name'))
    chinese_name = models.CharField(max_length=50, null=True, blank=True,
                                    db_index=True, verbose_name=_('Chinese Name'))

    # TODO: photo_front_story is restricted to photos tied to a story teller tied to the current adoptee in custom form logic
    photo_front_story = models.ForeignKey('Photo', null=True, blank=True,
                                          verbose_name=_('Photo Front Story'))

    # TODO: front_story is restricted to story tellers tied to the current adoptee in custom form logic
    front_story = models.ForeignKey('StoryTeller', null=True, verbose_name=_('Front Story'))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        ordering = ['created']
        verbose_name = _('Adoptee')
        verbose_name_plural = _('Adoptees')



class MultimediaItem(models.Model):
    # english_caption || chinese_caption must have a value implemented
    # form level
    english_caption = models.CharField(max_length=200, null=True, blank=True,
                                       verbose_name=_('English Caption'))
    chinese_caption = models.CharField(max_length=200, null=True, blank=True,
                                       verbose_name=_('Chinese Caption'))

    approved = models.BooleanField(default=False, verbose_name=_('Approved'))
    story_teller = models.ForeignKey('StoryTeller', null=True, verbose_name=_('Story Teller'))

    created = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        abstract = True
        ordering = ['created']


class Photo(MultimediaItem):
    # file size and type checking added on form level
    photo_file = models.ImageField(verbose_name=_('Photo File'))

    class Meta(MultimediaItem.Meta):
        abstract = False
        verbose_name = _('Photo')
        verbose_name_plural = _('Photos')


class Audio(MultimediaItem):
    # file size and type checking added on form level
    audio_file = models.FileField(verbose_name=_('Audio File'))

    class Meta(MultimediaItem.Meta):
        abstract = False
        verbose_name = _('Audio Recording')
        verbose_name_plural = _('Audio Recordings')


class RelationshipCategory(models.Model):
    # english_name must have a value || chinese name must have a value at first
    # but to publish both must have a value or all stories with an untranslated
    # category must only show up english side/chinese side
    english_name = models.CharField(max_length=30, null=True, verbose_name=_('English Name'))
    chinese_name = models.CharField(max_length=30, null=True, verbose_name=_('Chinese Name'))

    approved = models.BooleanField(default=False, verbose_name=_('Approved'))

    class Meta:
        verbose_name = _('Relationship Category')
        verbose_name_plural = _('Relationship Categories')

class StoryTeller(models.Model):
    category_is_approved = {'approved': True}
    relationship_to_story = models.ForeignKey('RelationshipCategory',
                                              limit_choices_to=category_is_approved,
                                              verbose_name=_('Relationship to Story'))
    story_text = models.TextField(verbose_name=_('Story Text'))
    email = models.EmailField(verbose_name=_('Email'))
    approved = models.BooleanField(default=False, verbose_name=_('Approved'))
    related_adoptee = models.ForeignKey('Adoptee', related_name='stories',
                                        verbose_name=_('Related Adoptee'))

    # english_name must have a value || (pinyin_name && chinese_name)
    # must have a value implemented form level
    english_name = models.CharField(max_length=150, null=True,
                                    verbose_name=_('English Name'))
    chinese_name = models.CharField(max_length=50, null=True,
                                    verbose_name=_('Chinese Name'))
    pinyin_name = models.CharField(max_length=150, null=True,
                                   verbose_name=_('Pinyin Name'))
    created = models.DateTimeField(auto_now_add=True,
                                      verbose_name=_('Created At'))
    updated = models.DateTimeField(auto_now=True,
                                      verbose_name=_('Updated At'))

    class Meta:
        ordering = ['created']
        verbose_name = _('Story Teller')
        verbose_name_plural = _('Story Tellers')
