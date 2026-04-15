<template>
  <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-left">
       <router-link to="/" ><img class="img-logo" src="../assets/img/logo6.png" alt="EcoWave Logo"></router-link>
      
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
      <router-link to="/formulario" class="btn-login">FAZER LOGIN</router-link>
      <router-link to="/formulario" class="btn-cta">COMECE AGORA</router-link>
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

/* --- CONFIGURAÇÃO CORE --- */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  background-color: transparent;
  color: #fff;
  z-index: 1000;
  box-sizing: border-box;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.main-header.header-scrolled {
  /* Fundo preto com 40% de transparência */
  background-color: rgba(0, 0, 0, 0.142); 
  
  /* O segredo para o efeito de vidro embaçado */
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  
  height: 100px; /* Reduzi levemente a altura no scroll para dar dinamismo */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Linha sutil separadora */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

/* Efeito de preenchimento quando o menu abre */
/* Altere esta parte */
.main-header:has(.menu-item:hover) {
  background-color: rgba(0, 0, 0, 0.8); /* Um pouco mais escuro para ler o menu, mas não 100% preto */
  backdrop-filter: blur(20px);
}

/* LOGO */
.img-logo {
  height: 80px;
  width: 160px; /* Ajuste conforme necessário */
  transition: transform 0.4s ease;
}

/* NAVEGAÇÃO CENTRAL */
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
  color: rgb(255, 255, 255);
  transition: all 0.4s ease;
}

.menu-item:hover .links {
  color: #fff;
}

.header-center:hover .menu-item:not(:hover) .links {
  opacity: 0.4;
}

.chevron {
  width: 5px;
  height: 5px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.menu-item:hover .chevron {
  transform: rotate(-135deg) translateY(-2px);
}

/* MEGA MENU (GLASSMORPISM) */
.mega-menu {
  position: absolute;
  top: 85px; 
  left: 50%;
  transform: translateX(-50%) translateY(15px);
  width: 720px;
 background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(25px);
  padding: 45px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.7);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  pointer-events: none;
}

.menu-item:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}

/* COLUNAS */
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

.spacer-h3 { margin-top: 30px; }

/* LISTAS E LINKS DE ITENS */
.menu-list {
  list-style: none;
  padding: 0;
}

.menu-link-item {
  text-decoration: none;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  display: inline-flex;
  flex-direction: column;
  margin-bottom: 12px;
  transition: opacity 0.3s;
}

.menu-link-item .line {
  width: 0;
  height: 1px;
  background: #fff;
  transition: width 0.3s ease;
  margin-top: 2px;
}

.menu-link-item:hover .line {
  width: 100%;
}

.more-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  color: #fff;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
}

.more-link .arrow { transition: transform 0.3s ease; }
.more-link:hover .arrow { transform: translateX(5px); }

/* IMAGENS E WRAPPERS */
.img-wrapper {
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 20px;
  background: #111;
}

.menu-img {
  width: 100%;
  display: block;
  opacity: 0.8;
  transition: all 0.6s ease;
}

.column:hover .menu-img {
  opacity: 1;
  transform: scale(1.05);
}

/* BOTÕES DIREITOS */
.header-right {
  display: flex;
  align-items: center;
  gap: 30px;
}

.btn-login {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.btn-login:hover { color: #fff; }

.btn-cta {
 padding: 18px 36px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    background: #fff;
  color: #000;
  border: 1px solid #fff;
  text-decoration: none;
}

.btn-cta:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
}

/* ANIMAÇÃO FADE-IN */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>