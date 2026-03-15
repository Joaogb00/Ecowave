<template>
  <footer class="eco-footer" :class="{ 'fade-visible': isVisible }" ref="footerRef">
    <div class="footer-grid">
      
      <div class="col-main">
        <img src="../assets/img/logo6.png" alt="EcoWave" class="f-logo">
        <p class="f-description">
          Liderando a transição para a economia circular através de sistemas inteligentes de logística reversa e rastreabilidade.
        </p>
        <div class="founders-badge">
          <span class="dot"></span>
          Direção: J. Gabriel & J. Pablo
        </div>
      </div>

      <div class="col-links">
        <div class="link-group">
          <h4>Navegação</h4>
          <a href="#">Visão Geral</a>
          <a href="#">Soluções</a>
          <a href="#">Recursos</a>
          <a href="#">Manifesto</a>
        </div>
        <div class="link-group">
          <h4>Suporte</h4>
          <a href="#">Documentação</a>
          <a href="#">API</a>
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
        </div>
      </div>

      <div class="col-newsletter">
        <h4>Newsletter</h4>
        <p>Receba insights sobre impacto ambiental e tecnologia.</p>
        <form @submit.prevent class="f-input-group">
          <input type="email" placeholder="E-mail corporativo">
          <button type="submit">Inscrever</button>
        </form>
      </div>
    </div>

    <div class="footer-base">
      <div class="base-content">
        <span>© 2026 ECOWAVE TECHNOLOGY. TODOS OS DIREITOS RESERVADOS.</span>
        <div class="social-minimal">
          <a href="#">LINKEDIN</a>
          <span class="sep">/</span>
          <a href="#">INSTAGRAM</a>
          <span class="sep">/</span>
          <a href="#">TWITTER</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      isVisible: false
    }
  },
  mounted() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.isVisible = true;
      }
    }, { threshold: 0.1 });

    observer.observe(this.$refs.footerRef);
  }
}
</script>

<style scoped>
/* --- ESTILO PRETO E BRANCO PREMIUM --- */
.eco-footer {
  background-color: #000;
  color: #fff;
  padding: 100px 50px 40px;
  font-family: 'Inter', sans-serif;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Estado Inicial da Animação */
  opacity: 0;
  transform: translateY(30px);
  transition: all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Classe ativada pelo Intersection Observer */
.fade-visible {
  opacity: 1;
  transform: translateY(0);
}

.footer-grid {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 2fr 1.5fr;
  gap: 80px;
}

/* Tipografia e Textos */
.f-logo {
  height: 45px;
  margin-bottom: 25px;
  filter: grayscale(1) brightness(2);
}

.f-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.5);
  max-width: 320px;
}

.founders-badge {
  margin-top: 30px;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.dot {
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
}

/* Links */
.col-links {
  display: flex;
  gap: 80px;
}

.link-group h4, .col-newsletter h4 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 25px;
  font-weight: 600;
  color: #fff;
}

.link-group a {
  display: block;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 12px;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: #fff;
}

/* Newsletter Minimalista */
.f-input-group {
  margin-top: 25px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 8px;
  transition: border-color 0.4s ease;
}

.f-input-group:focus-within {
  border-color: #fff;
}

.f-input-group input {
  background: transparent;
  border: none;
  color: #fff;
  flex: 1;
  outline: none;
  font-size: 0.9rem;
}

.f-input-group button {
  background: transparent;
  border: none;
  color: #fff;
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 1px;
}

/* Base Inferior */
.footer-base {
  max-width: 1300px;
  margin: 100px auto 0;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.base-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.3);
}

.social-minimal a {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s;
}

.social-minimal a:hover {
  color: #fff;
}

.sep {
  margin: 0 10px;
}

/* Responsividade */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .col-newsletter {
    grid-column: span 2;
    margin-top: 40px;
  }
}
</style>