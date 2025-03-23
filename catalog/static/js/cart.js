// Enhanced Shopping Cart with Local Storage
document.addEventListener('DOMContentLoaded', function() {
    // Use localStorage for cart persistence
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartButton = document.querySelector('.cart-button');
    const cartCount = document.getElementById('cart-count');

    // Initialize cart counter
    updateCartCount();

    // Проверяем, что мы на подходящей странице для создания корзины


    // Add to cart function with flying animation
    window.addToCart = function(id, name, price, image, volume, volumeLabel) {
        // Проверяем входящие данные
        if (!price) {
            console.error('Ошибка: цена не указана');
            return;
        }
        
        // Get the button that was clicked
        const buyButton = event.currentTarget;
        const buttonRect = buyButton.getBoundingClientRect();
        
        // Get the cart icon for target position
        const cartIcon = document.querySelector('.cart-icon');
        const cartRect = cartIcon.getBoundingClientRect();

        // Calculate start and end positions
        const startLeft = buttonRect.left + buttonRect.width / 2;
        const startTop = buttonRect.top + buttonRect.height / 2;
        const endLeft = cartRect.left + cartRect.width / 2;
        const endTop = cartRect.top + cartRect.height / 2;
        
        // Create flying element
        const flyingItem = document.createElement('div');
        const img = document.createElement('img');
        
        // Setup image
        img.src = image;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '50%';
        
        // Setup flying container
        flyingItem.style.position = 'fixed';
        flyingItem.style.zIndex = '2000';
        flyingItem.style.width = '50px';
        flyingItem.style.height = '50px';
        flyingItem.style.left = startLeft + 'px';
        flyingItem.style.top = startTop + 'px';
        flyingItem.style.transform = 'translate(-50%, -50%)';
        flyingItem.style.borderRadius = '50%';
        flyingItem.style.overflow = 'hidden';
        flyingItem.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.5)';
        flyingItem.style.border = '2px solid #D4AF37';
        flyingItem.style.opacity = '0';
        flyingItem.style.transition = 'all 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
        
        // Add image to container
        flyingItem.appendChild(img);
        document.body.appendChild(flyingItem);
        
        // Animate button
        buyButton.style.transform = 'scale(0.95)';
        buyButton.style.transition = 'transform 0.2s ease';

        setTimeout(() => {
            buyButton.style.transform = 'scale(1)';
        }, 200);
        
        // Start animation sequence
        setTimeout(() => {
            // Start animation
            flyingItem.style.opacity = '1';
            flyingItem.style.transform = 'translate(-50%, -50%) scale(1.2)';
            
            setTimeout(() => {
                // Fly to cart
                flyingItem.style.left = endLeft + 'px';
                flyingItem.style.top = endTop + 'px';
                flyingItem.style.transform = 'translate(-50%, -50%) scale(0.3)';
                flyingItem.style.opacity = '0.8';
                
                // Animate cart
                setTimeout(() => {
                    cartIcon.style.transform = 'scale(1.2)';
                    cartIcon.style.transition = 'transform 0.3s ease';
                    
                    setTimeout(() => {
                        document.body.removeChild(flyingItem);
                        cartIcon.style.transform = 'scale(1)';
                        
                        // ВАЖНО: Сначала добавляем товар в корзину, затем показываем уведомление
                        
                        // Получаем текущую корзину из localStorage
                        let cart = JSON.parse(localStorage.getItem('cart')) || [];
                        
                        // Создаем новый элемент корзины
                        const newItem = {
                            id,
                            name,
                            price,
                            image,
                            volume,
                            volumeLabel,
                            quantity: 1
                        };
                        
                        // Проверяем, есть ли уже такой товар в корзине
                        const existingItemIndex = cart.findIndex(item => 
                            item.id === id && 
                            ((item.volume === volume) || (!item.volume && !volume))
                        );
                        
                        if (existingItemIndex !== -1) {
                            // Если товар уже есть, увеличиваем количество
                            cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
                        } else {
                            // Если товара нет, добавляем его
                            cart.push(newItem);
                        }
                        
                        // Сохраняем обновленную корзину
                        localStorage.setItem('cart', JSON.stringify(cart));
                        
                        // Обновляем счетчик товаров
                        updateCartCount();
                        
                        // ТЕПЕРЬ показываем уведомление с актуальными данными
                        showProductAddedNotification(name, volumeLabel, price);
                        
                    }, 300);
                }, 800);
            }, 200);
        }, 10);
    };

    // Обновляем функцию showProductAddedNotification, чтобы она всегда использовала актуальные данные
    function showProductAddedNotification(name, volumeLabel, price) {
        // Получаем АКТУАЛЬНУЮ корзину для расчета общей суммы
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Рассчитываем общую сумму корзины
        const totalAmount = cart.reduce((total, item) => 
            total + parseFloat(item.price) * (item.quantity || 1), 0);
        
        // Количество товаров в корзине
        const totalItems = cart.reduce((total, item) => 
            total + (item.quantity || 1), 0);
        
        console.log('Показываем уведомление. Товаров в корзине:', totalItems, 'на сумму:', totalAmount);
        
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'product-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <span class="notification-title">Товар добавлен в корзину</span>
                    <button class="notification-close">&times;</button>
                </div>
                <div class="notification-product">${name}</div>
                <div class="notification-details">
                    ${volumeLabel ? `<span>${volumeLabel}</span>` : ''}
                    <span>${parseFloat(price).toFixed(0)} ₸</span>
                </div>
                <div class="notification-divider"></div>
                <div class="notification-cart-summary">
                    <div class="notification-cart-info">
                        <span>В корзине: ${totalItems} ${getItemsText(totalItems)}</span>
                        <span class="notification-total-amount">${totalAmount.toFixed(0)} ₸</span>
                    </div>
                    <a href="/checkout" class="notification-checkout-btn">Оформить заказ</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление с анимацией
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Закрываем уведомление автоматически через 5 секунд
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Закрытие по клику на крестик
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }

    // Вспомогательная функция для склонения слова "товар"
    function getItemsText(count) {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return 'товаров';
        }
        
        if (lastDigit === 1) {
            return 'товар';
        }
        
        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'товара';
        }
        
        return 'товаров';
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('cartLastUpdated', new Date().toISOString());
    }

    // Toggle cart modal
    function toggleCart() {
        cartModal.classList.toggle('active');
        if (cartModal.classList.contains('active')) {
            updateCartModal();
            // Prevent scrolling when cart is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Обновление счетчика товаров в корзине
    function updateCartCount() {
        // Получаем актуальные данные корзины
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Подсчитываем общее количество товаров
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        
        // Получаем элемент счетчика
        const cartCount = document.getElementById('cart-count');
        
        console.log('Обновление счетчика корзины. Элемент:', cartCount, 'Товаров:', totalItems);
        
        // Если элемент существует, обновляем его
        if (cartCount) {
            // Обновляем текст
            cartCount.textContent = totalItems;
            
            // Добавляем анимацию для привлечения внимания
            cartCount.classList.add('bump');
            setTimeout(() => cartCount.classList.remove('bump'), 300);
            
            // Показываем или скрываем счетчик в зависимости от наличия товаров
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            
            console.log('Счетчик корзины обновлен:', totalItems);
        } else {
            console.log('Элемент счетчика корзины не найден');
        }
    }

    // Update cart modal content
    function updateCartModal() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total span');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
            cartTotal.textContent = '0';
            return;
        }
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += parseFloat(item.price) * (item.quantity || 1);
            
            const volumeDisplay = item.volumeLabel || (item.volume ? `${item.volume} мл` : '');
            
            // Создание элемента корзины...
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>${volumeDisplay}</p>
                    <p class="item-price">${parseFloat(item.price).toFixed(0)} тг</p>
                </div>
                <div class="item-controls">
                    <button onclick="removeFromCart(${index})" class="remove-item">×</button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(0);
    }

    // Remove item from cart
    window.removeFromCart = function(index) {
        // Получаем текущую корзину
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Удаляем элемент по индексу
        if (cart[index] !== undefined) {
            cart.splice(index, 1);
            
            // Сохраняем корзину
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Обновляем отображение
            updateCartDisplay();
            
            // Обновляем счетчик корзины
            updateCartCount();
        }
    };

    // Increase item quantity
    window.increaseQuantity = function(index) {
        // Получаем текущую корзину
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Увеличиваем количество
        if (cart[index]) {
            // Если quantity не установлен, устанавливаем в 2
            if (!cart[index].quantity) {
                cart[index].quantity = 2;
            } else {
                cart[index].quantity += 1;
            }
            
            // Сохраняем корзину
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Обновляем отображение
            updateCartDisplay();
            
            // Обновляем счетчик корзины
            updateCartCount();
        }
    };

    // Decrease item quantity
    window.decreaseQuantity = function(index) {
        // Получаем текущую корзину
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Уменьшаем количество
        if (cart[index]) {
            // Если количество больше 1, уменьшаем
            if (cart[index].quantity && cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                // Если количество 1 или не задано, удаляем товар
                return removeFromCart(index);
            }
            
            // Сохраняем корзину
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Обновляем отображение
            updateCartDisplay();
            
            // Обновляем счетчик корзины
            updateCartCount();
        }
    };

    // Clear cart
    window.clearCart = function() {
        cart = [];
        saveCart();
        localStorage.removeItem('cartTotal');
        localStorage.removeItem('cartItems');
        updateCartCount();
        updateCartModal();
    };

    // Get cart data
    window.getCartData = function() {
        return {
            items: cart,
            total: cart.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0)
        };
    };
    
    // Handle mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
            }
        });
    }

    // Фильтрация и поиск
    const searchInput = document.getElementById('searchInput');
    const brandFilter = document.getElementById('brandFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const genderFilter = document.getElementById('genderFilter');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const sortSelect = document.getElementById('sortSelect');
    const activeFilters = document.getElementById('activeFilters');

    let debounceTimer;

    // Функция для применения фильтров
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedBrand = brandFilter.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedGender = genderFilter.value;
        const minPriceValue = minPrice.value ? parseFloat(minPrice.value) : 0;
        const maxPriceValue = maxPrice.value ? parseFloat(maxPrice.value) : Infinity;

        console.log('Selected brand:', selectedBrand);

        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const name = product.querySelector('.product-title').textContent.toLowerCase();
            const brand = product.dataset.brand.toLowerCase();
            const category = product.dataset.category;
            const gender = product.dataset.gender;
            const price = parseFloat(product.dataset.price);

            console.log('Product brand:', brand);

            const matchesSearch = name.includes(searchTerm);
            const matchesBrand = !selectedBrand || brand === selectedBrand;
            const matchesCategory = !selectedCategory || category === selectedCategory;
            const matchesGender = !selectedGender || gender === selectedGender;
            const matchesPrice = price >= minPriceValue && price <= maxPriceValue;

            if (matchesSearch && matchesBrand && matchesCategory && matchesGender && matchesPrice) {
                product.style.display = '';
                product.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                product.style.display = 'none';
            }
        });

        updateActiveFilters();
    }

    // Обновление активных фильтров
    function updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        activeFiltersContainer.innerHTML = '';

        // Получаем выбранные значения фильтров
        const selectedBrand = brandFilter.value;
        const selectedCategory = categoryFilter.options[categoryFilter.selectedIndex].text;
        const selectedGender = genderFilter.options[genderFilter.selectedIndex].text;
        const minPriceValue = minPrice.value;
        const maxPriceValue = maxPrice.value;

        // Массив для активных фильтров
        const activeFilters = [];

        // Проверяем каждый фильтр
        if (selectedBrand) {
            activeFilters.push({
                type: 'Бренд',
                value: selectedBrand,
                filter: 'brand'
            });
        }

        if (selectedCategory && selectedCategory !== 'Все категории') {
            activeFilters.push({
                type: 'Категория',
                value: selectedCategory,
                filter: 'category'
            });
        }

        if (selectedGender && selectedGender !== 'Все ароматы') {
            activeFilters.push({
                type: 'Для кого',
                value: selectedGender,
                filter: 'gender'
            });
        }

        if (minPriceValue || maxPriceValue) {
            const priceRange = [];
            if (minPriceValue) priceRange.push(`от ${minPriceValue}`);
            if (maxPriceValue) priceRange.push(`до ${maxPriceValue}`);
            
            activeFilters.push({
                type: 'Цена',
                value: priceRange.join(' '),
                filter: 'price'
            });
        }

        // Отображаем активные фильтры
        activeFilters.forEach(filter => {
            const filterTag = document.createElement('div');
            filterTag.className = 'filter-tag';
            filterTag.innerHTML = `
                ${filter.type}: ${filter.value}
                <span class="remove-filter" onclick="removeFilter('${filter.filter}')">×</span>
            `;
            activeFiltersContainer.appendChild(filterTag);
        });
    }

    // Функция для удаления фильтра
    function removeFilter(filterType) {
        switch (filterType) {
            case 'brand':
                brandFilter.value = '';
                break;
            case 'category':
                categoryFilter.value = '';
                break;
            case 'gender':
                genderFilter.value = '';
                break;
            case 'price':
                minPrice.value = '';
                maxPrice.value = '';
                break;
        }
        
        // Применяем фильтры снова
        applyFilters();
    }

    // Добавляем функцию в глобальный объект window
    window.removeFilter = removeFilter;

    // Обработчики событий
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilters, 300);
    });

    [brandFilter, categoryFilter, genderFilter, sortSelect].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    [minPrice, maxPrice].forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyFilters, 300);
        });
    });

    // Сортировка
    sortSelect.addEventListener('change', () => {
        const products = Array.from(document.querySelectorAll('.product-card'));
        const container = document.querySelector('.products-grid');
        
        products.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            const nameA = a.querySelector('.product-title').textContent;
            const nameB = b.querySelector('.product-title').textContent;

            switch (sortSelect.value) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'name-asc':
                    return nameA.localeCompare(nameB);
                case 'name-desc':
                    return nameB.localeCompare(nameA);
                default:
                    return 0;
            }
        });

        container.innerHTML = '';
        products.forEach(product => {
            product.style.animation = 'fadeIn 0.5s ease forwards';
            container.appendChild(product);
        });
    });

    // Оптимизированное переключение фильтров
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filtersSection = document.getElementById('filters-section');

    // Предварительно вычисляем высоту фильтра для анимации
    let filterHeight = 0;

    // Инициализация фильтра более эффективным способом
    function initializeFilters() {
        // На мобильных устройствах скрываем фильтр
        if (window.innerWidth <= 768) {
            filtersSection.classList.add('hidden');
        }
    }

    // Оптимизированное переключение без лишних вычислений
    filterToggleBtn.addEventListener('click', () => {
        // Используем requestAnimationFrame для более плавной анимации
        requestAnimationFrame(() => {
            filtersSection.classList.toggle('hidden');
            
            // Минимальная анимация кнопки
            filterToggleBtn.classList.add('pulse');
            setTimeout(() => {
                filterToggleBtn.classList.remove('pulse');
            }, 300);
        });
    });

    // Инициализация при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFilters);
    } else {
        initializeFilters();
    }

    // Обработка изменения размера экрана с дебаунсингом
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                filtersSection.classList.remove('hidden');
            }
        }, 100);
    });

    function toggleDropdown() {
        const menu = document.getElementById('dropdownMenu');
        const overlay = document.getElementById('menuOverlay');
        menu.classList.toggle('show');
        overlay.classList.toggle('show');
        
        // Блокируем прокрутку body при открытом меню
        document.body.style.overflow = menu.classList.contains('show') ? 'hidden' : '';
    }

    // Закрываем меню при клике на оверлей
    document.getElementById('menuOverlay').addEventListener('click', toggleDropdown);

    // Закрываем меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const menu = document.getElementById('dropdownMenu');
            if (menu.classList.contains('show')) {
                toggleDropdown();
            }
        }
    });

    function showDirections(event) {
        event.preventDefault();
        document.querySelector('.main-menu').classList.add('hide');
        document.querySelector('.directions-menu').classList.add('show');
    }

    function hideDirections() {
        document.querySelector('.main-menu').classList.remove('hide');
        document.querySelector('.directions-menu').classList.remove('show');
    }

    function showSection(event, section) {
        event.preventDefault();
        document.querySelector('.main-menu').classList.add('hide');
        document.querySelector(`.${section}-menu`).classList.add('show');
    }

    function hideSection(section) {
        document.querySelector('.main-menu').classList.remove('hide');
        document.querySelector(`.${section}-menu`).classList.remove('show');
    }

    // Обновление отображения корзины (общая функция для cart.js и script.js)
    window.updateCartDisplay = function() {
        // Обновляем счетчик на иконке корзины
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cartCount.textContent = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        }
        
        // Обновляем содержимое корзины, если она открыта
        const cartItems = document.getElementById('cart-items');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        
        if (cartItems && cartTotalAmount) {
            // Получаем данные корзины
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
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
        }
    };

    // Функция для добавления товара в корзину с кнопки на странице товара
    window.addToCartFromDetail = function(button) {
        console.log('Вызвана функция addToCartFromDetail');
        
        // Получаем данные о товаре из атрибутов data
        const id = parseInt(button.dataset.id);
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const image = button.dataset.image;
        const volume = button.dataset.volume ? parseInt(button.dataset.volume) : null;
        const volumeLabel = button.dataset.volumeLabel || '';
        
        console.log('Данные товара из кнопки:', { id, name, price, image, volume, volumeLabel });
        
        // Вызываем основную функцию добавления в корзину
        window.addToCart(id, name, price, image, volume, volumeLabel);
        
        // Предотвращаем стандартное поведение (если функция вызвана из обработчика события)
        if (event) {
            event.preventDefault();
        }
    };

    // Добавляем обработчик загрузки DOM для обеспечения работы кнопки
    console.log('DOM загружен, проверяем наличие кнопки "Добавить в корзину"');
    
    const addToCartButton = document.getElementById('add-to-cart-detail');
    
    if (addToCartButton) {
        console.log('Кнопка "Добавить в корзину" найдена, добавляем обработчик');
        
        addToCartButton.addEventListener('click', function(e) {
            console.log('Клик по кнопке "Добавить в корзину"');
            addToCartFromDetail(this);
        });
    } else {
        console.log('Кнопка "Добавить в корзину" не найдена');
    }
});

// Add additional CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .item-quantity {
        display: flex;
        align-items: center;
        margin-right: 10px;
    }
    
    .quantity-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(212, 175, 55, 0.2);
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.2s ease;
    }
    
    .quantity-btn:hover {
        background: rgba(212, 175, 55, 0.2);
    }
    
    .item-quantity span {
        margin: 0 8px;
        min-width: 20px;
        text-align: center;
    }
    
    .empty-cart {
        padding: 30px 0;
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
        font-style: italic;
    }
    
    .product-added-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(13, 28, 61, 0.95);
        border-left: 3px solid #D4AF37;
        padding: 15px;
        border-radius: 6px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        min-width: 280px;
        transform: translateX(120%);
        opacity: 0;
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.15s ease;
        z-index: 9999;
    }
    
    .product-added-notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-icon {
        background: var(--gold-gradient);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-color);
        margin-right: 15px;
        font-weight: bold;
    }
    
    .notification-content {
        flex: 1;
    }
    
    .notification-title {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 5px;
    }
    
    .notification-product {
        font-size: 16px;
        font-weight: 600;
        color: #FFD700;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes bump {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .bump {
        animation: bump 0.3s ease;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 0.3s ease;
    }
`;
document.head.appendChild(style);

// Function for smooth scrolling to categories
window.scrollToCategory = function(categoryId) {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};