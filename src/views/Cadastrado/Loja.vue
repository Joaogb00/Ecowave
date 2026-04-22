<template>
  <section class="section-loja">
   <router-link to="/cadastrado" class="btn-cta">Voltar ao Painel</router-link>
    <header class="loja-header">
      <div class="header-content">
        <span class="eyebrow">EcoWave Marketplace</span>
        <h1 class="titulo">Recompensas</h1>
      </div>
      
      <div class="coins-badge">
        <i class="bi bi-lightning-charge-fill"></i>
        <span>100 COINS</span>
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
          <img v-if="item.imagem" :src="item.imagem" class="img-product" alt="Produto">
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
            
            <button class="btn-buy" :disabled="item.estoque <= 0">
              {{ item.estoque > 0 ? 'Resgatar' : 'Indisponível' }}
              <i class="bi bi-arrow-right-short" v-if="item.estoque > 0"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="overlay-texture"></div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Loja',
  data() {
    return {
      recompensas: []
    }
  },
  mounted() {
    this.fetchRecompensas();
  },
  methods: {
    async fetchRecompensas() {
      try {
        const response = await axios.get('http://localhost:3000/Recompensas');
        this.recompensas = response.data.recompensas; 
      } catch (error) {
        console.error("Erro ao buscar recompensas:", error);
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

.section-loja {
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  padding: 80px 8%;
  font-family: 'Inter', sans-serif;
  position: relative;
}

/* Header */
.loja-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
  border-bottom: 2px solid #000;
  padding-bottom: 20px;
  animation: fadeInDown 0.8s ease;
  margin-top: 50px;
}

.eyebrow {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 700;
  color: #888;
  margin-bottom: 8px;
}

.titulo {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -2px;
  margin: 0;
}

.coins-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: 2px solid #000;
  font-weight: 800;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.coins-badge:hover {
  background: #000;
  color: #fff;
}

/* Grid Layout */
.container-elements {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

/* Card Styling */
.card-produto {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  opacity: 0; /* Começa invisível para o fade-in */
  animation: fadeInUp 0.6s forwards;
}

.card-produto:hover {
  transform: translateY(-10px);
  border-color: #000;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

/* Imagem do Produto */
.card-image-container {
  height: 220px;
  background: #f9f9f9;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;
}

.img-product {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-produto:hover .img-product {
  transform: scale(1.05);
}

.placeholder-icon {
  font-size: 3rem;
  color: #ddd;
}

.sold-out-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 2px;
  color: #000;
}

/* Info Section */
.card-info {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.partner-name {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 1px;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 10px 0;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 25px;
  flex-grow: 1;
}

/* Footer do Card */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.price-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
  font-size: 1.1rem;
}

.btn-buy {
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-buy:hover:not(:disabled) {
  background: #333;
  padding-right: 25px;
}

.btn-buy:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}

/* Animações */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
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
/* Overlay sutil */
.overlay-texture {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: radial-gradient(#000 0.5px, transparent 0.5px);
  background-size: 30px 30px;
  opacity: 0.03;
  pointer-events: none;
}

@media (max-width: 768px) {
  .loja-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .titulo { font-size: 2.2rem; }
}
</style>