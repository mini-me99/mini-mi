// Tab switching functionality
function showTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    // Show the selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }

    // Update active tab link
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Load content based on tab
    switch(tabId) {
        case 'shop':
            displayProducts();
            break;
        case 'scan':
            initializeQRScanner();
            break;
        case 'cart':
            displayCart();
            break;
        case 'checkout':
            displayOrderDetails();
            break;
        case 'home':
            displayFeaturedProducts();
            break;
    }
}

// Initialize QR Scanner
function initializeQRScanner() {
    const html5QrCode = new Html5Qrcode("reader");
    const config = { 
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    function onScanSuccess(decodedText, decodedResult) {
        // Stop scanning after successful scan
        html5QrCode.stop().then(() => {
            // First check if it's a product QR code
            const product = products.find(p => p.qrCode === decodedText);
            if (product) {
                showProductDetails(product);
            } else {
                // Check if it's a valid URL
                try {
                    const url = new URL(decodedText);
                    if (confirm(`Open this URL: ${url.href}?`)) {
                        window.open(url.href, '_blank');
                    }
                } catch (e) {
                    // If it's not a URL, show the content
                    alert(`QR Code Content: ${decodedText}`);
                }
            }
        }).catch((err) => {
            console.error('Error stopping scanner:', err);
        });
    }

    function onScanError(errorMessage, error) {
        // Handle scan errors silently
        console.warn(errorMessage);
    }

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanError
    ).catch((err) => {
        console.error('Error starting scanner:', err);
        alert('Error starting camera. Please make sure you have granted camera permissions.');
    });
}

function showProductDetails(product) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${product.name}</h2>
            <img src="images/${product.images[0]}" alt="${product.name}" style="max-width: 100%; height: auto;">
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Size: ${product.size}</p>
            <div class="product-actions">
                <input type="number" id="modalQuantity${product.id}" value="1" min="1" max="10">
                <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, 'images/${product.images[0]}')" class="btn">Add to Cart</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking the X or outside the modal
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Product data
const products = [
    {
        id: 1,
        name: 'Cute T-Shirt',
        price: 19.99,
        description: 'Adorable cotton t-shirt with cute design',
        category: 'tops',
        size: '2-3y',
        images: ['product1-1.jpg', 'product1-2.jpg'],
        qrCode: 'MINIME-TSHIRT-001'
    },
    {
        id: 2,
        name: 'Stylish Pants',
        price: 24.99,
        description: 'Comfortable and stylish pants for active kids',
        category: 'bottoms',
        size: '4-5y',
        images: ['product2-1.jpg', 'product2-2.jpg'],
        qrCode: 'MINIME-PANTS-001'
    },
    {
        id: 3,
        name: 'Adorable Dress',
        price: 29.99,
        description: 'Beautiful dress perfect for special occasions',
        category: 'dresses',
        size: '2-3y',
        images: ['product3-1.jpg', 'product3-2.jpg'],
        qrCode: 'MINIME-DRESS-001'
    },
    {
        id: 4,
        name: 'Cozy Jacket',
        price: 34.99,
        description: 'Warm and cozy jacket for cold days',
        category: 'tops',
        size: '6-7y',
        images: ['product4-1.jpg', 'product4-2.jpg'],
        qrCode: 'MINIME-JACKET-001'
    }
];

// Generate 100 products
for (let i = 5; i <= 100; i++) {
    const categories = ['tops', 'bottoms', 'dresses', 'accessories'];
    const sizes = ['2-3y', '4-5y', '6-7y', '8-9y', '10-12y'];
    const basePrice = 19.99;
    const priceVariation = Math.floor(Math.random() * 30) + 1; // Random price variation between 1-30

    products.push({
        id: i,
        name: `Product ${i}`,
        price: (basePrice + priceVariation).toFixed(2),
        description: `Description for product ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
        images: [`product${i}-1.jpg`, `product${i}-2.jpg`],
        qrCode: `MINIME-PRODUCT-${i.toString().padStart(3, '0')}`
    });
}

function displayProducts() {
    const productsContainer = document.querySelector('.products-grid');
    productsContainer.innerHTML = '';

    const categoryFilter = document.getElementById('category-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;

    const filteredProducts = products.filter(product => {
        const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
        const sizeMatch = sizeFilter === 'all' || product.size === sizeFilter;
        return categoryMatch && sizeMatch;
    });

    filteredProducts.forEach(product => {
        productsContainer.innerHTML += `
            <div class="product">
                <a href="product-details.html?id=${product.id}">
                    <img src="images/${product.images[0]}" alt="${product.name}" width="300">
                </a>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
                <div class="product-actions">
                    <input type="number" id="quantity${product.id}" value="1" min="1" max="10">
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, 'images/${product.images[0]}')" class="btn">Add to Cart</button>
                    <a href="product-details.html?id=${product.id}" class="btn view-all-btn">View All</a>
                </div>
            </div>
        `;
    });
}

function displayFeaturedProducts() {
    const featuredContainer = document.querySelector('.featured-grid');
    featuredContainer.innerHTML = '';

    // Show first 2 products as featured
    products.slice(0, 2).forEach(product => {
        featuredContainer.innerHTML += `
            <div class="product">
                <a href="product-details.html?id=${product.id}">
                    <img src="images/${product.images[0]}" alt="${product.name}" width="300">
                </a>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
                <div class="product-actions">
                    <input type="number" id="quantity${product.id}" value="1" min="1" max="10">
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, 'images/${product.images[0]}')" class="btn">Add to Cart</button>
                    <a href="product-details.html?id=${product.id}" class="btn view-all-btn">View All</a>
                </div>
            </div>
        `;
    });
}

function filterProducts() {
    displayProducts();
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, name, price, image) {
    // Get quantity from the input field
    const quantityInput = document.querySelector(`input[id="quantity${productId}"], input[id="modalQuantity${productId}"]`);
    let quantity = 1;
    
    if (quantityInput) {
        quantity = Number(quantityInput.value);
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        } else if (quantity > 10) {
            quantity = 10;
        }
    }
    
    // Create cart item
    const cartItem = {
        productId: productId,
        name: name,
        price: price,
        quantity: quantity,
        image: image
    };
    
    // Add to cart
    cart.push(cartItem);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show confirmation
    alert(quantity + " " + name + "(s) added to cart!");
    
    // Update display
    showTab('cart');
    updateCartTotal();
}

function displayCart() {
    let cartContent = document.getElementById('cart-content');
    cartContent.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartContent.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartContent.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="max-width: 100px;">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="remove-item">×</button>
            </div>
        `;
    });
    
    updateCartTotal();
}

function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return;
    
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total-amount').textContent = `$${total.toFixed(2)}`;
}

function displayOrderDetails() {
    let orderDetails = document.getElementById('order-details');
    orderDetails.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        orderDetails.innerHTML = '<p>No items in cart.</p>';
        return;
    }

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderDetails.innerHTML += `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" width="300">
                <div class="order-item-details">
                    <h3>${item.name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.price}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                </div>
                <input type="hidden" name="items[]" value="${item.name} (${item.quantity}) - ${itemTotal.toFixed(2)}">
                <input type="hidden" name="images[]" value="${item.image}">
            </div>
        `;
    });
    
    orderDetails.innerHTML += `
        <div class="order-total">
            <h3>Total: $${total.toFixed(2)}</h3>
            <input type="hidden" name="total" value="${total.toFixed(2)}">
        </div>
    `;
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    showTab('home'); // Switch to home tab after clearing cart
}

function showLightbox(productId) {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    lightboxContent.innerHTML = ''; // Clear previous images
    const product = products.find(p => p.id === productId);

    if (product && product.images) {
        product.images.forEach(image => {
            lightboxContent.innerHTML += `<img src="images/${image}" alt="${product.name}" class="lightbox-image">`;
        });
        lightbox.style.display = 'flex';
    }
}

function hideLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Show home tab by default
    showTab('home');
}); 