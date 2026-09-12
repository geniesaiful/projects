const siteNavItems = document.querySelectorAll('.siteHeader nav ul li');
const sections = document.querySelectorAll('.content');

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

leftPanelNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const selectedCategory = item.innerText.trim();
        const targetId = item.getAttribute('data-target');

        itemAreas.forEach(itemCat => itemCat.classList.remove('active'));
        leftPanelNavItems.forEach(nav => nav.classList.remove('active'));

        document.getElementById(targetId).classList.add('active');
        item.classList.add('active');

        // Execute your category filter logic here
        filterItemsByCategory(selectedCategory);
    });
});

function filterItemsByCategory(category) {
    console.log(`Filtering home contents by: ${category}`);
    // Add your logic to render/filter items based on the clicked category
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
        console.log(item);
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
    populateAllItems();
    loadCategories();
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
