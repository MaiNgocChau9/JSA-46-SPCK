import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyA6nRUwDozn7hYsRbqGXAtWwm1QU09Umwk";
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 0.8,
  topP: 0.5,
  topK: 1,
  maxOutputTokens: 8192,
};

// Hàm điều khiển loading screen
function showLoading() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.add('active');
}

function hideLoading() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.remove('active');
}

async function getGameData(userInput) {
  const prompt = `
Yêu cầu người dùng: \"${userInput}\".
Tạo ra một đoạn văn bản JSON chứa thông tin về một tựa game theo yêu cầu, phù hợp để chèn vào một trang web HTML. Thông tin cần bao gồm:

* **title (tiêu đề):** Tiêu đề hấp dẫn và ngắn gọn của game (bằng tiếng Việt).
* **image (ảnh):** https://www.digitallydownloaded.net/wp-content/uploads/2023/05/Mirthwood-key-art.jpg
* **genres (thể loại):**  Mảng các thể loại game (ví dụ: ["RPG", "Phiêu Lưu", "Hành động", "Thế giới mở"]).
* **description (phần mô tả, giới thiệu):** Mô tả chi tiết nhất có thể, hấp dẫn về game (bằng tiếng Việt), nhấn mạnh vào các điểm nổi bật và gameplay. Giới thiệu về cốt truyện, mục tiêu của game. Có thể xuống dòng thành nhiều đoạn khác nhau, ghi thật chi tiết, thật dài, dùng \`<br><br>\` để xuống dòng, không xuống nhiều hơn 2 lần ( ví dụ: \`<br><br><br>\`)
* **features (tính năng):** Một mảng các đối tượng, mỗi đối tượng chứa \`icon\` (biểu tượng font awesome hoặc bootstrap icon -  ví dụ: "bi bi-person-circle icon", "bi bi-book-half icon"), \`info\` (ví dụ: "Thế giới mở rộng lớn", "Hệ thống chiến đấu đa dạng", "Câu chuyện hấp dẫn", "Tùy chỉnh nhân vật" (tính năng mô tả ngắn gọn)).
* **system_requirements (yêu cầu hệ thống khuyến nghị):**  Một mảng các đối tượng, mỗi đối tượng chứa \`icon\` (biểu tượng font awesome hoặc bootstrap icon -  ví dụ: "bi bi-windows", "bi bi-memory"), \`name\` (tên yêu cầu - ví dụ: "Hệ điều hành") và \`value\` (giá trị yêu cầu - ví dụ: "Windows 10 64-bit").
* **similar_games (game tương tự):** Mảng tên các game tương tự (bằng tiếng Việt). (Có thể để trống nếu không tìm thấy game tương tự phù hợp)

Lưu ý: Hãy chọn một game phổ biến và cung cấp thông tin chính xác và đầy đủ nhất có thể.`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig,
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  let text = response.text();

  // Xử lý markdown code block nếu có
  if (text.trim().startsWith('```') && text.trim().endsWith('```')) {
    const lines = text.trim().split('\n');
    text = lines.slice(1, -1).join('\n');
  }

  // Làm sạch các ký tự điều khiển
  text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Lỗi khi phân tích JSON:", text, error);
    return null;
  }
}

function updateUI(data) {
  const gamePreviewImage = document.querySelector(".game-preview img");
  if (gamePreviewImage && data.image) {
    gamePreviewImage.src = data.image;
    gamePreviewImage.alt = data.title;
  }

  const cardTitle = document.querySelector(".card-title");
  if (cardTitle && data.title) {
    cardTitle.textContent = data.title;
  }

  const genreTagsContainer = document.querySelector(".genre-tags");
  if (genreTagsContainer && data.genres) {
    genreTagsContainer.innerHTML = "";
    data.genres.forEach((genre) => {
      const tag = document.createElement("span");
      tag.classList.add("genre-tag");
      tag.textContent = genre;
      genreTagsContainer.appendChild(tag);
    });
  }

  const description = document.querySelector(".description");
  if (description && data.description) {
    description.innerHTML = data.description;
  }

  const featuresGrid = document.querySelector(".features-grid");
  if (featuresGrid && data.features) {
    featuresGrid.innerHTML = "";
    data.features.forEach((feature) => {
      const featureDiv = document.createElement("div");
      featureDiv.classList.add("feature");
      featureDiv.innerHTML = `
        <i class="${feature.icon}"></i>
        <span>${feature.info}</span>
      `;
      featuresGrid.appendChild(featureDiv);
    });
  }

  const requirementsContainer = document.querySelector(".requirements");
  if (requirementsContainer && data.system_requirements) {
    requirementsContainer.innerHTML = "";
    data.system_requirements.forEach((req) => {
      const reqDiv = document.createElement("div");
      reqDiv.classList.add("requirement");
      reqDiv.innerHTML = `
        <i class="${req.icon} icon"></i>
        <span>${req.name}: ${req.value}</span>
      `;
      requirementsContainer.appendChild(reqDiv);
    });
  }

  const similarGamesContainer = document.querySelector(".similar-games");
  if (similarGamesContainer && data.similar_games && data.similar_games.length > 0) {
    similarGamesContainer.innerHTML = "";
    data.similar_games.forEach((gameName) => {
      const gameDiv = document.createElement("div");
      gameDiv.classList.add("similar-game");
      gameDiv.innerHTML = `
        <img src="https://placehold.co/100x100" alt="${gameName}">
        <p>${gameName}</p>
      `;
      similarGamesContainer.appendChild(gameDiv);
    });
  }
}

// Khởi tạo ứng dụng
async function initializeApp() {
  const searchValue = localStorage.getItem("searchValue");
  if (searchValue) {
    try {
      showLoading();
      const data = await getGameData(searchValue);
      if (data) {
        updateUI(data);
      } else {
        console.error("Không thể lấy dữ liệu game.");
        // Có thể thêm thông báo lỗi cho người dùng ở đây
      }
    } catch (error) {
      console.error("Lỗi khi gọi API hoặc xử lý dữ liệu:", error);
      // Có thể thêm thông báo lỗi cho người dùng ở đây
    } finally {
      hideLoading();
    }
  } else {
    console.warn("Không tìm thấy từ khóa tìm kiếm trong localStorage.");
    // Có thể thêm xử lý chuyển hướng hoặc thông báo cho người dùng
  }
}

// Khởi chạy ứng dụng
document.addEventListener('DOMContentLoaded', initializeApp);