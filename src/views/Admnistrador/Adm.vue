<template>
  <section class="section-admin">
    <HeaderAdm/>
     <div class="sky-layer"></div>
    <div class="welcome-container">
      <span class="eyebrow">Painel de Controle</span>
      <h1 class="welcome-title">
        Olá, <span class="text-highlight">Administrador</span>.
      </h1>
      <p class="welcome-subtitle">
        Gerencie as operações da <strong>EcoWave</strong> e monitore o status do sistema em tempo real.
      </p>
      
      
      
    </div>

    <div class="acoes-adm">
      <router-link to="/users" class="card-funcoes">
        <div class="card-icon"><i class="bi bi-people-fill"></i></div>
        <h3>Gerenciar usuários</h3>
        <p>Gerencie permissões e perfis cadastrados.</p>
      </router-link>
      <router-link to="/lojaadm" class="card-funcoes" >
        <div class="card-icon"><i class="bi bi-bag-check-fill"></i></div>
        <h3>Gerenciar loja</h3>
        <p>Administre produtos e inventário.</p>
      </router-link>
      <router-link class="card-funcoes">
        <div class="card-icon"><i class="bi bi-phone-vibrate-fill"></i></div>
        <h3>Suporte</h3>
        <p>Atenda chamados e dúvidas técnicas.</p>
      </router-link>
      <router-link class="card-funcoes">
        <div class="card-icon"><i class="bi bi-geo-alt-fill"></i></div>
        <h3>Pontos de Coleta</h3>
        <p>Cadastre novas unidades de reciclagem.</p>
      </router-link>
      <router-link class="card-funcoes">
        <div class="card-icon"><i class="bi bi-chat-dots-fill"></i></div>
        <h3>Perguntas</h3>
        <p>Responda à comunidade EcoWave.</p>
      </router-link>
    </div>

    <div class="overlay"></div>
  </section>
</template>

<script>
import HeaderAdm from '@/components/Administrador/HeaderAdm.vue';

export default {
  name: 'Adm',
  components:{
    HeaderAdm
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

.section-admin {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
 
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  
}
.sky-layer {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  /* background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070'); */
  background-size: cover;
  background-position: top;
  z-index: 1;
}
/* Reutilizando Estilos de Boas-vindas */
.welcome-container {
  position: relative;
  z-index: 10;
  text-align: center;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  color: #1a1a1a;
  margin-bottom: 60px;
  margin-top: 50px;
}

.eyebrow {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 1rem;
}

.welcome-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
}

.text-highlight {
  background: linear-gradient(120deg, #1a1a1a 0%, #666 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: #555;
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

/* Grid de Cards */
.acoes-adm {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  animation-delay: 0.2s;
}

.card-funcoes {
  text-decoration: none;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #1a1a1a;
}

.card-funcoes:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);
  border-color: #1a1a1a;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.card-funcoes h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.card-funcoes p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: #f8f9fa;
  border: 1px solid #eaeaea;
  border-radius: 100px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #007bff; /* Azul para Admin */
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
  background-color: #007bff;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

/* Animações */
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
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* .overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%);
  z-index: 1;
  pointer-events: none;
} */

@media (max-width: 768px) {
  .acoes-adm {
    grid-template-columns: 1fr;
  }
}
</style>