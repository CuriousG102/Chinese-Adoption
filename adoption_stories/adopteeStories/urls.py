from adoption_stories.adopteeStories import views
from django.conf.urls import url

urlpatterns = [
    url(r'^adoptee/(?P<pk>[0-9]+)/$', views.AdopteeDetail.as_view()),
    # TODO: Eliminate tech debt and have better REST behavior here
    url(r'^adopteeCreate/$', views.AdopteeCreate.as_view()),
    url(r'^storytellerCreate/$', views.StoryTellerCreate.as_view()),

    url(r'^adoptee/$', views.AdopteeList.as_view()),
    url(r'^search/adoptee/$', views.AdopteeSearch.as_view()),
    url(r'^category/$', views.CategoryListAndCreate.as_view())
]
