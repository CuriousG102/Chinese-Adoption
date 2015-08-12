from django.contrib import admin

# Register your models here.
from adopteeStories import models

admin.site.register(models.Adoptee)
admin.site.register(models.Photo)
admin.site.register(models.Audio)
admin.site.register(models.RelationshipCategory)
admin.site.register(models.StoryTeller)
