<template>
  <HeaderProprietario />
  <section class="section-admin">
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
            <span class="label">OPERADOR</span>
            <span class="value">{{ nomeUsuario || 'Proprietário' }}</span>
          </div>
        </div>

        <p class="overview-note">
          Utilize o painel lateral de atalhos rápidos para monitorizar os seus estabelecimentos parceiros, 
          registar novas atividades de recolha de resíduos e gerir os dados de acesso da sua conta operacional.
        </p>
      </div>

      <div class="acoes-wrapper">
        <div class="acoes-container">
          <transition-group name="expand-cards">
            <router-link to="/pontos-proprietario" class="card-funcoes" key="cadastrar-ponto">
              <div class="card-icon"><i class="bi bi-geo-alt-fill"></i></div>
              <h3>Cadastrar Novo Ponto</h3>
              <p>Adicione um novo local de coleta para gerenciar na rede.</p>
            </router-link>

           

            <router-link to="/registros" class="card-funcoes" key="registrar-reciclagem">
              <div class="card-icon"><i class="bi bi-recycle"></i></div>
              <h3>Registrar Reciclagem</h3>
              <p>Valide e lance os descartes trazidos pelos cidadãos.</p>
            </router-link>

            <router-link to="/historico-proprietario" class="card-funcoes" key="historico-proprietario">
              <div class="card-icon"><i class="bi bi-clock-history"></i></div>
              <h3>Histórico de Envios</h3>
              <p>Consulte todos os lançamentos efetuados pelos seus pontos.</p>
            </router-link>

            
          </transition-group>
        </div>

        <button @click="toggleFunctions" class="btn-toggle-functions">
          <span>{{ isExpanded ? 'Ver menos funções' : 'Ver mais funções' }}</span>
          <i :class="isExpanded ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
        </button>

        <div @click="showLogoutModal = true" class="card-funcoes card-exit">
          <div class="card-icon"><i class="bi bi-box-arrow-right"></i></div>
          <div class="card-exit-text">
            <h3>Sair do Painel</h3>
            <p>Encerrar sessão operacional de proprietário com segurança.</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="modal-box logout-modal">
        <div class="card-icon">
          <i class="bi bi-exclamation-circle" style="color: #000000;"></i>
        </div>
        <h3>DESEJA SAIR?</h3>
        <p>Sua sessão de proprietário será encerrada.</p>
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
import HeaderProprietario from '../../components/Proprietario/HeaderPorpietario.vue';
import api from '../../../../backend/src/services/api';

export default {
  name: 'Proprietario',
  components: {
    HeaderProprietario
  },
  data() {
    return {
      isExpanded: false, // Controla o colapso dos itens secundários
      showLogoutModal: false,
      nomeUsuario: sessionStorage.getItem('ecoWave_user') || 'Proprietário',
      resumo: {
        pontos: 0,
        registros: 0
      }
    };
  },
  mounted() {
    this.carregarDadosDashboard();
  },
  methods: {
    toggleFunctions() {
      this.isExpanded = !this.isExpanded;
    },
    async carregarDadosDashboard() {
      try {
        const idUsuario = sessionStorage.getItem('ecoWave_userId');
        if (!idUsuario) {
          this.logout();
          return;
        }

        const res = await api.get(`/dashboardProprietario/${idUsuario}`);
        if (res.data) {
          this.resumo.pontos = res.data.totalPontos || 0;
          this.resumo.registros = res.data.totalRegistros || 0;
        }
      } catch (e) {
        console.error('Erro ao carregar dados do painel do proprietário', e);
        if (e.response && (e.response.status === 401 || e.response.status === 403)) {
          alert('Sessão expirada ou permissões atualizadas! Faça login novamente por segurança.');
          this.logout();
        }
      }
    },
    logout() {
      sessionStorage.clear();
      this.$router.push('/formulario?mode=login');
    }
  }
}
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
  margin-top: 55px;
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
  margin-bottom: 40px;
  z-index: 10;
  width: 100%;
}

.eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #555555;
  text-transform: uppercase;
}

.welcome-title {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-size: clamp(2.6rem, 5vw, 5rem);
  line-height: 0.9;
  letter-spacing: -0.01em;
  color: #000000;
  margin: 10px 0 15px;
  text-transform: uppercase;
  -webkit-font-smoothing: antialiased;
}

.text-highlight {
  color: #000000;
  border-bottom: 4px solid #000000;
  display: inline-block;
  line-height: 0.85;
}

.welcome-subtitle {
  color: #555555;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

/* CONTAINER DE LAYOUT EQUILIBRADO E ASSIMÉTRICO (60% / 40%) */
.conta-layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 35px;
  width: 100%;
  max-width: 1200px;
  z-index: 10;
  align-items: start;
}

/* COLUNA PRINCIPAL: FORMULÁRIO / MÉTRICAS DE RESUMO */
.profile-form-container {
  background: #ffffff;
  padding: 45px;
  border: 1px solid #000000;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  position: sticky;
  top: 110px;
}

.form-header {
  margin-bottom: 35px;
}

.form-header h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  letter-spacing: 0.02em;
  color: #000000;
  margin: 0 0 6px 0;
  text-transform: uppercase;
}

.form-header p {
  color: #666666;
  font-size: 0.95rem;
  margin: 0;
}

.overview-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.overview-item {
  border: 1px solid #e5e5ea;
  border-left: 4px solid #000000;
  border-radius: 2px;
  padding: 16px 20px;
  display: flex;
  justify-content: flex-row;
  align-items: center;
  justify-content: space-between;
  background: #fafafa;
}

.overview-item .label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666666;
  font-weight: 700;
}

.overview-item .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
}

.overview-note {
  font-size: 0.9rem;
  color: #666666;
  line-height: 1.6;
  margin-top: 15px;
}

/* ÁREA COMPLEMENTAR DE CARDS OPERACIONAIS */
.acoes-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.acoes-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
}

.card-funcoes {
  background: #ffffff;
  padding: 22px 18px;
  border: 1px solid #e5e5ea;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-funcoes:hover {
  background: #ffffff;
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

.card-icon {
  font-size: 1.5rem;
  color: #000000;
  margin-bottom: 2px;
}

.card-funcoes h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.3rem;
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
  color: #000000;
}

.card-funcoes p {
  color: #666666;
  font-size: 0.82rem;
  line-height: 1.4;
  margin: 0;
}

/* CARD DE SAÍDA FORMATADO */
.card-exit {
  grid-column: span 2;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 16px 20px;
  background: #fafafa;
  margin-top: 5px;
}

.card-exit .card-icon {
  margin-bottom: 0;
}

.card-exit:hover {
  background: #fff5f5;
  border-color: #ff3b30;
}

.card-exit:hover h3 {
  color: #ff3b30;
}

/* BOTÃO DE EXPANSÃO INTERATIVO */
.btn-toggle-functions {
  grid-column: span 2;
  background: #ffffff;
  border: 1px dashed #000000;
  color: #000000;
  padding: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  border-radius: 4px;
  margin: 5px 0;
}

.btn-toggle-functions:hover {
  background: #000000;
  color: #ffffff;
}

/* REGRA DE TRANSIÇÃO FLUIDA PARA EXIBIÇÃO EM FILA (TRANSITION GROUP) */
.expand-cards-enter-active, 
.expand-cards-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 200px;
  opacity: 1;
}

.expand-cards-enter-from, 
.expand-cards-leave-to {
  opacity: 0;
  max-height: 0px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
  transform: translateY(-10px);
  border: none;
}

/* OVERLAY E COMPONENTES DO MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-box {
  background: #ffffff;
  padding: 40px 35px;
  border: 1px solid #000000;
  border-radius: 4px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.logout-modal h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  letter-spacing: 0.02em;
  margin: 15px 0 8px;
  color: #000000;
}

.logout-modal p {
  color: #555555;
  margin: 0 0 25px 0;
  font-size: 0.95rem;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-exit-confirm {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 1rem;
  border-radius: 2px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: all 0.2s ease;
}

.btn-exit-confirm:hover {
  background: #ff3b30;
  border-color: #ff3b30;
}

.btn-cancel {
  background: transparent;
  color: #555555;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.btn-cancel:hover {
  color: #000000;
}

/* RESPONSIVIDADE EM DISPOSITIVOS ECRÃ INTERMÉDIO/TABLET */
@media (max-width: 1024px) {
  .section-admin {
    padding: 40px 1.5rem;
  }

  .conta-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .profile-form-container {
    position: relative;
    top: 0;
    padding: 30px;
  }
}

/* RESPONSIVIDADE EM SMARTPHONES (COLUNA ÚNICA COMPACTA) */
@media (max-width: 640px) {
  .welcome-container {
    margin-bottom: 30px;
  }

  .acoes-container {
    grid-template-columns: 1fr;
  }
  
  .card-funcoes, .card-exit {
    grid-column: span 1;
  }
  
  .btn-toggle-functions {
    grid-column: span 1;
  }
}
</style>