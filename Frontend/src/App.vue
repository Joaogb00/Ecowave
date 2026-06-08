<template>
  <transition name="modal-fade">
    <div v-if="alertModal.exibir" class="modal-overlay" @click="fecharAlert">
      <div class="modal-content" @click.stop>
        <div class="modal-icon">
          <i class="bi bi-exclamation-circle"></i>
        </div>
        <h3>Notificação</h3>
        <p>{{ alertModal.mensagem }}</p>
        <button class="btn-restart" @click="fecharAlert" style="width: 100%; border-radius: 8px; padding: 12px;">
          CONCLUÍDO
        </button>
      </div>
    </div>
  </transition>

  <div class="warp-speed-overlay" :class="{ 'is-active': isWarping }" aria-hidden="true">
    <div class="streak s-1"></div>
    <div class="streak s-2"></div>
    <div class="streak s-3"></div>
    <div class="streak s-4"></div>
    <div class="streak s-5"></div>
  </div>

  <div v-if="!isOffline" class="app-viewport">
    <router-view v-slot="{ Component }">
      <transition name="cinematic-warp" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view> 
    
    <Footer />
  </div>

  <div v-else class="offline-immersive-stage">
    <div class="offline-card-glass">
      <header class="offline-header">
        <div class="signal-radar-icon">
          <span class="pulse-ring"></span>
          <span class="core-dot"></span>
        </div>
        <h1 class="offline-title">Conexão Interrompida</h1>
        <p class="offline-subtitle">
          Você entrou em mar aberto. Restabelecendo sinal EcoWave...
        </p>
      </header>

      <div class="game-simulation-box">
        <div class="game-dashboard">
          <div class="score-tag">SCORE: <span>{{ Math.floor(currentScore) }}</span></div>
          <div class="score-tag high-score">HI-SCORE: <span>{{ Math.floor(highScore) }}</span></div>
        </div>

        <canvas ref="gameCanvas" class="game-viewport-canvas" @click="triggerPlayerJump"></canvas>

        <div v-if="isGameOver" class="game-over-overlay">
          <h2 class="game-over-title">Resíduo Descartado Incorretamente</h2>
          <p class="game-over-action">Pressione <kbd class="hide-on-mobile">Espaço</kbd><span class="show-on-mobile">Toque na Tela</span> para Reiniciar</p>
          <button class="btn-restart" @click="resetGame">Tentar Novamente</button>
        </div>
        
        <div v-if="!gameStarted && !isGameOver" class="game-start-prompt" @click="startGame">
          <p>Clique aqui <span class="hide-on-mobile">ou pressione <kbd>Espaço</kbd></span> para começar</p>
        </div>
      </div>

      <footer class="offline-card-footer">
        A aplicação retornará automaticamente assim que detectarmos rede ativa.
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Footer from './components/Footer.vue';

// --- Estado Global ---
const alertModal = ref({ exibir: false, mensagem: '' });
const route = useRoute();
const isWarping = ref(false);
const isOffline = ref(!navigator.onLine);

// --- Configurações do Jogo ---
const gameCanvas = ref<HTMLCanvasElement | null>(null);
const currentScore = ref(0);
const highScore = ref(parseInt(localStorage.getItem('ecowave_hi_score') || '0'));
const isGameOver = ref(false);
const gameStarted = ref(false);

// Engine Variables
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number;
let lastTime = 0;
let obstacles: any[] = [];
let obstacleTimer = 0;

// Configurações Físicas (Baseadas em tempo, não quadros)
const BASE_WIDTH = 700;
const BASE_HEIGHT = 220;
const GRAVITY = 1800; // Pixels por segundo ao quadrado
const JUMP_FORCE = -550; // Pixels por segundo
const SPEED = 350; // Pixels por segundo (velocidade horizontal)

const player = {
  x: 60,
  y: 150,
  width: 24,
  height: 42,
  vy: 0,
  isJumping: false
};

// --- Funções Auxiliares ---
const fecharAlert = () => { alertModal.value.exibir = false; };
const hooksAlertGlobal = () => { window.alert = (msg: any) => { alertModal.value.mensagem = String(msg); alertModal.value.exibir = true; }; };
const restaurarAlertGlobal = () => { window.alert = window.alert; };

// --- Controle de Conexão e Navegação ---
watch(() => route?.path, () => { isWarping.value = true; setTimeout(() => { isWarping.value = false; }, 500); });
const updateOnlineStatus = () => { isOffline.value = !navigator.onLine; };

// --- Motor do Jogo (Real-Time Delta Time) ---
const initGameEngine = () => {
  if (!gameCanvas.value) return;
  ctx = gameCanvas.value.getContext('2d');
  window.addEventListener('keydown', handleGlobalInput);
  resizeCanvas();
};

const stopGameEngine = () => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('keydown', handleGlobalInput);
};

const handleGlobalInput = (e: KeyboardEvent) => {
  if (alertModal.value.exibir) { if (e.code === 'Space') fecharAlert(); return; }
  if (e.code === 'Space') {
    e.preventDefault();
    if (!gameStarted.value && !isGameOver.value) startGame();
    else if (isGameOver.value) resetGame();
    else triggerPlayerJump();
  }
};

const triggerPlayerJump = () => {
  if (!gameStarted.value || isGameOver.value || !player.isJumping === false) return;
  if (!player.isJumping) {
    player.vy = JUMP_FORCE;
    player.isJumping = true;
  }
};

const startGame = () => {
  gameStarted.value = true;
  isGameOver.value = false;
  currentScore.value = 0;
  obstacles = [];
  lastTime = performance.now();
  gameLoop(lastTime);
};

const resetGame = () => {
  gameStarted.value = true;
  isGameOver.value = false;
  currentScore.value = 0;
  obstacles = [];
  player.y = 150;
  player.vy = 0;
  player.isJumping = false;
  lastTime = performance.now();
};

// LOOP PRINCIPAL (RequestAnimationFrame sync)
const gameLoop = (timestamp: number) => {
  if (isGameOver.value || !gameStarted.value) return;

  const deltaTime = (timestamp - lastTime) / 1000; // Converter para segundos
  lastTime = timestamp;

  updatePhysics(deltaTime);
  drawGameGraphics();

  animationFrameId = requestAnimationFrame(gameLoop);
};

const updatePhysics = (dt: number) => {
  // Gravidade
  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;

  // Ground collision
  if (player.y >= 150) {
    player.y = 150;
    player.vy = 0;
    player.isJumping = false;
  }

  // Score
  currentScore.value += 30 * dt; // Score sobe baseado no tempo
  if (currentScore.value > highScore.value) {
    highScore.value = currentScore.value;
    localStorage.setItem('ecowave_hi_score', Math.floor(highScore.value).toString());
  }

  // Obstaculos
  obstacleTimer += dt;
  if (obstacleTimer > 1.5) { // Spawn a cada 1.5s
    obstacles.push({ x: 720, y: 155, width: 26, height: 37, color: Math.random() > 0.5 ? '#0077ff' : '#34c759' });
    obstacleTimer = 0;
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= SPEED * dt;
    
    // Colisão simples
    if (
      player.x < obstacles[i].x + obstacles[i].width &&
      player.x + player.width > obstacles[i].x &&
      player.y < obstacles[i].y + obstacles[i].height &&
      player.y + player.height > obstacles[i].y
    ) {
      isGameOver.value = true;
    }
    if (obstacles[i].x < -50) obstacles.splice(i, 1);
  }
};

const drawGameGraphics = () => {
  if (!ctx) return;
  ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  
  // Linha de chão
  ctx.strokeStyle = 'rgba(17, 17, 17, 0.08)';
  ctx.beginPath(); ctx.moveTo(0, 192); ctx.lineTo(BASE_WIDTH, 192); ctx.stroke();
  
  // Jogador
  ctx.fillStyle = '#111111';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Obstaculos
  obstacles.forEach(obs => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
};

const resizeCanvas = () => { if (gameCanvas.value) { gameCanvas.value.width = BASE_WIDTH; gameCanvas.value.height = BASE_HEIGHT; } };

onMounted(() => {
  hooksAlertGlobal();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  if (isOffline.value) initGameEngine();
});

onBeforeUnmount(() => {
  restaurarAlertGlobal();''
  stopGameEngine();
});
</script>

<style>
/* Reset e Base */
* { padding: 0; margin: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #f9f9f9; color: #111; overflow-x: hidden; }

/* Mantém seus estilos originais, apenas garantindo fluidez */
.game-viewport-canvas { 
    display: block; 
    width: 100%; 
    height: 100%; 
    cursor: pointer; 
    background: #ffffff;
    /* Otimização de renderização */
    image-rendering: -webkit-optimize-contrast; 
    image-rendering: crisp-edges;
}

/* Restante do CSS permanece igual ao seu original... */
</style>