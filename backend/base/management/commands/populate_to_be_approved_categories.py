from django.core.management.base import BaseCommand
from base.models import (
    UndergraduateToBeApprovedCategories
)
from utils.color_logging import log


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        UndergraduateToBeApprovedCategories.objects.all().delete()
        categories = [
            # one subfield
            'track',
            'concentration',
            'residential_college',
            'pronouns',
            'certificate',
            'research_type',
            'interest',
            'extracurricular_subgroup',
            'extracurricular_position',
            # two subfields
            'housing',
            # three subfields
            'city',
            'extracurricular',
        ]
        for category in categories:
            UndergraduateToBeApprovedCategories.objects.create(category=category)
            log.info(
                f"Added track to UndergraduateToBeApprovedCategories: {category}"
            )
