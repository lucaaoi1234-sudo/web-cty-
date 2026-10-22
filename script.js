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
