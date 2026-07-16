// Pausable carousel script
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.scroll-track');
  const clientsSection = document.getElementById('clients');
  
  // Pause animation when not in viewport
  function handleVisibility() {
    const rect = clientsSection.getBoundingClientRect();
    const isVisible = (
      rect.top < window.innerHeight && 
      rect.bottom > 0
    );
    
    if (isVisible) {
      carousel.style.animationPlayState = 'running';
    } else {
      carousel.style.animationPlayState = 'paused';
    }
  }
  
  // Initial check
  handleVisibility();
  
  // Check on scroll
  window.addEventListener('scroll', handleVisibility);
  
  // Pause on hover (optional)
  carousel.addEventListener('mouseenter', function() {
    carousel.style.animationPlayState = 'paused';
  });
  
  carousel.addEventListener('mouseleave', function() {
    carousel.style.animationPlayState = 'running';
  });
});
