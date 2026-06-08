// ── NAV AUTO-ACTIVE & IMAGE GUIDE ─────────────
// Auto-sets active nav link based on current page
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav-links a');
    links.forEach(function(a) {
      a.classList.remove('active');
      var href = a.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  });
})();

// ── IMAGE HELPER ──────────────────────────────
// HOW TO ADD YOUR OWN IMAGES:
//
// 1. PRODUCT IMAGES
//    - Create a folder called "images/products/" in your project
//    - Name your images: product-1.jpg, product-2.jpg ... product-10.jpg
//    - In data.js, add: img: 'images/products/product-1.jpg' to each product
//    - In product cards (renderProductCard in main.js), replace the emoji icon with:
//      '<img src="' + p.img + '" alt="' + p.name + '" style="width:100%;height:100%;object-fit:cover">'
//
// 2. TEAM / FOUNDER IMAGES (about.html)
//    - Save as: images/team/founder.jpg, images/team/botanist.jpg, images/team/chemist.jpg
//    - Replace the emoji 👩‍⚕️ etc in about.html with:
//      <img src="images/team/founder.jpg" alt="Dr. Priya" style="width:80px;height:80px;border-radius:50%;object-fit:cover">
//
// 3. HERO / BANNER IMAGES (index.html hero section)
//    - Save as: images/hero-bg.jpg
//    - In style.css find .hero and add:
//      background-image: url('images/hero-bg.jpg'); background-size: cover;
//
// 4. LOGO IMAGE (replace text logo)
//    - Save as: images/logo.png (recommended: 200x60px, transparent background)
//    - In all HTML files replace: <a href="index.html" class="logo">MAC<span>&</span>GLOW</a>
//    - With: <a href="index.html"><img src="images/logo.png" alt="Mac & Glow" height="40"></a>
//
// 5. BLOG / JOURNAL IMAGES (journal.html)
//    - Save as: images/blog/post-1.jpg, post-2.jpg etc.
//    - Add img property to BLOG_POSTS in data.js
//
// RECOMMENDED IMAGE SIZES:
//   Product images:  800x800px (square)
//   Hero banner:     1440x600px (wide)
//   Team photos:     400x400px (square)
//   Blog thumbnails: 600x400px (landscape)
//   Logo:            200x60px  (transparent PNG)
