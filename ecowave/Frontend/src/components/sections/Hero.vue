<template>
  <section class="hero-principal">
    <Header />

    <div class="video-container">
      <video autoplay muted loop playsinline class="video-bg">
        <source src="../../assets/videos/Video-Fundo.mp4" type="video/mp4">
        Seu navegador não suporta vídeos.
      </video>
      <div class="overlay" :style="{ opacity: 0.5 + (scrollPercent * 0.5) }"></div>
    </div>

    <div class="hero-content">
      <div class="text-wrapper reveal">
        <h1 class="fade-in-text">EcoWave: O ponto <br><span class="highlight">de partida.</span></h1>
        <p class="fade-in-text-delay">
          Onde a maioria enxerga o fim, nós vemos renovação. 
          Interrompa a linha reta do desperdício e desenhe o <strong>círculo da vida</strong> conosco.
        </p>
      </div>

      <div class="hero-actions fade-in-text-delay-btn reveal">
        <button class="btn-primary">
          TRANSFORME AGORA
          <div class="sheen"></div>
        </button>
      </div>
    </div>

    <div class="scroll-indicator reveal">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <span class="scroll-text">O futuro está em movimento</span>
    </div>

    <div class="floating-actions">
      <button class="back-to-top" :class="{ 'show-top': isScrolled }" @click="scrollToTop">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      <button class="chat-trigger" @click="isChatOpen = !isChatOpen" :class="{ 'active': isChatOpen }">
        <svg v-if="!isChatOpen" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <transition name="chat-slide">
        <div v-if="isChatOpen" class="chat-card">
          <div class="chat-header">
            <div class="status-dot"></div>
            <span>EcoAI • O Despertar da Matéria</span>
          </div>

          <div class="chat-messages" ref="chatBox">
            <div v-for="(msg, index) in messages" :key="index" :class="['msg', msg.type]" v-html="msg.text">
            </div>
            <div v-if="isTyping" class="msg bot typing">...</div>
          </div>

          <div class="chat-input">
            <input v-model="userQuery" @keyup.enter="sendMessage" placeholder="Toque. Arraste. Transforme..." />
            <button @click="sendMessage" class="send-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </section>

  <Secundaria/>
  <Main1/>
</template>

<script>
import Header from '../Header.vue';
import Main1 from './Main1.vue';
import Secundaria from './Secundaria.vue';

export default {
  name: 'HeroPrincipal',
  components: { Header, Main1, Secundaria },
  data() {
    return {
      isChatOpen: false,
      isScrolled: false,
      scrollPercent: 0,
      userQuery: '',
      isTyping: false,
      messages: [
        { 
          type: 'bot', 
          text: '<strong>Bem-vindo ao fluxo.</strong> No ecossistema da sustentabilidade, o descarte é um convite à renovação. Como podemos transformar o seu rastro no mundo hoje?' 
        },
        { 
          type: 'menu', 
          text: 'Escolha uma via de fluxo:<br>1: Ciclo do Vidro/Polímeros<br>2: Soluções ESG<br>3: Tecnologia Circular<br>4: Consultoria' 
        }
      ],
      opcoes: {
        '1': "Fragmentos de vidro e polímeros carregam energia. Nossa logística garante que sua próxima forma seja útil e limpa.",
        '2': "Desenhamos o círculo da vida para sua marca, transformando passivo ambiental em ativo reputacional.",
        '3': "Blockchain e IA: o movimento do dado garantindo a transparência do descarte.",
        '4': "O futuro responde ao seu contato. Deixe seus dados e um agente de fluxo falará com você."
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.initScrollReveal();
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollY = window.scrollY;
      this.isScrolled = scrollY > 400;
      // Calcula percentual de scroll para efeitos visuais (0 a 1)
      this.scrollPercent = Math.min(scrollY / window.innerHeight, 1);
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    initScrollReveal() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active-reveal');
          }
        });
      }, { threshold: 0.15 });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    },
    sendMessage() {
      const input = this.userQuery.trim();
      if (!input) return;
      this.messages.push({ type: 'user', text: input });
      this.userQuery = '';
      this.processarOpcao(input);
    },
    processarOpcao(escolha) {
      this.isTyping = true;
      this.scrollToBottom();
      setTimeout(() => {
        this.isTyping = false;
        const resposta = this.opcoes[escolha] || "O futuro exige clareza. Por favor, escolha uma opção de 1 a 4.";
        this.messages.push({ type: 'bot', text: resposta });
        this.scrollToBottom();
      }, 800);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const box = this.$refs.chatBox;
        if (box) box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
      });
    }
  }
}
</script>

<style scoped>
/* --- EFEITOS DE REVELAÇÃO --- */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.active-reveal {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* --- HERO PRINCIPAL --- */
.hero-principal {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #050505;
  overflow: hidden;
}

.video-container {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.video-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.8) brightness(0.8);
}

.overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
  transition: opacity 0.3s ease;
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: #fff;
  max-width: 900px;
  padding: 0 20px;
}

h1 {
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.9;
  margin-bottom: 30px;
}

.highlight {
  background: linear-gradient(90deg, #fff, #00ff88, #fff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 5s linear infinite;
}

@keyframes shine {
  to { background-position: 200% center; }
}

p {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  max-width: 650px;
  margin: 0 auto 40px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
}

/* --- BOTÕES COM EFEITO GLASS --- */
.btn-primary {
  position: relative;
  overflow: hidden;
  padding: 20px 45px;
  background: #fff;
  color: #000;
  border: none;
  font-weight: 700;
  letter-spacing: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.btn-primary:hover {
  transform: scale(1.05);
}

.sheen {
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
  transition: 0.5s;
  transform: skewX(-25deg);
}

.btn-primary:hover .sheen {
  left: 150%;
}

/* --- CHAT E COMPONENTES FLUTUANTES --- */
.floating-actions {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chat-trigger, .back-to-top {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.4s ease;
}

.chat-trigger:hover {
  background: #00ff88;
  color: #000;
}

.chat-card {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  background: rgba(10, 10, 10, 0.9);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.scroll-text {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.5;
}

.mouse {
  width: 25px;
  height: 40px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  position: relative;
}

.wheel {
  width: 3px;
  height: 8px;
  background: #00ff88;
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollAnim 1.5s infinite;
}

@keyframes scrollAnim {
  0% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, 15px); }
}

/* Responsividade */
@media (max-width: 768px) {
  .chat-card {
    width: 90vw;
    right: -10px;
  }
}
</style>