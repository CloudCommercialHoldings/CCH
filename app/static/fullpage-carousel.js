// Full-page services carousel

document.addEventListener('DOMContentLoaded', () => {
  // Get carousel elements
  const carousel = document.querySelector('.fullpage-carousel');
  
  // If carousel doesn't exist, exit early
  if (!carousel) return;
  
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevButton = document.querySelector('.carousel-arrow.prev');
  const nextButton = document.querySelector('.carousel-arrow.next');
  
  // Set initial state - always start with the first slide
  let currentSlide = 0;
  let isAnimating = false;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  const autoplayDelay = 8000; // 8 seconds per slide
  
  // Remove any existing active classes that might have been set
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  
  dots.forEach(dot => {
    dot.classList.remove('active');
  });
  
  // Prepare all slides first
  slides.forEach(slide => {
    // Force browser to preload/prerender the slide backgrounds
    const bg = slide.querySelector('.slide-background');
    if (bg && bg.style.backgroundImage) {
      const url = bg.style.backgroundImage.replace(/url\(['"]?([^'"]*)['"]?\)/g, '$1');
      if (url) {
        const img = new Image();
        img.src = url;
      }
    }
    
    // Preload GIF images for the new background approach
    const gifImg = slide.querySelector('.slide-background-image');
    if (gifImg) {
      const img = new Image();
      img.src = gifImg.src;
      // Make sure GIFs are ready to play when slides become active
      gifImg.addEventListener('load', () => {
        console.log(`GIF loaded: ${gifImg.src}`);
      });
    }
  });
  
  // Show carousel by default
  carousel.style.display = 'block';
  document.body.style.overflow = 'hidden';
  document.body.classList.add('fullpage-carousel-active');
  
  // Immediately set first slide as active, no delay
  if (slides.length > 0) {
    slides[0].classList.add('active');
    // Also ensure first dot is active
    if (dots.length > 0) {
      dots[0].classList.add('active');
    }
  }
  
  // Function to update the active slide
  function updateSlide(index) {
    if (isAnimating) return;
    isAnimating = true;
    
    // Ensure index is valid and within bounds
    index = Math.max(0, Math.min(totalSlides - 1, index));
    
    // Update current slide index
    currentSlide = index;
    
    // Instead of removing active class from all slides at once,
    // we'll deactivate the current active slide first
    const activeSlide = document.querySelector('.carousel-slide.active');
    
    if (activeSlide) {
      activeSlide.classList.remove('active');
      
      // No delay - activate the next slide immediately
      // This prevents the "stuck" feeling when navigating
      slides[currentSlide].classList.add('active');
    } else {
      // If no active slide (first load), activate immediately
      slides[currentSlide].classList.add('active');
    }
    
    // Update dots - make sure we're updating the correct dot
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Update progress bar if it exists
    const progressBar = document.querySelector('.carousel-progress');
    if (progressBar) {
      const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
    
    // Reset animation flag after transition completes
    setTimeout(() => {
      isAnimating = false;
    }, 1200); // Match this with the CSS transition duration
    
    // Reset autoplay timer
    resetAutoplay();
  }
  
  // Go to previous slide
  function goToPrevSlide() {
    // Calculate previous index, ensuring it wraps correctly
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlide(prevIndex);
  }
  
  // Go to next slide
  function goToNextSlide() {
    // Calculate next index, ensuring it wraps correctly
    const nextIndex = (currentSlide + 1) % totalSlides;
    updateSlide(nextIndex);
  }
  
  // Reset autoplay timer
  function resetAutoplay() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
    }
    
    autoplayTimer = setTimeout(() => {
      goToNextSlide();
    }, autoplayDelay);
  }
  
  // Reset the carousel to first slide
  function resetCarousel() {
    updateSlide(0);
    
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
    resetAutoplay();
  }
  
  // Initialize event listeners
  function initEvents() {
    // Navigation buttons
    if (prevButton) {
      prevButton.addEventListener('click', goToPrevSlide);
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', goToNextSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        updateSlide(index);
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
    
    // Base touch swipe support
    // Note: enhanced-carousel-swipe.js provides more advanced touch handling
    // This is kept as a fallback
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left
        goToNextSlide();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right
        goToPrevSlide();
      }
    }
    
    // Simple wheel event handler
    // Note: enhanced-carousel-swipe.js provides more advanced wheel handling
    // This is kept as a fallback
    let wheelTimeout;
    let wheelDirection = 0;
    const wheelThreshold = 10;
    
    // We'll only activate this handler if the enhanced handler isn't present
    // Check if enhanced-carousel-swipe.js has been loaded by looking for a specific class
    if (!document.querySelector('.slide-click-overlay')) {
      carousel.addEventListener('wheel', (e) => {
        e.preventDefault(); // Prevent page scrolling
        
        // Accumulate wheel movement (horizontal or vertical)
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          wheelDirection += e.deltaX;
        } else {
          wheelDirection += e.deltaY;
        }
        
        // Clear previous timeout
        if (wheelTimeout) {
          clearTimeout(wheelTimeout);
        }
        
        // Set a timeout to debounce rapid wheel events
        wheelTimeout = setTimeout(() => {
          if (wheelDirection > wheelThreshold) {
            goToNextSlide();
          } else if (wheelDirection < -wheelThreshold) {
            goToPrevSlide();
          }
          wheelDirection = 0; // Reset accumulated delta
        }, 50);
      }, { passive: false }); // passive: false allows preventDefault
    }
  }
  
  // Initialize the carousel
  function initCarousel() {
    // Initialize events
    initEvents();
    
    // Start autoplay
    resetAutoplay();
  }
  
  // Initialize if carousel exists
  if (carousel && slides.length > 0) {
    initCarousel();
  }
});
