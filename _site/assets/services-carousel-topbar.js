/**
 * Fullpage Services Carousel - fixes for the topbar navigation
 * This file ensures the topbar matches the hero page style and prevents color tinting.
 */

document.addEventListener('DOMContentLoaded', () => {
  const topbar = document.querySelector('.topbar');
  
  // Make sure the topbar has hero page styling
  if (topbar) {
    // Force transparent styling and remove any solid styling
    topbar.classList.add('topbar--transparent');
    topbar.classList.remove('topbar--solid');
    topbar.style.setProperty('--topbarOpacity', '0');
    
    // Ensure no blending effects affect the topbar
    topbar.style.mixBlendMode = 'normal';
    topbar.style.isolation = 'isolate';
    
    // Force consistent styling on child elements
    const logo = topbar.querySelector('.logo-mark-img');
    const ctaPill = topbar.querySelector('.cta-pill');
    const hamburgerBars = topbar.querySelectorAll('.hamburger span');
    
    if (logo) logo.style.filter = 'brightness(1.5)';
    
    if (ctaPill) {
      ctaPill.style.backgroundColor = '#0c8a43';
      ctaPill.style.color = 'white';
      ctaPill.style.border = '2px solid rgba(255, 255, 255, 0.2)';
    }
    
    if (hamburgerBars) {
      hamburgerBars.forEach(bar => {
        bar.style.backgroundColor = 'white';
      });
    }
  }

  // Keep topbar transparent and styled consistently even on scroll and slide changes
  document.addEventListener('scroll', () => {
    if (topbar) {
      // Ensure it stays transparent
      topbar.classList.add('topbar--transparent');
      topbar.classList.remove('topbar--solid');
      topbar.style.setProperty('--topbarOpacity', '0');
    }
  });
});
