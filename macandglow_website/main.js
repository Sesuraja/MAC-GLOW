// ── MAIN ──────────────────────────────────────

// Navbar scroll effect
window.addEventListener('scroll', function() {
  var nb = document.getElementById('navbar');
  if (nb) {
    if (window.scrollY > 40) {
      nb.classList.add('scrolled');
    } else {
      nb.classList.remove('scrolled');
    }
  }
});

// Mobile menu
function toggleMenu() {
  var navLinks = document.getElementById('navLinks');
  var hamburger = document.getElementById('hamburger');
  if (navLinks) navLinks.classList.toggle('open');
  if (hamburger) hamburger.classList.toggle('open');
}

// Search functions
function toggleSearch() {
  var sb = document.getElementById('searchBar');
  if (!sb) return;
  sb.classList.toggle('open');
  if (sb.classList.contains('open')) {
    setTimeout(function() {
      var input = document.getElementById('searchInput');
      if (input) input.focus();
    }, 100);
  }
}

function handleSearch(val) {
  var res = document.getElementById('searchResults');
  if (!res) return;
  if (!val.trim()) {
    res.innerHTML = '';
    return;
  }
  var matches = [];
  if (window.PRODUCTS) {
    matches = PRODUCTS.filter(function(p) {
      return p.name.toLowerCase().includes(val.toLowerCase()) ||
        (p.tags && p.tags.some(function(t) { return t.toLowerCase().includes(val.toLowerCase()); }));
    });
  }
  if (matches.length > 0) {
    var html = '';
    for (var i = 0; i < matches.length; i++) {
      var p = matches[i];
      html += '<a class="sr-item" href="product.html?id=' + p.id + '" style="text-decoration:none;display:flex;align-items:center;gap:0.8rem;padding:0.6rem;border-radius:8px;transition:background 0.3s ease">';
      html += '<span class="sr-icon" style="width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:' + p.bg + ';font-size:1.2rem">' + p.icon + '</span>';
      html += '<span><strong style="display:block;font-size:0.85rem;color:var(--deep)">' + p.name + '</strong>';
      html += '<small style="color:var(--rose);font-size:0.78rem">₹' + p.price.toLocaleString() + '</small></span></a>';
    }
    res.innerHTML = html;
  } else {
    res.innerHTML = '<p class="sr-empty" style="font-size:0.85rem;color:var(--muted);padding:0.5rem 0">No products found for "' + val + '"</p>';
  }
}

// Toast notification
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// Newsletter subscription
function subscribeNewsletter(e) {
  e.preventDefault();
  var input = e.target.querySelector('input');
  if (!input) return;
  var email = input.value;
  MG_API.subscribeNewsletter(email).then(function() {
    showToast('Welcome to Mac & Glow! 🌿 Check your inbox.');
    input.value = '';
  }).catch(function() {
    showToast('Subscription successful!');
    input.value = '';
  });
}

// Render product card
function renderProductCard(p) {
  var escapedName = p.name.replace(/'/g, "\\'");
  return '<div class="product-card" data-id="' + p.id + '">' +
    '<div class="pc-img" style="background:' + p.bg + '">' +
      '<span class="pc-emoji">' + p.icon + '</span>' +
      (p.badge ? '<span class="pc-badge">' + p.badge + '</span>' : '') +
      '<div class="pc-overlay">' +
        '<button onclick="addToCart(\'' + escapedName + '\',' + p.price + ')">Add to Cart</button>' +
        '<button onclick="addToWishlist(' + p.id + ', \'' + escapedName + '\', ' + p.price + ', \'' + p.icon + '\', \'' + p.bg + '\')">♥ Wishlist</button>' +
        '<a href="product.html?id=' + p.id + '">View Details</a>' +
      '</div>' +
    '</div>' +
    '<div class="pc-body">' +
      '<p class="pc-cat">' + p.category + '</p>' +
      '<h3 class="pc-name"><a href="product.html?id=' + p.id + '">' + p.name + '</a></h3>' +
      '<p class="pc-desc">' + p.desc + '</p>' +
      '<div class="pc-footer">' +
        '<div>' +
          '<span class="pc-price">₹' + p.price.toLocaleString() + '</span>' +
          '<span class="pc-rating">★ ' + p.rating + ' (' + p.reviews + ')</span>' +
        '</div>' +
        '<button class="pc-add" onclick="addToCart(\'' + escapedName + '\',' + p.price + ')">+</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// ========== WISHLIST FUNCTIONS ==========

function getCurrentUser() {
  var session = localStorage.getItem('mg_session') || sessionStorage.getItem('mg_session');
  return session ? JSON.parse(session) : null;
}

function addToWishlist(id, name, price, icon, bg) {
  var user = getCurrentUser();
  if (!user) {
    showToast('Please login first to add to wishlist');
    setTimeout(function() { window.location.href = 'login.html'; }, 1500);
    return;
  }
  MG_API.addToWishlist({ productId: id, name: name, price: price, icon: icon, bg: bg }).then(function() {
    showToast(name + ' added to wishlist ♥');
  }).catch(function() {
    // Fallback to localStorage
    var wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    var exists = false;
    for (var i = 0; i < wishlist.length; i++) {
      if (wishlist[i].id == id) { exists = true; break; }
    }
    if (!exists) {
      wishlist.push({ id: id, name: name, price: price, icon: icon, bg: bg });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    showToast(name + ' added to wishlist ♥');
  });
}

// ========== PROFILE DROPDOWN FUNCTIONS ==========

function toggleProfileDropdown(event) {
  if (event) {
    event.stopPropagation();
  }
  var dropdown = document.getElementById('profileDropdown');
  if (!dropdown) return;
  if (dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
    dropdown.classList.add('hide');
  } else {
    dropdown.classList.remove('hide');
    dropdown.classList.add('show');
    updateProfileDropdownContent();
  }
}
function updateProfileDropdownContent() {
  var dropdown = document.getElementById('profileDropdown');
  if (!dropdown) return;
  var session = localStorage.getItem('mg_session') || sessionStorage.getItem('mg_session');
  var isLoggedIn = !!session;
  var user = null;
  if (session) {
    try {
      user = JSON.parse(session);
    } catch(e) {}
  }
  if (isLoggedIn && user) {
    dropdown.innerHTML = '<div class="dropdown-header">' +
      '<span class="user-name">' + (user.name || 'User') + '</span>' +
      '<span class="user-email">' + (user.email || '') + '</span>' +
      '</div>' +
      '<a href="my-account.html" class="dropdown-item" onclick="closeDropdown()">👤 My Account</a>' +
      '<a href="my-account.html?tab=orders" class="dropdown-item" onclick="closeDropdown()">📦 My Orders</a>' +
      '<a href="wishlist.html" class="dropdown-item" onclick="closeDropdown()">♥️ Wishlist</a>' +
      '<div class="dropdown-divider"></div>' +
      '<div class="dropdown-item logout-item" onclick="handleLogout()">🚪 Logout</div>';
  } else {
    dropdown.innerHTML = '<a href="login.html" class="dropdown-item" onclick="closeDropdown()">🔐 Login</a>' +
      '<a href="login.html" class="dropdown-item" onclick="closeDropdown()">✨ Sign Up</a>' +
      '<div class="dropdown-divider"></div>' +
      '<a href="track-order.html" class="dropdown-item" onclick="closeDropdown()">📦 Track Order</a>';
  }
}

function handleLogout() {
  MG_API.clearToken();
  showToast('Logged out successfully! 👋');
  setTimeout(function() { window.location.reload(); }, 1000);
}

function closeDropdown() {
  var dropdown = document.getElementById('profileDropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
    dropdown.classList.add('hide');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  var dropdown = document.getElementById('profileDropdown');
  var profileBtn = document.querySelector('.profile-btn');
  if (dropdown && dropdown.classList.contains('show')) {
    if (!dropdown.contains(event.target) && !profileBtn.contains(event.target)) {
      dropdown.classList.remove('show');
      dropdown.classList.add('hide');
    }
  }
});

// ========== SCROLL ANIMATIONS ==========

function initAOS() {
  var els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  var obs = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('aos-done');
        obs.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.1 });
  for (var i = 0; i < els.length; i++) {
    obs.observe(els[i]);
  }
}

// ========== HOME PAGE INIT ==========

function initHome() {
  var grid = document.getElementById('homeBestsellers');
  if (!grid) return;
  if (window.PRODUCTS) {
    var best = [];
    for (var i = 0; i < PRODUCTS.length; i++) {
      var p = PRODUCTS[i];
      if (p.badge === 'Bestseller' || p.id === 1 || p.id === 2 || p.id === 3 || p.id === 7) {
        best.push(p);
      }
    }
    var html = '';
    for (var j = 0; j < 4 && j < best.length; j++) {
      html += renderProductCard(best[j]);
    }
    grid.innerHTML = html;
  }
}

// ========== UPDATE CART COUNT ==========

function updateCartCount() {
  var cart = JSON.parse(localStorage.getItem('lumiere_cart') || '[]');
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total += cart[i].qty;
  }
  var cartCount = document.getElementById('cartCount');
  if (cartCount) cartCount.textContent = total;
}

// ========== DOCUMENT READY ==========

document.addEventListener('DOMContentLoaded', function() {
  initAOS();
  initHome();
  updateCartCount();
  var dropdown = document.getElementById('profileDropdown');
  if (dropdown) {
    dropdown.classList.add('hide');
  }
  var navLinks = document.querySelectorAll('.nav-links a');
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function() {
      var nl = document.getElementById('navLinks');
      var ham = document.getElementById('hamburger');
      if (nl) nl.classList.remove('open');
      if (ham) ham.classList.remove('open');
    });
  }
});