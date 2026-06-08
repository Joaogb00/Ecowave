<template>
  <div class="main-wrapper" @mousemove="updateMousePosition">
    <router-link to="/" class="btn-cta">
      <i class="bi bi-arrow-left"></i>
      <span>Voltar para o início</span>
    </router-link>

    <section class="auth-section">
      <div class="auth-container" :class="{ 'is-signup-active': isSignUp }">
        <div class="hero-bg-grid"></div>

        <div class="auth-panel left-panel">
          <div class="form-box" :class="{ show: isSignUp }">
            <span class="eyebrow">Registrar na ecowave</span>
            <h2 class="title-medium">
              Criar <span class="text-highlight">Perfil.</span>
            </h2>

            <form @submit.prevent="handleSubmit('signup')" novalidate>
              <div class="input-group">
                <label for="signup-user">NOME COMPLETO</label>
                <input
                  id="signup-user"
                  type="text"
                  v-model="formData.signupUser"
                  placeholder="Nome do operador"
                  autocomplete="name"
                  @input="clearError('signupUser')"
                />
                <div class="input-line" :class="{ 'has-error': errors.signupUser }"></div>
                <span class="error-text" v-if="errors.signupUser">
                  <i class="bi bi-exclamation-circle-fill"></i> {{ errors.signupUser }}
                </span>
              </div>

              <div class="input-group">
                <label for="signup-email">EMAIL CONTATO</label>
                <input
                  id="signup-email"
                  type="email"
                  v-model="formData.signupEmail"
                  placeholder="exemplo@terminal.com"
                  autocomplete="email"
                  @input="clearError('signupEmail')"
                />
                <div class="input-line" :class="{ 'has-error': errors.signupEmail }"></div>
                <span class="error-text" v-if="errors.signupEmail">
                  <i class="bi bi-exclamation-circle-fill"></i> {{ errors.signupEmail }}
                </span>
              </div>

              <div class="input-group password-group">
                <label for="signup-pass">DEFINIR SENHA</label>
                <div class="input-wrapper">
                  <input
                    id="signup-pass"
                    :type="showSignupPassword ? 'text' : 'password'"
                    v-model="formData.signupPassword"
                    placeholder="••••••••"
                    autocomplete="new-password"
                    @input="clearError('signupPassword')"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showSignupPassword = !showSignupPassword"
                    aria-label="Alternar visibilidade da senha"
                  >
                    <i :class="showSignupPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div class="input-line" :class="{ 'has-error': errors.signupPassword }"></div>
                <span class="error-text" v-if="errors.signupPassword">
                  <i class="bi bi-exclamation-circle-fill"></i> {{ errors.signupPassword }}
                </span>

                <div class="strength-wrapper" v-if="formData.signupPassword">
                  <div class="strength-bar-bg">
                    <div class="strength-bar-fill" :style="{ width: passwordStrength + '%', backgroundColor: strengthColor }"></div>
                  </div>
                  <span class="strength-text" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
                </div>
              </div>

              <button type="submit" class="action-button" :class="{ 'is-loading': isLoading, 'has-submit-error': submitError }">
                <span v-if="isLoading" class="spinner"></span>
                <span>{{ isLoading ? 'PROCESSANDO...' : 'CRIAR CONTA' }}</span>
                <i v-if="!isLoading" class="bi bi-arrow-right-short"></i>
              </button>
            </form>
          </div>
        </div>

        <div class="auth-panel right-panel">
          <div class="form-box" :class="{ show: !isSignUp }">
            <span class="eyebrow">{{ getRecoveryTitle('eyebrow') }}</span>
            <h2 class="title-medium" v-html="getRecoveryTitle('main')"></h2>

            <form v-if="recoveryStep === 0" @submit.prevent="handleSubmit('login')">
              <div class="input-group">
                <label for="login-user">USUÁRIO OU EMAIL</label>
                <input
                  id="login-user"
                  type="text"
                  v-model="formData.loginUser"
                  placeholder="Seu identificador"
                  autocomplete="username"
                  @input="clearError('loginUser')"
                />
                <div class="input-line" :class="{ 'has-error': errors.loginUser }"></div>
                <span class="error-text" v-if="errors.loginUser">
                  <i class="bi bi-exclamation-circle-fill"></i> {{ errors.loginUser }}
                </span>
              </div>

              <div class="input-group password-group">
                <label for="login-pass">SUA SENHA</label>
                <div class="input-wrapper">
                  <input
                    id="login-pass"
                    :type="showLoginPassword ? 'text' : 'password'"
                    v-model="formData.loginPassword"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    @input="clearError('loginPassword')"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showLoginPassword = !showLoginPassword"
                    aria-label="Alternar visibilidade da senha"
                  >
                    <i :class="showLoginPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div class="input-line" :class="{ 'has-error': errors.loginPassword }"></div>
                <span class="error-text" v-if="errors.loginPassword">
                  <i class="bi bi-exclamation-circle-fill"></i> {{ errors.loginPassword }}
                </span>
              </div>

              <div class="forgot-password-link">
                <a @click.prevent="startRecovery" href="#">Esqueci minha senha</a>
              </div>

              <button type="submit" class="action-button" :class="{ 'is-loading': isLoading, 'has-submit-error': submitError }">
                <span v-if="isLoading" class="spinner"></span>
                <span>{{ isLoading ? 'CONECTANDO...' : 'ENTRAR' }}</span>
                <i v-if="!isLoading" class="bi bi-arrow-right-short"></i>
              </button>
            </form>

            <form v-else @submit.prevent="processRecovery">
              <div v-if="recoveryStep === 1">
                <div class="input-group">
                  <label>VERIFICAÇÃO CAPTCHA</label>
                  <input type="text" v-model="captchaToken" placeholder="Simule o token de captcha" @input="clearError('captcha')"/>
                  <div class="input-line" :class="{ 'has-error': errors.captcha }"></div>
                </div>
                <div class="input-group" style="margin-top: 10px">
                  <label>DIGITE SEU EMAIL</label>
                  <input type="email" v-model="recoveryData.email" placeholder="seu@email.com" @input="clearError('recoveryEmail')"/>
                  <div class="input-line" :class="{ 'has-error': errors.recoveryEmail }"></div>
                </div>
              </div>

              <div v-if="recoveryStep === 2" class="input-group">
                <label>CÓDIGO DE VERIFICAÇÃO</label>
                <input type="text" v-model="recoveryData.code" placeholder="000000" maxlength="6" @input="clearError('recoveryCode')"/>
                <div class="input-line" :class="{ 'has-error': errors.recoveryCode }"></div>
                <div class="resend-wrapper">
                  <button type="button" class="link-button" :disabled="resendCountdown > 0 || isLoading" @click="handleResendCode">
                    {{ resendCountdown > 0 ? `Receber novamente (${resendCountdown}s)` : 'Receber novamente' }}
                  </button>
                </div>
              </div>

              <div v-if="recoveryStep === 3" class="input-group password-group">
                <label>NOVA SENHA</label>
                <div class="input-wrapper">
                  <input :type="showNewPassword ? 'text' : 'password'" v-model="recoveryData.newPassword" placeholder="••••••••" @input="clearError('recoveryNewPassword')"/>
                  <button type="button" class="password-toggle" @click="showNewPassword = !showNewPassword"><i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i></button>
                </div>
              </div>

              <button type="submit" class="action-button" :class="{ 'is-loading': isLoading }">
                <span>{{ isLoading ? 'PROCESSANDO...' : getRecoveryButtonLabel() }}</span>
              </button>
              <div class="forgot-password-link" style="margin-top: 15px">
                <a @click.prevent="cancelRecovery" href="#">Voltar ao login</a>
              </div>
            </form>
          </div>
        </div>

        <div class="overlay-slider">
          <div class="overlay-inner">
            <div class="overlay-content" v-if="!isSignUp && recoveryStep === 0">
              <h2 class="title-editorial">Novo por <br />aqui?</h2>
              <p class="description-editorial">Inicie seu cadastro para acessar as métricas.</p>
              <button @click="isSignUp = true" class="ghost-button"><span>CRIAR CONTA</span><i class="bi bi-chevron-right"></i></button>
            </div>
            <div class="overlay-content" v-else-if="!isSignUp && recoveryStep > 0">
              <h2 class="title-editorial">Recuperação <br />de Acesso</h2>
              <p class="description-editorial">Siga os passos para redefinir sua senha.</p>
            </div>
            <div class="overlay-content" v-else>
              <h2 class="title-editorial">Já possui <br />acesso?</h2>
              <p class="description-editorial">Retorne ao painel operacional.</p>
              <button @click="isSignUp = false; recoveryStep = 0;" class="ghost-button">
                <i class="bi bi-chevron-left"></i><span>VOLTAR AO LOGIN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <div class="modal-icon"><i class="bi bi-exclamation-triangle"></i></div>
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
      showLoginPassword: false,
      showSignupPassword: false,
      showNewPassword: false,
      isLoading: false,
      submitError: false,
      recoveryStep: 0, // 0: Login, 1: Captcha+Email, 2: Code, 3: NewPass
      recoveryData: { email: '', code: '', newPassword: '' },
      captchaToken: '',
      resendCountdown: 0,
      resendInterval: null,
      formData: {
        loginUser: '',
        loginPassword: '',
        signupUser: '',
        signupEmail: '',
        signupPassword: '',
      },
      errors: {
        loginUser: '',
        loginPassword: '',
        signupUser: '',
        signupEmail: '',
        signupPassword: '',
        recoveryEmail: '',
        recoveryCode: '',
        recoveryNewPassword: '',
        captcha: '',
      },
    };
  },
  watch: {
    '$route.query.mode': {
      handler(mode) {
        this.syncModeWithQuery(mode);
      },
      immediate: true,
    },
  },
  mounted() {
    this.syncModeWithQuery(this.$route.query.mode);
  },
  beforeUnmount() {
    if (this.resendInterval) clearInterval(this.resendInterval);
  },
  computed: {
    passwordStrength() {
      const p = this.formData.signupPassword;
      if (!p) return 0;
      let score = 0;
      if (p.length >= 6) score += 40;
      if (/[A-Za-z]/.test(p)) score += 30;
      if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score += 30;
      return score;
    },
    strengthColor() {
      const s = this.passwordStrength;
      if (s <= 40) return '#ff4d4d';
      if (s <= 70) return '#ffd11a';
      return '#111111';
    },
    strengthLabel() {
      const s = this.passwordStrength;
      if (s === 0) return '';
      if (s <= 40) return 'Senha Fraca';
      if (s <= 70) return 'Senha Média';
      return 'Senha Segura';
    },
    recoveryPasswordStrength() {
      const p = this.recoveryData.newPassword;
      if (!p) return 0;
      let score = 0;
      if (p.length >= 6) score += 40;
      if (/[A-Za-z]/.test(p)) score += 30;
      if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score += 30;
      return score;
    },
    recoveryStrengthColor() {
      const s = this.recoveryPasswordStrength;
      if (s <= 40) return '#ff4d4d';
      if (s <= 70) return '#ffd11a';
      return '#111111';
    },
    recoveryStrengthLabel() {
      const s = this.recoveryPasswordStrength;
      if (s === 0) return '';
      if (s <= 40) return 'Senha Fraca';
      if (s <= 70) return 'Senha Média';
      return 'Senha Segura';
    },
  },
  methods: {
    syncModeWithQuery(mode) {
      if (mode === 'signup') this.isSignUp = true;
      else if (mode === 'login') {
        this.isSignUp = false;
        this.recoveryStep = 0;
      }
    },
    getRecoveryTitle(part) {
      if (this.recoveryStep === 0)
        return part === 'eyebrow'
          ? 'Entrar na EcoWave'
          : 'Login <span class="text-highlight">System.</span>';
      const titles = {
        1: { eyebrow: 'Recuperação', main: 'Digite seu email.' },
        2: { eyebrow: 'Verificação', main: 'Insira o código.' },
        3: { eyebrow: 'Redefinição', main: 'Nova senha.' },
      };
      return titles[this.recoveryStep][part];
    },
    getRecoveryButtonLabel() {
      const labels = {
        1: 'ENVIAR CÓDIGO',
        2: 'VERIFICAR',
        3: 'DEFINIR SENHA',
      };
      return labels[this.recoveryStep];
    },
    triggerModal(title, message) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.showModal = true;
    },
    clearError(field) {
      this.errors[field] = '';
    },
    triggerSubmitErrorFeedback() {
      this.submitError = true;
      setTimeout(() => {
        this.submitError = false;
      }, 1500);
    },
    updateMousePosition(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    validateForm(type) {
      let isValid = true;

      if (type === 'signup') {
        if (!this.formData.signupUser) {
          this.errors.signupUser = 'O nome completo é obrigatório.';
          isValid = false;
        }
        if (!this.formData.signupEmail) {
          this.errors.signupEmail = 'O e-mail é obrigatório.';
          isValid = false;
        }
        const pass = this.formData.signupPassword;
        if (!pass) {
          this.errors.signupPassword = 'A senha é obrigatória.';
          isValid = false;
        } else if (pass.length < 6) {
          this.errors.signupPassword = 'Mínimo de 6 caracteres.';
          isValid = false;
        } else if (!/[A-Za-z]/.test(pass)) {
          this.errors.signupPassword = 'Deve conter pelo menos 1 letra.';
          isValid = false;
        }
      } else if (type === 'login') {
        if (!this.formData.loginUser) {
          this.errors.loginUser = 'Insira seu usuário ou e-mail.';
          isValid = false;
        }
        if (!this.formData.loginPassword) {
          this.errors.loginPassword = 'A senha é obrigatória.';
          isValid = false;
        }
      } else if (type === 'recovery') {
        if (this.recoveryStep === 1) {
          if (!this.captchaToken) {
            this.errors.captcha = 'Complete o captcha.';
            isValid = false;
          }
          if (!this.recoveryData.email) {
            this.errors.recoveryEmail = 'O e-mail é obrigatório.';
            isValid = false;
          }
        } else if (this.recoveryStep === 2) {
          if (!this.recoveryData.code || this.recoveryData.code.length !== 6) {
            this.errors.recoveryCode = 'Código de 6 dígitos necessário.';
            isValid = false;
          }
        } else if (this.recoveryStep === 3) {
          const pass = this.recoveryData.newPassword;
          if (!pass) {
            this.errors.recoveryNewPassword = 'A nova senha é obrigatória.';
            isValid = false;
          } else if (pass.length < 6) {
            this.errors.recoveryNewPassword = 'Mínimo de 6 caracteres.';
            isValid = false;
          } else if (!/[A-Za-z]/.test(pass)) {
            this.errors.recoveryNewPassword = 'Deve conter pelo menos 1 letra.';
            isValid = false;
          }
        }
      }
      return isValid;
    },
    startRecovery() {
      this.recoveryStep = 1;
      this.recoveryData.email = this.formData.loginUser || '';
    },
    cancelRecovery() {
      this.recoveryStep = 0;
      this.recoveryData = { email: '', code: '', newPassword: '' };
      this.captchaToken = '';
      this.clearAllRecoveryErrors();
      if (this.resendInterval) clearInterval(this.resendInterval);
      this.resendCountdown = 0;
    },
    clearAllRecoveryErrors() {
      this.errors.recoveryEmail = '';
      this.errors.recoveryCode = '';
      this.errors.recoveryNewPassword = '';
      this.errors.captcha = '';
    },
    startResendTimer() {
      this.resendCountdown = 60;
      if (this.resendInterval) clearInterval(this.resendInterval);
      this.resendInterval = setInterval(() => {
        if (this.resendCountdown > 0) this.resendCountdown--;
        else clearInterval(this.resendInterval);
      }, 1000);
    },
    async handleResendCode() {
      if (!this.recoveryData.email) {
        this.errors.recoveryEmail = 'O e-mail é obrigatório.';
        this.triggerSubmitErrorFeedback();
        return;
      }

      this.isLoading = true;
      try {
        await axios.post('http://127.0.0.1:3000/ReenviarCodigo', {
          email: this.recoveryData.email,
        });
        this.triggerModal(
          'SUCESSO',
          'Se o e-mail existir, um novo código foi enviado.'
        );
        this.startResendTimer();
      } catch (error) {
        const msg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Erro ao reenviar código.';
        this.triggerModal('ERRO', msg);
      } finally {
        this.isLoading = false;
      }
    },
    async processRecovery() {
      if (!this.validateForm('recovery')) {
        this.triggerSubmitErrorFeedback();
        return;
      }

      this.isLoading = true;
      try {
        if (this.recoveryStep === 1) {
          await axios.post('http://127.0.0.1:3000/ValidarCaptcha', {
            captchaToken: this.captchaToken,
          });

          await axios.post('http://127.0.0.1:3000/EsqueciSenha', {
            email: this.recoveryData.email,
          });

          this.triggerModal(
            'SUCESSO',
            'Se o e-mail existir, um código de recuperação foi enviado.'
          );
          this.recoveryStep = 2;
          this.startResendTimer();
        } else if (this.recoveryStep === 2) {
          await axios.post('http://127.0.0.1:3000/VerificarCodigo', {
            email: this.recoveryData.email,
            code: this.recoveryData.code,
          });
          this.triggerModal(
            'SUCESSO',
            'Código verificado! Agora defina sua nova senha.'
          );
          this.recoveryStep = 3;
        } else if (this.recoveryStep === 3) {
          await axios.post('http://127.0.0.1:3000/ResetPassword', {
            email: this.recoveryData.email,
            senha: this.recoveryData.newPassword,
          });
          this.triggerModal(
            'SUCESSO',
            'Senha alterada com sucesso! Faça login com sua nova senha.'
          );
          this.cancelRecovery();
          this.formData.loginUser = this.recoveryData.email;
          this.formData.loginPassword = '';
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Ocorreu um erro no processo.';
        this.triggerModal('ERRO', errorMessage);
      } finally {
        this.isLoading = false;
      }
    },
    async handleSubmit(type) {
      if (!this.validateForm(type)) {
        this.triggerSubmitErrorFeedback();
        return;
      }

      this.isLoading = true;
      const isSignup = type === 'signup';

      try {
        if (isSignup) {
          await axios.post('http://127.0.0.1:3000/NovoUsuario', {
            nome: this.formData.signupUser,
            email: this.formData.signupEmail,
            senha: this.formData.signupPassword,
          });

          this.triggerModal(
            'CADASTRO REALIZADO',
            'Sua conta foi criada com sucesso! Por favor, realize o login manualmente para validar suas credenciais.'
          );

          this.formData.loginUser = this.formData.signupEmail;
          this.formData.loginPassword = '';
          this.formData.signupUser = '';
          this.formData.signupEmail = '';
          this.formData.signupPassword = '';

          this.isSignUp = false;
        } else {
          const response = await axios.post('http://127.0.0.1:3000/Login', {
            email: this.formData.loginUser,
            senha: this.formData.loginPassword,
          });

          if (response.data && response.data.token) {
            sessionStorage.setItem('ecoWave_user', response.data.nome);
            sessionStorage.setItem('ecoWave_email', response.data.email);
            sessionStorage.setItem('ecoWave_userId', response.data.id);
            sessionStorage.setItem('ecoWave_token', response.data.token);
            sessionStorage.setItem('ecoWave_role', response.data.role || 'USER');
            sessionStorage.setItem('isLogged', 'true');

            const role = response.data.role || 'USER';
            if (role === 'ADMIN') this.$router.push('/administrador');
            else if (role === 'PROPRIETARIO') this.$router.push('/proprietario');
            else this.$router.push('/cadastrado');
          }
        }
      } catch (error) {
        this.triggerSubmitErrorFeedback();
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          '';

        if (errorMessage === 'Usuario Não Existente') {
          this.triggerModal(
            'CADASTRO PENDENTE',
            'Este e-mail não possui cadastro. Vamos criar sua conta!'
          );
          this.isSignUp = true;
          this.formData.signupEmail = this.formData.loginUser;
        } else if (errorMessage === 'Senha Incorreta') {
          this.triggerModal(
            'SENHA INCORRETA',
            'E-mail encontrado, mas a senha informada está incorreta.'
          );
          this.formData.loginPassword = '';
        } else {
          this.triggerModal(
            'ERRO DE CONEXÃO',
            'Erro no acesso: ' + (errorMessage || 'Falha na conexão.')
          );
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');

/* --- CONFIGURAÇÃO DA PÁGINA --- */
.main-wrapper {
  background: #f9f9f9; 
  color: #111111; 
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

/* --- BOTÃO VOLTAR (BASEADO NO CTA-PREMIUM-BTN) --- */
.btn-cta {
  position: absolute;
  top: 2.5rem; 
  left: 2.5rem;
  text-decoration: none;
  background: #111111;
  color: #ffffff;
  padding: 0.8rem 1.8rem;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 999px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 101;
}

.btn-cta:hover {
  background: #333333;
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.12);
}

/* --- SEÇÃO DO CONTAINER DE LOGIN --- */
.auth-section {
  width: 100%;
  max-width: 1000px;
  padding: 0 5%;
  z-index: 10;
}


/* BACKGROUND GRID DA PLATAFORMA */
.hero-bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, #f1f1f1 1px, transparent 1px),
                    linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  opacity: 0.7;
  z-index: 1;
}
.auth-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
  min-height: 560px; /* Altura mínima no desktop */
  height: auto;
  background: #ffffff;
  border-radius: 20px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0,0,0,0.03);
}
/* --- PAINÉIS LATERAIS --- */
.auth-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 50px;
  z-index: 2;
}

.form-box {
  width: 100%;
  max-width: 320px;
  opacity: 0;
  transform: scale(0.97) translateY(10px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  position: absolute;
}

.form-box.show {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: all;
  position: relative;
}

/* --- TIPOGRAFIA EDITORIAL --- */
.eyebrow {
  color: #777777;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  font-weight: 700;
  display: block;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.title-medium {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  font-weight: 400;
  margin-bottom: 30px;
  line-height: 0.95;
  letter-spacing: 0.01em;
}

.text-highlight { 
  color: #999999; 
}

/* --- INPUTS PREMIUM --- */
.input-group { 
  display: flex;
  flex-direction: column; /* Força o label a ficar acima e o input abaixo */
  margin-bottom: 22px; 
  position: relative;
}

.input-group label {
  display: block;
  width: 100%;
  font-size: 0.65rem;
  color: #777777;
  margin-bottom: 6px; /* Espaçamento entre o label e o placeholder/input */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.input-wrapper input {
  width: 100%;
  padding-right: 30px; /* Evita que o texto digitado passe por baixo do ícone de olho */
}

.input-group input {
  width: 100%;
  background: transparent;
  border: none;
  color: #111111;
  padding: 8px 0;
  outline: none;
  font-size: 0.95rem;
  font-family: inherit;
}

.input-line {
  height: 1px;
  background: #eaeaea;
  transition: all 0.3s ease;
}

input:focus + .input-line {
  background: #111111;
  height: 1.5px;
}

/* ALTERNÂNCIA DE SENHA COM BOOTSTRAP ICONS */
.password-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  font-size: 0.95rem;
  position: absolute;
  right: 0;
  color: #777777;
  user-select: none;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #111111;
}

/* --- VALIDAÇÕES INLINE --- */
.error-text {
  color: #ff4d4d;
  font-size: 0.65rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: fadeInUp 0.3s ease;
}

.input-line.has-error {
  background: #ff4d4d !important;
  height: 1.5px !important;
}

/* --- FORGOT PASSWORD LINK --- */
.forgot-password-link {
  text-align: right;
  margin-top: -12px;
  margin-bottom: 25px;
}

.forgot-password-link a {
  font-size: 0.65rem;
  color: #777777;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.25s;
  cursor: pointer;
}

.forgot-password-link a:hover { 
  color: #111111; 
}

/* --- BOTÕES OPERACIONAIS (ESTILO EDITORIAL COERENTE) --- */
.action-button {
  width: 100%;
  background: #111111;
  color: #ffffff;
  padding: 1.1rem;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid #111111;
  border-radius: 999px; /* Alinhado ao estilo premium de botões ovais */
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.action-button:hover {
  background: #333333;
  border-color: #333333;
  transform: translateY(-1px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.action-button i {
  font-size: 1.1rem;
  transition: transform 0.25s;
}

.action-button:hover i {
  transform: translateX(2px);
}

/* FEEDBACK DISCRETO DE SUBMIT NO BOTÃO */
.action-button.has-submit-error {
  background: #aa2222 !important;
  border-color: #aa2222 !important;
  transform: scale(0.98);
}

.action-button.is-loading {
  background: #555555;
  cursor: not-allowed;
  opacity: 0.8;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* --- BARRA DE FORÇA DA SENHA --- */
.strength-wrapper { margin-top: 10px; }
.strength-bar-bg { height: 2px; background: #efefef; width: 100%; border-radius: 2px; }
.strength-bar-fill { height: 100%; transition: all 0.4s ease; }
.strength-text { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; margin-top: 5px; display: block; letter-spacing: 0.05em; }

/* --- OVERLAY INTERNO INTERATIVO --- */
.overlay-slider {
  position: absolute;
  top: 0; left: 0; width: 50%; height: 100%;
  background: #111111;
  z-index: 100;
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.is-signup-active .overlay-slider {
  transform: translateX(100%);
}

.overlay-inner {
  width: 100%;
  z-index: 5;
}
.main-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 20px; }
.auth-container { position: relative; width: 100%; max-width: 1000px; min-height: 560px; height: auto; background: #ffffff; border-radius: 20px; display: flex; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.03); }

@media (max-width: 900px) {
  .auth-container { flex-direction: column; height: auto; min-height: unset; }
  .overlay-slider { display: none; }
  .auth-panel { padding: 40px 20px; width: 100%; }
  .form-box { display: none; position: relative; width: 100%; max-width: 100%; opacity: 1; transform: none; }
  .form-box.show { display: block; }
}
.overlay-content {
  padding: 0 45px;
  text-align: center;
  color: #ffffff;
  animation: fadeIn 0.5s ease-out;
}

.title-editorial {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  line-height: 0.95;
  letter-spacing: 0.02em;
  margin-bottom: 15px;
}

.description-editorial {
  font-size: 0.85rem;
  line-height: 1.6;
  color: #cccccc;
  max-width: 280px;
  margin: 0 auto 25px auto;
}

.ghost-button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  padding: 0.8rem 2rem;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.ghost-button:hover { 
  background: #ffffff; 
  color: #111111; 
  border-color: #ffffff;
}

.ghost-button i {
  font-size: 0.7rem;
}

/* --- MODAIS COM GLASSMORPHISM EDITORIAL --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(249, 249, 249, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  text-align: center;
  width: 90%;
  max-width: 400px;
  padding: 40px;
  background: #ffffff;
  border: 1px solid rgba(17, 17, 17, 0.06);
  border-radius: 20px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.05);
  animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-icon {
  font-size: 2rem;
  color: #111111;
  margin-bottom: 15px;
}

.modal-content h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  letter-spacing: 0.02em;
  margin: 0 0 10px 0;
}

.modal-content p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #444444;
  margin-bottom: 25px;
}

/* --- TRANSIÇÕES E ANIMAÇÕES --- */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

/* --- RESPONSIVIDADE BASEADA NO MODELO --- */
.mobile-switcher {
  display: none;
  margin-top: 20px;
  text-align: center;
}

.link-button {
  background: none;
  border: none;
  color: #777;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  text-transform: uppercase;
}

/* --- RESPONSIVIDADE OTIMIZADA --- */
@media (max-width: 900px) {
  .auth-container {
    flex-direction: column;
    min-height: auto; /* Permite crescer conforme o conteúdo */
    padding-bottom: 40px;
  }
  
  .overlay-slider {
    display: none; /* Oculta o overlay grande */
  }

  .mobile-switcher {
    display: block; /* Mostra o trocador de modo */
  }

  .auth-panel {
    padding: 40px 20px;
    width: 100%;
  }

  .form-box {
    opacity: 1;
    transform: none;
    position: relative;
    display: none;
    max-width: 100%;
  }

  .form-box.show {
    display: block;
  }

  .btn-cta {
    top: 1rem;
    left: 1rem;
    padding: 0.6rem 1rem;
    font-size: 0.7rem;
  }
}
</style>