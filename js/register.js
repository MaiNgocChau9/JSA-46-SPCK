document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // validate form
    if (password !== confirmPassword) {
      alert("Mật khẩu không trùng khớp, vui lòng thử lại!");
      return;
    } else if (password.length < 6) {
      alert("Mật khẩu phải có tối thiểu 6 kí tự");
      return;
    }

    // lay du lieu tu local storage
    const usersLocalStorage = JSON.parse(localStorage.getItem("users"));
    // Check if user already exists
    if (usersLocalStorage.find((u) => u.email === email)) {
      alert("Người với email này đã tồn tại");
      return;
    }
    // Add new user
    usersLocalStorage.push({
      name: name,
      email: email,
      password: password,
      role: "USER",
    });

    // Save updated users array to localStorage
    localStorage.setItem("users", JSON.stringify(usersLocalStorage));

    alert("Đăng ký thành công! Vui lòng đăng nhập");
    window.location.href = "./login.html";
  });
