/**
 * AFDASS PERFUMES — contact.js
 * Interactive logic for Contact page:
 * - Cart count synchronization
 * - Mobile navigation drawer
 * - Interactive FAQ accordion
 * - Inquiry form validation & Dual WhatsApp / Direct submission
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Sync Cart Count from localStorage
  const updateCartBadge = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('afdass_cart') || '[]');
      const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const badges = document.querySelectorAll('#headerCartCount, .cart-badge');
      badges.forEach(badge => {
        badge.textContent = `(${totalCount})`;
      });
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
  };
  updateCartBadge();
  window.addEventListener('storage', updateCartBadge);

  // 2. Mobile Drawer Navigation Engine
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
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

  // 3. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            other.querySelector('.faq-question-btn')?.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle clicked item
        if (isOpen) {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // 4. Contact Form Validation & Submission
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const btnSendWhatsApp = document.getElementById('btnSendViaWhatsApp');
  const feedbackBox = document.getElementById('formFeedback');

  const validateField = (input, errorId, condition) => {
    const group = input.closest('.form-group');
    if (!condition) {
      group?.classList.add('has-error');
      return false;
    } else {
      group?.classList.remove('has-error');
      return true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    // Name
    const nameValid = (nameInput.value.trim().length >= 2);
    if (!validateField(nameInput, 'nameError', nameValid)) isValid = false;

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailPattern.test(emailInput.value.trim());
    if (!validateField(emailInput, 'emailError', emailValid)) isValid = false;

    // Phone
    const phoneValid = (phoneInput.value.trim().length >= 7);
    if (!validateField(phoneInput, 'phoneError', phoneValid)) isValid = false;

    // Message
    const msgValid = (messageInput.value.trim().length >= 3);
    if (!validateField(messageInput, 'messageError', msgValid)) isValid = false;

    return isValid;
  };

  // Submit via Standard Message
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const submitBtn = document.getElementById('btnSubmitForm');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span><span class="pill-arrow">→</span>';

        feedbackBox.className = 'form-feedback-box success';
        feedbackBox.innerHTML = `
          <strong>Thank you, ${nameInput.value.trim()}!</strong><br />
          Your message has been received by our luxury concierge. We will get back to you within 24 business hours.
        `;

        contactForm.reset();
        setTimeout(() => {
          feedbackBox.style.display = 'none';
        }, 8000);
      }, 700);
    });
  }

  // Submit via Direct WhatsApp
  if (btnSendWhatsApp) {
    btnSendWhatsApp.addEventListener('click', () => {
      const name = nameInput.value.trim() || 'Valued Client';
      const email = emailInput.value.trim() || 'Not specified';
      const phone = phoneInput.value.trim() || 'Not specified';
      const subject = subjectInput.value;
      const msg = messageInput.value.trim() || 'Inquiring about AFDASS luxury fragrances.';

      const waText = 
`*NEW INQUIRY — AFDASS PERFUMES*
✦ *Client Name:* ${name}
✦ *Phone:* ${phone}
✦ *Email:* ${email}
✦ *Topic:* ${subject}
✦ *Message:* ${msg}`;

      const waUrl = `https://wa.me/923125797051?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank', 'noopener');
    });
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
