(() => {
  const CRM_URL = (window.AMEZ_CRM_API_URL || 'http://localhost:3000').replace(/\/$/, '');
  const STORAGE_KEY = 'amaze-products-cart-v1';
  let catalog = [];

  const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);
  const getCart = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
  const saveCart = cart => { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); updateCount(cart); };
  const updateCount = (cart = getCart()) => document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = cart.reduce((sum, item) => sum + item.qty, 0); });
  const productImage = product => product.mainImage ? `${CRM_URL}${product.mainImage}` : '';

  function addProduct(product) {
    const cart = getCart();
    const item = cart.find(entry => entry.id === product.id);
    if (item) item.qty += 1;
    else cart.push({ id: product.id, name: product.name, sku: product.sku, price: product.basePrice, gst: product.gstPercent, image: product.mainImage, qty: 1 });
    saveCart(cart);
    renderCart();
  }

  function changeQuantity(id, delta) {
    const cart = getCart().map(item => item.id === id ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0);
    saveCart(cart); renderCart();
  }

  function renderCart() {
    const cart = getCart();
    const list = document.getElementById('cartItems');
    const empty = document.getElementById('emptyCart');
    if (!list) return;
    list.innerHTML = cart.map(item => `
      <article class="cart-item">
        ${item.image ? `<img class="cart-thumb" src="${CRM_URL}${item.image}" alt="${item.name}">` : '<div class="cart-thumb placeholder"><i class="fas fa-box"></i></div>'}
        <div><h3>${item.name}</h3><p>${item.sku || 'Product'} · ${money(item.price)} each · GST ${item.gst}%</p></div>
        <div class="cart-item-right"><b>${money(item.price * item.qty)}</b><div class="qty"><button type="button" data-minus="${item.id}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-plus="${item.id}" aria-label="Increase quantity">+</button></div><button type="button" class="remove" data-remove="${item.id}">Remove</button></div>
      </article>`).join('');
    list.hidden = cart.length === 0;
    empty.hidden = cart.length !== 0;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const gst = cart.reduce((sum, item) => sum + item.price * item.qty * item.gst / 100, 0);
    document.getElementById('cartSubtotal').textContent = money(subtotal);
    document.getElementById('cartGst').textContent = money(gst);
    document.getElementById('cartTotal').textContent = money(subtotal + gst);
    list.querySelectorAll('[data-minus]').forEach(button => button.onclick = () => changeQuantity(button.dataset.minus, -1));
    list.querySelectorAll('[data-plus]').forEach(button => button.onclick = () => changeQuantity(button.dataset.plus, 1));
    list.querySelectorAll('[data-remove]').forEach(button => button.onclick = () => changeQuantity(button.dataset.remove, -Number.MAX_SAFE_INTEGER));
  }

  function renderCatalog() {
    const target = document.getElementById('catalogue');
    if (!target) return;
    const query = (document.getElementById('catalogueSearch')?.value || '').trim().toLowerCase();
    const products = catalog.filter(product => !query || `${product.name} ${product.sku || ''} ${product.category}`.toLowerCase().includes(query));
    target.innerHTML = products.map(product => `
      <article class="catalogue-card">
        ${product.mainImage ? `<img src="${productImage(product)}" alt="${product.name}">` : '<div class="placeholder"><i class="fas fa-box"></i></div>'}
        <small>${product.category}</small><h3>${product.name}</h3><p>${product.sku || 'Product'} · GST ${product.gstPercent}%</p><b>${money(product.basePrice)} / ${product.unit}</b>
        <button type="button" data-product-id="${product.id}"><i class="fas fa-cart-plus"></i> Add to cart</button>
      </article>`).join('') || '<p>No matching products found.</p>';
    target.querySelectorAll('[data-product-id]').forEach(button => button.onclick = () => addProduct(catalog.find(product => product.id === button.dataset.productId)));
  }

  async function loadCatalog() {
    const target = document.getElementById('catalogue');
    try {
      const response = await fetch(`${CRM_URL}/api/catalog`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Catalogue unavailable');
      catalog = result.products;
      renderCatalog();
    } catch (error) {
      if (target) target.innerHTML = '<p>We could not load the catalogue. Please refresh or contact our team.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCount(); renderCart(); loadCatalog();
    document.getElementById('catalogueSearch')?.addEventListener('input', renderCatalog);
    document.getElementById('clearCart')?.addEventListener('click', () => { saveCart([]); renderCart(); });
    document.getElementById('cartRequestForm')?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const cart = getCart();
      const message = document.getElementById('requestMessage');
      if (!cart.length) { message.className = 'request-message error'; message.textContent = 'Add at least one product before sending your request.'; return; }
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true; button.textContent = 'Sending request...';
      const fields = new FormData(form);
      try {
        const response = await fetch(`${CRM_URL}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fields.get('name'), companyName: fields.get('company'), email: fields.get('email'), phone: fields.get('phone'), country: fields.get('country'), note: fields.get('note'), items: cart.map(item => ({ id: item.id, quantity: item.qty })) }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not send request.');
        form.reset(); saveCart([]); renderCart(); message.className = 'request-message success'; message.textContent = `Your order request ${result.orderNumber} has been sent. Our team will contact you shortly.`;
      } catch (error) { message.className = 'request-message error'; message.textContent = error.message || 'Could not send request.'; }
      finally { button.disabled = false; button.innerHTML = 'Send quote request <i class="fas fa-arrow-right"></i>'; }
    });
  });
})();
