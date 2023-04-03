from django.core.management.base import BaseCommand
from uniauth.models import (
    InstitutionAccount,
    LinkedEmail,
    UserProfile,
)
from base.models import UndergraduateTigerBookDirectory, OITActiveDirectoryUndergraduateGraduateInfo, \
    GenericTigerBookDirectory, TigerBookNotes
from django.contrib.auth.models import User


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        GenericTigerBookDirectory.objects.all().delete()
        TigerBookNotes.objects.all().delete()
        OITActiveDirectoryUndergraduateGraduateInfo.objects.all().delete()
        UndergraduateTigerBookDirectory.objects.all().delete()
        InstitutionAccount.objects.all().delete()
        LinkedEmail.objects.all().delete()
        UserProfile.objects.all().delete()
        User.objects.all().delete()
