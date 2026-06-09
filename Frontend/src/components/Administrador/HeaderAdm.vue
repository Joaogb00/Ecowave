<template>
  <div>
    <header class="main-header" :class="{ 'header-scrolled': isPinned }">
      <div class="header-container">
        
        <div class="header-left-group">
          <button class="hamburger-btn" @click="toggleSidebar" aria-label="Abrir menu lateral">
            <span class="bar-line"></span>
            <span class="bar-line"></span>
            <span class="bar-line"></span>
          </button>

          <router-link to="/administrador">
            <img class="img-logo" src="../../assets/img/logo.png" alt="EcoWave Logo">
          </router-link>
        </div>

        <div class="header-right-group">
         

          <router-link to="/minhacontaadm" class="router-icon">
            <i class="bi bi-person-circle user-icon"></i>
          </router-link>
        </div>

      </div>
    </header>

    <transition name="drawer-slide">
      <div class="sidebar-wrapper" v-if="isSidebarOpen">
        <div class="sidebar-backdrop" @click="toggleSidebar"></div>
        <div class="sidebar-content">
          
          <div class="sidebar-top">
            <span class="sidebar-brand">ECOWAVE</span>
            <button class="close-drawer-btn" @click="toggleSidebar" aria-label="Fechar menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <p class="sidebar-section-title">CONTEÚDO E DIRETRIZES</p>
          
          <nav class="sidebar-nav-list">
            <button 
              v-for="topic in platformTopics" 
              :key="topic.id" 
              class="topic-nav-item" 
              @click="openTopicModal(topic)"
            >
              <div class="topic-meta">
                <span class="topic-index">{{ topic.index }}</span>
                <span class="topic-label">{{ topic.title }}</span>
              </div>
              <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </nav>

          <div class="sidebar-footer">
            <p>EcoWave App v2.0 // 2026</p>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal-scale">
      <div class="modal-overlay" v-if="activeTopic" @click.self="closeTopicModal">
        <div class="modal-card fade-in">
          
          <button class="modal-close-corner" @click="closeTopicModal" aria-label="Fechar modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          
          <div class="modal-header-area">
            <span class="modal-tag">{{ activeTopic.index }} // {{ activeTopic.tag }}</span>
            <h2 class="modal-title">{{ activeTopic.title }}</h2>
          </div>

          <div class="modal-grid-layout">
            
            <div class="modal-subtopics-sidebar">
              <span class="subtopic-section-title">Seções Disponíveis</span>
              <div class="subtopic-buttons-group">
                <button 
                  v-for="sub in activeTopic.subtopics" 
                  :key="sub.id"
                  class="subtopic-tab-btn"
                  :class="{ 'is-active': activeSubtopicId === sub.id }"
                  @click="activeSubtopicId = sub.id"
                >
                  <span class="subtopic-bullet"></span>
                  <span class="subtopic-btn-text">{{ sub.label }}</span>
                </button>
              </div>
            </div>

            <div class="modal-mega-content-display">
              <transition name="content-fade" mode="out-in">
                <div :key="activeSubtopicId" class="animated-content-wrapper">
                  <h3 class="content-display-title">{{ currentSubtopicData?.title }}</h3>
                  <p class="content-display-text">{{ currentSubtopicData?.text }}</p>
                  
                  <div
                    class="content-display-highlights"
                    v-if="currentSubtopicData?.bulletPoints"
                  >
                    <div
                      v-for="(bp, idx) in currentSubtopicData.bulletPoints"
                      :key="idx"
                      class="highlight-pill"
                    >
                      <span class="pill-dot"></span>
                      <span class="pill-text">{{ bp }}</span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

          </div>

          <div class="modal-footer-actions">
            <router-link
              :to="activeTopic.route"
              class="modal-action-btn"
              @click="closeTopicModal"
            >
              <span>Ir para o Módulo Completo</span>
              <span class="arrow-forward">→</span>
            </router-link>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const isPinned = ref(false)
const isSidebarOpen = ref(false)
const activeTopic = ref<any>(null)
const activeSubtopicId = ref<number>(1)

const platformTopics = ref([
  {
    id: 1,
    index: '01',
    tag: 'PROPÓSITO // VISÃO',
    title: 'Nossa Visão',
    route: '/visao',
    subtopics: [
      {
        id: 1,
        label: 'O Manifesto',
        title: 'Quebrando Paradigmas Urbanos',
        text: 'A EcoWave nasce para redefinir a forma como a sociedade interage com o lixo urbano. Unimos tecnologia e consciência coletiva para transformar resíduos descartados em ativos circulares de alto valor comercial.',
        bulletPoints: ['Sustentabilidade Escalável', 'Cultura de Descarte Zero', 'Cidades Inteligentes']
      },
      {
        id: 2,
        label: 'Impacto Social',
        title: 'Inclusão e Desenvolvimento',
        text: 'Fortalecemos cooperativas locais integrando catadores autônomos diretamente no fluxo financeiro digital, gerando renda justa e dignidade por meio de rastreabilidade completa.',
        bulletPoints: ['Remuneração Direta', 'Suporte a Cooperativas', 'Capacitação Tecnológica']
      },
      {
        id: 3,
        label: 'Metas Globais',
        title: 'Compromisso Ambição 2030',
        text: 'Nosso ecossistema está alinhado diretamente com as diretrizes de desenvolvimento sustentável da ONU, visando mitigar a pegada de carbono urbana em até 40% nas metrópoles parceiras.',
        bulletPoints: ['Redução de CO₂', 'Parcerias com a ONU', 'Logística Reversa']
      }
    ]
  },
  {
    id: 2,
    index: '02',
    tag: 'NEURAL // CORE',
    title: 'Identificação Inteligente IA',
    route: '/ia',
    subtopics: [
      {
        id: 1,
        label: 'Redes Neurais',
        title: 'Visão Computacional na Borda',
        text: 'Processamento em tempo real utilizando modelos otimizados de Deep Learning rodando diretamente no dispositivo do usuário para reconhecimento instantâneo de materiais compostos.',
        bulletPoints: ['TensorFlow Edge', 'Tempo de Resposta < 200ms', 'Detecção de Polímeros']
      },
      {
        id: 2,
        label: 'Acurácia de Triagem',
        title: 'Mapeamento Geométrico de Resíduos',
        text: 'Nossos algoritmos descartam falsos positivos analisando a volumetria, padrões texturais e marcas comerciais, garantindo triagens limpas antes da destinação física.',
        bulletPoints: ['Mapeamento 3D Simulado', 'Taxa de Acerto de 98.4%', 'Filtro Anti-Fraude']
      }
    ]
  },
  {
    id: 3,
    index: '03',
    tag: 'FINANCEIRO // REALTIME',
    title: 'Fluxo de Recompensas',
    route: '/recompensas',
    subtopics: [
      {
        id: 1,
        label: 'Carteira Digital',
        title: 'Liquidez Instantânea EcoWave',
        text: 'Ao validar a entrega do resíduo em um posto inteligente, o saldo digital é updated em tempo real. O usuário tem autonomia total sobre seus fundos acumulados.',
        bulletPoints: ['Saques Pix Imediatos', 'Extrato Auditável', 'Taxa Zero de Custódia']
      },
      {
        id: 2,
        label: 'Gamificação Ativa',
        title: 'Níveis, Desafios e Multiplicadores',
        text: 'Engajamos a comunidade por meio de temporadas competitivas. Manter sequências de reciclagem desbloqueia multiplicadores de ganho e insígnias premium compartilháveis.',
        bulletPoints: ['Multiplicadores de Saldo', 'Rankings Regionais', 'Benefícios com Parceiros']
      }
    ]
  },
  {
    id: 4,
    index: '04',
    tag: 'DATA // ANALYTICS',
    title: 'Ecossistema e Rastreabilidade',
    route: '/dashboard',
    subtopics: [
      {
        id: 1,
        label: 'Métricas de Impacto',
        title: 'Transparência Verde de Ponta a Ponta',
        text: 'Disponibilizamos dashboards completos contendo métricas analíticas profundas sobre economia de água, energia e matérias-primas virgens poupadas através do app.',
        bulletPoints: ['Relatórios ESG', 'Dados em Tempo Real', 'Certificação Digital']
      },
      {
        id: 2,
        label: 'Parcerias Industriais',
        title: 'Fechando o Ciclo de Produção',
        text: 'Conectamos indústrias que buscam matéria-prima reciclada homologada diretamente às fontes de triagem urbana, eliminando intermediários ineficientes.',
        bulletPoints: ['Auditoria de Origem', 'Logística Otimizada', 'Mercado de Carbono']
      }
    ]
  }
])

const currentSubtopicData = computed(() => {
  if (!activeTopic.value) return null
  return (
    activeTopic.value.subtopics.find((s: any) => s.id === activeSubtopicId.value) ||
    activeTopic.value.subtopics[0]
  )
})

const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }
const openTopicModal = (topic: any) => {
  activeTopic.value = topic
  activeSubtopicId.value = topic.subtopics[0].id
}
const closeTopicModal = () => { activeTopic.value = null }
const handleScroll = () => { isPinned.value = window.scrollY > 50 }

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css");

/* --- CONFIGURAÇÃO CORE INTERNA --- */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}

/* ===== HEADER PRINCIPAL ===== */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px; 
  display: flex;
  align-items: center;
  z-index: 1000;
  background-color: transparent;
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Quando scrollar: fundo branco */
.main-header.header-scrolled {
  height: clamp(56px, 7vh, 76px);
  background-color: white !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

/* Quando passar o mouse: fundo preto em todo o bloco */
.main-header:hover {
  background-color: #000 !important;
}

.header-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 3.1rem); 
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left-group {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 2.2rem);
}

/* --- LOGO --- */
.img-logo {
  height: 80px;
  width: 160px;
  transition: transform 0.4s ease, filter 0.4s ease;
}

/* Logo branca no hover do header */
.main-header:hover .img-logo {
  filter: brightness(0) invert(1);
}

/* --- HAMBURGER BUTTON --- */
.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  outline: none;
}

.bar-line {
  width: 22px;
  height: 2px;
  background-color: #111111;
  border-radius: 99px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s ease, background-color 0.4s ease;
}

.main-header:hover .bar-line {
  background-color: #ffffff;
}

.hamburger-btn:hover .bar-line:nth-child(2) { 
  width: 16px; 
}

/* --- GRUPO DIREITO & CTAS --- */
.header-right-group {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1.8rem); 
  flex-shrink: 0; 
}

.btn-secondary-nav {
  font-family: 'Inter', sans-serif;
  font-size: clamp(0.65rem, 1vw, 0.78rem);
  font-weight: 600;
  color: #111111;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: opacity 0.3s, color 0.4s ease;
}

.main-header:hover .btn-secondary-nav {
  color: #ffffff;
}

.btn-secondary-nav:hover { 
  opacity: 0.6; 
}

.btn-primary-nav {
  background: #111111;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(0.8rem, 2vw, 1.6rem);
  font-size: clamp(0.65rem, 1vw, 0.75rem);
  border-radius: 999px;
  transition: all 0.3s ease;
}

.main-header:hover .btn-primary-nav {
  background: #ffffff;
  color: #111111;
}

.btn-primary-nav:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* --- ÍCONE DE USUÁRIO --- */
.user-icon {
  font-size: 1.6rem;
  color: #000;
  transition: color 0.4s ease;
}

.main-header:hover .user-icon {
  color: #fff;
}

.router-icon {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ===== SIDEBAR / DRAWER MODERNO ===== */
.sidebar-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
}

.sidebar-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
}

.sidebar-content {
  position: relative;
  width: 100%;
  max-width: 380px;
  height: 100%;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(35px);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 20px 0 50px rgba(0,0,0,0.1);
}

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3.5rem;
}

.sidebar-brand {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 1px;
  color: #111;
}

.close-drawer-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #111;
  transition: transform 0.3s;
}

.close-drawer-btn:hover { 
  transform: rotate(90deg); 
}

.sidebar-section-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #888;
  margin-bottom: 1.5rem;
}

.sidebar-nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex-grow: 1;
}

.topic-nav-item {
  width: 100%;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.01);
  border-radius: 14px;
  padding: 1.1rem 1.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.topic-nav-item:hover { 
  background: #111111; 
}

.topic-meta {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.topic-index {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #888;
}

.topic-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #111;
}

.arrow-icon {
  color: #111;
  transform: translateX(-4px);
  opacity: 0;
  transition: all 0.35s;
}

.topic-nav-item:hover .topic-index { color: rgba(255,255,255,0.5); }
.topic-nav-item:hover .topic-label { color: #fff; }
.topic-nav-item:hover .arrow-icon {
  color: #fff;
  transform: translateX(0);
  opacity: 1;
}

.sidebar-footer {
  font-size: 0.7rem;
  color: #aaa;
  font-family: 'Inter', sans-serif;
}

/* ===== MODAL ESTILO MEGA MENU (DARK GLASS) ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-card {
  position: relative;
  background: rgba(15, 15, 15, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 95vw;
  max-width: 860px;
  max-height: 90vh;
  border-radius: 24px;
  padding: clamp(1.5rem, 5vh, 3.5rem);
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.modal-card::-webkit-scrollbar { width: 5px; }
.modal-card::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 99px;
}

.modal-close-corner {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 5;
  transition: all 0.3s ease;
}

.modal-close-corner:hover {
  background: #fff;
  color: #000;
}

.modal-header-area {
  margin-bottom: 2.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.2rem;
}

.modal-tag {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.4);
  display: block;
  margin-bottom: 0.5rem;
}

.modal-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.4rem, 4vw, 2.2rem);
  font-weight: 600;
  margin: 0;
  color: #fff;
}

/* Layout Grid Interno */
.modal-grid-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: clamp(1rem, 3vw, 3.5rem);
  flex-grow: 1;
}

.modal-subtopics-sidebar {
  display: flex;
  flex-direction: column;
}

.subtopic-section-title {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1rem;
}

.subtopic-buttons-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.subtopic-tab-btn {
  background: transparent;
  border: none;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  transition: all 0.3s ease;
}

.subtopic-bullet {
  width: 5px;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.subtopic-btn-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.subtopic-tab-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.subtopic-tab-btn.is-active {
  background: rgba(255, 255, 255, 0.1);
}

.subtopic-tab-btn.is-active .subtopic-bullet {
  background-color: #fff;
  transform: scale(1.4);
}

.subtopic-tab-btn.is-active .subtopic-btn-text {
  color: #fff;
}

.content-display-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.8rem 0;
}

.content-display-text {
  font-size: 0.92rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1.8rem 0;
  text-align: justify;
}

.content-display-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.highlight-pill {
  background: rgba(255, 255, 255, 0.06);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255,255,255,0.05);
}

.pill-dot {
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
}

.pill-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
}

/* Rodapé do Modal */
.modal-footer-actions {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
}

.modal-action-btn {
  background: #fff;
  color: #000;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.8rem;
  border-radius: 999px;
  transition: all 0.3s ease;
}

.modal-action-btn:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.arrow-forward {
  transition: transform 0.3s ease;
}

.modal-action-btn:hover .arrow-forward {
  transform: translateX(4px);
}

/* ===== ANIMAÇÕES INTEGRADAS EM AMBOS ===== */
.fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-fade-enter-active {
  transition: opacity 0.35s ease-out, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.content-fade-leave-active {
  transition: opacity 0.15s ease-in;
}
.content-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.content-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from .sidebar-content,
.drawer-slide-leave-to .sidebar-content {
  transform: translateX(-100%);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
}
.modal-scale-enter-from .modal-card {
  transform: scale(0.95) translateY(12px);
}
.modal-scale-leave-to .modal-card {
  transform: scale(0.97);
}

/* ===== MEDIA QUERIES RESPONSIVAS ===== */
@media (max-width: 768px) {
  .modal-card {
    padding: 2rem 1.5rem;
  }
  .modal-grid-layout {
    grid-template-columns: 1fr;
    gap: 1.8rem;
  }
  .subtopic-section-title {
    display: none;
  }
  .subtopic-buttons-group {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.6rem;
    gap: 0.5rem;
  }
  .subtopic-tab-btn {
    width: max-content;
    white-space: nowrap;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
  }
  .subtopic-tab-btn.is-active {
    background: #fff;
  }
  .subtopic-tab-btn.is-active .subtopic-btn-text {
    color: #000;
  }
  .subtopic-tab-btn.is-active .subtopic-bullet {
    background-color: #000;
  }
  .modal-footer-actions {
    margin-top: 1.5rem;
    justify-content: center;
  }
  .modal-action-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 1rem;
  }
  .btn-secondary-nav {
    font-size: 0.65rem;
    padding: 0.3rem;    
  }
  .btn-primary-nav {
    padding: 0.4rem 0.8rem;
    font-size: 0.65rem;
  }
  .img-logo {
    width: 120px;
    height: auto;
  }
}
</style>