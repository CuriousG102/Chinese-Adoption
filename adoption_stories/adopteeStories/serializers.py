from adopteeStories import default_settings
from adopteeStories.models import Adoptee, Photo, StoryTeller, RelationshipCategory, Audio
from django.conf import settings
from django import forms
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers


class PhotoLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ('photo_file',)


class StoryTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryTeller
        fields = ('story_text',)


class AdopteeBasicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adoptee
        fields = ('english_name', 'pinyin_name', 'chinese_name', 'id',)


class AdopteeSearchSerializer(AdopteeBasicsSerializer):
    photo_front_story = PhotoLinkSerializer(many=False)

    class Meta(AdopteeBasicsSerializer.Meta):
        fields = AdopteeBasicsSerializer.Meta.fields + ('photo_front_story',)


class AdopteeListSerializer(AdopteeBasicsSerializer):
    photo_front_story = PhotoLinkSerializer(many=False)
    front_story = StoryTextSerializer(many=False)

    class Meta(AdopteeBasicsSerializer.Meta):
        fields = AdopteeBasicsSerializer.Meta.fields + ('photo_front_story',
                                                        'front_story',)


class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelationshipCategory
        fields = ('english_name', 'chinese_name', 'id',)


class StoryBasicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryTeller
        fields = ('story_text', 'english_name', 'chinese_name', 'pinyin_name',)


# TODO: Add media to story
class StorySerializer(StoryBasicsSerializer):
    relationship_to_story = RelationshipSerializer(many=False)

    class Meta(StoryBasicsSerializer.Meta):
        fields = StoryBasicsSerializer.Meta.fields + ('relationship_to_story',)


class StoryCreationSerializer(StoryBasicsSerializer):
    class Meta(StoryBasicsSerializer.Meta):
        fields = StoryBasicsSerializer.Meta.fields + ('relationship_to_story',
                                                      'email',
                                                      'related_adoptee',)


class AdopteeDetailSerializer(AdopteeBasicsSerializer):
    stories = serializers.SerializerMethodField('get_ordered_stories')

    def get_ordered_stories(self, instance):
        ordered_stories = StoryTeller.objects.all() \
            .filter(related_adoptee=instance.id) \
            .filter(approved=True) \
            .filter(relationship_to_story__approved=True) \
            .order_by('-updated', '-created')
        return StorySerializer(ordered_stories, many=True).data

    class Meta(AdopteeBasicsSerializer.Meta):
        fields = AdopteeBasicsSerializer.Meta.fields + ('stories',)


class RestrictedDjangoImageField(forms.ImageField):
    def to_python(self, data):
        """
        Checks that the file-upload field contains a JPEG, and nothing else.
        Uses PIL validation and also ensures that the file is above a minimum height and width
        """

        # TODO: Use getattr instead
        d_config = default_settings.ADOPTEE_STORIES_CONFIG
        min_width, min_height, formats, max_size = d_config['MIN_WIDTH'], d_config['MIN_HEIGHT'], d_config['FORMATS'], \
                                                   d_config['IMAGE_MAX_SIZE']

        if settings.ADOPTEE_STORIES_CONFIG:
            min_width = settings.ADOPTEE_STORIES_CONFIG['MIN_WIDTH'] or min_width
            min_height = settings.ADOPTEE_STORIES_CONFIG['MIN_HEIGHT'] or min_height
            formats = settings.ADOPTEE_STORIES_CONFIG['FORMATS'] or formats
            max_size = settings.ADOPTEE_STORIES_CONFIG['IMAGE_MAX_SIZE'] or max_size

        # While a lot of validation will only be carried out in-depth on the backend,
        # due to the difficulty of writing it, this size validation will be on the
        # frontend as well. This is because allowing somebody to upload a
        # large file just to get it kicked back would be a huge UX degradation
        # and also a bandwidth hog. This size validation will be accompanied by nginx
        # giving users who try to upload a truly massive file a much ruder experience
        # (dropped connection) to prevent huge server load on our end
        if data.size > max_size:
            # Translators: Error message for people who try to bypass image upload restrictions
            raise serializers.ValidationError(detail=_('Image is too large'))

        file = super(RestrictedDjangoImageField, self).to_python(data)

        width, height = file.image.size

        if width < min_width or height < min_height:
            # Translators: Error message when image is too small
            raise serializers.ValidationError(detail=_('Image does not meet '
                                                       'minimum width and height'
                                                       ' requirements'))
        format = file.image.format

        if format not in formats:
            # Translators: Error message when image is not one of the allowed formats
            raise serializers.ValidationError(detail=_('Image does not meet '
                                                       'formatting requirements'))

        return file


class RestrictedImageField(serializers.ImageField):
    def __init__(self, *args, **kwargs):
        super(RestrictedImageField, self).__init__(*args, **kwargs)
        self._DjangoImageField = RestrictedDjangoImageField


class PhotoFileSerializer(serializers.Serializer):
    photo_file = RestrictedImageField()

    def create(self, validated_data):
        return Photo.objects.create(**validated_data)


class AudioField(serializers.FileField):
    # TODO: Validate that our audio file is indeed a supported audio file, and is below a certain file size
    pass


class AudioFileSerializer(serializers.Serializer):
    audio_file = AudioField()

    def create(self, validated_data):
        return Audio.objects.create(**validated_data)


MULTIMEDIA_FIELDS = ('english_caption', 'chinese_caption', 'story_teller',)


class PhotoInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = MULTIMEDIA_FIELDS


class AudioInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = MULTIMEDIA_FIELDS
