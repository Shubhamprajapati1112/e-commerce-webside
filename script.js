const products = [
    { id: 1, name: 'Premium Wireless Headphones', category: 'Electronics', price: 2499, rating: 4.8, badge: 'Popular', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', description: 'Premium wireless headphones with powerful sound, comfortable ear cushions and long battery life.' },
    { id: 2, name: 'Smart Watch Series X', category: 'Electronics', price: 3299, rating: 4.7, badge: 'New', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', description: 'Modern smartwatch with fitness tracking, notifications and a stylish premium design.' },
    { id: 3, name: 'Classic Denim Jacket', category: 'Fashion', price: 1799, rating: 4.6, badge: 'Sale', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', description: 'Classic denim jacket designed for everyday style and comfortable casual wear.' },
    { id: 4, name: 'Running Sneakers', category: 'Shoes', price: 2199, rating: 4.9, badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', description: 'Lightweight running sneakers with a comfortable sole for daily running and workouts.' },
    { id: 5, name: 'Minimal Leather Watch', category: 'Accessories', price: 1599, rating: 4.5, badge: '', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80', description: 'Elegant leather strap watch with a minimal design suitable for casual and formal occasions.' },
    { id: 6, name: 'Cotton Casual T-Shirt', category: 'Fashion', price: 799, rating: 4.4, badge: 'Sale', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80', description: 'Comfortable cotton T-shirt with a clean design for everyday casual styling.' },
    { id: 7, name: 'Modern Backpack', category: 'Accessories', price: 1299, rating: 4.7, badge: 'Popular', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', description: 'Spacious modern backpack with multiple compartments for work, college and travel.' },
    { id: 8, name: 'Wireless Gaming Mouse', category: 'Electronics', price: 1499, rating: 4.8, badge: 'New', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80', description: 'Responsive wireless gaming mouse with ergonomic design and accurate tracking.' }
];

let cart = [];
let activeCategory = 'All';
let wishlist = JSON.parse(localStorage.getItem('shopsphere-wishlist') || '[]');

const money = value => `₹${value.toLocaleString('en-IN')}`;

function getStars(rating) {
    return Array.from({ length: 5 }, (_, index) =>
        `<i class="${index < Math.floor(rating) ? 'fa-solid' : 'fa-regular'} fa-star"></i>`
    ).join('');
}

function displayProducts(productList) {
    const container = document.getElementById('products-container');
    const resultCount = document.getElementById('results-count');
    resultCount.textContent = `${productList.length} ${productList.length === 1 ? 'piece' : 'pieces'} in this edit`;
    container.innerHTML = '';

    if (!productList.length) {
        container.innerHTML = '<div class="no-products"><h3>Nothing found yet.</h3><p>Try another search or category.</p></div>';
        return;
    }

    productList.forEach((product, index) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 50}ms`;
        const isSaved = wishlist.includes(product.id);
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <button class="wishlist-btn ${isSaved ? 'active' : ''}" onclick="toggleWishlist(${product.id})" aria-label="${isSaved ? 'Remove from wishlist' : 'Add to wishlist'}">
                    <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <div class="rating">${getStars(product.rating)} <span>${product.rating}</span></div>
                <div class="product-bottom">
                    <span class="price">${money(product.price)}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">Add <i class="fa-solid fa-plus"></i></button>
                </div>
                <button class="details-btn" onclick="showProduct(${product.id})">View details <i class="fa-solid fa-arrow-right"></i></button>
            </div>`;
        container.appendChild(card);
    });
}

function getVisibleProducts() {
    const query = document.getElementById('search').value.toLowerCase().trim();
    let visible = products.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesQuery = `${product.name} ${product.category}`.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });
    const sort = document.getElementById('sort-select').value;
    if (sort === 'price-low') visible.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') visible.sort((a, b) => b.price - a.price);
    if (sort === 'rating') visible.sort((a, b) => b.rating - a.rating);
    return visible;
}

function refreshProducts() { displayProducts(getVisibleProducts()); }
function searchProducts() { refreshProducts(); }
function sortProducts() { refreshProducts(); }

function filterProducts(category) {
    activeCategory = category;
    document.querySelectorAll('.category-btn').forEach(button => button.classList.toggle('active', button.textContent.trim().includes(category) || (category === 'All' && button.textContent.trim() === 'All')));
    refreshProducts();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleWishlist(productId) {
    wishlist = wishlist.includes(productId) ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
    localStorage.setItem('shopsphere-wishlist', JSON.stringify(wishlist));
    refreshProducts();
    showToast(wishlist.includes(productId) ? 'Saved to your wishlist' : 'Removed from your wishlist');
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) existingProduct.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    updateCart();
    showToast(`${product.name} added to your bag`);
    openCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
    document.getElementById('cart-total').textContent = money(totalPrice);
    if (!cart.length) {
        cartItems.innerHTML = '<p class="empty-cart">Your bag is waiting for something good.</p>';
        return;
    }
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4><p>${money(item.price)}</p>
                <div class="quantity">
                    <button onclick="changeQuantity(${item.id}, -1)" aria-label="Decrease quantity">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove item"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        </div>`).join('');
}

function changeQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    if (!product) return;
    product.quantity += change;
    if (product.quantity <= 0) cart = cart.filter(item => item.id !== productId);
    updateCart();
}
function removeFromCart(productId) { cart = cart.filter(item => item.id !== productId); updateCart(); showToast('Item removed from your bag'); }
function openCart() { document.getElementById('cart-sidebar').classList.add('active'); document.getElementById('cart-overlay').classList.add('active'); document.body.classList.add('no-scroll'); }
function closeCart() { document.getElementById('cart-sidebar').classList.remove('active'); document.getElementById('cart-overlay').classList.remove('active'); document.body.classList.remove('no-scroll'); }

function showProduct(productId) {
    const product = products.find(item => item.id === productId);
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-price').textContent = money(product.price);
    document.getElementById('modal-rating').innerHTML = `${getStars(product.rating)} <span>${product.rating}</span>`;
    document.getElementById('modal-review-text').textContent = '“' + (product.rating >= 4.8 ? 'Beautifully made and even better in daily use.' : 'A thoughtful upgrade to my everyday essentials.') + '”';
    document.getElementById('modal-add-btn').onclick = () => { addToCart(product.id); closeModal(); };
    document.getElementById('modal-overlay').classList.add('active');
    document.body.classList.add('no-scroll');
}
function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); document.body.classList.remove('no-scroll'); }
function toggleMenu() { document.querySelector('.navbar nav').classList.toggle('active'); }
function checkout() {
    if (!cart.length) { showToast('Your bag is empty'); return; }
    showToast('Checkout is ready to connect to your payment gateway');
}
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeCart(); closeModal(); }
});
document.getElementById('modal-overlay').addEventListener('click', event => {
    if (event.target.id === 'modal-overlay') closeModal();
});
document.querySelectorAll('.navbar nav a').forEach(link => link.addEventListener('click', () => document.querySelector('.navbar nav').classList.remove('active')));

displayProducts(products);
updateCart();
