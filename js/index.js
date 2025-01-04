// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Scroll to Top Button
const scrollTopButton = document.getElementById('scroll-to-top');

// Show/hide scroll-to-top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
});

// Smooth scroll to top
scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Search Form Submit
const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your search logic here
});

// Add smooth hover effect for category cards
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

const userNameSection = document.querySelector(".userNameSection");
const login_register = document.querySelector(".login_register");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
    userNameSection.textContent = currentUser.name;
    userNameSection.classList.remove("d-none"); // Sử dụng class của Bootstrap
    login_register.classList.add("d-none");     // Thay vì dùng style.display
} else {
    userNameSection.textContent = "";
    userNameSection.classList.add("d-none");
    login_register.classList.remove("d-none");
}