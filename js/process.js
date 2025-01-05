document.addEventListener('DOMContentLoaded', function() {
    fetch('test.json') // Thay 'your_file.json' bằng tên file JSON của bạn
        .then(response => response.json())
        .then(data => {
            // Cập nhật ảnh preview
            const gamePreviewImage = document.querySelector('.game-preview img');
            if (gamePreviewImage && data.image) {
                gamePreviewImage.src = data.image;
                gamePreviewImage.alt = data.title; // Thêm alt text cho ảnh
            }

            // Cập nhật tiêu đề game
            const cardTitle = document.querySelector('.card-title');
            if (cardTitle && data.title) {
                cardTitle.textContent = data.title;
            }

            // Cập nhật thể loại game
            const genreTagsContainer = document.querySelector('.genre-tags');
            if (genreTagsContainer && data.genres) {
                genreTagsContainer.innerHTML = ''; // Xóa các thể loại cũ
                data.genres.forEach(genre => {
                    const tag = document.createElement('span');
                    tag.classList.add('genre-tag');
                    tag.textContent = genre;
                    genreTagsContainer.appendChild(tag);
                });
            }

            // Cập nhật trạng thái chơi đơn
            const gameStatsContainer = document.querySelector('.game-stats');
            if (gameStatsContainer) {
                gameStatsContainer.innerHTML = ''; // Xóa thông tin cũ
                if (data.singleplayer) {
                    const statDiv = document.createElement('div');
                    statDiv.classList.add('stat');
                    statDiv.innerHTML = `
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <span>Chơi đơn</span>
                    `;
                    gameStatsContainer.appendChild(statDiv);
                }
            }

            // Cập nhật mô tả
            const descriptionSections = document.querySelectorAll('.card-content .section');
            if (descriptionSections.length >= 2 && data.description) {
                descriptionSections[0].querySelector('.section-title').textContent = 'Giới thiệu';
                descriptionSections[0].querySelector('.description').textContent = data.description;
                // Ẩn hoặc xóa section thứ hai (Hành Trình của Bạn) nếu không cần
                if (descriptionSections[1]) {
                    descriptionSections[1].style.display = 'none';
                }
            }

            // Cập nhật tính năng
            const featuresGrid = document.querySelector('.features-grid');
            if (featuresGrid && data.features) {
                featuresGrid.innerHTML = ''; // Xóa các tính năng cũ
                data.features.forEach(featureText => {
                    const featureDiv = document.createElement('div');
                    featureDiv.classList.add('feature');
                    featureDiv.innerHTML = `
                        <i class="bi bi-check-circle-fill icon"></i>
                        <span>${featureText}</span>
                    `;
                    featuresGrid.appendChild(featureDiv);
                });
            }

            // Cập nhật yêu cầu hệ thống
            const requirementsContainer = document.querySelector('.requirements');
            if (requirementsContainer && data.system_requirements) {
                requirementsContainer.innerHTML = ''; // Xóa các yêu cầu cũ
                data.system_requirements.forEach(req => {
                    const reqDiv = document.createElement('div');
                    reqDiv.classList.add('requirement');
                    reqDiv.innerHTML = `
                        <i class="${req.icon} icon"></i>
                        <span>${req.name}: ${req.value}</span>
                    `;
                    requirementsContainer.appendChild(reqDiv);
                });
            }

            // Cập nhật game tương tự (chỉ tên, không có ảnh trong JSON)
            const similarGamesContainer = document.querySelector('.similar-games');
            if (similarGamesContainer && data.similar_games) {
                similarGamesContainer.innerHTML = ''; // Xóa các game cũ
                data.similar_games.forEach(gameName => {
                    const gameDiv = document.createElement('div');
                    gameDiv.classList.add('similar-game');
                    gameDiv.innerHTML = `
                        <img src="https://placehold.co/100x100" alt="${gameName}">
                        <p>${gameName}</p>
                    `;
                    similarGamesContainer.appendChild(gameDiv);
                });
            }
        })
        .catch(error => console.error('Lỗi khi tải dữ liệu JSON:', error));
});