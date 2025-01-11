import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyA6nRUwDozn7hYsRbqGXAtWwm1QU09Umwk";
const genAI = new GoogleGenerativeAI(apiKey);
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1847&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const generationConfig = {
  temperature: 0.8,
  topP: 0.5,
  topK: 1,
  maxOutputTokens: 8192,
};

function showLoading() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.add('active');
}

function hideLoading() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.remove('active');
}

async function fetchGameImage(gameName) {
  try {
    // Try Free-to-game API first
    const ftgResponse = await fetch('https://www.freetogame.com/api/games');
    const ftgData = await ftgResponse.json();
    const ftgGame = ftgData.find(g => g.title.toLowerCase().includes(gameName.toLowerCase()));
    if (ftgGame?.thumbnail) {
      return ftgGame.thumbnail;
    }

    // Try Gamerpower API if Free-to-game doesn't have the image
    const gpResponse = await fetch('https://www.gamerpower.com/api/giveaways');
    const gpData = await gpResponse.json();
    const gpGame = gpData.find(g => g.title.toLowerCase().includes(gameName.toLowerCase()));
    if (gpGame?.image) {
      return gpGame.image;
    }

    // Return default image if no matches found
    return DEFAULT_IMAGE;
  } catch (error) {
    console.error("Error fetching game image:", error);
    return DEFAULT_IMAGE;
  }
}

async function getGameData(userInput) {
  const prompt = `
Yêu cầu người dùng: \"${userInput}\".
Tạo ra một đoạn văn bản JSON chứa thông tin về một tựa game theo yêu cầu, phù hợp để chèn vào một trang web HTML. Thông tin cần bao gồm:

* **title (tiêu đề):** Tiêu đề hấp dẫn và ngắn gọn của game (bằng tiếng Việt).
* **image (ảnh):** Tên của tựa game (Ngắn gọn)
* **genres (thể loại):**  Mảng các thể loại game (ví dụ: ["RPG", "Phiêu Lưu", "Hành động", "Thế giới mở"]).
* **description (phần mô tả, giới thiệu):** Mô tả chi tiết nhất có thể, hấp dẫn về game (bằng tiếng Việt), nhấn mạnh vào các điểm nổi bật và gameplay. Giới thiệu về cốt truyện, mục tiêu của game. Có thể xuống dòng thành nhiều đoạn khác nhau, ghi thật chi tiết, thật dài, dùng \`<br><br>\` để xuống dòng, không xuống nhiều hơn 2 lần ( ví dụ: \`<br><br><br>\`)
* **features (tính năng):** Một mảng các đối tượng, mỗi đối tượng chứa \`icon\` (biểu tượng font awesome free hoặc bootstrap icon -  ví dụ: "bi bi-person-circle icon", "bi bi-book-half icon"), \`info\` (ví dụ: "Thế giới mở rộng lớn", "Hệ thống chiến đấu đa dạng", "Câu chuyện hấp dẫn", "Tùy chỉnh nhân vật" (tính năng mô tả ngắn gọn)).
* **system_requirements (yêu cầu hệ thống khuyến nghị):**  Một mảng các đối tượng, mỗi đối tượng chứa \`icon\` (biểu tượng font awesome hoặc bootstrap icon -  ví dụ: "bi bi-windows", "bi bi-memory"), \`name\` (tên yêu cầu - ví dụ: "Hệ điều hành") và \`value\` (giá trị yêu cầu - ví dụ: "Windows 10 64-bit").
* **similar_games (game tương tự):** Mảng các đối tượng game tương tự, mỗi đối tượng chứa:
  * \`name\`: Tên game
  * \`icon\`: Biểu tượng phù hợp với game (sử dụng Font Awesome hoặc Bootstrap Icons, ví dụ: "bi bi-controller" cho game hành động, "fa-solid fa-dragon" cho game nhập vai, "bi bi-trophy" cho game thể thao)

Lưu ý:
* Hãy chọn một game phổ biến và cung cấp thông tin chính xác và đầy đủ nhất có thể.
* Nếu không tìm ra icon phù hợp, hãy để icon là: \`fa-solid fa-gamepad\`.

Ví dụ về JSON mong muốn:
{
  "title": "The Legend of Zelda: Breath of the Wild",
  "image": "The Legend of Zelda",
  "genres": ["RPG", "Phiêu Lưu", "Hành động", "Thế giới mở"],
  "singleplayer": true,
  "description": "Khám phá vùng đất Hyrule rộng lớn và đầy bí ẩn trong vai Link.\nGiải những câu đố, chiến đấu với quái vật và tìm cách đánh bại Calamity Ganon.",
  "features": ["Thế giới mở rộng lớn", "Hệ thống chiến đấu linh hoạt", "Câu chuyện hấp dẫn", "Tùy chỉnh trang bị"],
  "system_requirements": [
    {"icon": "bi bi-windows", "name": "Hệ điều hành", "value": "Windows 10 64-bit"},
    {"icon": "bi bi-memory", "name": "RAM", "value": "8GB"},
    {"icon": "bi bi-gpu-card", "name": "Card đồ họa", "value": "NVIDIA GeForce GTX 750"}
  ],
  "similar_games": [
    {
      "name": "Dota 2",
      "icon": "fa-solid fa-users"
    },
    {
      "name": "Heroes of the Storm",
       "icon": "fa-solid fa-shield-halved"
    },
    {
      "name": "Mobile Legends: Bang Bang",
      "icon": "fa-solid fa-mobile-screen-button"
    }
  ]
}
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig,
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  let text = response.text();

  if (text.trim().startsWith('```') && text.trim().endsWith('```')) {
    const lines = text.trim().split('\n');
    text = lines.slice(1, -1).join('\n');
  }

  text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  try {
    const data = JSON.parse(text);
    // Fetch game image using the image name from the response
    if (data.image) {
      data.imageUrl = await fetchGameImage(data.image);
    } else {
      data.imageUrl = DEFAULT_IMAGE;
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi phân tích JSON:", text, error);
    return null;
  }
}

function updateUI(data) {
  const gamePreviewImage = document.querySelector(".game-preview img");
  if (gamePreviewImage) {
    gamePreviewImage.src = data.imageUrl || DEFAULT_IMAGE;
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

  // Update the similar games section in updateUI function
  const similarGamesContainer = document.querySelector(".similar-games");
  if (similarGamesContainer && data.similar_games && data.similar_games.length > 0) {
    similarGamesContainer.innerHTML = "";
    data.similar_games.forEach((game) => {
      const gameDiv = document.createElement("div");
      gameDiv.classList.add("similar-game-card");
      gameDiv.innerHTML = `
        <div class="similar-game-icon">
          <i class="${game.icon}"></i>
        </div>
        <div class="similar-game-info">
          <h4>${game.name}</h4>
        </div>
      `;
      similarGamesContainer.appendChild(gameDiv);
    });
  }
}

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
      }
    } catch (error) {
      console.error("Lỗi khi gọi API hoặc xử lý dữ liệu:", error);
    } finally {
      hideLoading();
    }
  } else {
    console.warn("Không tìm thấy từ khóa tìm kiếm trong localStorage.");
  }
}

initializeApp();