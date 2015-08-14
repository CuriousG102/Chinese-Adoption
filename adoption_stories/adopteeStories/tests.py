from adopteeStories.models import Adoptee, StoryTeller, RelationshipCategory
from django.core.urlresolvers import reverse
from django.test import TestCase, Client


# Create your tests here.

# TODO: Clean up redundancy in these tests by abstracting behavior in rest tests

class AdopteeSearchTestCase(TestCase):
    def setUp(self):
        self.adoptees = [
            Adoptee(english_name='Madeline Jing-Mei',
                    pinyin_name='Jǐngměi',
                    chinese_name='景美'),
            Adoptee(english_name='Kim Bla', ),
            Adoptee(english_name='Search Test',
                    pinyin_name='Lala',
                    chinese_name='搜索的一例'),
            Adoptee(chinese_name='景',
                    pinyin_name='Lola')
        ]
        for adoptee in self.adoptees:
            adoptee.save()

        self.relationship = RelationshipCategory(approved=True)
        self.relationship.save()

        prototypical_storyteller_kw_args = {'story_text': 'bs',
                                            'email': 'bs@example.com',
                                            'approved': True,
                                            'relationship_to_story': self.relationship,
                                            }
        self.storytellers = [StoryTeller(related_adoptee=adoptee,
                                         **prototypical_storyteller_kw_args)
                             for adoptee in self.adoptees]

        for storyteller in self.storytellers:
            storyteller.save()

        self.c = Client()
        self.adoptee_search_url = reverse('adopteeSearch')

    def test_adoptee_search(self):
        """
        Empty search gets empty results when no storytellers are approved,
        and non-empty when they are approved
        """

        response = self.c.get(self.adoptee_search_url, {'q': ''})
        expected_response = '{"next":null,"previous":null,"results":[]}'
        self.assertJSONNotEqual(response.content.decode('utf-8'),
                                expected_response)

        for storyteller in StoryTeller.objects.all():
            storyteller.approved = False
            storyteller.save()

        response = self.c.get(self.adoptee_search_url, {'q': ''})
        expected_response = '{"next":null,"previous":null,"results":[]}'
        self.assertJSONEqual(response.content.decode('utf-8'),
                             expected_response)

    def test_adoptee_search2(self):
        """
        Search with first Latin letter matching an english name should get that adoptee
        when the adoptee has an approved storyteller
        """
        response = self.c.get(self.adoptee_search_url, {'q': 'M'})
        # TODO: Abstract the JSON building here
        m_jing_mei_json = '{{"english_name": "{0.english_name}",' \
                          ' "pinyin_name": "{0.pinyin_name}",' \
                          ' "chinese_name": "{0.chinese_name}",' \
                          ' "id": {0.id},' \
                          ' "photo_front_story": null}}'.format(self.adoptees[0])
        expected_response = '{{"next":null,"previous":null,"results":[{}]}}' \
            .format(m_jing_mei_json)
        self.assertJSONEqual(response.content.decode('utf-8'),
                             expected_response)

    def test_adoptee_search3(self):
        """
        Search with first Chinese character matching multiple should get both
        """
        response = self.c.get(self.adoptee_search_url, {'q': '景'})
        # TODO: Abstract the JSON building here
        m_jing_mei_json = '{{"english_name": "{0.english_name}",' \
                          ' "pinyin_name": "{0.pinyin_name}",' \
                          ' "chinese_name": "{0.chinese_name}",' \
                          ' "id": {0.id},' \
                          ' "photo_front_story": null}}'.format(self.adoptees[0])
        lola_json = '{{"english_name": null,' \
                    ' "pinyin_name": "{0.pinyin_name}",' \
                    ' "chinese_name": "{0.chinese_name}",' \
                    ' "id": {0.id},' \
                    ' "photo_front_story": null}}'.format(self.adoptees[3])
        expected_response = '{{"next":null,"previous":null,"results":[{0}, {1}]}}' \
            .format(lola_json, m_jing_mei_json)
        self.assertJSONEqual(response.content.decode('utf-8'),
                             expected_response)

    def test_adoptee_search_fail_without_q(self):
        """
        Search endpoint hit without q parameter returns a 400 status
        """
        response = self.c.get(self.adoptee_search_url)
        self.assertEqual(response.status_code, 400)
