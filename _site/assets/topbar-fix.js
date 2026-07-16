/**
 * This script ensures the topbar maintains consistent styling
 * regardless of scroll position or which slide is currently active.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get references to key elements
  const topbar = document.querySelector('.topbar');
  const logo = document.querySelector('.topbar .logo-mark-img');
  const ctaPill = document.querySelector('.topbar .cta-pill');
  const hamburgerSpans = document.querySelectorAll('.topbar .hamburger span');
  
  // Apply consistent styling immediately on load
  applyConsistentStyling();
  
  // Ensure styling is maintained during scrolling
  window.addEventListener('scroll', applyConsistentStyling);
  
  // Also maintain styling during slide transitions
  // Look for carousel navigation events if they exist
  const carouselArrows = document.querySelectorAll('.carousel-arrow');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  
  carouselArrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
      // Force styling update after a slight delay to allow for transition
      setTimeout(applyConsistentStyling, 50);
      setTimeout(applyConsistentStyling, 300); // Additional check after transition
    });
  });
  
  carouselDots.forEach(dot => {
    dot.addEventListener('click', () => {
      // Force styling update after a slight delay to allow for transition
      setTimeout(applyConsistentStyling, 50);
      setTimeout(applyConsistentStyling, 300); // Additional check after transition
    });
  });
  
  // Function to apply consistent styling
  function applyConsistentStyling() {
    // Set explicit styles to override any inherited/computed styles
    if (topbar) {
      topbar.style.mixBlendMode = 'normal';
      topbar.style.isolation = 'isolate';
      topbar.style.zIndex = '1000';
    }
    
    if (logo) {
      logo.style.mixBlendMode = 'normal';
      logo.style.opacity = '1';
    }
    
    if (ctaPill) {
      ctaPill.style.mixBlendMode = 'normal';
      ctaPill.style.opacity = '1';
      ctaPill.style.backgroundColor = '#0c8a43';
      ctaPill.style.color = 'white';
    }
    
    hamburgerSpans.forEach(span => {
      span.style.mixBlendMode = 'normal';
      span.style.backgroundColor = 'white';
      span.style.opacity = '1';
    });
  }
});
