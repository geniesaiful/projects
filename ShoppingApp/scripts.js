const siteNavItems = document.querySelectorAll('.siteHeader nav ul li');
const sections = document.querySelectorAll('.content');
const cartBtn = document.querySelector('.cartButtonArea img');
const cartContainer = document.getElementById('cartContainerId');

let cart = JSON.parse(localStorage.getItem('SHOPPING_APP_Cart')) || [];
const leftPanelNavItems = document.querySelectorAll('.leftPanel nav ul li');
const itemAreas = document.querySelectorAll('.itemContainer');
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


function filterItemsByCategory(categoryName, targetContainerId) {
    const items = JSON.parse(localStorage.getItem('SHOPPING_APP_Items')) || [];

    let filteredItems;

    if (categoryName === 'All') {
        filteredItems = items;
    } else {
        filteredItems = items.filter(item => item.category === categoryName);
    }
    renderItemGrid(filteredItems, targetContainerId);
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
    filterItemsByCategory('All', 'itemAllId');
    //populateAllItems();
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