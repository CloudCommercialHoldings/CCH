// Team tiles navigation
document.addEventListener('DOMContentLoaded', function() {
  // Handle team tile clicks
  const teamTiles = document.querySelectorAll('.team-tile');
  
  teamTiles.forEach(tile => {
    tile.addEventListener('click', function() {
      // Each tile carries its own link in data-href (set in about.html),
      // so adding a new team member never needs a JS change.
      const href = this.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });
    
    // Add keyboard support
    tile.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
    
    // Make tiles focusable
    tile.setAttribute('tabindex', '0');
  });
  
  // Add loading animation
  const teamSection = document.querySelector('.team-section');
  if (teamSection) {
    teamSection.classList.remove('loading');
  }
});
