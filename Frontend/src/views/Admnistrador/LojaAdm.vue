<template>
  <div class="main-wrapper">
    <transition name="toast-fade">
      <div v-if="notificacao.visivel" :class="['toast-notification', notificacao.tipo]">
        <i v-if="notificacao.tipo === 'success'" class="bi bi-check-circle-fill"></i>
        <i v-else class="bi bi-exclamation-triangle-fill"></i>
        {{ notificacao.mensagem }}
      </div>
    </transition>

    <router-link to="/administrador" class="btn-cta">Voltar ao Painel</router-link>

    <section class="admin-section">
      <div class="header-box flex-header">
        <div>
          <span class="eyebrow">Terminal de Inventário</span>
          <h2 class="title-medium">Gestão de <span class="text-highlight">Recompensas.</span></h2>
        </div>
        <button @click="abrirModalCriar" class="action-button btn-add">
          <i class="bi bi-plus-lg"></i> NOVO PRODUTO
        </button>
      </div>

      <div class="table-container">
        <table class="minimal-table">
          <thead>
            <tr>
              <th>PRODUTO</th>
              <th>EMPRESA</th>
              <th>CUSTO (COINS)</th>
              <th>ESTOQUE</th>
              <th class="text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recompensas" :key="item.id">
              <td class="product-cell">
                <div class="product-info-mini">
                 <div class="mini-thumb">
  <img v-if="item.imagem" :src="'http://localhost:3000' + item.imagem" alt="Produto">
  <i v-else class="bi bi-box"></i>
</div>
                  <span>{{ item.nome }}</span>
                </div>
              </td>
              <td>{{ item.empresaParceira }}</td>
              <td class="font-bold">{{ item.pontosNecessarios }} <i class="bi bi-coin"></i></td>
              <td>
                <span :class="['status-pill', item.estoque > 0 ? 'in-stock' : 'out-stock']">
                  {{ item.estoque }} un.
                </span>
              </td>
              <td class="text-right">
                <button @click="selecionarRecompensa(item)" class="icon-btn"><i class="bi bi-pen"></i></button>
                <button @click="deletarRecompensa(item.id)" class="icon-btn delete"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <transition name="modal-fade">
      <div v-if="exibirModal" class="modal-overlay" @click.self="fecharModal">
        <div class="modal-content admin-modal">
          <span class="eyebrow">{{ modoEdicao ? 'Atualizar Item' : 'Novo Registro' }}</span>
          <h3 class="title-small">{{ modoEdicao ? 'Editar' : 'Criar' }} <span class="text-highlight">Produto</span></h3>

          <form @submit.prevent="salvarRecompensa" class="edit-form">
            <div class="input-group photo-upload-container">
              <label>IMAGEM DO PRODUTO</label>
              <div class="upload-area" @click="$refs.fileInput.click()">
                <img v-if="form.imagem" :src="form.imagem.startsWith('http') ? form.imagem : 'http://localhost:3000' + form.imagem" class="preview-img" />
                <div v-else class="upload-placeholder">
                  <i class="bi bi-camera"></i>
                  <span>UPLOAD</span>
                </div>
                <input type="file" ref="fileInput" hidden @change="uploadFoto" accept="image/*" />
              </div>
            </div>

            <div class="input-row">
              <div class="input-group">
                <label>NOME DO PRODUTO</label>
                <input type="text" v-model="form.nome" required placeholder="Ex: Fone de ouvido" />
                <div class="input-line"></div>
              </div>
              <div class="input-group">
                <label>EMPRESA PARCEIRA</label>
                <input type="text" v-model="form.empresaParceira" required placeholder="Ex: Apple" />
                <div class="input-line"></div>
              </div>
            </div>

            <div class="input-group">
              <label>DESCRIÇÃO</label>
              <input type="text" v-model="form.descricao" required placeholder="Breve detalhe do produto" />
              <div class="input-line"></div>
            </div>

            <div class="input-row">
              <div class="input-group">
                <label>PONTOS (COINS)</label>
                <input type="number" v-model="form.pontosNecessarios" required />
                <div class="input-line"></div>
              </div>
              <div class="input-group">
                <label>ESTOQUE INICIAL</label>
                <input type="number" v-model="form.estoque" required />
                <div class="input-line"></div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="submit" class="action-button">
                {{ modoEdicao ? 'SALVAR ALTERAÇÕES' : 'CONFIRMAR REGISTRO' }}
              </button>
              <button type="button" @click="fecharModal" class="ghost-button-dark">DESCARTAR</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LojaAdmin',
  data() {
    return {
      recompensas: [],
      exibirModal: false,
      modoEdicao: false,
      notificacao: { visivel: false, mensagem: '', tipo: 'success' },
      form: {
        id: null,
        nome: '',
        empresaParceira: '',
        descricao: '',
        pontosNecessarios: 0,
        estoque: 0,
        imagem: ''
      },
      carregandoUpload: false
    };
  },
  mounted() {
    this.buscarRecompensas();
  },
  methods: {
    getAuthHeaders() {
      const token = sessionStorage.getItem('ecoWave_token');
      return token
        ? { Authorization: `Bearer ${token}` }
        : {};
    },

    mostrarFeedback(msg, tipo = 'success') {
      this.notificacao = { visivel: true, mensagem: msg, tipo };
      setTimeout(() => {
        this.notificacao.visivel = false;
      }, 3000);
    },

    async buscarRecompensas() {
      try {
        const res = await axios.get('http://localhost:3000/Recompensas');
        this.recompensas = res.data.recompensas || res.data || [];
      } catch (e) {
        console.error(e);
        this.mostrarFeedback("Erro ao carregar banco de dados", "error");
      }
    },

    abrirModalCriar() {
      this.modoEdicao = false;
      this.form = {
        id: null,
        nome: '',
        empresaParceira: '',
        descricao: '',
        pontosNecessarios: 0,
        estoque: 0,
        imagem: ''
      };
      this.exibirModal = true;
    },

    selecionarRecompensa(item) {
      this.modoEdicao = true;
      this.form = { ...item };
      this.exibirModal = true;
    },

    async uploadFoto(e) {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        this.mostrarFeedback("Imagem muito pesada! Use fotos menores que 5MB", "error");
        return;
      }

      const formData = new FormData();
      formData.append('imagem', file);

      this.carregandoUpload = true;

      try {
        const res = await axios.post(
          'http://localhost:3000/UploadRecompensaImagem',
          formData,
          {
            headers: {
              ...this.getAuthHeaders(),
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        this.form.imagem = res.data.imageUrl;
        this.mostrarFeedback("Imagem enviada com sucesso!");
      } catch (err) {
        console.error(err);
        this.mostrarFeedback("Erro ao fazer upload da imagem", "error");
      } finally {
        this.carregandoUpload = false;
      }
    },

    async salvarRecompensa() {
      try {
        const payload = {
          nome: this.form.nome,
          empresaParceira: this.form.empresaParceira,
          descricao: this.form.descricao,
          pontosNecessarios: Number(this.form.pontosNecessarios),
          estoque: Number(this.form.estoque),
          imagem: this.form.imagem || ''
        };

        if (this.modoEdicao) {
          await axios.put(
            `http://localhost:3000/EditarRecompensa/${this.form.id}`,
            payload,
            { headers: this.getAuthHeaders() }
          );
          this.mostrarFeedback("Recompensa atualizada com sucesso!");
        } else {
          await axios.post(
            'http://localhost:3000/NovaRecompensa',
            payload,
            { headers: this.getAuthHeaders() }
          );
          this.mostrarFeedback("Recompensa cadastrada com sucesso!");
        }

        this.fecharModal();
        this.buscarRecompensas();
      } catch (e) {
        console.error(e);
        this.mostrarFeedback("Erro ao salvar dados", "error");
      }
    },

    async deletarRecompensa(id) {
      if (confirm("Tem certeza que deseja excluir esta recompensa?")) {
        try {
          await axios.delete(
            `http://localhost:3000/DeletarRecompensa/${id}`,
            { headers: this.getAuthHeaders() }
          );
          this.mostrarFeedback("Removido com sucesso!");
          this.buscarRecompensas();
        } catch (e) {
          console.error(e);
          this.mostrarFeedback("Erro ao deletar item", "error");
        }
      }
    },

    fecharModal() {
      this.exibirModal = false;
    }
  }
};
</script>

<style scoped>
/* ESTILOS BASE */
.main-wrapper {
  background: #fdfdfd;
  min-height: 100vh;
  padding: 80px 40px;
  font-family: 'Inter', sans-serif;
  color: #000;
  position: relative;
}

.admin-section {
  max-width: 1100px;
  margin: 0 auto;
}

.flex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
}

.btn-add {
  width: auto !important;
  padding: 12px 25px !important;
  margin: 0 !important;
}

/* FEEDBACK (TOAST) */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 9999;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  color: white;
}

.toast-notification.success {
  background: #000;
  border-left: 5px solid #27ae60;
}

.toast-notification.error {
  background: #c53030;
  border-left: 5px solid #ff4d4d;
}

/* TABELA */
.table-container {
  background: white;
  border: 1px solid #eee;
}

.minimal-table {
  width: 100%;
  border-collapse: collapse;
}

.minimal-table th {
  padding: 20px;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #999;
  text-align: left;
  border-bottom: 1px solid #eee;
  text-transform: uppercase;
}

.minimal-table td {
  padding: 15px 20px;
  border-bottom: 1px solid #f9f9f9;
  font-size: 14px;
}

.product-info-mini {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-thumb {
  width: 40px;
  height: 40px;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.mini-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* MODAL E UPLOAD */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-modal {
  width: 100%;
  max-width: 600px;
  padding: 40px;
  background: white;
  border: 1px solid #eee;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.1);
}

.photo-upload-container {
  margin-bottom: 30px;
}

.upload-area {
  width: 120px;
  height: 120px;
  border: 2px dashed #eee;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
}

.upload-area:hover {
  border-color: #000;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ccc;
  font-size: 10px;
  font-weight: 800;
}

.upload-placeholder i {
  font-size: 24px;
  margin-bottom: 5px;
}

/* INPUTS */
.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  font-size: 9px;
  font-weight: 800;
  color: #999;
  letter-spacing: 1.5px;
}

.input-group input {
  width: 100%;
  border: none;
  padding: 10px 0;
  outline: none;
  border-bottom: 1px solid #eee;
  background: transparent;
}

.input-group input:focus {
  border-bottom: 2px solid #000;
}

.action-button {
  background: #000;
  color: #fff;
  padding: 15px;
  width: 100%;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.ghost-button-dark {
  width: 100%;
  background: transparent;
  border: 1px solid #eee;
  padding: 12px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: 600;
}

/* DECORAÇÃO */
.eyebrow {
  color: #888;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 600;
  text-transform: uppercase;
}

.title-medium {
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -1.5px;
}

.text-highlight {
  color: #bbb;
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

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  font-size: 16px;
  transition: 0.2s;
}

.icon-btn.delete:hover {
  color: #ff4d4d;
}

/* ANIMAÇÕES */
.toast-fade-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s ease;
}

.toast-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>