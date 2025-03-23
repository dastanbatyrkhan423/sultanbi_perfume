from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from catalog import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('catalog.urls')),
]

# Важно: эти строки должны быть вне условия DEBUG для работы на сервере
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Дополнительно для режима разработки (не нужно на Vercel)
if settings.DEBUG:
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()
