from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_noop

from .default_settings import ADOPTEE_STORIES_CONFIG as config
from .translation_utils import string_format_lazy

# hacky solution to compilation problem
# Translators: the words in brackets are replaced by something else. For the code to work properly you should leave the brackets and the words inside of them as-is. You can move them around (i.e. copy-paste in different places)
ugettext_noop('Photo has incorrect dimensions. It should be of '
              'width {photo_width} and height {photo_height}.')
# Translators: the words in brackets are replaced by something else. For the code to work properly you should leave the brackets and the words inside of them as-is. You can move them around (i.e. copy-paste in different places)
ugettext_noop('Photo does not have the required format. '
              'It should be one of the following formats: {formats_list}.')
# Translators: the words in brackets are replaced by something else. For the code to work properly you should leave the brackets and the words inside of them as-is. You can move them around (i.e. copy-paste in different places)
ugettext_noop('The file size of the photo is too large. '
              'It should be of size {max_kilobytes} KB or less')


def image_validator(image_file):
    image = image_file.file.image
    maximum_size = config['PHOTO_FRONT_STORY_MAX_SIZE']
    if image_file.size > maximum_size:
        # Translators: the words in brackets are replaced by something else. For the code to work properly you should leave the brackets and the words inside of them as-is. You can move them around (i.e. copy-paste in different places)
        raise ValidationError(
            string_format_lazy('The file size of the photo is too large. '
                               'It should be of size {max_kilobytes} KB or less',
                               max_kilobytes=int(maximum_size / 2 ** 10))
        )

    required_width = config['PHOTO_FRONT_STORY_WIDTH']
    required_height = config['PHOTO_FRONT_STORY_HEIGHT']
    width, height = image.size
    if width != required_width or height != required_height:
        # Translators: the words in brackets are replaced by something else. For the code to work properly you should leave the brackets and the words inside of them as-is. You can move them around (i.e. copy-paste in different places)
        raise ValidationError(
            string_format_lazy('Photo has incorrect dimensions. It should be of '
                               'width {photo_width} and height {photo_height}.',
                               photo_width=required_width,
                               photo_height=required_height)
        )

    required_formats = config['FORMATS']
    if image.format not in required_formats:
        # Translators: the words in brackets are replaced by something else. For the code to work properly you should leave the brackets and the words inside of them as-is. You can move them around (i.e. copy-paste in different places)
        raise ValidationError(
            string_format_lazy('Photo does not have the required format. '
                               'It should be one of the following formats: {formats_list}.',
                               formats_list=','.join(sorted(list(required_formats))))
        )


class RestrictedImageField(models.ImageField):
    default_validators = [image_validator]
