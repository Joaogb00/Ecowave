<template>
  <section class="section-loja">
    <header class="loja-header">
      <h1 class="titulo">Marketplace</h1>
      <div class="coins-badge">
        <i class="bi bi-coin"></i>
        <span>100 COINS</span>
      </div>
    </header>

    <div class="container-elements">
      <div class="card-produto" v-for="i in 3" :key="i">
        <div class="card-image">
          <i class="bi bi-box-seam"></i>
        </div>
        <div class="card-info">
          <h3>PRODUTO {{ i }}</h3>
          <p>Edição limitada com acabamento em preto fosco.</p>
          <div class="card-footer">
            <span class="price">50.00</span>
            <button class="btn-buy">ADQUIRIR</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Base Noir */
.section-loja {
  min-height: 100vh;
  background-color: #000000; /* Preto puro */
  color: #ffffff; /* Branco puro */
  padding: 40px 5%;
  font-family: 'Inter', sans-serif;
  letter-spacing: 1px;
}

/* Header com Linha Minimalista */
.loja-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
  border-bottom: 1px solid #333; /* Cinza bem escuro */
  padding-bottom: 20px;
}

.titulo {
  font-weight: 800;
  text-transform: uppercase;
}

.coins-badge {
  background: transparent;
  padding: 8px 16px;
  border: 1px solid #ffffff;
  color: #ffffff;
  font-weight: bold;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Grid */
.container-elements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

/* Card Estilo "Blackout" */
.card-produto {
  background: #0a0a0a; /* Cinza quase preto */
  border: 1px solid #222;
  border-radius: 0px; /* Cantos retos para visual mais sério */
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-produto:hover {
  border-color: #ffffff;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.05);
}

.card-image {
  height: 200px;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #333;
  border-bottom: 1px solid #222;
}

.card-info {
  padding: 25px;
}

.card-info h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.card-info p {
  font-size: 0.85rem;
  color: #888; /* Texto secundário em cinza médio */
  line-height: 1.6;
  margin-bottom: 25px;
}

/* Footer e Botão */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: 800;
  font-size: 1.2rem;
}

.price::before {
  content: "$";
  font-size: 0.8rem;
  margin-right: 4px;
}

.btn-buy {
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 10px 20px;
  font-weight: 900;
  font-size: 0.7rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;
}

.btn-buy:hover {
  background: #cccccc;
  letter-spacing: 2px;
}
</style>