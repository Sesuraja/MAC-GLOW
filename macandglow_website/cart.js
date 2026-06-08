// ── CART ──────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('lumiere_cart') || '[]');

function saveCart() {
  localStorage.setItem('lumiere_cart', JSON.stringify(cart));
}

function addToCart(name, price, qty = 1) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, qty });
  }
  saveCart();
  updateCartUI();
  showToast(`${name} added to cart! 🛍️`);
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(name);
  else { saveCart(); updateCartUI(); renderCartItems(); }
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cartCount');
  const ic = document.getElementById('cartItemCount');
  if (el) el.textContent = total;
  if (ic) ic.textContent = `(${total})`;
  renderCartItems();
}

function renderCartItems() {
  const el = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');
  if (!el) return;

  if (cart.length === 0) {
    el.innerHTML = `<div class="cart-empty"><div style="font-size:3rem">🛍️</div><p>Your cart is empty</p><a href="shop.html" class="btn-primary" style="margin-top:1rem;display:inline-block;">Start Shopping</a></div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-info">
        <p class="ci-name">${item.name}</p>
        <p class="ci-price">₹${item.price.toLocaleString()}</p>
      </div>
      <div class="ci-qty">
        <button onclick="updateQty('${item.name}', -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="updateQty('${item.name}', 1)">+</button>
      </div>
      <button class="ci-remove" onclick="removeFromCart('${item.name}')">✕</button>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (footer) footer.style.display = 'block';
  if (totalEl) totalEl.textContent = '₹' + subtotal.toLocaleString();
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
  renderCartItems();
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  const cartBtn = document.querySelector('.cart-btn');
  
  if (sidebar && sidebar.classList.contains('open')) {
    if (!sidebar.contains(event.target) && !cartBtn?.contains(event.target)) {
      toggleCart();
    }
  }
});

// init
updateCartUI();