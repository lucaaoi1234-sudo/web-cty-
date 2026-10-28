const menuToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.primary-navigation');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];

function closeMenu() {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Mở menu điều hướng');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Mở menu điều hướng' : 'Đóng menu điều hướng');
  navigation?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSections = entries.filter((entry) => entry.isIntersecting);
    if (!visibleSections.length) return;
    const currentSection = visibleSections.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target;
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentSection.id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }, {
    rootMargin: '-28% 0px -58% 0px',
    threshold: [0, 0.15, 0.4, 0.7]
  });
  sections.forEach((section) => sectionObserver.observe(section));
}

const year = document.querySelector('#current-year');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  if (formStatus) {
    formStatus.textContent = 'Cảm ơn bạn! Đây là bản xem trước — biểu mẫu chưa gửi dữ liệu. Vui lòng kết nối email hoặc CRM trước khi phát hành.';
  }
});

const productDialog = document.querySelector('#product-gallery-dialog');
const productDialogTrigger = document.querySelector('.product-gallery-trigger');
const productCard = document.querySelector('.solution-card-gallery');
const productGallery = document.querySelector('#product-gallery');
const productStatus = document.querySelector('#product-gallery-status');
const productCloseButton = document.querySelector('.product-dialog-close');
const productFilters = [...document.querySelectorAll('.product-filter')];
const productTiles = [...document.querySelectorAll('.product-tile')];
let productFilterTimer;

function applyProductFilter(selectedFilter, animate = true, loadImages = true) {
  if (!productGallery || !selectedFilter) return;
  window.clearTimeout(productFilterTimer);

  const updateGallery = () => {
    productFilters.forEach((filter) => {
      const isSelected = filter === selectedFilter;
      filter.classList.toggle('is-selected', isSelected);
      filter.setAttribute('aria-selected', String(isSelected));
      filter.tabIndex = isSelected ? 0 : -1;
    });

    const category = selectedFilter.dataset.productFilter;
    const visibleTiles = [];
    productTiles.forEach((tile) => {
      const categories = tile.dataset.categories.split(/\s+/);
      const isVisible = category === 'all' || categories.includes(category);
      tile.hidden = !isVisible;
      tile.classList.remove('is-entering');
      if (isVisible) {
        const image = tile.querySelector('img[data-src]');
        if (loadImages && image) {
          if (image.dataset.loaded !== 'true') {
            const revealImage = () => image.classList.add('is-loaded');
            image.addEventListener('load', revealImage, { once: true });
            image.addEventListener('error', revealImage, { once: true });
            image.dataset.loaded = 'true';
            image.src = image.dataset.src;
          } else if (image.complete) {
            image.classList.add('is-loaded');
          }
        }
        visibleTiles.push(tile);
      }
    });

    productGallery.setAttribute('aria-labelledby', selectedFilter.id);
    if (productStatus) productStatus.textContent = `Hiển thị ${visibleTiles.length} mục`;

    window.requestAnimationFrame(() => {
      visibleTiles.forEach((tile, index) => {
        tile.style.setProperty('--reveal-delay', `${Math.min(index * 55, 220)}ms`);
        if (animate) tile.classList.add('is-entering');
      });
      productGallery.classList.remove('is-switching');
    });
  };

  if (!animate) {
    updateGallery();
    return;
  }

  productGallery.classList.add('is-switching');
  productFilterTimer = window.setTimeout(updateGallery, 130);
}

function openProductGallery() {
  if (!productDialog) return;
  if (typeof productDialog.showModal === 'function') {
    if (!productDialog.open) productDialog.showModal();
  } else {
    productDialog.setAttribute('open', '');
  }
  const activeFilter = productFilters.find((filter) => filter.getAttribute('aria-selected') === 'true') || productFilters[0];
  applyProductFilter(activeFilter, true);
}

function closeProductGallery() {
  if (!productDialog) return;
  if (typeof productDialog.close === 'function') productDialog.close();
  else productDialog.removeAttribute('open');
}

productDialogTrigger?.addEventListener('click', openProductGallery);
productCard?.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('button, a')) return;
  openProductGallery();
});
productCloseButton?.addEventListener('click', closeProductGallery);
productDialog?.addEventListener('click', (event) => {
  if (event.target === productDialog) closeProductGallery();
});
productDialog?.addEventListener('close', () => {
  productGallery?.classList.remove('is-switching');
  productDialogTrigger?.focus({ preventScroll: true });
});

productFilters.forEach((filter, index) => {
  filter.addEventListener('click', () => applyProductFilter(filter));
  filter.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % productFilters.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + productFilters.length) % productFilters.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = productFilters.length - 1;
    else return;
    event.preventDefault();
    productFilters[nextIndex].focus();
    applyProductFilter(productFilters[nextIndex]);
  });
});

if (productFilters.length) applyProductFilter(productFilters[0], false, false);
