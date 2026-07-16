// Slow the hero background video playback for a calmer feel
(function() {
  // Support both background video and SVG-clipped video playback tuning
  const bgVideo = document.querySelector('.bg-video');
  const svgClipVideo = document.querySelector('.svg-clip-video');
  [bgVideo, svgClipVideo].forEach(v => {
    if (!v) return;
    try {
      v.playbackRate = 0.75;
      // Try to start playback in case the browser didn't autoplay it for some reason
      // This is safe: will be ignored if autoplay policy prevents it.
      const p = v.play();
      if (p && typeof p.then === 'function') p.catch(() => {});
    } catch (e) {
      // ignore playback errors
    }
  });
})();

// Add page-ready class to prevent FOUC/FOUT
(function() {
  // Track page load state globally
  window.pageHasLoaded = false;
  
  // Function to handle when a user navigates with browser back/forward
  function handleNavigation() {
    const topbar = document.querySelector('.topbar');
    if (topbar) {
      // Reset any exit animations
      topbar.classList.remove('topbar--exit');
      
      // Ensure topbar is visible immediately with browser navigation
      topbar.classList.add('topbar--dropped');
      
      // Make topbar elements visible immediately during browser navigation
      const topbarElements = topbar.querySelectorAll('.logo-mark, .cta-pill, .hamburger');
      topbarElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.visibility = 'visible';
        // Remove any animations to ensure immediate visibility
        el.style.animation = 'none';
      });
      
      // Force a reflow
      void topbar.offsetWidth;
      
      // Remove the inline styles after a short delay
      setTimeout(() => {
        topbarElements.forEach(el => {
          el.style.animation = '';
        });
      }, 50);
    }
  }
  
  // Mark page as ready immediately
  document.documentElement.classList.add('page-ready');
  
  // Set a very short timeout to ensure CSS transitions can trigger
  setTimeout(() => {
    document.documentElement.classList.add('content-visible');
  }, 0);
  
  // Mark when page has fully loaded
  window.addEventListener('load', () => {
    window.pageHasLoaded = true;
  });
  
  // Handle all navigation events
  window.addEventListener('pageshow', (event) => {
    // pageshow fires on both initial page load and when navigating back to a page
    // The persisted property indicates if the page is coming from browser cache (back/forward)
    if (event.persisted) {
      const topbar = document.querySelector('.topbar');
      if (topbar) {
        // Add a special class for browser navigation
        topbar.classList.add('topbar--browser-navigation');
        // Also ensure our normal class is there
        topbar.classList.add('topbar--dropped');
      }
      handleNavigation();
    }
  });
  
  // Also listen for regular popstate events (back/forward button clicks)
  window.addEventListener('popstate', () => {
    const topbar = document.querySelector('.topbar');
    if (topbar) {
      // Add a special class for browser navigation
      topbar.classList.add('topbar--browser-navigation');
      // Also ensure our normal class is there
      topbar.classList.add('topbar--dropped');
    }
    handleNavigation();
  });
})();

// Staggered reveal for elements with .reveal
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if (reveals.length === 0) return;

  if (!('IntersectionObserver' in window) || prefersReduced) {
    // If IO unsupported or user prefers reduced motion, show immediately
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // small timeout honors the data-delay attribute (in ms multiples)
    const delayIndex = parseInt(el.getAttribute('data-delay') || '0', 10);
    // increase multiplier so stagger feels slower and more deliberate
    const delay = Math.max(0, delayIndex) * 180;
        setTimeout(() => {
          el.classList.add('is-visible');
          // Add the accent-drawn class shortly after to stagger the bar draw
          setTimeout(() => el.classList.add('accent-drawn'), 160);
        }, delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.45 });

  reveals.forEach(el => observer.observe(el));
})();

// Mark page as loaded to trigger CSS entrance animations
(function() {
  // Ensure overlay is definitely closed before DOMContentLoaded
  const overlay = document.getElementById('menuOverlay');
  const toggle = document.getElementById('menuToggle');
  
  if (overlay) {
    // Initial state - make sure it's hidden before any animations can occur
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.visibility = 'hidden'; // Explicitly hide it
  }
  
  if (toggle) {
    toggle.setAttribute('aria-expanded', 'false');
  }

  window.addEventListener('load', () => {
    // Allow a tiny delay so layout settles, then reveal hero
    requestAnimationFrame(() => {
      setTimeout(() => document.documentElement.classList.add('page-loaded'), 60);
    });
  });
})();

  // Button drop-in on load + graceful exit animation before navigating internal links
  (function() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Track whether button animations have been initialized
    let buttonsInitialized = false;
    let isNavigating = false;
    
    // Function to initialize the topbar buttons
    function initializeTopbarButtons() {
      if (prefersReduced) return; // don't animate if user prefers reduced motion
      
      try {
        const topbar = document.querySelector('.topbar');
        if (!topbar) return;
        
        // Skip animation if this is a browser back/forward navigation
        if (performance && performance.navigation && 
            (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD ||
             document.visibilityState === 'visible' && document.wasDiscarded)) {
          
          // For back/forward navigation, make topbar immediately visible
          const topbarElements = topbar.querySelectorAll('.logo-mark, .cta-pill, .hamburger');
          topbarElements.forEach(el => {
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
          
          topbar.classList.add('topbar--dropped');
          buttonsInitialized = true;
          return;
        }
        
        // Clean any leftover classes
        topbar.classList.remove('topbar--exit');
        
        // Ensure elements are hidden before animation starts
        const topbarElements = topbar.querySelectorAll('.logo-mark, .cta-pill, .hamburger');
        topbarElements.forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(-120%) scale(0.995)';
          el.style.visibility = 'hidden';
        });
        
        // We need a brief delay to let the DOM stabilize and any other scripts run
        setTimeout(() => {
          // Reset inline styles to let CSS animations take over
          topbarElements.forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
            el.style.visibility = '';
          });
          
          // Set the class to start the drop-in animation for buttons
          topbar.classList.add('topbar--dropped');
          
          // Mark as initialized only after animation should have completed
          setTimeout(() => {
            buttonsInitialized = true;
          }, 1000);
        }, 400);
      } catch (e) {
        console.error('Error in topbar button animation:', e);
      }
    }
    
    // Initialize on page load
    window.addEventListener('load', initializeTopbarButtons);
    
    // Also initialize on hashchange events (for when navigating with hash fragments)
    window.addEventListener('hashchange', () => {
      // Reset the topbar state
      const topbar = document.querySelector('.topbar');
      if (topbar) {
        // If not already initialized, initialize it
        if (!buttonsInitialized) {
          initializeTopbarButtons();
        }
      }
    });
    
    // Handle pageshow event (fires on both initial load and back/forward navigation)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        // This is a back/forward navigation from browser cache
        const topbar = document.querySelector('.topbar');
        if (topbar) {
          // Immediately make topbar visible without animation
          const topbarElements = topbar.querySelectorAll('.logo-mark, .cta-pill, .hamburger');
          topbarElements.forEach(el => {
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
          
          topbar.classList.add('topbar--dropped');
          buttonsInitialized = true;
        }
      }
    });

    function isInternalLink(a) {
      if (!a || !a.href) return false;
      try {
        const url = new URL(a.href, location.href);
        return url.origin === location.origin;
      } catch (e) { return false; }
    }

    document.addEventListener('click', (e) => {
      // Skip if buttons haven't been initialized yet or if we're already navigating
      if (!buttonsInitialized || isNavigating) return;
      
      const anchor = e.target.closest && e.target.closest('a');
      if (!anchor) return;
      if (!isInternalLink(anchor)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || anchor.target === '_blank') return;

      const href = anchor.getAttribute('href') || '';
      // Skip hash-only links to avoid animation when jumping to page sections
      if (href.startsWith('#')) return;
      
      // Skip links that go to the same page with a different hash
      const currentPathname = window.location.pathname;
      try {
        const linkUrl = new URL(anchor.href);
        if (linkUrl.pathname === currentPathname && linkUrl.hash) return;
      } catch (e) { /* ignore parsing errors */ }

      const topbar = document.querySelector('.topbar');
      if (!topbar) return;

      // Play exit animation then navigate
      e.preventDefault();
      isNavigating = true;
      
      // First remove the dropped class, then add the exit class in next frame
      topbar.classList.remove('topbar--dropped');
      
      // Prepare topbar elements for exit animation by ensuring they're visible
      const topbarElements = topbar.querySelectorAll('.logo-mark, .cta-pill, .hamburger');
      topbarElements.forEach(el => {
        // Ensure elements are visible before animation starts
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      
      // Use requestAnimationFrame to ensure classes don't conflict
      requestAnimationFrame(() => {
        topbar.classList.add('topbar--exit');
        
        // Wait for exit animation (650ms in CSS) plus a small buffer
        const NAV_DELAY = prefersReduced ? 0 : 850; // Allow time for staggered exit
        setTimeout(() => { 
          window.location.href = anchor.href; 
        }, NAV_DELAY);
      });
    }, { capture: true });
  })();

// Menu overlay toggle with animation + body lock
(function() {
  const overlay = document.getElementById('menuOverlay');
  const toggle = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('menuClose');
  const body = document.body;

  function openMenu() {
    if (!overlay) return;
    
    // Make visible first, then animate
    overlay.style.visibility = 'visible';
    
    // Use requestAnimationFrame to ensure visibility change has applied before animating
    requestAnimationFrame(() => {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';
    });
  }
  
  function closeMenu() {
    if (!overlay) return;
    
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
    
    // Set visibility to hidden after transition completes
    setTimeout(() => {
      if (!overlay.classList.contains('open')) {
        overlay.style.visibility = 'hidden';
      }
    }, 350); // Slightly longer than the transition duration (300ms)
  }

  if (toggle) toggle.addEventListener('click', (e) => {
    // Prevent accidental focus-visible outline flicker on initial load
    e.preventDefault();
    openMenu();
  });
  
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  // Optional: ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      closeMenu();
    }
  });
})();

// Add ripple effect on hamburger click
(function() {
  const toggle = document.getElementById('menuToggle');
  if (!toggle) return;
  toggle.addEventListener('mousedown', () => {
    toggle.classList.remove('rippling');
    // force reflow to restart animation if needed
    void toggle.offsetWidth;
    toggle.classList.add('rippling');
    setTimeout(() => toggle.classList.remove('rippling'), 480);
  });
})();

// Existing rotating word script safeguarded
(function() {
  const words = ["CLOUD", "AI", "DATA", "APPS"];
  const el = document.getElementById("rotating-word");
  if (!el) return; // if not present on page, skip
  let counter = 0;
  el.textContent = words[0];
  const scramble = async () => {
    let iterations = 0;
    const originalWord = words[counter % words.length];
    const interval = setInterval(() => {
      el.textContent = originalWord.split("")
        .map((_, i) => {
          if(i < iterations) return originalWord[i];
          return String.fromCharCode(65 + Math.random() * 26);
        }).join("");
      if(iterations >= originalWord.length) clearInterval(interval);
      iterations++;
    }, 100);
    counter++;
    await new Promise(resolve => setTimeout(resolve, 3000));
    scramble();
  };
  scramble();
})();

// Fade-in sections on first scroll (one-time animation)
(function() {
  const sectionsToAnimate = ['#services', '#about', '#contact'];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // One-time animation
      }
    });
  }, { 
    threshold: 0.2, // Trigger when 20% visible
    rootMargin: '0px 0px -50px 0px' // Start animation slightly before fully in view
  });

  sectionsToAnimate.forEach(selector => {
    const section = document.querySelector(selector);
    if (section) observer.observe(section);
  });
})();

// Keep existing observer/slideshow if present
(function() {
  document.addEventListener("DOMContentLoaded", function () {
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    if (animatedElements.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
  });

  function showSlides() {
    const slides = document.getElementsByClassName("slide");
    let slideIndex = 0;
    function cycleSlides() {
      for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
      slideIndex++;
      if (slideIndex > slides.length) slideIndex = 1;
      if (slides[slideIndex - 1]) slides[slideIndex - 1].style.display = "block";
      setTimeout(cycleSlides, 2500);
    }
    if (slides.length > 0) cycleSlides();
  }
  document.addEventListener("DOMContentLoaded", showSlides);
})();

// Smooth fade of topbar based on how much of the hero is visible
(function() {
  const topbar = document.querySelector('.topbar');
  const hero = document.querySelector('.hero-atriz');
  if (!topbar || !hero || !('IntersectionObserver' in window)) return;

  const thresholds = Array.from({ length: 21 }, (_, i) => i / 20); // 0..1 in 0.05 steps
  const observer = new IntersectionObserver(([entry]) => {
    const ratio = entry.intersectionRatio; // 1 when hero fully visible, 0 when gone
    // Opacity grows as hero disappears; offset a bit so it starts near the end
    const opacity = Math.min(1, Math.max(0, 1 - ratio));
    topbar.style.setProperty('--topbarOpacity', String(opacity));
    if (opacity > 0.98) {
      topbar.classList.add('topbar--solid');
      topbar.classList.remove('topbar--transparent');
    } else {
      topbar.classList.add('topbar--transparent');
      topbar.classList.remove('topbar--solid');
    }
  }, { threshold: thresholds, rootMargin: '-60px 0px 0px 0px' });

  observer.observe(hero);
})();

// Smooth scroll behavior for the hero scroll arrow
(function() {
  const arrow = document.querySelector('.scroll-arrow');
  if (!arrow) return;
  arrow.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(arrow.getAttribute('href'));
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// Ensure tickers are continuous, very slow, and never leave the screen
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const tracks = Array.from(document.querySelectorAll('.clients-ticker .ticker-track'));
    if (tracks.length === 0) return;

    const SLOW_DURATION = '360s'; // VERY slow; adjust to taste

    tracks.forEach(track => {
      const container = track.closest('.clients-ticker');
      if (!container) return;

      // capture original children once
      const originalItems = Array.from(track.children).map(n => n.cloneNode(true));
      if (originalItems.length === 0) return;

      // set CSS duration on container so forward/reverse animations pick it up
      container.style.setProperty('--ticker-duration', SLOW_DURATION);

      function buildContinuous() {
        // reset to one group
        track.innerHTML = '';
        originalItems.forEach(item => track.appendChild(item.cloneNode(true)));

        // duplicate until track width covers at least twice the viewport container
        const containerWidth = container.clientWidth || window.innerWidth;
        let safety = 0;
        while (track.scrollWidth < containerWidth * 2 && safety < 30) {
          originalItems.forEach(item => track.appendChild(item.cloneNode(true)));
          safety++;
        }
      }

      buildContinuous();

      // Rebuild on resize debounced
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildContinuous, 180);
      });
    });
  });
})();

// (logos now handled by pure-CSS duplicated lists in the template)

// Scale logos based on distance to pill center (large when away, small when centered)
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const clientsSection = document.querySelector('#clients');
    const pill = document.querySelector('.clients-pill');
    if (!clientsSection || !pill) return;

    let logos = [];
    function refreshLogos() {
      const logoEls = pill.querySelectorAll('.clients-logos .logo');
      logos = Array.from(logoEls);
      // ensure smooth transforms
      logos.forEach(el => {
  // Keep logos visually stable: only allow opacity micro-transitions if needed.
  el.style.transition = 'opacity 220ms ease';
  el.style.willChange = 'opacity';
  el.style.transformOrigin = '50% 50%';
  // Ensure they start and remain uniform
  el.style.transform = 'scale(1)';
  el.style.opacity = '1';
      });
    }

    refreshLogos();

    // Rebuild on mutation (in case JS duplicates later) and on resize
    const ro = new ResizeObserver(() => refreshLogos());
    ro.observe(pill);

    let running = false;
    let rafId = null;

    function step() {
      const pillRect = pill.getBoundingClientRect();
      const pillCenterX = pillRect.left + pillRect.width / 2;
      // Logos remain uniform: keep scale and opacity fixed so they don't enlarge
      logos.forEach(el => {
        el.style.transform = 'scale(1)';
        el.style.opacity = '1';
      });
      rafId = requestAnimationFrame(step);
    }

    // Only run the loop while the clients section is mostly visible
    const visObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          if (!running) {
            running = true;
            rafId = requestAnimationFrame(step);
            refreshLogos();
          }
        } else {
          if (running) {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            // reset transforms back to pill-normal
            logos.forEach(el => {
              el.style.transform = 'scale(1)';
              el.style.opacity = '1';
            });
          }
        }
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1.0] });

    visObserver.observe(clientsSection);
    window.addEventListener('resize', refreshLogos);
  });
})();


// Progressive expand -> pill collapse behavior for clients section
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.clients-section');
    const pill = section ? section.querySelector('.clients-pill') : null;
    if (!section || !pill) return;

    // Start expanded (full band). We'll smoothly animate to pill as user scrolls.
    section.style.setProperty('--pill-progress', '1');

    // Observe the scroll position of the section to map progress 1 -> 0
    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Use the section center vs viewport center so when the user is "over" the
      // section the pill is fully collapsed (progress ~= 0). When the section
      // is far away (above/below) the band is expanded (progress ~= 1).
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = vh / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);

      // collapseZone: within this many pixels around the center we treat as "over it"
      const collapseZone = vh * 0.18; // ~18% of viewport: tuned for perceived center
      // maxRange: distance at which the band should be fully expanded
      const maxRange = vh * 0.6;

      let norm = (distance - collapseZone) / (maxRange - collapseZone);
      norm = Math.max(0, Math.min(1, norm));
      // norm==0 => user is over it -> collapsed (progress 0). norm==1 => far -> expanded
      const progress = norm;
      section.style.setProperty('--pill-progress', String(progress));
    };

    // Throttle updates for performance
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    // Initial compute and listeners
    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  });
})();

