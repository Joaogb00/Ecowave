<template>
  <section class="hero-principal">
    <Header />
    <div class="sky-layer"></div>

    <div class="hero-content reveal-text" :style="{ transform: `translateY(${(scrollOffset * 0.3) - 100}px)` }">
      <h1 class="title">
        RENOVE<br> O PLANETA COM<br>
        <span class="highlight">ECOWAVE</span>
      </h1>
      <p class="description">A tecnologia a serviço da vida.</p>
    </div>

    <div 
      class="mountain-front" 
      :style="{ transform: `translateY(${-scrollOffset * 0.15}px)` }"
    >
      <!-- <div class="trees-container">
        <div 
          v-for="n in 6" 
          :key="n" 
          :class="['organic-tree-unit', `tree-${n}`]"
          ref="organicTrees"
          @mouseenter="swayTreeIndividual($event)"
          @mouseleave="resetTreeIndividual($event)"
        >
          <div class="tree-inner">
            <div class="foliage-mass">
              <div class="leaf-tuft t1"></div>
              <div class="leaf-tuft t2"></div>
              <div class="leaf-tuft t3"></div>
            </div>
            <div class="trunk-container">
              <div class="trunk-main"></div>
              <div class="branch b1"></div>
              <div class="branch b2"></div>
            </div>
            <div class="tree-base-shadow"></div>
          </div>
        </div>
      </div> -->
    </div>

    <div class="floating-actions">
      <button class="back-to-top" :class="{ 'show-top': isScrolled }" @click="scrollToTop">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  </section>

  <Secundaria id="mapa-secao" class="next-section" />
  <Main1/>
</template>

<script>
import Header from '../Header.vue';
import Main1 from './Main1.vue';
import Secundaria from './Secundaria.vue';
import { gsap } from 'gsap';

export default {
  name: 'HeroPrincipal',
  components: { Header, Secundaria, Main1 },
  
  data() {
    return {
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
    scrollToTop() { 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    },
    swayTreeIndividual(e) {
      const foliage = e.currentTarget.querySelector('.foliage-mass');
      const trunk = e.currentTarget.querySelector('.trunk-container');
      const rect = e.currentTarget.getBoundingClientRect();
      const side = e.clientX - rect.left > rect.width / 2 ? 1 : -1;

      gsap.to(foliage, {
        rotation: 8 * side,
        scale: 1.05,
        duration: 0.7,
        ease: "power2.out",
        transformOrigin: "bottom center"
      });
      gsap.to(trunk, {
        rotation: 2 * side,
        duration: 0.8,
        ease: "power2.out",
        transformOrigin: "bottom center"
      });
    },
    resetTreeIndividual(e) {
      const foliage = e.currentTarget.querySelector('.foliage-mass');
      const trunk = e.currentTarget.querySelector('.trunk-container');

      gsap.to(foliage, {
        rotation: 0,
        scale: 1,
        duration: 2,
        ease: "elastic.out(1, 0.3)"
      });
      gsap.to(trunk, {
        rotation: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }
}
</script>

<style scoped>
/* Estrutura base mantida conforme seu código original */
.hero-principal {
  position: relative;
  width: 100%;
  height: 140vh;
  background: #87CEEB;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sky-layer {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070');
  background-size: cover;
  background-position: top;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
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
  text-shadow: 0 10px 50px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.3);
}

.highlight { color: #00ff88; }

.mountain-front {
  position: absolute;
  bottom: 0; left: 0; width: 100%; height: 140vh;
  background-image: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.8) 80%, #000 100%),
                    url('https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=2000');
  background-size: cover;
  background-position: center bottom;
  z-index: 3;
  clip-path: polygon(0 55%, 15% 50%, 35% 52%, 50% 45%, 70% 48%, 85% 40%, 100% 45%, 100% 100%, 0% 100%);
  filter: saturate(1.6) contrast(1.1);
  will-change: transform;
}

.trees-container {
  position: absolute;
  width: 100%; height: 100%;
  top: 0; left: 0;
  pointer-events: none;
}

/* ÁRVORES ESTILO ILUSTRAÇÃO (Inspirado na imagem enviada) */
.organic-tree-unit {
  position: absolute;
  width: clamp(100px, 12vw, 180px);
  height: clamp(130px, 16vh, 220px);
  z-index: 5;
  pointer-events: auto;
  cursor: pointer;
}

.tree-inner {
  position: relative;
  width: 100%; height: 100%;
}

/* Tronco mais detalhado e ramificado */
.trunk-container {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 100%; height: 100%;
  z-index: 1;
}

.trunk-main {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 8%; height: 50%;
  background: linear-gradient(to right, #241a14, #422d21, #241a14);
  border-radius: 4px 4px 0 0;
}

.branch {
  position: absolute;
  background: #241a14;
  height: 25%; width: 4%;
  border-radius: 4px;
}
.branch.b1 { bottom: 35%; left: 45%; transform: rotate(-35deg); }
.branch.b2 { bottom: 40%; left: 51%; transform: rotate(40deg); }

/* Folhagem baseada na imagem: Bordas serrilhadas e cores vibrantes */
.foliage-mass {
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 100%; height: 75%;
  z-index: 2;
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
}

.leaf-tuft {
  position: absolute;
  background-size: cover;
  /* Clip-path irregular para simular tufos de folhas da imagem */
  clip-path: polygon(50% 0%, 70% 5%, 90% 20%, 100% 40%, 95% 70%, 80% 90%, 50% 100%, 20% 90%, 5% 70%, 0% 40%, 10% 20%, 30% 5%);
}

/* Camada mais escura (fundo) */
.leaf-tuft.t1 {
  inset: 0;
  background: radial-gradient(circle at 50% 80%, #0d2b10, #1b5e20);
  z-index: 1;
}

/* Camada média (detalhes/volume) */
.leaf-tuft.t2 {
  inset: 15% 10% 10% 10%;
  background: radial-gradient(circle at 50% 20%, #2e7d32, #1b5e20);
  clip-path: polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%);
  z-index: 2;
  opacity: 0.9;
}

/* Camada clara (topo/luz) */
.leaf-tuft.t3 {
  width: 60%; height: 40%;
  top: 5%; left: 20%;
  background: radial-gradient(circle at center, #66bb6a, #388e3c);
  z-index: 3;
}

.tree-base-shadow {
  position: absolute;
  bottom: -5px; left: 50%;
  transform: translateX(-50%);
  width: 40%; height: 8px;
  background: rgba(0,0,0,0.3);
  filter: blur(4px);
  z-index: 0;
}

/* Posicionamento variado */
.tree-1 { top: 52%; left: 10%; transform: scale(1.1); }
.tree-2 { top: 48%; left: 28%; transform: scale(0.9); }
.tree-3 { top: 50%; left: 46%; transform: scale(1.2); }
.tree-4 { top: 44%; left: 65%; transform: scale(0.95); }
.tree-5 { top: 41%; left: 82%; transform: scale(0.85); }
.tree-6 { top: 44%; left: 93%; transform: scale(0.9); }

.next-section { margin-top: -22vh; position: relative; z-index: 4; }

.back-to-top {
  position: fixed;
  right: 30px; bottom: 30px;
  width: 50px; height: 50px;
  border-radius: 50%; border: none;
  background: #fff; cursor: pointer;
  display: grid; place-items: center;
  opacity: 0; transition: 0.3s;
}
.show-top { opacity: 1; }
</style>