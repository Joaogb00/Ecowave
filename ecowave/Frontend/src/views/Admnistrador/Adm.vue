<template>
  <section class="hero-adm">
    <div class="form-container">
      <h2>Cadastrar Recompensa</h2>
      <form @submit.prevent="cadastrarRecompensa">
        <input v-model="form.nome" type="text" placeholder="Nome do Produto" required>
        <textarea v-model="form.descricao" placeholder="Descrição Detalhada"></textarea>
        <div class="row">
          <input v-model.number="form.pontosNecessarios" type="number" placeholder="Preço (Coins)" required>
          <input v-model.number="form.estoque" type="number" placeholder="Estoque Inicial" required>
        </div>
        <input v-model="form.empresaParceira" type="text" placeholder="Empresa Parceira">
        
        <button type="submit" :disabled="loading">
          {{ loading ? 'CADASTRANDO...' : 'PUBLICAR NA LOJA' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import axios from 'axios'; // Certifique-se de ter o axios instalado

export default {
  name: 'Adm',
  data() {
    return {
      loading: false,
      form: {
        nome: '',
        descricao: '',
        pontosNecessarios: null,
        estoque: null,
        empresaParceira: ''
      }
    }
  },
  methods: {
   async cadastrarRecompensa() {
  this.loading = true;
 try {
  const response = await axios.post('http://localhost:3000/NovaRecompensa', this.form);
  alert("Sucesso: " + response.data.message);
} catch (error) {
  // Se cair aqui, olhe o log do VS Code (terminal do backend)
  console.error("Erro na requisição:", error.response?.data || error.message);
  alert("Erro ao conectar. Verifique se o backend está rodando na porta 3000.");
} finally {
    this.loading = false;
  }
}
  }
}
</script>

<style scoped>
.hero-adm {
  min-height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.form-container {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  border: 1px solid #333;
}
h2 { margin-bottom: 20px; text-transform: uppercase; font-weight: 800; }
form { display: flex; flex-direction: column; gap: 15px; }
input, textarea {
  background: #0a0a0a;
  border: 1px solid #222;
  padding: 12px;
  color: white;
  outline: none;
}
input:focus, textarea:focus { border-color: #fff; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
button {
  background: #fff;
  color: #000;
  border: none;
  padding: 15px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.3s;
}
button:hover { background: #ccc; }
button:disabled { background: #444; cursor: not-allowed; }
</style>