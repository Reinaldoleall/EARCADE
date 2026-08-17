// Aplicação principal
document.addEventListener('DOMContentLoaded', async () => {
    // Carrega os dados
    await loadGameData();
    
    if (gameData && gameData.categories) {
        renderHeroBanner();
        renderGameList();
    }
});

// Renderiza ou atualiza o banner principal
function renderHeroBanner(game) {
    const targetGame = game || featuredGame;
    if (!targetGame) return;
    
    const hero = document.getElementById('heroBanner');
    const title = document.getElementById('heroTitle');
    const description = document.getElementById('heroDescription');
    const playBtn = document.querySelector('.play-button');
    
    // Atualiza a imagem de fundo (prefere background, fallback para thumbnail)
    const bgImage = targetGame.background || targetGame.thumbnail;
    if (bgImage) {
        hero.style.backgroundImage = `url('${bgImage}')`;
    }
    
    title.textContent = targetGame.title || 'Jogo sem título';
    
    // Mostra a informação, limitando levemente se for gigantesca para não quebrar o layout
    let desc = targetGame.description || 'Informação não disponível.';
    if(desc.length > 400) desc = desc.substring(0, 400) + '...';
    description.textContent = desc;
    
    // Atualiza a ação do botão "Assistir Agora" -> "Jogar"
    if (playBtn) {
        playBtn.textContent = '▶ Jogar Agora';
        playBtn.onclick = () => {
            localStorage.setItem('selectedGame', JSON.stringify(targetGame));
            window.location.href = 'player.html';
        };
    }
}

// Renderiza a lista de jogos estilo Netflix
function renderGameList() {
    const container = document.querySelector('.game-rows');
    container.innerHTML = '';
    
    gameData.categories.forEach((category, categoryIndex) => {
        const row = document.createElement('div');
        row.className = 'row';
        
        const title = document.createElement('h2');
        title.className = 'row-title';
        title.textContent = `🎮 ${category.title}`;
        row.appendChild(title);
        
        const posters = document.createElement('div');
        posters.className = 'row-posters';
        
        category.items.forEach((game, gameIndex) => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.setAttribute('data-category', categoryIndex);
            card.setAttribute('data-index', gameIndex);
            
            // Evento para atualizar o topo ao passar o mouse
            card.onmouseenter = () => renderHeroBanner(game);
            card.onclick = () => playGame(categoryIndex, gameIndex);
            
            // Preferência para a capa principal na listagem
            const thumbnail = game.thumbnail || game.background || 'https://via.placeholder.com/200x150/333/666?text=No+Image';
            
            card.innerHTML = `
                <img src="${thumbnail}" alt="${game.title}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/200x150/333/666?text=Error'">
                <div class="game-info">
                    <div class="game-title">${game.title || 'Jogo sem título'}</div>
                    <div class="game-year">${category.title || 'Retro'}</div>
                </div>
            `;
            
            posters.appendChild(card);
        });
        
        row.appendChild(posters);
        container.appendChild(row);
    });
}

// Função para jogar o jogo
function playGame(categoryIndex, gameIndex) {
    const game = gameData.categories[categoryIndex].items[gameIndex];
    if (!game) return;
    
    // Salva o jogo selecionado e navega para a página do emulador
    localStorage.setItem('selectedGame', JSON.stringify(game));
    window.location.href = 'player.html';
}

// Joga o jogo em destaque
function playFeatured() {
    if (featuredGame) {
        localStorage.setItem('selectedGame', JSON.stringify(featuredGame));
        window.location.href = 'player.html';
    }
}

// Adiciona scroll suave com botões (opcional)
function scrollRow(direction) {
    const container = document.querySelector('.row-posters');
    const scrollAmount = 300;
    if (container) {
        container.scrollLeft += direction * scrollAmount;
    }
}