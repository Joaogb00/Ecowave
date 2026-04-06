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
                <label>NOME COMPLETO</label>
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
                
                <div class="strength-wrapper" v-if="formData.signupPassword">
                  <div class="strength-bar-bg">
                    <div class="strength-bar-fill" :style="{ width: passwordStrength + '%', backgroundColor: strengthColor }"></div>
                  </div>
                  <span class="strength-text" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
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
                <label>USUÁRIO OU EMAIL</label>
                <input type="text" v-model="formData.loginUser" placeholder="Seu identificador" />
                <div class="input-line"></div>
              </div>
              <div class="input-group">
                <label>SUA SENHA</label>
                <input type="password" v-model="formData.loginPassword" placeholder="••••••••" />
                <div class="input-line"></div>
              </div>
              <div class="forgot-password-link">
                <a @click.prevent="handleForgotPassword" href="#">Esqueci minha senha</a>
              </div>
              <button type="submit" class="action-button">ENTRAR</button>
            </form>
          </div>
        </div>

        <div class="overlay-slider">
          <div class="overlay-inner">
            <div class="overlay-content" v-if="!isSignUp">
              <h2 class="title-medium">Novo por <br> aqui?</h2>
              <p>Inicie seu cadastro para acessar as métricas.</p>
              <button @click="isSignUp = true" class="ghost-button">CRIAR CONTA</button>
            </div>
            <div class="overlay-content" v-else>
              <h2 class="title-medium">Já possui <br> acesso?</h2>
              <p>Retorne ao terminal de comando central.</p>
              <button @click="isSignUp = false" class="ghost-button">VOLTAR AO LOGIN</button>
            </div>
          </div>
        </div>

      </div>
    </section>

    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <div class="modal-icon">!</div>
          <h3>{{ modalTitle }}</h3>
          <p v-html="modalMessage"></p>
          <button @click="showModal = false" class="action-button">FECHAR</button>
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
      modalTitle: '',
      modalMessage: '',
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
      if (s <= 30) return 'Senha Fraca';
      if (s <= 70) return 'Senha Média';
      return 'Senha Segura';
    }
  },
  methods: {
    triggerModal(title, message) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.showModal = true;
    },
    updateMousePosition(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    async handleSubmit(type) {
      const isSignup = type === 'signup';
      const userValue = isSignup ? this.formData.signupEmail : this.formData.loginUser;
      const passwordValue = isSignup ? this.formData.signupPassword : this.formData.loginPassword;

      if (!userValue || !passwordValue) {
        this.triggerModal("ACESSO NEGADO", "Preencha <strong>todos</strong> os campos para a validação do usuário.");
        return;
      }

      try {
        if (isSignup) {
          await axios.post('http://127.0.0.1:3000/NovoUsuario', {
            nome: this.formData.signupUser,
            email: this.formData.signupEmail,
            senha: this.formData.signupPassword
          });
          
          sessionStorage.setItem('ecoWave_user', this.formData.signupUser);
          sessionStorage.setItem('isLogged', 'true');
          this.$router.push('/cadastrado');

        } else {
          const response = await axios.post('http://127.0.0.1:3000/Login', {
            email: this.formData.loginUser,
            senha: this.formData.loginPassword
          });

          if (response.data && response.data.token) {
            sessionStorage.setItem('ecoWave_user', response.data.nome);
            sessionStorage.setItem('ecoWave_email', response.data.email);
            sessionStorage.setItem('ecoWave_userId', response.data.id);
            sessionStorage.setItem('ecoWave_token', response.data.token);
            sessionStorage.setItem('isLogged', 'true');
            this.$router.push('/cadastrado');
          }
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || "";

        if (errorMessage === "Usuario Não Existente") {
          this.triggerModal("CADASTRO PENDENTE", "Este e-mail não possui cadastro. Vamos criar sua conta!");
          this.isSignUp = true;
          this.formData.signupEmail = this.formData.loginUser;
        } 
        else if (errorMessage === "Senha Incorreta") {
          this.triggerModal("SENHA INVÁLIDA", "A senha digitada está incorreta. Tente novamente.");
          this.formData.loginPassword = "";
        } 
        else {
          this.triggerModal("ERRO DE CONEXÃO", "Erro no acesso: " + (errorMessage || "Falha na conexão."));
        }
      }
    },
    async handleForgotPassword() {
      if (!this.formData.loginUser) {
        this.triggerModal("AVISO", "Digite seu e-mail no campo 'usuario e email' primeiro!");
        return;
      }
      try {
        await axios.post('http://127.0.0.1:3000/EsqueciSenha', {
          email: this.formData.loginUser
        });
        this.triggerModal("SUCESSO", "Código de recuperação enviado para o seu e-mail/SMS!");
      } catch (error) {
        this.triggerModal("ERRO", "Erro ao solicitar recuperação.");
      }
    }
  }
}
</script>

<style scoped>
/* --- Keyframes para Animação de Entrada --- */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.main-wrapper {
  background: #fdfdfd; 
  color: #000; 
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.auth-container {
  position: relative;
  width: 900px;
  height: 500px;
  background: white;
  border: 1px solid rgba(0,0,0,0.08);
  display: flex;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0,0,0,0.08);
  animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.auth-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: white;
}

.form-box {
  width: 100%;
  max-width: 340px;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  pointer-events: none;
  position: absolute;
}

.form-box.show {
  opacity: 1;
  transform: scale(1);
  pointer-events: all;
  position: relative;
}

.overlay-slider {
  position: absolute;
  top: 0; left: 0; width: 50%; height: 100%;
  background: #000;
  z-index: 100;
  transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.is-signup-active .overlay-slider {
  transform: translateX(100%);
}

.overlay-content {
  padding: 0 50px;
  text-align: center;
  color: white;
  animation: fadeInUp 0.8s ease-out;
}

.eyebrow {
  color: #888;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 600;
  display: block;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.title-medium {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  line-height: 1;
  letter-spacing: -1.5px;
}

.text-highlight { color: #999; }

.input-group { margin-bottom: 25px; }

.input-group label {
  display: block;
  font-size: 9px;
  color: #999;
  margin-bottom: 8px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.input-group input {
  width: 100%;
  background: transparent;
  border: none;
  color: black;
  padding: 10px 0;
  outline: none;
  font-size: 15px;
  font-family: inherit;
}

.input-line {
  height: 1px;
  background: #eeeeee;
  transition: all 0.4s ease;
}

input:focus + .input-line {
  background: black;
  height: 2px;
}

.strength-wrapper { margin-top: 10px; }
.strength-bar-bg { height: 2px; background: #eee; width: 100%; border-radius: 2px; }
.strength-bar-fill { height: 100%; transition: all 0.5s ease; }
.strength-text { font-size: 10px; font-weight: 700; text-transform: uppercase; margin-top: 5px; display: block; }

.action-button {
  width: 100%;
  background: #000;
  color: #fff;
  padding: 16px;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 1px;
  border: 1px solid #000;
  cursor: pointer;
  transition: all 0.4s ease;
  margin-top: 20px;
}

.action-button:hover {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.ghost-button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 12px 30px;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.ghost-button:hover { background: white; color: black; }

.btn-cta {
  position: absolute;
  top: 40px; left: 40px;
  text-decoration: none;
  color: #000;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 2px solid transparent;
  transition: border 0.3s;
  width: 10vh;
}

.btn-cta:hover { border-bottom: 2px solid #000; }

/* --- Modais --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  text-align: center;
  max-width: 400px;
  padding: 40px;
  background: white;
  border: 1px solid #eee;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

.modal-icon {
  font-size: 40px;
  font-weight: 200;
  margin-bottom: 20px;
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .auth-container { width: 95%; flex-direction: column; height: auto; }
  .overlay-slider { display: none; }
  .form-box { opacity: 1; transform: none; position: relative; display: none; }
  .form-box.show { display: block; }
  .auth-panel { padding: 60px 20px; }
}

.forgot-password-link {
  text-align: right;
  margin-top: -15px;
  margin-bottom: 20px;
}

.forgot-password-link a {
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  transition: color 0.3s;
  cursor: pointer;
}

.forgot-password-link a:hover { color: #000; }
</style>