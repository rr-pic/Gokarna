// Mobile nav toggle (class-based)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const willOpen = !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', willOpen);
    document.body.classList.toggle('no-scroll', willOpen);
  });

  // Close menu when clicking a link (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
    });
  });
}

// Active link highlighting
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if ((path === '' && href === 'index.html') || href === path) {
    a.classList.add('active');
  }
});

// Smooth scroll for on-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id && id !== '#') {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Booking form validation and thank-you modal
const form = document.querySelector('#booking-form');
if (form) {
  const modal = document.querySelector('#thankyou-modal');
  const closeBtn = document.querySelector('#close-modal');

  const setError = (id, message) => {
    const el = document.getElementById(id + '-error');
    if (el) el.textContent = message || '';
  };

  const isFutureDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      const today = new Date();
      d.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      return d >= today;
    } catch (_) { return false; }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const activity = form.activity.value;
    const date = form.date.value;

    setError('name', ''); setError('email', ''); setError('phone', ''); setError('activity', ''); setError('date', '');

    if (name.length < 2) { setError('name', 'Please enter your full name'); ok = false; }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) { setError('email', 'Enter a valid email'); ok = false; }
    const phoneOk = /^[0-9]{10,}$/.test(phone.replace(/\D/g, ''));
    if (!phoneOk) { setError('phone', 'Enter a valid phone number'); ok = false; }
    if (!activity) { setError('activity', 'Select an activity'); ok = false; }
    if (!isFutureDate(date)) { setError('date', 'Choose today or a future date'); ok = false; }

    if (!ok) return;

    // Build WhatsApp message
    const encoded = encodeURIComponent(
      `New Booking Request

Name: ${name}
Email: ${email}
Phone: ${phone}
Activity: ${activity}
Date: ${date}
Message: ${form.message.value.trim() || '-'}

From Monster Water Sports website`
    );
    const phoneE164 = '917483300575';
    const waUrl = `https://wa.me/${phoneE164}?text=${encoded}`;

    window.open(waUrl, '_blank');

    if (modal) {
      modal.classList.remove('hidden');
      modal.querySelector('.modal-body').textContent = `Thanks ${name}! Your details are prefilled in WhatsApp.`;
    }
    form.reset();
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
  }
}

// Add smooth scroll effect for buttons or future animations
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
// Future animations or smooth scroll can go here

// Counter animation for statistics
const animateCounter = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16); // 60 FPS
  let current = start;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current) + (target >= 100 ? '+' : '');
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + (target >= 100 ? '+' : '');
    }
  };

  updateCounter();
};

// Intersection Observer for counter animation on scroll
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px'
};

const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      const target = parseInt(entry.target.getAttribute('data-target'));
      animateCounter(entry.target, target);
      entry.target.classList.add('counted');
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe all counter elements
document.querySelectorAll('.counter').forEach(counter => {
  observer.observe(counter);
});

console.log("Monster Water Sports Home Page Loaded 🌊");
