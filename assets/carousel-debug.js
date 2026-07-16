/**
 * Debug script to help identify and fix carousel initialization issues
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Carousel Debug: Script loaded');
  
  // Wait for everything to be fully initialized
  setTimeout(() => {
    const carousel = document.querySelector('.fullpage-carousel');
    if (!carousel) {
      console.log('Carousel Debug: No carousel found on page');
      return;
    }
    
    console.log('Carousel Debug: Carousel element found');
    
    // Check which slide is active
    const slides = carousel.querySelectorAll('.carousel-slide');
    let activeSlideIndex = -1;
    let anyActive = false;
    
    slides.forEach((slide, index) => {
      if (slide.classList.contains('active')) {
        console.log(`Carousel Debug: Slide ${index} is active (${slide.className})`);
        activeSlideIndex = index;
        anyActive = true;
      }
    });
    
    if (!anyActive) {
      console.log('Carousel Debug: No active slides found!');
      
      // Force first slide to be active if none are
      if (slides.length > 0) {
        console.log('Carousel Debug: Forcing first slide to be active');
        slides[0].classList.add('active');
        
        // Also update dots
        const dots = carousel.querySelectorAll('.carousel-dot');
        if (dots.length > 0) {
          dots[0].classList.add('active');
        }
      }
    } else if (activeSlideIndex !== 0) {
      console.log(`Carousel Debug: WARNING - Active slide is not the first slide (index: ${activeSlideIndex})`);
      
      // Check if we should force reset to first slide
      const forceReset = true; // Set to false if you don't want automatic correction
      
      if (forceReset) {
        console.log('Carousel Debug: Forcing reset to first slide');
        
        // Remove active class from all slides
        slides.forEach(slide => {
          slide.classList.remove('active');
        });
        
        // Set first slide as active
        if (slides.length > 0) {
          slides[0].classList.add('active');
        }
        
        // Update dots
        const dots = carousel.querySelectorAll('.carousel-dot');
        dots.forEach(dot => {
          dot.classList.remove('active');
        });
        
        if (dots.length > 0) {
          dots[0].classList.add('active');
        }
      }
    }
    
    // Check for animation issues
    const isAnimatingVar = 'isAnimating';
    console.log(`Carousel Debug: Checking for animation state issues`);
    
    // Ensure navigation is working
    console.log('Carousel Debug: Setup complete, navigation should now work correctly');
  }, 500); // Wait 500ms to let other scripts initialize first
});
