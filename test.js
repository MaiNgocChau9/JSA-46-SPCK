const fetch = require('node-fetch'); // Thư viện gửi yêu cầu HTTP
const cheerio = require('cheerio'); // Phân tích HTML, cần cài: npm install cheerio

// Hàm tìm kiếm DuckDuckGo
async function duckDuckGoSearch(query, numResults = 10) {
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const html = await response.text();
        const $ = cheerio.load(html);
        const results = [];

        // Lọc ra các liên kết từ kết quả tìm kiếm
        $('a.result__a').each((index, element) => {
            if (index < numResults) {
                const title = $(element).text();
                const link = $(element).attr('href');
                results.push({ title, link });
            }
        });

        return results.length > 0 ? results : [];
    } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        return [];
    }
}

// Hàm tải nội dung trang web
async function fetchPageContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const html = await response.text();
        const $ = cheerio.load(html);

        // Trích xuất nội dung chính từ trang web
        const content = $('body').text().replace(/\s+/g, ' ').trim();
        return content.length > 300 ? content.slice(0, 300) + "..." : content;
    } catch (error) {
        console.error(`Lỗi khi tải nội dung từ ${url}:`, error);
        return "Không thể tải nội dung.";
    }
}

// Hàm chính để tìm kiếm và xử lý nội dung
async function main(query) {
    console.log(`Đang tìm kiếm: "${query}"...`);
    const searchResults = await duckDuckGoSearch(query, 10);

    if (searchResults.length === 0) {
        console.log("Không tìm thấy kết quả phù hợp.");
        return;
    }

    console.log("\nKết quả tìm kiếm:");
    for (const [index, result] of searchResults.entries()) {
        console.log(`${index + 1}. ${result.title}`);
        console.log(`   Link: ${result.link}`);
        
        // Lấy nội dung từ trang web
        const content = await fetchPageContent(result.link);
        console.log(`   Nội dung: ${content}`);
        console.log('------------------------------');
    }
}

// Gọi hàm chính với từ khóa tìm kiếm
main("JavaScript tutorials");