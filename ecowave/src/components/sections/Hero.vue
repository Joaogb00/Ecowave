<template>
  <section class="hero-principal">
    <Header />
    
    <div class="video-container">
      <video 
        autoplay 
        muted 
        loop 
        playsinline 
        class="video-bg"
      >
        <source src="../../assets/videos/hero01.mp4" type="video/mp4">
        Seu navegador não suporta vídeos.
      </video>
      <div class="overlay"></div>
    </div>

    <div class="hero-content">
      <div class="text-wrapper">
        <h1 class="fade-in-text">EcoWave: O futuro <br><span>do descarte.</span></h1>
        <p class="fade-in-text-delay">
          Logística reversa inteligente e soluções sustentáveis para marcas que 
          desejam liderar a mudança global.
        </p>
      </div>
      
      <div class="hero-actions fade-in-text-delay-btn">
        <button class="btn-primary">COMEÇAR AGORA</button>
        <button class="btn-secondary">NOSSO MANIFESTO</button>
      </div>
    </div>

    <div class="scroll-indicator fade-in-text-delay-btn">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
    </div>
  </section>
</template>

<script>
import Header from '../Header.vue';

export default {
  name: 'HeroPrincipal',
  components: {
    Header
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.hero-principal {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000; /* Fallback caso o vídeo demore a carregar */
  overflow: hidden;
}

/* --- VIDEO BACKGROUND --- */
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
  object-fit: cover; /* Mantém a proporção sem distorcer */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Do transparente no topo ao preto 80% na base */
  background: linear-gradient(
    to bottom, 
    rgba(0, 0, 0, 0.2) 0%, 
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 2;
}

/* --- CONTEÚDO --- */
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
  line-height: 1;
  letter-spacing: -3px;
  margin-bottom: 25px;
}

h1 span {
  opacity: 0.5; /* Efeito moderno de contraste no título */
}

p {
  font-size: clamp(1rem, 2vw, 1.2rem);
  max-width: 600px;
  margin: 0 auto 45px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

/* --- BOTÕES --- */
.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 20px 40px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 1px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn-primary {
  background-color: #fff;
  color: #000;
  border: 1px solid #fff;
}

.btn-secondary {
  background-color: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background-color: transparent;
  color: #fff;
  transform: translateY(-5px);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #fff;
  transform: translateY(-5px);
}

/* --- ANIMAÇÕES (ESTILO 120HZ LENTO) --- */
.fade-in-text {
  opacity: 0;
  animation: slideUpFade 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.fade-in-text-delay {
  opacity: 0;
  animation: slideUpFade 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: 0.2s;
}

.fade-in-text-delay-btn {
  opacity: 0;
  animation: slideUpFade 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: 0.4s;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- INDICADOR DE SCROLL --- */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.mouse {
  width: 26px;
  height: 42px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.wheel {
  width: 4px;
  height: 8px;
  background-color: #fff;
  border-radius: 2px;
  animation: scrollAnim 2s infinite cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes scrollAnim {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(15px); opacity: 0; }
}
</style>