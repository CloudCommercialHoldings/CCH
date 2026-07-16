/**
 * Makes entire carousel slides clickable to their respective service pages
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get all carousel slides
  const carouselSlides = document.querySelectorAll('.carousel-slide');
  
  // Make each slide clickable
  carouselSlides.forEach(slide => {
    // Find the CTA link inside the slide
    const ctaLink = slide.querySelector('.slide-cta');
    
    if (ctaLink) {
      const targetHref = ctaLink.getAttribute('href');
      
      // Add the URL as a data attribute to the slide
      slide.setAttribute('data-href', targetHref);
      
      // Create an invisible overlay for clicking
      // We use this approach instead of a click handler on the slide
      // to avoid interfering with the carousel navigation
      const clickOverlay = document.createElement('div');
      clickOverlay.className = 'slide-click-overlay';
      clickOverlay.setAttribute('aria-hidden', 'true');
      clickOverlay.style.position = 'absolute';
      clickOverlay.style.top = '0';
      clickOverlay.style.left = '0';
      clickOverlay.style.width = '100%';
      clickOverlay.style.height = '100%';
      clickOverlay.style.zIndex = '10'; // Below content but above background
      clickOverlay.style.cursor = 'pointer';
      
      // Add click event listener to the overlay
      clickOverlay.addEventListener('click', function(e) {
        // Don't trigger if navigation elements or CTA were clicked
        const isNavElement = e.target.closest('.carousel-arrow, .carousel-dot, .carousel-exit, .slide-cta');
        if (isNavElement) {
          return;
        }
        
        // Navigate to the service page
        window.location.href = targetHref;
      });
      
      // Insert the overlay at the beginning of the slide
      // This ensures it's below other content in the stacking order
      slide.insertBefore(clickOverlay, slide.firstChild);
      
      // Add subtle visual feedback on hover
      const slideContent = slide.querySelector('.slide-content');
      if (slideContent) {
        slide.addEventListener('mouseenter', function() {
          slideContent.style.transform = 'translateY(-5px)';
          slideContent.style.transition = 'transform 0.3s ease';
        });
        
        slide.addEventListener('mouseleave', function() {
          slideContent.style.transform = '';
        });
      }
    }
  });
});
