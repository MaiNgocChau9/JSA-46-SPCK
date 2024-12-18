// Thêm vào đầu file
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Kiểm tra theme đã lưu
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.add(`${savedTheme}-mode`);
updateThemeIcon();

// Xử lý chuyển đổi theme
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    
    // Lưu theme vào localStorage
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    
    updateThemeIcon();
});

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
}

// Thêm vào cuối file để kích hoạt/vô hiệu hóa nút gửi
const inputField = document.getElementById('input');
const sendButton = document.getElementById('send');

inputField.addEventListener('input', () => {
    sendButton.disabled = !inputField.value.trim() && !uploadedImage;
});