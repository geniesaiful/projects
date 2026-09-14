const siteNavItems = document.querySelectorAll('.siteHeader nav ul li');
const sections = document.querySelectorAll('.content');

const cartBtn = document.querySelector('.cartButtonArea img');
const cartContainer = document.getElementById('cartContainerId');
let cart = JSON.parse(localStorage.getItem('SHOPPING_APP_Cart')) || [];

const leftPanelNavItems = document.querySelectorAll('.leftPanel nav ul li');
const itemAreas = document.querySelectorAll('.itemContainer');
let currentCategory = 'All';
let currentTargetContainer = 'itemAllId';
let maxPriceCeiling = 100;

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

leftPanelNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const selectedCategory = item.innerText.trim();
        const targetId = item.getAttribute('data-target');

        itemAreas.forEach(itemCat => itemCat.classList.remove('active'));
        leftPanelNavItems.forEach(nav => nav.classList.remove('active'));

        document.getElementById(targetId).classList.add('active');
        item.classList.add('active');

        filterItemsByCategory(selectedCategory, targetId);
    });
});

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
    const orders = JSON.parse(localStorage.getItem('SHOPAPP_ORDERS')) || [];

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
    const orders = JSON.parse(localStorage.getItem('SHOPAPP_ORDERS')) || [];
    const order = orders.find(o => o.Order_Id === orderId);

    if (!order) return;

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

    ordersContainer.innerHTML = `
        <div class="orderDetailsHeader">
            <span class="btrh2Lt" style="font-size: 1.2rem; font-weight: 700;">Order ID: ${order.Order_Id}</span>
            <button type="button" class="closeDetailsBtn" id="closeOrderDetailsBtn">&times;</button>
        </div>
        <hr>
        <div style="flex: 1; overflow-y: auto; margin-bottom: 1rem;">
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

    // Close button returns to order list
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

    // Stage 1: Filter by category
    let categoryFiltered = currentCategory === 'All' 
        ? items 
        : items.filter(item => item.category === currentCategory);

    // Stage 2: Filter by price range (0 to slider value)
    const finalFilteredItems = categoryFiltered.filter(item => Number(item.price) <= selectedMaxPrice);

    renderItemGrid(finalFilteredItems, currentTargetContainer);
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
});


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
    setupPriceSlider();
    filterItemsByCategory('All', 'itemAllId');
    loadCategories();
    updateCartCount();
});
document.getElementById('itemAreaId').addEventListener('click', (e) => {
    if (e.target.classList.contains('addToCartBtn')) {
        const itemId = e.target.getAttribute('data-id');
        addToCart(itemId);
    }
});
function editAItem() {
    
    const items = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];
    const targetItem = items.find(item => item.id === '20260912113619847');

    // 3. Update properties directly if found
    if (targetItem) {
        targetItem.title = 'Leather belt';
        targetItem.category = 'Accessories';
        targetItem.description = 'Original buffalo leather belt.';
        targetItem.price = 55.75;
        targetItem.photo = 'resources/belt1.jpg';
        targetItem.extraInfo = 'New Arrival';

        // 4. Save updated array back to local storage
        localStorage.setItem('SHOPPING_APP_Items', JSON.stringify(items));
    }
}
//editAItem();

function updateCartCount(newCount) {
  const badge = document.getElementById('cartCount');
  badge.textContent = newCount > 0 ? newCount : '';
}
//updateCartCount(5);

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

    const existingOrders = JSON.parse(localStorage.getItem('SHOPAPP_ORDERS')) || [];
    existingOrders.push(newOrder);
    localStorage.setItem('SHOPAPP_ORDERS', JSON.stringify(existingOrders));

    // Reset Cart & Redirect
    cart = [];
    localStorage.setItem('SHOPPING_APP_Cart', JSON.stringify(cart));
    updateCartCount();

    alert(`Order placed successfully!\nOrder ID: ${orderId}`);

    // Navigate back to Home
    sections.forEach(sec => sec.classList.remove('active'));
    siteNavItems.forEach(nav => nav.classList.remove('active'));
    document.getElementById('contentHomeId').classList.add('active');
    document.querySelector('.siteHeader nav ul li[data-target="contentHomeId"]').classList.add('active');
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