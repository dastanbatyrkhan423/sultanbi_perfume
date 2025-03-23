from django.urls import path
from . import views

urlpatterns = [
    path('', views.catalog, name='catalog'),  # Каталог теперь главная страница
    path('about/', views.about, name='about'),  # Home.html теперь страница "О нас"
    path('contacts/', views.contacts, name='contacts'),
    path('location/', views.location, name='location'),
    path('checkout/', views.checkout, name='checkout'),
    path('catalog/<str:category_slug>/', views.catalog, name='catalog_category'),  # Фильтр по категории
    path('cart/', views.cart, name='cart'),
    path('perfume/<int:perfume_id>/', views.perfume_detail, name='perfume_detail'),
]
