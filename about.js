/**
 * AFDASS PERFUMES — about.js
 * Interactive scripts for About Maison Page
 * Synchronizes cart badge and mobile navigation
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

  // 2. Synchronize Header Cart Badge
  const headerCartCount = document.getElementById('headerCartCount');

  function updateCartBadge() {
    let count = 0;
    try {
      const cart = JSON.parse(localStorage.getItem('afdass_cart')) || [];
      count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    } catch (e) {
      count = 0;
    }

    if (headerCartCount) {
      headerCartCount.textContent = `(${count})`;
      if (count > 0) {
        headerCartCount.style.color = '#dea65f';
      } else {
        headerCartCount.style.color = '';
      }
    }
  }

  updateCartBadge();

  // 3. Footer Mobile Accordion Engine
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
