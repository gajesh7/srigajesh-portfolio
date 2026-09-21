/**
 * GAJESH — UI/UX DESIGNER PORTFOLIO
 * Motion Design & Parallax Engine:
 * - Smooth Lerped Scroll Render Loop (rAF)
 * - Headline Line Tracking & Parallax
 * - Project Visual Parallax & Dynamic Mockup Rotations
 * - Floating UI Cards Drift + Mouse Target Parallax
 * - Magnetic CTA Buttons
 * - Rotating Text Badge & Rail Active Tracking
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Live Bengaluru Local Time Update
  // --------------------------------------------------------------------------
  const liveTimeEl = document.getElementById('live-time');
  
  function updateBengaluruTime() {
    if (!liveTimeEl) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    liveTimeEl.textContent = `${timeString} IST`;
  }
  
  updateBengaluruTime();
  setInterval(updateBengaluruTime, 30000);

  // --------------------------------------------------------------------------
  // 2. Motion Engine State (Lerped Scroll & Mouse Tracking)
  // --------------------------------------------------------------------------
  let currentScrollY = window.scrollY;
  let targetScrollY = window.scrollY;
  const ease = 0.1; // Lerp coefficient

  let mouseX = 0, mouseY = 0;
  let currentMouseX = 0, currentMouseY = 0;

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // DOM Elements for Motion Loop
  const header = document.getElementById('site-header');
  const progressDot = document.getElementById('scroll-progress-dot');
  const headlineLines = document.querySelectorAll('.hero-headline .headline-line');
  const orangeBadge = document.querySelector('.orange-accent-badge');
  const projectArticles = document.querySelectorAll('.project-article');
  const seeMoreSection = document.getElementById('see-more-work');
  const seeMoreTitle = document.querySelector('.see-more-title');
  const floatingCards = document.querySelectorAll('.floating-card');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  // --------------------------------------------------------------------------
  // 3. Continuous Motion Design Loop (requestAnimationFrame)
  // --------------------------------------------------------------------------
  function motionLoop() {
    // Lerp Scroll Position
    currentScrollY += (targetScrollY - currentScrollY) * ease;
    currentMouseX += (mouseX - currentMouseX) * 0.15;
    currentMouseY += (mouseY - currentMouseY) * 0.15;

    // Header State
    if (header) {
      if (currentScrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }

    // Scroll Progress Rail Dot
    if (progressDot) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrollPercent = (currentScrollY / docHeight) * 94;
        progressDot.style.top = `${Math.min(94, Math.max(0, scrollPercent))}%`;
      }
    }

    // A. Hero Headline Lines Scroll Parallax
    if (headlineLines.length >= 4 && currentScrollY < window.innerHeight * 1.2) {
      const scrollFactor = currentScrollY * 0.08;
      headlineLines[0].style.transform = `translate3d(${-scrollFactor * 0.8}px, ${scrollFactor * 0.2}px, 0)`;
      headlineLines[1].style.transform = `translate3d(${scrollFactor * 0.6}px, ${scrollFactor * 0.15}px, 0)`;
      headlineLines[2].style.transform = `translate3d(${-scrollFactor * 0.5}px, ${scrollFactor * 0.1}px, 0)`;
      headlineLines[3].style.transform = `translate3d(${scrollFactor * 0.7}px, ${scrollFactor * 0.05}px, 0)`;

      if (orangeBadge) {
        orangeBadge.style.transform = `translateY(-0.06em) rotate(${scrollFactor * 1.5}deg) scale(${1 + Math.min(scrollFactor * 0.003, 0.2)})`;
      }
    }

    // B. Project Visual Composition Scroll Parallax & Mockup Rotations
    const viewportHeight = window.innerHeight;
    projectArticles.forEach(article => {
      const rect = article.getBoundingClientRect();
      const visualWrapper = article.querySelector('.project-visual-wrapper');
      
      // Calculate normalized viewport offset (-1 to 1)
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const normalizedOffset = (elementCenter - viewportCenter) / (viewportHeight / 2);

      if (visualWrapper && rect.top < viewportHeight && rect.bottom > 0) {
        // Parallax translation and subtle scaling
        const translateY = normalizedOffset * -25;
        const scale = 1 + (1 - Math.abs(normalizedOffset)) * 0.025;
        visualWrapper.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;

        // Dynamic Phone Mockup Rotations (Cortado)
        const leftPhone = article.querySelector('.screen-left');
        const rightPhone = article.querySelector('.screen-right');
        if (leftPhone && rightPhone) {
          const rotLeft = -2 - normalizedOffset * 4;
          const rotRight = 2 + normalizedOffset * 4;
          leftPhone.style.transform = `translateY(${-normalizedOffset * 15}px) rotate(${rotLeft}deg)`;
          rightPhone.style.transform = `translateY(${normalizedOffset * 15}px) rotate(${rotRight}deg)`;
        }

        // Desktop Mac Frame Tilt (ePRISE)
        const macFrame = article.querySelector('.desktop-mac-frame');
        if (macFrame) {
          macFrame.style.transform = `translate3d(0, ${normalizedOffset * -15}px, 0) rotateX(${normalizedOffset * 2}deg)`;
        }

        // Kanban Board Float (Tribal)
        const kanbanBoard = article.querySelector('.workflow-board-frame');
        if (kanbanBoard) {
          kanbanBoard.style.transform = `translate3d(0, ${normalizedOffset * -18}px, 0)`;
        }
      }
    });

    // C. "See More Work" Dark Section Scroll & Parallax
    if (seeMoreSection) {
      const rect = seeMoreSection.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const normOffset = (rect.top + rect.height / 2 - viewportHeight / 2) / (viewportHeight / 2);

        if (seeMoreTitle) {
          const letterSpacing = -0.04 + (1 - Math.abs(normOffset)) * 0.01;
          seeMoreTitle.style.letterSpacing = `${letterSpacing}em`;
          seeMoreTitle.style.transform = `scale(${1 + (1 - Math.abs(normOffset)) * 0.04})`;
        }

        // Mouse + Scroll Parallax on 6 Floating Cards
        if (floatingCards.length > 0 && matchMedia('(pointer: fine)').matches) {
          const mouseNormX = (currentMouseX - window.innerWidth / 2) / (window.innerWidth / 2);
          const mouseNormY = (currentMouseY - window.innerHeight / 2) / (window.innerHeight / 2);

          floatingCards.forEach((card, idx) => {
            const speed = (idx % 2 === 0 ? 1 : -1) * (0.04 + idx * 0.01);
            const moveX = mouseNormX * 24 * speed;
            const moveY = (mouseNormY * 24 + normOffset * 30) * speed;
            card.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
          });
        }
      }
    }

    // D. SCROLL-DRIVEN STACKED CASE STUDY CARDS PHYSICS ENGINE
    const caseStudiesSection = document.getElementById('case-studies');
    const csCards = document.querySelectorAll('.cs-panel');
    
    if (caseStudiesSection && csCards.length === 4 && matchMedia('(min-width: 1025px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const secRect = caseStudiesSection.getBoundingClientRect();
      const secHeight = caseStudiesSection.offsetHeight - window.innerHeight;
      const secScrollTop = -secRect.top;
      
      // Calculate normalized section scroll progress (0.0 to 1.0)
      const secProgress = Math.min(1, Math.max(0, secScrollTop / secHeight));
      
      // Initial Card Angles as specified
      const initialAngles = [0, -1, 1, -0.5];
      const viewH = window.innerHeight;

      csCards.forEach((card, idx) => {
        const initRot = initialAngles[idx];
        const mockup = card.querySelector('.card-mockup-wrapper');

        // Mouse Parallax Offset inside Active Card
        const mouseNormX = (currentMouseX - window.innerWidth / 2) / (window.innerWidth / 2);
        const mouseNormY = (currentMouseY - window.innerHeight / 2) / (window.innerHeight / 2);

        if (idx === 0) {
          // CARD 01 (CORTADO CAFÉ — Vibrant Orange)
          if (secProgress < 0.22) {
            card.style.transform = `translate3d(0px, 0px, 0px) scale(1) rotate(0deg)`;
            card.style.opacity = `1`;
            card.style.zIndex = `10`;
            card.style.filter = `none`;
            if (mockup) mockup.style.transform = `translate3d(${mouseNormX * 8}px, ${mouseNormY * 8 + 15}px, 0px) scale(1.04)`;
          } else if (secProgress >= 0.22 && secProgress < 0.42) {
            const t = (secProgress - 0.22) / 0.20;
            const scale = 1 - t * 0.08;
            const translateY = -t * 20;
            const opacity = 1 - t * 0.25;
            card.style.transform = `translate3d(0px, ${translateY}px, 0px) scale(${scale}) rotate(0deg)`;
            card.style.opacity = `${opacity}`;
            card.style.zIndex = `5`;
            card.style.filter = `brightness(${1 - t * 0.2})`;
          } else {
            card.style.transform = `translate3d(0px, -20px, 0px) scale(0.92) rotate(0deg)`;
            card.style.opacity = `0.65`;
            card.style.zIndex = `1`;
            card.style.filter = `brightness(0.7)`;
          }
        } 
        else if (idx === 1) {
          // CARD 02 (ePRISE — Vibrant Purple)
          if (secProgress < 0.22) {
            const startY = viewH * 0.8;
            card.style.transform = `translate3d(0px, ${startY}px, 0px) scale(0.94) rotate(${initRot}deg)`;
            card.style.opacity = `0`;
            card.style.zIndex = `8`;
          } else if (secProgress >= 0.22 && secProgress < 0.42) {
            const t = (secProgress - 0.22) / 0.20;
            const scale = 0.94 + t * 0.06;
            const translateY = (1 - t) * (viewH * 0.8);
            const rot = initRot * (1 - t);
            const opacity = 0.5 + t * 0.5;
            card.style.transform = `translate3d(0px, ${translateY}px, 0px) scale(${scale}) rotate(${rot}deg)`;
            card.style.opacity = `${opacity}`;
            card.style.zIndex = `15`;
            card.style.filter = `none`;
            if (mockup) mockup.style.transform = `translate3d(${mouseNormX * 8 + 25}px, ${mouseNormY * 8}px, 0px) scale(${0.96 + t * 0.07})`;
          } else if (secProgress >= 0.42 && secProgress < 0.52) {
            card.style.transform = `translate3d(0px, 0px, 0px) scale(1) rotate(0deg)`;
            card.style.opacity = `1`;
            card.style.zIndex = `15`;
            card.style.filter = `none`;
            if (mockup) mockup.style.transform = `translate3d(${mouseNormX * 8 + 25}px, ${mouseNormY * 8}px, 0px) scale(1.03)`;
          } else if (secProgress >= 0.52 && secProgress < 0.70) {
            const t = (secProgress - 0.52) / 0.18;
            const scale = 1 - t * 0.08;
            const translateY = -t * 20;
            const opacity = 1 - t * 0.25;
            card.style.transform = `translate3d(0px, ${translateY}px, 0px) scale(${scale}) rotate(0deg)`;
            card.style.opacity = `${opacity}`;
            card.style.zIndex = `10`;
            card.style.filter = `brightness(${1 - t * 0.2})`;
          } else {
            card.style.transform = `translate3d(0px, -20px, 0px) scale(0.92) rotate(0deg)`;
            card.style.opacity = `0.65`;
            card.style.zIndex = `2`;
            card.style.filter = `brightness(0.7)`;
          }
        }
        else if (idx === 2) {
          // CARD 03 (TRIBAL — Bright Lime)
          if (secProgress < 0.52) {
            const startY = viewH * 0.8;
            card.style.transform = `translate3d(0px, ${startY}px, 0px) scale(0.94) rotate(${initRot}deg)`;
            card.style.opacity = `0`;
            card.style.zIndex = `12`;
          } else if (secProgress >= 0.52 && secProgress < 0.70) {
            const t = (secProgress - 0.52) / 0.18;
            const scale = 0.94 + t * 0.06;
            const translateY = (1 - t) * (viewH * 0.8);
            const rot = initRot * (1 - t);
            const opacity = 0.5 + t * 0.5;
            card.style.transform = `translate3d(0px, ${translateY}px, 0px) scale(${scale}) rotate(${rot}deg)`;
            card.style.opacity = `${opacity}`;
            card.style.zIndex = `20`;
            card.style.filter = `none`;
            if (mockup) mockup.style.transform = `translate3d(${mouseNormX * 8 + 15}px, ${mouseNormY * 8}px, 0px) scale(${0.96 + t * 0.06})`;
          } else if (secProgress >= 0.70 && secProgress < 0.78) {
            card.style.transform = `translate3d(0px, 0px, 0px) scale(1) rotate(0deg)`;
            card.style.opacity = `1`;
            card.style.zIndex = `20`;
            card.style.filter = `none`;
            if (mockup) mockup.style.transform = `translate3d(${mouseNormX * 8 + 15}px, ${mouseNormY * 8}px, 0px) scale(1.02)`;
          } else if (secProgress >= 0.78 && secProgress < 0.92) {
            const t = (secProgress - 0.78) / 0.14;
            const scale = 1 - t * 0.08;
            const translateY = -t * 20;
            const opacity = 1 - t * 0.25;
            card.style.transform = `translate3d(0px, ${translateY}px, 0px) scale(${scale}) rotate(0deg)`;
            card.style.opacity = `${opacity}`;
            card.style.zIndex = `15`;
            card.style.filter = `brightness(${1 - t * 0.2})`;
          } else {
            card.style.transform = `translate3d(0px, -20px, 0px) scale(0.92) rotate(0deg)`;
            card.style.opacity = `0.65`;
            card.style.zIndex = `3`;
            card.style.filter = `brightness(0.7)`;
          }
        }
        else if (idx === 3) {
          // CARD 04 (BARAKHA — Coral Red)
          if (secProgress < 0.78) {
            const startY = viewH * 0.8;
            card.style.transform = `translate3d(0px, ${startY}px, 0px) scale(0.94) rotate(${initRot}deg)`;
            card.style.opacity = `0`;
            card.style.zIndex = `18`;
          } else if (secProgress >= 0.78 && secProgress < 0.92) {
            const t = (secProgress - 0.78) / 0.14;
            const scale = 0.94 + t * 0.06;
            const translateY = (1 - t) * (viewH * 0.8);
            const rot = initRot * (1 - t);
            const opacity = 0.5 + t * 0.5;
            card.style.transform = `translate3d(0px, ${translateY}px, 0px) scale(${scale}) rotate(${rot}deg)`;
            card.style.opacity = `${opacity}`;
            card.style.zIndex = `25`;
            card.style.filter = `none`;
            if (mockup) mockup.style.transform = `translate3d(${mouseNormX * 8}px, ${mouseNormY * 8 + 10}px, 0px) scale(${0.96 + t * 0.06})`;
          } else {
            card.style.transform = `translate3d(0px, 0px, 0px) scale(1) rotate(0deg)`;
            card.style.opacity = `1`;
            card.style.zIndex = `25`;
            card.style.filter = `none`;
            if (mockup) mockup.style.transform = `translate3d(${mouseNormX * 8}px, ${mouseNormY * 8 + 10}px, 0px) scale(1.02)`;
          }
        }

      });
    }

    // E. Giant Background Wordmark (GAJESH) Scroll Parallax & Nav Rail Dissolve
    const giantWordmark = document.getElementById('giant-wordmark');
    const footerSec = document.getElementById('contact');
    const navRail = document.getElementById('nav-rail');

    if (footerSec) {
      const fRect = footerSec.getBoundingClientRect();

      // Dissolve left nav rail in footer, and move-in one-by-one when scrolling back up
      if (navRail) {
        if (fRect.top <= window.innerHeight * 0.75) {
          navRail.classList.add('dissolved');
        } else {
          navRail.classList.remove('dissolved');
        }
      }

      if (giantWordmark && fRect.top < window.innerHeight && fRect.bottom > 0) {
        const normScroll = (window.innerHeight - fRect.top) / (window.innerHeight + fRect.height);
        const translateX = (normScroll - 0.5) * -140;
        giantWordmark.style.transform = `translate3d(${translateX}px, 0px, 0px)`;
      }
    }

    // F. Custom Cursor Position
    if (cursorDot && cursorRing && matchMedia('(pointer: fine)').matches) {
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate3d(${currentMouseX}px, ${currentMouseY}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(motionLoop);
  }

  requestAnimationFrame(motionLoop);

  // --------------------------------------------------------------------------
  // 4. Navigation Rail Active Section Observer (6 Sections)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const railBtns = document.querySelectorAll('.rail-btn');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        railBtns.forEach(btn => {
          const href = btn.getAttribute('href');
          if (href === `#${id}`) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  railBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        railBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. Magnetic CTA Button Hover Effect
  // --------------------------------------------------------------------------
  const magneticButtons = document.querySelectorAll('.cta-talk-btn, .see-all-projects-btn, .primary-hero-cta, .rail-btn');
  
  if (matchMedia('(pointer: fine)').matches) {
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - btnCenterX) * 0.35;
        const deltaY = (e.clientY - btnCenterY) * 0.35;
        btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.05)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate3d(0px, 0px, 0) scale(1)`;
        btn.style.transform = '';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Side Drawer Panel & Modal Logic
  // --------------------------------------------------------------------------
  const railMenuTrigger = document.getElementById('rail-menu-trigger');
  const sideDrawerPanel = document.getElementById('side-drawer-panel');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  const drawerTalkBtn = document.getElementById('drawer-talk-btn');
  const drawerItems = document.querySelectorAll('.drawer-item');

  function openSideDrawer() {
    if (!sideDrawerPanel) return;
    sideDrawerPanel.classList.add('open');
    sideDrawerPanel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSideDrawer() {
    if (!sideDrawerPanel) return;
    sideDrawerPanel.classList.remove('open');
    sideDrawerPanel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (railMenuTrigger) railMenuTrigger.addEventListener('click', openSideDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeSideDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeSideDrawer);

  drawerItems.forEach(item => item.addEventListener('click', closeSideDrawer));
  if (drawerTalkBtn) {
    drawerTalkBtn.addEventListener('click', () => {
      closeSideDrawer();
      openModal();
    });
  }

  // Contact Modal
  const contactModal = document.getElementById('contact-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const openContactBtn = document.getElementById('open-contact-btn');
  const heroBookCallBtn = document.getElementById('hero-book-call-btn');
  const bookCallBtn = document.getElementById('book-call-trigger');
  const discoveryCallTrigger = document.getElementById('discovery-call-trigger');
  const finalTalkTrigger = document.getElementById('final-talk-trigger');
  const mobileTalkBtn = document.getElementById('mobile-talk-btn');
  const seeAllProjectsTrigger = document.getElementById('see-all-projects-trigger');
  const projectLinks = document.querySelectorAll('.project-link, .cs-cta-link, .cs-cta-btn');
  const downloadCvBtn = document.getElementById('download-cv-btn');
  const contactForm = document.getElementById('contact-form');
  const formSuccessState = document.getElementById('form-success-state');
  const projectTypeSelect = document.getElementById('project-type');

  function openModal(projectName = null) {
    if (!contactModal) return;
    contactModal.classList.add('active');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (projectName && projectTypeSelect) {
      for (let option of projectTypeSelect.options) {
        if (option.value.toLowerCase().includes(projectName.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }
  }

  function closeModal() {
    if (!contactModal) return;
    contactModal.classList.remove('active');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openContactBtn) openContactBtn.addEventListener('click', () => openModal());
  if (heroBookCallBtn) heroBookCallBtn.addEventListener('click', () => openModal('Book an Intro Call'));
  if (bookCallBtn) bookCallBtn.addEventListener('click', () => openModal('Book a Call / Project Inquiry'));
  if (discoveryCallTrigger) discoveryCallTrigger.addEventListener('click', () => openModal('Free Discovery Call'));
  if (finalTalkTrigger) finalTalkTrigger.addEventListener('click', () => openModal());
  if (seeAllProjectsTrigger) seeAllProjectsTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('Full Portfolio Overview');
  });
  if (downloadCvBtn) downloadCvBtn.addEventListener('click', () => openModal('Resume Download'));
  if (mobileTalkBtn) mobileTalkBtn.addEventListener('click', () => {
    closeMobileNav();
    openModal();
  });

  projectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const projName = link.getAttribute('data-project');
      openModal(projName);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (contactModal && contactModal.classList.contains('active')) closeModal();
      if (sideDrawerPanel && sideDrawerPanel.classList.contains('open')) closeSideDrawer();
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      if (formSuccessState) formSuccessState.classList.add('active');
      
      setTimeout(() => {
        closeModal();
        setTimeout(() => {
          contactForm.reset();
          contactForm.style.display = 'flex';
          if (formSuccessState) formSuccessState.classList.remove('active');
        }, 500);
      }, 2500);
    });
  }

  // Mobile Menu Overlay
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileNav() {
    if (!mobileOverlay) return;
    const isOpen = mobileOverlay.classList.contains('open');
    if (isOpen) closeMobileNav();
    else {
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (!mobileOverlay) return;
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // Custom Cursor Target Highlights
  if (cursorDot && cursorRing && matchMedia('(pointer: fine)').matches) {
    const hoverTargets = document.querySelectorAll('a, button, .rail-btn, .expertise-item, .project-visual-wrapper, .floating-card, .testimonial-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering-link'));
    });
  }

});
