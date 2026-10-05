// AFDASS Perfumes - Interactive Scripts
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

  // 2. Interactive 3D Subtle Tilt on Stage Image
  const stageWrapper = document.getElementById('stageWrapper');
  const heroStageImg = document.getElementById('heroStageImg');

  if (stageWrapper && window.innerWidth > 992) {
    stageWrapper.addEventListener('mousemove', (e) => {
      const rect = stageWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      heroStageImg.style.transform = `scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    stageWrapper.addEventListener('mouseleave', () => {
      heroStageImg.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
    });
  }

  // 3. Smooth active link state
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
      navLinks.forEach((l) => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 4. Interactive Add to Cart & Cart Badge Sync
  const cartBadge = document.querySelector('.cart-badge');
  const addButtons = document.querySelectorAll('.btn-add-cart');

  function updateHeaderBadge() {
    try {
      const cart = JSON.parse(localStorage.getItem('afdass_cart')) || [];
      const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      if (cartBadge) {
        cartBadge.textContent = `(${totalCount})`;
        cartBadge.style.color = '#0c0503';
      }
    } catch (e) {
      if (cartBadge) {
        cartBadge.textContent = '(0)';
        cartBadge.style.color = '#0c0503';
      }
    }
  }

  // Initialize count on page load
  updateHeaderBadge();

  const productDataMap = {
    'Ember': { id: 'ember', name: 'Ember', subtitle: 'Warm Amber & Velvet Woods', price: 4500, size: '50ml', image: 'assets/bottle-ember.jpg' },
    'Venta': { id: 'venta', name: 'Venta', subtitle: 'Bold Leather & Fresh Citrus', price: 4500, size: '50ml', image: 'assets/bottle-venta.jpg' },
    'Fatima': { id: 'fatima', name: 'Fatima', subtitle: 'Royal Damask Rose & Musk', price: 4500, size: '50ml', image: 'assets/bottle-fatima.jpg' },
    'Afeee': { id: 'afeee', name: 'Afeee', subtitle: 'Saffron Nectar & White Amber', price: 4500, size: '50ml', image: 'assets/bottle-afeee.jpg' },
    // Backwards compatibility mappings
    'AFDASS Ember': { id: 'ember', name: 'Ember', subtitle: 'Warm Amber & Velvet Woods', price: 4500, size: '50ml', image: 'assets/bottle-ember.jpg' },
    'AFDASS Venta': { id: 'venta', name: 'Venta', subtitle: 'Bold Leather & Fresh Citrus', price: 4500, size: '50ml', image: 'assets/bottle-venta.jpg' },
    'AFDASS Fatima': { id: 'fatima', name: 'Fatima', subtitle: 'Royal Damask Rose & Musk', price: 4500, size: '50ml', image: 'assets/bottle-fatima.jpg' },
    'AFDASS Afeee': { id: 'afeee', name: 'Afeee', subtitle: 'Saffron Nectar & White Amber', price: 4500, size: '50ml', image: 'assets/bottle-afeee.jpg' }
  };

  addButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn.disabled || btn.classList.contains('processing')) return;
      btn.disabled = true;
      btn.classList.add('processing');

      const pName = btn.getAttribute('data-name') || btn.getAttribute('data-product') || 'Ember';
      const pInfo = productDataMap[pName] || { id: 'ember', name: pName, subtitle: 'Haute Parfumerie', price: 4500, size: '50ml', image: 'assets/bottle-ember.jpg' };

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
      updateHeaderBadge();

      const origText = btn.innerHTML;
      btn.innerHTML = `<span>✓ Added to Cart</span>`;
      btn.style.background = '#dea65f';
      btn.style.color = '#0d0c0b';

      setTimeout(() => {
        btn.innerHTML = origText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        btn.classList.remove('processing');
      }, 1400);
    });
  });

  // 5. Testimonials Carousel Navigation
  const prevReviewBtn = document.getElementById('prevReviewBtn');
  const nextReviewBtn = document.getElementById('nextReviewBtn');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  let currentReviewIndex = 0;

  function showReview(index) {
    if (!testimonialCards.length) return;
    testimonialCards.forEach((card, idx) => {
      card.classList.toggle('active', idx === index);
    });
  }

  if (prevReviewBtn && nextReviewBtn && testimonialCards.length > 0) {
    prevReviewBtn.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex - 1 + testimonialCards.length) % testimonialCards.length;
      showReview(currentReviewIndex);
    });

    nextReviewBtn.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex + 1) % testimonialCards.length;
      showReview(currentReviewIndex);
    });
  }

  // 6. Newsletter Subscription Handler with Coupon Offer
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm && newsletterEmail && newsletterFeedback) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = newsletterEmail.value.trim();
      if (!val) return;

      newsletterFeedback.style.display = 'block';
      newsletterFeedback.innerHTML = `✧ Welcome to the Circle! Use voucher code <strong style="color:#fff;background:rgba(222,166,95,0.25);padding:2px 8px;border-radius:4px;">AFDASS10</strong> at checkout for 10% off.`;
      newsletterEmail.value = '';
    });
  }

  // 7. Footer Mobile Accordion Engine
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
