/* ============================================================
   OMOT — Main JavaScript
   Safety exit, mobile nav, utility functions
   ============================================================ */

// ── Safety Exit ──
function safetyExit() {
  // Replace current page in history so back button doesn't return
  window.location.replace('https://www.google.com');
}

// Keyboard shortcut: press Escape twice quickly to exit
let escCount = 0;
let escTimer = null;
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    escCount++;
    if (escCount === 2) {
      safetyExit();
    }
    clearTimeout(escTimer);
    escTimer = setTimeout(() => { escCount = 0; }, 1000);
  }
});

// ── Mobile Nav ──
function openMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) {
    nav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) {
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close mobile nav on outside click
document.addEventListener('click', (e) => {
  const nav = document.getElementById('mobileNav');
  if (nav && nav.classList.contains('open')) {
    if (e.target === nav) closeMobileNav();
  }
});

// ── Email Signup ──
function handleSignup(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[type="email"]');
  const email = input ? input.value.trim() : '';

  if (!email) return;

  // TODO: Wire to HubSpot form submission endpoint
  // Replace [HUBSPOT_PORTAL_ID] and [HUBSPOT_FORM_ID] with actual values
  const portalId = '[HUBSPOT_PORTAL_ID]';
  const formId = '[HUBSPOT_FORM_ID]';

  fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: [{ name: 'email', value: email }],
      context: { pageUri: window.location.href, pageName: document.title }
    })
  })
  .then(() => {
    input.value = '';
    showToast('Thank you! You\'re subscribed.');
  })
  .catch(() => {
    showToast('Something went wrong. Please try again.');
  });
}

// ── Toast Notification ──
function showToast(message) {
  const existing = document.getElementById('omot-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'omot-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #4A1A8C;
    color: #fff;
    padding: 12px 24px;
    border-radius: 9999px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(74,26,140,0.25);
    z-index: 9999;
    animation: toastIn 0.25s ease;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Scroll: add nav shadow on scroll ──
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (nav) {
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 4px 16px rgba(74,26,140,0.12)';
    } else {
      nav.style.boxShadow = '0 1px 3px rgba(74,26,140,0.08)';
    }
  }
}, { passive: true });

// ── Scroll reveal for sections ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .impact-stat, .who-grid, .founder-grid').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card, .impact-stat, .who-grid, .founder-grid').forEach(el => {
    el.addEventListener('transitionend', () => {}, { once: true });
  });
});

// Add revealed class CSS
const revealStyle = document.createElement('style');
revealStyle.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(revealStyle);
