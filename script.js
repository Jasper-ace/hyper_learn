// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger number counting animation for trainer stats
            if (entry.target.classList.contains('trainer-text-card')) {
                animateNumbers(entry.target);
            }
        }
    });
}, observerOptions);

// Number counting animation function
function animateNumbers(container) {
    const statNumbers = container.querySelectorAll('.stat-number[data-target]');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format the number with commas for thousands
            const formattedNumber = Math.floor(current).toLocaleString();
            stat.textContent = formattedNumber + '+';
        }, 16);
    });
}

// Observe all scroll-fade elements
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.scroll-fade');
    scrollElements.forEach(el => observer.observe(el));
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intelligent Header Behavior
let lastScrollTop = 0;
const header = document.querySelector('header');
const scrollThreshold = 200;

// Clean up entrance animation to allow smooth transitions
header.addEventListener('animationend', () => {
    header.style.animation = 'none';
    header.style.opacity = '1';
    header.style.transform = 'translateY(0)';
}, { once: true });

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Handle Navbar Hide/Show
    if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
            // Scrolling Down
            header.classList.add('nav-up');
        } else {
            // Scrolling Up
            header.classList.remove('nav-up');
        }
    } else {
        // At the top
        header.classList.remove('nav-up');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling

    // Handle Header Background/Shadow
    if (scrollTop > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
        header.style.boxShadow = '0 4px 20px rgba(95,1,2,0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 10px rgba(95,1,2,0.1)';
    }

    // Hero Parallax Effect
    const heroBg = document.querySelector('.hero-parallax-bg');
    if (heroBg && scrollTop < window.innerHeight) {
        // Only run when hero is visible
        window.requestAnimationFrame(() => {
            const speed = 0.5;
            heroBg.style.transform = `translate3d(0, ${scrollTop * speed}px, 0)`;
        });
    }

    // Brand Promise Parallax Effect
    const brandPromise = document.querySelector('.brand-promise-section');
    if (brandPromise) {
        const rect = brandPromise.getBoundingClientRect();
        // Check if section is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            window.requestAnimationFrame(() => {
                const speed = 0.3;
                // Calculate position relative to the element's position in the document
                // As we scroll down, we want the background to move down slower than the page (standard parallax)
                // rect.top is the distance from the top of the viewport
                const yPos = (rect.top * speed);
                brandPromise.style.backgroundPosition = `center ${yPos}px`;
            });
        }
    }
});
// Parallax effect for floating elements
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.floating-shape');
    const particles = document.querySelectorAll('.floating-particle');

    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 20;
        const y = (mouseY - 0.5) * speed * 20;

        shape.style.transform = `translate(${x}px, ${y}px)`;
    });

    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.3;
        const x = (mouseX - 0.5) * speed * 15;
        const y = (mouseY - 0.5) * speed * 15;

        particle.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Hero Slideshow
function startSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const interval = 5000; // 5 seconds per slide

    setInterval(() => {
        // Remove active from current
        slides[currentSlide].classList.remove('active');

        // Calculate next
        currentSlide = (currentSlide + 1) % slides.length;

        // Add active to next
        slides[currentSlide].classList.add('active');
    }, interval);
}

// Start slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    startSlideshow();

    // Mobile Menu Toggle logic
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('menu-overlay');
        document.body.appendChild(overlay);
    }

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            menuBtn.classList.toggle('active'); // Toggle animation state
        });

        // Close when clicking overlay
        overlay.addEventListener('click', () => {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            menuBtn.classList.remove('active');
        });

        // Close when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                overlay.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
});