async function searchGame(gameName) {
    const url = 'https://api.igdb.com/v4/games';
    const data = `fields id,name,cover.url,screenshots.url; where name = "${gameName}";`;
    const headers = {
        'Accept': 'application/json',
        'Client-ID': 'YOUR_CLIENT_ID',
        'Authorization': 'Bearer YOUR_AUTHORIZATION_TOKEN',
        'User-Agent': 'YourAppName/1.0' // Thêm User-Agent
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: data
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
       if (result.length > 0){
          const game = result[0];
          const coverUrl = game.cover ? `https:${game.cover.url}` : "Không có ảnh cover";
          console.log('Cover URL:', coverUrl);
           if(game.screenshots && game.screenshots.length > 0) {
             const screenshotUrls = game.screenshots.map((screenshot) => `https:${screenshot.url}`);
             console.log('Screenshot URLs:', screenshotUrls)
          } else {
            console.log("Không có screenshot nào")
          }
       }
       else {
         console.log("Không tìm thấy game")
       }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Tìm kiếm game
searchGame("The Witcher 3");