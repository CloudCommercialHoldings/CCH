// Team tiles navigation
document.addEventListener('DOMContentLoaded', function() {
  // Handle team tile clicks
  const teamTiles = document.querySelectorAll('.team-tile');
  
  teamTiles.forEach(tile => {
    tile.addEventListener('click', function() {
      const personId = this.getAttribute('data-person');
      
      if (personId === 'jeff-kessie') {
        // Navigate to Jeff's detail page
        window.location.href = '/jeff-kessie';
      } else if (personId === 'coming-soon') {
        // Show coming soon message or redirect to careers
        alert('More team members coming soon! We\'re growing our team.');
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
