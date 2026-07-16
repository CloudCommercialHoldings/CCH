// Person detail page navigation and interactions
document.addEventListener('DOMContentLoaded', function() {
  // Bio section navigation
  const navItems = document.querySelectorAll('.nav-item');
  const bioSections = document.querySelectorAll('.bio-section');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      
      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      
      // Show target section
      bioSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetId) {
          section.classList.add('active');
        }
      });
      
      // Smooth scroll to content (optional)
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Intersection observer for auto-updating nav
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        navItems.forEach(nav => {
          nav.classList.remove('active');
          if (nav.getAttribute('href') === `#${sectionId}`) {
            nav.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  bioSections.forEach(section => {
    observer.observe(section);
  });
  
  // Add some entrance animations
  const hero = document.querySelector('.person-hero');
  const bioContent = document.querySelector('.bio-content');
  
  if (hero) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      hero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
    }, 100);
  }
  
  if (bioContent) {
    setTimeout(() => {
      bioContent.style.opacity = '0';
      bioContent.style.transform = 'translateY(30px)';
      bioContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      
      setTimeout(() => {
        bioContent.style.opacity = '1';
        bioContent.style.transform = 'translateY(0)';
      }, 100);
    }, 300);
  }
});
