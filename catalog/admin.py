from django.contrib import admin
from .models import Category, Perfume, Gender, Volume, PerfumeVolume, PerfumeImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Gender)  # Регистрируем модель Gender
class GenderAdmin(admin.ModelAdmin):
    list_display = ['name', 'get_display_name']
    search_fields = ['name']
    
    def get_display_name(self, obj):
        return str(obj)
    get_display_name.short_description = 'Отображаемое имя'

@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    list_display = ['size']
    ordering = ['size']

class PerfumeImageInline(admin.TabularInline):
    model = PerfumeImage
    extra = 1

class PerfumeVolumeInline(admin.TabularInline):
    model = PerfumeVolume
    extra = 1

@admin.register(Perfume)
class PerfumeAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'gender')
    list_filter = ('brand', 'category', 'gender')
    search_fields = ('name', 'brand', 'description')
    inlines = [PerfumeVolumeInline]
    fieldsets = (
        (None, {
            'fields': ('name', 'brand', 'article', 'category', 'gender', 'image')
        }),
        ('Описание', {
            'fields': ('description', 'notes'),
            'classes': ('collapse',),
        }),
    )

@admin.register(PerfumeVolume)
class PerfumeVolumeAdmin(admin.ModelAdmin):
    list_display = ['perfume', 'volume', 'price', 'in_stock']
    list_filter = ['in_stock', 'volume', 'perfume__brand']
    search_fields = ['perfume__name', 'perfume__brand']
    ordering = ['perfume__name', 'volume__size']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "volume":
            kwargs["queryset"] = Volume.objects.order_by('size')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def get_perfume(self, obj):
        return obj.perfume.name  # Чтобы в админке показывало название парфюма, а не объект
    get_perfume.short_description = "Парфюм"

    def get_volume(self, obj):
        return obj.volume.size  # Чтобы в админке показывало размер объема, а не объект
    get_volume.short_description = "Объем"

    def get_price(self, obj):
        return f"{obj.price}тг"  # Чтобы в админке показывалось значение цены в формате "тг"
    get_price.short_description = "Цена"

    def get_in_stock(self, obj):
        return "Да" if obj.in_stock else "Нет"  # Чтобы в админке показывалось, есть ли товар в наличии
    get_in_stock.short_description = "В наличии"
