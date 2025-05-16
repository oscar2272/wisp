from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.permissions import AllowAny

class PublicSchemaView(SpectacularAPIView):
    authentication_classes = []

class PublicSwaggerView(SpectacularSwaggerView):
    authentication_classes = []


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', PublicSchemaView.as_view(), name='api-schema'),
    path('api/docs/', PublicSwaggerView.as_view(url_name='api-schema'), name='api-docs'),
    path('api/users/', include('user.urls')),
    path('api/notes/', include('note.urls')),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
