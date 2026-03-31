<template>
  <section class="hero-cadastrado">
    <header-cad />

    <div class="welcome-container">
      <span class="eyebrow">Acesso Concedido</span>
      <h1 class="welcome-title">
        Bem-vindo, <span class="text-highlight">{{ userName }}</span>.
      </h1>
      <p class="welcome-subtitle">Seu perfil na EcoWave foi ativado com sucesso no terminal central.</p>
      
      <div class="status-badge">
        <span class="dot"></span> Online
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
      this.$router.push('/login'); // ou o nome da sua rota de formulário
    }
  }
}
</script>

<style scoped>
/* Mantendo seus estilos originais e adicionando o design da mensagem */

.hero-cadastrado {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.welcome-container {
  position: relative;
  z-index: 10; /* Acima do overlay se necessário, ou ajuste conforme seu design */
  text-align: center;
  animation: fadeInUp 1s ease-out;
  color: #000; /* Ajuste para branco se o fundo for escuro */
}

.welcome-title {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -2px;
  margin: 10px 0;
}

.text-highlight {
  color: #000;
  opacity: 0.4;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto 20px;
}

.eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 700;
  color: #888;
}

/* Badge de Status */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f0f0f0;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff88;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Ajuste a opacidade conforme desejar para ler o texto */
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9));
  z-index: 1;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.5rem;
  }
}
</style>