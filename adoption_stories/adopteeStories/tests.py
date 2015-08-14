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


class AdopteeGetTestCase(TestCase):
    def setUp(self):
        self.adoptees = [
            Adoptee(english_name='Madeline Jing-Mei',
                    pinyin_name='Jǐngměi',
                    chinese_name='景美'),
            Adoptee(english_name='Kim Bla', ),
            Adoptee(chinese_name='景',
                    pinyin_name='Lola'),
            Adoptee(english_name='Search Test',
                    pinyin_name='Lala',
                    chinese_name='搜索的一例'),
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

        for i, storyteller in enumerate(self.storytellers):
            storyteller.save()
            adoptee = self.adoptees[i]
            adoptee.front_story = storyteller
            adoptee.save()

        self.c = Client()
        self.adoptee_list_url = reverse('adopteeList')

    def test_adoptee_list_shows_approved_adoptees(self):
        for storyteller in enumerate(self.storytellers):
            if storyteller[0] % 2 == 1:
                storyteller[1].approved = False
                storyteller[1].save()

        response = self.c.get(self.adoptee_list_url)

        m_jing_mei_json = '{{"english_name": "{0.english_name}",' \
                          ' "pinyin_name": "{0.pinyin_name}",' \
                          ' "chinese_name": "{0.chinese_name}",' \
                          ' "id": {0.id},' \
                          ' "photo_front_story": null,' \
                          ' "front_story": {{"story_text": "bs"}} }}'.format(self.adoptees[0])
        lola_json = '{{"english_name": null,' \
                    ' "pinyin_name": "{0.pinyin_name}",' \
                    ' "chinese_name": "{0.chinese_name}",' \
                    ' "id": {0.id},' \
                    ' "photo_front_story": null,' \
                    ' "front_story": {{"story_text": "bs"}} }}'.format(self.adoptees[2])
        expected_response = '{{"next":null,"previous":null,"results":[{0}, {1}]}}' \
            .format(lola_json, m_jing_mei_json)
        self.assertJSONEqual(response.content.decode('utf-8'),
                             expected_response)

    def test_adoptee_detail_get_formats_correctly(self):
        """
        Adoptee detail get fetches full adoptee detail correctly
        """
        relationship_json = '{{"english_name": null,' \
                            '  "chinese_name": null,' \
                            '  "id": {0.id}}}'.format(self.relationship)

        story_json = '{{"story_text": "bs",' \
                     '  "english_name": null,' \
                     '  "chinese_name": null,' \
                     '  "pinyin_name": null,' \
                     '  "relationship_to_story": {}}}' \
            .format(relationship_json)

        m_jing_mei_json = '{{"english_name": "{0.english_name}",' \
                          ' "pinyin_name": "{0.pinyin_name}",' \
                          ' "chinese_name": "{0.chinese_name}",' \
                          ' "id": {0.id},' \
                          ' "stories": [{1}]}}' \
            .format(self.adoptees[0], story_json)

        response = self.c.get(reverse('adopteeDetail', args=[self.adoptees[0].id]))
        self.assertJSONEqual(response.content.decode('utf-8'),
                             m_jing_mei_json)

    def test_adoptee_detail_doesnt_show_adoptee_without_approved_story(self):
        self.storytellers[0].approved = False
        self.storytellers[0].save()
        response = self.c.get(reverse('adopteeDetail', args=[self.adoptees[0].id]))
        self.assertEqual(response.status_code, 404)


class AdopteeCreateTestCase(TestCase):
    def setUp(self):
        self.c = Client()
        self.adoptee_create_url = reverse('adopteeCreate')

    def test_possible_to_create_full_adoptee_through_api(self):
        response = self.c.post(self.adoptee_create_url,
                               content_type="application/json",
                               data='{"english_name": "Madeleine Jing-Mei",'
                                    ' "pinyin_name":  "Jǐngměi",'
                                    ' "chinese_name": "景美"}')
        self.assertEqual(response.status_code, 201)
        qs = Adoptee.objects.all()
        self.assertEqual(len(qs), 1)
        self.assertJSONEqual(response.content.decode('utf-8'),
                             '{{"id": {0.id}}}'.format(qs[0]))
        # adoptee should be unreachable because they're not yet approved
        response = self.c.get(reverse('adopteeDetail', args=[qs[0].id]))
        self.assertEqual(response.status_code, 404)


class StorytellerCreateTestCase(TestCase):
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

        self.c = Client()
        self.storyteller_create_url = reverse('storytellerCreate')
        self.relationship = RelationshipCategory(english_name='test')
        self.relationship.save()

    def test_possible_to_create_storyteller_through_api(self):
        response = self.c.post(self.storyteller_create_url,
                               content_type="application/json",
                               data='{{"relationship_to_story": {0.id},'
                                    '  "story_text": "bs",'
                                    '  "email": "bs@example.com",'
                                    '  "related_adoptee": {1.id},'
                                    '  "english_name": "mark",'
                                    '  "chinese_name": null,'
                                    '  "pinyin_name": null}}'
                               .format(self.relationship, self.adoptees[0]))
        self.assertEqual(response.status_code, 201)

        qs = StoryTeller.objects.all()
        self.assertEqual(len(qs), 1)
        self.assertEqual(qs[0].relationship_to_story, self.relationship)
        self.assertEqual(qs[0].related_adoptee, self.adoptees[0])
        self.assertJSONEqual(response.content.decode('utf-8'),
                             '{{"id": {0.id}}}'.format(qs[0]))
