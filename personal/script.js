/* ============================================================
   ROMANTIC PROPOSAL WEBSITE — script.js
   All interactive behaviour, animations, and effects.
   ============================================================ */

'use strict';

/* ============================================================
   1. LOADING SCREEN
   Hides after 2.4 s (matches the CSS loader-fill animation).
============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const screen = document.getElementById('loading-screen');
    screen.classList.add('hidden');
    // Start particle system after loading
    initParticles();
    initProposalCanvas();
  }, 2400);
});

/* ============================================================
   2. CUSTOM CURSOR (romantic heart cursor)
============================================================ */
const cursorHeart = document.getElementById('cursor-heart');

document.addEventListener('mousemove', (e) => {
  cursorHeart.style.left = e.clientX + 'px';
  cursorHeart.style.top  = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
  cursorHeart.style.transform = 'translate(-50%, -50%) scale(1.5)';
});
document.addEventListener('mouseup', () => {
  cursorHeart.style.transform = 'translate(-50%, -50%) scale(1)';
});

/* ============================================================
   3. NAVIGATION — scroll effect + mobile hamburger
============================================================ */
const nav       = document.getElementById('main-nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu= document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ============================================================
   4. BACKGROUND MUSIC TOGGLE
   Place music file at: assets/music/love.mp3
============================================================ */
const bgMusic     = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let musicPlaying  = false;

bgMusic.volume = 0.35; // Soft background volume — file: assets/music/Bairiyaa...mp3

musicToggle.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicToggle.classList.remove('playing');
    musicToggle.textContent = '♪';
  } else {
    bgMusic.play().catch(() => {
      // Autoplay blocked — user must interact first (already done by clicking)
    });
    musicToggle.classList.add('playing');
    musicToggle.textContent = '♫';
  }
  musicPlaying = !musicPlaying;
});

/* ============================================================
   5. FLOATING HEARTS PARTICLE SYSTEM (background canvas)
============================================================ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // Particle pool
  const SYMBOLS = ['♥', '✦', '·', '✿', '❀'];
  const COLORS  = [
    'rgba(244,167,185,',   // pink
    'rgba(201,184,232,',   // lavender
    'rgba(255,240,248,',   // soft white
    'rgba(233,30,140,',    // deep pink
  ];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x      = Math.random() * W;
      this.y      = initial ? Math.random() * H : H + 20;
      this.size   = Math.random() * 14 + 6;
      this.speed  = Math.random() * 0.6 + 0.2;
      this.drift  = (Math.random() - 0.5) * 0.4;
      this.opacity= Math.random() * 0.4 + 0.1;
      this.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y        -= this.speed;
      this.x        += this.drift;
      this.rotation += this.rotSpeed;
      if (this.y < -30) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font      = `${this.size}px serif`;
      ctx.fillStyle = `${this.color}${this.opacity})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  // Create 60 particles
  const particles = Array.from({ length: 60 }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   6. SCROLL REVEAL ANIMATION
   Elements with class "reveal" animate in when scrolled into view.
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children slightly
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-fade').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   7. GALLERY LIGHTBOX
============================================================ */
const galleryItems  = document.querySelectorAll('.gallery-item');
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxCap   = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev  = document.getElementById('lightbox-prev');
const lightboxNext  = document.getElementById('lightbox-next');

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const item = galleryItems[index];
  lightboxImg.src = item.querySelector('img').src;
  lightboxCap.textContent = item.dataset.caption || '';
  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'Escape')     closeLightbox();
});

/* ============================================================
   8. VIDEO HOVER AUTOPLAY (cinematic preview)
============================================================ */
document.querySelectorAll('.video-card').forEach(card => {
  const video = card.querySelector('.video-preview');
  if (!video) return;

  card.addEventListener('mouseenter', () => {
    video.play().catch(() => {});
  });
  card.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });
});

/* ============================================================
   9. VIDEO MODAL — with prev/next navigation
============================================================ */
const videoModal      = document.getElementById('video-modal');
const modalVideo      = document.getElementById('modal-video');
const videoModalPrev  = document.getElementById('video-modal-prev');
const videoModalNext  = document.getElementById('video-modal-next');
const videoModalCap   = document.getElementById('video-modal-caption');

// Master list of all videos — order matches the cards in HTML
const videoList = [
  { src: 'assets/videos/WhatsApp Video 2026-05-27 at 3.00.38 PM.mp4', title: 'A Day I\'ll Never Forget' },
  { src: 'assets/videos/WhatsApp Video 2026-05-27 at 3.00.40 PM.mp4', title: 'Just Us' },
  { src: 'assets/videos/WhatsApp Video 2026-05-27 at 3.00.42 PM.mp4', title: 'Our Little World' },
  { src: 'assets/videos/WhatsApp Video 2026-05-27 at 3.00.45 PM.mp4', title: 'Moments Like These' },
  { src: 'assets/videos/WhatsApp Video 2026-05-27 at 3.00.47 PM.mp4', title: 'Soft & Golden' },
  { src: 'assets/videos/WhatsApp Video 2026-05-27 at 3.00.48 PM.mp4', title: 'My Favourite Laugh' },
  { src: 'assets/videos/WhatsApp Video 2026-05-27 at 3.00.49 PM.mp4', title: 'Unscripted' },
  { src: 'assets/videos/WhatsApp Video 2026-05-27 at 3.00.52 PM.mp4', title: 'Always & Forever' },
];

let currentVideoIndex = 0;

function openVideoModal(index) {
  currentVideoIndex = index;
  loadVideoAtIndex(currentVideoIndex);
  videoModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function loadVideoAtIndex(index) {
  const v = videoList[index];
  modalVideo.src = v.src;
  modalVideo.load();
  modalVideo.play().catch(() => {});
  videoModalCap.textContent = `${index + 1} / ${videoList.length}  —  ${v.title}`;
  // Hide prev on first, next on last
  videoModalPrev.style.opacity = index === 0 ? '0.3' : '1';
  videoModalNext.style.opacity = index === videoList.length - 1 ? '0.3' : '1';
}

function closeVideoModal() {
  modalVideo.pause();
  modalVideo.src = '';
  videoModal.classList.add('hidden');
  document.body.style.overflow = '';
}

videoModalPrev.addEventListener('click', () => {
  if (currentVideoIndex > 0) {
    currentVideoIndex--;
    loadVideoAtIndex(currentVideoIndex);
  }
});

videoModalNext.addEventListener('click', () => {
  if (currentVideoIndex < videoList.length - 1) {
    currentVideoIndex++;
    loadVideoAtIndex(currentVideoIndex);
  }
});

document.addEventListener('keydown', (e) => {
  if (videoModal.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft')  videoModalPrev.click();
  if (e.key === 'ArrowRight') videoModalNext.click();
  if (e.key === 'Escape')     closeVideoModal();
});

/* ============================================================
   10. PROPOSAL SECTION — animated stars canvas
============================================================ */
function initProposalCanvas() {
  const canvas = document.getElementById('proposal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    a: Math.random(),
    speed: Math.random() * 0.008 + 0.003,
    dir: Math.random() > 0.5 ? 1 : -1,
  }));

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.speed * s.dir;
      if (s.a > 1 || s.a < 0.1) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244,167,185,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
}

/* ============================================================
   11. PROPOSAL BUTTONS — trigger ending animation
============================================================ */
function handleProposal(type) {
  const overlay = document.getElementById('ending-overlay');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  initEndingCanvas();

  // Burst of hearts from center on click
  spawnHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 30);
}

function closeEnding() {
  document.getElementById('ending-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

/* ============================================================
   12. ENDING CANVAS — massive floating hearts + stars
============================================================ */
function initEndingCanvas() {
  const canvas = document.getElementById('ending-canvas');
  const ctx    = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const items = [];
  const SYMBOLS = ['♥', '✦', '✿', '❀', '·', '★'];
  const COLORS  = ['rgba(244,167,185,', 'rgba(201,184,232,', 'rgba(255,240,248,', 'rgba(233,30,140,'];

  for (let i = 0; i < 100; i++) {
    items.push({
      x:      Math.random() * canvas.width,
      y:      canvas.height + Math.random() * 200,
      size:   Math.random() * 22 + 8,
      speed:  Math.random() * 2 + 0.8,
      drift:  (Math.random() - 0.5) * 1.2,
      opacity:Math.random() * 0.7 + 0.3,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
    });
  }

  let frame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    items.forEach(p => {
      p.y        -= p.speed;
      p.x        += p.drift;
      p.rotation += p.rotSpeed;
      if (p.y < -40) {
        p.y = canvas.height + 20;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font      = `${p.size}px serif`;
      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.symbol, 0, 0);
      ctx.restore();
    });
    frame = requestAnimationFrame(animate);
  }
  animate();

  // Stop animation when overlay is closed
  const observer = new MutationObserver(() => {
    if (document.getElementById('ending-overlay').classList.contains('hidden')) {
      cancelAnimationFrame(frame);
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById('ending-overlay'), { attributes: true });
}

/* ============================================================
   13. HEART BURST — spawns hearts at a given position
   Used on proposal button click.
============================================================ */
function spawnHeartBurst(cx, cy, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.textContent = '♥';
    el.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      font-size: ${Math.random() * 20 + 10}px;
      color: hsl(${Math.random() * 40 + 330}, 80%, 70%);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      animation: burstHeart 1.2s ease forwards;
      --dx: ${(Math.random() - 0.5) * 300}px;
      --dy: ${-(Math.random() * 200 + 50)}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
}

// Inject burst keyframe dynamically
const burstStyle = document.createElement('style');
burstStyle.textContent = `
  @keyframes burstHeart {
    0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
    60%  { opacity: 0.8; transform: translate(calc(-50% + var(--dx) * 0.6), calc(-50% + var(--dy) * 0.6)) scale(1.2); }
    100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.8); }
  }
`;
document.head.appendChild(burstStyle);

/* ============================================================
   14. EASTER EGGS — clicking ♥ on promise cards
   Each card has a data-easter attribute with a hidden message.
============================================================ */
const easterToast = document.createElement('div');
easterToast.className = 'easter-toast';
document.body.appendChild(easterToast);

let toastTimer;

document.querySelectorAll('.promise-heart').forEach(heart => {
  heart.addEventListener('click', (e) => {
    e.stopPropagation();
    const msg = heart.closest('.promise-card').dataset.easter;
    if (!msg) return;

    // Spawn mini hearts at click position
    spawnHeartBurst(e.clientX, e.clientY, 8);

    // Show toast
    clearTimeout(toastTimer);
    easterToast.textContent = msg;
    easterToast.classList.add('show');
    toastTimer = setTimeout(() => easterToast.classList.remove('show'), 2800);
  });
});

/* ============================================================
   15. REASONS I LOVE YOU POPUP
   Edit the reasons array below to personalise the list.
============================================================ */

// ===== EDIT YOUR REASONS HERE =====
const reasonsList = [
  "The way you laugh — it's the best sound in the world.",
  "How you make me feel safe just by being near.",
  "Your kindness, even when you don't have to be kind.",
  "The way you look at me like I'm something worth keeping.",
  "How you remember the little things I say.",
  "Your strength — even when you think you're falling apart.",
  "The way you love — deeply, quietly, completely.",
  "How you make ordinary days feel like something special.",
  "Your honesty, even when it's hard to hear.",
  "The fact that you stayed. That you chose us.",
  "The way you exist — effortlessly, beautifully, you.",
  "Every single version of you — past, present, and future.",
];

function openReasons() {
  const popup = document.getElementById('reasons-popup');
  const list  = document.getElementById('reasons-list');

  // Build list items with staggered animation
  list.innerHTML = reasonsList.map((r, i) =>
    `<li style="animation-delay:${i * 0.06}s">${r}</li>`
  ).join('');

  popup.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeReasons() {
  document.getElementById('reasons-popup').classList.add('hidden');
  document.body.style.overflow = '';
}

// Close popup on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeReasons();
    closeLightbox();
    closeVideoModal();
  }
});

/* ============================================================
   16. CLICK-TO-SPAWN HEARTS anywhere on the page
   A subtle romantic touch — clicking anywhere spawns a tiny heart.
============================================================ */
document.addEventListener('click', (e) => {
  // Don't spawn on buttons/links to avoid visual clutter
  if (e.target.closest('button, a, .promise-heart')) return;

  const el = document.createElement('div');
  el.textContent = '♥';
  el.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    font-size: 16px;
    color: rgba(244,167,185,0.8);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    animation: floatUp 1s ease forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
});

// Float-up keyframe for click hearts
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes floatUp {
    0%   { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0;   transform: translate(-50%, calc(-50% - 60px)) scale(0.6); }
  }
`;
document.head.appendChild(floatStyle);

/* ============================================================
   17. SMOOTH ACTIVE NAV LINK HIGHLIGHT on scroll
============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--pink)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   18. GALLERY PLACEHOLDER — show gradient when image fails to load
   (Useful before you add your own photos)
============================================================ */
document.querySelectorAll('.gallery-item img').forEach((img, i) => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    const gradients = [
      'linear-gradient(135deg, #2d0a1a, #1a0a2e)',
      'linear-gradient(135deg, #1a0a2e, #2d0a1a)',
      'linear-gradient(135deg, #2d1a0a, #1a2d0a)',
      'linear-gradient(135deg, #0a1a2d, #2d0a1a)',
      'linear-gradient(135deg, #1a2d0a, #0a1a2d)',
      'linear-gradient(135deg, #2d0a2d, #0a2d0a)',
    ];
    placeholder.style.cssText = `
      width: 100%; height: 100%;
      background: ${gradients[i % gradients.length]};
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem; color: rgba(244,167,185,0.3);
    `;
    placeholder.textContent = '♥';
    img.parentElement.insertBefore(placeholder, img);
  });
});

/* ============================================================
   19. VIDEO PLACEHOLDER — show message when video fails to load
============================================================ */
document.querySelectorAll('.video-preview').forEach(video => {
  video.addEventListener('error', () => {
    const wrapper = video.closest('.video-wrapper');
    if (!wrapper) return;
    wrapper.style.background = 'linear-gradient(135deg, #2d0a1a, #1a0a2e)';
    const msg = document.createElement('div');
    msg.style.cssText = `
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      color: rgba(244,167,185,0.5); font-size: 0.8rem;
      letter-spacing: 0.1em; text-align: center; padding: 1rem;
    `;
    msg.innerHTML = '<span style="font-size:2rem;margin-bottom:0.5rem">♥</span>Place video in assets/videos/';
    wrapper.appendChild(msg);
  });
});

console.log('%c♥ Made with love — just for you ♥', 'color: #f4a7b9; font-size: 16px; font-family: serif;');
