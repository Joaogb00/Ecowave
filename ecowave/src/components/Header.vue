<template>
  <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-left">
     <img class="img-logo" src="../assets/img/logo6.png" alt="">
      
    </div>

    <nav class="header-center">
      <div class="menu-item">
        <span class="links">Produtos <i class="chevron"></i></span>
        <div class="mega-menu">
          <div class="mega-content fade-in">
            <div class="column">
              <h3>Soluções</h3>
              <p>Conheça nossas ferramentas de descarte.</p>
            </div>
            <div class="column">
              <h3>Empresas</h3>
              <p>Logística reversa para o seu negócio.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="menu-item">
        <span class="links">Soluções <i class="chevron"></i></span>
        <div class="mega-menu">
          <div class="mega-content fade-in">
            <div class="column">
              <h3>Serviços</h3>
              <p>Consultoria ambiental e relatórios.</p>
            </div>
            <div class="column">
              <h3>Coleta</h3>
              <p>Agende sua retirada em 24h.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="menu-item">
        <span class="links">Recursos <i class="chevron"></i></span>
        <div class="mega-menu">
          <div class="mega-content fade-in">
            <div class="column">
              <h3>Blog</h3>
              <p>Notícias sobre sustentabilidade.</p>
            </div>
            <div class="column">
              <h3>Suporte</h3>
              <p>Central de ajuda e contato.</p>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="header-right">
      <a href="#" class="btn-login">FAZER LOGIN</a>
      <button class="btn-cta">COMECE AGORA</button>
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
      // Define como true se rolar mais de 50 pixels para baixo
      this.isScrolled = window.scrollY > 50;
    }
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

/* --- CONFIGURAÇÃO CORE (Aceleração de Hardware) --- */
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
  /* Transição de 120hz: super suave e precisa */
  transition: all 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.main-header.header-scrolled {
  background-color: #000;
  height: 100px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.main-header:has(.menu-item:hover) {
  background-color: #000;
}

/* LOGO */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 2px;
  transition: opacity 0.5s ease;
}
.img-logo{
  height: 10vh;
  width: 20vh;
}
/* NAVEGAÇÃO CENTRAL */
.header-center {
  display: flex;
  gap: 60px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.menu-item { 
  position: static; 
  padding: 35px 0; 
}
.logo-img{
  background-color: red;
  height: 50vh;
}
.links {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.5s ease;
  color: white;
}

.menu-item:hover .links {
  opacity: 1;
}

/* Efeito de fade-out nos vizinhos quando um está em hover */
.header-center:hover .menu-item:not(:hover) .links {
  opacity: 0.4;
}

.chevron {
  width: 6px;
  height: 6px;
  border-right: 1.5px solid #fff;
  border-bottom: 1.5px solid #fff;
  transform: rotate(45deg);
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.menu-item:hover .chevron {
  transform: rotate(-135deg);
}

/* MEGA MENU (A CAIXA MÃE) */
.mega-menu {
  position: absolute;
  top: 100px; 
  left: 50%;
  transform: translateX(-50%) translateY(15px);
  width: 720px;
  background: #000;
  padding: 45px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.7);
  opacity: 0;
  visibility: hidden;
  /* Timing de 0.7s para dar aquele peso premium */
  transition: 
    opacity 0.6s ease, 
    transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), 
    visibility 0.6s;
  pointer-events: none;
}

.menu-item:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(10px);
  pointer-events: auto;
}

/* SETA QUE DESLIZA (MAGNETIC ARROW) */
.mega-menu::before {
  content: '';
  position: absolute;
  top: -10px;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #000;
  left: 50%;
  transform: translateX(-50%);
  /* O pulo do gato: a seta desliza se você mudar de item rápido */
  transition: left 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Ajuste fino das posições da seta */
.menu-item:nth-child(1):hover .mega-menu::before { left: 30%; }
.menu-item:nth-child(2):hover .mega-menu::before { left: 50%; }
.menu-item:nth-child(3):hover .mega-menu::before { left: 70%; }

/* ANIMAÇÃO DE CONTEÚDO (STAGGER) */
.mega-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.column {
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Delay entre colunas para efeito cascata leve */
.menu-item:hover .column:nth-child(1) { opacity: 1; transform: translateY(0); transition-delay: 0.1s; }
.menu-item:hover .column:nth-child(2) { opacity: 1; transform: translateY(0); transition-delay: 0.2s; }

.column h3 { 
  font-size: 0.75rem; 
  text-transform: uppercase; 
  color: #fff; 
  margin-bottom: 12px; 
  letter-spacing: 1.5px;
  opacity: 0.6;
}

.column p { 
  font-size: 0.9rem; 
  color: #ffffff; 
  line-height: 1.6; 
  transition: color 0.4s ease;
}

.column:hover p { color: #fff; }

/* BOTÕES DIREITOS */
.header-right {
  display: flex;
  align-items: center;
  gap: 35px;
}

.btn-login {
  color: #fff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
 
  transition: opacity 0.4s ease;
}



.btn-cta {
  background-color: #fff;
  color: #000;
  border: 1px solid #fff;
  padding: 28px 28px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;

  cursor: pointer;
  /* Transição de seda */
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  inset: none;
}

.btn-cta:hover {
  background-color: rgba(255, 255, 255, 0.789);
  border: 1px solid  rgba(255, 255, 255, 0.789);
  inset: none;
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
}

.btn-cta:active { transform: translateY(0); }
</style>