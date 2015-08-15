from django.contrib import admin

# Register your models here.
from adopteeStories import models
from embed_video.admin import AdminVideoMixin

admin.site.register(models.Adoptee)
admin.site.register(models.Photo)
admin.site.register(models.RelationshipCategory)
admin.site.register(models.StoryTeller)


@admin.register(models.Audio)
class AudioModelAdmin(AdminVideoMixin, admin.ModelAdmin):
    pass


@admin.register(models.Video)
class VideoModelAdmin(AdminVideoMixin, admin.ModelAdmin):
    pass
