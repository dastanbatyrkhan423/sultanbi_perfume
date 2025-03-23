// В начале script.js
window.scriptJsLoaded = false;

// Функция инициализации, которая будет вызываться, когда оба скрипта загружены
window.initCartFunctions = function() {
    // Инициализация функций корзины
    updateCartDisplay();
    // ...другой код инициализации...
};

document.addEventListener('DOMContentLoaded', function() {
    // Функция для переключения отображения выпадающего меню
    window.toggleDropdown = function() {
        const dropdown = document.getElementById('dropdownMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (dropdown) {
            dropdown.classList.toggle('show');
            
            if (menuOverlay) {
                if (dropdown.classList.contains('show')) {
                    menuOverlay.style.display = 'block';
                    setTimeout(() => {
                        menuOverlay.style.opacity = '1';
                    }, 10);
                    document.body.style.overflow = 'hidden';
                } else {
                    menuOverlay.style.opacity = '0';
                    setTimeout(() => {
                        menuOverlay.style.display = 'none';
                    }, 300);
                    document.body.style.overflow = '';
                }
            }
        }
    };
    
    // Закрыть выпадающее меню при клике вне его
    window.addEventListener('click', function(event) {
        const dropdown = document.getElementById('dropdownMenu');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (dropdown && dropdown.classList.contains('show')) {
            if (!dropdown.contains(event.target) && 
                !event.target.matches('.menu-toggle') && 
                !event.target.matches('.menu-toggle-icon') &&
                (menuToggle && !menuToggle.contains(event.target))) {
                toggleDropdown();
            }
        }
    });
    
    // Изображения в деталях товара
    window.changeMainImage = function(thumbnail, imageUrl) {
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            mainImage.src = imageUrl;
        }
        
        // Удаляем класс active у всех миниатюр
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
        });
        
        // Добавляем класс active к выбранной миниатюре
        thumbnail.classList.add('active');
    };
    
    // Переключение вида отображения для каталога
    const viewToggle = document.getElementById('viewToggle');
    const productsContainer = document.querySelector('.products-grid');
    
    if (viewToggle && productsContainer) {
        viewToggle.addEventListener('click', function() {
            const isGrid = productsContainer.classList.contains('products-grid');
            
            if (isGrid) {
                productsContainer.classList.remove('products-grid');
                productsContainer.classList.add('products-list');
                viewToggle.innerHTML = '<i class="fas fa-th"></i>';
                viewToggle.setAttribute('title', 'Отображать сеткой');
            } else {
                productsContainer.classList.remove('products-list');
                productsContainer.classList.add('products-grid');
                viewToggle.innerHTML = '<i class="fas fa-list"></i>';
                viewToggle.setAttribute('title', 'Отображать списком');
            }
        });
    }
    
    // === КОРЗИНА ===
    // Создаем корзину при загрузке страницы
    function setupCart() {
        const cartIcon = document.querySelector('.cart-icon');
        if (!cartIcon) return;
        
        // Проверяем, что мы на странице каталога или детальной странице товара
        const path = window.location.pathname;
        const isCatalogPage = path === '/' || path === '/catalog/';
        const isProductPage = path.includes('/perfume/');
        
        // Если мы не на странице каталога и не на странице товара, не создаем корзину
        if (!isCatalogPage && !isProductPage) {
            return;
        }
        
        // Создаем основной элемент для корзины
        const cartSidebar = document.createElement('div');
        cartSidebar.className = 'cart-sidebar';
        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h3>Корзина</h3>
                <button class="close-cart">&times;</button>
            </div>
            <div class="cart-items" id="cart-items">
                <!-- Товары корзины будут добавлены JavaScript -->
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Итого:</span>
                    <span id="cart-total-amount">0 ₸</span>
                </div>
                <div class="cart-buttons">
                    <a href="/checkout" class="btn-checkout">Оформить заказ</a>
                </div>
            </div>
        `;
        
        // Создаем затемнение фона
        const cartOverlay = document.createElement('div');
        cartOverlay.className = 'cart-overlay';
        
        // Добавляем элементы в DOM
        document.body.appendChild(cartSidebar);
        document.body.appendChild(cartOverlay);
        
        // Обработчик клика на иконку корзины
        cartIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            openCart();
        });
        
        // Обработчик клика на кнопку закрытия
        cartSidebar.querySelector('.close-cart').addEventListener('click', closeCart);
        
        // Обработчик клика на затемнение
        cartOverlay.addEventListener('click', closeCart);
        
        // Обновляем содержимое корзины из localStorage при загрузке
        updateCartDisplay();
    }
    
    // Функция открытия корзины
    window.openCart = function() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateCartDisplay(); // Обновляем содержимое при открытии
        }
    };
    
    // Функция закрытия корзины
    window.closeCart = function() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    // Функция обновления отображения корзины
    window.updateCartDisplay = function() {
        const cartItems = document.getElementById('cart-items');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        const cartCountElement = document.getElementById('cart-count');
        
        if (!cartItems || !cartTotalAmount) return;
        
        // Получаем данные корзины из localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Обновляем счетчик товаров
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        }
        
        // Если корзина пуста, показываем сообщение
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <p>Ваша корзина пуста</p>
                    <p class="empty-cart-message">Добавьте товары для оформления заказа</p>
                </div>
            `;
            cartTotalAmount.textContent = '0 ₸';
            return;
        }
        
        // Отображаем товары в корзине
        let totalAmount = 0;
        cartItems.innerHTML = '';
        
        cart.forEach((item, index) => {
            const itemTotal = parseFloat(item.price) * (item.quantity || 1);
            totalAmount += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-volume">${item.volumeLabel || `${item.volume} мл`}</div>
                    <div class="cart-item-price">${parseFloat(item.price).toFixed(0)} ₸</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" onclick="decreaseQuantity(${index})">-</button>
                        <span>${item.quantity || 1}</span>
                        <button class="quantity-btn increase" onclick="increaseQuantity(${index})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">&times;</button>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        // Обновляем итоговую сумму
        cartTotalAmount.textContent = `${totalAmount.toFixed(0)} ₸`;
    };
    
    // Инициализация корзины
    setupCart();
    
    // Анимации при скролле
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Запускаем один раз при загрузке

    // Функция для увеличения количества товара
    window.increaseQuantity = function(index) {
        // Получаем текущую корзину
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Увеличиваем количество
        if (cart[index]) {
            // Если quantity не установлен, устанавливаем его в 2
            if (!cart[index].quantity) {
                cart[index].quantity = 2;
            } else {
                cart[index].quantity += 1;
            }
            
            // Сохраняем корзину и обновляем отображение
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay(); // Обновляем корзину
        }
    };

    // Функция для уменьшения количества товара
    window.decreaseQuantity = function(index) {
        // Получаем текущую корзину
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Уменьшаем количество
        if (cart[index]) {
            // Если количество больше 1, уменьшаем
            if (cart[index].quantity && cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                // Если количество 1 или не задано, удаляем товар
                return removeFromCart(index);
            }
            
            // Сохраняем корзину и обновляем отображение
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay(); // Обновляем корзину
        }
    };

    // Функция для удаления товара из корзины
    window.removeFromCart = function(index) {
        // Получаем текущую корзину
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Удаляем элемент
        if (cart[index] !== undefined) {
            cart.splice(index, 1);
            
            // Сохраняем корзину и обновляем отображение
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay(); // Обновляем корзину
        }
    };

    // Помечаем, что script.js загружен
    window.scriptJsLoaded = true;
    
    // Проверяем, загружен ли cart.js
    if (window.cartJsLoaded) {
        window.initCartFunctions();
    }

    // Полностью заменяем функцию для управления фильтрами
    function setupFilters() {
        const filterToggleBtn = document.getElementById('filter-toggle-btn');
        const filtersSection = document.getElementById('filters-section');
        
        if (!filterToggleBtn || !filtersSection) return;
        
        // Функция для инициализации фильтров
        function initFilters() {
            // На мобильных устройствах скрываем фильтр
            if (window.innerWidth <= 768) {
                filtersSection.style.display = 'none';
                // Обновляем текст кнопки
                if (filterToggleBtn.querySelector('.filter-text')) {
                    filterToggleBtn.querySelector('.filter-text').textContent = 'Показать фильтры';
                }
            } else {
                filtersSection.style.display = 'block';
                // Обновляем текст кнопки
                if (filterToggleBtn.querySelector('.filter-text')) {
                    filterToggleBtn.querySelector('.filter-text').textContent = 'Скрыть фильтры';
                }
            }
        }
        
        // Инициализируем фильтры при загрузке
        initFilters();
        
        // Обработчик для кнопки переключения фильтров
        filterToggleBtn.addEventListener('click', function() {
            // Проверяем текущее состояние фильтров
            const isVisible = filtersSection.style.display !== 'none';
            
            // Переключаем видимость
            if (isVisible) {
                filtersSection.style.display = 'none';
                if (filterToggleBtn.querySelector('.filter-text')) {
                    filterToggleBtn.querySelector('.filter-text').textContent = 'Показать фильтры';
                }
            } else {
                filtersSection.style.display = 'block';
                if (filterToggleBtn.querySelector('.filter-text')) {
                    filterToggleBtn.querySelector('.filter-text').textContent = 'Скрыть фильтры';
                }
            }
            
            // Добавляем анимацию кнопки
            filterToggleBtn.classList.add('pulse');
            setTimeout(() => {
                filterToggleBtn.classList.remove('pulse');
            }, 300);
        });
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', function() {
            // Показываем фильтры всегда на больших экранах
            if (window.innerWidth > 768) {
                filtersSection.style.display = 'block';
                if (filterToggleBtn.querySelector('.filter-text')) {
                    filterToggleBtn.querySelector('.filter-text').textContent = 'Скрыть фильтры';
                }
            }
        });
    }

    // Инициализация фильтров
    setupFilters();
});
