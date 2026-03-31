<template>
  <section class="hero-minhaconta">
    <HeaderCad />

    <div class="account-card">
      <span class="eyebrow">Terminal de Usuário</span>
      <h1 class="title-medium">Minha <span class="text-highlight">Conta.</span></h1>

      <form @submit.prevent="handleUpdate" class="account-form">
        <div class="input-group">
          <label>NOME COMPLETO</label>
          <input type="text" v-model="userForm.nome" required />
          <div class="input-line"></div>
        </div>

        <div class="input-group">
          <label>EMAIL DE ACESSO</label>
          <input type="email" v-model="userForm.email" required />
          <div class="input-line"></div>
        </div>

        <div class="input-group">
          <label>NOVA SENHA (DEIXE VAZIO PARA MANTER)</label>
          <input type="password" v-model="userForm.senha" placeholder="••••••••" />
          <div class="input-line"></div>
        </div>

        <div class="button-group">
          <button type="submit" class="btn-save" :disabled="loading">
            {{ loading ? 'PROCESSANDO...' : 'SALVAR ALTERAÇÕES' }}
          </button>
          
          <button type="button" @click="showLogoutModal = true" class="btn-exit">
            SAIR DA CONTA
          </button>
        </div>
      </form>
    </div>

    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="modal-box">
        <h3>DESEJA SAIR?</h3>
        <p>Sua sessão será encerrada com segurança.</p>
        <button @click="logout" class="btn-confirm">SAIR AGORA</button>
        <button @click="showLogoutModal = false" class="btn-cancel">CANCELAR</button>
      </div>
    </div>
  </section>
</template>

<script>
import HeaderCad from '@/components/Cadatrastrados/HeaderCad.vue';
import axios from 'axios';

export default {
  name: 'MinhaConta',
  components: { HeaderCad },
  data() {
    return {
      loading: false,
      showLogoutModal: false,
      userForm: {
        id: sessionStorage.getItem('ecoWave_userId'),
        nome: sessionStorage.getItem('ecoWave_user') || '',
        email: sessionStorage.getItem('ecoWave_email') || '',
        senha: ''
      }
    };
  },
  methods: {
 async handleUpdate() {
  // Verifica se o ID existe no formulário antes de enviar
  if (!this.userForm.id) {
    alert("Erro: Sessão expirada ou ID não encontrado. Faça login novamente.");
    return;
  }

  this.loading = true;

  try {
    // A URL deve conter o ID no final: http://localhost:3000/EditarUsuario/123
    const url = `http://localhost:3000/EditarUsuario/${this.userForm.id}`;
    
    const response = await axios.put(url, {
      nome: this.userForm.nome,
      email: this.userForm.email,
      senha: this.userForm.senha || undefined // Envia a senha apenas se preenchida
    });

    if (response.data) {
      // Atualiza o nome e email na sessão para refletir no Header
      sessionStorage.setItem('ecoWave_user', this.userForm.nome);
      sessionStorage.setItem('ecoWave_email', this.userForm.email);
      
      alert("Perfil atualizado com sucesso!");
      this.userForm.senha = ""; // Limpa o campo de senha
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    const msg = error.response?.data?.error || "Erro ao conectar com o servidor.";
    alert(msg);
  } finally {
    this.loading = false;
  }
},
    logout() {
      sessionStorage.clear();
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
/* Estilos simplificados para o exemplo */
.hero-minhaconta { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f9f9f9; flex-direction: column;}
.account-card { background: white; padding: 40px; border: 1px solid #ddd; width: 400px; }
.input-group { margin-bottom: 20px; }
.input-group label { display: block; font-size: 10px; color: #999; font-weight: bold; }
.input-group input { width: 100%; border: none; border-bottom: 1px solid #eee; padding: 10px 0; outline: none; }
.btn-save { width: 100%; background: #000; color: white; padding: 15px; border: none; cursor: pointer; font-weight: bold; margin-bottom: 10px; }
.btn-exit { width: 100%; background: transparent; border: 1px solid #ff4d4d; color: #ff4d4d; padding: 10px; cursor: pointer; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
.modal-box { background: white; padding: 30px; text-align: center; }
</style>