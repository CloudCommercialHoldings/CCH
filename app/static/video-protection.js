// Disable right-click and context menu on videos
document.addEventListener('DOMContentLoaded', function() {
  // Get all video elements
  const videos = document.querySelectorAll('video');
  
  // Add event listeners to prevent interaction
  videos.forEach(video => {
    // Prevent right-click context menu
    video.addEventListener('contextmenu', e => {
      e.preventDefault();
      return false;
    });
    
    // Prevent dragging
    video.addEventListener('dragstart', e => {
      e.preventDefault();
      return false;
    });
    
    // Additional safeguard to ensure videos stay muted
    video.muted = true;
    
    // Handle any click attempts
    video.addEventListener('click', e => {
      e.preventDefault();
      return false;
    });
  });
});
