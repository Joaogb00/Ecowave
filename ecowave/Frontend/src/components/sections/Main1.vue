<template>
  <section class="section-cadastro" @mousemove="handleParallax">
    <div class="container">
      <div class="content-grid">
        
        <div class="text-side">
          <div class="badge-tech">SISTEMA ONLINE</div>
          <h2 class="cta-title">
            Comece a <span class="green-text">utilizar</span> a EcoWave agora.
          </h2>
          <p class="cta-p">
            Acesse nossa interface de inteligência artificial e transforme a maneira como você gerencia resíduos. Identificação, pesagem e impacto em um só lugar.
          </p>
          
          <router-link to="/cadastro" class="btn-utilizar">
            UTILIZAR PLATAFORMA
            <div class="icon-arrow">→</div>
          </router-link>
        </div>

        <div class="video-card-wrapper" ref="floatingContainer">
          
          <div v-for="(item, i) in trashItems" :key="i" 
               class="trash-item" 
               :ref="el => { if (el) trashRefs[i] = el }">
            {{ item.icon }}
          </div>

          <div class="video-card">
            <video autoplay muted loop playsinline class="video-bg">
              <source src="https://www.pexels.com/pt-br/download/video/9323702/" type="video/mp4">
            </video>
            <div class="video-overlay">
              
            </div>
          </div>
          <div class="card-glow"></div>
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
  name: 'CadastroCTA',
  data() {
    return {
      trashItems: [
        { icon: '🍾' }, { icon: '🥫' }, { icon: '📄' }, 
        { icon: '🥤' }, { icon: '📦' }, { icon: '🍌' }
      ],
      trashRefs: []
    }
  },
  mounted() {
    this.initFloatingAnimation();
    this.initEntranceAnimation();
  },
  methods: {
    initFloatingAnimation() {
      // Faz os lixos flutuarem suavemente sozinhos no início
      this.trashRefs.forEach((el) => {
        gsap.to(el, {
          y: "random(-20, 20)",
          x: "random(-20, 20)",
          rotation: "random(-15, 15)",
          duration: "random(2, 4)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    },
    handleParallax(e) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      this.trashRefs.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const itemX = rect.left + rect.width / 2;
        const itemY = rect.top + rect.height / 2;

        const diffX = mouseX - itemX;
        const diffY = mouseY - itemY;
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);

        // Se o mouse estiver a menos de 150px, o item foge
        if (distance < 150) {
          const angle = Math.atan2(diffY, diffX);
          const moveX = -Math.cos(angle) * 80; // Força de repulsão
          const moveY = -Math.sin(angle) * 80;

          gsap.to(el, {
            x: moveX,
            y: moveY,
            duration: 0.6,
            ease: "power2.out"
          });
        } else {
          // Volta para a posição original de flutuação
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)"
          });
        }
      });
    },
    initEntranceAnimation() {
      gsap.from(".video-card", {
        scrollTrigger: { trigger: ".video-card", start: "top 80%" },
        x: 100, opacity: 0, duration: 1.2, ease: "power4.out"
      });
    }
  }
}
</script>

<style scoped>
.section-cadastro {
  padding: 140px 0;
   background: linear-gradient(to bottom, #00431d 0%, #000000 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  align-items: center;
}

/* Lixos Suspensos */
.trash-item {
  position: absolute;
  font-size: 2rem;
  z-index: 10;
  cursor: default;
  user-select: none;
  pointer-events: none; /* Mouse move detectado pela section */
  filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.2));
}

/* Posicionamento aleatório inicial dos lixos ao redor do card */
.trash-item:nth-child(1) { top: 10%; left: -5%; }
.trash-item:nth-child(2) { top: 60%; left: -15%; }
.trash-item:nth-child(3) { top: -10%; left: 40%; }
.trash-item:nth-child(4) { top: 80%; left: 80%; }
.trash-item:nth-child(5) { top: 20%; left: 105%; }
.trash-item:nth-child(6) { top: 90%; left: 30%; }

.video-card-wrapper {
  position: relative;
}

/* Estilos originais mantidos para consistência */
.badge-tech { color: #00ff88; font-family: monospace; font-size: 0.8rem; letter-spacing: 3px; margin-bottom: 20px; }
.cta-title { font-size: clamp(2.5rem, 4vw, 3.8rem); font-weight: 200; line-height: 1.1; }
.green-text { color: #00ff88; font-weight: 700; }
.cta-p { font-size: 1.2rem; color: rgba(255, 255, 255, 0.6); margin: 30px 0 40px; }
.btn-utilizar { display: inline-flex; align-items: center; gap: 20px; background: white; color: black; text-decoration: none; padding: 20px 40px; border-radius: 4px; font-weight: 800; transition: 0.3s; }
.btn-utilizar:hover { background: #00ff88; transform: translateX(10px); }

.video-card {
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  background: #000;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;
}

.video-bg { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
.video-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #04140b, transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 30px; }
.ai-status { background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(10px); padding: 15px; border-radius: 8px; border-left: 3px solid #00ff88; font-family: monospace; font-size: 0.75rem; position: relative; overflow: hidden; }
.scan-line-active { position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: #00ff88; box-shadow: 0 0 10px #00ff88; animation: scanLoop 2s infinite linear; }

@keyframes scanLoop { 0% { top: 0; } 100% { top: 100%; } }
</style>