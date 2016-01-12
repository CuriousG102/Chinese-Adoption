import os
from storages.backends.s3boto import S3BotoStorage

from .base import *

DEBUG = False
ALLOWED_HOSTS = [os.environ['DOMAIN']]

INSTALLED_APPS += (
    'storages',
)

SECRET_KEY = os.environ['SECRET_KEY']

AWS_S3_ACCESS_KEY_ID = os.environ['AWS_S3_ACCESS_KEY_ID']
AWS_S3_SECRET_ACCESS_KEY = os.environ['AWS_S3_SECRET_ACCESS_KEY']
AWS_S3_FILE_OVERWRITE = False
AWS_STATIC_STORAGE_BUCKET_NAME = os.environ['AWS_STATIC_STORAGE_BUCKET_NAME']
AWS_MEDIA_STORAGE_BUCKET_NAME = os.environ['AWS_MEDIA_STORAGE_BUCKET_NAME']
AWS_S3_ENCRYPTION = True
AWS_STATIC_S3_CUSTOM_DOMAIN = '{}.s3.amazonaws.com'.format(AWS_STATIC_STORAGE_BUCKET_NAME)
AWS_MEDIA_S3_CUSTOM_DOMAIN = '{}.s3.amazonaws.com'.format(AWS_MEDIA_STORAGE_BUCKET_NAME)
AWS_IS_GZIPPED = True
AWS_S3_URL_PROTOCOL = 'https:'
AWS_AUTO_CREATE_BUCKET = False

STATIC_URL = 'https://{}/'.format(AWS_STATIC_S3_CUSTOM_DOMAIN)
MEDIA_URL = 'https://{}/'.format(AWS_MEDIA_S3_CUSTOM_DOMAIN)


class MediaStorage(S3BotoStorage):
    bucket_name = AWS_MEDIA_STORAGE_BUCKET_NAME


class StaticStorage(S3BotoStorage):
    bucket_name = AWS_STATIC_STORAGE_BUCKET_NAME


STATICFILES_STORAGE = StaticStorage
DEFAULT_FILE_STORAGE = MediaStorage
