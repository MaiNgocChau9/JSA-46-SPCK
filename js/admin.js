// Kiểm tra người dùng có phải admin không, nếu không thì chuyển về trang chủ
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "ADMIN") {
  window.location.href = "../index.html";
}

// Theme handling
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const lightIcon = document.querySelector(".theme-icon-light");
  const darkIcon = document.querySelector(".theme-icon-dark");

  if (theme === "dark") {
    lightIcon.style.display = "none";
    darkIcon.style.display = "block";
  } else {
    lightIcon.style.display = "block";
    darkIcon.style.display = "none";
  }
}

// User role management
const roleModal = new bootstrap.Modal(document.getElementById("roleModal"));
let selectedUserEmail = null;
const usersData = JSON.parse(localStorage.getItem("users")) || [];

// Load and display users
function displayUsers() {
  const tableBody = document.querySelector(".accounts-table tbody");
  const searchInput = document.querySelector(".search-input");

  let filteredUsers = [...usersData];

  // Apply search
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
  }

  // Clear existing rows
  tableBody.innerHTML = "";

  // Add filtered users to table
  filteredUsers.forEach((user) => {
    const row = `
                    <tr>
                        <td>
                            <div class="user-info">
                                <span>${user.name}</span>
                            </div>
                        </td>
                        <td>${user.email}</td>
                        <td>
                            <span class="role-badge role-${user.role.toLowerCase()}">${
      user.role
    }</span>
                        </td>
                        <td>
                            <button class="role-toggle-btn" data-email="${
                              user.email
                            }" title="Chuyển đổi vai trò">
                                <i class="fas fa-exchange-alt"></i>
                                Chuyển vai trò
                            </button>
                        </td>
                    </tr>
                `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });

  // Reattach event listeners to new buttons
  attachRoleToggleListeners();
}

// Handle role options in modal
const roleOptions = document.querySelectorAll(".role-option");
roleOptions.forEach((option) => {
  option.addEventListener("click", function () {
    roleOptions.forEach((opt) => opt.classList.remove("selected"));
    this.classList.add("selected");
  });
});

// Handle role toggle
function attachRoleToggleListeners() {
  const roleButtons = document.querySelectorAll(".role-toggle-btn");
  roleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      selectedUserEmail = this.dataset.email;
      const user = usersData.find((u) => u.email === selectedUserEmail);

      // Pre-select current role in modal
      roleOptions.forEach((option) => {
        if (option.dataset.role === user.role) {
          option.classList.add("selected");
        } else {
          option.classList.remove("selected");
        }
      });

      roleModal.show();
    });
  });
}

// Handle save role changes
document
  .getElementById("saveRoleButton")
  .addEventListener("click", function () {
    const selectedRole = document.querySelector(".role-option.selected");
    if (selectedRole && selectedUserEmail) {
      const newRole = selectedRole.dataset.role;
      const userIndex = usersData.findIndex(
        (u) => u.email === selectedUserEmail
      );

      if (userIndex !== -1) {
        // Update role
        usersData[userIndex].role = newRole;

        // Update localStorage
        localStorage.setItem("users", JSON.stringify(usersData));

        // Update current user if the changed user is logged in
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.email === selectedUserEmail) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify(usersData[userIndex])
          );
        }

        // Refresh display and close modal
        displayUsers();
        roleModal.hide();
      }
    }
  });

const userNameSection = document.querySelector(".userNameSection");
const login_register = document.querySelector(".login_register");

if (currentUser && window.innerWidth < 991) {
  userNameSection.textContent = "Đăng xuất";
  userNameSection.classList.remove("d-none");
  login_register.classList.add("d-none");
}
// Here
else if (currentUser) {
  userNameSection.textContent = `✦ ${currentUser.name} ✦`;
  userNameSection.classList.remove("d-none");
  login_register.classList.add("d-none");
} else {
  userNameSection.textContent = "";
  userNameSection.classList.add("d-none");
  login_register.classList.remove("d-none");
}

userNameSection.addEventListener("click", () => {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
  }
});

userNameSection.addEventListener("mouseover", () => {
  userNameSection.textContent = "Đăng xuất";
});

userNameSection.addEventListener("mouseout", () => {
  if (currentUser && window.innerWidth > 992) {
    userNameSection.textContent = `✦ ${currentUser.name} ✦`;
  } else if (currentUser) {
    userNameSection.textContent = "Đăng xuất";
  }
});

// Search and filter functionality
document.querySelector(".search-input").addEventListener("input", displayUsers);

// Initial display
displayUsers();
