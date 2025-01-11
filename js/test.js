// Free-to-game API
fetch('https://www.freetogame.com/api/games')
  .then(res => res.json())
  .then(data => {
    const game = data.find(g => g.title.toLowerCase().includes('game_name'.toLowerCase()));
    if(game) {
      const thumbnail = game.thumbnail;
      console.log(thumbnail);
    }
  });

// Gamerpower API
fetch('https://www.gamerpower.com/api/giveaways')
  .then(res => res.json())
  .then(data => {
    const game = data.find(g => g.title.toLowerCase().includes('game_name'.toLowerCase()));
    if(game) {
      const banner = game.image;
      const thumbnail = game.thumbnail;
      console.log(banner);
      console.log(thumbnail);
    }
  });