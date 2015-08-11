from django.db import models

# Create your models here.


class Adoptee(models.Model):
    # english_name must have a value || (pinyin_name && chinese_name)
    # must have a value implemented form level
    english_name = models.CharField(max_length=150, null=True, blank=True)
    pinyin_name = models.CharField(max_length=150, null=True, blank=True)
    chinese_name = models.CharField(max_length=50, null=True, blank=True)

    # photo_front_story is restricted to photos tied to a story teller tied
    # to the current adoptee in custom form logic
    photo_front_story = models.ForeignKey('Photo', null=True, blank=True)

    # front_story is restricted to story tellers tied
    # to the current adoptee in custom form logic
    front_story = models.ForeignKey('StoryTeller', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class MultimediaItem(models.Model):
    # english_caption || chinese_caption must have a value implemented
    # form level
    english_caption = models.CharField(max_length=200, null=True, blank=True)
    chinese_caption = models.CharField(max_length=200, null=True, blank=True)

    approved = models.BooleanField(default=False)
    story_teller = models.ForeignKey('StoryTeller', null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Photo(MultimediaItem):
    # file size and type checking added on form level
    photo_file = models.ImageField()


class Audio(MultimediaItem):
    # file size and type checking added on form level
    audio_file = models.FileField()


class RelationshipCategory(models.Model):
    # english_name must have a value || chinese name must have a value at first
    # but to publish both must have a value or all stories with an untranslated
    # category must only show up english side/chinese side
    english_name = models.CharField(max_length=30, null=True)
    chinese_name = models.CharField(max_length=30, null=True)

    approved = models.BooleanField(default=False)


# TODO: Support for media
class StoryTeller(models.Model):
    category_is_approved = {'approved': True}
    relationship_to_story = models.ForeignKey('RelationshipCategory',
                                              limit_choices_to=category_is_approved)
    story_text = models.TextField()
    email = models.EmailField()
    approved = models.BooleanField(default=False)
    related_adoptee = models.ForeignKey('Adoptee', related_name='stories')

    # english_name must have a value || (pinyin_name && chinese_name)
    # must have a value implemented form level
    english_name = models.CharField(max_length=150, null=True)
    chinese_name = models.CharField(max_length=50, null=True)
    pinyin_name = models.CharField(max_length=150, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)