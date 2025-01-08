import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyA6nRUwDozn7hYsRbqGXAtWwm1QU09Umwk"; // Thay YOUR_API_KEY bằng API key của bạn
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 0.5,
  topP: 0.3,
  topK: 1,
  maxOutputTokens: 8192,
};

async function getGameData(userInput) {
  const prompt = `
Yêu cầu người dùng: \"${userInput}\".
Tạo ra một đoạn văn bản JSON chứa thông tin về một tựa game theo yêu cầu, phù hợp để chèn vào một trang web HTML. Thông tin cần bao gồm:

* **title (tiêu đề):** Tiêu đề hấp dẫn và ngắn gọn của game (bằng tiếng Việt).
* **image (ảnh):** https://www.digitallydownloaded.net/wp-content/uploads/2023/05/Mirthwood-key-art.jpg
* **genres (thể loại):**  Mảng các thể loại game (ví dụ: ["RPG", "Phiêu Lưu", "Hành động", "Thế giới mở"]).
* **description (phần mô tả, giới thiệu):** Mô tả chi tiết nhất có thể, hấp dẫn về game (bằng tiếng Việt), nhấn mạnh vào các điểm nổi bật và gameplay. Giới thiệu về cốt truyện, mục tiêu của game. Có thể xuống dòng thành nhiều đoạn khác nhau, ghi thật chi tiết, thật dài, dùng \`\n\` để xuống dòng, không xuống nhiều hơn 1 lần \`\n\n\`
* **features (tính năng):** Một mảng các đối tượng, mỗi đối tượng chứa \`icon\` (biểu tượng font awesome hoặc bootstrap icon -  ví dụ: "bi bi-person-circle icon", "bi bi-book-half icon"), \`info\` (ví dụ: "Thế giới mở rộng lớn", "Hệ thống chiến đấu đa dạng", "Câu chuyện hấp dẫn", "Tùy chỉnh nhân vật" (tính năng mô tả ngắn gọn)).
* **system_requirements (yêu cầu hệ thống khuyến nghị):**  Một mảng các đối tượng, mỗi đối tượng chứa \`icon\` (biểu tượng font awesome hoặc bootstrap icon -  ví dụ: "bi bi-windows", "bi bi-memory"), \`name\` (tên yêu cầu - ví dụ: "Hệ điều hành") và \`value\` (giá trị yêu cầu - ví dụ: "Windows 10 64-bit").
* **similar_games (game tương tự):** Mảng tên các game tương tự (bằng tiếng Việt). (Có thể để trống nếu không tìm thấy game tương tự phù hợp)

Lưu ý: Hãy chọn một game phổ biến và cung cấp thông tin chính xác và đầy đủ nhất có thể. Nếu không tìm thấy hình ảnh phù hợp, hãy sử dụng placeholder image URL. Sử dụng Markdown JSON.


Ví dụ về JSON mong muốn (không sử dụng định dạng markdown code block JSON trong phản hồi):

{
  "title": "The Legend of Zelda: Breath of the Wild",
  "image": "https://www.digitallydownloaded.net/wp-content/uploads/2023/05/Mirthwood-key-art.jpg",
  "genres": ["RPG", "Phiêu Lưu", "Hành động", "Thế giới mở"],
  "singleplayer": true,
  "description": "Khám phá vùng đất Hyrule rộng lớn và đầy bí ẩn trong vai Link.\nGiải những câu đố, chiến đấu với quái vật và tìm cách đánh bại Calamity Ganon.",
  "features": ["Thế giới mở rộng lớn", "Hệ thống chiến đấu linh hoạt", "Câu chuyện hấp dẫn", "Tùy chỉnh trang bị"],
  "system_requirements": [
    {"icon": "bi bi-windows", "name": "Hệ điều hành", "value": "Windows 10 64-bit"},
    {"icon": "bi bi-memory", "name": "RAM", "value": "8GB"},
    {"icon": "bi bi-gpu-card", "name": "Card đồ họa", "value": "NVIDIA GeForce GTX 750"}
  ],
  "similar_games": ["Elden Ring", "Genshin Impact", "Horizon Zero Dawn"]
}

Lưu ý:  Hãy chọn một game thế giới mở phổ biến và cung cấp thông tin chính xác và đầy đủ nhất có thể.  Nếu không tìm thấy hình ảnh phù hợp, hãy sử dụng placeholder image URL. Không sử dụng markdown JSON trong phản hồi. Chỉ sử dụng văn bản thuần. !Không sử dụng markdown code block như \`\`\`json hay \`\`\`
Nghiêm cấm sử dụng markdown trong phản hồi. Chỉ sử dụng văn bản thuần. !Không sử dụng markdown code block như \`\`\`json hay \`\`\`
`;
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Nghiêm cấm sử dụng markdown trong phản hồi. Chỉ sử dụng văn bản thuần. !Không sử dụng markdown code block như \````json\` hay \````\`",
    generationConfig,
  });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Lỗi khi phân tích JSON:", text, error);
    return null;
  }
}

const searchValue = localStorage.getItem("searchValue");
if (searchValue) {
  getGameData(searchValue)
    .then((data) => {
      if (data) {
        updateUI(data);
      } else {
        console.error("Không thể lấy dữ liệu game.");
        // Hiển thị thông báo lỗi cho người dùng nếu cần
      }
    })
    .catch((error) => {
      console.error("Lỗi khi gọi API hoặc xử lý dữ liệu:", error);
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    });
} else {
  console.warn("Không tìm thấy từ khóa tìm kiếm trong localStorage.");
  // Hiển thị thông báo hoặc thực hiện hành động mặc định nếu không có searchValue
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
    description.innerHTML = data.description.replace(/\n/g, "<br>");
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
  if (similarGamesContainer && data.similar_games) {
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
