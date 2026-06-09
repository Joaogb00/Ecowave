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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');

/* --- MODAIS COM GLASSMORPHISM EDITORIAL DE FORMULARIO.VUE --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(249, 249, 249, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  text-align: center;
  width: 90%;
  max-width: 400px;
  padding: 40px;
  background: #ffffff;
  border: 1px solid rgba(17, 17, 17, 0.06);
  border-radius: 20px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.05);
  animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-icon {
  font-size: 2.5rem;
  color: #111111;
  margin-bottom: 15px;
}

.modal-content h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  letter-spacing: 0.02em;
  margin: 0 0 10px 0;
  text-transform: uppercase;
}

.modal-content p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #444444;
  margin-bottom: 25px;
}

/* --- BOTÃO OPERACIONAL PREMIUM (OVAL) --- */
.action-button {
  width: 100%;
  background: #111111;
  color: #ffffff;
  padding: 1.1rem;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid #111111;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.action-button:hover {
  background: #333333;
  border-color: #333333;
  transform: translateY(-1px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

/* --- GRID DE FUNDO DA PLATAFORMA --- */
.hero-bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, #f1f1f1 1px, transparent 1px),
                    linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  opacity: 0.7;
  z-index: 1;
}

/* --- TELA IMMERSIVA OFFLINE --- */
.offline-immersive-stage {
  min-height: 100vh;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  font-family: 'Inter', sans-serif;
}

.offline-card-glass {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 25px 60px rgba(0,0,0,0.03);
  border: 1px solid rgba(17, 17, 17, 0.03);
}

/* --- TIPOGRAFIA EDITORIAL --- */
.eyebrow {
  color: #777777;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  font-weight: 700;
  display: block;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.title-editorial {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  line-height: 0.95;
  letter-spacing: 0.02em;
  color: #111111;
  margin-bottom: 15px;
}

.description-editorial {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #666666;
  max-width: 450px;
  margin-bottom: 35px;
}

/* --- GAME ENGINE LAYOUT --- */
.game-simulation-box {
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 25px;
}

.game-dashboard {
  position: absolute;
  top: 15px;
  right: 20px;
  display: flex;
  gap: 20px;
  z-index: 5;
}

.score-tag {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #777777;
}

.score-tag span {
  color: #111111;
}

.game-viewport-canvas {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 700 / 220;
  background: #fafafa;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* --- OVERLAYS DO GAME --- */
.game-over-overlay, .game-start-prompt {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 20px;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.game-over-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  color: #aa2222;
  margin-bottom: 5px;
  letter-spacing: 0.03em;
}

.game-over-action {
  font-size: 0.75rem;
  color: #777777;
  margin-bottom: 15px;
}

.btn-game-restart {
  max-width: 200px;
  padding: 0.7rem 1.5rem;
  font-size: 0.7rem;
}

.game-start-prompt {
  background: rgba(255, 255, 255, 0.85);
  cursor: pointer;
}

.game-start-prompt p {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #111111;
}

kbd {
  background: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-family: inherit;
}

.offline-card-footer {
  font-size: 0.7rem;
  color: #999999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* --- TIMING E ANIMAÇÕES --- */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* --- RESPONSIVIDADE --- */
.show-on-mobile { display: none; }

@media (max-width: 768px) {
  .offline-card-glass { padding: 30px 20px; }
  .hide-on-mobile { display: none; }
  .show-on-mobile { display: inline; }
  .title-editorial { font-size: 2.2rem; }
}

/* --- RADAR SIGNAL ICON --- */
.signal-radar-icon {
  position: relative;
  width: 40px;
  height: 40px;
  margin-bottom: 20px;
}
.core-dot {
  position: absolute;
  top: 17px; left: 17px;
  width: 6px; height: 6px;
  background: #111;
  border-radius: 50%;
}
.pulse-ring {
  position: absolute;
  width: 40px; height: 40px;
  border: 2px solid #111;
  border-radius: 50%;
  animation: pulse 2s infinite ease-out;
  opacity: 0;
}
@keyframes pulse {
  0% { transform: scale(0.1); opacity: 0; }
  50% { opacity: 0.4; }
  100% { transform: scale(1.2); opacity: 0; }
}
</style>