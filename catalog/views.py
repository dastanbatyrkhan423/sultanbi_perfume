from django.shortcuts import render, get_object_or_404  
from .models import Perfume, Category, Gender, PerfumeImage
from django.db.models import Q

def about(request):
    # Страница "О нас"
    return render(request, 'catalog/home.html', {
        'title': 'О нас'
    })

def catalog(request):
    perfumes = Perfume.objects.all().prefetch_related('volumes').select_related('category', 'gender')
    brands = Perfume.objects.values_list('brand', flat=True).distinct()
    categories = Category.objects.all()
    
    context = {
        'perfumes': perfumes,
        'brands': brands,
        'categories': categories,
        'Gender': Gender
    }
    return render(request, 'catalog/catalog.html', context)

def perfume_detail(request, perfume_id):
    """
    Отображение детальной информации о парфюме
    """
    perfume = get_object_or_404(Perfume, id=perfume_id)
    
    # Получаем дополнительные изображения, если есть
    additional_images = PerfumeImage.objects.filter(perfume=perfume)
    
    # Получаем первый объем по умолчанию или None
    selected_volume = perfume.volumes.first()
    
    # Добавляем отладочную информацию
    print(f"Perfume: {perfume}, Selected volume: {selected_volume}")
    if selected_volume:
        print(f"Selected volume price: {selected_volume.price}")
    
    # Получаем похожие ароматы (из той же категории или бренда)
    related_perfumes = Perfume.objects.filter(
        Q(category=perfume.category) | Q(brand=perfume.brand)
    ).exclude(id=perfume.id)[:4]  # Ограничиваем до 4 похожих продуктов
    
    context = {
        'perfume': perfume,
        'additional_images': additional_images,
        'selected_volume': selected_volume,
        'related_perfumes': related_perfumes,
    }
    
    return render(request, 'catalog/perfume_detail.html', context)

def cart(request):
    return render(request, 'catalog/cart.html')  # Исправил шаблон

def checkout(request):
    context = {
        'checkout_page': True,
        # Другие переменные контекста...
    }
    return render(request, 'catalog/checkout.html', context)  # Исправил шаблон

def contacts(request):
    return render(request, 'catalog/contacts.html')

def location(request):
    return render(request, 'catalog/location.html')
