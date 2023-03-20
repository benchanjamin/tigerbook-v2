from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class PublicMediaStorage(S3Boto3Storage):
    """Used to store & serve dynamic media files with no access expiration"""
    location = settings.PUBLIC_MEDIA_LOCATION
    default_acl = settings.PUBLIC_MEDIA_DEFAULT_ACL
    file_overwrite = False


class PrivateResidentialCollegeFacebookMediaStorage(S3Boto3Storage):
    """
    Used to store & serve dynamic media files using access keys
    and short-lived expirations to ensure more privacy control
    """

    location = settings.PRIVATE_RS_COLLEGE_FB_MEDIA_LOCATION
    default_acl = settings.PRIVATE_RS_COLLEGE_FB_MEDIA_DEFAULT_ACL
    file_overwrite = True
    custom_domain = False


# TODO: separate media storage locations for undergrads, grads, undergrad + grad alumni
class PrivateTigerBookUndergraduateMediaStorage(S3Boto3Storage):
    """
    Used to store & serve dynamic media files using access keys
    and short-lived expirations to ensure more privacy control
    """

    location = settings.PRIVATE_UNDERGRADUATE_TIGERBOOK_MEDIA_LOCATION
    default_acl = settings.PRIVATE_TIGERBOOK_MEDIA_DEFAULT_ACL
    file_overwrite = True
    custom_domain = False


class PrivateTigerBookGraduateMediaStorage(S3Boto3Storage):
    """
    Used to store & serve dynamic media files using access keys
	and short-lived expirations to ensure more privacy control
    """
    location = settings.PRIVATE_GRADUATE_TIGERBOOK_MEDIA_LOCATION
    default_acl = settings.PRIVATE_TIGERBOOK_MEDIA_DEFAULT_ACL
    file_overwrite = False
    custom_domain = False


class PrivateTigerBookUndergraduateAlumniMediaStorage(S3Boto3Storage):
    """
    Used to store & serve dynamic media files using access keys
	and short-lived expirations to ensure more privacy control
    """
    location = settings.PRIVATE_UNDERGRADUATE_ALUMNI_TIGERBOOK_MEDIA_LOCATION
    default_acl = settings.PRIVATE_TIGERBOOK_MEDIA_DEFAULT_ACL
    file_overwrite = False
    custom_domain = False


class PrivateTigerBookGraduateAlumniMediaStorage(S3Boto3Storage):
    """
    Used to store & serve dynamic media files using access keys
	and short-lived expirations to ensure more privacy control
    """
    location = settings.PRIVATE_GRADUATE_ALUMNI_TIGERBOOK_MEDIA_LOCATION
    default_acl = settings.PRIVATE_TIGERBOOK_MEDIA_DEFAULT_ACL
    file_overwrite = False
    custom_domain = False


class PrivateTigerBookGraduateAlumniMediaStorage(S3Boto3Storage):
    """
    Used to store & serve dynamic media files using access keys
	and short-lived expirations to ensure more privacy control
    """
    location = settings.PRIVATE_GRADUATE_ALUMNI_TIGERBOOK_MEDIA_LOCATION
    default_acl = settings.PRIVATE_TIGERBOOK_MEDIA_DEFAULT_ACL
    file_overwrite = False
    custom_domain = False


class PrivateTigerBookExtracurricularsMediaStorage(S3Boto3Storage):
    """
    Used to store & serve dynamic media files using access keys
	and short-lived expirations to ensure more privacy control
    """
    location = settings.PRIVATE_EXTRACURRICULARS_TIGERBOOK_MEDIA_LOCATION
    default_acl = settings.PRIVATE_TIGERBOOK_MEDIA_DEFAULT_ACL
    file_overwrite = False
    custom_domain = False
