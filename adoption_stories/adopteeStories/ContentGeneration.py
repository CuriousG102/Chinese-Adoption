"""
A one-off script to create some test content for the site.
If you end up using this for your own purposes, I would highly recommend
giving it some structure and testability
"""
from django.core.files.base import ContentFile
import io
from PIL import Image

import loremipsum
import random

from adopteeStories.models import Adoptee, Audio, Video, Photo, RelationshipCategory, StoryTeller
from .chinese_lorem import ipsum as chinese_lorem


class LoremIpsumProxy():
    """
    Hacky way to account for the fact that our english lorem ipsum returns lists rather than strings
    """

    def __init__(self):
        self.loremipsum = loremipsum

    def get_sentences(self, amount, start_with_lorem=False):
        return ' '.join(loremipsum.get_sentences(amount, start_with_lorem))

    def get_paragraphs(self, amount, start_with_lorem=False):
        return '\n'.join(loremipsum.get_paragraphs(amount, start_with_lorem))


def generate_test_content(number_of_adoptees=100):
    STORYTELLER_NAMES = (('Karen', 'Wilbanks'), ('Josh', 'Duggar'), ('Brandon', 'Mond'),
                         ('Jena', 'Heath', '姓名', 'xing-ming'))

    ADOPTEE_NAMES = (('Madeline', 'Jǐngměi', '景美'), ('Stephen', 'xing-ming', '姓名'))

    YOUTUBE_VIDEOS = ('https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                      'https://www.youtube.com/watch?v=PYpiQ4gbngc')

    SOUNDCLOUD_CLIPS = ('https://soundcloud.com/syed-sarim-ahsen/wake-me-up-avicci-feat-aloe',
                        'https://soundcloud.com/helterskelter-beatles-c/cant-buy-me-love',)

    PHOTO_DIMENSION_BOUNDARIES = ((600, 3001), (400, 3001))  # like ((minX, maxX), (minY, maxY))

    NUMBER_OF_CAPTION_SENTENCES = (1, 2)  # it's a range [min, max)

    RELATIONSHIPS = [('Biological Father', '关系'), ('Biological Mother', '关系'),
                     ('Adoptive Father', '关系'), ('Adoptive Mother', '关系'),
                     ('Teacher', '关系'), ('Parents', '关系')]

    for i in range(0, len(RELATIONSHIPS)):
        RELATIONSHIPS[i] = RelationshipCategory \
            .objects.create(english_name=RELATIONSHIPS[i][0],
                            chinese_name=RELATIONSHIPS[i][1],
                            approved=True)

    NUMBER_OF_STORIES_PER_ADOPTEE = (1, 6)  # it's a range [min, max)
    NUMBER_OF_PARAGRAPHS_IN_A_STORY = (4, 14)  # it's a range [min, max)

    def set_other_media_fields(media_item, storyteller):
        media_item.english_caption = LoremIpsumProxy().get_sentences(random.randrange(*NUMBER_OF_CAPTION_SENTENCES))
        media_item.chinese_caption = chinese_lorem.get_sentences(random.randrange(*NUMBER_OF_CAPTION_SENTENCES))
        media_item.approved = True
        media_item.story_teller = storyteller

    def create_random_photo(storyteller):
        width = random.randrange(*PHOTO_DIMENSION_BOUNDARIES[0])
        height = random.randrange(*PHOTO_DIMENSION_BOUNDARIES[1])
        r = random.randrange(0, 256)
        g = random.randrange(0, 256)
        b = random.randrange(0, 256)
        photo = Image.new('RGB', (width, height), (r, g, b))
        photo_file = io.BytesIO()
        photo.save(photo_file, format="JPEG")
        photo_file.seek(0)
        photo = Photo()
        photo.photo_file.save('bs.jpg', ContentFile(photo_file.getvalue()))
        set_other_media_fields(photo, storyteller)
        photo.save()
        return photo

    def create_random_video(storyteller):
        video = Video(video=random.choice(YOUTUBE_VIDEOS))
        set_other_media_fields(video, storyteller)
        video.save()
        return video

    def create_random_audio(storyteller):
        audio = Audio(audio=random.choice(SOUNDCLOUD_CLIPS))
        set_other_media_fields(audio, storyteller)
        audio.save()
        return audio

    for i in range(0, number_of_adoptees):  # create an adoptee and all of the
        adoptee = Adoptee.objects.create(english_name=random.choice(ADOPTEE_NAMES)[0],
                                         pinyin_name=random.choice(ADOPTEE_NAMES)[1],
                                         chinese_name=random.choice(ADOPTEE_NAMES)[2])

        relationships = RELATIONSHIPS[:]
        random.shuffle(relationships)
        random_media = []

        # people who are in their life
        number_of_storytellers = random.randrange(*NUMBER_OF_STORIES_PER_ADOPTEE)
        storytellers = []
        for j in range(number_of_storytellers):
            number_of_paragraphs = random.randrange(*NUMBER_OF_PARAGRAPHS_IN_A_STORY)
            english_name = " ".join([random.choice(STORYTELLER_NAMES)[0],
                                     random.choice(STORYTELLER_NAMES)[1]])
            choice = random.choice(STORYTELLER_NAMES)
            try:
                chinese_name = choice[2]
                pinyin_name = choice[3]
            except IndexError:
                chinese_name = None
                pinyin_name = None

            story_text = random.choice([LoremIpsumProxy().get_paragraphs,
                                        chinese_lorem.get_paragraphs])(number_of_paragraphs)

            storyteller = StoryTeller \
                .objects.create(relationship_to_story=relationships.pop(),
                                story_text=story_text,
                                email="storyteller@example.com",
                                approved=True,
                                related_adoptee=adoptee,
                                english_name=english_name,
                                chinese_name=chinese_name,
                                pinyin_name=pinyin_name)

            random_media.append(random.choice([create_random_photo, create_random_video,
                                               create_random_audio])(storyteller))
            storytellers.append(storyteller)

        adoptee.front_story = random.choice(storytellers)

        for media in random_media:
            if isinstance(media, Photo):
                adoptee.photo_front_story = media
                break

        adoptee.save()
