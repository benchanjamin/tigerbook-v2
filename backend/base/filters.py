from itertools import chain

from django.db.models import QuerySet
from django_filters import rest_framework as filters

# from django_filters.rest_framework import DjangoFilterBackend

from base.models import UndergraduateTigerBookDirectory


class MultiValueCharFilter(filters.BaseCSVFilter, filters.CharFilter):
    def filter(self, qs, value):
        # value is either a list or an 'empty' value
        values = value or []

        query_sets = [
            super(MultiValueCharFilter, self).filter(qs, value) for value in values
        ]

        if not query_sets:
            return qs
        elif isinstance(query_sets[0], QuerySet):
            for query_set in query_sets[1:]:
                query_sets[0] = query_sets[0] | query_set
            return query_sets[0]
        return qs


class UndergraduateDirectoryListFilter(filters.FilterSet):
    class_year = MultiValueCharFilter(field_name="class_year__class_year", lookup_expr='iexact')
    track = MultiValueCharFilter(field_name="track__track", lookup_expr='iexact')
    residential_college = MultiValueCharFilter(field_name="residential_college__residential_college",
                                               lookup_expr='iexact')
    concentration = MultiValueCharFilter(field_name="concentration__concentration", lookup_expr='iexact')
    housing_building = filters.CharFilter(field_name='housing__building', lookup_expr='iexact')
    housing_room_no = filters.CharFilter(field_name='housing__room_no', lookup_expr='iexact')
    # TODO: strip out all non-alphanumeric characters for aliases
    aliases = filters.CharFilter(field_name='aliases', lookup_expr='icontains')
    pronouns = MultiValueCharFilter(field_name='pronouns__pronouns', lookup_expr='iexact')
    certificates = MultiValueCharFilter(field_name='certificates__certificate', lookup_expr='iexact')
    # hometown_city = filters.CharFilter(field_name='hometown__city', lookup_expr='iexact')
    # hometown_admin_name = filters.CharFilter(field_name='hometown__admin_name', lookup_expr='iexact')
    hometown_country = filters.CharFilter(field_name='hometown__country', lookup_expr='iexact')
    # current_city_city = filters.CharFilter(field_name='current_city__city', lookup_expr='iexact')
    # current_city_admin_name = filters.CharFilter(field_name='current_city__admin_name', lookup_expr='iexact')
    current_city_country = filters.CharFilter(field_name='current_city__country', lookup_expr='iexact')
    interests = MultiValueCharFilter(field_name='interests__interest', lookup_expr='iexact')
    extracurriculars = MultiValueCharFilter(field_name='extracurricular_objs__extracurricular', lookup_expr='iexact')
    extracurricular_positions = MultiValueCharFilter(field_name='extracurricular_position_objs__position',
                                                     lookup_expr='iexact')
    extracurricular_subgroup = filters.CharFilter(field_name='extracurricular_objs__subgroup', lookup_expr='iexact')
    research_research_type = filters.CharFilter(field_name='research_objs__research_type', lookup_expr='iexact')

    class Meta:
        model = UndergraduateTigerBookDirectory
        fields = [
        ]
