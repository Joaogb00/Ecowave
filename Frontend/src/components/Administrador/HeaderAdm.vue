<template>
  <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-left">
       <router-link to="/administrador" ><img class="img-logo" src="../../assets/img/logo.png" alt="EcoWave Logo"></router-link>
      
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

      <!-- <router-link to="/Loja" class="icon-coins"><i class="bi bi-bag"></i></router-link> -->
      <router-link to="/minhacontaadm" class="router-icon"><i class="bi bi-person-circle user-icon"></i></router-link>
      <!-- <router-link to="/cadastrado" class="btn-cta">COMECE AGORA</router-link> -->
      
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
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css");

/* --- CONFIGURAÇÃO CORE --- */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  background-color: transparent;
  z-index: 1000;
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

}

/* --- ESTADOS DO HEADER (SCROLL E HOVER) --- */

/* Quando scrollar: fundo branco */
.main-header.header-scrolled {
  background-color: white;
 
}

/* Quando passar o mouse: fundo preto e elementos brancos */
.main-header:hover {
  background-color: #000 !important;
}

/* --- LOGO --- */
.img-logo {
  height: 80px;
  width: 160px; /* Ajuste conforme necessário */
  transition: transform 0.4s ease;
}

/* Efeito para deixar a logo branca no hover do header */
.main-header:hover .img-logo {
  filter: brightness(0) invert(1);
}

/* --- NAVEGAÇÃO CENTRAL --- */
.header-center {
  display: flex;
  gap: 50px;
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
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #000; /* Cor padrão preta */
  transition: all 0.4s ease;
}

/* Links ficam brancos quando o header está em hover */
.main-header:hover .links {
  color: #fff;
}

/* Efeito de foco: esmaece os outros itens quando um está em hover */
.header-center:hover .menu-item:not(:hover) .links {
  opacity: 0.4;
}

.chevron {
  width: 5px;
  height: 5px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.5s ease;
}

.menu-item:hover .chevron {
  transform: rotate(-135deg) translateY(-2px);
}

/* --- MEGA MENU --- */
.mega-menu {
  position: absolute;
  top: 100px; 
  left: 50%;
  transform: translateX(-50%) translateY(15px);
  width: 720px;
  background: rgba(15, 15, 15, 0.98);
  backdrop-filter: blur(20px);
  padding: 45px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  pointer-events: none;
}

.menu-item:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}

.mega-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
}

.column h3 { 
  font-size: 0.7rem; 
  text-transform: uppercase; 
  color: rgba(255, 255, 255, 0.4); 
  margin-bottom: 15px; 
  letter-spacing: 1.5px;
}

.column p { 
  font-size: 0.9rem; 
  color: rgba(255, 255, 255, 0.8); 
  line-height: 1.6; 
}

.menu-list { list-style: none; }

.menu-link-item {
  text-decoration: none;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  display: inline-flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.menu-link-item .line {
  width: 0;
  height: 1px;
  background: #fff;
  transition: width 0.3s ease;
}

.menu-link-item:hover .line { width: 100%; }

/* --- DIREITA (USER E CTA) --- */
.header-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.user-icon {
  font-size: 1.6rem;
  color: #000;
  transition: color 0.4s ease;
}

.main-header:hover .user-icon {
  color: #fff;
}

.btn-cta {
 padding: 18px 36px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    background: black;
  color: white;
  border: 1px solid #000000;
  text-decoration: none;
}

/* Botão inverte quando o header fica preto */
.main-header:hover .btn-cta {
  background: white;
   padding: 18px 36px;
  color: black;
}

/* Hover específico no botão */
.btn-cta:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
}
/* --- ANIMAÇÕES --- */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.icon-coins {
  font-size: 1.6rem;
  color: #000;
  transition: color 0.4s ease;
  text-decoration: none;
}

.main-header:hover .icon-coins {
  color: #fff;
}
.number-coins{
  font-size: 15px;
}
</style>