// Tạo một danh sách các đối tượng người dùng
const users = [
  {
    name: "Admin 1",  // Tên người dùng là Admin 1
    email: "admin1@admin.com",  // Email của người dùng
    password: "123456",  // Mật khẩu của người dùng
    role: "ADMIN",  // Vai trò của người dùng là ADMIN
  },
  {
    name: "Nguyen Van A",  // Tên người dùng là Nguyen Van A
    email: "nguyenvana@gmail.com",  // Email của người dùng
    password: "123456",  // Mật khẩu của người dùng
    role: "USER",  // Vai trò của người dùng là USER
  },
];

// Kiểm tra xem có dữ liệu người dùng trong localStorage chưa
if (!localStorage.getItem("users")) {
  // Nếu chưa có, lưu danh sách người dùng (users) vào localStorage dưới dạng chuỗi JSON
  localStorage.setItem("users", JSON.stringify(users));
}

// Thêm sự kiện lắng nghe (event listener) cho form có ID là "loginForm"
// Khi người dùng submit (gửi) form, sẽ thực hiện hàm này
document.getElementById("loginForm").addEventListener("submit", function (e) {
  // Ngăn chặn hành động mặc định của form (không reload trang khi submit)
  e.preventDefault();

  // Lấy danh sách người dùng từ localStorage và chuyển nó về đối tượng JS
  const usersLocalStorage = JSON.parse(localStorage.getItem("users"));

  // Lấy giá trị từ input email và password trong form và loại bỏ khoảng trắng thừa
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Tìm người dùng trong localStorage có email trùng với email mà người dùng nhập vào
  // `filter` trả về mảng nên chọn phần tử đầu tiên [0]
  const foundUser = usersLocalStorage.filter((user) => user.email === email)[0];
  console.log(foundUser)

  // Nếu tìm thấy người dùng
  if (foundUser) {
    // Kiểm tra mật khẩu người dùng nhập có khớp với mật khẩu trong localStorage không
    if (foundUser.password === password) {
      // Nếu đúng, lưu thông tin người dùng hiện tại (currentUser) vào localStorage
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      // Thông báo đăng nhập thành công
      alert("Đăng nhập thành công!");
      // Điều hướng người dùng sang trang 'view.html'
      window.location.href = "../index.html";
    } else {
      // Nếu mật khẩu sai, hiện thông báo lỗi
      alert("Sai thông tin đăng nhập, vui lòng kiểm tra lại!");
      return;
    }
  } else {
    // Nếu không tìm thấy người dùng có email khớp, hiện thông báo lỗi
    alert("Người dùng không tồn tại trên hệ thống, vui lòng đăng ký!");
    return;
  }
});