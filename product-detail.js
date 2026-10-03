/**
 * AFDASS PERFUMES — product-detail.js
 * Interactive Engine for Product Detail Page
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Bespoke Fragrances Database
  const productsDB = {
    ember: {
      id: 'ember',
      name: 'AFDASS Ember',
      subtitle: 'Smoky Oud & Warm Amber',
      ratingText: '4.9 (128 reviews)',
      basePrice: 4500,
      prices: { '30ml': 2800, '50ml': 4500, '100ml': 7500 },
      description: 'A bold and captivating fragrance crafted for those who appreciate depth and sophistication. AFDASS Ember blends the richness of smoky oriental notes with warm glowing amber, leaving a lasting impression wherever you go.',
      story: 'AFDASS Ember is more than a scent; it is an unforgettable signature statement. Inspired by the timeless allure of aged smoked oud, this fragrance combines traditional Middle Eastern depth with French modern elegance, perfect for those who value individuality, class, and presence.',
      ideal: 'Evening Wear',
      best: 'Unisex & Men',
      occasion: 'Special Occasions & Soirées',
      images: [
        'assets/bottle-ember.jpg?v=20261004',
        'assets/gallery-ember-2.jpg',
        'assets/story-box.jpg',
        'assets/story-box-from-user.png',
        'assets/product-ember.jpg?v=20261004'
      ],
      notes: {
        top: 'Smoked Oud, Royal Saffron, Italian Bergamot',
        heart: 'Golden Amber, Damascus Rose, Warm Spices',
        base: 'Saddlewood Musk, Vintage Leather, Rare Cedarwood',
        topImg: 'assets/note-top-oud.jpg',
        heartImg: 'assets/note-heart-amber.jpg',
        baseImg: 'assets/note-base-woods.jpg'
      }
    },
    venta: {
      id: 'venta',
      name: 'AFDASS Venta',
      subtitle: 'Bold Leather & Italian Bergamot',
      ratingText: '4.9 (94 reviews)',
      basePrice: 4500,
      prices: { '30ml': 2800, '50ml': 4500, '100ml': 7500 },
      description: 'Dynamic, invigorating, and decisively masculine. AFDASS Venta opens with radiant Italian bergamot and crisp pink pepper, descending into a heart of smoky Tuscan birch and rich dark leather.',
      story: 'Crafted for the modern visionary. AFDASS Venta captures the relentless energy of ambition and quiet confidence. The fresh opening harmonizes with rugged Tuscan leather, embodying timeless masculine authority.',
      ideal: 'Day to Night Wear',
      best: 'Men',
      occasion: 'Executive Boardroom & High-Profile Events',
      images: [
        'assets/bottle-venta.jpg?v=20261004',
        'assets/gallery-venta-2.jpg',
        'assets/story-box.jpg',
        'assets/story-box-from-user.png',
        'assets/product-venta.jpg?v=20261004'
      ],
      notes: {
        top: 'Italian Bergamot, Pink Peppercorn, Lemon Zest',
        heart: 'Tuscan Birch, Smoked Patchouli, Dry Vetiver',
        base: 'Dark Leather, Cedarwood, Rich Ambergris',
        topImg: 'assets/note-top-oud.jpg',
        heartImg: 'assets/note-heart-amber.jpg',
        baseImg: 'assets/note-base-woods.jpg'
      }
    },
    fatima: {
      id: 'fatima',
      name: 'AFDASS Fatima',
      subtitle: 'Royal Damask Rose & Silk Musk',
      ratingText: '5.0 (156 reviews)',
      basePrice: 4500,
      prices: { '30ml': 2800, '50ml': 4500, '100ml': 7500 },
      description: 'An ethereal expression of regal femininity and grace. AFDASS Fatima envelops you in morning-picked Taif roses, wrapped in velvet silk musk and creamy Madagascar vanilla.',
      story: 'Inspired by royal heritage and eternal elegance. AFDASS Fatima is an intoxicating floral symphony. The delicacy of dew-kissed petals is elevated by an intoxicating aura of rare silk musk and golden amber.',
      ideal: 'All-Day Luxury',
      best: 'Women',
      occasion: 'Weddings, Celebrations & Intimate Dinners',
      images: [
        'assets/bottle-fatima.jpg?v=20261004',
        'assets/gallery-fatima-2.jpg',
        'assets/story-box.jpg',
        'assets/story-box-from-user.png',
        'assets/product-fatima.jpg?v=20261004'
      ],
      notes: {
        top: 'Taif Rose Petals, Sparkling Lychee, White Peach',
        heart: 'Royal Damask Rose, Jasmine Sambac, Velvet Lily',
        base: 'White Silk Musk, Bourbon Vanilla, Amber Mist',
        topImg: 'assets/note-top-oud.jpg',
        heartImg: 'assets/note-heart-amber.jpg',
        baseImg: 'assets/note-base-woods.jpg'
      }
    },
    afeee: {
      id: 'afeee',
      name: 'AFDASS Afeee',
      subtitle: 'Velvet Vanilla & Golden Caramel Oud',
      ratingText: '4.9 (112 reviews)',
      basePrice: 4500,
      prices: { '30ml': 2800, '50ml': 4500, '100ml': 7500 },
      description: 'Decadently sweet, magnetic, and effortlessly seductive. AFDASS Afeee weaves warm roasted praline, bourbon vanilla, and precious white oud into an unforgettable gourmand masterpiece.',
      story: 'A delicious reverie of opulent indulgence. AFDASS Afeee balances the warmth of golden spun caramel with the mystical sophistication of precious white oud, creating an irresistible, compliments-guaranteed aura.',
      ideal: 'Cool Evenings & Autumn/Winter',
      best: 'Women & Unisex',
      occasion: 'Date Nights & Cozy VIP Gatherings',
      images: [
        'assets/bottle-afeee.jpg?v=20261004',
        'assets/gallery-afeee-2.jpg',
        'assets/story-box.jpg',
        'assets/story-box-from-user.png',
        'assets/product-afeee.jpg?v=20261004'
      ],
      notes: {
        top: 'Golden Honey, Candied Orange, Saffron Flakes',
        heart: 'Roasted Praline, Salted Caramel, Cocoa Bean',
        base: 'Bourbon Vanilla, Cashmere Wood, Soft White Oud',
        topImg: 'assets/note-top-oud.jpg',
        heartImg: 'assets/note-heart-amber.jpg',
        baseImg: 'assets/note-base-woods.jpg'
      }
    }
  };

  // 2. Determine Active Product from URL Query
  const urlParams = new URLSearchParams(window.location.search);
  let currentKey = (urlParams.get('product') || 'ember').toLowerCase();
  if (!productsDB[currentKey]) {
    currentKey = 'ember';
  }
  const currentProduct = productsDB[currentKey];

  // 3. State Variables
  let currentSize = '50ml';
  let currentQuantity = 1;
  let currentImageIndex = 0;

  // 4. DOM Elements
  const breadCrumbName = document.getElementById('breadCrumbName');
  const prodTitle = document.getElementById('prodTitle');
  const prodSubtitle = document.getElementById('prodSubtitle');
  const prodRatingText = document.getElementById('prodRatingText');
  const prodPrice = document.getElementById('prodPrice');
  const prodDescription = document.getElementById('prodDescription');
  const tabStoryText = document.getElementById('tabStoryText');
  const attrIdeal = document.getElementById('attrIdeal');
  const attrBest = document.getElementById('attrBest');
  const attrOccasion = document.getElementById('attrOccasion');
  const mainProductImg = document.getElementById('mainProductImg');
  const thumbTrack = document.getElementById('thumbTrack');
  const sizeBtns = document.querySelectorAll('.size-card-btn');
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinusBtn = document.getElementById('qtyMinusBtn');
  const qtyPlusBtn = document.getElementById('qtyPlusBtn');
  const btnAddToCart = document.getElementById('btnAddToCart');
  const btnWhatsApp = document.getElementById('btnWhatsApp');
  const headerCartCount = document.getElementById('headerCartCount');
  const cartToast = document.getElementById('cartToast');
  const toastDesc = document.getElementById('toastDesc');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const btnExpandZoom = document.getElementById('btnExpandZoom');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const relatedGrid = document.getElementById('relatedGrid');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  // 5. Populate Product Data
  function renderProduct() {
    document.title = `${currentProduct.name} | AFDASS PERFUMES`;

    // Text Details
    if (breadCrumbName) breadCrumbName.textContent = currentProduct.name;
    if (prodTitle) prodTitle.textContent = currentProduct.name;
    if (prodSubtitle) prodSubtitle.textContent = currentProduct.subtitle;
    if (prodRatingText) prodRatingText.textContent = currentProduct.ratingText;
    if (prodDescription) prodDescription.textContent = currentProduct.description;
    if (tabStoryText) tabStoryText.textContent = currentProduct.story;
    if (attrIdeal) attrIdeal.textContent = currentProduct.ideal;
    if (attrBest) attrBest.textContent = currentProduct.best;
    if (attrOccasion) attrOccasion.textContent = currentProduct.occasion;

    // Notes
    const n = currentProduct.notes;
    const noteTopText = document.getElementById('noteTopText');
    const noteHeartText = document.getElementById('noteHeartText');
    const noteBaseText = document.getElementById('noteBaseText');
    const tabNotesTop = document.getElementById('tabNotesTop');
    const tabNotesHeart = document.getElementById('tabNotesHeart');
    const tabNotesBase = document.getElementById('tabNotesBase');
    if (noteTopText) noteTopText.textContent = n.top;
    if (noteHeartText) noteHeartText.textContent = n.heart;
    if (noteBaseText) noteBaseText.textContent = n.base;
    if (tabNotesTop) tabNotesTop.textContent = n.top;
    if (tabNotesHeart) tabNotesHeart.textContent = n.heart;
    if (tabNotesBase) tabNotesBase.textContent = n.base;

    // Gallery Thumbnails
    if (thumbTrack) {
      thumbTrack.innerHTML = '';
      currentProduct.images.forEach((imgSrc, idx) => {
        const btn = document.createElement('button');
        btn.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
        btn.setAttribute('data-index', idx);
        btn.setAttribute('aria-label', `Thumbnail ${idx + 1}`);
        btn.innerHTML = `<img src="${imgSrc}" alt="${currentProduct.name} View ${idx + 1}" class="thumb-img" />`;
        btn.addEventListener('click', () => switchImage(idx));
        thumbTrack.appendChild(btn);
      });
    }

    // Main Image
    switchImage(0);

    // Update Price & Controls
    updatePriceAndWhatsApp();

    // Render Related Products
    renderRelatedProducts();

    // Init Cart Count
    initCartCount();
  }

  // 6. Gallery Image Switcher
  function switchImage(index) {
    if (index < 0 || index >= currentProduct.images.length) return;
    currentImageIndex = index;
    const newSrc = currentProduct.images[index];

    if (mainProductImg) {
      mainProductImg.classList.remove('fade-in');
      void mainProductImg.offsetWidth; // trigger reflow
      mainProductImg.src = newSrc;
      mainProductImg.alt = `${currentProduct.name} angle ${index + 1}`;
      mainProductImg.classList.add('fade-in');
    }

    if (lightboxImg) {
      lightboxImg.src = newSrc;
    }

    // Update active thumb
    const thumbs = thumbTrack ? thumbTrack.querySelectorAll('.thumb-item') : [];
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }

  // Prev / Next Arrows
  const thumbPrevBtn = document.getElementById('thumbPrevBtn');
  const thumbNextBtn = document.getElementById('thumbNextBtn');
  if (thumbPrevBtn) {
    thumbPrevBtn.addEventListener('click', () => {
      const prevIdx = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
      switchImage(prevIdx);
    });
  }
  if (thumbNextBtn) {
    thumbNextBtn.addEventListener('click', () => {
      const nextIdx = (currentImageIndex + 1) % currentProduct.images.length;
      switchImage(nextIdx);
    });
  }

  // Lightbox Modal
  if (btnExpandZoom && lightboxModal) {
    btnExpandZoom.addEventListener('click', () => {
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
    });
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // 7. Size & Price Switcher
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSize = btn.getAttribute('data-size') || '50ml';
      updatePriceAndWhatsApp();
    });
  });

  // Quantity Control
  if (qtyMinusBtn && qtyInput) {
    qtyMinusBtn.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) {
        val -= 1;
        qtyInput.value = val;
        currentQuantity = val;
        updatePriceAndWhatsApp();
      }
    });
  }

  if (qtyPlusBtn && qtyInput) {
    qtyPlusBtn.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val < 10) {
        val += 1;
        qtyInput.value = val;
        currentQuantity = val;
        updatePriceAndWhatsApp();
      }
    });
  }

  function updatePriceAndWhatsApp() {
    const unitPrice = currentProduct.prices[currentSize] || currentProduct.basePrice;
    const totalPrice = unitPrice * currentQuantity;

    if (prodPrice) {
      prodPrice.textContent = `Rs. ${unitPrice.toLocaleString()}`;
    }

    // Dynamic WhatsApp Order Link
    if (btnWhatsApp) {
      const phone = '923125797051'; // official WhatsApp support line: 03125797051
      const message = `Hello AFDASS Perfumes! I would like to order:\n\n*Product:* ${currentProduct.name}\n*Size:* ${currentSize}\n*Quantity:* ${currentQuantity}\n*Total Price:* Rs. ${totalPrice.toLocaleString()}\n\nPlease confirm availability and delivery details.`;
      btnWhatsApp.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }
  }

  // 8. Floating Quick Cart & Navbar Cart Sync
  const floatingQuickCart = document.getElementById('floatingQuickCart');
  const navbarCartBtn = document.getElementById('btnNavCart') || document.querySelector('.navbar .cart-btn') || document.querySelector('.cart-btn');

  function updateFloatingCartVisibility() {
    if (!floatingQuickCart) return;
    if (window.scrollY > 80) {
      floatingQuickCart.classList.add('visible');
    } else {
      floatingQuickCart.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateFloatingCartVisibility, { passive: true });
  updateFloatingCartVisibility();

  // Helper: Get strictly visible, valid onscreen cart target
  function getActiveCartTarget() {
    // If navbar cart is visible in the top viewport
    if (navbarCartBtn) {
      const r = navbarCartBtn.getBoundingClientRect();
      if (r.top >= 0 && r.bottom <= window.innerHeight && r.left >= 0 && r.right <= window.innerWidth && r.width > 0 && r.height > 0) {
        return navbarCartBtn;
      }
    }

    // Otherwise, ensure floating quick cart is visible and use it
    if (floatingQuickCart) {
      floatingQuickCart.classList.add('visible');
      return floatingQuickCart;
    }

    return navbarCartBtn;
  }

  // 9. Sparkle Shockwave Ring Generator
  function createCartSparkleRing(x, y) {
    let top = y, left = x;
    if (typeof x === 'object' && x !== null) {
      top = x.top + (x.height / 2);
      left = x.left + (x.width / 2);
    }
    const ring = document.createElement('div');
    ring.className = 'cart-sparkle-ring';
    ring.style.top = `${top}px`;
    ring.style.left = `${left}px`;
    document.body.appendChild(ring);
    setTimeout(() => { ring.remove(); }, 750);
  }

  // 10. Physics Parabolic "Fly to Cart" Flying Bottle Animation (Hardware GPU Composited)
  function flyBottleToCart(sourceImg, targetCartEl) {
    if (!sourceImg || !targetCartEl) return;

    const startRect = sourceImg.getBoundingClientRect();
    const endRect = targetCartEl.getBoundingClientRect();

    const flyerWidth = (startRect.width && startRect.width > 20) ? Math.min(startRect.width, 140) : 110;
    const flyerHeight = (startRect.height && startRect.height > 20) ? Math.min(startRect.height, 160) : 130;
    const startX = (startRect.width && startRect.width > 20) ? startRect.left : (window.innerWidth / 2 - flyerWidth / 2);
    const startY = (startRect.width && startRect.width > 20) ? startRect.top : (window.innerHeight / 2 - flyerHeight / 2);

    let targetCenterX = endRect.left + (endRect.width / 2);
    let targetCenterY = endRect.top + (endRect.height / 2);

    // Viewport safeguard: destination must be inside onscreen window
    if (targetCenterY < 15 || targetCenterY > window.innerHeight) {
      targetCenterY = 38;
    }
    if (targetCenterX < 20 || targetCenterX > window.innerWidth - 20) {
      targetCenterX = window.innerWidth - 65;
    }

    const destX = targetCenterX - (flyerWidth / 2);
    const destY = targetCenterY - (flyerHeight / 2);

    const peakY = Math.max(15, Math.min(startY, destY) - 85);
    const midX = startX + (destX - startX) * 0.45;

    // Create real image clone
    const flyer = document.createElement('img');
    flyer.src = sourceImg.src || sourceImg.getAttribute('src');
    flyer.className = 'fly-to-cart-particle';
    flyer.style.width = `${flyerWidth}px`;
    flyer.style.height = `${flyerHeight}px`;

    document.body.appendChild(flyer);

    const anim = flyer.animate([
      {
        transform: `translate3d(${startX}px, ${startY}px, 0) scale(1) rotate(0deg)`,
        opacity: 1
      },
      {
        transform: `translate3d(${midX}px, ${peakY}px, 0) scale(0.72) rotate(-14deg)`,
        opacity: 0.95,
        offset: 0.42
      },
      {
        transform: `translate3d(${destX}px, ${destY}px, 0) scale(0.2) rotate(22deg)`,
        opacity: 0.15
      }
    ], {
      duration: 1350,
      easing: 'cubic-bezier(0.25, 0.85, 0.35, 1)',
      fill: 'forwards'
    });

    anim.onfinish = () => {
      flyer.remove();

      // Trigger Golden Bump on target cart icon
      if (targetCartEl) {
        targetCartEl.classList.remove('cart-bump-glow');
        void targetCartEl.offsetWidth; // Force reflow
        targetCartEl.classList.add('cart-bump-glow');
        setTimeout(() => { targetCartEl.classList.remove('cart-bump-glow'); }, 650);
      }

      // Trigger golden shockwave ripple
      createCartSparkleRing(targetCenterX, targetCenterY);

      // Sync and bounce badges
      updateCartBadge();
    };
  }

  // 11. Add to Cart with Flying Animation & LocalStorage
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', (e) => {
      e.stopPropagation();

      // Debounce protection
      if (btnAddToCart.disabled || btnAddToCart.classList.contains('processing')) return;
      btnAddToCart.disabled = true;
      btnAddToCart.classList.add('processing');

      const mainProductImg = document.getElementById('mainProductImg');
      const targetCart = getActiveCartTarget();

      // Launch Flying Animation
      if (mainProductImg && targetCart) {
        flyBottleToCart(mainProductImg, targetCart);
      }

      const unitPrice = currentProduct.prices[currentSize] || currentProduct.basePrice;
      const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        size: currentSize,
        price: unitPrice,
        quantity: currentQuantity,
        image: currentProduct.images[0],
        checked: true
      };

      // Retrieve existing cart
      let cart = [];
      try {
        cart = JSON.parse(localStorage.getItem('afdass_cart')) || [];
      } catch (err) {
        cart = [];
      }

      // Check if same item & size exists
      const existingIdx = cart.findIndex(item => item.id === cartItem.id && item.size === cartItem.size);
      if (existingIdx > -1) {
        cart[existingIdx].quantity += cartItem.quantity;
        cart[existingIdx].checked = true;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem('afdass_cart', JSON.stringify(cart));
      localStorage.setItem('afdass_cart_seeded', 'done');

      // Button feedback
      const originalHtml = btnAddToCart.innerHTML;
      btnAddToCart.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Added to Bag!</span>
      `;
      btnAddToCart.style.background = '#dea65f';
      btnAddToCart.style.color = '#0e0906';
      btnAddToCart.style.borderColor = '#dea65f';

      setTimeout(() => {
        btnAddToCart.innerHTML = originalHtml;
        btnAddToCart.style.background = '';
        btnAddToCart.style.color = '';
        btnAddToCart.style.borderColor = '';
        btnAddToCart.disabled = false;
        btnAddToCart.classList.remove('processing');
      }, 1600);
    });
  }

  function updateCartBadge() {
    let count = 0;
    try {
      const cart = JSON.parse(localStorage.getItem('afdass_cart')) || [];
      count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    } catch (e) {
      count = 0;
    }
    document.querySelectorAll('.navbar .cart-badge, .nav-actions .cart-badge').forEach(badge => {
      badge.textContent = `(${count})`;
      badge.style.color = '#0c0503';
    });
    document.querySelectorAll('.floating-quick-cart .cart-badge').forEach(badge => {
      badge.textContent = `(${count})`;
      badge.style.color = '#0e0906';
    });
  }

  function initCartCount() {
    updateCartBadge();
  }

  // 12. Tabs Switcher
  const tabNavBtns = document.querySelectorAll('.tab-nav-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabNavBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(`tab-${targetId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 13. Render Related Products with Flying Bottle Support
  function renderRelatedProducts() {
    if (!relatedGrid) return;
    relatedGrid.innerHTML = '';

    const otherKeys = Object.keys(productsDB).filter(k => k !== currentProduct.id);

    otherKeys.forEach(key => {
      const p = productsDB[key];
      const card = document.createElement('article');
      card.className = 'rel-card';
      card.innerHTML = `
        <a href="product-detail.html?product=${p.id}" class="rel-img-wrap" aria-label="View ${p.name}">
          <img src="${p.images[0]}" alt="${p.name}" class="rel-img" />
        </a>
        <div class="rel-body">
          <h3 class="rel-name"><a href="product-detail.html?product=${p.id}" style="color:inherit;text-decoration:none;">${p.name}</a></h3>
          <p class="rel-note">${p.subtitle}</p>
          <span class="rel-price">Rs. ${p.basePrice.toLocaleString()}</span>
          <button class="rel-btn-cart" data-rel-id="${p.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Add to Cart</span>
          </button>
        </div>
      `;

      // Quick add to cart from related card with Flying animation
      const btn = card.querySelector('.rel-btn-cart');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.disabled) return;
        btn.disabled = true;
        setTimeout(() => { btn.disabled = false; }, 1600);

        const relImg = card.querySelector('.rel-img');
        const targetCart = getActiveCartTarget();

        if (relImg && targetCart) {
          flyBottleToCart(relImg, targetCart);
        }

        let cart = [];
        try {
          cart = JSON.parse(localStorage.getItem('afdass_cart')) || [];
        } catch (err) {
          cart = [];
        }
        const item = {
          id: p.id,
          name: p.name,
          size: '50ml',
          price: p.basePrice,
          quantity: 1,
          image: p.images[0],
          checked: true
        };
        const idx = cart.findIndex(it => it.id === item.id && it.size === item.size);
        if (idx > -1) {
          cart[idx].quantity += 1;
          cart[idx].checked = true;
        } else {
          cart.push(item);
        }
        localStorage.setItem('afdass_cart', JSON.stringify(cart));
        localStorage.setItem('afdass_cart_seeded', 'done');
        showToast(`${p.name} (50ml) added to your bag.`);
      });

      relatedGrid.appendChild(card);
    });
  }

  // 11. Mobile Drawer Engine
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer.classList.contains('active')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        closeMobileDrawer();
      }
    });
  }

  // Initialize Page
  renderProduct();
  updateCartBadge();

  // Footer Mobile Accordion Engine
  function initFooterAccordion() {
    const toggles = document.querySelectorAll('.footer-accordion-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        e.preventDefault();
        const col = toggle.closest('.footer-accordion-col');
        if (!col) return;
        const isOpen = col.classList.contains('active');
        const parentGrid = col.parentElement;
        if (parentGrid) {
          parentGrid.querySelectorAll('.footer-accordion-col').forEach(c => {
            if (c !== col) c.classList.remove('active');
          });
        }
        col.classList.toggle('active', !isOpen);
      });
    });
  }
  initFooterAccordion();
});
