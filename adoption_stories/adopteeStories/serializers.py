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
    front_photo_link = PhotoLinkSerializer(many=False)


class AdopteeListSerializer(AdopteeBasicsSerializer):
    front_photo_link = PhotoLinkSerializer(many=False)
    front_story_text = StoryTextSerializer(many=False)


class RelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelationshipCategory
        fields = ('english_name', 'chinese_name', 'id')


class StoryBasicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryTeller
        fields = ('story_text', 'english_name', 'chinese_name', 'pinyin_name',)

class StorySerializer(StoryBasicsSerializer):
    relationship_to_story = RelationshipSerializer(many=False)


class StoryCreationSerializer(StoryBasicsSerializer):
    class Meta(StoryBasicsSerializer.Meta):
        fields = StoryBasicsSerializer.Meta.fields + ('relationship_to_story',
                                                      'email',
                                                      'related_adoptee',)


class AdopteeDetailSerializer(AdopteeBasicsSerializer):
    stories = serializers.SerializerMethodField('get_ordered_stories')

    def get_ordered_stories(self, instance):
        ordered_stories = StoryTeller.filter(related_adoptee=instance.id)\
                                     .order_by('updated_at')
        return StorySerializer(ordered_stories, many=True)


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
