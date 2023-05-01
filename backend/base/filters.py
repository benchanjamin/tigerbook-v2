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
    housing_building = MultiValueCharFilter(field_name='housing__building', lookup_expr='iexact')
    housing_room_no = MultiValueCharFilter(field_name='housing__room_no', lookup_expr='iexact')
    pronouns = MultiValueCharFilter(field_name='pronouns__pronouns', lookup_expr='iexact')
    certificates = MultiValueCharFilter(field_name='certificates__certificate', lookup_expr='iexact')
    hometown_complete_city = filters.CharFilter(field_name='hometown__entire_location_string', lookup_expr='iexact')
    current_city_complete_city = filters.CharFilter(field_name='current_city__entire_location_string',
                                                    lookup_expr='iexact')
    interests = MultiValueCharFilter(field_name='interests__interest', lookup_expr='iexact')
    extracurriculars = MultiValueCharFilter(field_name='extracurricular_objs__extracurricular', lookup_expr='iexact')
    extracurricular_positions = MultiValueCharFilter(field_name='extracurricular_position_objs__position',
                                                     lookup_expr='iexact')
    extracurricular_subgroup = MultiValueCharFilter(field_name='extracurricular_objs__subgroup', lookup_expr='iexact')
    research_research_type = MultiValueCharFilter(field_name='research_objs__research_type', lookup_expr='iexact')

    class Meta:
        model = UndergraduateTigerBookDirectory
        fields = [
        ]
