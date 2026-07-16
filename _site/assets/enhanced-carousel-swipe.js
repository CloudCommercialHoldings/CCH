/**
 * Enhanced touchpad and swipe navigation for carousel
 */
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.fullpage-carousel');
  if (!carousel) return;
  
  // Find the next/prev functions from the main carousel
  function findCarouselNavFunctions() {
    // We'll use the arrow buttons directly
    const nextArrow = document.querySelector('.carousel-arrow.next');
    const prevArrow = document.querySelector('.carousel-arrow.prev');
    
    return { 
      goNext: function() { if (nextArrow) nextArrow.click(); },
      goPrev: function() { if (prevArrow) prevArrow.click(); }
    };
  }
  
  // Get navigation functions
  const { goNext, goPrev } = findCarouselNavFunctions();
  
  // Track swipe state
  let isSwipeEnabled = true;
  let lastSwipeTime = 0;
  const swipeCooldown = 300; // Significantly reduced for faster successive swipes
  
  // Function to prevent accidental double swipes but allow fast navigation
  function canSwipe() {
    const now = Date.now();
    // Very short cooldown to prevent accidental double swipes
    // but still allow for quick navigation
    if (now - lastSwipeTime < swipeCooldown) {
      return false;
    }
    lastSwipeTime = now;
    return true;
  }
  
  // Add mouse drag support for swipe-like behavior on desktop
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  
  // Track if we're in a vertical or horizontal drag
  let isVerticalDrag = false;
  let isHorizontalDrag = false;
  
  carousel.addEventListener('mousedown', function(e) {
    // Don't initiate drag on clickable elements
    if (e.target.closest('.carousel-arrow, .carousel-dot, .carousel-exit, .slide-cta')) {
      return;
    }
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    currentX = startX;
    currentY = startY;
    
    // Reset drag direction
    isVerticalDrag = false;
    isHorizontalDrag = false;
    
    // Change cursor to grabbing
    carousel.style.cursor = 'grabbing';
    
    // Prevent default to avoid text selection
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    currentX = e.clientX;
    currentY = e.clientY;
    
    const deltaX = Math.abs(currentX - startX);
    const deltaY = Math.abs(currentY - startY);
    
    // Determine drag direction on first significant movement
    if (!isVerticalDrag && !isHorizontalDrag) {
      if (deltaX > 10 || deltaY > 10) {
        isHorizontalDrag = deltaX > deltaY;
        isVerticalDrag = !isHorizontalDrag;
      }
    }
    
    // Apply a subtle transform to show the drag effect
    if (isHorizontalDrag) {
      const activeSlide = document.querySelector('.carousel-slide.active');
      if (activeSlide) {
        const offset = (currentX - startX) / 10; // Reduce the effect for subtlety
        activeSlide.style.transform = `translateX(${offset}px)`;
      }
    }
    
    // Prevent default to avoid text selection during drag
    e.preventDefault();
  });
  
  document.addEventListener('mouseup', function(e) {
    if (!isDragging) return;
    
    // Calculate the drag distance
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Handle the swipe with minimal threshold for instant response
    // We use a very small threshold for mouse drags
    if (isHorizontalDrag && Math.abs(deltaX) > 25 && isSwipeEnabled && canSwipe()) {
      if (deltaX < 0 && goNext) {
        goNext();
      } else if (deltaX > 0 && goPrev) {
        goPrev();
      }
    }
    
    // Reset all slides on mouseup to prevent transition issues
    document.querySelectorAll('.carousel-slide').forEach(slide => {
      slide.style.transform = '';
    });
    
    // Reset cursor
    carousel.style.cursor = '';
    
    // Reset drag state
    isDragging = false;
  });
  
  // Add additional touchpad handling for better gesture support
  let lastWheelTime = 0;
  let wheelDelta = { x: 0, y: 0 };
  let wheelTimer = null;
  const wheelCooldown = 300; // Reduced to match swipe cooldown
  
  carousel.addEventListener('wheel', function(e) {
    if (!isSwipeEnabled) return;
    
    const now = Date.now();
    
    // Apply a multiplier to make touchpad gestures more sensitive
    const multiplier = 1.5;
    
    // Only reset accumulated delta after a very short window for ultra-fast response
    if (now - lastWheelTime > 50) { // Reduced from 100ms for much faster response
      wheelDelta = { x: 0, y: 0 };
    }
    
    // Accumulate deltas with multiplier for heightened sensitivity
    wheelDelta.x += e.deltaX * multiplier;
    wheelDelta.y += e.deltaY * multiplier;
    
    // Determine if this is a horizontal or vertical gesture
    const isHorizontalGesture = Math.abs(wheelDelta.x) > Math.abs(wheelDelta.y);
    
    // Use a much lower threshold for ultra-responsive detection
    const threshold = 25; // Significantly reduced for faster triggering
    
    // Clear any pending wheel timer for immediate response
    if (wheelTimer) {
      clearTimeout(wheelTimer);
    }
    
    // No delay - immediate response to wheel events
    // Execute immediately instead of using setTimeout
    if (canSwipe()) {
      if (isHorizontalGesture) {
        if (wheelDelta.x > threshold && goNext) {
          goNext();
          wheelDelta = { x: 0, y: 0 };
        } else if (wheelDelta.x < -threshold && goPrev) {
          goPrev();
          wheelDelta = { x: 0, y: 0 };
        }
      } else {
        if (wheelDelta.y > threshold && goNext) {
          goNext();
          wheelDelta = { x: 0, y: 0 };
        } else if (wheelDelta.y < -threshold && goPrev) {
          goPrev();
          wheelDelta = { x: 0, y: 0 };
        }
      }
    }
    
    lastWheelTime = now;
    
    // Prevent default scrolling
    e.preventDefault();
  }, { passive: false });
  
  // Ensure touch events work correctly
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', function(e) {
    if (!isSwipeEnabled) return;
    
    touchEndX = e.changedTouches[0].screenX;
    
    // Calculate the swipe distance
    const swipeDistance = touchEndX - touchStartX;
    
    // Use a minimal threshold for touch to make it extremely responsive
    if (Math.abs(swipeDistance) > 20 && canSwipe()) {
      if (swipeDistance < 0 && goNext) {
        goNext();
      } else if (swipeDistance > 0 && goPrev) {
        goPrev();
      }
    }
  }, { passive: true });
  
  // Disable swipe briefly after slide change
  // Minimal disable time to prevent accidental double swipes
  function disableSwipeTemporarily() {
    isSwipeEnabled = false;
    // Use a shorter timeout for faster re-enabling
    setTimeout(() => {
      isSwipeEnabled = true;
    }, Math.min(250, swipeCooldown)); // Use even shorter time than cooldown
  }
  
  // Watch for slide changes and disable swipe temporarily
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class' && 
          mutation.target.classList.contains('carousel-slide') &&
          mutation.target.classList.contains('active')) {
        disableSwipeTemporarily();
      }
    });
  });
  
  // Observe all carousel slides for class changes
  const slides = carousel.querySelectorAll('.carousel-slide');
  slides.forEach((slide) => {
    observer.observe(slide, { attributes: true });
  });
});
