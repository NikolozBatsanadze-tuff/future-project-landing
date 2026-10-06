/* ==========================================================================
   AETHEREA — VANILLA JS INTERACTION & VALIDATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCursorLight();
  initMobileNavigation();
  init3DHeroTilt();
  initStatCounters();
  initContactFormValidation();
});

/* --------------------------------------------------------------------------
   1. Ambient Cursor Follower Light
   -------------------------------------------------------------------------- */
function initAmbientCursorLight() {
  const cursorLight = document.getElementById('cursorLight');
  if (!cursorLight) return;

  window.addEventListener('mousemove', (e) => {
    cursorLight.style.left = `${e.clientX}px`;
    cursorLight.style.top = `${e.clientY}px`;
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Responsive Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking outside or on a link
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   3. Interactive 3D Perspective Tilt on Hero Card & Features
   -------------------------------------------------------------------------- */
function init3DHeroTilt() {
  const heroCard = document.getElementById('heroCard');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = (-y / (rect.height / 2)) * 10;
      const rotY = (x / (rect.width / 2)) * 10;

      heroCard.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // Tilt on Feature Boxes
  const featureBoxes = document.querySelectorAll('[data-tilt]');
  featureBoxes.forEach((box) => {
    box.addEventListener('mousemove', (e) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = (-y / (rect.height / 2)) * 6;
      const rotY = (x / (rect.width / 2)) * 6;

      box.style.transform = `perspective(600px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    box.addEventListener('mouseleave', () => {
      box.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

/* --------------------------------------------------------------------------
   4. Animated Numeric Counters (Triggered on Scroll)
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const counters = document.querySelectorAll('.counter-number');
  const statsStrip = document.getElementById('statsStrip');
  let hasAnimated = false;

  if (statsStrip && counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting && !hasAnimated) {
        hasAnimated = true;

        counters.forEach((counter) => {
          const rawTarget = counter.getAttribute('data-target');
          const target = rawTarget ? parseFloat(rawTarget) : 0;
          const isDecimal = target % 1 !== 0;

          let current = 0;
          const steps = 40;
          const increment = target / steps;
          const stepInterval = 25;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = isDecimal ? target.toFixed(2) : target.toString();
              clearInterval(timer);
            } else {
              counter.textContent = isDecimal ? current.toFixed(2) : Math.floor(current).toString();
            }
          }, stepInterval);
        });
      }
    }, { threshold: 0.3 });

    observer.observe(statsStrip);
  }
}

/* --------------------------------------------------------------------------
   5. Interactive Contact Form with Real-Time Validation & Toast Modal
   -------------------------------------------------------------------------- */
function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const messageInput = document.getElementById('messageInput');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const submitBtn = document.getElementById('submitBtn');

  // Email regex verification
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateField(input, errorElement, validator, message) {
    const val = input.value.trim();
    if (!validator(val)) {
      errorElement.textContent = message;
      input.closest('.form-group').classList.add('has-error');
      return false;
    } else {
      errorElement.textContent = '';
      input.closest('.form-group').classList.remove('has-error');
      return true;
    }
  }

  // Clear errors on input
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      group.classList.remove('has-error');
      const err = group.querySelector('.field-error');
      if (err) err.textContent = '';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(
      nameInput,
      nameError,
      (val) => val.length >= 2,
      'Please enter your full name (at least 2 characters).'
    );

    const isEmailValid = validateField(
      emailInput,
      emailError,
      (val) => isValidEmail(val),
      'Please provide a valid corporate email address.'
    );

    const isMessageValid = validateField(
      messageInput,
      messageError,
      (val) => val.length >= 10,
      'Message brief must be at least 10 characters long.'
    );

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      return;
    }

    // Simulate async dispatch with button loading spinner
    submitBtn.classList.add('is-loading');
    submitBtn.setAttribute('disabled', 'true');

    setTimeout(() => {
      // Success state
      form.reset();
      submitBtn.classList.remove('is-loading');
      submitBtn.removeAttribute('disabled');

      showToastNotification(
        'Transmission Successful',
        'Your workload brief has been routed to our enterprise neural team.'
      );
    }, 900);
  });
}

function showToastNotification(title, message) {
  const toastCard = document.getElementById('toastCard');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');

  if (toastCard && toastTitle && toastMessage) {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastCard.classList.add('show');

    setTimeout(() => {
      toastCard.classList.remove('show');
    }, 4000);
  }
}