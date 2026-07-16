/**
 * Makes entire service cards clickable to their respective service pages
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get all service cards
  const serviceCards = document.querySelectorAll('.service-card');
  
  // Make each card clickable
  serviceCards.forEach(card => {
    // Find the link inside the card
    const link = card.querySelector('h4 a');
    
    if (link) {
      const targetHref = link.getAttribute('href');
      
      // Add the URL as a data attribute to the card
      card.setAttribute('data-href', targetHref);
      
      // Add click event listener to the whole card
      card.addEventListener('click', function(e) {
        // Don't trigger if the actual link was clicked (allow normal link behavior)
        if (e.target === link || link.contains(e.target)) {
          return;
        }
        
        // Navigate to the service page
        window.location.href = targetHref;
      });
      
      // Add appropriate cursor style and accessibility attributes
      card.classList.add('is-clickable');
      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', link.textContent + ' - Click to learn more');
      card.setAttribute('tabindex', '0');
      
      // Add keyboard accessibility - trigger on Enter or Space
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = targetHref;
        }
      });
    }
  });
});
