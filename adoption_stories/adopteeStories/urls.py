from adopteeStories import views
from django.conf.urls import url

urlpatterns = [
    url(r'^adoptee/(?P<pk>[0-9]+)/$', views.AdopteeDetail.as_view(),
        name="adopteeDetail"),
    # TODO: Eliminate tech debt and have better REST behavior here
    url(r'^adopteeCreate/$', views.AdopteeCreate.as_view(),
        name="adopteeCreate"),
    url(r'^storytellerCreate/$', views.StoryTellerCreate.as_view(),
        name="storytellerCreate"),

    url(r'^adoptee/$', views.AdopteeList.as_view(),
        name="adopteeList"),
    url(r'^search/adoptee/$', views.AdopteeSearch.as_view(),
        name="adopteeSearch"),
    url(r'^category/$', views.CategoryListAndCreate.as_view(),
        name="categoryListAndCreate")
]
