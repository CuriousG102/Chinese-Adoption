# TODO: Clean up imports list and make it PEP8 compliant
from adopteeStories.models import Adoptee, RelationshipCategory
from adopteeStories import serializers
from django.db.models import Q

# Create your views here.
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework import generics
from rest_framework import status
from rest_framework import mixins

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


class GenericCreate(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_model_instance = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response({'id': new_model_instance.id}, status=status.HTTP_201_CREATED, headers=headers)

    def get_success_headers(self, data):
        try:
            return {'Location': data[api_settings.URL_FIELD_NAME]}
        except (TypeError, KeyError):
            return {}


class AdopteeCreate(GenericCreate):
    serializer_class = serializers.AdopteeBasicsSerializer


class StoryTellerCreate(GenericCreate):
    serializer_class = serializers.StoryCreationSerializer


class CategoryListAndCreate(GenericCreate, mixins.ListModelMixin):
    serializer_class = serializers.RelationshipSerializer
    queryset = RelationshipCategory.objects.get(CATEGORY_FILTER)
