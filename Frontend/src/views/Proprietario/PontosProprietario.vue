<template>

    <div class="main-wrapper">

        <router-link to="/proprietario" class="btn-cta">Voltar ao Painel</router-link>



        <transition name="fade">

            <div v-if="notificacao.exibir" :class="['toast-message', notificacao.tipo]">

                {{ notificacao.mensagem }}

            </div>

        </transition>



        <section class="admin-section">

            <div class="header-box flex-header">

                <div>

                    <span class="eyebrow">Terminal de Logística</span>

                    <h2 class="title-medium">Gestão de <span class="text-highlight">Pontos de Coleta.</span></h2>

                </div>

                <button @click="abrirModalCriar" class="action-button btn-add">

                    <i class="bi bi-plus-lg"></i> NOVO PONTO

                </button>

            </div>



            <div class="table-container">

                <table class="minimal-table">

                    <thead>

                        <tr>

                            <th>NOME DO PONTO</th>

                            <th>ENDEREÇO / CEP</th>

                            <th>HORÁRIO / STATUS</th>

                            <th class="text-right">AÇÕES</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr v-for="ponto in pontosDeColeta" :key="ponto.id">

                            <td class="product-cell">

                                <div class="product-info-mini">

                                    <div class="mini-thumb"><i class="bi bi-geo-alt"></i></div>

                                    <span>{{ ponto.nome }}</span>

                                </div>

                            </td>

                            <td>

                                <div class="address-text">{{ ponto.endereco }}</div>

                                <small class="eyebrow" style="font-size: 9px">{{ ponto.CEP || ponto.cep }}</small>



                                <div class="material-tags-list" style="margin-top: 5px;">

                                    <span v-for="mat in (ponto.materiais || [])" :key="mat.material?.id"

                                        class="badge-mini">

                                        {{ mat.material?.nome }}

                                    </span>

                                </div>

                            </td>

                            <td>

                                <div style="font-size: 11px; font-weight: 600; margin-bottom: 4px;">

                                    {{ ponto.horarioAbertura }} - {{ ponto.horarioFechamento }}

                                </div>

                                <span

                                    :class="['status-pill', obterStatus(ponto).aberto ? 'in-stock' : 'status-fechado']">

                                    {{ obterStatus(ponto).texto }}

                                </span>

                            </td>

                            <td class="text-right">

                                <button @click="selecionarPonto(ponto)" class="icon-btn"><i

                                        class="bi bi-pen"></i></button>

                                <button @click="deletarPonto(ponto.id)" class="icon-btn delete"><i

                                        class="bi bi-trash"></i></button>

                            </td>

                        </tr>

                        <tr v-if="pontosDeColeta.length === 0">

                            <td colspan="4" style="text-align: center; padding: 40px; color: #999;">

                                Nenhum ponto de coleta cadastrado por você.

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </section>



        <transition name="modal-fade">

            <div v-if="exibirModal" class="modal-overlay" @click.self="fecharModal">

                <div class="modal-content admin-modal">

                    <span class="eyebrow">{{ modoEdicao ? 'Atualizar Local' : 'Novo Registro' }}</span>

                    <h3 class="title-small">{{ modoEdicao ? 'Editar' : 'Criar' }} <span

                            class="text-highlight">Ponto</span></h3>



                    <form @submit.prevent="salvarPonto" class="edit-form">

                        <div class="input-group">

                            <label>NOME DO PONTO</label>

                            <input type="text" v-model="form.nome" required placeholder="Ex: Ecoponto Central" />

                            <div class="input-line"></div>

                        </div>



                        <div class="input-row">

                            <div class="input-group">

                                <label>CEP</label>

                                <div style="display: flex; gap: 10px;">

                                    <input type="text" v-model="form.CEP" @keyup.enter="buscarLocalizacao" required

                                        placeholder="00000-000" />

                                    <button type="button" @click="buscarLocalizacao"

                                        class="mini-search-btn">BUSCAR</button>

                                </div>

                                <div class="input-line"></div>

                            </div>

                            <div class="input-group">

                                <label>RUA (AUTO)</label>

                                <input type="text" v-model="form.logradouro" readonly class="input-readonly"

                                    placeholder="Aguardando CEP..." />

                            </div>

                        </div>



                        <div class="input-row">

                            <div class="input-group" style="flex: 2;">

                                <label>BAIRRO (AUTO)</label>

                                <input type="text" v-model="form.bairro" readonly class="input-readonly" />

                            </div>

                            <div class="input-group" style="flex: 2;">

                                <label>CIDADE / UF (AUTO)</label>

                                <input type="text" v-model="form.cidadeEstado" readonly class="input-readonly" />

                            </div>

                        </div>



                        <div class="input-row">

                            <div class="input-group" style="flex: 1;">

                                <label>NÚMERO</label>

                                <input type="text" v-model="form.numero" required placeholder="Ex: 123" />

                                <div class="input-line"></div>

                            </div>

                            <div class="input-group" style="flex: 2;">

                                <label>COMPLEMENTO (OPCIONAL)</label>

                                <input type="text" v-model="form.complemento" placeholder="Ex: Sala 402, Bloco B" />

                                <div class="input-line"></div>

                            </div>

                        </div>



                        <div class="input-row">

                            <div class="input-group">

                                <label>HORÁRIO DE ABERTURA</label>

                                <input type="time" v-model="form.horarioAbertura" required />

                                <div class="input-line"></div>

                            </div>

                            <div class="input-group">

                                <label>HORÁRIO DE FECHAMENTO</label>

                                <input type="time" v-model="form.horarioFechamento" required />

                                <div class="input-line"></div>

                            </div>

                        </div>



                        <div class="materiais-section">

                            <label class="section-label">MATERIAIS ACEITOS NO LOCAL</label>

                            <div v-if="loadingMateriais" class="loading-materials">Carregando lista de materiais...

                            </div>

                            <div v-else class="materials-grid">

                                <div v-for="material in materiaisDisponiveis" :key="material.id"

                                    class="material-checkbox-card"

                                    :class="{ 'is-active': form.materiaisIds.includes(String(material.id)) }"

                                    @click="alternarMaterial(String(material.id))">

                                    <input type="checkbox" :value="String(material.id)"

                                        :checked="form.materiaisIds.includes(String(material.id))" @click.stop />

                                    <span class="material-name">{{ material.nome }}</span>

                                </div>

                            </div>

                        </div>



                        <div id="map-admin" class="map-frame"></div>



                        <div class="modal-actions">

                            <button type="submit" class="action-button" :disabled="!form.lat">

                                {{ modoEdicao ? 'SALVAR ALTERAÇÕES' : 'CONFIRMAR REGISTRO' }}

                            </button>

                            <button type="button" @click="fecharModal" class="ghost-button-dark">DESCARTAR</button>

                        </div>

                    </form>

                </div>

            </div>

        </transition>

    </div>

</template>



<script>

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import axios from 'axios';

import api from '../../../../backend/src/services/api';



export default {

    data() {

        return {

            pontosDeColeta: [],

            materiaisDisponiveis: [],

            loadingMateriais: false,

            exibirModal: false,

            modoEdicao: false,

            map: null,

            marker: null,

            agora: new Date(),

            timerInterval: null,

            notificacao: { exibir: false, mensagem: '', tipo: 'success' },

            form: {

                id: null,

                nome: '',

                CEP: '',

                logradouro: '',

                bairro: '',

                cidadeEstado: '',

                numero: '',

                complemento: '',

                lat: null,

                lng: null,

                horarioAbertura: '08:00',

                horarioFechamento: '18:00',

                materiaisIds: []

            }

        };

    },

    mounted() {

        this.buscarPontos();

        this.buscarMateriais();

        this.timerInterval = setInterval(() => { this.agora = new Date(); }, 1000);

    },

    beforeUnmount() {

        if (this.timerInterval) clearInterval(this.timerInterval);

    },

    methods: {

        // Método adicionado para compatibilidade com o template

        obterStatus(ponto) {

            const agora = new Date();

            const horaAtual = agora.getHours();

            const minAtual = agora.getMinutes();



            const [horaA, minA] = (ponto.horarioAbertura || "00:00").split(':').map(Number);

            const [horaF, minF] = (ponto.horarioFechamento || "23:59").split(':').map(Number);



            const aberto = (horaAtual > horaA || (horaAtual === horaA && minAtual >= minA)) &&

                (horaAtual < horaF || (horaAtual === horaF && minAtual <= minF));



            return { aberto, texto: aberto ? 'Aberto' : 'Fechado' };

        },



        async buscarPontos() {

            try {

                const res = await api.get(`/PontosDeColeta?_t=${new Date().getTime()}`);

                const dados = res.data.pontos || res.data.Pontos || (Array.isArray(res.data) ? res.data : []);

                this.pontosDeColeta = JSON.parse(JSON.stringify(dados));

            } catch (e) {

                console.error("Erro na busca de pontos:", e);

                this.pontosDeColeta = [];

            }

        },



        async buscarMateriais() {

            this.loadingMateriais = true;

            try {

                const res = await api.get('/Materiais');

                this.materiaisDisponiveis = Array.isArray(res.data) ? res.data : (res.data.materiais || []);

            } catch (e) {

                console.error("Erro ao carregar materiais:", e);

            } finally {

                this.loadingMateriais = false;

            }

        },



        alternarMaterial(id) {

            const index = this.form.materiaisIds.indexOf(id);

            if (index > -1) {

                this.form.materiaisIds.splice(index, 1);

            } else {

                this.form.materiaisIds.push(id);

            }

        },



        mostrarMensagem(txt, tipo = 'success') {

            this.notificacao = { exibir: true, mensagem: txt, tipo };

            setTimeout(() => { this.notificacao.exibir = false; }, 3000);

        },



        initMap() {

            setTimeout(() => {

                if (this.map) this.map.remove();

                const initialLat = this.form.lat || -19.892;

                const initialLng = this.form.lng || -43.812;

                this.map = L.map('map-admin').setView([initialLat, initialLng], 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

                if (this.form.lat && this.form.lng) {

                    this.marker = L.marker([this.form.lat, this.form.lng]).addTo(this.map);

                }

                this.map.on('click', (e) => {

                    this.form.lat = e.latlng.lat;

                    this.form.lng = e.latlng.lng;

                    if (this.marker) this.map.removeLayer(this.marker);

                    this.marker = L.marker([this.form.lat, this.form.lng]).addTo(this.map);

                });

            }, 300);

        },



        async buscarLocalizacao() {

            const cepLimpo = this.form.CEP.replace(/\D/g, '');

            if (cepLimpo.length !== 8) return this.mostrarMensagem("Digite 8 números", "error");

            try {

                const res = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

                if (res.data.erro) return this.mostrarMensagem("CEP não encontrado", "error");

                this.form.logradouro = res.data.logradouro;

                this.form.bairro = res.data.bairro;

                this.form.cidadeEstado = `${res.data.localidade} - ${res.data.uf}`;

                const mapRes = await axios.get(`https://nominatim.openstreetmap.org/search?q=${res.data.logradouro},${res.data.localidade}&format=json&limit=1`);

                if (mapRes.data.length > 0) {

                    this.form.lat = parseFloat(mapRes.data[0].lat);

                    this.form.lng = parseFloat(mapRes.data[0].lon);

                    this.initMap();

                }

            } catch (e) {

                this.mostrarMensagem("Erro ao buscar dados do CEP", "error");

            }

        },



        abrirModalCriar() {

            this.modoEdicao = false;

            this.form = { id: null, nome: '', CEP: '', logradouro: '', bairro: '', cidadeEstado: '', numero: '', complemento: '', lat: null, lng: null, horarioAbertura: '08:00', horarioFechamento: '18:00', materiaisIds: [] };

            this.exibirModal = true;

            this.initMap();

        },



        selecionarPonto(ponto) {

            this.modoEdicao = true;

            let logradouro = ponto.endereco || '';

            let numero = '', bairro = '', cidadeEstado = '', complemento = '';

            if (logradouro.includes(',')) {

                const partes = logradouro.split(',').map(p => p.trim());

                logradouro = partes[0] || '';

                numero = partes[1] || '';

                bairro = partes[2] || '';

                cidadeEstado = partes[3] || '';

            }

            let materiaisPreMarcados = [];

            if (ponto.materiais && Array.isArray(ponto.materiais)) {

                materiaisPreMarcados = ponto.materiais.map(m => String(m.materialId || m.material?.id)).filter(Boolean);

            }

            this.form = {

                id: ponto.id,

                nome: ponto.nome,

                CEP: ponto.CEP || ponto.cep,

                logradouro, bairro, cidadeEstado, numero, complemento,

                lat: ponto.lat, lng: ponto.lng,

                horarioAbertura: ponto.horarioAbertura || '08:00',

                horarioFechamento: ponto.horarioFechamento || '18:00',

                materiaisIds: materiaisPreMarcados

            };

            this.exibirModal = true;

            this.initMap();

        },



        fecharModal() {

            this.exibirModal = false;

        },



        async salvarPonto() {

            try {

                if (!this.form.nome || !this.form.logradouro || !this.form.numero || !this.form.CEP) {

                    this.mostrarMensagem("Preencha todos os campos obrigatórios.", "error");

                    return;

                }



                let enderecoCompleto = `${this.form.logradouro}, ${this.form.numero}`;

                if (this.form.bairro) enderecoCompleto += `, ${this.form.bairro}`;

                if (this.form.cidadeEstado) enderecoCompleto += `, ${this.form.cidadeEstado}`;

                if (this.form.complemento) enderecoCompleto += ` - ${this.form.complemento}`;



                const dadosPayload = {

                    nome: this.form.nome,

                    endereco: enderecoCompleto,

                    CEP: this.form.CEP,

                    horarioAbertura: this.form.horarioAbertura,

                    horarioFechamento: this.form.horarioFechamento,

                    materiaisIds: this.form.materiaisIds

                };



                if (this.modoEdicao) {

                    await api.put(`/EditarPontoDeColeta/${this.form.id}`, dadosPayload);



                    // --- ATUALIZAÇÃO REATIVA COM NOMES ---

                    const index = this.pontosDeColeta.findIndex(p => p.id === this.form.id);

                    if (index !== -1) {

                        // Filtra os nomes dos materiais para atualizar a visualização sem precisar de refresh

                        const materiaisAtualizados = this.materiaisDisponiveis.filter(m =>

                            this.form.materiaisIds.includes(String(m.id))

                        ).map(m => ({ material: { nome: m.nome, id: m.id } }));



                        this.pontosDeColeta.splice(index, 1, {

                            ...this.pontosDeColeta[index],

                            ...dadosPayload,

                            materiais: materiaisAtualizados // Atualiza a lista de objetos para o Vue renderizar

                        });

                    }

                    this.mostrarMensagem("Ponto atualizado com sucesso!");

                } else {

                    await api.post('/NovoPontoDeColeta', {

                        ...dadosPayload,

                        lat: Number(this.form.lat),

                        lng: Number(this.form.lng)

                    });

                    this.mostrarMensagem("Ponto cadastrado com sucesso!");

                    await this.buscarPontos(); // Busca a lista nova completa

                }

                this.fecharModal();

            } catch (e) {

                const msg = e.response?.data?.error || e.response?.data?.message || "Erro ao salvar";

                this.mostrarMensagem(msg, "error");

            }

        },



        async deletarPonto(id) {

            if (confirm("Deseja realmente excluir este ponto?")) {

                try {

                    await api.delete(`/ExcluirPontoDeColeta/${id}`);

                    this.mostrarMensagem("Ponto deletado!");

                    await this.buscarPontos();

                } catch (e) {

                    this.mostrarMensagem("Erro ao excluir.", "error");

                }

            }

        }

    }

};

</script> 




<style scoped>
.main-wrapper {
    background: #fdfdfd;
    min-height: 100vh;
    padding: 80px 40px;
    font-family: 'Inter', sans-serif;
    color: #000;
    position: relative;
}

.admin-section {
    max-width: 1100px;
    margin: 0 auto;
}

.flex-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 50px;
}

.btn-add {
    width: auto !important;
    padding: 12px 25px !important;
    margin: 0 !important;
}

.table-container {
    background: white;
    border: 1px solid #eee;
}

.minimal-table {
    width: 100%;
    border-collapse: collapse;
}

.minimal-table th {
    padding: 20px;
    font-size: 10px;
    letter-spacing: 1.5px;
    color: #999;
    text-align: left;
    border-bottom: 1px solid #eee;
    text-transform: uppercase;
}

.minimal-table td {
    padding: 15px 20px;
    border-bottom: 1px solid #f9f9f9;
    font-size: 14px;
}

.toast-message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 30px;
    border-radius: 4px;
    color: white;
    z-index: 2000;
    font-weight: 600;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.success {
    background: #000;
}

.error {
    background: #c53030;
}

.product-info-mini {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mini-thumb {
    width: 40px;
    height: 40px;
    background: #f5f5f5;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.address-text {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
}

.status-pill {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
}

.in-stock {
    background: #e6fffa;
    color: #234e52;
}

.status-fechado {
    background: #fff5f5;
    color: #c53030;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.admin-modal {
    width: 100%;
    max-width: 650px;
    padding: 40px;
    background: white;
    border: 1px solid #eee;
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.1);
    max-height: 90vh;
    overflow-y: auto;
}

.map-frame {
    height: 250px;
    width: 100%;
    margin: 20px 0;
    border: 1px solid #eee;
    border-radius: 4px;
}

.input-row {
    display: flex;
    gap: 20px;
}

.input-group {
    margin-bottom: 20px;
    flex: 1;
}

.input-group label {
    font-size: 9px;
    font-weight: 800;
    color: #999;
    letter-spacing: 1.5px;
}

.input-group input {
    width: 100%;
    border: none;
    padding: 10px 0;
    outline: none;
    border-bottom: 1px solid #eee;
}

.input-group input:focus {
    border-bottom: 2px solid #000;
}

.input-readonly {
    color: #888 !important;
    border-bottom-style: dashed !important;
}

.materiais-section {
    margin: 15px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #34d399;
    /* Cor verde destaque */
}

.loading-materials {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
}

.materials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
}

.material-checkbox-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    user-select: none;
}

.material-checkbox-card:hover {
    background: rgba(52, 211, 153, 0.05);
    border-color: rgba(52, 211, 153, 0.2);
}

.material-checkbox-card.is-active {
    background: rgba(16, 185, 129, 0.12);
    border-color: #10b981;
}

.material-checkbox-card input[type="checkbox"] {
    accent-color: #10b981;
    cursor: pointer;
    width: 15px;
    height: 15px;
}

.material-name {
    font-size: 12px;
    font-weight: 500;
    color: #e2e8f0;
}

.mini-search-btn {
    background: #f5f5f5;
    border: 1px solid #eee;
    padding: 5px 10px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
}
.badge-mini {
    display: inline-block;
    background: #e0e0e0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 9px;
    margin-right: 4px;
    font-weight: 600;
}
.action-button {
    background: #000;
    color: #fff;
    padding: 15px;
    width: 100%;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
}

.action-button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.ghost-button-dark {
    width: 100%;
    background: transparent;
    border: 1px solid #eee;
    padding: 12px;
    margin-top: 10px;
    cursor: pointer;
    font-weight: 600;
}

.eyebrow {
    color: #888;
    font-size: 11px;
    letter-spacing: 2px;
    font-weight: 600;
    text-transform: uppercase;
}

.title-medium {
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: -1.5px;
}

.text-highlight {
    color: #bbb;
}

.btn-cta {
    position: absolute;
    top: 40px;
    left: 40px;
    text-decoration: none;
    color: black;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-bottom: 2px solid #000;
}

.icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 10px;
    font-size: 16px;
}

.icon-btn.delete:hover {
    color: #ff4d4d;
}
</style>