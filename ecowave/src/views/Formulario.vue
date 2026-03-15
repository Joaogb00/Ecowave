<template>
  <div class="main-wrapper" @mousemove="updateMousePosition">
    <section class="auth-section">
      <div class="auth-container" :class="{ 'is-signup-active': isSignUp }">
        
        <div class="auth-panel left-panel">
          <div class="form-box" :class="{ 'show': isSignUp }">
            <span class="eyebrow">Registras na ecowave</span>
            <h2 class="title-medium">Criar <span class="text-highlight">Perfil.</span></h2>
            <form @submit.prevent="handleSubmit('signup')">
              <div class="input-group">
                <label>NOME COMPLETO DO USUARIO</label>
                <input type="text" placeholder="Nome do operador" required />
                <div class="input-line"></div>
              </div>
              <div class="input-group">
                <label>EMAIL CONTATO</label>
                <input type="email" placeholder="exemplo@terminal.com" required />
                <div class="input-line"></div>
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
                <label>NOME DO USUARIO</label>
                <input type="text" placeholder="Usuario" required />
                <div class="input-line"></div>
              </div>
              <div class="input-group">
                <label>SUA SENHA</label>
                <input type="password" placeholder="••••••••" required />
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
  </div>
</template>

<script>
export default {
  name: 'BlackAndWhiteAuth',
  data() {
    return {
      isSignUp: false,
      mouseX: 0,
      mouseY: 0
    };
  },
  methods: {
    updateMousePosition(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    handleSubmit(type) {
      console.log(`Protocolo ${type} ativo.`);
    }
  }
}
</script>

<style scoped>

/* --- Reset e Base Monocromática --- */
.main-wrapper {
  background: white; /* Preto Puro */
  color: #FFFFFF;      /* Branco Puro */
 font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: default;
  margin: 50px;
}

.auth-container {
  position: relative;
  width: 1000px;
  width: 120vh;
  height: 75vh;
  background: white; /* Fundo do container preto */
  border: 1px solid rgb(0, 0, 0); /* Borda sutil branca */
  display: flex;
  overflow: hidden;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.175);
}

.auth-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  
}

/* --- Lógica de Revelação --- */
.form-box {
  width: 100%;
  max-width: 320px;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  color: black;
}

.form-box.show {
  opacity: 1;
  transform: scale(1);
  pointer-events: all;
  transition-delay: 0.3s;
}

/* --- Overlay Slider (Inversão Severa) --- */
.overlay-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: black; /* Fundo Branco Puro */
  z-index: 100;
  transition: transform 0.6s cubic-bezier(0.7, 0, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000; /* Texto dentro do overlay fica preto */
}

.is-signup-active .overlay-slider {
  transform: translateX(100%);
}

.overlay-inner {
  text-align: center;
  width: 100%;
}

.overlay-content {
  padding: 0 40px;
  animation: fadeIn 0.4s ease forwards;
  color: white;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- Estilos de Texto Monocromáticos --- */
.eyebrow {
  color: black; /* Branco em vez de verde */
  font-size: 10px;
  letter-spacing: 3px;
  font-weight: 700;
  display: block;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.overlay-slider .eyebrow {
  color: #000000; /* Eyebrow dentro do overlay fica preto */
}

.title-medium {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 25px;
  line-height: 1.1;
}

/* Removido o gradiente, agora é apenas branco */
.text-highlight {
  color: #FFFFFF;
  font-weight: 700;
}

.overlay-slider .title-medium,
.overlay-slider .text-highlight {
  color: white;/*TITULO DO CONTEINER QUE MEXE*/
}

/* --- Formulários e Inputs --- */
.input-group {
  margin-bottom: 25px;
}

.input-group label {
  display: block;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.7); /* Branco semi-transparente */
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.input-group input {
  width: 100%;
  background: transparent;
  border: none;
  color: black;
  padding: 10px 0;
  outline: none;
  font-family: 'Space Grotesk', sans-serif;
}

.input-line {
  height: 1px;
  background: rgba(0, 0, 0, 0.2); /* Linha sutil branca */
  transition: 0.4s;
}

input:focus + .input-line {
  background: black; /* Linha fica branca pura no foco */
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); /* Brilho branco */
}

/* --- Botões --- */
.action-button {
  width: 100%;
  background: #000000; /* Botão Branco */
  color: white;      /* Texto Preto */
  padding: 16px;
  font-weight: 700;
  border: 1px solid #FFFFFF;
  cursor: pointer;
  transition: 0.3s;
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: 1px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.175);
}

.action-button:hover {
    background-color: transparent;
  border: 1px solid black; /* Inverte no hover */
  color: black;
}

.ghost-button {
  background: transparent;
  border: 2px solid white; /* Borda preta (pois está no fundo branco) */
  color: white;            /* Texto preto */
  padding: 12px 25px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
  font-size: 0.8rem;
  font-family: 'Space Grotesk', sans-serif;
  transition: 0.3s;
}

.ghost-button:hover {
  background: #FFFFFF; /* Fica preto no hover */
  color: black;      /* Texto fica branco */
}

/* --- Responsividade --- */
@media (max-width: 800px) {
  .auth-container {
    flex-direction: column;
    height: auto;
    border: none;
  }
  .overlay-slider { display: none; } /* Esconde o painel branco no mobile */
  .form-box { opacity: 1; transform: none; display: none; }
  .form-box.show { display: block; padding: 20px 0; }
  .auth-panel { padding: 40px 20px; }
  .main-wrapper { cursor: auto; background: #000000; }
}
</style>