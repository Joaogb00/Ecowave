<template>
  <section class="section-admin">
    <HeaderAdm />
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
      <!-- FORMULÁRIO PERFIL -->
      <div class="profile-form-container">
        <div class="form-header">
          <h2>Minhas Informações</h2>
          <p>Seus dados cadastrados na plataforma</p>
        </div>

        <form @submit.prevent="handleUpdate" class="account-form">
          <!-- FOTO DE PERFIL -->
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

          <!-- <div class="input-group">
            <label>NOVA SENHA (DEIXE VAZIO PARA MANTER)</label>
            <input type="password" v-model="userForm.senha" placeholder="••••••••" :disabled="!isEditing" />
            <div class="input-line"></div>
          </div> -->

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

      <!-- AÇÕES LATERAIS -->
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

       

        

       

        <div @click="showLogoutModal = true" class="card-funcoes card-exit">
          <div class="card-icon"><i class="bi bi-box-arrow-right"></i></div>
          <h3>Sair</h3>
          <p>Encerrar sessão com segurança.</p>
        </div>
      </div>
    </div>

    <!-- MODAL UPGRADE -->
    

    <!-- MODAL LOGOUT -->
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

    <!-- MODAL QR -->
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
import HeaderAdm from '../../components/Administrador/HeaderAdm.vue'
import axios from 'axios';
import QRCode from 'qrcode';

export default {
  name: 'MinhaConta',
  components: { HeaderAdm},
  data() {
    return {
      loading: false,
      showLogoutModal: false,
      showUpgradeModal: false,
      showQrModal: false,
      isEditing: false,
      papel: sessionStorage.getItem('ecoWave_papel') || 'USUARIO',
      solicitacaoUpgrade: null,
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
    this.buscarStatusUpgrade();
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

    async buscarStatusUpgrade() {
      if (!this.userForm.id) return;
      try {
        const token = sessionStorage.getItem('ecoWave_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.get(`http://localhost:3000/SolicitacaoUpgrade/Usuario/${this.userForm.id}`, config);
        if (response.data && response.data.solicitacao) {
          this.solicitacaoUpgrade = response.data.solicitacao;

          if (this.solicitacaoUpgrade.status === 'APROVADA') {
            sessionStorage.setItem('ecoWave_papel', 'PROPRIETARIO');
            this.papel = 'PROPRIETARIO';
          }
        }
      } catch (error) {
        console.error('Erro ao buscar status do upgrade:', error);
      }
    },

    async enviarSolicitacaoUpgrade() {
      const token = sessionStorage.getItem('ecoWave_token');

      if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
      }

      this.loading = true;

      try {
        const response = await axios.post('http://localhost:3000/TornarPropietario', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert(response.data.message || 'Solicitação enviada com sucesso!');

        this.solicitacaoUpgrade = {
          status: 'PENDENTE',
          Data: new Date().toISOString()
        };

        this.showUpgradeModal = false;
        await this.buscarStatusUpgrade();
      } catch (error) {
        console.error('Erro ao enviar solicitação:', error);
        alert(error.response?.data?.error || 'Erro ao enviar solicitação de upgrade.');
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

.input-group input:focus+.input-line {
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
  background: #f7f7f7;
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
}

.card-funcoes.card-active {
  background: #000000;
  color: #ffffff;
}

.card-funcoes.card-active .card-icon,
.card-funcoes.card-active h3,
.card-funcoes.card-active p {
  color: #ffffff;
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

/* Estilos específicos para o card de ID */
.id-card {
  cursor: default;
}

.id-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  border-radius: 4px;
  margin: 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.id-box span {
  color: #000000;
  word-break: break-all;
}

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #000000;
  font-size: 1.2rem;
  padding: 4px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.btn-icon:hover {
  color: #333333;
  transform: scale(1.1);
}

.card-upgrade {
  border-color: #000000;
  background: #ffffff;
}

.card-upgrade.status-pendente {
  background: #fafafa;
  cursor: not-allowed;
}

.btn-card-action {
  margin-top: auto;
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 10px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-card-action:hover {
  background: #2c2c2e;
}

.btn-retry {
  background: transparent;
  color: #ff3b30;
  border-color: #ff3b30;
}

.btn-retry:hover {
  background: #ff3b30;
  color: #ffffff;
}

.status-msg-info {
  color: #666666;
  font-weight: 600;
}

.status-msg-error {
  color: #ff3b30;
  font-size: 0.82rem !important;
}

.upgrade-modal {
  max-width: 500px !important;
  text-align: left !important;
}

.upgrade-modal h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.2rem;
  text-align: center;
  margin: 10px 0;
  letter-spacing: 0.04em;
}

.modal-intro {
  text-align: center;
  margin-bottom: 25px;
  font-size: 0.95rem;
  color: #333333;
}

.upgrade-info-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 25px;
}

.info-item strong {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #000000;
}

.info-item p {
  margin: 4px 0 0 0;
  font-size: 0.88rem;
  color: #444444;
  line-height: 1.4;
}

.alert-box {
  background: #fffcf0;
  border: 1px solid #000000;
  padding: 15px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 30px;
}

.alert-box i {
  font-size: 1.2rem;
  color: #000000;
}

.alert-box p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: #000000;
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

.qr-modal {
  max-width: 480px !important;
}

.qr-modal canvas {
  margin: 25px auto;
  display: block;
  max-width: 100%;
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

  .id-box {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .btn-icon {
    width: 100%;
    padding: 10px;
  }
}
</style>