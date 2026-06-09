<template>
  <section class="section-loja">
    <router-link to="/cadastrado" class="btn-cta-back">
      <i class="bi bi-arrow-left"></i> Voltar ao Painel
    </router-link>

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

        <button @click="showCart = true" class="btn-icon-nav" aria-label="Carrinho">
          <i class="bi bi-cart3"></i>
          <span class="cart-count" v-if="carrinho.length">{{ carrinho.length }}</span>
        </button>

        <button @click="showHistory = true" class="btn-icon-nav" aria-label="Histórico">
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
        :style="{ 'animation-delay': (index * 0.08) + 's' }"
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

    <div class="toast-container">
      <transition-group name="toast-fade">
        <div v-for="toast in toasts" :key="toast.id" class="toast-message">
          <i class="bi bi-check2-circle" v-if="!toast.error"></i>
          <i class="bi bi-exclamation-circle" v-else></i>
          {{ toast.text }}
        </div>
      </transition-group>
    </div>

    <transition name="modal-fade">
      <div v-if="showErrorModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-icon">!</div>
          <h3 class="modal-title">Saldo Insuficiente</h3>
          <p class="modal-text">
            O produto <strong class="dark-accent">{{ produtoInsuficiente?.nome }}</strong> custa
            <strong>{{ produtoInsuficiente?.pontosNecessarios }} coins</strong>.<br>
            Seu saldo atual é de <strong>{{ usuarioStore.saldoCoins }} coins</strong>.
          </p>
          <p class="modal-text text-secondary">
            Recicle materiais para ganhar coins, acumule saldo e volte para completar sua compra.
          </p>
          <div class="modal-buttons-stack">
            <button @click="irParaReciclagem" class="btn-modal primary-btn">
              Reciclar agora para ganhar coins
            </button>
            <button @click="showErrorModal = false" class="btn-modal secondary-btn">
              Fechar / Continuar navegando
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal-fade">
      <div v-if="showCart" class="modal-overlay">
        <div class="modal-content modal-extended">
          <h3 class="modal-title alignment-left">Seu Carrinho</h3>
          <div class="separator-line"></div>

          <div v-if="carrinho.length === 0" class="empty-cart-message">Seu carrinho está vazio.</div>

          <ul class="modal-list" v-else>
            <li v-for="(c, i) in carrinho" :key="i">
              <div class="item-meta">
                <strong class="item-title">{{ c.nome }}</strong>
                <span class="item-cost">{{ c.pontosNecessarios }} coins</span>
              </div>
              <button @click="removerDoCarrinho(i)" class="btn-remove">Remover</button>
            </li>
          </ul>

          <div class="total-section">
            <span class="total-label">Total da Ordem:</span>
            <span class="total-value">{{ totalCarrinho }} coins</span>
            <div class="user-subbalance">Seu saldo: {{ usuarioStore.saldoCoins }} coins</div>
          </div>

          <div v-if="carrinho.length > 0" class="address-wrapper">
            <h4 class="form-section-title">Endereço de Entrega</h4>
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
              <div class="input-group large-span">
                <label>Complemento</label>
                <input v-model="endereco.complemento" type="text" placeholder="Ap, bloco, referência...">
                <div class="input-line"></div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="fecharCarrinho" class="btn-modal secondary-btn">Voltar</button>
            <button
              @click="finalizarCompra"
              class="btn-modal primary-btn"
              :disabled="carrinho.length === 0 || carregandoCompra"
            >
              {{ carregandoCompra ? 'PROCESSANDO...' : 'Confirmar Resgate' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal-fade">
      <div v-if="showHistory" class="modal-overlay">
        <div class="modal-content modal-extended">
          <h3 class="modal-title alignment-left">Histórico de Resgates</h3>
          <div class="separator-line"></div>
          
          <div v-if="historico.length === 0" class="empty-cart-message">Você ainda não realizou trocas.</div>
          
          <ul class="modal-list scrollable-list">
            <li v-for="(h, i) in historico" :key="i" class="history-item-row">
              <div class="history-row-top">
                <small class="history-date">{{ formatarData(h.data) }}</small>
                <strong class="history-points">- {{ h.pontosGastos }} Coins</strong>
              </div>
              <span class="history-product-details">
                {{ h.recompensaNome }} • entrega em ~ {{ h.previsaoDias }} dias
              </span>
            </li>
          </ul>
          
          <div class="modal-footer padding-top-only">
            <button @click="showHistory = false" class="btn-modal secondary-btn">Fechar</button>
          </div>
        </div>
      </div>
    </transition>

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
    const saldo = Number(usuario.totalPontos ?? usuario.coins ?? usuario.saldoCoins ?? 0);

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

const tentarAdicionarAoCarrinho = (item: any) => {
  if (usuarioStore.saldoCoins < item.pontosNecessarios) {
    produtoInsuficiente.value = item;
    showErrorModal.value = true;
    return;
  }
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

  if (usuarioStore.saldoCoins < total) {
    produtoInsuficiente.value = { nome: 'Itens do carrinho', pontosNecessarios: total };
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

    const resposta = await axios.post(
      'http://localhost:3000/NovoResgate',
      {
        usuarioId: userId.value,
        itens: carrinho.value.map((item) => ({ id: item.id, qtd: 1 })),
        endereco: endereco.value
      },
      { headers: getAuthHeaders() }
    );

    const saldoAtualizado = usuarioStore.saldoCoins - total;
    usuarioStore.setSaldoCoins(saldoAtualizado);

    if (resposta.data.resgate) {
      historico.value.push(resposta.data.resgate);
    }

    carrinho.value = [];
    showCart.value = false;
    notificar('Recompensas resgatadas com sucesso! Verifique seu email.');
  } catch (error: any) {
    console.error('Erro no resgate:', error);
    const msgErro = error.response?.data?.message || 'Erro ao finalizar a compra.';
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
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');

/* =====================================================
   ESTRUTURA GERAL DA SEÇÃO (DESIGN SYSTEM ECOWAVE)
   ===================================================== */
.section-loja {
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  padding: 120px 6% 80px;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Botão minimalista Voltar */
.btn-cta-back {
  position: absolute;
  top: 40px;
  left: 6%;
  text-decoration: none;
  color: #000000;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
  border-bottom: 2px solid #000000;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s;
}

.btn-cta-back:hover {
  transform: translateX(-4px);
  opacity: 0.8;
}

/* HEADER DA LOJA */
.loja-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 24px;
}

.eyebrow {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
  color: #8e8e93;
  margin-bottom: 0.5rem;
}

.titulo {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-size: clamp(2.5rem, 5vw, 5rem);
  line-height: 0.9;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: #000000;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* BADGES E BOTÕES PREMIUM */
.coins-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #000000;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  border-radius: 2px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.btn-icon-nav {
  background: #ffffff;
  border: 1px solid #000000;
  color: #000000;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  border-radius: 2px;
  font-size: 1.15rem;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-icon-nav:hover {
  background: #000000;
  color: #ffffff;
  transform: translateY(-2px);
}

.cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #000000;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

/* =====================================================
   PRODUTOS GRID E CARDS
   ===================================================== */
.container-elements {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 40px 30px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: #8e8e93;
  font-size: 1rem;
}

.card-produto {
  background: #ffffff;
  border: 1px solid #e5e5ea;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeSlideUpCard 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeSlideUpCard {
  to { opacity: 1; transform: translateY(0); }
}

.card-image-container {
  height: 240px;
  background: #fbfbfd;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid #f2f2f7;
}

.img-product {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-produto:hover .img-product {
  transform: scale(1.03);
}

.placeholder-icon {
  font-size: 2.5rem;
  color: #d1d1d6;
}

.sold-out-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 0.1em;
  font-size: 0.9rem;
  color: #000000;
}

.card-info {
  padding: 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.partner-name {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #8e8e93;
}

.product-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #000000;
  margin: 6px 0 12px;
}

.product-description {
  font-size: 0.9rem;
  color: #48484a;
  line-height: 1.5;
  margin-bottom: 24px;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f2f2f7;
}

.price-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #000000;
}

.price-tag i {
  font-size: 1rem;
}

.price-value {
  font-weight: 700;
  font-size: 1.1rem;
}

/* BOTÃO DE COMPRA PADRÃO DESIGN SYSTEM */
.btn-buy {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 12px 20px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-buy:hover:not(:disabled) {
  background: #1c1c1e;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.btn-buy:disabled {
  background: transparent;
  color: #aeaeae;
  border-color: #d1d1d6;
  cursor: not-allowed;
}

/* =====================================================
   MODAIS PREMIUM (BLUR & TRANSPARÊNCIA)
   ===================================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-content {
  background: #ffffff;
  border: 1px solid #e5e5ea;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  width: 100%;
  max-width: 440px;
  padding: 40px;
  animation: modalScaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.modal-extended {
  max-width: 560px;
}

@keyframes modalScaleUp {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-icon {
  width: 50px;
  height: 50px;
  border: 2px solid #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 20px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.alignment-left {
  text-align: left;
  font-size: 1.3rem;
  margin-bottom: 0;
}

.separator-line {
  height: 1px;
  background: #e5e5ea;
  margin: 20px 0;
}

.modal-text {
  font-size: 0.95rem;
  color: #2c2c2e;
  line-height: 1.6;
  margin-bottom: 12px;
}

.modal-text.text-secondary {
  color: #8e8e93;
  font-size: 0.9rem;
  margin-bottom: 32px;
}

.dark-accent {
  color: #000000;
}

/* LISTAS INTERNAS DOS MODAIS */
.empty-cart-message {
  padding: 30px 0;
  color: #8e8e93;
  font-size: 0.95rem;
}

.modal-list {
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
}

.modal-list li {
  padding: 16px 0;
  border-bottom: 1px solid #f2f2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-size: 0.95rem;
  color: #000000;
}

.item-cost {
  font-size: 0.85rem;
  color: #8e8e93;
}

.btn-remove {
  background: transparent;
  border: none;
  color: #ff3b30;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px 8px;
  transition: opacity 0.2s;
}

.btn-remove:hover {
  opacity: 0.6;
}

/* SESSÃO TOTAIS */
.total-section {
  background: #fbfbfd;
  padding: 20px;
  border-radius: 4px;
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 6px;
}

.total-label {
  font-size: 0.9rem;
  color: #48484a;
}

.total-value {
  font-weight: 700;
  font-size: 1.15rem;
  color: #000000;
}

.user-subbalance {
  grid-column: 1 / -1;
  font-size: 0.8rem;
  color: #8e8e93;
  margin-top: 4px;
}

/* BOTÕES INTERNOS DE MODAIS */
.modal-buttons-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.padding-top-only {
  margin-top: 20px;
}

.btn-modal {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 14px 28px;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-modal.primary-btn {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
}

.btn-modal.primary-btn:hover:not(:disabled) {
  background: #1c1c1e;
  transform: translateY(-2px);
}

.btn-modal.primary-btn:disabled {
  background: #d1d1d6;
  border-color: #d1d1d6;
  color: #8e8e93;
  cursor: not-allowed;
}

.btn-modal.secondary-btn {
  background: transparent;
  color: #000000;
  border: 1px solid #000000;
}

.btn-modal.secondary-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

/* HISTÓRICO DE RESGATES COMPONENTES */
.scrollable-list {
  max-height: 280px;
}

.history-item-row {
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 8px;
}

.history-row-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.history-date {
  font-size: 0.8rem;
  color: #8e8e93;
}

.history-points {
  font-size: 0.95rem;
  color: #ff3b30;
}

.history-product-details {
  font-size: 0.9rem;
  color: #2c2c2e;
}

/* =====================================================
   FORMULÁRIO DE ENDEREÇO MINIMALISTA
   ===================================================== */
.address-wrapper {
  margin-top: 32px;
}

.form-section-title {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #000000;
  margin-bottom: 20px;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 20px;
}

.input-group {
  position: relative;
  display: flex;
  flex-direction: column;
}

.large-span {
  grid-column: 1 / -1;
}

.input-group label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #8e8e93;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.input-group input {
  width: 100%;
  border: none;
  padding: 8px 0;
  outline: none;
  font-size: 0.9rem;
  background: transparent;
  color: #000000;
  font-family: 'Inter', sans-serif;
}

.input-line {
  height: 1px;
  background: #e5e5ea;
  transition: all 0.25s ease;
}

.input-group input:focus + .input-line {
  background: #000000;
  height: 2px;
}

/* =====================================================
   TOASTS E TRANSIÇÕES EXTRA
   ===================================================== */
.toast-container {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast-message {
  background: #000000;
  color: #ffffff;
  padding: 16px 28px;
  border-radius: 2px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.toast-fade-enter-active, .toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-fade-enter-from { opacity: 0; transform: translateX(30px); }
.toast-fade-leave-to { opacity: 0; transform: scale(0.9); }

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.overlay-texture {
  position: fixed;
  inset: 0;
  background-image: radial-gradient(#000000 0.5px, transparent 0.5px);
  background-size: 30px 30px;
  opacity: 0.02;
  pointer-events: none;
  z-index: 0;
}

/* RESPONSIVIDADE COMPLETA */
@media (max-width: 768px) {
  .section-loja { padding-top: 100px; }
  .loja-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .header-actions { width: 100%; justify-content: space-between; }
  .address-grid { grid-template-columns: 1fr; }
  .modal-footer { flex-direction: column-reverse; }
  .btn-modal { width: 100%; }
}
</style>