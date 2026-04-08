<template>
  <section class="hero-principal">
     <Header/> 
    <div class="sky-layer"></div>

    <div 
      class="hero-content reveal-text" 
      :style="{ transform: `translateY(${(scrollOffset * 0.3) - 100}px)` }"
    >
      <h1 class="title">
        RENOVE<br> O PLANETA COM<br>
        <span class="highlight">ECOWAVE</span>
      </h1>
      <p class="description">A tecnologia a serviço da vida.</p>
    </div>

    <div class="mountain-front" :style="{ transform: `translateY(${-scrollOffset * 0.15}px)` }"></div>

    <div class="scroll-hint">
      <div class="line"></div>
      <span>SCROLL</span>
    </div>

    <div class="floating-actions">
      <button class="back-to-top" :class="{ 'show-top': isScrolled }" @click="scrollToTop">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6" /></svg>
      </button>
      <button class="chat-trigger" @click="isChatOpen = !isChatOpen" :class="{ 'active': isChatOpen }">
        <span v-if="!isChatOpen">💬</span>
        <span v-else>✕</span>
      </button>
    </div>
  </section>

  <Secundaria id="mapa-secao" class="next-section" />
</template>

<script>
import Header from '../Header.vue';
import Secundaria from './Secundaria.vue';

export default {
  name: 'HeroPrincipal',
  components: { Header, Secundaria },
  data() {
    return {
      isChatOpen: false,
      isScrolled: false,
      scrollOffset: 0
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll);
  },
  unmounted() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll() {
      this.scrollOffset = window.pageYOffset;
      this.isScrolled = this.scrollOffset > 500;
    },
    scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }
}
</script>

<style scoped>
.hero-principal {
  position: relative;
  width: 100%;
  height: 140vh; /* Altura extra para o efeito de "passagem" */
  background: #87CEEB; /* Cor do céu caso a imagem falhe */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reveal-text {
  animation: fadeInUp 1.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Camada do Céu (Lá no fundo) */
.sky-layer {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070'); /* Foto de montanha com céu limpo */
  background-size: cover;
  background-position: top;
  z-index: 1;
}

/* Camada do Texto (No meio) */
.hero-content {
  position: relative;
  z-index: 2; /* Texto fica na camada de baixo */
  text-align: center;
  color: #fff;
  will-change: transform;
  margin-bottom: 50vh;
}

.title {
  font-size: clamp(5rem, 5vw, 15rem);
  font-weight: 900;
  line-height: 0.85;
  letter-spacing: -5px;
  /* Sombra reforçada para leitura contra o céu */
  text-shadow: 0 10px 50px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3);
}

.highlight {
  color: #00ff88;
}

/* Camada da Frente (Recorte da Montanha) */
/* IMPORTANTE: Aqui você deve usar uma imagem com fundo transparente da montanha */
.mountain-front {
  position: absolute;
  bottom: -5%; /* Começa um pouco abaixo para cobrir a base */
  left: 0;
  width: 100%;
  height: 155vh;
  background-image: url('https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=2000');
  background-size: cover;
  background-position: center;
  z-index: 3; 
  
  /* Mantendo seu clip-path orgânico */
  clip-path: polygon(0 55%, 15% 50%, 35% 52%, 50% 45%, 70% 48%, 85% 40%, 100% 45%, 100% 100%, 0% 100%);
  
  filter: brightness(1.1) saturate(1.6) contrast(1.1); 
  pointer-events: none;
  will-change: transform;
}
/* Seção que vem depois */
.next-section {
  
  margin-top: -1px; /* Truque para evitar uma linha branca de 1px entre componentes */

}

/* Elementos de UI */
.scroll-hint {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  color: #fff;
  font-weight: bold;
  text-align: center;
}

.line {
  width: 2px;
  height: 50px;
  background: #00ff88;
  margin: 0 auto 10px;
  animation: scrollDown 2s infinite;
}

@keyframes scrollDown {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  50.1% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

.floating-actions { position: fixed; right: 30px; bottom: 30px; z-index: 100; display: flex; flex-direction: column; gap: 10px; }
.chat-trigger, .back-to-top { width: 50px; height: 50px; border-radius: 50%; border: none; cursor: pointer; display: grid; place-items: center; font-size: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
.chat-trigger { background: #00ff88; }
.back-to-top { background: #fff; opacity: 0; transition: 0.3s; }
.show-top { opacity: 1; }

@media (max-width: 768px) {
  .title { font-size: 5rem; }
  .hero-principal { height: 100vh; }
}
</style>