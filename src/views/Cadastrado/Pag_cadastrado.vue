<template>
  <section class="hero-cadastrado">
    <header-cad />

    <div class="welcome-container">
      <span class="eyebrow">Acesso Concedido</span>
      <h1 class="welcome-title">
        Bem-vindo, <span class="text-highlight">{{ userName }}</span>.
      </h1>
      <p class="welcome-subtitle">
        Seu perfil na <strong>EcoWave</strong> foi ativado com sucesso no terminal central.
      </p>
      
      <div class="status-badge">
        <span class="dot"></span> 
        <span class="status-text">Sistema Online</span>
      </div>
    </div>

    <div class="overlay"></div>
  </section>
</template>

<script>
import HeaderCad from '@/components/Cadatrastrados/HeaderCad.vue';

export default {
  name: 'Pag_cadastrado',
  components: {
    HeaderCad
  },
  data() {
    return {
      // Busca o nome que salvamos no login/cadastro
      userName: sessionStorage.getItem('ecoWave_user') || 'Operador',
      userEmail: sessionStorage.getItem('ecoWave_email') || ''
    }
  },
  mounted() {
    // Verificação de segurança simples: se não houver usuário na sessão, volta para o login
    if (!sessionStorage.getItem('ecoWave_user')) {
      this.$router.push('/login'); 
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

.hero-cadastrado {
  position: relative;
  width: 100%;
  height: 100vh; /* Ajustado de 150vh para 100vh para melhor usabilidade */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.welcome-container {
  position: relative;
  z-index: 10;
  text-align: center;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  color: #1a1a1a;
  padding: 0 20px;
}

.eyebrow {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 700;
  color: #999;
  margin-bottom: 1rem;
}

.welcome-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
}

.text-highlight {
  background: linear-gradient(120deg, #1a1a1a 0%, #666 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: #555;
  max-width: 540px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
}

/* Badge de Status */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: #f8f9fa;
  border: 1px solid #eaeaea;
  border-radius: 100px;
  transition: all 0.3s ease;
}

.status-badge:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.status-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #00d97e;
  border-radius: 50%;
  position: relative;
}

.dot::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00d97e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%);
  z-index: 1;
  pointer-events: none;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.5rem;
    letter-spacing: -1px;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
}
.btn-cta {
  position: absolute;
  top: 40px; left: 40px;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 2px solid #000;
}
.btn-cta:hover{
  position: absolute;
  top: 40px; left: 40px;
  text-decoration: none;
  color: black;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 2px solid #000;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>