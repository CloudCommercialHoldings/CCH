// Scroll Animation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with scroll-fade class
    const scrollElements = document.querySelectorAll('.scroll-fade');
    
    // Function to check if element is in viewport
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            (rect.top <= (window.innerHeight * 0.8) && rect.bottom >= 100)
        );
    };
    
    // Function to handle scroll animations
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (isElementInViewport(el)) {
                el.classList.add('active');
            }
        });
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initial check on page load
    handleScrollAnimation();
});
