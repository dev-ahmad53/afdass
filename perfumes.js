/**
 * AFDASS PERFUMES — perfumes.js
 * Dedicated Interactive Engine for Perfumes Collections Page
 * Filters, Wishlist, Flying Bottle to Cart Animation & LocalStorage Sync
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Engine
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    if (mobileBtn) mobileBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    if (mobileBtn) mobileBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', (e) => {
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

  // 2. Floating Quick Cart & Navbar Cart Sync
  const floatingQuickCart = document.getElementById('floatingQuickCart');
  const navbarCartBtn = document.querySelector('.navbar .cart-btn') || document.querySelector('.cart-btn');

  function updateFloatingCartVisibility() {
    if (!floatingQuickCart) return;
    if (window.scrollY > 320) {
      floatingQuickCart.classList.add('visible');
    } else {
      floatingQuickCart.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateFloatingCartVisibility, { passive: true });
  updateFloatingCartVisibility();

  // 3. Cart Badge Sync across Navbar and Floating Cart
  function syncPerfumesCartBadge() {
    try {
      const cart = JSON.parse(localStorage.getItem('afdass_cart')) || [];
      const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
      document.querySelectorAll('.navbar .cart-badge, .nav-actions .cart-badge').forEach(badge => {
        badge.textContent = `(${count})`;
        badge.style.color = '#0c0503';
      });

      document.querySelectorAll('.floating-quick-cart .cart-badge').forEach(badge => {
        badge.textContent = `(${count})`;
        badge.style.color = '#0e0906';
      });
    } catch (e) {
      document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = '(0)';
      });
    }
  }

  syncPerfumesCartBadge();

  // 4. Category Tabs Filtering Logic
  const tabs = document.querySelectorAll('.coll-tab');
  const cards = document.querySelectorAll('.prod-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // 5. Persistent Wishlist System
  const wishlistKey = 'afdass_wishlist';
  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(wishlistKey)) || [];
    } catch (e) {
      return [];
    }
  }
  function saveWishlist(list) {
    try {
      localStorage.setItem(wishlistKey, JSON.stringify(list));
    } catch (e) {}
  }
  function syncWishlistUI() {
    const list = getWishlist();
    document.querySelectorAll('.prod-card').forEach(card => {
      const pId = card.querySelector('a.prod-img-link')?.getAttribute('href')?.split('=')[1] || '';
      const btn = card.querySelector('.prod-wish');
      if (!btn) return;
      const icon = btn.querySelector('svg');
      if (list.includes(pId)) {
        btn.classList.add('wished');
        if (icon) {
          icon.setAttribute('fill', '#dea65f');
          icon.setAttribute('stroke', '#dea65f');
        }
      } else {
        btn.classList.remove('wished');
        if (icon) {
          icon.setAttribute('fill', 'none');
          icon.setAttribute('stroke', 'currentColor');
        }
      }
    });
  }

  document.querySelectorAll('.prod-wish').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.prod-card');
      const pId = card?.querySelector('a.prod-img-link')?.getAttribute('href')?.split('=')[1] || '';
      if (!pId) return;

      let list = getWishlist();
      if (list.includes(pId)) {
        list = list.filter(id => id !== pId);
      } else {
        list.push(pId);
      }
      saveWishlist(list);
      syncWishlistUI();
    });
  });

  syncWishlistUI();

  // 5b. Catalog Sorting Logic (#sortSelect)
  const sortSelect = document.getElementById('sortSelect');
  const productsGrid = document.getElementById('productsGrid');

  if (sortSelect && productsGrid) {
    const initialCards = Array.from(productsGrid.querySelectorAll('.prod-card'));
    
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      let sorted = [...initialCards];

      if (val === 'price-asc') {
        sorted.sort((a, b) => {
          const pA = parseFloat(a.getAttribute('data-price')) || 4500;
          const pB = parseFloat(b.getAttribute('data-price')) || 4500;
          if (pA !== pB) return pA - pB;
          const nameA = a.querySelector('.prod-name')?.textContent || '';
          const nameB = b.querySelector('.prod-name')?.textContent || '';
          return nameA.localeCompare(nameB);
        });
      } else if (val === 'price-desc') {
        sorted.sort((a, b) => {
          const pA = parseFloat(a.getAttribute('data-price')) || 4500;
          const pB = parseFloat(b.getAttribute('data-price')) || 4500;
          if (pA !== pB) return pB - pA;
          const nameA = a.querySelector('.prod-name')?.textContent || '';
          const nameB = b.querySelector('.prod-name')?.textContent || '';
          return nameB.localeCompare(nameA);
        });
      } else if (val === 'best') {
        // Priority order based on popularity
        const priority = { 'ember': 1, 'fatima': 2, 'venta': 3, 'afeee': 4 };
        sorted.sort((a, b) => {
          const idA = a.querySelector('a.prod-img-link')?.getAttribute('href')?.split('=')[1] || '';
          const idB = b.querySelector('a.prod-img-link')?.getAttribute('href')?.split('=')[1] || '';
          return (priority[idA] || 99) - (priority[idB] || 99);
        });
      } else {
        sorted = [...initialCards];
      }

      productsGrid.style.transition = 'opacity 0.15s ease';
      productsGrid.style.opacity = '0.4';
      setTimeout(() => {
        sorted.forEach(c => productsGrid.appendChild(c));
        productsGrid.style.opacity = '1';
      }, 150);
    });
  }

  // 6. Product Catalog Information
  const productCatalogMap = {
    'AFDASS Ember': { id: 'ember', name: 'AFDASS Ember', subtitle: 'Warm Amber & Smoky Oud', price: 4500, size: '50ml', image: 'assets/bottle-ember.jpg' },
    'AFDASS Venta': { id: 'venta', name: 'AFDASS Venta', subtitle: 'Bold Leather & Fresh Citrus', price: 4500, size: '50ml', image: 'assets/bottle-venta.jpg' },
    'AFDASS Fatima': { id: 'fatima', name: 'AFDASS Fatima', subtitle: 'Royal Damask Rose & Musk', price: 4500, size: '50ml', image: 'assets/bottle-fatima.jpg' },
    'AFDASS Afeee': { id: 'afeee', name: 'AFDASS Afeee', subtitle: 'Saffron Nectar & White Amber', price: 4500, size: '50ml', image: 'assets/bottle-afeee.jpg' }
  };

  // Safe Helper: Get strictly visible, valid onscreen cart target
  function getActiveCartTarget() {
    // 1. If navbar cart is visible in the viewport
    if (navbarCartBtn) {
      const r = navbarCartBtn.getBoundingClientRect();
      if (r.top >= 0 && r.bottom <= window.innerHeight && r.left >= 0 && r.right <= window.innerWidth && r.width > 0 && r.height > 0) {
        return navbarCartBtn;
      }
    }

    // 2. Otherwise ensure floating quick cart is visible and target it
    if (floatingQuickCart) {
      floatingQuickCart.classList.add('visible');
      return floatingQuickCart;
    }

    return navbarCartBtn;
  }

  // 7. Golden Sparkle Shockwave Effect Generator
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

  // 8. Physics Parabolic "Fly to Cart" Flying Bottle Animation (Hardware GPU Composited)
  function flyBottleToCart(sourceImg, targetCartEl) {
    if (!sourceImg || !targetCartEl) return;

    const startRect = sourceImg.getBoundingClientRect();
    const endRect = targetCartEl.getBoundingClientRect();

    const flyerWidth = (startRect.width && startRect.width > 20) ? Math.min(startRect.width, 130) : 100;
    const flyerHeight = (startRect.height && startRect.height > 20) ? Math.min(startRect.height, 150) : 120;
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
      syncPerfumesCartBadge();
    };
  }

  // 9. Single-Click Add to Cart with Flying Animation
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Debounce protection: ignore if button is currently in processing state
      if (btn.disabled || btn.classList.contains('processing')) return;
      btn.disabled = true;
      btn.classList.add('processing');

      const card = btn.closest('.prod-card');
      const prodImg = card ? card.querySelector('.prod-img') : null;

      // Select destination: safely get visible onscreen cart target
      const targetCart = getActiveCartTarget();

      // Launch Flying Animation
      if (prodImg && targetCart) {
        flyBottleToCart(prodImg, targetCart);
      }

      // Save item in LocalStorage
      const pName = btn.getAttribute('data-product') || btn.getAttribute('data-name') || 'AFDASS Ember';
      const pInfo = productCatalogMap[pName] || { id: 'ember', name: pName, subtitle: 'Haute Parfumerie', price: 4500, size: '50ml', image: 'assets/bottle-ember.jpg' };

      let cart = [];
      try {
        cart = JSON.parse(localStorage.getItem('afdass_cart')) || [];
      } catch (err) {
        cart = [];
      }

      const existingIdx = cart.findIndex(item => item.id === pInfo.id && item.size === pInfo.size);
      if (existingIdx > -1) {
        cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + 1;
        cart[existingIdx].checked = true;
      } else {
        cart.push({
          id: pInfo.id,
          name: pInfo.name,
          subtitle: pInfo.subtitle,
          size: pInfo.size,
          price: pInfo.price,
          quantity: 1,
          image: pInfo.image,
          checked: true
        });
      }

      localStorage.setItem('afdass_cart', JSON.stringify(cart));
      localStorage.setItem('afdass_cart_seeded', 'done');

      // Button feedback animation
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<span>✓ Added to Cart</span>';
      btn.style.background = '#dea65f';
      btn.style.color = '#0e0906';
      btn.style.borderColor = '#dea65f';

      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        btn.classList.remove('processing');
      }, 1600);
    });
  });

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
