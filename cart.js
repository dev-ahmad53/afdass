/**
 * AFDASS PERFUMES — cart.js
 * Dedicated Interactive Engine for Cart Page
 * Real-time Calculations, LocalStorage Sync, Steppers & WhatsApp Checkout
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initial Sample Seed (only on first-ever site visit)
  function initCartStorage() {
    let cart = null;
    const stored = localStorage.getItem('afdass_cart');
    const isSeeded = localStorage.getItem('afdass_cart_seeded');

    if (stored !== null) {
      try {
        cart = JSON.parse(stored);
      } catch (e) {
        cart = [];
      }
      if (!Array.isArray(cart)) {
        cart = [];
      }
    } else if (isSeeded === 'done') {
      // User or order previously emptied cart; keep it empty
      cart = [];
      localStorage.setItem('afdass_cart', JSON.stringify([]));
    } else {
      // First-ever visit to the site
      cart = [
        {
          id: 'ember',
          name: 'Ember',
          subtitle: 'Velvet Woods & Warm Amber',
          size: '50ml',
          price: 3000,
          quantity: 1,
          image: 'assets/bottle-ember.jpg',
          checked: true
        },
        {
          id: 'venta',
          name: 'Venta',
          subtitle: 'Citrus Energy & Refined Woods',
          size: '50ml',
          price: 3000,
          quantity: 1,
          image: 'assets/bottle-venta.jpg',
          checked: true
        },
        {
          id: 'fatima',
          name: 'Fatimaa',
          subtitle: 'Soft Florals & Sweet Elegance',
          size: '50ml',
          price: 3500,
          quantity: 1,
          image: 'assets/bottle-fatima.jpg',
          checked: true
        }
      ];
      localStorage.setItem('afdass_cart', JSON.stringify(cart));
      localStorage.setItem('afdass_cart_seeded', 'done');
    }

    // Ensure all existing items have checked property
    let modified = false;
    cart.forEach(item => {
      if (typeof item.checked === 'undefined') {
        item.checked = true;
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem('afdass_cart', JSON.stringify(cart));
    }

    return cart;
  }

  let cartItems = initCartStorage();

  // 2. DOM Elements
  const cartTableHeader = document.getElementById('cartTableHeader');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartTableFooter = document.getElementById('cartTableFooter');
  const chkSelectAll = document.getElementById('chkSelectAll');
  const selectedCountText = document.getElementById('selectedCountText');
  const btnRemoveSelected = document.getElementById('btnRemoveSelected');
  const summaryItemsCount = document.getElementById('summaryItemsCount');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryDelivery = document.getElementById('summaryDelivery');
  const summaryTotal = document.getElementById('summaryTotal');
  const btnProceedCheckout = document.getElementById('btnProceedCheckout');
  const btnWhatsAppCart = document.getElementById('btnWhatsAppCart');
  const headerCartCount = document.getElementById('headerCartCount');
  const recommendationsGrid = document.getElementById('recommendationsGrid');
  const cartToast = document.getElementById('cartToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  const cartMainGrid = document.querySelector('.cart-main-grid');
  const orderSummaryCol = document.querySelector('.order-summary-col');

  // Mobile Menu Drawer Engine
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

  // 3. Render Cart Items
  function renderCart() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    if (cartItems.length === 0) {
      if (cartTableHeader) cartTableHeader.style.display = 'none';
      if (cartEmptyState) cartEmptyState.style.display = 'block';
      if (cartTableFooter) cartTableFooter.style.display = 'none';
      if (cartMainGrid) cartMainGrid.classList.add('is-empty');
      if (orderSummaryCol) orderSummaryCol.style.display = 'none';
      updateSummary();
      updateHeaderBadge();
      return;
    }

    if (cartTableHeader) cartTableHeader.style.display = '';
    if (cartEmptyState) cartEmptyState.style.display = 'none';
    if (cartTableFooter) cartTableFooter.style.display = '';
    if (cartMainGrid) cartMainGrid.classList.remove('is-empty');
    if (orderSummaryCol) orderSummaryCol.style.display = '';

    cartItems.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.setAttribute('data-index', index);

      row.innerHTML = `
        <div class="cart-prod-cell">
          <label class="custom-checkbox-wrap" aria-label="Select ${item.name}">
            <input type="checkbox" class="item-chk" data-index="${index}" ${item.checked ? 'checked' : ''} />
            <span class="custom-checkbox-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </label>

          <a href="product-detail.html?product=${item.id || 'ember'}" class="cart-item-img-link" aria-label="View ${item.name}">
            <div class="cart-item-img-box">
              <div class="cart-item-glow"></div>
              <img src="${item.image || 'assets/bottle-ember.jpg'}" alt="${item.name}" class="cart-item-thumb" />
            </div>
          </a>

          <div class="cart-item-meta">
            <h3 class="cart-item-title">
              <a href="product-detail.html?product=${item.id || 'ember'}">${item.name}</a>
            </h3>
            <p class="cart-item-subtitle">${item.subtitle || 'Haute Parfumerie'}</p>
            <span class="cart-item-size-tag">Size: ${item.size || '50ml'}</span>
          </div>
        </div>

        <div class="cart-price-cell">
          Rs. ${item.price.toLocaleString()}
        </div>

        <div class="cart-qty-cell">
          <div class="cart-qty-stepper">
            <button class="cart-qty-btn minus" data-index="${index}" aria-label="Decrease quantity">−</button>
            <input type="text" class="cart-qty-val" value="${item.quantity}" readonly />
            <button class="cart-qty-btn plus" data-index="${index}" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="cart-total-cell" id="lineTotal-${index}">
          Rs. ${lineTotal.toLocaleString()}
        </div>

        <div class="cart-action-cell">
          <button class="btn-remove-item" data-index="${index}" aria-label="Remove ${item.name} from cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;

      cartItemsList.appendChild(row);
    });

    attachItemEvents();
    updateSummary();
    updateHeaderBadge();
  }

  // 4. Attach Event Listeners to Items
  function attachItemEvents() {
    // Individual Checkboxes
    document.querySelectorAll('.item-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        if (cartItems[idx]) {
          cartItems[idx].checked = e.target.checked;
          saveCart();
          updateSummary();
        }
      });
    });

    // Quantity Minus
    document.querySelectorAll('.cart-qty-btn.minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        if (cartItems[idx] && cartItems[idx].quantity > 1) {
          cartItems[idx].quantity -= 1;
          saveCart();
          renderCart();
        }
      });
    });

    // Quantity Plus
    document.querySelectorAll('.cart-qty-btn.plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        if (cartItems[idx] && cartItems[idx].quantity < 10) {
          cartItems[idx].quantity += 1;
          saveCart();
          renderCart();
        }
      });
    });

    // Remove Single Item
    document.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        const removedName = cartItems[idx] ? cartItems[idx].name : 'Item';
        cartItems.splice(idx, 1);
        saveCart();
        renderCart();
        showToast('Item Removed', `${removedName} was removed from your cart.`);
      });
    });
  }

  // 5. Select All Checkbox
  if (chkSelectAll) {
    chkSelectAll.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      cartItems.forEach(item => { item.checked = isChecked; });
      saveCart();
      renderCart();
    });
  }

  // 6. Remove Selected
  if (btnRemoveSelected) {
    btnRemoveSelected.addEventListener('click', () => {
      const countBefore = cartItems.length;
      cartItems = cartItems.filter(item => !item.checked);
      const removedCount = countBefore - cartItems.length;
      saveCart();
      renderCart();
      if (removedCount > 0) {
        showToast('Cart Updated', `${removedCount} item(s) removed.`);
      }
    });
  }

  // 7. Coupon Voucher Engine
  let appliedCoupon = null;
  const couponInput = document.getElementById('couponInput');
  const btnApplyCoupon = document.getElementById('btnApplyCoupon');
  const couponStatus = document.getElementById('couponStatus');
  const summaryDiscountRow = document.getElementById('summaryDiscountRow');
  const summaryDiscountCode = document.getElementById('summaryDiscountCode');
  const summaryDiscountVal = document.getElementById('summaryDiscountVal');

  const modalDiscountRow = document.getElementById('modalDiscountRow');
  const modalDiscountCode = document.getElementById('modalDiscountCode');
  const modalDiscountVal = document.getElementById('modalDiscountVal');

  const validCoupons = {
    'AFDASS10': { code: 'AFDASS10', type: 'percent', value: 10, label: '10% OFF' },
    'WELCOME': { code: 'WELCOME', type: 'flat', value: 500, label: 'Rs. 500 OFF' },
    'LUXURY': { code: 'LUXURY', type: 'percent', value: 15, label: '15% OFF' }
  };

  function calculateDiscount(subtotal) {
    if (!appliedCoupon || subtotal <= 0) return 0;
    if (appliedCoupon.type === 'percent') {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'flat') {
      return Math.min(subtotal, appliedCoupon.value);
    }
    return 0;
  }

  if (btnApplyCoupon && couponInput) {
    btnApplyCoupon.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (!code) {
        if (couponStatus) {
          couponStatus.className = 'coupon-status-msg error';
          couponStatus.textContent = 'Please enter a voucher code.';
          couponStatus.style.display = 'block';
        }
        return;
      }

      if (validCoupons[code]) {
        appliedCoupon = validCoupons[code];
        if (couponStatus) {
          couponStatus.className = 'coupon-status-msg success';
          couponStatus.textContent = `✓ Coupon "${code}" applied! (${appliedCoupon.label})`;
          couponStatus.style.display = 'block';
        }
        updateSummary();
        showToast('Coupon Applied', `Code "${code}" applied successfully.`);
      } else {
        if (couponStatus) {
          couponStatus.className = 'coupon-status-msg error';
          couponStatus.textContent = 'Invalid promo code. Try AFDASS10 for 10% off.';
          couponStatus.style.display = 'block';
        }
      }
    });

    couponInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnApplyCoupon.click();
      }
    });
  }

  // 7b. Update Summary & WhatsApp Link
  function updateSummary() {
    const checkedItems = cartItems.filter(item => item.checked);
    const totalCount = checkedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = checkedItems.length > 0 ? 200 : 0;
    const discount = calculateDiscount(subtotal);
    const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

    // Checkbox header status
    const allChecked = cartItems.length > 0 && cartItems.every(i => i.checked);
    if (chkSelectAll) chkSelectAll.checked = allChecked;

    if (selectedCountText) selectedCountText.textContent = `${checkedItems.length} items`;
    if (summaryItemsCount) summaryItemsCount.textContent = `${totalCount} items`;
    if (summarySubtotal) summarySubtotal.textContent = `Rs. ${subtotal.toLocaleString()}`;
    if (summaryDelivery) summaryDelivery.textContent = deliveryFee > 0 ? `Rs. ${deliveryFee}` : 'Rs. 0';
    
    // Display discount row
    if (discount > 0 && appliedCoupon) {
      if (summaryDiscountRow) summaryDiscountRow.style.display = 'flex';
      if (summaryDiscountCode) summaryDiscountCode.textContent = `${appliedCoupon.code} (${appliedCoupon.label})`;
      if (summaryDiscountVal) summaryDiscountVal.textContent = `-Rs. ${discount.toLocaleString()}`;
    } else {
      if (summaryDiscountRow) summaryDiscountRow.style.display = 'none';
    }

    if (summaryTotal) summaryTotal.textContent = `Rs. ${finalTotal.toLocaleString()}`;

    // Update buttons state
    if (btnProceedCheckout) {
      if (cartItems.length === 0) {
        btnProceedCheckout.style.opacity = '0.55';
        btnProceedCheckout.style.cursor = 'not-allowed';
      } else {
        btnProceedCheckout.style.opacity = '1';
        btnProceedCheckout.style.cursor = 'pointer';
      }
    }

    // WhatsApp dynamic order generation
    if (btnWhatsAppCart) {
      if (cartItems.length === 0) {
        btnWhatsAppCart.style.opacity = '0.55';
        btnWhatsAppCart.style.cursor = 'not-allowed';
        btnWhatsAppCart.href = 'https://wa.me/923125797051?text=' + encodeURIComponent('Hello AFDASS Perfumes! I would like to inquire about your fragrances.');
      } else if (checkedItems.length === 0) {
        btnWhatsAppCart.style.opacity = '0.85';
        btnWhatsAppCart.style.cursor = 'pointer';
        btnWhatsAppCart.href = 'https://wa.me/923125797051?text=' + encodeURIComponent('Hello AFDASS Perfumes! I would like to inquire about your fragrances.');
      } else {
        btnWhatsAppCart.style.opacity = '1';
        btnWhatsAppCart.style.cursor = 'pointer';
        let msg = `Hello AFDASS Perfumes! I would like to place an order for the following items:\n\n`;
        checkedItems.forEach((it, i) => {
          msg += `${i + 1}. *${it.name}* (${it.size || '50ml'}) × ${it.quantity} = Rs. ${(it.price * it.quantity).toLocaleString()}\n`;
        });
        msg += `\n*Subtotal:* Rs. ${subtotal.toLocaleString()}\n`;
        if (discount > 0 && appliedCoupon) {
          msg += `*Discount (${appliedCoupon.code}):* -Rs. ${discount.toLocaleString()}\n`;
        }
        msg += `*Delivery Fee:* Rs. ${deliveryFee}\n`;
        msg += `*Grand Total:* Rs. ${finalTotal.toLocaleString()}\n\n`;
        msg += `Please confirm availability and share Cash on Delivery details. Thank you!`;

        btnWhatsAppCart.href = `https://wa.me/923125797051?text=${encodeURIComponent(msg)}`;
      }
    }
  }

  // 8. Order Confirmation & Delivery Details Checkout System
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutBackdrop = document.getElementById('checkoutBackdrop');
  const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const custName = document.getElementById('custName');
  const custPhone = document.getElementById('custPhone');
  const custAddress = document.getElementById('custAddress');
  const custCity = document.getElementById('custCity');
  const otherCityWrap = document.getElementById('otherCityWrap');
  const custOtherCity = document.getElementById('custOtherCity');
  const custNote = document.getElementById('custNote');
  const modalItemCount = document.getElementById('modalItemCount');
  const modalItemsList = document.getElementById('modalItemsList');
  const modalSubtotal = document.getElementById('modalSubtotal');
  const modalDelivery = document.getElementById('modalDelivery');
  const modalTotal = document.getElementById('modalTotal');

  const orderSuccessModal = document.getElementById('orderSuccessModal');
  const successOrderId = document.getElementById('successOrderId');
  const btnSuccessClose = document.getElementById('btnSuccessClose');

  // Open Checkout Modal
  function openCheckoutModal() {
    if (cartItems.length === 0) {
      showToast('Cart is Empty', 'Your cart is currently empty. Please select a fragrance to proceed.');
      return;
    }

    const checkedItems = cartItems.filter(item => item.checked);
    if (checkedItems.length === 0) {
      showToast('No Items Selected', 'Please check at least one perfume to proceed.');
      return;
    }

    const totalQty = checkedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 200;
    const discount = calculateDiscount(subtotal);
    const finalTotal = Math.max(0, subtotal - discount + delivery);

    // Populate Modal Summary
    if (modalItemCount) modalItemCount.textContent = `${totalQty}`;
    if (modalSubtotal) modalSubtotal.textContent = `Rs. ${subtotal.toLocaleString()}`;
    
    if (discount > 0 && appliedCoupon) {
      if (modalDiscountRow) modalDiscountRow.style.display = 'flex';
      if (modalDiscountCode) modalDiscountCode.textContent = appliedCoupon.code;
      if (modalDiscountVal) modalDiscountVal.textContent = `-Rs. ${discount.toLocaleString()}`;
    } else {
      if (modalDiscountRow) modalDiscountRow.style.display = 'none';
    }

    if (modalDelivery) modalDelivery.textContent = `Rs. ${delivery}`;
    if (modalTotal) modalTotal.textContent = `Rs. ${finalTotal.toLocaleString()}`;

    if (modalItemsList) {
      modalItemsList.innerHTML = '';
      checkedItems.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'modal-item-mini';
        itemRow.innerHTML = `
          <div class="mini-thumb-wrap">
            <img src="${item.image || 'assets/bottle-ember.jpg'}" alt="${item.name}" class="mini-thumb" />
          </div>
          <div class="mini-info">
            <span class="mini-name">${item.name}</span>
            <span class="mini-sub">${item.size || '50ml'} × ${item.quantity}</span>
          </div>
          <span class="mini-price">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
        `;
        modalItemsList.appendChild(itemRow);
      });
    }

    if (checkoutModal) {
      checkoutModal.classList.add('active');
      checkoutModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCheckoutModal() {
    if (checkoutModal) {
      checkoutModal.classList.remove('active');
      checkoutModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Trigger Checkout Modal
  if (btnProceedCheckout) {
    btnProceedCheckout.addEventListener('click', (e) => {
      e.preventDefault();
      openCheckoutModal();
    });
  }

  if (btnWhatsAppCart) {
    btnWhatsAppCart.addEventListener('click', (e) => {
      e.preventDefault();
      openCheckoutModal();
    });
  }

  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckoutModal);
  if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', closeCheckoutModal);

  // Toggle "Other" City Input
  if (custCity) {
    custCity.addEventListener('change', () => {
      if (custCity.value === 'Other') {
        if (otherCityWrap) otherCityWrap.style.display = 'block';
        if (custOtherCity) custOtherCity.required = true;
      } else {
        if (otherCityWrap) otherCityWrap.style.display = 'none';
        if (custOtherCity) custOtherCity.required = false;
      }
    });
  }

  // Payment Method Selection Highlighting
  const paymentCards = document.querySelectorAll('.payment-option-card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Handle Form Submission -> WhatsApp Order
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = custName ? custName.value.trim() : '';
      const phone = custPhone ? custPhone.value.trim() : '';
      const address = custAddress ? custAddress.value.trim() : '';
      let city = custCity ? custCity.value : '';
      if (city === 'Other' && custOtherCity) {
        city = custOtherCity.value.trim() || 'Other';
      }
      const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
      const paymentMethod = selectedPayment ? selectedPayment.value : 'Cash on Delivery (COD)';
      const note = custNote ? custNote.value.trim() : '';

      const checkedItems = cartItems.filter(item => item.checked);
      if (checkedItems.length === 0) {
        alert('Please select at least one item from your cart.');
        return;
      }

      const subtotal = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const delivery = 200;
      const discount = calculateDiscount(subtotal);
      const total = Math.max(0, subtotal - discount + delivery);

      // Generate Order ID
      const orderId = '#AFD-' + Math.floor(1000 + Math.random() * 9000);

      // Build Official WhatsApp Message
      let msg = `✨ *NEW ORDER — AFDASS PERFUMES* ✨\n`;
      msg += `*Order Reference:* ${orderId}\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `*CUSTOMER DETAILS:*\n`;
      msg += `👤 *Name:* ${name}\n`;
      msg += `📞 *WhatsApp:* ${phone}\n`;
      msg += `📍 *Delivery Address:* ${address}\n`;
      msg += `🏙️ *City:* ${city}\n`;
      msg += `💳 *Payment Method:* ${paymentMethod}\n`;
      if (note) {
        msg += `📝 *Special Note:* ${note}\n`;
      }
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `*ORDER ITEMS:*\n`;
      checkedItems.forEach((it, i) => {
        msg += `${i + 1}. *${it.name}* (${it.size || '50ml'}) × ${it.quantity} = Rs. ${(it.price * it.quantity).toLocaleString()}\n`;
      });
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `*Subtotal:* Rs. ${subtotal.toLocaleString()}\n`;
      if (discount > 0 && appliedCoupon) {
        msg += `*Voucher (${appliedCoupon.code}):* -Rs. ${discount.toLocaleString()}\n`;
      }
      msg += `*Nationwide Delivery:* Rs. ${delivery}\n`;
      msg += `💰 *Grand Total:* Rs. ${total.toLocaleString()}\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `Please confirm my order and share dispatch / tracking details. Thank you!`;

      // Open WhatsApp in new tab
      const waNumber = '923125797051';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');

      // Close checkout modal
      closeCheckoutModal();

      // Show Success Modal
      if (orderSuccessModal) {
        if (successOrderId) successOrderId.textContent = orderId;
        orderSuccessModal.classList.add('active');
        orderSuccessModal.setAttribute('aria-hidden', 'false');
      }

      // Clear entire cart completely after order is confirmed
      cartItems = [];
      saveCart();
      renderCart();
    });
  }

  // Close Success Modal
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => {
      if (orderSuccessModal) {
        orderSuccessModal.classList.remove('active');
        orderSuccessModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // 9. Save Cart & Sync Badge
  function saveCart() {
    localStorage.setItem('afdass_cart', JSON.stringify(cartItems));
    localStorage.setItem('afdass_cart_seeded', 'done');
  }

  function updateHeaderBadge() {
    const totalQty = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (headerCartCount) {
      headerCartCount.textContent = `(${totalQty})`;
    }
  }

  // 10. Toast Notification Helper (Disabled per design request)
  function showToast(title, desc) {
    // Disabled: floating toast notification removed
    return;
  }

  // 11. "You May Also Like" Recommendations Engine
  const recommendedProducts = [
    {
      id: 'ember',
      name: 'Ember',
      subtitle: 'Velvet Woods & Warm Amber',
      price: 3000,
      image: 'assets/bottle-ember.jpg'
    },
    {
      id: 'venta',
      name: 'Venta',
      subtitle: 'Citrus Energy & Refined Woods',
      price: 3000,
      image: 'assets/bottle-venta.jpg'
    },
    {
      id: 'fatima',
      name: 'Fatimaa',
      subtitle: 'Soft Florals & Sweet Elegance',
      price: 3500,
      image: 'assets/bottle-fatima.jpg'
    },
    {
      id: 'afeee',
      name: 'Afeee',
      subtitle: 'Fresh Greens & Soft Musk',
      price: 3500,
      image: 'assets/bottle-afeee.jpg'
    }
  ];

  function renderRecommendations() {
    if (!recommendationsGrid) return;
    recommendationsGrid.innerHTML = '';

    recommendedProducts.forEach(prod => {
      const card = document.createElement('article');
      card.className = 'rec-card';
      card.innerHTML = `
        <div class="rec-img-wrap">
          <a href="product-detail.html?product=${prod.id}" aria-label="View ${prod.name}">
            <img src="${prod.image}" alt="${prod.name}" class="rec-img" />
          </a>
          <button class="rec-wish-btn" aria-label="Add to Wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <div class="rec-body">
          <h3 class="rec-name">
            <a href="product-detail.html?product=${prod.id}">${prod.name}</a>
          </h3>
          <p class="rec-subtitle">${prod.subtitle}</p>
          <span class="rec-price">Rs. ${prod.price.toLocaleString()}</span>
          <button class="btn-rec-add" data-id="${prod.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Add to Cart</span>
          </button>
        </div>
      `;

      // Wishlist toggle
      const wishBtn = card.querySelector('.rec-wish-btn');
      wishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wishBtn.classList.toggle('wished');
        const svg = wishBtn.querySelector('svg');
        if (wishBtn.classList.contains('wished')) {
          svg.setAttribute('fill', '#dea65f');
          svg.setAttribute('stroke', '#dea65f');
        } else {
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
        }
      });

      // Quick add to cart
      const addBtn = card.querySelector('.btn-rec-add');
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (addBtn.disabled) return;
        addBtn.disabled = true;
        setTimeout(() => { addBtn.disabled = false; }, 600);

        const existingIdx = cartItems.findIndex(it => it.id === prod.id && it.size === '50ml');
        if (existingIdx > -1) {
          cartItems[existingIdx].quantity += 1;
          cartItems[existingIdx].checked = true;
        } else {
          cartItems.push({
            id: prod.id,
            name: prod.name,
            subtitle: prod.subtitle,
            size: '50ml',
            price: prod.price,
            quantity: 1,
            image: prod.image,
            checked: true
          });
        }
        saveCart();
        renderCart();
        showToast('Added to Cart', `${prod.name} (50ml) added to your cart.`);
      });

      recommendationsGrid.appendChild(card);
    });
  }

  // 12. Initialize Everything
  renderCart();
  renderRecommendations();

  // Auto-trigger modal if URL query specifies ?checkout=1 or ?checkout=true
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('checkout') === '1' || urlParams.get('checkout') === 'true') {
    setTimeout(openCheckoutModal, 250);
  } else if (urlParams.get('success') === '1' || urlParams.get('success') === 'true') {
    setTimeout(() => {
      if (orderSuccessModal) {
        if (successOrderId) successOrderId.textContent = '#AFD-8492';
        orderSuccessModal.classList.add('active');
      }
    }, 250);
  }

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
