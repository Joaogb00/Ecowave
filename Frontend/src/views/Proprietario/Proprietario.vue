<template>
  <section class="section-admin">
    <HeaderProprietario />
    <div class="sky-layer"></div>

    <div class="welcome-container">
      <span class="eyebrow">Painel do Proprietário</span>
      <h1 class="welcome-title">
        Meus <span class="text-highlight">Pontos.</span>
      </h1>
      <p class="welcome-subtitle">
        Gerencie seus <strong>pontos de coleta</strong> e acompanhe os <strong>registros de reciclagem</strong>
        realizados na EcoWave.
      </p>
    </div>

    <div class="conta-layout">
      <div class="profile-form-container">
        <div class="form-header">
          <h2>Resumo da Operação</h2>
          <p>Visão geral rápida das suas atividades como proprietário.</p>
        </div>

        <div class="overview-grid">
          <div class="overview-item">
            <span class="label">PONTOS DE COLETA</span>
            <span class="value">{{ resumo.pontos || 0 }}</span>
          </div>
          <div class="overview-item">
            <span class="label">REGISTROS DE RECICLAGEM</span>
            <span class="value">{{ resumo.registros || 0 }}</span>
          </div>
          <div class="overview-item">
            <span class="label">USUÁRIO</span>
            <span class="value">{{ nomeUsuario || 'Proprietário' }}</span>
          </div>
        </div>

        <p class="overview-note">
          Use os atalhos ao lado para cadastrar novos pontos, atualizar horários de funcionamento
          e acompanhar o impacto ambiental das coletas.
        </p>
      </div>

      <div class="acoes-container">
        <router-link to="/pontos-proprietario" class="card-funcoes">
          <div class="card-icon"><i class="bi bi-geo-alt-fill"></i></div>
          <h3>Pontos de Coleta EcoWave</h3>
          <p>Cadastre e gerencie os pontos de coleta que você administra.</p>
        </router-link>

        <router-link to="/registros" class="card-funcoes">
          <div class="card-icon"><i class="bi bi-recycle"></i></div>
          <h3>Registros de Reciclagem feita pelos usuarios</h3>
          <p>Acompanhe as reciclagens registradas nos seus pontos.</p>
        </router-link>

        <div @click="showLogoutModal = true" class="card-funcoes card-exit">
          <div class="card-icon"><i class="bi bi-box-arrow-right"></i></div>
          <h3>Sair</h3>
          <p>Encerrar sessão com segurança.</p>
        </div>
      </div>
    </div>

    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="modal-box logout-modal">
        <div class="card-icon">
          <i class="bi bi-exclamation-circle" style="color: #000000;"></i>
        </div>
        <h3>DESEJA SAIR?</h3>
        <p>Sua sessão será encerrada com segurança.</p>
        <div class="modal-actions">
          <button @click="logout" class="btn-exit-confirm">SAIR AGORA</button>
          <button @click="showLogoutModal = false" class="btn-cancel">VOLTAR</button>
        </div>
      </div>
    </div>

    <div class="overlay"></div>
  </section>
</template>

<script>

import api from '../../../../backend/src/services/api';
import HeaderProprietario from '../../components/Proprietario/HeaderPorpietario.vue'


export default {
  name: 'DashboardProprietario',
  components: { HeaderProprietario },
  data() {
    return {
      showLogoutModal: false,
      nomeUsuario: sessionStorage.getItem('ecoWave_user') || '',
      resumo: { pontos: 0, registros: 0 }
    };
  },
  mounted() {
    this.carregarResumo();
  },
  methods: {
    async carregarResumo() {
      try {
        const res = await api.get('/proprietario');
        if (res.data) {
          this.resumo.pontos = res.data.totalPontos || 0;
          this.resumo.registros = res.data.totalReciclagens || 0;
        }
      } catch (e) {
        console.error('Erro ao carregar resumo do proprietário', e);

        // Tratamento robusto para sessões expiradas ou falta de nível de acesso correto
        if (e.response && (e.response.status === 401 || e.response.status === 403)) {
          alert('Sessão expirada ou permissões atualizadas! Por segurança, faça login novamente.');
          this.logout();
        }
      }
    },
    logout() {
      sessionStorage.clear();
      this.$router.push('/formulario?mode=login');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

.section-admin {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 4rem 60px;
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
  color: #000000;
}

.sky-layer,
.overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  pointer-events: none;
  z-index: 1;
}

.welcome-container {
  text-align: center;
  margin-bottom: 50px;
  z-index: 10;
  width: 100%;
}

.eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #000000;
  text-transform: uppercase;
}

.welcome-title {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-size: clamp(2.6rem, 6vw, 6rem);
  line-height: 0.86;
  letter-spacing: -0.03em;
  color: #000000;
  margin: 15px 0 20px;
  text-transform: uppercase;
  -webkit-font-smoothing: antialiased;
}

.text-highlight {
  color: #000000;
  border-bottom: 5px solid #000000;
  display: inline-block;
  line-height: 0.8;
}

.welcome-subtitle {
  color: #2c2c2e;
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.conta-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  width: 100%;
  max-width: 1250px;
  z-index: 10;
}

.profile-form-container {
  background: #ffffff;
  padding: 40px;
  border: 1px solid #000000;
  border-radius: 2px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.03);
}

.form-header {
  margin-bottom: 30px;
}

.form-header h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.2rem;
  letter-spacing: 0.02em;
  color: #000000;
  margin: 0 0 6px 0;
  text-transform: uppercase;
}

.form-header p {
  color: #555555;
  font-size: 0.9rem;
  margin: 0;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.overview-item {
  border: 1px solid #000000;
  border-radius: 2px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.overview-item .label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #555555;
  font-weight: 700;
}

.overview-item .value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000000;
}

.overview-note {
  font-size: 0.9rem;
  color: #444444;
  margin-top: 10px;
}

.acoes-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-content: flex-start;
}

.card-funcoes {
  background: #ffffff;
  padding: 30px 24px;
  border: 1px solid #000000;
  border-radius: 2px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-funcoes:hover {
  background: #f7f7f7;
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
}

.card-icon {
  font-size: 1.8rem;
  color: #000000;
  margin-bottom: 4px;
}

.card-funcoes h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.03em;
  margin: 0;
  text-transform: uppercase;
  color: #000000;
}

.card-funcoes p {
  color: #444444;
  font-size: 0.88rem;
  line-height: 1.4;
  margin: 0;
}

.card-exit:hover {
  background: #fff5f5;
  border-color: #000000;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-box {
  background: #ffffff;
  padding: 45px 35px;
  border: 1px solid #000000;
  border-radius: 2px;
  width: 90%;
  max-width: 440px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.logout-modal h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.2rem;
  letter-spacing: 0.04em;
  margin: 18px 0 8px;
  color: #000000;
}

.logout-modal p {
  color: #444444;
  margin: 0 0 25px 0;
  font-size: 0.95rem;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-exit-confirm {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 1.1rem;
  border-radius: 2px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: all 0.2s ease;
}

.btn-exit-confirm:hover {
  background: #ff3b30;
  border-color: #ff3b30;
  transform: translateY(-1px);
}

.btn-cancel {
  background: transparent;
  color: #000000;
  border: none;
  padding: 10px 0;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: opacity 0.2s ease;
}

.btn-cancel:hover {
  opacity: 0.6;
}

@media (max-width: 1024px) {
  .section-admin {
    padding: 40px 1.5rem;
  }

  .conta-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 640px) {
  .welcome-container {
    margin-bottom: 35px;
  }

  .profile-form-container {
    padding: 30px 20px;
  }

  .acoes-container {
    grid-template-columns: 1fr;
  }
}
</style>