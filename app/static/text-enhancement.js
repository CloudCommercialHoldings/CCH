// Enhanced text visibility effect
document.addEventListener('DOMContentLoaded', function() {
  // Add subtle animation to the background elements for visual depth
  const bgElements = document.querySelectorAll('.text-bg');
  
  // Only apply if user doesn't prefer reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Much more subtle animation for the background elements
    bgElements.forEach((bg, index) => {
      setTimeout(() => {
        bg.animate([
          { opacity: 0.15, filter: 'blur(70px)' },
          { opacity: 0.2, filter: 'blur(60px)' },
          { opacity: 0.15, filter: 'blur(70px)' }
        ], {
          duration: 5000,
          iterations: Infinity,
          easing: 'ease-in-out',
          delay: index * 500
        });
      }, 1200);
    });
  }
});
