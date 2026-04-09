document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data ---
    const PRODUCTS = [
        { id: 1, title: 'Chaqueta de Cuero Premium', price: 349000, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', category: 'Ropa' },
        { id: 2, title: 'Zapatillas Sport Runner X1', price: 219000, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'Calzado' },
        { id: 3, title: 'Camiseta Blanca Esencial', price: 69000, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', category: 'Ropa' },
        { id: 4, title: 'Jeans Clásicos Slim Fit', price: 189000, img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', category: 'Ropa' },
        { id: 5, title: 'Audífonos Cancelación Ruido', price: 450000, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'Electrónica' },
        { id: 6, title: 'Reloj Inteligente Pro', price: 320000, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Accesorios' },
        { id: 7, title: 'Mochila de Viaje Impermeable', price: 150000, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'Accesorios' },
        { id: 8, title: 'Gafas de Sol Clásicas', price: 85000, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', category: 'Accesorios' }
    ];

    // --- State & LocalStorage ---
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
    let activeProduct = null;

    function saveState() {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('userCart', JSON.stringify(cart));
        updateCartUI();
    }

    const formatCOP = (num) => '$' + num.toLocaleString('es-CO') + ' COP';

    // --- Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const bottomNav = document.getElementById('bottom-nav');

    window.navigate = function(targetViewId) {
        if (!currentUser && targetViewId === 'profile') {
            targetViewId = 'login';
        }

        if (targetViewId === 'product' || targetViewId === 'login' || targetViewId === 'register') {
            bottomNav.classList.add('hide-nav');
        } else {
            bottomNav.classList.remove('hide-nav');
        }

        views.forEach(view => view.classList.remove('active'));
        navItems.forEach(item => {
            item.classList.remove('active');
            const icon = item.querySelector('i');
            if (icon && icon.classList.contains('ph-fill')) {
                icon.classList.remove('ph-fill');
                icon.classList.add('ph');
            }
        });

        const targetView = document.getElementById(`view-${targetViewId}`);
        if(targetView) targetView.classList.add('active');

        const activeNavItem = document.querySelector(`.nav-item[data-target="${targetViewId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
            const icon = activeNavItem.querySelector('i');
            if (icon && icon.classList.contains('ph')) {
                icon.classList.remove('ph');
                icon.classList.add('ph-fill');
            }
        }

        // Trigger updates if applicable
        if (targetViewId === 'profile') updateProfileUI();
        if (targetViewId === 'cart') updateCartUI();
        window.scrollTo(0,0);
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(item.getAttribute('data-target'));
        });
    });

    // Handle initial route
    navigate('home');
    updateCartUI(); // initial cart render

    // --- Auth Logic ---
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const pass = document.getElementById('register-password').value;
        if(name && email && pass) {
            currentUser = { name, email };
            saveState();
            navigate('profile');
        }
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        if(email && pass) {
            currentUser = { name: email.split('@')[0], email };
            saveState();
            navigate('profile');
        }
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        currentUser = null;
        cart = []; // clear session cart locally or keep it? generally clear it
        saveState();
        navigate('login');
    });

    // --- Rendering Products ---
    function renderProductGrid(gridId, productsToRender) {
        const grid = document.getElementById(gridId);
        if(!grid) return;
        grid.innerHTML = '';
        productsToRender.forEach(p => {
            grid.innerHTML += `
                <div class="product-card" data-id="${p.id}">
                    <div class="card-image-wrapper">
                        <img src="${p.img}" alt="${p.title}">
                        <button class="like-btn" onclick="event.stopPropagation(); this.querySelector('i').classList.toggle('ph'); this.querySelector('i').classList.toggle('ph-fill'); this.querySelector('i').classList.toggle('text-danger');"><i class="ph ph-heart"></i></button>
                    </div>
                    <div class="card-info">
                        <h3 class="product-title">${p.title}</h3>
                        <div class="price-rating">
                            <span class="price">${formatCOP(p.price)}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        const cards = grid.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                openProduct(parseInt(card.getAttribute('data-id')));
            });
        });
    }

    renderProductGrid('home-product-grid', PRODUCTS);

    // --- Searching ---
    const searchInput = document.getElementById('main-search-input');
    const searchResultsContainer = document.getElementById('search-results-container');
    const searchDefaultView = document.getElementById('search-default-view');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if(query.trim() === '') {
            searchResultsContainer.style.display = 'none';
            searchDefaultView.style.display = 'block';
        } else {
            searchResultsContainer.style.display = 'block';
            searchDefaultView.style.display = 'none';
            const matched = PRODUCTS.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
            renderProductGrid('search-results-grid', matched);
        }
    });

    // --- Product Details ---
    function openProduct(id) {
        const prod = PRODUCTS.find(p => p.id === id);
        if(!prod) return;
        activeProduct = prod;
        
        document.getElementById('detail-img').src = prod.img;
        document.getElementById('detail-title').innerText = prod.title;
        document.getElementById('detail-price').innerText = formatCOP(prod.price);
        
        const related = PRODUCTS.filter(p => p.id !== id).sort(() => 0.5 - Math.random()).slice(0, 4);
        renderProductGrid('detail-related-grid', related);
        
        navigate('product');
    }

    document.getElementById('btn-add-to-cart').addEventListener('click', () => {
        if(!activeProduct) return;
        const existing = cart.find(i => i.id === activeProduct.id);
        if(existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...activeProduct, qty: 1 });
        }
        saveState();
        navigate('cart');
    });

    // --- Cart Logic ---
    function updateCartUI() {
        const container = document.getElementById('cart-items-container');
        if(!container) return;
        container.innerHTML = '';
        
        let subtotal = 0;
        let count = 0;

        cart.forEach((item, index) => {
            subtotal += item.price * item.qty;
            count += item.qty;
            container.innerHTML += `
                <div class="cart-item">
                    <div class="cart-img"><img src="${item.img}" alt="${item.title}"></div>
                    <div class="cart-details">
                        <div class="flex-between">
                            <h3 class="cart-title">${item.title}</h3>
                            <i class="ph ph-trash text-sec trash-icon" data-index="${index}" style="cursor:pointer"></i>
                        </div>
                        <p class="cart-meta">Cantidad: ${item.qty}</p>
                        <div class="cart-price-row">
                            <span class="cart-price">${formatCOP(item.price * item.qty)}</span>
                            <div class="quantity-control">
                                <button class="qty-btn minus-btn" data-index="${index}"><i class="ph ph-minus"></i></button>
                                <span class="qty">${item.qty}</span>
                                <button class="qty-btn plus-btn" data-index="${index}"><i class="ph ph-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        const subObj = document.getElementById('cart-subtotal');
        if(subObj) subObj.innerText = formatCOP(subtotal);
        const totObj = document.getElementById('cart-total');
        if(totObj) totObj.innerText = formatCOP(subtotal);
        const headObj = document.getElementById('cart-header-badge');
        if(headObj) headObj.innerText = `${count} ÍTEMS`;
        const navObj = document.getElementById('nav-cart-badge');
        if(navObj) navObj.innerText = count;

        document.querySelectorAll('.trash-icon').forEach(btn => btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            cart.splice(idx, 1);
            saveState();
        }));
        document.querySelectorAll('.plus-btn').forEach(btn => btn.addEventListener('click', (e) => {
            let trg = e.target;
            if(trg.tagName === 'I') trg = trg.parentElement;
            const idx = parseInt(trg.getAttribute('data-index'));
            cart[idx].qty += 1;
            saveState();
        }));
        document.querySelectorAll('.minus-btn').forEach(btn => btn.addEventListener('click', (e) => {
            let trg = e.target;
            if(trg.tagName === 'I') trg = trg.parentElement;
            const idx = parseInt(trg.getAttribute('data-index'));
            if(cart[idx].qty > 1) {
                cart[idx].qty -= 1;
            } else {
                cart.splice(idx, 1);
            }
            saveState();
        }));
    }

    // --- Profile & Modals ---
    function updateProfileUI() {
        if(currentUser) {
            document.getElementById('profile-name-text').innerText = currentUser.name || "Usuario";
        }
    }

    const modalSettings = document.getElementById('modal-settings');
    const modalEdit = document.getElementById('modal-edit-profile');

    document.getElementById('btn-config').addEventListener('click', () => modalSettings.classList.remove('hidden'));
    document.getElementById('btn-settings-top').addEventListener('click', () => modalSettings.classList.remove('hidden'));
    document.getElementById('close-modal-settings').addEventListener('click', () => modalSettings.classList.add('hidden'));

    document.getElementById('btn-edit-profile').addEventListener('click', () => {
        if(currentUser) document.getElementById('edit-name-input').value = currentUser.name || "";
        modalEdit.classList.remove('hidden');
    });
    document.getElementById('close-modal-edit').addEventListener('click', () => modalEdit.classList.add('hidden'));
    
    document.getElementById('btn-save-profile').addEventListener('click', () => {
        if(currentUser) {
            currentUser.name = document.getElementById('edit-name-input').value;
            saveState();
            updateProfileUI();
        }
        modalEdit.classList.add('hidden');
    });

    // --- Search Advanced Interactivity ---
    window.triggerSearch = function(query) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input'));
    };

    const clearSearchBtn = document.querySelector('.search-input-container .clear-btn');
    if(clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            triggerSearch('');
        });
    }

    document.querySelectorAll('.search-suggestions li').forEach(li => {
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => triggerSearch(li.innerText.trim()));
    });

    const borrarTodas = Array.from(document.querySelectorAll('a')).find(el => el.innerText.includes('Borrar Todas'));
    if(borrarTodas) {
        borrarTodas.addEventListener('click', (e) => {
            e.preventDefault();
            const container = document.querySelector('#view-search .chips-container');
            if(container) container.innerHTML = '';
        });
    }

    document.querySelectorAll('#view-search .chip').forEach(chip => {
        chip.style.cursor = 'pointer';
        chip.addEventListener('click', (e) => {
            if(e.target.tagName === 'I') {
                chip.remove();
            } else {
                triggerSearch(chip.textContent.trim());
            }
        });
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const title = card.querySelector('.category-title');
            if(title) triggerSearch(title.innerText.trim());
        });
    });

    // Home Tabs Filtering & Home Chips
    const tabs = document.querySelectorAll('.tabs-container .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.innerText.trim();
            if(category === 'Todo') {
                renderProductGrid('home-product-grid', PRODUCTS);
            } else {
                renderProductGrid('home-product-grid', PRODUCTS.filter(p => p.category.toLowerCase().includes(category.toLowerCase())));
            }
        });
    });

    document.querySelectorAll('#view-home .chip i').forEach(ix => {
        ix.addEventListener('click', (e) => { e.target.parentElement.remove(); });
    });

    // Product Detail View Interactivity
    const dColorCircles = document.querySelectorAll('#view-product .color-circle');
    dColorCircles.forEach(circle => {
        circle.addEventListener('click', () => {
             dColorCircles.forEach(c => c.classList.remove('active'));
             circle.classList.add('active');
        });
    });

    const dSizeBoxes = document.querySelectorAll('#view-product .size-box:not(.disabled)');
    dSizeBoxes.forEach(box => {
         box.addEventListener('click', () => {
              dSizeBoxes.forEach(b => b.classList.remove('active'));
              box.classList.add('active');
         });
    });

    // --- Informational Modals ---
    const MOCK_PAGES = {
        about: {
            title: "Sobre Nosotros",
            body: "<p style='margin-bottom:10px;'>Somos una empresa dedicada a brindarte los mejores productos con la mejor calidad del mercado. Fundados en 2023 con el propósito de conectar necesidades con soluciones excepcionales.</p>"
        },
        contact: {
            title: "Contacto",
            body: "<p style='margin-bottom:10px;'>Para cualquier inquietud, comunícate con nuestro equipo de soporte:</p><ul style='margin-left: 20px; line-height: 1.6;'><li>Email: soporte@tienda.com</li><li>Teléfono: +57 300 000 0000</li><li>Dirección: Centro Empresarial, Bogotá D.C.</li></ul>"
        },
        faq: {
            title: "Preguntas Frecuentes",
            body: "<h4 style='margin-top:10px; margin-bottom:5px;'>¿Cuánto tarda el envío?</h4><p style='margin-bottom:15px; color:var(--text-sec);'>Nuestros envíos tardan entre 2 a 5 días hábiles a todo el territorio nacional de Colombia.</p><h4 style='margin-bottom:5px;'>¿Qué métodos de pago aceptan?</h4><p style='color:var(--text-sec);'>Aceptamos tarjetas de crédito, PSE y Nequi a través de nuestra pasarela de pagos segura.</p>"
        },
        terms: {
            title: "Políticas de Devolución",
            body: "<p style='line-height:1.6;'>Tienes 30 días calendario para solicitar cualquier devolución si el producto se encuentra en su estado original y sin usar. Los costos de envío de la devolución correrán por cuenta del cliente a menos que sea tratado como un defecto de fábrica comprobado.</p>"
        }
    };

    const modalInfo = document.getElementById('modal-info');
    const modalInfoTitle = document.getElementById('modal-info-title');
    const modalInfoBody = document.getElementById('modal-info-body');

    document.querySelectorAll('.info-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-info');
            if(MOCK_PAGES[key]) {
                modalInfoTitle.innerText = MOCK_PAGES[key].title;
                modalInfoBody.innerHTML = MOCK_PAGES[key].body;
                modalInfo.classList.remove('hidden');
            }
        });
    });

    const closeInfoModal = document.getElementById('close-modal-info');
    if(closeInfoModal) {
        closeInfoModal.addEventListener('click', () => modalInfo.classList.add('hidden'));
    }
});
