<template>
  <section class="section-admin">
    <HeaderProprietario />
    <div class="sky-layer"></div>

    <div class="welcome-container">
      <span class="eyebrow">Terminal de Usuário</span>
      <h1 class="welcome-title">
        Minha <span class="text-highlight">Conta.</span>
      </h1>
      <p class="welcome-subtitle">
        Gerencie suas informações e acompanhe sua jornada na <strong>EcoWave</strong>.
      </p>
    </div>

    <div class="conta-layout">
      <div class="profile-form-container">
        <div class="form-header">
          <h2>Minhas Informações</h2>
          <p>Seus dados cadastrados na plataforma</p>
        </div>

        <form @submit.prevent="handleUpdate" class="account-form">
          <div class="input-group">
            <label>FOTO DE PERFIL</label>
            <div class="profile-upload-area">
              <img v-if="previewImage" :src="previewImage" class="profile-preview" />
              <div v-else class="profile-preview-placeholder"><i class="bi bi-person-circle"></i></div>
              
              <input type="file" @change="onFileChange" accept="image/*" :disabled="!isEditing" />
            </div>
          </div>

          <div class="input-group">
            <label>NOME COMPLETO</label>
            <input type="text" v-model="userForm.nome" required :disabled="!isEditing" />
            <div class="input-line"></div>
          </div>

          <div class="input-group">
            <label>EMAIL DE ACESSO</label>
            <input type="email" v-model="userForm.email" required :disabled="!isEditing" />
            <div class="input-line"></div>
          </div>

          <div class="form-actions" v-if="isEditing">
            <button type="submit" class="btn-save" :disabled="loading">
              {{ loading ? 'PROCESSANDO...' : 'SALVAR ALTERAÇÕES' }}
            </button>
            <button type="button" @click="cancelEdit" class="btn-cancel-edit">
              CANCELAR
            </button>
          </div>
        </form>
      </div>

      <div class="acoes-container">
        <div @click="enableEdit" class="card-funcoes" :class="{ 'card-active': isEditing }">
          <div class="card-icon"><i class="bi bi-pencil-square"></i></div>
          <h3>Atualizar Informações</h3>
          <p>Clique para editar seus dados pessoais.</p>
        </div>

        <div class="card-funcoes id-card">
          <div class="card-icon"><i class="bi bi-person-badge"></i></div>
          <h3>Seu ID de Usuário</h3>
          <div class="id-box">
            <span>{{ userForm.id }}</span>
            <button @click="copiarId" class="btn-icon">
              <i class="bi bi-clipboard"></i>
            </button>
          </div>
          <button @click="abrirModalQrCode" class="btn-card-action">
            GERAR QR CODE
          </button>
        </div>

        <div v-if="papel === 'PROPRIETARIO'" class="card-funcoes card-upgrade" :class="{ 'status-pendente': solicitacaoUsuario?.status === 'PENDENTE' }">
          <div class="card-icon">
            <i v-if="!solicitacaoUsuario" class="bi bi-patch-check"></i>
            <i v-else-if="solicitacaoUsuario.status === 'PENDENTE'" class="bi bi-hourglass-split text-warning"></i>
            <i v-else-if="solicitacaoUsuario.status === 'RECUSADA'" class="bi bi-exclamation-triangle text-danger"></i>
          </div>

          <template v-if="!solicitacaoUsuario">
            <h3>Tornar-se Usuário</h3>
            <p>Solicite a alteração de perfil se você não gerencia mais nenhum ponto de coleta ou recursos avançados.</p>
            <button @click.stop="showUserModal = true" class="btn-card-action">
              Tornar-se usuário
            </button>
          </template>

          <template v-else-if="solicitacaoUsuario.status === 'PENDENTE'">
            <h3>Solicitação em Análise</h3>
            <p class="status-msg-info">
              Sua solicitação de alteração de perfil está em análise pela administração.
            </p>
          </template>

          <template v-else-if="solicitacaoUsuario.status === 'RECUSADA'">
            <h3>Solicitação Recusada</h3>
            <p class="status-msg-error">
              <strong>Motivo:</strong> {{ solicitacaoUsuario.justificativa }}
            </p>
            <button @click.stop="showUserModal = true" class="btn-card-action btn-retry">
              TENTAR NOVAMENTE
            </button>
          </template>
        </div>

        <div @click="showLogoutModal = true" class="card-funcoes card-exit">
          <div class="card-icon"><i class="bi bi-box-arrow-right"></i></div>
          <h3>Sair</h3>
          <p>Encerrar sessão com segurança.</p>
        </div>
      </div>
    </div>

    <div v-if="showUserModal" class="modal-overlay">
      <div class="modal-box upgrade-modal">
        <div class="card-icon"><i class="bi bi-arrow-down-circle"></i></div>
        <h3>SOLICITAR PERFIL DE USUÁRIO</h3>
        <p class="modal-intro">
          Entenda o que acontece ao retornar para o perfil de <strong>Usuário Padrão</strong>:
        </p>

        <div class="upgrade-info-box">
          <div class="info-item">
            <strong>Perda de Acessos Operacionais:</strong>
            <p>
              Você deixará de ter controle sobre a gestão de pontos de coleta, terminais de logística e métricas corporativas.
            </p>
          </div>
          <div class="info-item">
            <strong>Manutenção do Histórico:</strong>
            <p>
              Seus dados pessoais, fotos e históricos de descarte individuais na EcoWave continuarão intactos.
            </p>
          </div>
        </div>

        <div class="alert-box">
          <i class="bi bi-info-circle-fill"></i>
          <p>
            A alteração passará pela verificação da administração e não é instantânea.
          </p>
        </div>

        <div class="modal-actions">
          <button @click="enviarSolicitacaoUsuario" class="btn-exit-confirm" :disabled="loading">
            {{ loading ? 'PROCESSANDO...' : 'CONFIRMAR SOLICITAÇÃO' }}
          </button>
          <button @click="showUserModal = false" class="btn-cancel">
            VOLTAR
          </button>
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
          <button @click="showLogoutModal = false" class="btn-cancel">
            VOLTAR
          </button>
        </div>
      </div>
    </div>

    <div v-if="showQrModal" class="modal-overlay">
      <div class="modal-box qr-modal">
        <div class="card-icon">
          <i class="bi bi-qrcode" style="font-size: 3rem;"></i>
        </div>
        <h3>Seu QR Code de Identificação</h3>
        <canvas id="qr-code-canvas"></canvas>
        <p style="margin-top: 15px; font-size: 0.9rem; color: #444444; line-height: 1.4;">
          Apresente este código no ponto de coleta para registrar suas reciclagens.
        </p>
        <button @click="showQrModal = false" class="btn-cancel" style="margin-top: 20px;">
          FECHAR
        </button>
      </div>
    </div>

    <div class="overlay"></div>
  </section>
</template>

<script>
import HeaderProprietario from '../../components/Proprietario/HeaderPorpietario.vue';
import axios from 'axios';
import QRCode from 'qrcode';

export default {
  name: 'MinhaContaProprietario',
  components: { HeaderProprietario },
  data() {
    return {
      loading: false,
      showLogoutModal: false,
      showUserModal: false,
      showQrModal: false,
      isEditing: false,
      papel: sessionStorage.getItem('ecoWave_papel') || 'PROPRIETARIO',
      solicitacaoUsuario: null,
      selectedFile: null,
      previewImage: sessionStorage.getItem('ecoWave_foto') || null,
      userForm: {
        id: sessionStorage.getItem('ecoWave_userId'),
        nome: sessionStorage.getItem('ecoWave_user') || '',
        email: sessionStorage.getItem('ecoWave_email') || '',
        senha: ''
      },
      originalData: {}
    };
  },

  async mounted() {
    await this.buscarDadosUsuario();
    this.buscarStatusSolicitacaoUsuario();
  },

  methods: {
    async buscarDadosUsuario() {
      const token = sessionStorage.getItem('ecoWave_token');
      const userId = sessionStorage.getItem('ecoWave_userId');
      if (!userId || !token) return;

      try {
        const response = await axios.get(`http://localhost:3000/Usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          if (response.data.nome) {
            this.userForm.nome = response.data.nome;
            sessionStorage.setItem('ecoWave_user', response.data.nome);
          }
          if (response.data.email) {
            this.userForm.email = response.data.email;
            sessionStorage.setItem('ecoWave_email', response.data.email);
          }
          if (response.data.fotoPerfil) {
            const imageUrl = `http://localhost:3000/uploads/${response.data.fotoPerfil}`;
            this.previewImage = imageUrl;
            sessionStorage.setItem('ecoWave_foto', imageUrl);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário atualizado:', error);
      }
    },

    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.previewImage = URL.createObjectURL(file);
      }
    },

    copiarId() {
      navigator.clipboard.writeText(this.userForm.id);
      alert('ID copiado com sucesso!');
    },

    async abrirModalQrCode() {
      this.showQrModal = true;
      this.$nextTick(async () => {
        const canvas = document.getElementById('qr-code-canvas');
        if (canvas && this.userForm.id) {
          await QRCode.toCanvas(canvas, this.userForm.id, {
            width: 280,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          });
        }
      });
    },

    async buscarStatusSolicitacaoUsuario() {
      if (!this.userForm.id) return;
      try {
        const token = sessionStorage.getItem('ecoWave_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.get(`http://localhost:3000/SolicitacaoUsuario/Usuario/${this.userForm.id}`, config);
        if (response.data && response.data.solicitacao) {
          this.solicitacaoUsuario = response.data.solicitacao;

          if (this.solicitacaoUsuario.status === 'APROVADA') {
            sessionStorage.setItem('ecoWave_papel', 'USUARIO');
            this.papel = 'USUARIO';
          }
        }
      } catch (error) {
        console.error('Erro ao buscar status da solicitação de usuário:', error);
      }
    },

    async enviarSolicitacaoUsuario() {
      const token = sessionStorage.getItem('ecoWave_token');

      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      this.loading = true;

      try {
        const response = await axios.post('http://localhost:3000/TornarUsuario', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert(response.data.message || 'Solicitação enviada com sucesso!');

        this.solicitacaoUsuario = {
          status: 'PENDENTE',
          Data: new Date().toISOString()
        };

        this.showUserModal = false;
        await this.buscarStatusSolicitacaoUsuario();
      } catch (error) {
        console.error('Erro ao enviar solicitação:', error);
        alert(error.response?.data?.error || 'Erro ao enviar solicitação de mudança de perfil.');
      } finally {
        this.loading = false;
      }
    },

    enableEdit() {
      this.isEditing = true;
      this.originalData = {
        nome: this.userForm.nome,
        email: this.userForm.email,
        senha: this.userForm.senha
      };
    },

    cancelEdit() {
      this.isEditing = false;
      this.userForm.nome = this.originalData.nome;
      this.userForm.email = this.originalData.email;
      this.userForm.senha = '';
      this.selectedFile = null;
      this.previewImage = sessionStorage.getItem('ecoWave_foto') || null;
    },

    async handleUpdate() {
      if (!this.userForm.id) {
        alert('Erro: Sessão expirada.');
        return;
      }

      this.loading = true;
      try {
        const url = `http://localhost:3000/EditarUsuario/${this.userForm.id}`;
        const token = sessionStorage.getItem('ecoWave_token');

        const formData = new FormData();
        formData.append('nome', this.userForm.nome);
        formData.append('email', this.userForm.email);
        if (this.userForm.senha) formData.append('senha', this.userForm.senha);
        if (this.selectedFile) {
          formData.append('fotoPerfil', this.selectedFile);
        }

        const response = await axios.put(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data && response.data.usuario) {
          const userUpdated = response.data.usuario;
          sessionStorage.setItem('ecoWave_user', userUpdated.nome);
          sessionStorage.setItem('ecoWave_email', userUpdated.email);

          if (userUpdated.fotoPerfil) {
            const imageUrl = `http://localhost:3000/uploads/${userUpdated.fotoPerfil}`;
            sessionStorage.setItem('ecoWave_foto', imageUrl);
            this.previewImage = imageUrl;
          }

          alert('Perfil atualizado com sucesso!');
          this.userForm.senha = '';
          this.isEditing = false;
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Sessão expirada ou inválida. Por favor, faça login novamente.');
        } else {
          alert('Erro ao atualizar perfil.');
        }
        console.error('Erro na requisição PUT:', error);
      } finally {
        this.loading = false;
      }
    },

    logout() {
      sessionStorage.clear();
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

.profile-upload-area {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
}
.profile-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #000;
}

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
  margin-bottom: 35px;
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

.account-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 28px;
  position: relative;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #000000;
  letter-spacing: 0.06em;
  display: block;
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  border: none;
  padding: 12px 0;
  font-size: 1rem;
  outline: none;
  background: transparent;
  color: #000000;
  font-family: 'Inter', sans-serif;
}

.input-group input::placeholder {
  color: #cccccc;
}

.input-group input:disabled {
  color: #777777;
  cursor: not-allowed;
}

.input-line {
  height: 1px;
  background: #cccccc;
  transition: background 0.3s ease, height 0.3s ease;
}

.input-group input:focus + .input-line {
  background: #000000;
  height: 2px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
}

.btn-save {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 1.1rem;
  border-radius: 2px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-save:hover:not(:disabled) {
  background: #1c1c1e;
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.btn-save:disabled {
  background: #e5e5e5;
  border-color: #e5e5e5;
  color: #999999;
  cursor: not-allowed;
}

.btn-cancel-edit {
  background: transparent;
  color: #000000;
  border: none;
  padding: 10px 0;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  align-self: flex-start;
  transition: opacity 0.2s ease;
}

.btn-cancel-edit:hover {
  opacity: 0.6;
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
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04);
  border-color: #000000;
}

.card-active {
  background: #f4f4f5;
  border-color: #000000;
}

.card-icon {
  font-size: 1.5rem;
  color: #000000;
  margin-bottom: 4px;
}

.card-funcoes h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
}

.card-funcoes p {
  font-size: 0.8rem;
  color: #555555;
  margin: 0;
  line-height: 1.4;
}

.id-card {
  cursor: default;
}

.id-card:hover {
  transform: none;
  box-shadow: none;
}

.id-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f4f4f5;
  padding: 10px 14px;
  border-radius: 2px;
  margin: 4px 0 10px;
}

.id-box span {
  font-family: monospace;
  font-size: 0.85rem;
  color: #333333;
}

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 1rem;
  color: #555555;
  transition: color 0.2s ease;
}

.btn-icon:hover {
  color: #000000;
}

.btn-card-action {
  width: 100%;
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;
}

.btn-card-action:hover {
  background: #ffffff;
  color: #000000;
}

.card-upgrade {
  border-color: #000000;
  grid-column: span 2;
}

.status-pendente {
  border-color: #eab308;
  background: #fefce8;
}

.status-msg-info {
  color: #854d0e !important;
  font-weight: 600;
}

.status-msg-error {
  color: #991b1b !important;
}

.btn-retry {
  background: #991b1b;
  border-color: #991b1b;
}

.btn-retry:hover {
  background: transparent;
  color: #991b1b;
}

.card-exit {
  grid-column: span 2;
  border-color: rgba(220, 38, 38, 0.2);
}

.card-exit:hover {
  border-color: #dc2626;
  background: #fef2f2;
}

.card-exit .card-icon {
  color: #dc2626;
}

/* MODAIS */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  background: #ffffff;
  padding: 40px;
  border: 1px solid #000000;
  max-width: 460px;
  width: 90%;
  text-align: center;
}

.modal-box h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  letter-spacing: 0.02em;
  margin: 15px 0 10px;
}

.modal-box p {
  font-size: 0.95rem;
  color: #444444;
  line-height: 1.5;
  margin: 0 0 25px 0;
}

.modal-intro {
  text-align: left;
  margin-bottom: 15px !important;
}

.upgrade-info-box {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 25px;
}

.info-item strong {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #000000;
}

.info-item p {
  font-size: 0.85rem;
  color: #555555;
  margin: 4px 0 0 0;
}

.alert-box {
  display: flex;
  gap: 12px;
  background: #f4f4f5;
  padding: 14px;
  text-align: left;
  align-items: flex-start;
  margin-bottom: 25px;
  border-left: 3px solid #000000;
}

.alert-box i {
  font-size: 1.1rem;
  color: #000000;
}

.alert-box p {
  font-size: 0.8rem;
  margin: 0;
  color: #333333;
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
  text-align: center;
}

.btn-exit-confirm:hover:not(:disabled) {
  background: #1c1c1e;
  transform: translateY(-1px);
}

.btn-exit-confirm:disabled {
  background: #e5e5e5;
  border-color: #e5e5e5;
  color: #999999;
  cursor: not-allowed;
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

#qr-code-canvas {
  margin: 15px auto;
  display: block;
  border: 1px solid #eee;
}

@media (max-width: 900px) {
  .section-admin {
    padding: 30px 1.5rem 80px;
  }
  .conta-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>