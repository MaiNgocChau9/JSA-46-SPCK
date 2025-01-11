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

if (currentUser && window.innerWidth < 991){
    userNameSection.textContent = "Đăng xuất";
    userNameSection.classList.remove("d-none");
    login_register.classList.add("d-none");
}
// Here
else if (currentUser) {
    userNameSection.textContent = `✦ ${currentUser.name} ✦`;
    userNameSection.classList.remove("d-none");
    login_register.classList.add("d-none");
}

else {
    userNameSection.textContent = "";
    userNameSection.classList.add("d-none");
    login_register.classList.remove("d-none");
}

userNameSection.addEventListener("click", () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem("currentUser");
        window.location.href = "/";
    }
});

userNameSection.addEventListener('mouseover', () => {
    userNameSection.textContent = 'Đăng xuất';
});

userNameSection.addEventListener('mouseout', () => {
    if (currentUser && window.innerWidth > 992) {
        userNameSection.textContent = `✦ ${currentUser.name} ✦`;
    } else if(currentUser) {
        userNameSection.textContent = "Đăng xuất";
    }
});

let searchButton = document.getElementsByClassName("search-btn");
let searchInput = document.getElementsByClassName("search-input");

searchButton[0].addEventListener("click", () => {
    if (currentUser) {
        if (searchInput[0].value) {
            localStorage.setItem("searchValue", searchInput[0].value);
            window.location.href = "./html/process.html";
        }
    } else {
        alert("Vui lòng đăng nhập để sử dụng tính năng này!");
        window.location.href = "./html/login.html";
    }
});

let exploreButton = document.getElementsByClassName("explore-btn");
exploreButton[0].addEventListener("click", () => {
    if (currentUser) {
        localStorage.setItem("searchValue", "Giới thiệu cho tôi những tựa game bom tấn vừa ra mắt và sắp phát hành");
        window.location.href = "./html/process.html";
    } else {
        alert("Vui lòng đăng nhập để sử dụng tính năng này!");
        window.location.href = "./html/login.html";
    }
});

categoryCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
    
    // Add click handler for category cards
    card.addEventListener('click', () => {
        const categoryTitle = card.querySelector('h3').textContent;
        let searchQuery = '';
        
        switch(categoryTitle) {
            case 'FPS Games':
                searchQuery = 'Giới thiệu về các tựa game FPS phổ biến như Valorant, CS2, Call of Duty';
                break;
            case 'MOBA Games':
                searchQuery = 'Giới thiệu về các tựa game MOBA như League of Legends, Dota 2, Mobile Legends';
                break;
            case 'Action RPG':
                searchQuery = 'Giới thiệu về các tựa game nhập vai hành động như Elden Ring, Dark Souls, God of War';
                break;
            case 'Racing & Sports':
                searchQuery = 'Giới thiệu về các tựa game thể thao và đua xe như Forza Horizon, FIFA 24, NBA 2K24';
                break;
        }
        
        if (searchQuery) {
            if (currentUser) {
                localStorage.setItem('searchValue', searchQuery);
                window.location.href = './html/process.html';
            } else {
                alert('Vui lòng đăng nhập để sử dụng tính năng này!');
                window.location.href = './html/login.html';
            }
        }
    });
});