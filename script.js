/* ── Scroll Reveal ── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach(el => observer.observe(el));

/* ── Mobile Menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mmLinks = document.querySelectorAll('.mm-link');

function openMenu() { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMenu() { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; }

hamburger.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mmLinks.forEach(l => l.addEventListener('click', closeMenu));

/* ── Active Nav Link on Scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.45 }
);
sections.forEach(s => navObserver.observe(s));

/* ── Contact Form ── */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fname = document.getElementById('fname').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!fname || !email || !message) {
    submitBtn.textContent = 'Fill required fields!';
    submitBtn.style.background = '#f87171';
    setTimeout(() => {
      submitBtn.textContent = 'Send Message ✉';
      submitBtn.style.background = '';
    }, 2000);
    return;
  }

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.textContent = 'Message Sent ✓';
    formMsg.style.display = 'block';
    form.reset();
    setTimeout(() => {
      submitBtn.textContent = 'Send Message ✉';
      submitBtn.disabled = false;
      formMsg.style.display = 'none';
    }, 4000);
  }, 1200);
});

/* ── Smooth Scroll for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Highlight active nav styles ── */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: #F1F5F9 !important; } .nav-links a.active::after { transform: scaleX(1) !important; }`;
document.head.appendChild(style);

/* ── Certificate Lightbox Modal (Image + PDF) ── */
const certModal = document.getElementById('certModal');
const certModalImg = document.getElementById('certModalImg');
const certModalPdf = document.getElementById('certModalPdf');
const certModalDownload = document.getElementById('certModalDownload');

function openCertModal(src, type) {
  // Reset visibility
  certModalImg.style.display = 'none';
  certModalPdf.style.display = 'none';
  certModalDownload.style.display = 'none';

  if (type === 'pdf') {
    certModalPdf.src = src;
    certModalPdf.style.display = 'block';
    certModalDownload.href = src;
    certModalDownload.style.display = 'inline-flex';
  } else {
    certModalImg.src = src;
    certModalImg.style.display = 'block';
  }

  certModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  certModal.classList.remove('open');
  document.body.style.overflow = '';
  // Clear PDF src to stop loading
  setTimeout(() => {
    certModalPdf.src = '';
  }, 300);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certModal.classList.contains('open')) {
    closeCertModal();
  }
});

/* ── Certificate Filter Tabs ── */
const filterBtns = document.querySelectorAll('.cert-filter-btn');
const certCards = document.querySelectorAll('.cert-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    certCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── Interactive 3D Particle Constellation (Hero) ── */
(function() {
  const canvas = document.getElementById('canvas3d');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // Particle configuration
  const particleCount = Math.min(100, Math.floor((width * height) / 15000));
  const particles = [];
  const maxDistance = 140; // Max connection distance
  const focalLength = 350; // 3D Camera depth projection factor

  // 3D rotation tracking
  let angleX = 0.001; // Auto rotation speeds
  let angleY = 0.0015;
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  // Particle class definition
  class Particle3D {
    constructor() {
      this.reset();
      // Distribute z evenly initially
      this.z = (Math.random() - 0.5) * 500;
    }

    reset() {
      this.x = (Math.random() - 0.5) * width * 1.2;
      this.y = (Math.random() - 0.5) * height * 1.2;
      this.z = 250; // Start at the back
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.vz = -(Math.random() * 0.3 + 0.1); // Slow drift forward
      this.radius = Math.random() * 1.5 + 1;
      this.color = `rgba(56, 189, 248, ${Math.random() * 0.4 + 0.3})`; // Glow accent
    }

    update() {
      // Apply movement vectors
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;

      // Reset when particle drifts too close (passes camera)
      if (this.z < -focalLength) {
        this.reset();
      }
    }

    // 3D Rotation helper
    rotate(pitch, yaw) {
      // Rotation around X axis (pitch)
      let cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      let y1 = this.y * cosP - this.z * sinP;
      let z1 = this.z * cosP + this.y * sinP;

      // Rotation around Y axis (yaw)
      let cosY = Math.cos(yaw), sinY = Math.sin(yaw);
      let x2 = this.x * cosY - z1 * sinY;
      let z2 = z1 * cosY + this.x * sinY;

      return { x: x2, y: y1, z: z2 };
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle3D());
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track Mouse movement relative to Hero center
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      // Coordinates normalized around center (-0.5 to 0.5)
      targetMouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      targetMouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    });

    heroSection.addEventListener('mouseleave', () => {
      targetMouseX = 0;
      targetMouseY = 0;
    });
  }

  // Main Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Smooth camera tilt towards mouse target position (damping)
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Base continuous rotation combined with mouse tilt angle offsets
    const rx = angleX + mouseY * 0.005;
    const ry = angleY + mouseX * 0.005;

    const projectedPoints = [];

    // Project and draw nodes
    particles.forEach(p => {
      p.update();
      const rotated = p.rotate(rx, ry);

      // Perspective Projection
      const scale = focalLength / (focalLength + rotated.z);
      const projX = rotated.x * scale + centerX;
      const projY = rotated.y * scale + centerY;

      projectedPoints.push({
        x: projX,
        y: projY,
        z: rotated.z,
        color: p.color,
        radius: p.radius * scale,
        original: p
      });
    });

    // Draw connection lines in 3D-space
    for (let i = 0; i < projectedPoints.length; i++) {
      const p1 = projectedPoints[i];
      // Skip offscreen points
      if (p1.x < 0 || p1.x > width || p1.y < 0 || p1.y > height) continue;

      for (let j = i + 1; j < projectedPoints.length; j++) {
        const p2 = projectedPoints[j];

        // Draw connections only if points are close in 3D coordinates
        const dx = p1.original.x - p2.original.x;
        const dy = p1.original.y - p2.original.y;
        const dz = p1.original.z - p2.original.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          // Opacity fades out based on distance
          const alpha = (1 - dist / maxDistance) * 0.15;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.55 * (focalLength / (focalLength + (p1.z + p2.z) / 2)); // perspective line thickness
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw particle circles
    projectedPoints.forEach(p => {
      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10 * (p.radius / 3);
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for lines
    });

    requestAnimationFrame(animate);
  }

  animate();
})();

/* ── 3D Card Hover Tilt Effect ── */
(function() {
  const elementsToTilt = document.querySelectorAll(
    '.project-card, .skill-card, .cert-card, .glass-card, .edu-card'
  );

  elementsToTilt.forEach(el => {
    // Add setup styles programmatically to preserve CSS separation
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';
    el.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Mouse position coordinates normalized relative to card center (-0.5 to 0.5)
      const mouseX = (e.clientX - rect.left - width / 2) / width;
      const mouseY = (e.clientY - rect.top - height / 2) / height;

      // Rotate values (max 10 degrees tilt)
      const tiltX = mouseY * -12; // tilt around X axis based on Y movement
      const tiltY = mouseX * 12;  // tilt around Y axis based on X movement

      // Apply transform matrix with perspective
      el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      // Reset card smoothly back to rest state
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
})();

