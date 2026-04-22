<template>
  <div class="main-wrapper">
    <router-link to="/administrador" class="btn-cta">Voltar ao Painel</router-link>

    <section class="admin-section">
      <div class="header-box">
        <span class="eyebrow">Terminal de Controle</span>
        <h2 class="title-medium">Gerenciamento <span class="text-highlight">Usuários.</span></h2>
      </div>

      <div class="table-container">
        <table class="minimal-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME COMPLETO</th>
              <th>EMAIL DE CONTATO</th>
              <th class="text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usuarios" :key="user.id">
              <td class="id-cell">#{{ user.id.substring(0, 5) }}</td>
              <td class="name-cell">{{ user.nome }}</td>
              <td>{{ user.email }}</td>
              <td class="text-right">
                <button @click="selecionarUsuario(user)" class="icon-btn" title="Editar">
                  <i class="bi bi-pen"></i>
                </button>
                <button @click="deletarUsuario(user.id)" class="icon-btn delete" title="Excluir">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="usuarios.length === 0" class="empty-state">
          <p>Nenhum registro encontrado no sistema.</p>
        </div>
      </div>
    </section>

    <transition name="modal-fade">
      <div v-if="usuarioEditando" class="modal-overlay" @click.self="fecharModal">
        <div class="modal-content admin-modal">
          <span class="eyebrow">Modo Edição</span>
          <h3 class="title-small">Atualizar <span class="text-highlight">Credenciais</span></h3>
          
          <form @submit.prevent="salvarEdicao" class="edit-form">
            <div class="input-group">
              <label>NOME DO OPERADOR</label>
              <input type="text" v-model="formEdicao.nome" />
              <div class="input-line"></div>
            </div>

            <div class="input-group">
              <label>EMAIL CONTATO</label>
              <input type="email" v-model="formEdicao.email" />
              <div class="input-line"></div>
            </div>

            <div class="input-group">
              <label>NOVA SENHA (DEIXE VAZIO PARA MANTER)</label>
              <input type="password" v-model="formEdicao.senha" placeholder="••••••••" />
              <div class="input-line"></div>
            </div>

            <div class="modal-actions">
              <button type="submit" class="action-button">SALVAR ALTERAÇÕES</button>
              <button type="button" @click="fecharModal" class="ghost-button-dark">CANCELAR</button>
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
  data() {
    return {
      usuarios: [],
      editando: false,
      form: { id: '', nome: '', email: '', senha: '' }
    }
  },
  mounted() {
    this.carregarUsuarios();
  },
  methods: {
    // Busca na rota GET /Usuarios na porta 3000
    async carregarUsuarios() {
      try {
        const response = await axios.get('http://localhost:3000/Usuarios');
        // Acessando .usuarios pois seu GetUserService retorna um objeto com essa chave
        this.usuarios = response.data.usuarios || [];
      } catch (error) {
        console.error("Erro ao carregar:", error);
      }
    },

    // Deleta na rota DELETE /DeletarUsuario/:id na porta 3000
    async deletarUsuario(id) {
      if (confirm("Tem certeza que deseja excluir?")) {
        try {
          await axios.delete(`http://localhost:3000/DeletarUsuario/${id}`);
          alert("Usuário removido com sucesso!");
          this.carregarUsuarios();
        } catch (error) {
          alert("Erro ao deletar.");
        }
      }
    },

    abrirEdicao(user) {
      this.editando = true;
      this.form = { id: user.id, nome: user.nome, email: user.email, senha: '' };
    },

    // Salva na rota PUT /EditarUsuario/:id na porta 3000
    async salvarAlteracoes() {
      try {
        const { id, nome, email, senha } = this.form;
        
        await axios.put(`http://localhost:3000/EditarUsuario/${id}`, {
          nome,
          email,
          senha
        });

        alert("Usuário atualizado!");
        this.editando = false;
        this.carregarUsuarios();
      } catch (error) {
        // Exibe o erro vindo do PutUserController catch
        const msg = error.response?.data?.error || "Erro ao editar";
        alert(msg);
      }
    }
  }
}
</script>

<style scoped>
/* Reutilizando a base visual da EcoWave */
.main-wrapper {
  background: #fdfdfd;
  min-height: 100vh;
  padding: 80px 40px;
  font-family: 'Inter', sans-serif;
  color: #000;
}

.admin-section {
  max-width: 1100px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out;
}

.header-box { margin-bottom: 50px; }

.eyebrow {
  color: #888;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 600;
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
}

.title-medium {
  font-size: 2.5rem;
  letter-spacing: -1.5px;
  font-weight: 700;
}

.text-highlight { color: #999; }

/* Tabela Minimalista */
.table-container {
  background: white;
  border: 1px solid #eee;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.minimal-table {
  width: 100%;
  border-collapse: collapse;
}

.minimal-table th {
  padding: 20px;
  text-align: left;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #999;
  border-bottom: 1px solid #eee;
}

.minimal-table td {
  padding: 20px;
  font-size: 14px;
  border-bottom: 1px solid #f9f9f9;
}

.id-cell { font-family: monospace; color: #bbb; }
.name-cell { font-weight: 600; }

.text-right { text-align: right; }

/* Botões de Ação */
.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-left: 15px;
  color: #000;
  transition: opacity 0.3s;
}

.icon-btn.delete:hover { color: #ff4d4d; }
.icon-btn:hover { opacity: 0.5; }

/* Estilo do Modal (Seguindo seu Form) */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-modal {
  width: 100%;
  max-width: 450px;
  padding: 50px;
  background: white;
  border: 1px solid #eee;
  box-shadow: 0 30px 60px rgba(0,0,0,0.1);
}

.input-group { margin: 25px 0; }
.input-group label {
  font-size: 9px;
  font-weight: 800;
  color: #999;
  letter-spacing: 1.5px;
  display: block;
}

.input-group input {
  width: 100%;
  border: none;
  padding: 12px 0;
  outline: none;
  font-size: 15px;
}

.input-line { height: 1px; background: #eee; transition: 0.3s; }
input:focus + .input-line { background: #000; height: 2px; }

.action-button {
  width: 100%;
  background: #000;
  color: #fff;
  padding: 16px;
  border: none;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  margin-bottom: 10px;
}

.ghost-button-dark {
  width: 100%;
  background: transparent;
  border: 1px solid #eee;
  padding: 14px;
  cursor: pointer;
  font-weight: 600;
  font-size: 11px;
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