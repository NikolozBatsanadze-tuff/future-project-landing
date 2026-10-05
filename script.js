document.addEventListener('DOMContentLoaded', () => {
  // 1. Mouse Ambient Glow Follower
  const ambientCursor = document.getElementById('ambientCursor');
  if (ambientCursor) {
    window.addEventListener('mousemove', (e) => {
      ambientCursor.style.left = `${e.clientX}px`;
      ambientCursor.style.top = `${e.clientY}px`;
    });
  }

  // 2. 3D Tilt Effect on Hero Card
  const heroCard = document.getElementById('heroCard');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      heroCard.style.transform = `perspective(700px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // 3. Stats Number Counter Animation
  const counters = document.querySelectorAll('.counter-value');
  let animated = false;

  const countersBar = document.querySelector('.counters-bar');
  if (countersBar && counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting && !animated) {
        animated = true;
        counters.forEach((el) => {
          const valAttr = el.getAttribute('data-val');
          const target = valAttr ? parseFloat(valAttr) : 0;
          let current = 0;
          const step = target / 40;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              el.textContent = target.toString();
              clearInterval(timer);
            } else {
              el.textContent = current.toFixed(target % 1 !== 0 ? 1 : 0);
            }
          }, 25);
        });
      }
    }, { threshold: 0.4 });

    observer.observe(countersBar);
  }

  // 4. Contact Form Handler (Smooth Toast)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'იგზავნება...';
      submitBtn.setAttribute('disabled', 'true');

      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.removeAttribute('disabled');

        const toast = document.getElementById('toastMsg');
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 3000);
        }
      }, 600);
    });
  }
});