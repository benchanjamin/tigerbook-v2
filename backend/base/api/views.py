from rest_framework.response import Response
from rest_framework.decorators import api_view
from uniauth.decorators import login_required


@login_required
@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)


@login_required
@api_view(['GET'])
def pet_routes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)
