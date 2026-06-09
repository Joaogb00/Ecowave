<template>
  <div>
    <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
      <div class="header-container">
        
        <div class="header-left-group">
          <button class="hamburger-btn" @click="toggleSidebar" aria-label="Abrir menu lateral">
            <span class="bar-line"></span>
            <span class="bar-line"></span>
            <span class="bar-line"></span>
          </button>

          <router-link to="/cadastrado" class="logo-link">
            <img class="img-logo" src="../../assets/img/logo.png" alt="EcoWave Logo">
          </router-link>
        </div>

        <div class="header-right-group">
          <router-link to="/Loja" class="icon-nav-link" aria-label="Loja">
            <i class="bi bi-bag"></i>
          </router-link>
          
          <router-link to="/denuncia" class="icon-nav-link" aria-label="Denúncias">
            <i class="bi bi-chat"></i>
          </router-link>
          
          <router-link to="/pontos" class="icon-nav-link" aria-label="Pontos de Coleta">
            <i class="bi bi-geo-alt-fill"></i>
          </router-link>
          
          <router-link to="/minhaconta" class="router-icon" aria-label="Minha Conta">
            <i class="bi bi-person-circle user-icon"></i>
          </router-link>

          <router-link to="/reciclagem" class="btn-primary-nav">
            RECICLAR AGORA
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

          <p class="sidebar-section-title">CONTEÚDO DA PLATAFORMA</p>
          
          <nav class="sidebar-nav-list">
            <router-link to="/reciclagem" class="mobile-menu-item-btn" @click="toggleSidebar">
              <i class="bi bi-recycle"></i> Reciclar Agora
            </router-link>
            <router-link to="/Loja" class="mobile-menu-item-link" @click="toggleSidebar">
              <i class="bi bi-bag"></i> Marketplace EcoWave
            </router-link>
            <router-link to="/pontos" class="mobile-menu-item-link" @click="toggleSidebar">
              <i class="bi bi-geo-alt-fill"></i> Encontrar Pontos (IoT)
            </router-link>
            <router-link to="/denuncia" class="mobile-menu-item-link" @click="toggleSidebar">
              <i class="bi bi-chat"></i> Central de Denúncias
            </router-link>
            <router-link to="/minhaconta" class="mobile-menu-item-link" @click="toggleSidebar">
              <i class="bi bi-person-circle"></i> Meu Perfil
            </router-link>
          </nav>

          <div class="sidebar-footer">
            <p>EcoWave App v2.0 // 2026</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isScrolled = ref(false)
const isSidebarOpen = ref(false)

const toggleSidebar = () => { 
  isSidebarOpen.value = !isSidebarOpen.value 
}

const handleScroll = () => { 
  isScrolled.value = window.scrollY > 50 
}

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
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Scroll ativo: Ganha fundo branco sutil */
.main-header.header-scrolled {
  height: clamp(65px, 7vh, 80px);
  background-color: #ffffff !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
}

/* Hover no bloco: Fundo preto */
.main-header:hover {
  background-color: #000000 !important;
}

.header-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 3.5rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left-group {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 2.2rem);
}

/* --- LOGO INTERATIVA --- */
.logo-link {
  display: block;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.logo-link:hover {
  transform: scale(1.02);
}

.img-logo {
  height: 75px;
  width: auto;
  display: block;
  transition: filter 0.4s ease;
}

/* Mantém a logo legível dependendo do estado do fundo */
.main-header:hover .img-logo {
  filter: brightness(0) invert(1);
}

/* --- BOTÃO HAMBÚRGUER --- */
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
  background-color: #000000; /* Inicia preto */
  border-radius: 99px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s ease, background-color 0.4s ease;
}

/* Muda para branco ao passar o mouse (fundo escurece) */
.main-header:hover .bar-line {
  background-color: #ffffff;
}
.hamburger-btn:hover .bar-line:nth-child(2) { width: 16px; }

/* --- GRUPO DIREITO (ÍCONES TOTALMENTE PRETOS POR PADRÃO) --- */
.header-right-group {
  display: flex;
  align-items: center;
  gap: clamp(0.6rem, 1.8vw, 1.6rem);
}

.icon-nav-link, .router-icon {
  font-size: 1.25rem;
  color: #000000; /* Definido totalmente preto na inicialização */
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s ease;
}

/* Quando passar o mouse sobre os ícones individualmente */
.icon-nav-link:hover, .router-icon:hover {
  transform: scale(1.1);
}

/* Inversão dinâmica: passam a ser brancos quando o header vira preto */
.main-header:hover .icon-nav-link,
.main-header:hover .router-icon {
  color: #ffffff;
}

/* Ícone de Usuário Customizado */
.user-icon { font-size: 1.45rem; }

/* Botão Principal CTA (Reciclar Agora) */
.btn-primary-nav {
  background: #000000;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(0.9rem, 2vw, 1.6rem);
  font-size: clamp(0.65rem, 1vw, 0.75rem);
  border-radius: 999px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Inverte o botão para fundo branco quando o header fica preto */
.main-header:hover .btn-primary-nav {
  background: #ffffff !important;
  color: #111111 !important;
}

.btn-primary-nav:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255,255,255,0.15);
}

/* ===== DRAWER MOBILE ===== */
.sidebar-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
}
.sidebar-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
}
.sidebar-content {
  position: relative;
  width: 100%;
  max-width: 360px;
  height: 100%;
  background: rgba(255, 255, 255, 0.98);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 20px 0 60px rgba(0,0,0,0.1);
}
.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}
.sidebar-brand { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.4rem; color: #111; }
.close-drawer-btn { background: none; border: none; cursor: pointer; color: #111; transition: transform 0.3s; }
.close-drawer-btn:hover { transform: rotate(90deg); }
.sidebar-section-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; color: #888; margin-bottom: 1.5rem; }

.sidebar-nav-list { display: flex; flex-direction: column; gap: 0.8rem; flex-grow: 1; }

.mobile-menu-item-link {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  transition: background 0.2s;
}
.mobile-menu-item-link:hover { background: rgba(0,0,0,0.04); color: #000; }

.mobile-menu-item-btn {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  background: #111;
  color: #fff;
  text-decoration: none;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem;
  border-radius: 99px;
  margin-bottom: 1rem;
}

.sidebar-footer { font-size: 0.7rem; color: #aaa; }

/* ===== INTERFACE DE TRANSIÇÕES ===== */
.drawer-slide-enter-active, .drawer-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from .sidebar-content, .drawer-slide-leave-to .sidebar-content {
  transform: translateX(-100%);
}
.drawer-slide-enter-from, .drawer-slide-leave-to { opacity: 0; }

/* ===== MEDIA QUERIES RESPONSIVAS ===== */
@media (max-width: 480px) {
  .header-container { padding: 0 1rem; }
  .icon-nav-link { font-size: 1.1rem; }
  .user-icon { font-size: 1.3rem; }
  .btn-primary-nav { padding: 0.45rem 0.9rem; font-size: 0.65rem; }
}
</style>