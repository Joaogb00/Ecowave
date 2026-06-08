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
              <th>PAPEL</th>
              <th class="text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usuarios" :key="user.id">
              <td class="id-cell">#{{ user.id.substring(0, 5) }}</td>
              <td class="name-cell">{{ user.nome }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" :class="{
                  'role-admin': user.papel === 'ADMIN',
                  'role-proprietario': user.papel === 'PROPRIETARIO',
                  'role-user': user.papel !== 'ADMIN' && user.papel !== 'PROPRIETARIO'
                }">
                  {{ user.papel || 'USUARIO' }}
                </span>
              </td>
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

      <div class="header-box section-divider">
        <span class="eyebrow">Triagem de Parcerias</span>
        <h2 class="title-medium">Pedidos para <span class="text-highlight">Proprietário.</span></h2>
      </div>

      <div class="table-container">
        <table class="minimal-table">
          <thead>
            <tr>
              <th>USUÁRIO</th>
              <th>EMAIL DE CONTATO</th>
              <th>DATA SOLICITAÇÃO</th>
              <th>STATUS</th>
              <th class="text-right">DECISÃO ADM</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in solicitacoes" :key="req.id">
              <td class="name-cell">{{ req.usuarioNome }}</td>
              <td>{{ req.usuarioEmail }}</td>
              <td class="id-cell">{{ formatarData(req.dataSolicitacao) }}</td>
              <td>
                <span class="status-indicator-badge">{{ req.status }}</span>
              </td>
              <td class="text-right decision-actions">
                <button @click="aceitarUpgrade(req)" class="btn-approve" title="Aprovar Perfil">
                  <i class="bi bi-check-lg"></i> ACEITAR
                </button>
                <button @click="abrirModalRecusa(req)" class="btn-reject" title="Recusar Perfil">
                  <i class="bi bi-x-lg"></i> RECUSAR
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="solicitacoes.length === 0" class="empty-state">
          <p>Nenhuma solicitação de upgrade pendente no momento.</p>
        </div>
      </div>
    </section>

    <transition name="modal-fade">
      <div v-if="editando" class="modal-overlay" @click.self="fecharModal">
        <div class="modal-content admin-modal">
          <span class="eyebrow">Modo Edição</span>
          <h3 class="title-small">Atualizar <span class="text-highlight">Credenciais</span></h3>

          <form @submit.prevent="salvarEdicao" class="edit-form">
            <div class="input-group">
              <label>NOME DO OPERADOR</label>
              <input type="text" v-model="form.nome" />
              <div class="input-line"></div>
            </div>

            <div class="input-group">
              <label>EMAIL CONTATO</label>
              <input type="email" v-model="form.email" />
              <div class="input-line"></div>
            </div>

            <div class="input-group">
              <label>PAPEL DO USUÁRIO</label>
              <select v-model="form.papel">
                <option value="USUARIO">USUARIO</option>
                <option value="ADMIN">ADMINISTRADOR</option>
                <option value="PROPRIETARIO">PROPRIETÁRIO</option>
              </select>
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

    <transition name="modal-fade">
      <div v-if="exibirModalRecusa" class="modal-overlay" @click.self="fecharModalRecusa">
        <div class="modal-content admin-modal layout-left">
          <span class="eyebrow">Motivo da Reprovação</span>
          <h3 class="title-small" style="margin-bottom: 20px;">Justificar <span class="text-highlight">Recusa</span></h3>

          <div class="input-group">
            <label>SELECIONE UMA MENSAGEM PRONTA</label>
            <select v-model="justificativaPredefinida" @change="aplicarTextoPronto">
              <option value="">-- Selecionar motivo padrão --</option>
              <option v-for="motivo in motivosPadrao" :key="motivo" :value="motivo">{{ motivo }}</option>
            </select>
            <div class="input-line"></div>
          </div>

          <div class="input-group">
            <label>OU DIGITE UMA JUSTIFICATIVA PERSONALIZADA</label>
            <textarea 
              v-model="justificativaPersonalizada" 
              rows="4"
              placeholder="Descreva detalhadamente o motivo que impede o upgrade..." 
              class="custom-textarea"
            ></textarea>
            <div class="input-line"></div>
          </div>

          <div class="modal-actions" style="margin-top: 30px;">
            <button @click="confirmarRecusa" class="action-button btn-confirm-reject">CONCLUIR REPROVAÇÃO</button>
            <button type="button" @click="fecharModalRecusa" class="ghost-button-dark">CANCELAR</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import api from '../../../../backend/src/services/api'

export default {
  data() {
    return {
      usuarios: [],
      solicitacoes: [], 
      editando: false,
      exibirModalRecusa: false,
      solicitacaoSelecionada: null,
      justificativaPredefinida: '',
      justificativaPersonalizada: '',
      motivosPadrao: [
        "documentação incompleta",
        "informações insuficientes",
        "perfil ainda não atende aos requisitos",
        "solicitacao enviada com dados inconsistentes",
        "necessário revisar cadastro antes de reenviar"
      ],
      form: { id: '', nome: '', email: '', senha: '', papel: 'USUARIO' }
    }
  },
  mounted() {
    this.carregarTodosOsDados();
  },
  methods: {
    // Busca em paralelo para manter as tabelas sincronizadas
    async carregarTodosOsDados() {
      await Promise.all([
        this.carregarUsuarios(),
        this.carregarSolicitacoesUpgrade()
      ]);
    },
    async carregarUsuarios() {
      try {
        const response = await api.get('/Usuarios')
        // Alinhado para extrair a array de usuários dependendo da resposta da API
        this.usuarios = response.data.usuarios || response.data || []
      } catch (error) {
        console.error('Erro na requisição de usuários:', error)
        if (error.response && error.response.status === 401) {
          alert('Sessão expirada ou sem permissão. Faça login novamente.')
          this.$router.push('/formulario?mode=login')
        }
      }
    },
    async carregarSolicitacoesUpgrade() {
      try {
        const response = await api.get('/SolicitacaoUpgrade/Pendentes')
        this.solicitacoes = response.data.solicitacoes || response.data || []
      } catch (error) {
        console.error('Erro ao buscar solicitações de upgrade:', error)
      }
    },
    async aceitarUpgrade(solicitacao) {
      if (!confirm(`Confirmar upgrade do usuário ${solicitacao.usuarioNome} para PROPRIETÁRIO?`)) return;
      try {
        await api.put(`/SolicitacaoUpgrade/${solicitacao.id}/Aceitar`);
        alert('Perfil atualizado com sucesso! O usuário agora é Proprietário.');
        
        // Gatilho reativo para recarregar ambas as tabelas imediatamente
        await this.carregarTodosOsDados();
      } catch (error) {
        console.error('Erro ao aprovar upgrade:', error);
        alert('Não foi possível concluir a aprovação.');
      }
    },
    abrirModalRecusa(solicitacao) {
      this.solicitacaoSelecionada = solicitacao;
      this.justificativaPredefinida = '';
      this.justificativaPersonalizada = '';
      this.exibirModalRecusa = true;
    },
    fecharModalRecusa() {
      this.exibirModalRecusa = false;
      this.solicitacaoSelecionada = null;
    },
    aplicarTextoPronto() {
      if (this.justificativaPredefinida) {
        this.justificativaPersonalizada = this.justificativaPredefinida;
      }
    },
    async confirmarRecusa() {
      const justificativaFinal = this.justificativaPersonalizada.trim();
      if (!justificativaFinal) {
        alert("É mandatório fornecer uma justificativa para a reprovação.");
        return;
      }

      try {
        await api.put(`/SolicitacaoUpgrade/${this.solicitacaoSelecionada.id}/Recusar`, {
          justificativa: justificativaFinal
        });
        alert('Solicitação recusada com sucesso. Motivo arquivado.');
        this.fecharModalRecusa();
        await this.carregarTodosOsDados();
      } catch (error) {
        console.error('Erro ao recusar upgrade:', error);
        alert('Erro ao registrar recusa.');
      }
    },
    formatarData(stringData) {
      if (!stringData) return '';
      const data = new Date(stringData);
      return data.toLocaleDateString('pt-BR');
    },
    selecionarUsuario(user) {
      this.editando = true
      this.form = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        senha: '',
        papel: user.papel || 'USUARIO'
      }
    },
    fecharModal() {
      this.editando = false
    },
    async salvarEdicao() {
      try {
        await api.put(`/EditarUsuario/${this.form.id}`, {
          nome: this.form.nome,
          email: this.form.email,
          senha: this.form.senha,
          papel: this.form.papel
        })
        alert('Dados atualizados com sucesso!')
        this.editando = false
        await this.carregarTodosOsDados();
      } catch (e) {
        console.error('Erro ao editar usuário:', e)
        alert('Erro ao editar usuário.')
      }
    },
    async deletarUsuario(id) {
      if (!confirm('Tem certeza que deseja deletar este usuário?')) return

      try {
        await api.delete(`/DeletarUsuario/${id}`)
        alert('Usuário deletado com sucesso!')
        await this.carregarTodosOsDados();
      } catch (e) {
        console.error('Erro ao deletar usuário:', e)
        alert('Erro ao deletar usuário.')
      }
    }
  }
}
</script>

<style scoped>
/* Mantidos os mesmos estilos premium e o layout minimalista que você criou */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

.main-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 4rem 60px;
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
  color: #000000;
}
.admin-section {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  max-width: 1250px;
  z-index: 10;
}
.header-box {
  text-align: center;
  margin-bottom: 40px;
  width: 100%;
}
.section-divider {
  margin-top: 80px;
}
.eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #000000;
  text-transform: uppercase;
  display: block;
  margin-bottom: 12px;
}
.title-medium {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-size: clamp(2.6rem, 5vw, 4.5rem);
  line-height: 0.86;
  letter-spacing: -0.02em;
  color: #000000;
  margin: 0;
  text-transform: uppercase;
  -webkit-font-smoothing: antialiased;
}
.title-small {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.2rem;
  letter-spacing: 0.04em;
  margin: 18px 0 8px;
  color: #000000;
  text-transform: uppercase;
}
.text-highlight {
  color: #000000;
  border-bottom: 5px solid #000000;
  display: inline-block;
  line-height: 0.8;
}
.table-container {
  background: #ffffff;
  padding: 40px;
  border: 1px solid #000000;
  border-radius: 2px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.03);
  overflow-x: auto;
}
.minimal-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.minimal-table th {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.3rem;
  letter-spacing: 0.03em;
  padding: 14px 16px;
  border-bottom: 2px solid #000000;
  color: #000000;
  text-transform: uppercase;
}
.minimal-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e5ea;
  font-size: 0.95rem;
  color: #2c2c2e;
  vertical-align: middle;
}
.minimal-table tr:last-child td {
  border-bottom: none;
}
.id-cell {
  font-family: monospace;
  color: #555555;
  font-weight: 600;
}
.name-cell {
  font-weight: 700;
  color: #000000;
}
.text-right {
  text-align: right;
}
.role-badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: 1px solid #000000;
  border-radius: 2px;
  text-transform: uppercase;
}
.role-admin {
  background: #000000;
  color: #ffffff;
}
.role-proprietario {
  background: #2c2c2e;
  color: #ffffff;
  border-color: #2c2c2e;
}
.role-user {
  background: #ffffff;
  color: #000000;
}
.status-indicator-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #000000;
  background: #fffcf0;
  padding: 4px 10px;
  border: 1px solid #000000;
  letter-spacing: 0.06em;
  border-radius: 2px;
}
.empty-state {
  text-align: center;
  padding: 40px !important;
  color: #555555;
  font-style: italic;
  font-size: 0.95rem;
}
.btn-cta {
  position: absolute;
  top: 40px;
  left: 4rem;
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  padding: 13px 24px;
  border-radius: 2px;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-decoration: none;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-cta:hover {
  background: #f7f7f7;
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
}
.icon-btn {
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  padding: 8px 14px;
  font-size: 0.9rem;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s ease;
}
.icon-btn:hover {
  background: #000000;
  color: #ffffff;
}
.icon-btn.delete:hover {
  background: #fff5f5;
  color: #ff3b30;
  border-color: #ff3b30;
}
.decision-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.btn-approve,
.btn-reject {
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  padding: 8px 14px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}
.btn-approve:hover {
  background: #000000;
  color: #ffffff;
}
.btn-reject:hover {
  background: #fff5f5;
  color: #ff3b30;
  border-color: #ff3b30;
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
.modal-content {
  background: #ffffff;
  padding: 40px;
  border: 1px solid #000000;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}
.layout-left {
  text-align: left;
}
.input-group {
  margin-bottom: 20px;
}
.input-group label {
  font-size: 0.75rem;
  font-weight: 700;
  display: block;
  margin-bottom: 6px;
}
.input-group select,
.custom-textarea {
  width: 100%;
  border: 1px solid #cccccc;
  padding: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  outline: none;
  background: transparent;
  color: #000000;
}
.custom-textarea {
  resize: vertical;
}
.input-line {
  height: 1px;
  background: #cccccc;
}
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.action-button {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
}
.ghost-button-dark {
  background: transparent;
  border: none;
  color: #000000;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 10px;
  cursor: pointer;
  text-transform: uppercase;
}
.btn-confirm-reject {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
}
.btn-confirm-reject:hover {
  background: #ff3b30;
  border-color: #ff3b30;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
@media (max-width: 1024px) {
  .main-wrapper { padding: 100px 1.5rem 40px; }
}
</style>