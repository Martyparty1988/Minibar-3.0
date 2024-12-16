const items = [];

document.getElementById('addItemButton').addEventListener('click', async () => {
    const name = document.getElementById('itemName').value.trim();
    const price = parseFloat(document.getElementById('itemPrice').value);
    const currency = document.getElementById('itemCurrency').value;

    if (name && price && currency) {
        const newItem = { name, price, currency };
        await addItemToBackend(newItem); // Save to backend
        await fetchItems(); // Reload items
    } else {
        alert('Please fill out all fields!');
    }
});

// Fetch items from backend
async function fetchItems() {
    const response = await fetch('http://localhost:3000/items');
    const items = await response.json();
    renderItems(items);
}

function renderItems(items) {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = items.map((item, index) => `
        <div class="flex items-center justify-between bg-white p-2 border rounded">
            <span>${item.name} (${item.price} ${item.currency})</span>
            <input type="number" data-index="${index}" class="item-quantity border p-1 rounded w-16" placeholder="Qty" />
        </div>
    `).join('');

    document.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('input', () => calculateTotals(items));
    });
}

async function addItemToBackend(item) {
    await fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
}

function calculateTotals(items) {
    const currency = 'CZK'; // Default currency
    let total = 0;

    document.querySelectorAll('.item-quantity').forEach(input => {
        const index = parseInt(input.dataset.index);
        const quantity = parseFloat(input.value) || 0;
        const item = items[index];
        if (item.currency === 'EUR') {
            total += item.price * 24.5 * quantity; // Example EUR to CZK rate
        } else {
            total += item.price * quantity;
        }
    });

    document.getElementById('invoiceTotal').innerText = `Total: ${total.toFixed(2)} ${currency}`;
}

document.getElementById('generateInvoice').addEventListener('click', async () => {
    const invoiceDetails = document.getElementById('invoiceDetails');
    const items = document.querySelectorAll('.item-quantity');
    const invoiceData = [];

    items.forEach(input => {
        const quantity = parseInt(input.value) || 0;
        if (quantity > 0) {
            const itemName = input.parentElement.querySelector('span').textContent;
            invoiceData.push({ name: itemName, quantity });
        }
    });

    const invoice = {
        date: new Date().toLocaleDateString(),
        details: invoiceData,
        total: document.getElementById('invoiceTotal').textContent,
    };

    await saveInvoiceToBackend(invoice);
});

async function saveInvoiceToBackend(invoice) {
    await fetch('http://localhost:3000/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
    });
}