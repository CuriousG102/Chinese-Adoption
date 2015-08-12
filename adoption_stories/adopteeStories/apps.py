# in yourapp/apps.py
from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class AdopteeStoriesConfig(AppConfig):
    name = 'adopteeStories'
    verbose_name = _('Adoptee Stories')
