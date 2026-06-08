<template>
  <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-left">
       <router-link to="/cadastrado" ><img class="img-logo" src="../../assets/img/logo.png" alt="EcoWave Logo"></router-link>
      
    </div>

    <nav class="header-center">
      <div class="menu-item">
        <span class="links">Nossa Visão <i class="chevron"></i></span>
        <div class="mega-menu">
          <div class="mega-content fade-in">
            <div class="column intro-col">
              <div class="img-wrapper">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400" alt="EcoWave Tech" class="menu-img">
              </div>
              <h3>O Movimento</h3>
              <p>Liderado por <strong>João Gabriel</strong> e <strong>Juan Pablo</strong>, redefinindo o descarte global.</p>
              <a href="#" class="more-link">Nossa história <span class="arrow">→</span></a>
            </div>
            
            <div class="column">
              <h3>Sobre a EcoWave</h3>
              <ul class="menu-list">
                <li><a href="#" class="menu-link-item">Conheça nossas ferramentas <span class="line"></span></a></li>
                <li><a href="#" class="menu-link-item">Manifesto Sustentável <span class="line"></span></a></li>
                <li><a href="#" class="menu-link-item">Certificações Green <span class="line"></span></a></li>
              </ul>
              <h3 class="spacer-h3">Empresas</h3>
              <ul class="menu-list">
                <li><a href="#" class="menu-link-item">Logística Reversa <span class="line"></span></a></li>
                <li><a href="#" class="menu-link-item">Dashboards ESG <span class="line"></span></a></li>
                <li><a href="#" class="menu-link-item">Relatórios de Impacto <span class="line"></span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="menu-item">
        <span class="links">Soluções <i class="chevron"></i></span>
        <div class="mega-menu">
          <div class="mega-content fade-in">
            <div class="column">
              <div class="img-wrapper">
                <img src="https://images.unsplash.com/photo-1532033375034-a29004bd9039?auto=format&fit=crop&w=400" alt="Coleta" class="menu-img">
              </div>
              <h3>Serviços</h3>
              <p>Consultoria ambiental personalizada para sua planta industrial.</p>
            </div>
            <div class="column">
              <h3>Coleta Inteligente</h3>
              <ul class="menu-list">
                <li><a href="#" class="menu-link-item">Agendamento 24h <span class="line"></span></a></li>
                <li><a href="#" class="menu-link-item">Rastreamento Blockchain <span class="line"></span></a></li>
                <li><a href="#" class="menu-link-item">Pontos EcoWave IoT <span class="line"></span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="menu-item">
        <span class="links">Recursos <i class="chevron"></i></span>
        <div class="mega-menu">
          <div class="mega-content fade-in">
            <div class="column">
              <h3>Blog & News</h3>
              <p>As últimas tendências em sustentabilidade e economia circular.</p>
              <a href="#" class="more-link">Ver artigos <span class="arrow">→</span></a>
            </div>
            <div class="column">
              <h3>Suporte</h3>
              <p>Central de ajuda e canais de contato direto para suporte técnico.</p>
              <a href="#" class="more-link">Abrir chamado <span class="arrow">→</span></a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="header-right">

      <router-link to="/Loja" class="icon-coins"><i class="bi bi-bag"></i></router-link>
      <router-link to="/denuncia" class="icon-coins"><i class="bi bi-chat"></i></router-link>
      <router-link to="/pontos" class="icon-coins"><i class="bi bi-geo-alt-fill"></i></router-link>
      <router-link to="/minhaconta" class="router-icon"><i class="bi bi-person-circle user-icon"></i></router-link>
      <!-- <router-link to="/notficacoes" class="router-icon"><i class="bi bi-bell-fill"></i></router-link> -->
      <router-link to="/reciclagem" class="btn-cta">RECICLAR AGORA</router-link>
      
    </div>
    
  </header>
</template>

<script>
export default {
  data() {
    return {
      isScrolled: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    }
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* === RESET E CONFIGURAÇÃO CORE === */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* === HEADER PRINCIPAL === */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 clamp(20px, 5vw, 60px);
  background-color: transparent;
  color: #fff;
  z-index: 1000;
  box-sizing: border-box;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-header.header-scrolled {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  height: 85px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.main-header:has(.menu-item:hover) {
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
}

/* === LOGO === */
.logo-link {
  display: block;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-link:hover {
  transform: scale(1.02);
}

.img-logo {
  height: 70px;
  width: auto;
  display: block;
  filter: brightness(1);
  transition: filter 0.3s ease;
}

.logo-link:hover .img-logo {
  filter: brightness(1.1);
}

/* === NAVEGAÇÃO CENTRAL === */
.header-center {
  display: flex;
  gap: clamp(30px, 4vw, 50px);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.menu-item {
  position: static;
  padding: 35px 0;
}

.links {
  font-family: 'Inter', sans-serif;
  font-size: 0.813rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.3px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.links::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0.5));
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover .links {
  color: #fff;
}

.menu-item:hover .links::after {
  width: 100%;
}

.header-center:hover .menu-item:not(:hover) .links {
  opacity: 0.5;
}

/* === CHEVRON ICON (SVG) === */
.chevron-icon {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover .chevron-icon {
  transform: rotate(180deg);
}

/* === MEGA MENU === */
.mega-menu {
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  width: 750px;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  padding: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  opacity: 0;
  visibility: hidden;
  transition: 
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0s 0.35s;
  pointer-events: none;
}

.menu-item:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
  transition-delay: 0s;
}

/* === MEGA CONTENT === */
.mega-content {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 45px;
  animation: fadeSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === COLUNAS === */
.column h3 {
  font-size: 0.688rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 18px;
  letter-spacing: 1.8px;
  font-weight: 700;
}

.column p {
  font-size: 0.938rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.65;
}

.menu-section {
  margin-bottom: 35px;
}

.menu-section:last-child {
  margin-bottom: 0;
}

/* === LISTAS E LINKS === */
.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  margin-bottom: 14px;
}

.menu-link-item {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.938rem;
  font-weight: 500;
  display: inline-block;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding-bottom: 2px;
}

.menu-link-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1.5px;
  background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0.3));
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-link-item:hover {
  color: #fff;
  transform: translateX(4px);
}

.menu-link-item:hover::after {
  width: 100%;
}

/* === MORE LINK === */
.more-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  color: #fff;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: gap 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.arrow-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.more-link:hover {
  gap: 12px;
}

.more-link:hover .arrow-icon {
  transform: translateX(3px);
}

/* === IMAGENS === */
.img-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: 24px;
  background: #000;
  aspect-ratio: 16/10;
}

.menu-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.75;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.6));
  opacity: 0.6;
  transition: opacity 0.6s ease;
}

.column:hover .menu-img {
  opacity: 1;
  transform: scale(1.08);
}

.column:hover .img-overlay {
  opacity: 0.3;
}

/* === RESOURCE CARDS === */
.resource-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 28px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.resource-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.resource-icon {
  font-size: 2rem;
  margin-bottom: 16px;
  filter: grayscale(0.3);
  transition: filter 0.3s ease;
}

.resource-card:hover .resource-icon {
  filter: grayscale(0);
}

/* === BOTÕES DO HEADER === */
.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.btn-login {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.813rem;
  font-weight: 600;
  letter-spacing: 1.1px;
  transition: color 0.3s ease;
  position: relative;
}

.btn-login::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: #fff;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-login:hover {
  color: #fff;
}

.btn-login:hover::after {
  width: 100%;
}

.btn-cta {
  position: relative;
  padding: 16px 32px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.813rem;
  letter-spacing: 1.2px;
  cursor: pointer;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.btn-cta:hover .btn-shine {
  left: 100%;
}

.btn-cta:active {
  transform: translateY(0);
}

/* === RESPONSIVIDADE === */
@media (max-width: 1200px) {
  .mega-menu {
    width: 650px;
  }
  
  .header-center {
    gap: 35px;
  }
}

@media (max-width: 992px) {
  .main-header {
    padding: 0 30px;
  }
  
  .header-center {
    display: none; /* Implementar menu mobile */
  }
}
</style>