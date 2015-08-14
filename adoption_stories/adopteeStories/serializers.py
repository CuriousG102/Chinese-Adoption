from adopteeStories.models import Adoptee, Photo, StoryTeller, RelationshipCategory, Audio
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


class RestrictedImageField(serializers.ImageField):
    # TODO: This will contain file size and image perspective ratio validation
    pass


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
