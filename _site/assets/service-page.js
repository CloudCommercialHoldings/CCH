// service-page.js - Handling service page specific functionality

// Staggered reveal for elements with .reveal class
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
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
})();

// Smooth scroll for anchor links
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
})();

// Case studies slider functionality
(function() {
  const slider = document.querySelector('.case-studies-slider');
  if (!slider) return;
  
  const cards = Array.from(slider.querySelectorAll('.case-study-card'));
  if (cards.length <= 1) return; // Don't initialize slider if only one card
  
  let currentIndex = 0;
  let intervalId = null;
  
  // Hide all cards except the first one
  cards.forEach((card, index) => {
    if (index !== 0) {
      card.style.display = 'none';
    }
  });
  
  // Create navigation controls
  const createNavigation = () => {
    const navContainer = document.createElement('div');
    navContainer.className = 'slider-nav';
    navContainer.style.cssText = `
      display: flex;
      justify-content: center;
      margin-top: 20px;
      gap: 10px;
    `;
    
    cards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        background-color: ${index === 0 ? 'var(--service-main-color)' : '#ccc'};
        cursor: pointer;
        transition: background-color 0.3s ease;
      `;
      
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetInterval();
      });
      
      navContainer.appendChild(dot);
    });
    
    slider.parentNode.appendChild(navContainer);
    return navContainer.querySelectorAll('.slider-dot');
  };
  
  const dots = createNavigation();
  
  // Go to specific slide
  const goToSlide = (index) => {
    cards[currentIndex].style.display = 'none';
    dots[currentIndex].style.backgroundColor = '#ccc';
    
    currentIndex = index;
    
    cards[currentIndex].style.display = 'grid';
    dots[currentIndex].style.backgroundColor = 'var(--service-main-color)';
  };
  
  // Go to next slide
  const nextSlide = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= cards.length) {
      nextIndex = 0;
    }
    goToSlide(nextIndex);
  };
  
  // Set interval for automatic sliding
  const startInterval = () => {
    intervalId = setInterval(nextSlide, 5000);
  };
  
  // Reset interval when user interacts with slider
  const resetInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    startInterval();
  };
  
  // Initialize automatic sliding
  startInterval();
  
  // Pause sliding when user hovers over the slider
  slider.addEventListener('mouseenter', () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
  
  // Resume sliding when user leaves the slider
  slider.addEventListener('mouseleave', () => {
    startInterval();
  });
})();

// Form validation
(function() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    let isValid = true;
    
    // Basic validation
    if (!nameInput.value.trim()) {
      nameInput.style.borderColor = 'red';
      isValid = false;
    } else {
      nameInput.style.borderColor = '';
    }
    
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
      emailInput.style.borderColor = 'red';
      isValid = false;
    } else {
      emailInput.style.borderColor = '';
    }
    
    if (!messageInput.value.trim()) {
      messageInput.style.borderColor = 'red';
      isValid = false;
    } else {
      messageInput.style.borderColor = '';
    }
    
    if (isValid) {
      // In a real implementation, this would submit the form
      // For now, show a success message
      const formElements = form.querySelectorAll('input, textarea, button');
      formElements.forEach(el => {
        el.disabled = true;
      });
      
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
      successMessage.style.cssText = `
        background-color: #d4edda;
        color: #155724;
        padding: 15px;
        margin-top: 20px;
        border-radius: 5px;
        text-align: center;
      `;
      
      form.appendChild(successMessage);
    }
  });
  
  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
})();
