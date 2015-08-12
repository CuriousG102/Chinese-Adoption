# TODO: Clean up imports list and make it PEP8 compliant
from adoption_stories.adopteeStories.models import Adoptee, RelationshipCategory
from adoption_stories.adopteeStories import serializers
from django.db.models import Q

# Create your views here.
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework import generics
from rest_framework import status
from rest_framework import mixins


class AdopteeSearch(generics.ListAPIView):
    serializer_class = serializers.AdopteeSearchSerializer
    FIELDS_TO_SEARCH_ON = ['english_name', 'pinyin_name', 'chinese_name']
    FILTER_FOR_FIELDS = '__startswith'

    def get_queryset(self):
        userSearch = self.request.query_params['q']
        query = Q()

        for field in self.FIELDS_TO_SEARCH_ON:
            query |= Q(**{field + self.FILTER_FOR_FIELDS: userSearch})

        return Adoptee.objects.get(query)


class AdopteeList(generics.ListAPIView):
    queryset = Adoptee.objects.all()
    serializer_class = serializers.AdopteeListSerializer


class AdopteeDetail(generics.RetrieveAPIView):
    queryset = Adoptee.objects.all()
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
    queryset = RelationshipCategory.objects.all()

    # TODO: Make sure there is a test to ensure that no pagination is occuring here
    paginator = None
