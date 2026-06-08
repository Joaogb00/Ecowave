<template>
  <section class="section-admin">
    <HeaderAdm />
    <div class="sky-layer"></div>

    <div class="content-wrapper">
      <header class="header-bar">
        <div class="welcome-container">
          <span class="eyebrow">Configurações de Reciclagem</span>
          <h1 class="welcome-title">Materiais <span class="text-highlight">recicláveis.</span></h1>
          <p class="welcome-subtitle">
            Cadastre os materiais aceitos pela EcoWave, definindo o fator de CO₂ e os pontos por kg.
          </p>
        </div>
       
      </header>

      <div class="conta-layout">
        
        <div class="profile-form-container">
          <div class="form-header">
            <h2>Cadastrar novo material</h2>
            <p>Insira as especificações métricas do resíduo.</p>
          </div>

          <form @submit.prevent="salvar">
            <div class="form-group">
              <label>Nome do material</label>
              <input
                v-model="form.nome"
                type="text"
                placeholder="Ex: Plástico PET"
                required
              />
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Fator CO₂ (kg CO₂ / kg)</label>
                <input
                  v-model.number="form.fatorCO2"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div class="form-group">
                <label>Pontos por Kg</label>
                <input
                  v-model.number="form.pontosPorKg"
                  type="number"
                  step="1"
                  min="0"
                  required
                />
              </div>
            </div>

            <button type="submit" class="btn-primary" :disabled="carregando">
              {{ carregando ? 'Salvando...' : 'Cadastrar material' }}
            </button>

            <p v-if="erro" class="msg-erro">{{ erro }}</p>
            <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>
          </form>
        </div>

        <div class="lista-container">
          <div class="lista-header">
            <div>
              <h2>Materiais cadastrados</h2>
              <p class="lista-subtitle">Banco de dados atualizado da plataforma.</p>
            </div>
            <button class="btn-secondary" @click="carregarMateriais" :disabled="carregandoLista">
              {{ carregandoLista ? '...' : 'Atualizar' }}
            </button>
          </div>

          <div v-if="materiais.length === 0" class="empty-state">
            Nenhum material cadastrado ainda.
          </div>

          <ul v-else class="lista-materiais">
            <li v-for="m in materiais" :key="m.id" class="material-item">
              <div class="material-info">
                <strong>{{ m.nome }}</strong>
                <p>
                  CO₂: <span>{{ m.fatorCO2 }} kg/kg</span> —
                  <span>{{ m.pontosPorKg }} pontos/kg</span>
                </p>
              </div>
              <div class="material-icon-wrapper">
                <i class="bi bi-layers-half"></i>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
    <div class="overlay"></div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 1. Substitua o axios pelo seu serviço de API configurado
// (Ajuste o caminho abaixo para o local correto do seu ficheiro de api do front-end)
import api from '../../../../backend/src/services/api'; 
import HeaderAdm from '@/components/Administrador/HeaderAdm.vue';

const form = ref({
  nome: '',
  fatorCO2: 0,
  pontosPorKg: 0
});

const materiais = ref([]);
const carregando = ref(false);
const carregandoLista = ref(false);
const erro = ref('');
const sucesso = ref('');

const carregarMateriais = async () => {
  try {
    carregandoLista.value = true;
    // 2. Utilize "api.get" sem precisar de repetir o 'http://localhost:3000'
    const res = await api.get('/Materiais');
    materiais.value = res.data.materiais || res.data;
  } catch (e) {
    console.error(e);
  } finally {
    carregandoLista.value = false;
  }
};

const salvar = async () => {
  erro.value = '';
  sucesso.value = '';
  carregando.value = true;

  try {
    // 3. Utilize "api.post" para que o token de Admin seja enviado no cabeçalho
    await api.post('/NovoMaterial', {
      nome: form.value.nome,
      fatorCO2: Number(form.value.fatorCO2),
      pontosPorKg: Number(form.value.pontosPorKg)
    });

    sucesso.value = 'Material cadastrado com sucesso!';
    form.value = { nome: '', fatorCO2: 0, pontosPorKg: 0 };
    await carregarMateriais();
  } catch (e) {
    console.error(e);
    // Exibe a mensagem exata enviada pelo seu controller ou middleware do back-end
    erro.value = e?.response?.data?.message || 'Erro ao cadastrar material. Verifique as suas permissões.';
  } finally {
    carregando.value = false;
  }
};

onMounted(() => {
  carregarMateriais();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

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

.content-wrapper {
  width: 100%;
  max-width: 1250px;
  z-index: 10;
  margin-top: 20px;
}

/* Header Config */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 40px;
}

.welcome-container {
  text-align: left;
  width: 100%;
}

.eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #555555;
  text-transform: uppercase;
}

.welcome-title {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-size: clamp(2.6rem, 5vw, 4.5rem);
  line-height: 0.9;
  letter-spacing: -0.01em;
  color: #000000;
  margin: 10px 0 15px;
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
  color: #444444;
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  max-width: 700px;
  line-height: 1.5;
  margin: 0;
}

.btn-voltar {
  background: transparent;
  color: #000000;
  border: 1px solid #000000;
  padding: 12px 20px;
  border-radius: 2px;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn-voltar:hover {
  background: #f7f7f7;
  transform: translateY(-1px);
}

/* Layout Split */
.conta-layout {
  display: grid;
  grid-template-columns: 1.1fr 1.3fr;
  gap: 40px;
  width: 100%;
}

/* Card Formulário */
.profile-form-container {
  background: #ffffff;
  padding: 40px;
  border: 1px solid #000000;
  border-radius: 2px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.03);
  align-self: flex-start;
}

.form-header {
  margin-bottom: 30px;
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

/* Inputs Brutalistas */
.form-group {
  margin-bottom: 22px;
}

.form-group label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #000000;
  font-weight: 700;
  margin-bottom: 8px;
  display: block;
}

.form-group input {
  width: 100%;
  border: 1px solid #000000;
  border-radius: 2px;
  padding: 12px 14px;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  background: #ffffff;
  color: #000000;
  box-sizing: border-box;
  transition: background 0.2s;
}

.form-group input:focus {
  background: #f7f7f7;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

/* Botões */
.btn-primary {
  width: 100%;
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
  margin-top: 10px;
}

.btn-primary:hover {
  background: #222222;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #888888;
  border-color: #888888;
  cursor: not-allowed;
}

/* Coluna da Lista */
.lista-container {
  background: #ffffff;
  padding: 40px;
  border: 1px solid #000000;
  border-radius: 2px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.03);
}

.lista-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 15px;
}

.lista-header h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.2rem;
  letter-spacing: 0.02em;
  color: #000000;
  margin: 0 0 4px 0;
  text-transform: uppercase;
}

.lista-subtitle {
  color: #555555;
  font-size: 0.9rem;
  margin: 0;
}

.btn-secondary {
  background: transparent;
  color: #000000;
  border: 1px solid #000000;
  padding: 8px 16px;
  border-radius: 2px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f7f7f7;
}

/* Itens da Lista Brutalistas */
.lista-materiais {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.material-item {
  border: 1px solid #000000;
  border-radius: 2px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  transition: all 0.2s ease;
}

.material-item:hover {
  background: #f7f7f7;
  transform: translateX(3px);
}

.material-info strong {
  font-size: 1.1rem;
  font-weight: 700;
  color: #000000;
}

.material-info p {
  font-size: 0.88rem;
  color: #555555;
  margin: 4px 0 0 0;
}

.material-info p span {
  color: #000000;
  font-weight: 600;
}

.material-icon-wrapper {
  font-size: 1.3rem;
  color: #000000;
}

.empty-state {
  font-size: 0.95rem;
  color: #555555;
  text-align: center;
  padding: 40px 0;
  border: 1px dashed #000000;
}

/* Mensagens de Sistema */
.msg-erro {
  margin-top: 15px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #ff3b30;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.msg-sucesso {
  margin-top: 15px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border-left: 3px solid #000000;
  padding-left: 8px;
}

/* Responsividade */
@media (max-width: 1024px) {
  .section-admin {
    padding: 40px 1.5rem;
  }

  .conta-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .header-bar {
    flex-direction: column-reverse;
    gap: 20px;
    align-items: flex-start;
  }
}
</style>