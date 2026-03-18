<template>
  <section class="hero-principal">
    <Header />

    <div class="video-container">
      <video autoplay muted loop playsinline class="video-bg">
        <source src="../../assets/videos/Video-Fundo.mp4" type="video/mp4">
        Seu navegador não suporta vídeos fortes.
      </video>
      <div class="overlay"></div>
    </div>

    <div class="hero-content">
      <div class="text-wrapper reveal">
        <h1 class="fade-in-text">EcoWave: O futuro <br><span>do descarte.</span></h1>
        <p class="fade-in-text-delay">
          Logística reversa inteligente e soluções sustentáveis para marcas que
          desejam liderar a mudança global.
        </p>
      </div>

      <div class="hero-actions fade-in-text-delay-btn reveal">
        <button class="btn-primary">COMEÇAR AGORA</button>
        
      </div>
    </div>

    <div class="scroll-indicator reveal">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
    </div>

    <div class="floating-actions">
      <button class="back-to-top" :class="{ 'show-top': isScrolled }" @click="scrollToTop">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      <button class="chat-trigger" @click="isChatOpen = !isChatOpen" :class="{ 'active': isChatOpen }">
        <svg v-if="!isChatOpen" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
          stroke-width="2">
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
            <span>EcoAI • Online</span>
          </div>

          <div class="chat-messages" ref="chatBox">
            <div v-for="(msg, index) in messages" :key="index" :class="['msg', msg.type]">
              {{ msg.text }}
            </div>
            <div v-if="isTyping" class="msg bot typing">...</div>
          </div>

          <div class="chat-input">
            <input v-model="userQuery" @keyup.enter="sendMessage" placeholder="Pergunte aqui..." />
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
  <!-- Section secundaria  -->
  <Secundaria/>

  <!-- Parte da section branca -->
  <Main1/>
</template>

<script>
import Header from '../Header.vue';
import Main1 from './Main1.vue';
import Secundaria from './Secundaria.vue';
export default {
  name: 'HeroPrincipal',
  components: { 
    Header,
    Main1,
    Secundaria

   },
  data() {
    return {
      isChatOpen: false,
      isScrolled: false,
      userQuery: '',
      isTyping: false,
      messages: [
        { type: 'bot', text: 'Olá! Bem-vindo à EcoWave. Como posso ajudar seu negócio hoje?' },
        { type: 'menu', text: 'Digite o número ou clique na opção:\n1: Como funciona o descarte\n2: Soluções para Empresas\n3: Tecnologia Utilizada 4: Falar com Consultor' }
      ],
      opcoes: {
        '1': "Nossos pontos de coleta inteligentes rastreiam resíduos via IoT, garantindo que 100% do material seja reciclado corretamente.",
        '2': "Oferecemos logística reversa personalizada e dashboards de impacto ESG para marcas que buscam sustentabilidade real.",
        '3': "Unimos Blockchain para rastreabilidade e Inteligência Artificial para otimização de rotas de coleta.",
        '4': "Perfeito! Deixe seu e-mail ou WhatsApp aqui no chat que um de nossos especialistas entrará em contato em breve."
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
      this.isScrolled = window.scrollY > 400;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    initScrollReveal() {
      const observerOptions = {
        threshold: 0.15
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active-reveal');
          }
        });
      }, observerOptions);

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
        if (this.opcoes[escolha]) {
          this.messages.push({ type: 'bot', text: this.opcoes[escolha] });
        } else {
          this.messages.push({ type: 'bot', text: "Desculpe, não entendi. Escolha um número de 1 a 4." });
        }
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
/* --- LÓGICA DE REVELAÇÃO (O QUE VOCÊ PEDIU) --- */
.reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, opacity;
}

.active-reveal {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* --- ESTILOS GERAIS --- */
.hero-principal {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  overflow: hidden;
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.video-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.493), rgba(0, 0, 0, 0.801));/*ideal */
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: #fff;
  font-family: 'Inter', sans-serif;
  max-width: 1000px;
  padding: 0 20px;
}

h1 {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  letter-spacing: -3px;
  margin-bottom: 25px;
  line-height: 1;
  color: #fff;
}

h1 span {
  opacity: 0.5;
}

p {
  font-size: clamp(1rem, 2vw, 1.2rem);
  max-width: 600px;
  margin: 0 auto 45px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 18px 36px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn-primary {
  background: #fff;
  color: #000;
  border: 1px solid #fff;
}

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: transparent;
  color: #fff;
  transform: translateY(-5px);
}

/* --- FLOATING ACTIONS --- */
.floating-actions {
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 15px;
}

.chat-trigger,
.back-to-top {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.back-to-top {
  opacity: 0;
  transform: scale(0.5);
  pointer-events: none;
}

.back-to-top.show-top {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

/* --- CHAT CARD --- */
.chat-card {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 320px;
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  transform-origin: bottom right;
}

.chat-header {
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
}

.chat-messages {
  height: 350px;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.msg {
  max-width: 90%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 0.85rem;
  color: white;
  display: flex;
  
}

.msg.bot {
  background: rgba(255, 255, 255, 0.08);
  align-self: flex-start;
  color: #eee;
}

.msg.user {
  background: #fff;
  color: #000;
  align-self: flex-end;
  font-weight: 500;
}

.chat-input {
  padding: 15px;
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.chat-input input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  outline: none;
}

.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

/* --- SCROLL INDICATOR --- */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}


</style>