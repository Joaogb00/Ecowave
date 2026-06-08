<template>
  <section class="hero-cadastrado">
    <header-cad />
    <NecoAssistant ref="necoRef" />

    <div class="sky-layer"></div>

    <div
      class="welcome-container reveal-text"
      :style="{ transform: `translateY(${(scrollOffset * 0.3) - 80}px)` }"
    >
      <span class="eyebrow">Acesso Concedido</span>

      <h1 class="welcome-title">
        Bem-vindo, <span class="text-highlight">{{ userName }}</span>.
      </h1>

      <p class="welcome-subtitle">
        Sua conta <strong>EcoWave</strong> está pronta para transformar o planeta. Escolha uma ação abaixo para começar.
      </p>

      <div class="botoes-iniciais">
        <router-link
          class="btn-inicio primary"
          to="/reciclagem"
          data-intro="Aqui você registra suas reciclagens e ganha EcoWave Coins."
          data-step="1"
        >
          RECICLAR AGORA
        </router-link>

        <router-link
          class="btn-inicio secondary"
          to="/pontos"
          data-intro="Veja os pontos de coleta próximos e detalhes de cada local."
          data-step="2"
        >
          PONTOS DE COLETA
        </router-link>
      </div>
    </div>

    <div class="overlay"></div>
  </section>
</template>

<script>
import HeaderCad from '@/components/Cadatrastrados/HeaderCad.vue';
import NecoAssistant from '../../components/Assistente.vue';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

export default {
  name: 'Pag_cadastrado',
  components: {
    HeaderCad,
    NecoAssistant
  },
  data() {
    return {
      userName: sessionStorage.getItem('ecoWave_user') || 'Operador',
      userEmail: sessionStorage.getItem('ecoWave_email') || '',
      scrollOffset: 0
    }
  },
  mounted() {
    // Proteção: se não tiver usuário, volta pro login
    if (!sessionStorage.getItem('ecoWave_user')) {
      this.$router.push('/login');
      return;
    }

    window.addEventListener('scroll', this.onScroll);

    // Tour só na primeira vez
    if (!localStorage.getItem('tour_finalizado')) {
      // Garante que o NecoAssistant está montado antes de chamar
      this.$nextTick(() => {
        if (this.$refs.necoRef && this.$refs.necoRef.iniciarModoGuia) {
          this.$refs.necoRef.iniciarModoGuia();
        }

        introJs().setOptions({
          showBullets: false,
          exitOnOverlayClick: false
        })
        .oncomplete(() => this.concluirTour())
        .onexit(() => this.concluirTour())
        .start();
      });
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll() {
      this.scrollOffset = window.pageYOffset;
    },
    concluirTour() {
      localStorage.setItem('tour_finalizado', 'true');
      if (this.$refs.necoRef && this.$refs.necoRef.finalizarModoGuia) {
        this.$refs.necoRef.finalizarModoGuia();
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

/* =====================================================
   HERO CADASTRADO — ECOWAVE DESIGN SYSTEM
   Alinhado ao estilo padrão de MinhaConta
   ===================================================== */

.hero-cadastrado {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #000000;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* Camadas neutras (mantidas por compatibilidade de layout) */
.sky-layer,
.overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  pointer-events: none;
  z-index: 1;
}

/* ---- CONTAINER PRINCIPAL ---- */
.welcome-container {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 1250px;
  width: 100%;
  padding: 0 6%;
  will-change: transform;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* Entrada suave ao montar */
  animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---- EYEBROW (rótulo superior) ---- */
.eyebrow {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
  color: #000000;
  margin-bottom: 1.6rem;

  /* Entrada com delay leve */
  animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
}

/* ---- TÍTULO PRINCIPAL ---- */
.welcome-title {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-size: clamp(2.6rem, 6.8vw, 6.8rem);
  line-height: 0.86;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: #000000;
  margin-bottom: 2rem;
  -webkit-font-smoothing: antialiased;

  animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
}

/* ---- DESTAQUE NO NOME ---- */
.text-highlight {
  color: #000000;
  border-bottom: 5px solid #000000;
  display: inline-block;
  line-height: 0.8;
}

/* ---- SUBTÍTULO ---- */
.welcome-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  color: #2c2c2e;
  max-width: 620px;
  margin: 0 auto 3.5rem;
  line-height: 1.6;
  text-transform: none;

  animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.welcome-subtitle strong {
  color: #000000;
  font-weight: 700;
}

/* ---- GRUPO DE BOTÕES ---- */
.botoes-iniciais {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;

  animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both;
}

/* ---- BOTÃO BASE ---- */
.btn-inicio {
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 1.1rem 2.8rem;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition:
    background 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    transform  0.25s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.25s ease;
}

/* Primário — preto sólido (igual ao btn-save / btn-exit-confirm do padrão) */
.btn-inicio.primary {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.10);
}

.btn-inicio.primary:hover {
  background: #1c1c1e;
  transform: translateY(-3px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.18);
}

.btn-inicio.primary:active {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.14);
}

/* Secundário — contorno (igual ao btn-cancel-edit do padrão) */
.btn-inicio.secondary {
  background: transparent;
  color: #000000;
  border: 1px solid #000000;
}

.btn-inicio.secondary:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
}

.btn-inicio.secondary:active {
  transform: translateY(-1px);
}

/* ---- RESPONSIVIDADE ---- */
@media (max-width: 768px) {
  .welcome-title {
    font-size: clamp(2.2rem, 8.5vw, 3.8rem);
    line-height: 0.9;
  }

  .botoes-iniciais {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .btn-inicio {
    width: 100%;
    min-width: unset;
  }
}

/* ---- INTRO.JS — OVERLAY PADRÃO ---- */
:global(.introjs-overlay) {
  background: rgba(0, 0, 0, 0.8) !important;
}
</style>