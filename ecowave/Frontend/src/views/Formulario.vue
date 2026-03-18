<template>
  <div class="main-wrapper" @mousemove="updateMousePosition">
    <router-link to="/" class="btn-cta">Voltar para o início</router-link>

    <section class="auth-section">
      <div class="auth-container" :class="{ 'is-signup-active': isSignUp }">
        
        <div class="auth-panel left-panel">
          <div class="form-box" :class="{ 'show': isSignUp }">
            <span class="eyebrow">Registrar na ecowave</span>
            <h2 class="title-medium">Criar <span class="text-highlight">Perfil.</span></h2>
            <form @submit.prevent="handleSubmit('signup')">
              <div class="input-group">
                <label>NOME COMPLETO DO USUÁRIO</label>
                <input type="text" v-model="formData.signupUser" placeholder="Nome do operador" />
                <div class="input-line"></div>
              </div>
              <div class="input-group">
                <label>EMAIL CONTATO</label>
                <input type="email" v-model="formData.signupEmail" placeholder="exemplo@terminal.com" />
                <div class="input-line"></div>
              </div>
              <div class="input-group">
                <label>DEFINIR SENHA</label>
                <input type="password" v-model="formData.signupPassword" placeholder="••••••••" />
                <div class="input-line"></div>
                
                <div class="strength-container" v-if="formData.signupPassword">
                  <div class="strength-bar" :style="{ width: passwordStrength + '%', backgroundColor: strengthColor }"></div>
                  <span class="strength-text">{{ strengthLabel }}</span>
                </div>
              </div>
              <button type="submit" class="action-button">CRIAR CONTA</button>
            </form>
          </div>
        </div>

        <div class="auth-panel right-panel">
          <div class="form-box" :class="{ 'show': !isSignUp }">
            <span class="eyebrow">Entrar na EcoWave</span>
            <h2 class="title-medium">Login <span class="text-highlight">System.</span></h2>
            <form @submit.prevent="handleSubmit('login')">
              <div class="input-group">
                <label>EMAIL DO USUÁRIO</label>
                <input type="email" v-model="formData.signupEmail" placeholder="exemplo@terminal.com" />
                <div class="input-line"></div>
              </div>
              <div class="input-group">
                <label>SUA SENHA</label>
                <input type="password" v-model="formData.loginPassword" placeholder="••••••••" />
                <div class="input-line"></div>
              </div>
              
              <button type="submit" class="action-button">ENTRAR</button>
            </form>
          </div>
        </div>

        <div class="overlay-slider">
          <div class="overlay-inner">
            <div class="overlay-content" v-if="!isSignUp">
              <h2 class="title-medium">Já possui <br> acesso?</h2>
              <p>Retorne ao terminal de comando central.</p>
              <button @click="isSignUp = true" class="ghost-button">IR PARA CADASTRO</button>
            </div>
            <div class="overlay-content" v-else>
              <h2 class="title-medium">Novo por <br> aqui?</h2>
              <p>Inicie seu cadastro para acessar as métricas.</p>
              <button @click="isSignUp = false" class="ghost-button">VOLTAR AO LOGIN</button>
            </div>
          </div>
        </div>

      </div>
    </section>

    <transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <div class="modal-icon">!</div>
          <h3>ACESSO NEGADO</h3>
          <p>Preencha <strong>todos</strong> os campos para a validação do usuário</p>
          <button @click="showModal = false" class="action-button">CORRIGIR</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Formulario',
  data() {
    return {
      isSignUp: false,
      showModal: false,
      mouseX: 0,
      mouseY: 0,
      formData: {
        loginUser: '',
        loginPassword: '',
        signupUser: '',
        signupEmail: '',
        signupPassword: ''
      }
    };
  },
  computed: {
    passwordStrength() {
      const p = this.formData.signupPassword;
      if (!p) return 0;
      let score = 0;
      if (p.length > 5) score += 30;
      if (/[A-Z]/.test(p)) score += 20;
      if (/[0-9]/.test(p)) score += 20;
      if (/[^A-Za-z0-9]/.test(p)) score += 30;
      return score;
    },
    strengthColor() {
      const s = this.passwordStrength;
      if (s <= 30) return '#ff4d4d';
      if (s <= 70) return '#ffd11a';
      return '#00ff88';
    },
    strengthLabel() {
      const s = this.passwordStrength;
      if (s === 0) return '';
      if (s <= 30) return 'Fraca';
      if (s <= 70) return 'Média';
      return 'Segura';
    }
  },
  methods: {
    updateMousePosition(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    async handleSubmit(type) {
      const isSignup = type === 'signup';
      const userValue = isSignup ? this.formData.signupUser : this.formData.loginUser;
      const passwordValue = isSignup ? this.formData.signupPassword : this.formData.loginPassword;
      
      if (!userValue || userValue.trim() === '' || !passwordValue) {
        this.showModal = true;
        return;
      }

      try {
        if (isSignup) {
          const response = await axios.post('http://127.0.0.1:3000/NovoUsuario', {
            nome: this.formData.signupUser,
            email: this.formData.signupEmail,
            senha: this.formData.signupPassword
          });
          alert('Conta criada com sucesso!');
          this.$router.push('/cadastrado');
        } else {
          console.log('Tentando login com:', this.formData.loginUser);
        }
      } catch (error) {
        console.error('Erro na comunicação:', error);
        alert('Erro ao processar solicitação.');
      }
    }
  }
}
</script>

<style scoped>
/* --- Alinhamento com a Hero --- */
.main-wrapper {
  background: #fdfdfd; 
  color: #000000; 
  font-family: 'Inter', sans-serif; /* Mesma fonte da Hero */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  position: relative;
  width: 1100px;
  height: 650px;
  background: white;
  border: 1px solid rgba(0,0,0,0.1);
  display: flex;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.12);
}

.auth-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
}

.form-box {
  width: 100%;
  max-width: 320px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  pointer-events: none;
}

.form-box.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
  transition-delay: 0.3s;
}

/* --- Overlay Slider (Fundo Escuro da Hero) --- */
.overlay-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: #000;
  z-index: 100;
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.is-signup-active .overlay-slider {
  transform: translateX(100%);
}

.overlay-content {
  padding: 0 40px;
  text-align: center;
  color: white;
}

/* --- Tipografia Hero Style --- */
.eyebrow {
  color: #888;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.title-medium {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 30px;
  line-height: 0.95;
  letter-spacing: -2px; /* Estilo do H1 da Hero */
}

.text-highlight {
  opacity: 0.4; /* Efeito do span do H1 da Hero */
}

.overlay-slider .title-medium {
  color: white;
}

/* --- Inputs Modernos --- */
.input-group {
  margin-bottom: 25px;
}

.input-group label {
  display: block;
  font-size: 10px;
  color: #999;
  margin-bottom: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.input-group input {
  width: 100%;
  background: transparent;
  border: none;
  color: black;
  padding: 12px 0;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
}

.input-line {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  transition: 0.4s;
}

input:focus + .input-line {
  background: black;
}

/* --- Botões (Mesma transição da Hero) --- */
.action-button {
  width: 100%;
  background: #000;
  color: #fff;
  padding: 18px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 1px;
  border: 1px solid #000;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  margin-top: 15px;
}

.action-button:hover {
  background: transparent;
  color: #000;
  transform: translateY(-3px);
}

.ghost-button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 14px 28px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 25px;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.ghost-button:hover {
  background: white;
  color: black;
  transform: translateY(-3px);
}

.btn-cta {
  position: absolute;
  top: 30px;
  left: 30px;
  text-decoration: none;
  color: #000;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 2px solid #000;
  padding-bottom: 4px;
}

/* --- Responsividade --- */
@media (max-width: 800px) {
  .auth-container {
    flex-direction: column;
    height: auto;
    width: 90%;
    box-shadow: none;
  }
  .overlay-slider { display: none; }
  .form-box { opacity: 1; transform: none; display: none; pointer-events: auto; }
  .form-box.show { display: block; }
  .auth-panel { padding: 40px 20px; }
  .title-medium { font-size: 2rem; }
}
</style>