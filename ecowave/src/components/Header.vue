<template>
  <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-left">
      <div class="logo">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
           <path d="M16.5 12l-4.5 4.5-1.4-1.4 3.1-3.1-3.1-3.1 1.4-1.4 4.5 4.5zM7.5 12l4.5-4.5 1.4 1.4-3.1 3.1 3.1 3.1-1.4 1.4-4.5-4.5z"/>
        </svg>
        EcoWave
      </div>
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
  transition: background-color 0.4s ease;
}

.main-header.header-scrolled {
  background-color: #000;
  height: 80px;
}

.main-header:has(.menu-item:hover) {
  background-color: #000;
}

/* LOGO E LINKS ESTÁTICOS */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 2px;
}
.logo-icon { width: 30px; height: 30px; }

.header-center {
  display: flex;
  gap: 60px; /* Espaçamento bem distribuído */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.menu-item { 
  position: static; /* Importante para o Mega Menu fixar no centro do Header */
  padding: 35px 0; 
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
}

.chevron {
  width: 6px;
  height: 6px;
  border-right: 1.5px solid #fff;
  border-bottom: 1.5px solid #fff;
  transform: rotate(45deg);
}

/* MEGA MENU FIXO NO CENTRO */
.mega-menu {
  position: absolute;
  top: 100px; 
  left: 50%;
  transform: translateX(-50%) translateY(15px);
  width: 700px; /* Tamanho fixo moderno */
  background: #000;
  padding: 40px;
  border: 1px solid #333;
  border-radius: 20px; /* Bordas arredondadas solicitadas */
  box-shadow: 0 30px 60px rgba(0,0,0,0.8);
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  pointer-events: none;
}

.menu-item:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}

/* SETA INDICADORA QUE SEGUE O ITEM */
.mega-menu::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #000;
  
  /* Faz a seta ficar embaixo do item pai */
  left: calc(var(--arrow-pos, 50%)); 
  transform: translateX(-50%);
}

/* POSICIONAMENTO DA SETA POR ITEM (OPCIONAL: Para precisão total, pode-se usar variáveis ou ajustes manuais) */
.menu-item:nth-child(1):hover .mega-menu::before { left: 38%; }
.menu-item:nth-child(2):hover .mega-menu::before { left: 50%; }
.menu-item:nth-child(3):hover .mega-menu::before { left: 62%; }

/* ANIMAÇÃO DE FADE IN INTERNA */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.mega-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.column h3 { font-size: 0.8rem; text-transform: uppercase; color: #fff; margin-bottom: 10px; }
.column p { font-size: 0.85rem; color: #888; line-height: 1.6; }

/* DIREITA */
.header-right {
  display: flex;
  align-items: center;
  gap: 30px;
}

.btn-login {
  color: #fff;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.btn-cta {
  background-color: #fff;
  color: #000;
  border: none;
  padding: 28px 28px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  
  cursor: pointer;
  transition: 0.3s;
}

.btn-cta:hover { background-color: #ccc; }
</style>