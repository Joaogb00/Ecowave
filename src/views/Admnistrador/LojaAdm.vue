<template>
  <div class="main-wrapper">
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
                    <img v-if="item.imagem" :src="item.imagem" alt="">
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
            <div class="input-row">
              <div class="input-group">
                <label>NOME DO PRODUTO</label>
                <input type="text" v-model="form.nome" required placeholder="Ex: Cupom R$ 50" />
                <div class="input-line"></div>
              </div>
              <div class="input-group">
                <label>EMPRESA PARCEIRA</label>
                <input type="text" v-model="form.empresaParceira" required placeholder="Ex: Starbucks" />
                <div class="input-line"></div>
              </div>
            </div>

            <div class="input-group">
              <label>DESCRIÇÃO</label>
              <input type="text" v-model="form.descricao" required placeholder="Breve detalhe do benefício" />
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

            <div class="input-group">
              <label>URL DA IMAGEM</label>
              <input type="text" v-model="form.imagem" placeholder="https://..." />
              <div class="input-line"></div>
            </div>

            <div class="modal-actions">
              <button type="submit" class="action-button">CONFIRMAR REGISTRO</button>
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
  name: 'AdminRecompensas',
  data() {
    return {
      recompensas: [],
      exibirModal: false,
      modoEdicao: false,
      form: {
        id: null,
        nome: '',
        empresaParceira: '',
        descricao: '',
        pontosNecessarios: 0,
        estoque: 0,
        imagem: ''
      }
    }
  },
  mounted() {
    this.buscarRecompensas();
  },
  methods: {
    async buscarRecompensas() {
      try {
        const res = await axios.get('http://localhost:3000/Recompensas');
        this.recompensas = res.data.recompensas || [];
      } catch (e) { console.error("Erro ao carregar", e); }
    },
    abrirModalCriar() {
      this.modoEdicao = false;
      this.form = { id: null, nome: '', empresaParceira: '', descricao: '', pontosNecessarios: 0, estoque: 0, imagem: '' };
      this.exibirModal = true;
    },
    selecionarRecompensa(item) {
      this.modoEdicao = true;
      this.form = { ...item };
      this.exibirModal = true;
    },
    fecharModal() {
      this.exibirModal = false;
    },
    async salvarRecompensa() {
      try {
        if (this.modoEdicao) {
          await axios.put('http://localhost:3000/Recompensas', this.form);
        } else {
          await axios.post('http://localhost:3000/NovaRecompensa', this.form);
        }
        this.fecharModal();
        this.buscarRecompensas();
      } catch (e) { alert("Erro ao processar produto."); }
    },
    async deletarRecompensa(id) {
      if (confirm("Remover este item do marketplace?")) {
        try {
          await axios.delete(`http://localhost:3000/Recompensa/${id}`);
          this.buscarRecompensas();
        } catch (e) { alert("Erro ao deletar."); }
      }
    }
  }
}
</script>

<style scoped>
/* Estilos Base Sincronizados */
.main-wrapper {
  background: #fdfdfd;
  min-height: 100vh;
  padding: 80px 40px;
  font-family: 'Inter', sans-serif;
  color: #000;
}

.admin-section { max-width: 1100px; margin: 0 auto; }

.flex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
}

.btn-add { width: auto !important; padding: 12px 25px !important; margin: 0 !important; }

/* Tabela Profissional */
.table-container { background: white; border: 1px solid #eee; }
.minimal-table { width: 100%; border-collapse: collapse; }
.minimal-table th {
  padding: 20px;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #999;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.minimal-table td { padding: 15px 20px; border-bottom: 1px solid #f9f9f9; font-size: 14px; }

/* Miniatura do Produto */
.product-cell { font-weight: 600; }
.product-info-mini { display: flex; align-items: center; gap: 12px; }
.mini-thumb {
  width: 40px; height: 40px;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.mini-thumb img { width: 100%; height: 100%; object-fit: cover; }

.status-pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}
.in-stock { background: #e6fffa; color: #2d3748; }
.out-stock { background: #fff5f5; color: #c53030; }

/* Modal e Forms */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
}
.admin-modal {
  width: 100%; max-width: 600px;
  padding: 40px; background: white;
  border: 1px solid #eee;
  box-shadow: 0 40px 80px rgba(0,0,0,0.1);
}
.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.input-group { margin-bottom: 20px; }
.input-group label { font-size: 9px; font-weight: 800; color: #999; letter-spacing: 1.5px; }
.input-group input { width: 100%; border: none; padding: 10px 0; outline: none; border-bottom: 1px solid #eee; }
.input-group input:focus { border-bottom: 2px solid #000; }

.action-button {
  background: #000; color: #fff; padding: 15px; width: 100%;
  border: none; font-weight: 600; cursor: pointer; transition: 0.3s;
}
.ghost-button-dark {
  width: 100%; background: transparent; border: 1px solid #eee;
  padding: 12px; margin-top: 10px; cursor: pointer; font-weight: 600;
}

.eyebrow { color: #888; font-size: 11px; letter-spacing: 2px; font-weight: 600; text-transform: uppercase; }
.title-medium { font-size: 2.2rem; font-weight: 700; letter-spacing: -1.5px; }
.text-highlight { color: #bbb; }
.btn-cta {
   position: absolute; top: 40px; left: 40px; color: white; font-weight: 700; font-size: 11px; text-decoration: none; border-bottom: 2px solid #000; }
.btn-cta:hover {
   position: absolute; top: 40px; left: 40px; color: #000; font-weight: 700; font-size: 11px; text-decoration: none; border-bottom: 2px solid #000; }

.icon-btn { background: none; border: none; cursor: pointer; margin-left: 10px; font-size: 16px; }
.icon-btn.delete:hover { color: #ff4d4d; }
</style>