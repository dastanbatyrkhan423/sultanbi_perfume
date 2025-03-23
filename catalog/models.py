from django.db import models
from django.core.files.storage import default_storage

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

class Gender(models.Model):
    GENDER_CHOICES = [
        ('Мужской', 'Мужской'),
        ('Женский', 'Женский'),
        ('Unisex', 'Unisex')
    ]
    
    name = models.CharField(
        max_length=50,
        choices=GENDER_CHOICES,
        default='Unisex',
        verbose_name="Пол"
    )

    def __str__(self):
        return self.name

    def get_code(self):
        # Возвращаем код для фильтрации
        return self.name

    class Meta:
        verbose_name = "Пол"
        verbose_name_plural = "Пол"

class Volume(models.Model):
    size = models.IntegerField(verbose_name="Объем (мл)")
    
    def __str__(self):
        return f"{self.size} мл"

    class Meta:
        verbose_name = "Объем"
        verbose_name_plural = "Объемы"
        ordering = ['size']

class Perfume(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    brand = models.CharField(max_length=255, verbose_name="Бренд")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Категория")
    gender = models.ForeignKey(Gender, on_delete=models.CASCADE, verbose_name="Пол")
    image = models.ImageField(upload_to='perfumes/', blank=True, null=True, verbose_name="Изображение")
    notes = models.TextField(blank=True, null=True, verbose_name='Ноты аромата')
    article = models.CharField(max_length=50, blank=True, null=True, verbose_name="Артикул")

    def __str__(self):
        return f"{self.brand} - {self.name}"

    def get_image_url(self):
        if self.image and hasattr(self.image, 'url'):
            return self.image.url
        return '/static/images/placeholder.jpg'

    def get_default_price(self):
        """Получить цену по умолчанию (цена первого объема или 0)"""
        first_volume = self.volumes.first()
        if first_volume:
            return first_volume.price
        return 0

    class Meta:
        verbose_name = "Парфюм"
        verbose_name_plural = "Парфюмы"

class PerfumeVolume(models.Model):
    perfume = models.ForeignKey(Perfume, on_delete=models.CASCADE, related_name='volumes', verbose_name="Парфюм")
    volume = models.ForeignKey(Volume, on_delete=models.CASCADE, verbose_name="Объем")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    in_stock = models.BooleanField(default=True, verbose_name="В наличии")

    def __str__(self):
        return f"{self.perfume.name} - {self.volume.size}мл - {self.price} тг"

    class Meta:
        verbose_name = "Объем парфюма"
        verbose_name_plural = "Объемы парфюмов"
        unique_together = ['perfume', 'volume']
        ordering = ['volume__size']

class PerfumeImage(models.Model):
    """Дополнительные изображения парфюма"""
    perfume = models.ForeignKey(Perfume, related_name='additional_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='perfumes/additional/')
    order = models.PositiveSmallIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Изображение парфюма'
        verbose_name_plural = 'Изображения парфюмов'
    
    def __str__(self):
        return f"Изображение {self.order} для {self.perfume.name}"

