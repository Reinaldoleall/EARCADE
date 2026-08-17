let currentGame = null;

document.addEventListener('DOMContentLoaded', async () => {
    const gameData = localStorage.getItem('selectedGame');
    if (!gameData) {
        alert('Nenhum jogo selecionado!');
        window.location.href = 'index.html';
        return;
    }
    
    currentGame = JSON.parse(gameData);
    await startEmulator(currentGame);
});

async function startEmulator(game) {
    try {
        const romUrl = game.props.rom;
        let core = getCoreName(game.type);
        
        // Gera um ID numérico obrigatório para o cache interno do EmulatorJS funcionar perfeitamente
        let numericId = parseInt(game.id, 10);
        if (isNaN(numericId)) {
            // Cria um ID numérico baseado no nome do jogo, caso o ID não seja um número
            numericId = Math.abs(game.title.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0));
        }

        // Variáveis globais baseadas na documentação oficial
        window.EJS_player = '#emulator';
        window.EJS_core = core;
        window.EJS_gameUrl = romUrl;
        window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
        
        // Metadados do jogo para o Cache e Saves
        window.EJS_gameName = game.title || 'Jogo Retro';
        window.EJS_gameID = numericId;
        
        // Configuração de Cache Nativo Otimizado
        window.EJS_cacheConfig = { enabled: true, cacheMaxSizeMB: 4096, cacheMaxAgeMins: 7200 };
        
        // UI e Estética (Netflix Style)
        window.EJS_color = '#e50914';
        const bg = game.background || game.thumbnail;
        if (bg) {
            window.EJS_backgroundImage = bg;
            window.EJS_backgroundBlur = true;
        }
        window.EJS_startButtonName = "▶ Iniciar " + (game.title || "");
        window.EJS_alignStartButton = "center";
        
        // Opções de Qualidade de Vida
        window.EJS_volume = 0.8;
        window.EJS_askBeforeExit = true;
        window.EJS_disableAutoUnload = false; // Queremos que ele descarregue da RAM ao sair
        
        // Injeta o script loader.js dinamicamente
        const script = document.createElement('script');
        script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
        document.body.appendChild(script);
        
    } catch (error) {
        console.error('Erro ao preparar emulador:', error);
        alert('Erro ao iniciar o emulador: ' + error.message);
    }
}

// Funções de interface
function goBack() {
    window.location.href = 'index.html';
}

function toggleFullscreen() {
    const container = document.querySelector('.emulator-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error('Erro ao entrar em tela cheia:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Mapeador robusto de sistemas para as 'cores' do EmulatorJS
function getCoreName(type) {
    if (!type) return 'fbneo';
    const t = type.toLowerCase();
    
    if (t.includes('fbneo') || t.includes('neogeo') || t.includes('arcade')) return 'fbneo';
    if (t.includes('psx')) return 'pcsx_rearmed';
    if (t.includes('pce') || t.includes('pcfx')) return 'pce_fast';
    if (t === 'genesis' || t === 'sms' || t === 'gg' || t === 'sg1000') return 'genesis_plus_gx';
    if (t === 'snes') return 'snes9x';
    if (t === 'nes') return 'fceumm';
    if (t === 'n64') return 'mupen64plus_next';
    if (t === 'gba') return 'mgba';
    if (t === 'gb' || t === 'gbc') return 'gambatte';
    if (t === '2600') return 'stella';
    if (t === '7800') return 'prosystem';
    
    return t.replace('-', '_');
}