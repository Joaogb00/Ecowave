<template>
  <section class="section-loja">
    <router-link to="/cadastrado" class="btn-cta">Voltar ao Painel</router-link>

    <header class="loja-header">
      <div class="header-content">
        <span class="eyebrow">EcoWave Marketplace</span>
        <h1 class="titulo">Recompensas</h1>
      </div>

      <div class="header-actions">
        <div class="coins-badge">
          <i class="bi bi-lightning-charge-fill"></i>
          <span>{{ usuarioStore.saldoCoins }} COINS</span>
        </div>

        <button @click="showCart = true" class="btn-icon-nav">
          <i class="bi bi-cart3"></i>
          <span class="cart-count" v-if="carrinho.length">{{ carrinho.length }}</span>
        </button>

        <button @click="showHistory = true" class="btn-icon-nav">
          <i class="bi bi-clock-history"></i>
        </button>
      </div>
    </header>

    <div class="container-elements">
      <div v-if="recompensas.length === 0" class="empty-state">
        <p>Aguardando novos suprimentos no terminal...</p>
      </div>

      <div
        class="card-produto"
        v-for="(item, index) in recompensas"
        :key="item.id"
        :style="{ 'animation-delay': (index * 0.1) + 's' }"
      >
        <div class="card-image-container">
        <img
  v-if="item.imagem"
  :src="'http://localhost:3000' + item.imagem"
  class="img-product"
  alt="Produto"
>
          <div v-else class="placeholder-icon">
            <i class="bi bi-box-seam"></i>
          </div>
          <div v-if="item.estoque <= 0" class="sold-out-overlay">ESGOTADO</div>
        </div>

        <div class="card-info">
          <span class="partner-name">{{ item.empresaParceira }}</span>
          <h3 class="product-title">{{ item.nome }}</h3>
          <p class="product-description">{{ item.descricao }}</p>

          <div class="card-footer">
            <div class="price-tag">
              <i class="bi bi-coin"></i>
              <span class="price-value">{{ item.pontosNecessarios }}</span>
            </div>

            <button
              @click="tentarAdicionarAoCarrinho(item)"
              class="btn-buy"
              :disabled="item.estoque <= 0"
            >
              {{ item.estoque > 0 ? 'Adicionar ao Carrinho' : 'Indisponível' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TOASTS -->
    <div class="toast-container">
      <transition-group name="toast-fade">
        <div v-for="toast in toasts" :key="toast.id" class="toast-message">
          <i class="bi bi-check2-circle" v-if="!toast.error"></i>
          <i class="bi bi-exclamation-circle" v-else></i>
          {{ toast.text }}
        </div>
      </transition-group>
    </div>

    <!-- MODAL SALDO INSUFICIENTE (por produto / total) -->
    <transition name="modal-fade">
      <div v-if="showErrorModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-icon">!</div>
          <h3>Saldo Insuficiente</h3>
          <p style="margin-bottom: 16px; color: #666; line-height: 1.6;">
            O produto <strong>{{ produtoInsuficiente?.nome }}</strong> custa
            <strong>{{ produtoInsuficiente?.pontosNecessarios }} coins</strong>.<br>
            Seu saldo atual é de <strong>{{ usuarioStore.saldoCoins }} coins</strong>.
          </p>
          <p style="margin-bottom: 30px; color: #666; line-height: 1.6;">
            Recicle materiais para ganhar coins, acumule saldo e volte para completar sua compra.
          </p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button
              @click="irParaReciclagem"
              class="btn-buy"
              style="justify-content: center;"
            >
              Reciclar agora para ganhar coins
            </button>
            <button
              @click="showErrorModal = false"
              class="btn-secondary"
              style="background: none; border: 1px solid #eee;"
            >
              Fechar / Continuar navegando
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MODAL CARRINHO + ENDEREÇO -->
    <div v-if="showCart" class="modal-overlay">
      <div class="modal-content" style="max-width: 520px; text-align: left;">
        <h3>Seu Carrinho</h3>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

        <div v-if="carrinho.length === 0">Seu carrinho está vazio.</div>

        <ul class="modal-list" v-else>
          <li v-for="(c, i) in carrinho" :key="i">
            <div style="display:flex; flex-direction:column">
              <strong>{{ c.nome }}</strong>
              <span>{{ c.pontosNecessarios }} coins</span>
            </div>
            <button @click="removerDoCarrinho(i)" class="btn-remove">Remover</button>
          </li>
        </ul>

        <div class="total-section" style="margin-top: 20px;">
          <strong>Total da Ordem: {{ totalCarrinho }} coins</strong><br>
          <small>Seu saldo: {{ usuarioStore.saldoCoins }} coins</small>
        </div>

        <!-- FORMULÁRIO DE ENDEREÇO -->
        <div v-if="carrinho.length > 0" style="margin-top: 20px;">
          <h4 style="margin-bottom: 10px;">Endereço de Entrega</h4>
          <div class="address-grid">
            <div class="input-group">
              <label>CEP</label>
              <input v-model="endereco.cep" type="text" placeholder="00000-000">
              <div class="input-line"></div>
            </div>
            <div class="input-group">
              <label>Rua</label>
              <input v-model="endereco.rua" type="text" placeholder="Nome da rua">
              <div class="input-line"></div>
            </div>
            <div class="input-group">
              <label>Número</label>
              <input v-model="endereco.numero" type="text" placeholder="123">
              <div class="input-line"></div>
            </div>
            <div class="input-group">
              <label>Bairro</label>
              <input v-model="endereco.bairro" type="text" placeholder="Centro">
              <div class="input-line"></div>
            </div>
            <div class="input-group">
              <label>Cidade</label>
              <input v-model="endereco.cidade" type="text" placeholder="Cidade">
              <div class="input-line"></div>
            </div>
            <div class="input-group">
              <label>Estado</label>
              <input v-model="endereco.estado" type="text" placeholder="UF">
              <div class="input-line"></div>
            </div>
            <div class="input-group" style="grid-column: 1 / -1;">
              <label>Complemento</label>
              <input v-model="endereco.complemento" type="text" placeholder="Ap, bloco, referência...">
              <div class="input-line"></div>
            </div>
          </div>
        </div>

        <div
          class="modal-footer"
          style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;"
        >
          <button @click="fecharCarrinho" class="btn-secondary">Voltar</button>
          <button
            @click="finalizarCompra"
            class="btn-buy"
            :disabled="carrinho.length === 0 || carregandoCompra"
          >
            {{ carregandoCompra ? 'PROCESSANDO...' : 'Confirmar Resgate' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL HISTÓRICO -->
    <div v-if="showHistory" class="modal-overlay">
      <div class="modal-content" style="max-width: 600px; text-align: left;">
        <h3>Histórico de Resgates</h3>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <div v-if="historico.length === 0">Você ainda não realizou trocas.</div>
        <ul class="modal-list">
          <li
            v-for="(h, i) in historico"
            :key="i"
            style="flex-direction: column; align-items: flex-start; gap: 5px;"
          >
            <div style="display:flex; justify-content: space-between; width: 100%;">
              <small>{{ formatarData(h.data) }}</small>
              <strong>- {{ h.pontosGastos }} Coins</strong>
            </div>
            <span style="color: #666; font-size: 0.9rem;">
              {{ h.recompensaNome }} • entrega em ~ {{ h.previsaoDias }} dias
            </span>
          </li>
        </ul>
        <div class="modal-footer" style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <button @click="showHistory = false" class="btn-secondary">Fechar</button>
        </div>
      </div>
    </div>

    <div class="overlay-texture"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUsuarioStore } from './store/usuario';

const usuarioStore = useUsuarioStore();
const router = useRouter();

const recompensas = ref<any[]>([]);
const userId = ref<string | null>(sessionStorage.getItem('ecoWave_userId'));
const carrinho = ref<any[]>([]);
const historico = ref<any[]>([]);
const toasts = ref<any[]>([]);
const showCart = ref(false);
const showHistory = ref(false);
const showErrorModal = ref(false);
const carregandoCompra = ref(false);
const carregandoDados = ref(false);
const produtoInsuficiente = ref<any | null>(null);

const endereco = ref({
  cep: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  complemento: ''
});

const totalCarrinho = computed(() =>
  carrinho.value.reduce((acc, item) => acc + Number(item.pontosNecessarios || 0), 0)
);

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('ecoWave_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const inicializar = async () => {
  await Promise.all([
    carregarDadosUsuario(),
    fetchRecompensas()
  ]);
};

const carregarDadosUsuario = async () => {
  try {
    if (!userId.value) return;
    carregandoDados.value = true;

    const res = await axios.get(
      `http://localhost:3000/Usuario/${userId.value}`,
      { headers: getAuthHeaders() }
    );

    const usuario = res.data.usuario || res.data;

    const saldo =
      Number(usuario.totalPontos ?? usuario.coins ?? usuario.saldoCoins ?? 0);

    // Atualiza store global
    usuarioStore.setUsuario({
      id: userId.value,
      nome: usuario.nome ?? '',
      email: usuario.email ?? '',
      saldoCoins: saldo,
    });

    historico.value = usuario.historicoResgates || [];
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    notificar('Não foi possível carregar seus dados.', true);
  } finally {
    carregandoDados.value = false;
  }
};

const fetchRecompensas = async () => {
  try {
    const response = await axios.get('http://localhost:3000/Recompensas');
    recompensas.value = response.data.recompensas || [];
  } catch (error) {
    console.error('Erro ao buscar recompensas:', error);
    notificar('Erro ao carregar recompensas.', true);
  }
};

// novo fluxo: checa saldo ao adicionar
const tentarAdicionarAoCarrinho = (item: any) => {
  // se o produto sozinho já é maior que o saldo, mostra modal
  if (usuarioStore.saldoCoins < item.pontosNecessarios) {
    produtoInsuficiente.value = item;
    showErrorModal.value = true;
    return;
  }

  // se não, adiciona normalmente
  adicionarAoCarrinho(item);
};

const adicionarAoCarrinho = (item: any) => {
  const jaExiste = carrinho.value.some((c) => c.id === item.id);
  if (jaExiste) {
    notificar('Esse item já está no carrinho.', true);
    return;
  }

  carrinho.value.push(item);
  notificar(`Você adicionou ${item.nome} ao carrinho.`);
};

const removerDoCarrinho = (index: number) => {
  const item = carrinho.value[index];
  carrinho.value.splice(index, 1);
  notificar(`Você removeu ${item.nome} do carrinho.`);
};

const fecharCarrinho = () => {
  showCart.value = false;
};

const validarEndereco = () => {
  const { cep, rua, numero, bairro, cidade, estado } = endereco.value;
  return cep && rua && numero && bairro && cidade && estado;
};

const finalizarCompra = async () => {
  const total = totalCarrinho.value;

  // Validação de saldo
  if (usuarioStore.saldoCoins < total) {
    produtoInsuficiente.value = {
      nome: 'Itens do carrinho',
      pontosNecessarios: total,
    };
    showCart.value = false;
    showErrorModal.value = true;
    return;
  }

  if (!validarEndereco()) {
    notificar('Por favor, preencha os campos obrigatórios do endereço.', true);
    return;
  }

  try {
    carregandoCompra.value = true;

    // Chamada para processar o resgate no backend
    const resposta = await axios.post(
  'http://localhost:3000/NovoResgate',
  {
    usuarioId: userId.value,
    itens: carrinho.value.map((item) => ({ id: item.id, qtd: 1 })), // O Backend agora aceita isso
    endereco: endereco.value // Envia o objeto inteiro
  },
  { headers: getAuthHeaders() }
);

    // --- CORREÇÃO AQUI ---
    // Atualiza o saldo localmente subtraindo o total gasto
    const saldoAtualizado = usuarioStore.saldoCoins - total;
    usuarioStore.setSaldoCoins(saldoAtualizado);
    // ---------------------

    if (resposta.data.resgate) {
      historico.value.push(resposta.data.resgate);
    }

    carrinho.value = [];
    showCart.value = false;
    notificar('Recompensas resgatadas com sucesso! Verifique seu email.');
  } catch (error: any) {
    console.error('Erro no resgate:', error);
    const msgErro =
      error.response?.data?.message || 'Erro ao finalizar a compra.';
    notificar(msgErro, true);
  } finally {
    carregandoCompra.value = false;
  }
};

const irParaReciclagem = () => {
  showErrorModal.value = false;
  router.push('/reciclagem');
};

const formatarData = (dataIso: string) => {
  if (!dataIso) return '';
  try {
    return new Date(dataIso).toLocaleString('pt-BR');
  } catch {
    return dataIso;
  }
};

const notificar = (msg: string, isError = false) => {
  const id = Date.now() + Math.random();
  toasts.value.push({ id, text: msg, error: isError });

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3000);
};

onMounted(() => {
  inicializar();
});
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

/* TOASTS */
.toast-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-message {
  background: #000;
  color: #fff;
  padding: 15px 25px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-width: 280px;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* MODAIS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  text-align: center;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border: 1px solid #eee;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.modal-icon {
  font-size: 40px;
  font-weight: 200;
  margin-bottom: 20px;
  color: #000;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* LAYOUT GERAL */
.section-loja {
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  padding: 80px 8%;
  font-family: 'Inter', sans-serif;
  position: relative;
}

.loja-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
  border-bottom: 2px solid #000;
  padding-bottom: 20px;
  margin-top: 50px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.coins-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: 2px solid #000;
  font-weight: 800;
  font-size: 0.9rem;
}

.btn-icon-nav {
  background: none;
  border: 2px solid #000;
  padding: 10px 14px;
  cursor: pointer;
  position: relative;
  transition: 0.3s;
  font-size: 1.2rem;
}

.btn-icon-nav:hover {
  background: #000;
  color: #fff;
}

.cart-count {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #000;
  color: #fff;
  font-size: 10px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* GRID & CARDS */
.container-elements {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.card-produto {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  animation: fadeInUp 0.6s forwards;
}

.card-image-container {
  height: 220px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-product {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 10px 0;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 25px;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-buy {
  background: #000;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: transparent;
  color: #666;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 600;
  border: none;
}

.modal-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-list li {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-remove {
  background: none;
  border: 1px solid #ff4d4d;
  color: #ff4d4d;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
}

.btn-cta {
  position: absolute;
  top: 40px;
  left: 40px;
  text-decoration: none;
  color: #000;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  border-bottom: 2px solid #000;
}

.overlay-texture {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#000 0.5px, transparent 0.5px);
  background-size: 30px 30px;
  opacity: 0.03;
  pointer-events: none;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;
  margin-top: 10px;
}

.address-grid .input-group {
  margin-bottom: 0;
}

.address-grid label {
  font-size: 10px;
  text-transform: uppercase;
  color: #999;
  font-weight: 700;
  letter-spacing: 1px;
}

.address-grid input {
  width: 100%;
  border: none;
  padding: 8px 0;
  outline: none;
  font-size: 13px;
  background: transparent;
}

.address-grid .input-line {
  height: 1px;
  background: #eee;
  transition: 0.3s;
}

.address-grid input:focus + .input-line {
  background: #000;
  height: 2px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>