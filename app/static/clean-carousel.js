/**
 * Clean Carousel Implementation
 * Provides smooth horizontal transitions without glitches
 */

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.fullpage-carousel');
  if (!carousel) return;
  
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const dots = Array.from(document.querySelectorAll('.carousel-dot'));
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  const progressBar = document.querySelector('.carousel-progress');
  
  // Initialize variables
  let currentIndex = 0;
  let isAnimating = false;
  let autoplayTimer = null;
  const autoplayDelay = 8000;
  
  // Remove any previously added classes that might interfere
  slides.forEach(slide => {
    slide.classList.remove('active', 'prev', 'next');
  });
  
  // Force preloading of GIF images
  slides.forEach(slide => {
    const gifImg = slide.querySelector('.slide-background-image');
    if (gifImg && gifImg.src) {
      const img = new Image();
      img.src = gifImg.src;
    }
  });
  
  // Set initial state
  function initializeCarousel() {
    // Hide all slides initially
    slides.forEach((slide, i) => {
      if (i === 0) {
        slide.classList.add('active');
      } else if (i === slides.length - 1) {
        slide.classList.add('prev'); // Position the last slide to the left for wrap-around
      } else {
        slide.style.transform = 'translateX(100%)';
      }
    });
    
    // Set first dot as active
    if (dots.length > 0) {
      dots[0].classList.add('active');
    }
    
    // Update progress bar
    updateProgressBar();
  }
  
  // Update progress bar
  function updateProgressBar() {
    if (progressBar) {
      const progress = ((currentIndex + 1) / slides.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }
  
  // Go to a specific slide with direction awareness
  function goToSlide(index, direction = null) {
    // Don't do anything if we're already animating or going to the same slide
    if (isAnimating || index === currentIndex) return;
    isAnimating = true;
    
    // Ensure index is valid
    index = Math.max(0, Math.min(slides.length - 1, index));
    
    // Determine direction if not specified
    if (direction === null) {
      direction = index > currentIndex ? 'next' : 'prev';
    }
    
    // Get current active slide
    const currentSlide = slides[currentIndex];
    const targetSlide = slides[index];
    
    // Clear any existing transform styles that might interfere
    slides.forEach(slide => {
      // Reset any inline styles that might have been set by drag operations
      if (slide !== currentSlide && slide !== targetSlide) {
        slide.style.transform = '';
        slide.style.opacity = '';
        slide.style.zIndex = '';
      }
    });
    
    // Position the new slide based on direction
    if (direction === 'next') {
      targetSlide.style.transform = 'translateX(100%)';
    } else {
      targetSlide.style.transform = 'translateX(-100%)';
    }
    
    // Force a repaint before adding transitions
    targetSlide.offsetHeight;
    
    // Start animations
    requestAnimationFrame(() => {
      // Add transition class temporarily
      carousel.classList.add('is-transitioning');
      
      // Move current slide out
      if (direction === 'next') {
        currentSlide.style.transform = 'translateX(-100%)';
      } else {
        currentSlide.style.transform = 'translateX(100%)';
      }
      currentSlide.style.opacity = '0';
      
      // Move new slide in
      targetSlide.style.transform = 'translateX(0)';
      targetSlide.style.opacity = '1';
      targetSlide.style.zIndex = '2';
      
      // Update the active class after animation completes
      setTimeout(() => {
        // Remove all position classes
        slides.forEach(slide => {
          slide.classList.remove('active', 'prev', 'next');
        });
        
        // Add appropriate classes
        targetSlide.classList.add('active');
        
        // Update dots
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
        
        // Update current index
        currentIndex = index;
        
        // Update progress bar
        updateProgressBar();
        
        // Reset animation state
        isAnimating = false;
        
        // Remove transitioning class
        carousel.classList.remove('is-transitioning');
        
        // Clean up inline styles
        slides.forEach(slide => {
          if (slide !== targetSlide) {
            slide.style.transform = '';
            slide.style.opacity = '';
            slide.style.zIndex = '';
          }
        });
        
        // Reset autoplay timer
        resetAutoplay();
      }, 700); // Match this to the CSS transition duration
    });
  }
  
  // Go to the next slide
  function goToNextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex, 'next');
  }
  
  // Go to the previous slide
  function goToPrevSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex, 'prev');
  }
  
  // Reset the autoplay timer
  function resetAutoplay() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
    }
    
    autoplayTimer = setTimeout(() => {
      goToNextSlide();
    }, autoplayDelay);
  }
  
  // Initialize event listeners
  function initEvents() {
    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToPrevSlide();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToNextSlide();
      });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(index);
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      }
    });
    
    // Basic touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const distance = touchEndX - touchStartX;
      
      if (Math.abs(distance) > 50) {
        if (distance < 0) {
          goToNextSlide();
        } else {
          goToPrevSlide();
        }
      }
    }, { passive: true });
  }
  
  // Initialize the carousel
  initializeCarousel();
  initEvents();
  resetAutoplay();
});
