<template>
  <section class="section-secundaria" ref="horizontalWrapper">
    <div class="sticky-container">
      
      <div class="side-header">
        <h2 class="brand">SOBRE A ECOWAVE</h2>
       
      </div>

      <div class="horizontal-track" ref="horizontalTrack">
        
        <div class="topic-section reveal-item">
          <div class="vertical-divider"></div>
          <div class="topic-content">
            <span class="index">01</span>
            <h3 class="topic-title">Neural Scanning</h3>
            <p class="topic-text">
              Nossa IA utiliza processamento de imagem em tempo real para decompor a estrutura molecular de resíduos, garantindo uma triagem sem erros humanos.
            </p>
            <div class="tech-detail">
              <span class="label">ACCURACY</span>
              <span class="value">99.8%</span>
            </div>
          </div>
        </div>

        <div class="topic-section reveal-item">
          <div class="vertical-divider"></div>
          <div class="topic-content">
            <span class="index">02</span>
            <h3 class="topic-title">Mass Analytics</h3>
            <p class="topic-text">
              Sensores de volumetria detectam o peso exato e a densidade, convertendo matéria física em dados digitais de impacto ambiental imediato.
            </p>
            <div class="tech-detail">
              <span class="label">UNIT</span>
              <span class="value">GRAMS/KG</span>
            </div>
          </div>
        </div>

        <div class="topic-section reveal-item">
          <div class="vertical-divider"></div>
          <div class="topic-content">
            <span class="index">03</span>
            <h3 class="topic-title">Green Code</h3>
            <p class="topic-text">
              Desenvolvido por mentes jovens, nosso backend é otimizado para baixo consumo de energia, provando que software eficiente também é sustentável.
            </p>
            <div class="tech-detail">
              <span class="label">ENGINE</span>
              <span class="value">LOW-CARBON JS</span>
            </div>
          </div>
        </div>

        <div class="topic-section reveal-item last">
          <div class="vertical-divider"></div>
          <div class="topic-content">
            <span class="index">04</span>
            <h3 class="topic-title">Global Impact</h3>
            <p class="topic-text">
              Escalabilidade total. Do descarte individual à logística industrial, estamos codificando o novo padrão de reciclagem global.
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'Secundaria',
  mounted() {
    this.initAnimations();
  },
  methods: {
    initAnimations() {
      const track = this.$refs.horizontalTrack;
      const wrapper = this.$refs.horizontalWrapper;
      const items = gsap.utils.toArray('.reveal-item');
      
      let scrollWidth = track.scrollWidth - window.innerWidth;

      // 1. TIMELINE PRINCIPAL: Controla o movimento horizontal e o fade-in simultaneamente
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1, // Vincula a animação diretamente ao scroll do mouse
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          invalidateOnRefresh: true,
        }
      });

      // Move o trilho para a esquerda
      tl.to(track, {
        x: -scrollWidth,
        ease: "none"
      }, 0); // O '0' garante que comece no início da timeline

      // 2. ANIMAÇÃO DE APARECIMENTO (Fade-in e Slide)
      items.forEach((item, i) => {
        // Anima o conteúdo interno de cada item
        tl.from(item.querySelector('.topic-content'), {
          opacity: 0,
          y: 30,
          duration: 0.5,
          ease: "power2.out"
        }, i * 0.4); // O "i * 0.4" cria o efeito de aparecer um por um conforme a rolagem avança
        
        // Anima o divisor vertical (crescendo)
        tl.from(item.querySelector('.vertical-divider'), {
          scaleY: 0,
          transformOrigin: "top",
          duration: 0.5,
          ease: "none"
        }, i * 0.4);
      });
    }
  }
}
</script>

<style scoped>
.section-secundaria {
  background: linear-gradient(to bottom, #000000 0%, #00431d 100%);
  color: #fff;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.sticky-container {
  height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}

.side-header {
  position: absolute;
  top: 60px;
  left: 60px;
  z-index: 10;
}

.brand {
  font-size: 0.8rem;
  letter-spacing: 5px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 10px;
}

.status-indicator {
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #00ff88;
}

.dot {
  width: 6px;
  height: 6px;
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff88;
}

.horizontal-track {
  display: flex;
  padding-left: 15vw;
  height: 65vh;
  align-items: flex-start;
  will-change: transform;
}

.topic-section {
  display: flex;
  min-width: 500px;
  height: 100%;
  position: relative;
}

.vertical-divider {
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, #00ff88, transparent);
  opacity: 0.4;
}

.topic-content {
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  will-change: opacity, transform; /* Otimiza a performance da animação */
}

.index {
  font-family: 'Courier New', Courier, monospace;
  color: #00ff88;
  font-size: 1rem;
  margin-bottom: 20px;
}

.topic-title {
  font-size: 2.8rem;
  font-weight: 300;
  margin-bottom: 30px;
  letter-spacing: -1.5px;
}

.topic-text {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.8;
  font-size: 1.15rem;
  max-width: 380px;
  margin-bottom: 40px;
}

.tech-detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;
}

.value {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.3rem;
  color: #00ff88;
}

@media (max-width: 768px) {
  .topic-section { min-width: 90vw; }
  .topic-title { font-size: 2rem; }
  .side-header { left: 30px; top: 30px; }
}
</style>