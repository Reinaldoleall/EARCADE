// Carrega o arquivo JSON de jogos
let gameData = null;
let featuredGame = null;

async function loadGameData() {
    try {
        const response = await fetch('json/game.json');
        gameData = await response.json();
        
        // Define o jogo em destaque (primeiro jogo da primeira categoria)
        if (gameData.categories && gameData.categories.length > 0) {
            const firstCategory = gameData.categories[0];
            if (firstCategory.items && firstCategory.items.length > 0) {
                featuredGame = firstCategory.items[0];
            }
        }
        
        return gameData;
    } catch (error) {
        console.error('Erro ao carregar dados dos jogos:', error);
        return null;
    }
}