from django.core.management.base import BaseCommand
from base.models import (
    TigerBookPronouns
)
from utils.color_logging import log


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        TigerBookPronouns.objects.all().delete()
        pronouns = ['she/her/hers', 'he/him/his', 'they/them/theirs']
        for pronoun in pronouns:
            TigerBookPronouns.objects.create(pronouns=pronouns)
            log.info(
                f"Added track to TigerBookPronouns: {pronoun}"
            )
