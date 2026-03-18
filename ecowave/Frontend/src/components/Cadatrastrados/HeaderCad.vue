<!-- <template>
  <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-left">
      <router-link to="/cadastrado" ><img class="img-logo" src="../../assets/img/logo.png " alt="EcoWave Logo"></router-link>
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
            </div>
          </div>
        </div>
      </div>

      <div class="menu-item">
        <span class="links">Soluções <i class="chevron"></i></span>
        </div>

      <div class="menu-item">
        <span class="links">Recursos <i class="chevron"></i></span>
        </div>
    </nav>

    <div class="header-right">
      <div class="user-container" :class="{ 'is-minimized': isUserMinimized }">
        <transition name="shrink-fade">
          <span v-if="!isUserMinimized" class="user-text">
            {{ saudacao }}, <strong class="user-name">{{ userName }}</strong>
          </span>
        </transition>
        
        <router-link to="/minhaconta" class="router-icon">
          <i class="bi bi-person-circle user-icon"></i>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isScrolled: false,
      isUserMinimized: false,
      userName: 'Usuário', // Valor padrão caso não encontre no banco
      tipoAcesso: 'login'  // 'login' ou 'cadastro'
    }
  },
  computed: {
    saudacao() {
      return this.tipoAcesso === 'login' ? 'Seja bem-vindo de volta' : 'Seja bem-vindo';
    }
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    fetchUserData() {
      // Simulação de busca no banco de dados / localStorage
      // Quando você fizer o login/cadastro, salve assim: localStorage.setItem('user_name', 'Seu Nome')
      const nameFromStorage = localStorage.getItem('user_name');
      const accessFromStorage = localStorage.getItem('auth_type'); // login ou cadastro

      if (nameFromStorage) {
        this.userName = nameFromStorage;
      }
      if (accessFromStorage) {
        this.tipoAcesso = accessFromStorage;
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    
    // Busca os dados do usuário ao carregar
    this.fetchUserData();
    
    // Timer de 5 segundos para a transição
    setTimeout(() => {
      this.isUserMinimized = true;
    }, 5000);
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
/* Importação dos ícones caso não tenha no projeto */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css");

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
  background-color: #000;
  height: 100px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
}

/* LOGO */
.img-logo {
  height: 80px;
  width: 160px;
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
  color: black;
  transition: all 0.4s ease;
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

/* MEGA MENU */
.mega-menu {
  position: absolute;
  top: 100px; 
  left: 50%;
  transform: translateX(-50%) translateY(15px);
  width: 720px;
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(20px);
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
}

.column p { 
  font-size: 0.9rem; 
  color: rgba(255, 255, 255, 0.8); 
}

.menu-list { list-style: none; padding: 0; }

.menu-link-item {
  text-decoration: none;
  color: #fff;
  font-size: 0.95rem;
  margin-bottom: 12px;
  display: inline-flex;
  flex-direction: column;
}

.menu-link-item .line {
  width: 0;
  height: 1px;
  background: #fff;
  transition: width 0.3s ease;
}

.menu-link-item:hover .line { width: 100%; }

.img-wrapper { border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
.menu-img { width: 100%; opacity: 0.8; transition: transform 0.6s ease; }
.column:hover .menu-img { transform: scale(1.05); opacity: 1; }

/* --- SEÇÃO DO USUÁRIO (ANIMAÇÃO) --- */
.header-right {
  display: flex;
  align-items: center;
}

.user-container {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  /* Transição do container para o ícone se mover suavemente */
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-text {
  white-space: nowrap;
  font-size: 0.9rem;
}

.user-icon {
  font-size: 1.6rem;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  color: black;
}

/* Classe aplicada após 5 segundos */
.is-minimized {
  /* Move o container para a esquerda para compensar o texto que sumiu */
  /* Ajuste o valor de X conforme o tamanho do seu texto */
  transform: translateX(-50px); 
}

/* Transição Vue: O texto some "encolhendo" para dentro do ícone */
.shrink-fade-leave-active {
  transition: all 0.6s ease;
}

.shrink-fade-leave-to {
  opacity: 0;
  transform: scale(0.5) translateX(20px);
}

/* ANIMAÇÃO FADE-IN GERAL */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.router-icon{
  
  color: white;
  transition: .5s;
}
.router-icon:hover{
  text-decoration: none;
  color: rgb(165, 165, 165);
  
}
</style> -->

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
      <router-link to="/minhaconta" class="router-icon"><i class="bi bi-person-circle user-icon"></i></router-link>
      <router-link to="/cadastrado" class="btn-cta">COMECE AGORA</router-link>
      
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
</style>