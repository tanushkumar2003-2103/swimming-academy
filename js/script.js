/**
 * SWIMMING ACADEMY - INTERACTIVE CLIENT JAVASCRIPT
 * Strictly Vanilla JS (No external libraries, No frameworks)
 * Handles:
 * 1. Sticky Navigation & Dynamic Header Scroll
 * 2. Mobile Hamburger Menu Toggle & Accessible Focus
 * 3. Active Link Highlight based on current path
 * 4. FAQ Accordion Interaction
 * 5. Interactive Schedule & Program Category Filters
 * 6. Pricing Plan Interactive Selector
 * 7. Demonstration Form Validation (Trial Class & Contact Forms)
 * 8. Gallery Lightbox Modal for Image Placeholders
 * 9. Scroll to Top Behavior
 * 10. Dynamic Copyright Year
 * 11. Scroll Reveal Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initActiveNav();
  initFaqAccordion();
  initScheduleFilters();
  initPricingCardHighlight();
  initForms();
  initGalleryLightbox();
  initScrollTop();
  initDynamicYear();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Sticky Header & Scroll Effects
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Hamburger Menu
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (!toggleBtn || !mainNav) return;

  const toggleMenu = () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    toggleBtn.classList.toggle('open');
    mainNav.classList.toggle('active');
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking on a nav link
  const navLinks = mainNav.querySelectorAll('.nav-link, .nav-cta .btn');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      toggleMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Active Nav Link Detection
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const currentPath = window.location.pathname;
  let filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  if (!filename || filename === '') {
    filename = 'index.html';
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === filename || (filename === 'index.html' && href === './')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/* --------------------------------------------------------------------------
   4. FAQ Accordion Interaction
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs in the same container for cleaner view
      const parentContainer = item.closest('.faq-container');
      if (parentContainer) {
        parentContainer.querySelectorAll('.faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });
      }

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 32 + 'px';
      } else {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Schedule & Program Category Filters
   -------------------------------------------------------------------------- */
function initScheduleFilters() {
  const filterBtns = document.querySelectorAll('.schedule-filter-btn');
  const tableRows = document.querySelectorAll('.schedule-table tbody tr');

  if (!filterBtns.length || !tableRows.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      tableRows.forEach(row => {
        const rowCategory = row.getAttribute('data-category');
        if (filterCategory === 'all' || rowCategory === filterCategory) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Pricing Plan Interactive Selector
   -------------------------------------------------------------------------- */
function initPricingCardHighlight() {
  const cards = document.querySelectorAll('.pricing-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('active-hover'));
      card.classList.add('active-hover');
    });

    const selectBtn = card.querySelector('.pricing-select-btn');
    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const planName = card.querySelector('.pricing-title')?.textContent.trim() || 'Selected Plan';
        // Smoothly redirect or scroll to trial/contact form with preselected note
        window.location.href = `contact.html?plan=${encodeURIComponent(planName)}#trial-form`;
      });
    }
  });
}

/* --------------------------------------------------------------------------
   7. Demonstration Form Validation (Trial Class & Contact Forms)
   -------------------------------------------------------------------------- */
function initForms() {
  const trialForm = document.getElementById('trial-class-form');
  const contactForm = document.getElementById('general-contact-form');

  // Pre-fill plan from query parameter if present
  if (trialForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlan = urlParams.get('plan');
    if (selectedPlan) {
      const programSelect = trialForm.querySelector('#trial-program');
      if (programSelect) {
        for (let i = 0; i < programSelect.options.length; i++) {
          if (programSelect.options[i].text.toLowerCase().includes(selectedPlan.toLowerCase())) {
            programSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    setupFormValidation(trialForm, 'trial-success-msg');
  }

  if (contactForm) {
    setupFormValidation(contactForm, 'contact-success-msg');
  }
}

function setupFormValidation(formElement, successMsgId) {
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear existing feedback
    const inputs = formElement.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.classList.remove('is-invalid');
      const feedback = input.parentElement.querySelector('.form-feedback');
      if (feedback) feedback.textContent = '';
    });

    // Validate Full Name
    const nameInput = formElement.querySelector('input[name="fullname"]');
    if (nameInput) {
      if (nameInput.value.trim().length < 2) {
        setFieldError(nameInput, 'Please enter a valid full name.');
        isValid = false;
      }
    }

    // Validate Mobile Number (Sample Indian 10-digit check or general international)
    const phoneInput = formElement.querySelector('input[name="phone"]');
    if (phoneInput) {
      const phoneVal = phoneInput.value.replace(/[\s\-\(\)\+]/g, '');
      if (phoneVal.length < 8 || phoneVal.length > 15 || isNaN(phoneVal)) {
        setFieldError(phoneInput, 'Please enter a valid mobile number (e.g. 9000000000).');
        isValid = false;
      }
    }

    // Validate Email
    const emailInput = formElement.querySelector('input[name="email"]');
    if (emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }
    }

    // Validate Required Dropdowns (Selects)
    const requiredSelects = formElement.querySelectorAll('select[required]');
    requiredSelects.forEach(select => {
      if (!select.value || select.value === '') {
        setFieldError(select, 'Please select an option.');
        isValid = false;
      }
    });

    // Validate Age if present
    const ageInput = formElement.querySelector('input[name="age"]');
    if (ageInput && ageInput.hasAttribute('required')) {
      const ageVal = parseInt(ageInput.value, 10);
      if (isNaN(ageVal) || ageVal < 3 || ageVal > 99) {
        setFieldError(ageInput, 'Please enter a valid age (between 3 and 99).');
        isValid = false;
      }
    }

    // Validate Message / Textarea if required
    const msgTextarea = formElement.querySelector('textarea[required]');
    if (msgTextarea && msgTextarea.value.trim().length < 5) {
      setFieldError(msgTextarea, 'Please write a message with at least 5 characters.');
      isValid = false;
    }

    if (isValid) {
      // Demonstration submission behavior
      const successBox = document.getElementById(successMsgId);
      if (successBox) {
        // EXACT required wording from prompt:
        // "This is a demonstration form. Your enquiry has not been sent."
        successBox.innerHTML = '<strong>Demo Submission Received!</strong><br>This is a demonstration form. Your enquiry has not been sent.';
        successBox.classList.add('visible');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      formElement.reset();

      // Hide success message after 9 seconds if desired
      setTimeout(() => {
        if (successBox) successBox.classList.remove('visible');
      }, 9000);
    }
  });
}

function setFieldError(fieldElement, message) {
  fieldElement.classList.add('is-invalid');
  const parent = fieldElement.parentElement;
  let feedback = parent.querySelector('.form-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    parent.appendChild(feedback);
  }
  feedback.textContent = message;
}

/* --------------------------------------------------------------------------
   8. Gallery Lightbox Modal
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox markup dynamically if it doesn't exist
  let lightbox = document.querySelector('.lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close preview">&times;</button>
        <div class="lightbox-body"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const closeBtn = lightbox.querySelector('.lightbox-close');
  const lightboxBody = lightbox.querySelector('.lightbox-body');

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const placeholder = item.querySelector('.image-placeholder');
      if (placeholder) {
        // Clone placeholder inside lightbox
        lightboxBody.innerHTML = '';
        const clone = placeholder.cloneNode(true);
        clone.style.minHeight = '360px';
        lightboxBody.appendChild(clone);

        const caption = document.createElement('p');
        caption.style.marginTop = '1rem';
        caption.style.textAlign = 'center';
        caption.style.fontSize = '0.9rem';
        caption.style.color = '#567086';
        caption.textContent = 'Preview of Academy Session • High-Resolution Media Demonstration';
        lightboxBody.appendChild(caption);

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Scroll to Top Behavior
   -------------------------------------------------------------------------- */
function initScrollTop() {
  let scrollBtn = document.querySelector('.scroll-top-btn');
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    document.body.appendChild(scrollBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   10. Dynamic Copyright Year
   -------------------------------------------------------------------------- */
function initDynamicYear() {
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
}

/* --------------------------------------------------------------------------
   11. Scroll Reveal Animations (Vanilla Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const revealElements = document.querySelectorAll('.card, .program-card, .pricing-card, .coach-card, .section-header, .image-placeholder');
  revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}
