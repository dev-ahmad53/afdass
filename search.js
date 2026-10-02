/**
 * AFDASS PERFUMES — search.js
 * Omnipresent Luxury Live Search Modal Engine
 * Supports real-time autocomplete, category filters, instant Add to Bag & keyboard navigation
 */

(function () {
  // 1. Catalog Database for Live Search
  const searchCatalog = [
    {
      id: 'ember',
      name: 'AFDASS Ember',
      category: 'men unisex',
      tag: 'Best Seller',
      notes: 'Smoky Oud, Warm Amber, Italian Bergamot & Agarwood',
      price: 4500,
      image: 'assets/bottle-ember.jpg',
      url: 'product-detail.html?product=ember'
    },
    {
      id: 'venta',
      name: 'AFDASS Venta',
      category: 'men',
      tag: 'Signature Masculine',
      notes: 'Tuscan Leather, Pink Pepper, Radiant Citrus & Birch',
      price: 4500,
      image: 'assets/bottle-venta.jpg',
      url: 'product-detail.html?product=venta'
    },
    {
      id: 'fatima',
      name: 'AFDASS Fatima',
      category: 'women',
      tag: 'Haute Floral',
      notes: 'Damascus Rose, White Musk, Soft Cashmere & Peach Nectar',
      price: 4500,
      image: 'assets/bottle-fatima.jpg',
      url: 'product-detail.html?product=fatima'
    },
    {
      id: 'afeee',
      name: 'AFDASS Afeee',
      category: 'unisex',
      tag: 'Extrait de Parfum',
      notes: 'Saffron Nectar, Golden Amber, Velvet Vanilla & Cedar',
      price: 4500,
      image: 'assets/bottle-afeee.jpg',
      url: 'product-detail.html?product=afeee'
    }
  ];

  let searchBackdrop = null;
  let searchInput = null;
  let resultsContainer = null;
  let activeTag = 'all';

  // 2. Build and inject Search Modal DOM
  function createSearchModal() {
    if (document.getElementById('globalSearchModal')) return;

    searchBackdrop = document.createElement('div');
    searchBackdrop.id = 'globalSearchModal';
    searchBackdrop.className = 'search-modal-backdrop';
    searchBackdrop.setAttribute('aria-hidden', 'true');
    searchBackdrop.innerHTML = `
      <div class="search-modal-dialog" role="dialog" aria-modal="true" aria-label="Search Fragrances">
        <!-- Search Input Header -->
        <div class="search-input-header">
          <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="search" 
            class="search-input-field" 
            id="globalSearchInput" 
            placeholder="Search our fragrances, notes (Oud, Rose, Amber)..." 
            autocomplete="off" 
            spellcheck="false" 
          />
          <div class="search-actions-wrap">
            <span class="search-esc-badge">ESC</span>
            <button class="search-close-btn" id="searchCloseBtn" aria-label="Close search">&times;</button>
          </div>
        </div>

        <!-- Filter Tags Row -->
        <div class="search-tags-row">
          <button class="search-tag-chip active" data-tag="all">All Fragrances</button>
          <button class="search-tag-chip" data-tag="oud">Smoky Oud</button>
          <button class="search-tag-chip" data-tag="amber">Warm Amber</button>
          <button class="search-tag-chip" data-tag="rose">Damask Rose</button>
          <button class="search-tag-chip" data-tag="leather">Tuscan Leather</button>
          <button class="search-tag-chip" data-tag="men">Men</button>
          <button class="search-tag-chip" data-tag="women">Women</button>
          <button class="search-tag-chip" data-tag="unisex">Unisex</button>
        </div>

        <!-- Results Scrollable Area -->
        <div class="search-results-scroll">
          <div class="search-results-grid" id="searchResultsGrid">
            <!-- Dynamic results populated here -->
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(searchBackdrop);

    searchInput = document.getElementById('globalSearchInput');
    resultsContainer = document.getElementById('searchResultsGrid');

    // Close on backdrop click
    searchBackdrop.addEventListener('click', (e) => {
      if (e.target === searchBackdrop) {
        closeSearch();
      }
    });

    // Close button
    document.getElementById('searchCloseBtn').addEventListener('click', closeSearch);

    // Live search input listener
    searchInput.addEventListener('input', () => {
      renderResults(searchInput.value.trim(), activeTag);
    });

    // Tag chips click listeners
    const chips = searchBackdrop.querySelectorAll('.search-tag-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeTag = chip.getAttribute('data-tag') || 'all';
        renderResults(searchInput.value.trim(), activeTag);
      });
    });

    // Initial render of all products
    renderResults('', 'all');
  }

  // 3. Render Search Results based on query and active filter
  function renderResults(query, tag) {
    if (!resultsContainer) return;
    const lowerQ = query.toLowerCase();

    const filtered = searchCatalog.filter(item => {
      // Tag filter matching
      let matchesTag = true;
      if (tag && tag !== 'all') {
        const lowerTag = tag.toLowerCase();
        if (lowerTag === 'men') {
          matchesTag = item.category.split(/\s+/).includes('men');
        } else if (lowerTag === 'women') {
          matchesTag = item.category.split(/\s+/).includes('women');
        } else if (lowerTag === 'unisex') {
          matchesTag = item.category.split(/\s+/).includes('unisex');
        } else {
          const textToSearch = `${item.name} ${item.category} ${item.notes} ${item.tag}`.toLowerCase();
          matchesTag = textToSearch.includes(lowerTag);
        }
      }

      // Query filter matching
      let matchesQuery = true;
      if (lowerQ) {
        if (lowerQ === 'men') {
          matchesQuery = /\bmen\b/i.test(`${item.name} ${item.category} ${item.notes} ${item.tag}`);
        } else {
          const fullSearchText = `${item.name} ${item.category} ${item.notes} ${item.tag}`.toLowerCase();
          matchesQuery = fullSearchText.includes(lowerQ);
        }
      }

      return matchesTag && matchesQuery;
    });

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <div class="search-empty-icon">✧</div>
          <h4 class="search-empty-title">No Fragrances Found</h4>
          <p class="search-empty-desc">We couldn't find matches for "${query}". Try searching for "Oud", "Amber", "Rose", or "Men".</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.map(item => `
      <article class="search-item-card" data-id="${item.id}">
        <a href="${item.url}" class="search-item-left" style="text-decoration:none;color:inherit;flex:1;">
          <img src="${item.image}" alt="${item.name}" class="search-item-img" />
          <div class="search-item-meta">
            <h4 class="search-item-title">${item.name}</h4>
            <p class="search-item-notes">${item.notes}</p>
            <span class="search-item-badge">${item.tag}</span>
          </div>
        </a>
        <div class="search-item-right">
          <span class="search-item-price">Rs. ${item.price.toLocaleString()}</span>
          <button class="search-btn-add" data-id="${item.id}" aria-label="Add ${item.name} to cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Add to Bag</span>
          </button>
        </div>
      </article>
    `).join('');

    // Attach click events to "Add to Bag" buttons inside search modal
    resultsContainer.querySelectorAll('.search-btn-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pId = btn.getAttribute('data-id');
        const prod = searchCatalog.find(p => p.id === pId);
        if (!prod) return;

        addSearchItemToCart(prod, btn);
      });
    });
  }

  // 4. Quick Add to Cart from Search Modal
  function addSearchItemToCart(prod, btn) {
    if (btn.disabled) return;
    btn.disabled = true;

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('afdass_cart')) || [];
    } catch (e) {
      cart = [];
    }

    const existingIdx = cart.findIndex(it => it.id === prod.id && it.size === '50ml');
    if (existingIdx > -1) {
      cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + 1;
      cart[existingIdx].checked = true;
    } else {
      cart.push({
        id: prod.id,
        name: prod.name,
        subtitle: prod.notes,
        size: '50ml',
        price: prod.price,
        quantity: 1,
        image: prod.image,
        checked: true
      });
    }

    localStorage.setItem('afdass_cart', JSON.stringify(cart));
    localStorage.setItem('afdass_cart_seeded', 'done');

    // Visual feedback
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✓ Added</span>';
    btn.style.background = '#dea65f';
    btn.style.color = '#0e0906';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 1200);

    // Sync header badges across the site
    syncAllCartBadges();
  }

  // 5. Global Cart Badges Sync
  function syncAllCartBadges() {
    let count = 0;
    try {
      const cart = JSON.parse(localStorage.getItem('afdass_cart')) || [];
      count = cart.reduce((sum, it) => sum + (it.quantity || 1), 0);
    } catch (e) {
      count = 0;
    }

    document.querySelectorAll('.navbar .cart-badge, .nav-actions .cart-badge, #headerCartCount').forEach(badge => {
      badge.textContent = `(${count})`;
      if (count > 0) {
        badge.style.color = '#dea65f';
      }
    });

    document.querySelectorAll('.floating-quick-cart .cart-badge').forEach(badge => {
      badge.textContent = `(${count})`;
      badge.style.color = '#0e0906';
    });
  }

  // 6. Modal Open & Close Triggers
  function openSearch() {
    createSearchModal();
    if (!searchBackdrop) return;
    searchBackdrop.classList.add('active');
    searchBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }, 150);
  }

  function closeSearch() {
    if (!searchBackdrop) return;
    searchBackdrop.classList.remove('active');
    searchBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // 7. Attach Listeners to All Search Buttons on Current Page
  function initSearchButtons() {
    createSearchModal();

    // Select all potential search trigger buttons or links
    const searchTriggers = document.querySelectorAll(
      '#btnNavSearch, .nav-action-btn.search-btn, .nav-action-btn[aria-label="Search"], .nav-action-btn[aria-label="Search Fragrances"], button[aria-label="Search"]'
    );

    searchTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
      });
    });

    // Keyboard shortcut: pressing "/" or "Ctrl + K" opens search, "Esc" closes
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchBackdrop && searchBackdrop.classList.contains('active')) {
        closeSearch();
      } else if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
      ) {
        e.preventDefault();
        openSearch();
      }
    });
  }

  // Auto-init on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchButtons);
  } else {
    initSearchButtons();
  }

  // Expose on window for programmatic control
  window.AfdassSearch = {
    open: openSearch,
    close: closeSearch
  };
})();
