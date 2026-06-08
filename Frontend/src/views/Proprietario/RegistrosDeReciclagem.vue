<template>
  <div class="main-wrapper">
    <div class="operation-container">


      <div class="header-box">
        <span class="eyebrow">Terminal do Proprietário</span>
        <h2 class="title-medium">Lançar <span class="text-highlight">Reciclagem.</span></h2>
      </div>


      <div class="brutalist-card">
        <form @submit.prevent="confirmarRegistro" class="reciclagem-form">


          <div class="input-group full-width-group" style="margin-bottom: 35px;">
            <label>PONTO DE COLETA OPERANTE</label>
            <select v-model="form.pontoColetaId" required>
              <option value="" disabled selected> Selecione o ponto de coleta </option>
              <option v-for="ponto in meusPontos" :key="ponto.id" :value="ponto.id">
                {{ ponto.nome || ponto.endereco || 'Ponto sem Nome' }}
              </option>
            </select>
            <div class="input-line"></div>
            <span v-if="carregandoPontos" class="status-tip loading">Buscando pontos no banco...</span>
          </div>


          <div class="input-group" style="margin-bottom: 30px;">
            <label>ID ÚNICO DO USUÁRIO (CLIENTE)</label>
            <div style="display: flex; gap: 10px;">
              <input
                type="text"
                v-model="form.usuarioId"
                @input="manipularDigitacaoId"
                placeholder="Insira o ID para validação..."
                required
              />
              <button type="button" @click="iniciarScanner" class="btn-scanner">
                <i class="bi bi-qr-code-scan"></i>
              </button>
            </div>
            <div class="input-line"></div>


            <div v-if="mostrarScanner" class="scanner-wrapper">
              <div id="reader"></div>
              <button type="button" @click="pararScanner" class="btn-cancel-scanner">
                Fechar Câmera
              </button>
            </div>


            <span v-if="buscandoUsuario" class="status-tip loading">
              <i class="bi bi-arrow-repeat spin"></i> Buscando na base de dados...
            </span>
          </div>


          <div class="input-grid">
            <div class="input-group disabled-group">
              <label>NOME COMPLETO RETORNADO</label>
              <input type="text" :value="nomeUsuarioCarregado" placeholder="Nome preenchido automaticamente" disabled
                class="disabled-input" />
              <div class="input-line"></div>
              <span v-if="usuarioValidado" class="status-tip success">
                <i class="bi bi-shield-check"></i> Usuário validado com sucesso.
              </span>
              <span v-if="erroUsuario" class="status-tip error">
                <i class="bi bi-x-circle"></i> ID inválido ou não encontrado.
              </span>
            </div>


            <div class="input-group">
              <label>MATERIAL ENTREGUE</label>
              <select v-model="form.materialId" @change="calcularRecompensas" required>
                <option value="" disabled selected> Selecione o material</option>
                <option v-for="mat in listaMateriais" :key="mat.id" :value="mat.id">
                  {{ mat.nome ? mat.nome.toUpperCase() : 'MATERIAL SEM NOME' }}
                </option>
              </select>
              <div class="input-line"></div>
              <span v-if="carregandoMateriais" class="status-tip loading">Carregando materiais...</span>
            </div>
          </div>


          <div class="input-group style-separation">
            <label>QUANTIDADE RECOLHIDA (KG)</label>
            <input
              type="number"
              step="0.001"
              v-model.number="form.pesoKg"
              @input="calcularRecompensas"
              placeholder="0,000"
              min="0.001"
              required
            />
            <div class="input-line"></div>
          </div>


          <div class="recompensa-preview-box">
            <span class="preview-title">Cálculo de Pontuação do Sistema</span>
            <div class="preview-metrics">
              <div class="metric-card highlight-coins" style="grid-column: span 2; background: #000000;">
                <span class="metric-label" style="color: #aaaaaa;">TOTAL DE ECO PONTOS GERADOS</span>
                <span class="metric-value" style="color: #ffffff;">{{ totalPoints }} <span
                    class="coin-suffix">pts</span></span>
              </div>
            </div>
          </div>


          <div class="form-actions">
            <button type="submit" class="action-button"
              :disabled="!usuarioValidado || form.pesoKg <= 0 || !form.materialId || !form.pontoColetaId || registrando">
              {{ registrando ? 'PROCESSANDO LANÇAMENTO...' : 'CONFIRMAR E GERAR CRÉDITOS' }}
            </button>
          </div>


        </form>
      </div>


    </div>
  </div>
</template>


<script>
import api from '../../../../backend/src/services/api'
import { Html5QrcodeScanner } from "html5-qrcode";


export default {
  data() {
    return {
      form: {
        pontoColetaId: '',
        materialId: '',
        usuarioId: '',
        pesoKg: null
      },
      nomeUsuarioCarregado: '',
      buscandoUsuario: false,
      usuarioValidado: false,
      erroUsuario: false,
      registrando: false,
      carregandoMateriais: false,
      carregandoPontos: false,
      timerDebounce: null,


      listaMateriais: [],
      meusPontos: [],
      totalPoints: 0,


      // Dados do scanner
      mostrarScanner: false,
      scanner: null
    }
  },
  mounted() {
    this.carregarDadosIniciais();
  },
  beforeUnmount() {
    this.pararScanner();
  },
  methods: {
    iniciarScanner() {
      this.mostrarScanner = true;
      this.$nextTick(() => {
        this.scanner = new Html5QrcodeScanner("reader", {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        });
        this.scanner.render(this.onScanSuccess, this.onScanError);
      });
    },


    onScanSuccess(decodedText) {
      // 1. Feedback de Sucesso (Vibração e Som)
      if (navigator.vibrate) navigator.vibrate(200);
      const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
      audio.play().catch(e => console.log("Audio play bloqueado pelo navegador"));


      // 2. Processamento
      this.form.usuarioId = decodedText;
      this.pararScanner();
     
      // 3. Validar usuário automaticamente
      this.usuarioValidado = false;
      this.erroUsuario = false;
      this.nomeUsuarioCarregado = '';
      this.buscarUsuarioPorId();
    },


    onScanError(error) {
      // Ignorar erros de leitura contínua (ocorrem naturalmente quando não há QR code)
      // console.warn('Erro do scanner:', error);
    },


    pararScanner() {
      if (this.scanner) {
        this.scanner.clear()
          .then(() => {
            this.mostrarScanner = false;
            this.scanner = null;
          })
          .catch(error => {
            console.error("Erro ao fechar scanner:", error);
            this.mostrarScanner = false;
            this.scanner = null;
          });
      } else {
        this.mostrarScanner = false;
      }
    },


    manipularDigitacaoId() {
      this.usuarioValidado = false;
      this.erroUsuario = false;
      this.nomeUsuarioCarregado = '';


      clearTimeout(this.timerDebounce);
      if (!this.form.usuarioId.trim()) return;


      this.timerDebounce = setTimeout(() => {
        this.buscarUsuarioPorId();
      }, 700);
    },


    async buscarUsuarioPorId() {
  const idFormatado = this.form.usuarioId.trim();
  if (!idFormatado) return;


  this.buscandoUsuario = true;
  this.erroUsuario = false;
  this.usuarioValidado = false; // Reset de estado


  try {
    // IMPORTANTE: Tente o formato REST (mais comum)
    // Se no seu backend a rota for app.get('/Usuario/:id', ...)
    const response = await api.get(`/Usuario/${idFormatado}`);
   
    console.log("Resposta do servidor (Backend):", response.data);


    const user = response.data.usuario || response.data;
   
    // Verifique se o ID retornado é realmente o mesmo que você buscou
    if (user && user.id == idFormatado) {
      this.nomeUsuarioCarregado = user.nome || user.name;
      this.usuarioValidado = true;
    } else {
      this.marcarUsuarioInvalido();
    }
  } catch (error) {
    console.error("Erro na busca:", error);
    this.marcarUsuarioInvalido();
  } finally {
    this.buscandoUsuario = false;
  }
},


    marcarUsuarioInvalido() {
      this.nomeUsuarioCarregado = '';
      this.usuarioValidado = false;
      this.erroUsuario = true;
    },


    async carregarDadosIniciais() {
      this.carregandoMateriais = true;
      this.carregandoPontos = true;
      try {
        const resMateriais = await api.get('/Materiais');
        const dadosMat = resMateriais.data?.materiais || resMateriais.data?.registros || resMateriais.data;
        this.listaMateriais = Array.isArray(dadosMat) ? dadosMat : [];


        const resPontos = await api.get('/PontosDeColeta');
        const dadosPontos = resPontos.data?.pontos || resPontos.data;
        this.meusPontos = Array.isArray(dadosPontos) ? dadosPontos : [];


        if (this.meusPontos.length > 0) {
          this.form.pontoColetaId = this.meusPontos[0].id;
        }
      } catch (error) {
        console.error("Erro no carregamento inicial:", error);
      } finally {
        this.carregandoMateriais = false;
        this.carregandoPontos = false;
      }
    },


    calcularRecompensas() {
      if (!this.form.materialId || !this.form.pesoKg || this.form.pesoKg <= 0) {
        this.totalPoints = 0;
        return;
      }


      const materialBanco = this.listaMateriais.find(m => m.id === this.form.materialId);
      if (materialBanco) {
        const valorDoMaterial = materialBanco.pontosPorKg ?? materialBanco.valor ?? materialBanco.preco ?? 10;
        this.totalPoints = Math.round(this.form.pesoKg * valorDoMaterial);
      }
    },


    async confirmarRegistro() {
      if (!this.usuarioValidado) {
        alert("Por favor, valide o ID do usuário antes de confirmar.");
        return;
      }


      const materialBanco = this.listaMateriais.find(m => m.id === this.form.materialId);
      const nomeMat = materialBanco?.nome || 'Material';


      const confirmacao = confirm(
        `Deseja confirmar o lançamento?\n\n` +
        `Usuário: ${this.nomeUsuarioCarregado}\n` +
        `Material: ${nomeMat.toUpperCase()}\n` +
        `Peso: ${this.form.pesoKg} KG\n` +
        `Pontos Gerados: ${this.totalPoints} pts`
      );


      if (!confirmacao) return;


      this.registrando = true;
      try {
        await api.post('/NovoRegistro', {
          usuarioId: this.form.usuarioId,
          materialId: this.form.materialId,
          pontoColetaId: this.form.pontoColetaId,
          pesoKg: this.form.pesoKg
        });


        alert('Registro efetuado com sucesso no EcoWave!');
        this.limparFormulario();
      } catch (error) {
        console.error("Erro ao salvar pesagem:", error);
        alert('Não foi possível salvar o registro. Verifique os dados fornecidos.');
      } finally {
        this.registrando = false;
      }
    },


    limparFormulario() {
      this.form.usuarioId = '';
      this.form.materialId = '';
      this.form.pesoKg = null;
      this.nomeUsuarioCarregado = '';
      this.usuarioValidado = false;
      this.erroUsuario = false;
      this.totalPoints = 0;
    }
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

.main-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 2rem 60px;
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
  color: #000000;
}

.operation-container {
  width: 100%;
  max-width: 800px;
}

.header-box {
  text-align: center;
  margin-bottom: 45px;
}

.eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #000000;
  text-transform: uppercase;
  display: block;
  margin-bottom: 12px;
}

.title-medium {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-size: clamp(2.5rem, 5vw, 4.2rem);
  line-height: 0.88;
  letter-spacing: -0.01em;
  color: #000000;
  margin: 0;
  text-transform: uppercase;
}

.text-highlight {
  color: #000000;
  border-bottom: 5px solid #000000;
  display: inline-block;
}

.brutalist-card {
  background: #ffffff;
  padding: 45px;
  border: 1px solid #000000;
  border-radius: 2px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.03);
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.style-separation {
  margin-top: 35px;
}

@media (max-width: 680px) {
  .input-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .style-separation {
    margin-top: 25px;
  }
}

.input-group {
  position: relative;
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.input-group input,
.input-group select {
  width: 100%;
  border: 1px solid #cccccc;
  padding: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  outline: none;
  background: transparent;
  color: #000000;
  border-radius: 0;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #000000;
}

.disabled-group label {
  color: #777777;
}

.disabled-input {
  background: #f9f9f9 !important;
  border-color: #e5e5ea !important;
  color: #555555 !important;
  cursor: not-allowed;
}

.status-tip {
  font-size: 0.78rem;
  font-weight: 600;
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-tip.loading {
  color: #555555;
}

.status-tip.success {
  color: #10b981;
}

.status-tip.error {
  color: #ff3b30;
}

/* Estilos do Scanner QR Code */
.btn-scanner {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 12px 16px;
  border-radius: 0;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.btn-scanner:hover {
  background: #1c1c1e;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.btn-scanner:active {
  transform: translateY(0);
}

.scanner-wrapper {
  margin-top: 20px;
  padding: 20px;
  border: 2px solid #000000;
  border-radius: 4px;
  background: #ffffff;
}

#reader {
  width: 100% !important;
  border-radius: 4px;
  overflow: hidden;
}

#reader video {
  border-radius: 4px;
  object-fit: cover;
}

.btn-cancel-scanner {
  margin-top: 15px;
  width: 100%;
  background: transparent;
  color: #000000;
  border: 1px solid #000000;
  padding: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel-scanner:hover {
  background: #f5f5f5;
}

.recompensa-preview-box {
  margin-top: 40px;
  padding: 30px;
  background: #fffcf0;
  border: 1px dashed #000000;
}

.preview-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 20px;
  color: #555555;
  text-align: center;
}

.preview-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: #ffffff;
  border: 1px solid #000000;
}

.metric-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #777777;
  margin-bottom: 5px;
}

.metric-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.2rem;
  color: #000000;
  line-height: 1;
}

.coin-suffix {
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

.form-actions {
  margin-top: 35px;
}

.action-button {
  width: 100%;
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 16px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.action-button:hover:not(:disabled) {
  background: #1c1c1e;
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.action-button:disabled {
  background: #f2f2f2;
  border-color: #e5e5ea;
  color: #aaaaaa;
  cursor: not-allowed;
}

.spin {
  animation: rotation 1s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .btn-scanner {
    padding: 12px;
    min-width: 45px;
  }
  
  .scanner-wrapper {
    padding: 15px;
  }
}
</style>