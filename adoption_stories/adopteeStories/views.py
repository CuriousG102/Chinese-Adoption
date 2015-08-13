# TODO: Clean up imports list and make it PEP8 compliant
from adopteeStories.models import Adoptee, RelationshipCategory, Photo, Audio
from adopteeStories import serializers
from django.db.models import Q

# Create your views here.
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from rest_framework import mixins


# TODO: Address code debt around these filters

# -- Basic SQL required for selecting distinct adoptees who have an approved storyteller --
# SELECT DISTINCT ID
# FROM ADOPTEE
# INNER JOIN STORYTELLER
# ON ADOPTEE.ID = STORYTELLER.RELATED_ADOPTEE
# WHERE STORYTELLER.APPROVED = 1

ADOPTEE_FILTERS_Q_OBJECTS = [Q(stories__approved=True)]
ADOPTEE_FILTER = Q()

for q_object in ADOPTEE_FILTERS_Q_OBJECTS:
    ADOPTEE_FILTER &= q_object

CATEGORY_FILTERS_Q_OBJECTS = [Q(approved=True)]
CATEGORY_FILTER = Q()

for q_object in CATEGORY_FILTERS_Q_OBJECTS:
    CATEGORY_FILTER &= q_object

UPDATE_FILTER = Q(approved=False)


class AdopteeSearch(generics.ListAPIView):
    serializer_class = serializers.AdopteeSearchSerializer
    FIELDS_TO_SEARCH_ON = ['english_name', 'pinyin_name', 'chinese_name']
    FILTER_FOR_FIELDS = '__istartswith'

    def get_queryset(self):
        try:
            userSearch = self.request.query_params['q']
        except KeyError:
            raise ValidationError('Need a query parameter')
        query = Q()

        for field in self.FIELDS_TO_SEARCH_ON:
            query |= Q(**{field + self.FILTER_FOR_FIELDS: userSearch})

        return Adoptee.objects.get(query & ADOPTEE_FILTER)


class AdopteeList(generics.ListAPIView):
    queryset = Adoptee.objects.get(ADOPTEE_FILTER)
    serializer_class = serializers.AdopteeListSerializer


class AdopteeDetail(generics.RetrieveAPIView):
    queryset = Adoptee.objects.get(ADOPTEE_FILTER)
    serializer_class = serializers.AdopteeDetailSerializer


class GenericCreate(generics.GenericAPIView, mixins.CreateModelMixin):
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_model_instance = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response({'pk': new_model_instance.id}, status=status.HTTP_201_CREATED, headers=headers)


# TODO: Enforce adoptee having a name
class AdopteeCreate(GenericCreate):
    serializer_class = serializers.AdopteeBasicsSerializer


# TODO: Enforce storyteller having a name
class StoryTellerCreate(GenericCreate):
    serializer_class = serializers.StoryCreationSerializer


class CategoryListAndCreate(GenericCreate, mixins.ListModelMixin):
    serializer_class = serializers.RelationshipSerializer
    queryset = RelationshipCategory.objects.get(CATEGORY_FILTER)


class GenericUpload(GenericCreate):
    parser_classes = (MultiPartParser,)


class PhotoFileCreate(GenericUpload):
    serializer_class = serializers.PhotoFileSerializer


class AudioFileCreate(GenericUpload):
    serializer_class = serializers.AudioFileSerializer


# TODO: Put in stopgap security measure where you can't update a multimedia item that has been approved (preventing live site from being modified by malicious actor)
class GenericMediaUpdate(generics.GenericAPIView, mixins.UpdateModelMixin):
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class PhotoUpdate(GenericMediaUpdate):
    queryset = Photo.objects.get(UPDATE_FILTER)
    serializer_class = serializers.PhotoInfoSerializer


class AudioUpdate(GenericMediaUpdate):
    queryset = Audio.objects.get(UPDATE_FILTER)
    serializer_class = serializers.AudioInfoSerializer
