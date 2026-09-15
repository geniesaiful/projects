const siteNavItems = document.querySelectorAll('.siteHeader nav ul li');
const sections = document.querySelectorAll('.content');

const cartBtn = document.querySelector('.cartButtonArea img');
const cartContainer = document.getElementById('cartContainerId');
let cart = JSON.parse(localStorage.getItem('SHOPPING_APP_Cart')) || [];

const itemAreas = document.querySelectorAll('.itemContainer');
let currentCategory = 'All';
let currentTargetContainer = 'itemAllId';
let maxPriceCeiling = 100;
let searchQuery = '';

let selectedPaymentMethod = 'Credit/Debit Card';
// for admin section
const categoryForm = document.getElementById('addCategoryForm');
const itemForm = document.getElementById('addItemForm');
const categorySelect = document.getElementById('itemCategory');

document.getElementById('contentHomeId').classList.add('active');

siteNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');

        sections.forEach(sec => sec.classList.remove('active'));
        siteNavItems.forEach(nav => nav.classList.remove('active'));

        document.getElementById(targetId).classList.add('active');
        item.classList.add('active');
        if (targetId === 'contentAdminId') {
            loadCategories();
            renderAdminOrdersList();
        }
    });
});

cartBtn.addEventListener('click', () => {
    const targetId = cartBtn.getAttribute('data-target');

    sections.forEach(sec => sec.classList.remove('active'));
    siteNavItems.forEach(nav => nav.classList.remove('active'));

    document.getElementById(targetId).classList.add('active');
    renderCart();
});

function setupSearchInput() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        applyFilters();
    });
}

function setupPriceSlider() {
    const items = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];
    const slider = document.getElementById('priceSlider');
    const label = document.getElementById('priceValueText');
    
    if (!slider || items.length === 0) return;

    const highestPrice = Math.max(...items.map(item => Number(item.price) || 0));
    maxPriceCeiling = Math.ceil(highestPrice / 100) * 100 || 100;

    slider.min = 0;
    slider.max = maxPriceCeiling;
    slider.value = maxPriceCeiling;
    label.textContent = `$0 - $${maxPriceCeiling}`;

    slider.oninput = function() {
        label.textContent = `$0 - $${this.value}`;
        applyFilters();
    };
}

function renderAdminOrdersList() {
    const ordersContainer = document.getElementById('adminOrdersSection');
    const orders = JSON.parse(localStorage.getItem('SHOPPING_APP_Orders')) || [];

    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <h2 class="btrh2">Orders</h2>
            <p class="normalTxt">No orders placed yet.</p>
        `;
        return;
    }

    let ordersHTML = `<h2 class="btrh2">Orders (${orders.length})</h2><div class="adminOrdersList">`;

    orders.forEach(order => {
        const totalQty = order.Items.reduce((sum, item) => sum + item.quantity, 0);
        ordersHTML += `
            <div class="adminOrderCard" data-order-id="${order.Order_Id}">
                <div>
                    <span class="normalTxtBold" style="display:block;">${order.Order_Id}</span>
                    <span class="smallTxt">Items: ${totalQty}</span>
                </div>
                <span class="btrh2">$${Number(order.Total).toFixed(2)}</span>
            </div>
        `;
    });

    ordersHTML += '</div>';
    ordersContainer.innerHTML = ordersHTML;

    ordersContainer.querySelectorAll('.adminOrderCard').forEach(card => {
        card.addEventListener('click', () => {
            const orderId = card.getAttribute('data-order-id');
            renderAdminOrderDetails(orderId);
        });
    });
}
function renderAdminOrderDetails(orderId) {
    const ordersContainer = document.getElementById('adminOrdersSection');
    const orders = JSON.parse(localStorage.getItem('SHOPPING_APP_Orders')) || [];
    const order = orders.find(o => o.Order_Id === orderId);

    if (!order) return;

    // Extract creation date from Order_Id timestamp format (e.g., "order20260917...")
    const rawDateStr = order.Order_Id.replace(/\D/g, ''); 
    let orderDate = new Date();
    
    if (rawDateStr.length >= 8) {
        const year = parseInt(rawDateStr.substring(0, 4), 10);
        const month = parseInt(rawDateStr.substring(4, 6), 10) - 1; // 0-indexed month
        const day = parseInt(rawDateStr.substring(6, 8), 10);
        orderDate = new Date(year, month, day);
    }

    // Add 2 days for estimated delivery
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 2);

    // Format to "17 September, 2026"
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    let itemsHTML = '';
    order.Items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        itemsHTML += `
            <div class="adminOrderItemRow">
                <div class="adminOrderItemMedia">
                    <img src="${item.photo}" alt="${item.title}">
                </div>
                <div style="flex: 1;">
                    <span class="normalTxtBold" style="display:block;">${item.title}</span>
                    <span class="smallTxt">ID: ${item.id || 'N/A'} | Cat: ${item.category}</span>
                </div>
                <span class="normalTxt">$${Number(item.price).toFixed(2)} x ${item.quantity}</span>
                <span class="normalTxtBold" style="min-width: 4rem; text-align: right;">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    const cust = order.Customer || {};

    ordersContainer.innerHTML = `
        <div class="orderDetailsHeader">
            <span class="btrh2Lt" style="font-size: 1.2rem; font-weight: 700;">Order ID: ${order.Order_Id}</span>
            <button type="button" class="closeDetailsBtn" id="closeOrderDetailsBtn">&times;</button>
        </div>
        <hr>
        
        <!-- Customer Details Section -->
        <div class="adminCustomerDetails" style="margin-bottom: 0.75rem;">
            <p class="normalTxtBold" style="margin: 0 0 0.25rem 0;">Customer Details:</p>
            <p class="normalTxt" style="margin: 0;"><strong>Name:</strong> ${cust.Name || 'N/A'}</p>
            <p class="normalTxt" style="margin: 0;"><strong>Address:</strong> ${cust.Address || 'N/A'}</p>
            <p class="normalTxt" style="margin: 0;">${cust.City || ''}${cust.City && cust.Postcode ? ', ' : ''}${cust.Postcode || ''}</p>
            <p class="normalTxt" style="margin: 0.25rem 0 0 0; color: var(--genText1Lt);">
                <strong>Estimated delivery:</strong> ${formattedDeliveryDate}
            </p>
        </div>
        <hr>

        <!-- Only the items list is scrollable -->
        <div class="adminOrderItemsContainer">
            ${itemsHTML}
        </div>
        <hr>

        <div class="summaryRow">
            <span class="normalTxt">Subtotal:</span>
            <span class="normalTxtBold">$${Number(order.Subtotal).toFixed(2)}</span>
        </div>
        <div class="summaryRow">
            <span class="normalTxt">Shipping:</span>
            <span class="normalTxtBold">$${Number(order.Shipping).toFixed(2)}</span>
        </div>
        <div class="summaryRow totalRow">
            <span class="btrh2">Total Paid:</span>
            <span class="btrh2">$${Number(order.Total).toFixed(2)}</span>
        </div>
        <div class="summaryRow" style="margin-top: 0.5rem;">
            <span class="normalTxt">Payment Method:</span>
            <span class="normalTxtBold">${order.Payment}</span>
        </div>
    `;

    document.getElementById('closeOrderDetailsBtn').addEventListener('click', () => {
        renderAdminOrdersList();
    });
}
function filterItemsByCategory(categoryName, targetContainerId) {
    currentCategory = categoryName;
    currentTargetContainer = targetContainerId;
    applyFilters();
}

function applyFilters() {
    const items = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];
    const slider = document.getElementById('priceSlider');
    const selectedMaxPrice = slider ? parseFloat(slider.value) : maxPriceCeiling;

    // Filter 1: Category
    let filtered = currentCategory === 'All' 
        ? items 
        : items.filter(item => item.category === currentCategory);

    // Filter 2: Price Range
    filtered = filtered.filter(item => Number(item.price) <= selectedMaxPrice);

    // Filter 3: Search Query (Title or Description match)
    if (searchQuery !== '') {
        filtered = filtered.filter(item => {
            const titleMatch = item.title ? item.title.toLowerCase().includes(searchQuery) : false;
            const descMatch = item.description ? item.description.toLowerCase().includes(searchQuery) : false;
            return titleMatch || descMatch;
        });
    }

    renderItemGrid(filtered, currentTargetContainer);
}


function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('SHOPPING_APP_Category')) || [];
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const catInput = document.getElementById('catName');
    const newCategory = catInput.value.trim();

    if (newCategory) {
        const categories = JSON.parse(localStorage.getItem('SHOPPING_APP_Category')) || [];
        if (!categories.includes(newCategory)) {
            categories.push(newCategory);
            localStorage.setItem('SHOPPING_APP_Category', JSON.stringify(categories));

            loadCategories();
            renderDynamicCategories();
            updateCategoryCounts();

            catInput.value = '';
            alert('Category added successfully!');
        } else {
            alert('Category already exists!');
        }
    }
});
itemForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const now = new Date();
    const timestampId = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0') +
        String(now.getMilliseconds()).padStart(3, '0');

    const newItem = {
        id: timestampId,
        title: document.getElementById('itemTitle').value.trim(),
        category: document.getElementById('itemCategory').value,
        description: document.getElementById('itemDesc').value.trim(),
        price: parseFloat(document.getElementById('itemPrice').value),
        photo: document.getElementById('itemPhoto').value.trim(),
        extraInfo: document.getElementById('itemExtra').value.trim()
    };

    const items = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];
    items.push(newItem);
    localStorage.setItem('SHOPPING_APP_Items', JSON.stringify(items));

    itemForm.reset();
    alert('Item added successfully!');
    //console.log(newItem);
    populateAllItems();
    updateCategoryCounts();
});
function renderDynamicCategories() {
    const categories = JSON.parse(localStorage.getItem('SHOPPING_APP_Category')) || [];
    const ul = document.querySelector('.lpCategoryList nav ul');
    const itemArea = document.getElementById('itemAreaId');

    ul.innerHTML = `<li data-target="itemAllId" class="menuListItem active">All<span class="mlItemCount" id="mlicAllId">0</span></li>`;
    itemArea.innerHTML = `<section class="itemContainer active" id="itemAllId"></section>`;

    categories.forEach(cat => {

        const safeId = cat.replace(/\s+/g, '');
        const containerId = `item${safeId}Id`;
        const countId = `mlic${safeId}Id`;

        const li = document.createElement('li');
        li.className = 'menuListItem';
        li.setAttribute('data-target', containerId);
        li.innerHTML = `${cat}<span class="mlItemCount" id="${countId}">0</span>`;
        ul.appendChild(li);

        const section = document.createElement('section');
        section.className = 'itemContainer';
        section.id = containerId;
        itemArea.appendChild(section);
    });

    bindCategoryClickEvents();
}
function bindCategoryClickEvents() {
    const navItems = document.querySelectorAll('.leftPanel nav ul li');
    const itemAreas = document.querySelectorAll('.itemContainer');

    navItems.forEach(item => {
        item.addEventListener('click', () => {

            const selectedCategory = item.childNodes[0].textContent.trim();
            const targetId = item.getAttribute('data-target');

            itemAreas.forEach(area => area.classList.remove('active'));
            navItems.forEach(nav => nav.classList.remove('active'));

            const targetContainer = document.getElementById(targetId);
            if (targetContainer) targetContainer.classList.add('active');
            item.classList.add('active');

            filterItemsByCategory(selectedCategory, targetId);
        });
    });
}

function renderItemGrid(items, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = '';

    if (!items || items.length === 0) {
        container.innerHTML = '<p class="normalTxt">No items found.</p>';
        return;
    }

    let cardsHTML = '';

    items.forEach(item => {
       //console.log(item);
        cardsHTML += `
            <article class="itemCard" data-id="${item.id}">
                <div class="cardMedia">
                    <img src="${item.photo}" alt="${item.title}">
                </div>
                <div class="cardBody">
                    <h3 class="itemTitle">${item.title}</h3>
                    <span class="itemPrice">$${Number(item.price).toFixed(2)}</span>
                    <button class="addToCartBtn" type="button" data-id="${item.id}">
                        Add to Cart
                    </button>
                </div>

                <div class="itemTooltip">
                    <p class="normalTxtBold" style="margin: 0 0 0.25rem 0;">${item.title}</p>
                    <p class="smallTxt" style="margin: 0 0 0.5rem 0;">Category: ${item.category}</p>
                    <p class="normalTxt" style="margin: 0 0 0.5rem 0;">${item.description || 'No description available.'}</p>
                    <span class="rcntTxt" style="display: inline-block; font-size: 0.75rem;">${item.extraInfo || 'Standard'}</span>
                </div>
            </article>
        `;
    });

    // 3. Inject all HTML at once
    container.innerHTML = cardsHTML;
}
function populateAllItems() {
    const items = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];
    renderItemGrid(items, 'itemAllId');
}

document.addEventListener('DOMContentLoaded', () => {
    renderDynamicCategories();
    setupPriceSlider();
    setupSearchInput();
    filterItemsByCategory('All', 'itemAllId');
    loadCategories();
    updateCartCount();
    updateCategoryCounts();
    updateAboutStat();
});
document.getElementById('itemAreaId').addEventListener('click', (e) => {
    if (e.target.classList.contains('addToCartBtn')) {
        const itemId = e.target.getAttribute('data-id');
        addToCart(itemId);
    }
});


function renderCart() {
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="normalTxtBold">There is nothing in the cart.</p>';
        return;
    }

    const allItems = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];

    let cartHTML = '<div class="cartLayout">';
    
    cartHTML += '<div class="cartMainSection"><div class="cartList">';
    
    let subtotal = 0;
    let totalItemCount = 0;

    cart.forEach(cartItem => {
        const itemDetails = allItems.find(item => item.id === cartItem.id);

        const itemTotal = itemDetails.price * cartItem.quantity;
        subtotal += itemTotal;
        totalItemCount += cartItem.quantity;

        cartHTML += `
            <div class="cartRow" data-id="${cartItem.id}">
                <div class="cartRowMedia">
                    <img src="${itemDetails.photo}" alt="${itemDetails.title}">
                </div>
                
                <div class="cartRowDetails">
                    <span class="cartRowTitle">${itemDetails.title}</span>
                    <span class="cartRowMeta">ID: ${cartItem.id}</span>
                    <span class="cartRowMeta">Cat: ${itemDetails.category}</span>
                    <span class="cartRowPrice">$${Number(itemDetails.price).toFixed(2)}</span>
                </div>

                <div class="cartQtyControls">
                    <button type="button" class="qtyBtn minusBtn">-</button>
                    <span class="normalTxt boldQty">${cartItem.quantity}</span>
                    <button type="button" class="qtyBtn plusBtn">+</button>
                </div>

                <div class="cartItemTotal">
                    $${itemTotal.toFixed(2)}
                </div>

                <button type="button" class="deleteItemBtn">Delete</button>
            </div>
        `;
    });
    
    cartHTML += '</div>';

    cartHTML += `
        <div class="cartLeftActions">
            <button id="clearCartBtn" class="univCancelBtn" type="button">Clear Cart</button>
        </div>
    </div>`;

    const shippingCharge = 10.00;
    const grandTotal = subtotal + shippingCharge;

    cartHTML += `
        <aside class="orderSummaryPanel">
            <h2 class="btrh2">Order Summary</h2>
            <hr>
            <div class="summaryRow">
                <span class="normalTxt">Subtotal (${totalItemCount} ${totalItemCount === 1 ? 'item' : 'items'}):</span>
                <span class="normalTxtBold">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summaryRow">
                <span class="normalTxt">Shipping Charge:</span>
                <span class="normalTxtBold">$${shippingCharge.toFixed(2)}</span>
            </div>
            <hr>
            <div class="summaryRow totalRow">
                <span class="btrh2">Total:</span>
                <span class="btrh2">$${grandTotal.toFixed(2)}</span>
            </div>
            <button id="checkoutBtn" class="univSubmitBtn checkoutFullBtn" type="button">Proceed to Checkout</button>
        </aside>
    </div>`; 

    cartContainer.innerHTML = cartHTML;
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById('contentCheckoutId').classList.add('active');
            renderCheckout();
        });
    }
    document.getElementById('clearCartBtn').addEventListener('click', () => {
        const isConfirmed = confirm('Are you sure you want to clear your cart?');
        if (isConfirmed) {
            cart = [];
            saveAndRefreshCart();
        }
    });
}

function updateCartCount() {
    const badge = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems > 0 ? totalItems : '';
}
function addToCart(itemId) {
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: itemId, quantity: 1 });
    }

    localStorage.setItem('SHOPPING_APP_Cart', JSON.stringify(cart));

    updateCartCount();
}

function updateItemQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    if (item.quantity + change <= 0) {
        const isConfirmed = confirm('Are you sure you want to remove this item?');
        if (isConfirmed) {
            //removeItemFromCart(itemId);
            cart = cart.filter(i => i.id !== itemId);
            saveAndRefreshCart();
        }
    } else {
        item.quantity += change;
        saveAndRefreshCart();
    }
}
function removeItemFromCart(itemId) {
    const isConfirmed = confirm('Are you sure you want to remove this item?');
    if (isConfirmed) {
        cart = cart.filter(i => i.id !== itemId);
        saveAndRefreshCart();
    }
}
function saveAndRefreshCart() {
    localStorage.setItem('SHOPPING_APP_Cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function renderCheckout() {
    const checkoutContainer = document.getElementById('checkoutContainerId');
    if (cart.length === 0) {
        checkoutContainer.innerHTML = '<p class="normalTxtBold">Your cart is empty.</p>';
        return;
    }

    const allItems = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];
    let subtotal = 0;
    let itemsHTML = '';

    cart.forEach(cartItem => {
        const itemDetails = allItems.find(i => i.id === cartItem.id);
        if (itemDetails) {
            const itemTotal = itemDetails.price * cartItem.quantity;
            subtotal += itemTotal;
            itemsHTML += `
                <div class="checkoutItemRow">
                    <span>${itemDetails.title}</span>
                    <span>$${Number(itemDetails.price).toFixed(2)} x ${cartItem.quantity}</span>
                </div>
            `;
        }
    });

    const shipping = 10.00;
    const total = subtotal + shipping;

    checkoutContainer.innerHTML = `
        <div class="checkoutLayout">
            <!-- Left Side: Shipping & Payment Form -->
            <form id="checkoutForm" class="checkoutLeftSection">
                <div class="checkoutFormGroup">
                    <h2 class="btrh2">1. Shipping Information</h2>
                    <input type="text" id="custName" placeholder="Full Name" required>
                    <input type="email" id="custEmail" placeholder="Email Address" required>
                    <input type="text" id="custAddress" placeholder="Apartment number, House number, Street..." required>
                    <input type="text" id="custCity" placeholder="City" required>
                    <input type="text" id="custPostcode" placeholder="Postcode" required>
                </div>

                <div class="checkoutFormGroup">
                    <h2 class="btrh2">2. Payment Method</h2>
                    <div class="paymentOptions">
                        <button type="button" class="paymentOptionBtn selected" data-method="Credit/Debit Card">Credit/Debit Card</button>
                        <button type="button" class="paymentOptionBtn" data-method="PayPal">PayPal</button>
                        <button type="button" class="paymentOptionBtn" data-method="Cash on Delivery">Cash on Delivery</button>
                    </div>
                </div>

                <button type="submit" class="univSubmitBtn" style="width: 100%; padding: 0.8rem;">Place Order</button>
            </form>

            <!-- Right Side: Order Summary -->
            <aside class="orderSummaryPanel">
                <h2 class="btrh2">Order Summary</h2>
                <hr>
                <div class="checkoutItemsList">
                    ${itemsHTML}
                </div>
                <hr>
                <div class="summaryRow">
                    <span class="normalTxt">Subtotal:</span>
                    <span class="normalTxtBold">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summaryRow">
                    <span class="normalTxt">Shipping:</span>
                    <span class="normalTxtBold">$${shipping.toFixed(2)}</span>
                </div>
                <hr>
                <div class="summaryRow totalRow">
                    <span class="btrh2">Total:</span>
                    <span class="btrh2">$${total.toFixed(2)}</span>
                </div>
            </aside>
        </div>
    `;

    const paymentBtns = checkoutContainer.querySelectorAll('.paymentOptionBtn');
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            paymentBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedPaymentMethod = btn.getAttribute('data-method');
        });
    });

    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        placeOrder(subtotal, shipping, total);
    });
}
function placeOrder(subtotal, shipping, total) {
    const now = new Date();
    const dateTimeStr = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
    
    const randomThree = Math.floor(100 + Math.random() * 900);
    const orderId = `order${dateTimeStr}${randomThree}`;

    const allItems = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];
    const orderItems = cart.map(cartItem => {
        const itemDetails = allItems.find(i => i.id === cartItem.id) || {};
        return {
            id: itemDetails.id || '',
            title: itemDetails.title || '',
            category: itemDetails.category || '',
            description: itemDetails.description || '',
            price: itemDetails.price || 0,
            quantity: cartItem.quantity,
            photo: itemDetails.photo || '',
            extraInfo: itemDetails.extraInfo || ''
        };
    });

    const newOrder = {
        Order_Id: orderId,
        Items: orderItems,
        Subtotal: subtotal,
        Shipping: shipping,
        Total: total,
        Customer: {
            Name: document.getElementById('custName').value.trim(),
            Email: document.getElementById('custEmail').value.trim(),
            Address: document.getElementById('custAddress').value.trim(),
            City: document.getElementById('custCity').value.trim(),
            Postcode: document.getElementById('custPostcode').value.trim()
        },
        Payment: selectedPaymentMethod
    };

    const existingOrders = JSON.parse(localStorage.getItem('SHOPPING_APP_Orders')) || [];
    existingOrders.push(newOrder);
    localStorage.setItem('SHOPPING_APP_Orders', JSON.stringify(existingOrders));

    cart = [];
    localStorage.setItem('SHOPPING_APP_Cart', JSON.stringify(cart));
    updateCartCount();
    updateAboutStat();

    renderOrderSuccess(orderId);
}
function renderOrderSuccess(orderId) {
    const checkoutContainer = document.getElementById('checkoutContainerId');
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'];
    
    let confettiHTML = '<div class="confettiWrapper">';
    for (let i = 0; i < 40; i++) {
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const color = colors[Math.floor(Math.random() * colors.length)];
        confettiHTML += `<div class="confettiPiece" style="left: ${left}%; animation-delay: ${delay}s; background-color: ${color};"></div>`;
    }
    confettiHTML += '</div>';

    checkoutContainer.innerHTML = `
        <div class="orderSuccessContainer">
            ${confettiHTML}
            <h1 class="btrh1" style="font-size: 2.2rem; margin-bottom: 1rem;">Congratulations!</h1>
            <p class="btrh2" style="margin-bottom: 0.5rem;">Order placed!</p>
            <p class="btrh2Lt" style="font-size: 1.1rem; margin-bottom: 0.5rem;">Order number is <strong>${orderId}</strong>.</p>
            <p class="normalTxtBold" style="font-size: 1rem; color: var(--genText1Lt); margin-bottom: 2rem;">Your item is on the way to you!!!</p>
            <button id="backToHomeBtn" class="univSubmitBtn" type="button">Continue Shopping</button>
        </div>
    `;

    document.getElementById('backToHomeBtn').addEventListener('click', () => {
        sections.forEach(sec => sec.classList.remove('active'));
        siteNavItems.forEach(nav => nav.classList.remove('active'));
        document.getElementById('contentHomeId').classList.add('active');
        document.querySelector('.siteHeader nav ul li[data-target="contentHomeId"]').classList.add('active');
    });
}

cartContainer.addEventListener('click', (e) => {
    const row = e.target.closest('.cartRow');
    if (!row) return;

    const itemId = row.getAttribute('data-id');

    if (e.target.classList.contains('plusBtn')) {
        updateItemQuantity(itemId, 1);
    } else if (e.target.classList.contains('minusBtn')) {
        updateItemQuantity(itemId, -1);
    } else if (e.target.classList.contains('deleteItemBtn')) {
        removeItemFromCart(itemId);
    }
});

function updateCategoryCounts() {
    const items = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];
    const categories = JSON.parse(localStorage.getItem('SHOPPING_APP_Category')) || [];

    const allBadge = document.getElementById('mlicAllId');
    if (allBadge) allBadge.textContent = items.length;

    categories.forEach(cat => {
        const safeId = cat.replace(/\s+/g, '');
        const badge = document.getElementById(`mlic${safeId}Id`);
        if (badge) {
            const count = items.filter(item => item.category === cat).length;
            badge.textContent = count;
        }
    });
}

function updateAboutStat(){
    const items = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];
    const categories = JSON.parse(localStorage.getItem('SHOPPING_APP_Category')) || [];
    const orders = JSON.parse(localStorage.getItem('SHOPPING_APP_Orders')) || [];

    document.getElementById('aboutCatCount').textContent = categories.length;
    document.getElementById('aboutItemCount').textContent = items.length;
    document.getElementById('aboutOrderCount').textContent = orders.length;
}