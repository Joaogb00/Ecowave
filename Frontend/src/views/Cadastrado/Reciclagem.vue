<template>
  <section class="section-loja">
    <router-link to="/cadastrado" class="btn-cta">Voltar ao Painel</router-link>
    <div class="overlay-texture"></div>

    <div class="loja-header">
      <div>
        <span class="eyebrow">EcoWave Protocol</span>
        <h1 class="main-title">Reciclagem</h1>
      </div>
    </div>

    <div v-show="etapa === 'inicio' || etapa === 'manual_form'" class="main-locator">
      <div class="header-box" style="margin-bottom: 30px;">
        <span class="eyebrow">EcoWave Locator</span>
        <h2 class="title-medium">
          Selecione o <span class="text-highlight">Material</span> e encontre um
          <span class="text-highlight">Ponto de Coleta.</span>
        </h2>
      </div>

      <div class="map-layout">
        <div class="form-column">
          <div class="form-group">
            <label>Material</label>
            <select v-model="formManual.materialId" class="custom-input" @change="onMaterialChange">
              <option value="" disabled>Selecione um material</option>
              <option v-for="m in materiaisBanco" :key="m.id" :value="m.id">{{ m.nome }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>CEP para busca (opcional)</label>
            <div class="cep-row">
              <input type="text" v-model="formManual.cep" class="custom-input" placeholder="00000-000" maxlength="9" @input="formatarCep">
              <button type="button" class="btn-buy" @click="buscarPontosPorCep" :disabled="buscandoPontos">
                <i :class="buscandoPontos ? 'bi bi-hourglass-split spin' : 'bi bi-search'"></i>
              </button>
            </div>
          </div>

          <div class="form-group" v-if="pontoSelecionado">
            <label>Ponto selecionado</label>
            <div class="custom-input readonly-input material-chip">
              <i class="bi bi-pin-map-fill"></i> {{ pontoSelecionado.nome }}
            </div>
            <small class="hint-text">
              <i class="bi bi-geo-alt-fill"></i> {{ pontoSelecionado.endereco }}
            </small>
          </div>

          <div v-if="pontoSelecionado" class="rota-inline">
            <p class="rota-inline-label"><i class="bi bi-compass-fill"></i> Como chegar</p>
            <div class="rota-opcoes-inline">
              <button class="btn-rota-inline btn-gmaps-inline" @click="abrirGoogleMaps(pontoSelecionado)">
                <i class="bi bi-map-fill"></i> Google Maps
              </button>
              <button class="btn-rota-inline btn-uber-inline" @click="abrirUber(pontoSelecionado)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="flex-shrink:0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                Uber
              </button>
              <button class="btn-rota-inline btn-99-inline" @click="abrir99(pontoSelecionado)">
                <span style="font-weight:900;font-size:11px">99</span>
              </button>
            </div>
          </div>

          <div class="form-actions-column">
            <button
              v-if="!pontoSelecionado"
              @click="mostrarTodosPontos"
              class="btn-secondary-border full-width btn-icon-label"
            >
              <i class="bi bi-list-ul"></i> Ver todos os pontos
            </button>
          </div>
        </div>

        <div class="map-and-list-column">
          <div class="map-container-user">
            <div id="map-reciclagem" class="map-frame-user"></div>
          </div>
          <div class="locations-sidebar">
            <div class="sidebar-header">
              <span class="eyebrow">
                {{ formManual.materialId ? 'Pontos que aceitam este material' : 'Pontos de Coleta' }}
              </span>
              <span class="sidebar-count" v-if="pontosBanco.length > 0">
                {{ pontosBanco.length }} encontrado(s)
              </span>
            </div>
            <div class="locations-list">
              <label v-for="ponto in pontosBanco" :key="ponto.id" class="location-item" :class="{ 'location-item-selected': pontoId == ponto.id }">
                <div class="location-radio">
                  <input type="radio" name="pontoColeta" :value="ponto.id" v-model="pontoId" @change="selecionarPonto(ponto)">
                </div>
                <div class="location-info">
                  <strong>{{ ponto.nome }}</strong>
                  <p class="location-address"><i class="bi bi-geo-alt-fill"></i> {{ ponto.endereco }}</p>
                  <p v-if="ponto.materiais || ponto.materiaisAceitos" class="location-materiais">
                    <i class="bi bi-recycle"></i> {{ formatarMateriaisExibicao(ponto.materiais || ponto.materiaisAceitos) }}
                  </p>
                  <div class="location-meta">
                    <span v-if="ponto._distancia" class="distancia-tag">
                      <i class="bi bi-geo"></i> {{ ponto._distancia }}
                    </span>
                    <span :class="['status-tag', obterStatusPonto(ponto).aberto ? 'tag-aberto' : 'tag-fechado']">
                      <i :class="obterStatusPonto(ponto).aberto ? 'bi bi-door-open-fill' : 'bi bi-door-closed-fill'"></i>
                      {{ obterStatusPonto(ponto).texto }}
                    </span>
                  </div>
                  <div class="location-actions" @click.prevent>
                    <button class="btn-card-primary" @click.stop="irParaLocal(ponto)">
                      <i class="bi bi-signpost-fill"></i> Ir para o Local
                    </button>
                    <button class="btn-card-secondary" @click.stop="abrirModalRota(ponto)">
                      <i class="bi bi-three-dots-vertical"></i> Como ir?
                    </button>
                  </div>
                </div>
              </label>

              <div v-if="pontosBanco.length === 0" class="empty-state">
                <i class="bi bi-geo-alt" style="font-size:1.5rem;display:block;margin-bottom:8px;opacity:.3"></i>
                Selecione um material ou informe seu CEP para localizar pontos próximos.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal IA Intro -->
    <div v-if="etapa === 'ia_intro'" class="modal-overlay">
      <div class="modal-content modal-intro">
        <div class="intro-icon-wrap">
          <i class="bi bi-camera-video-fill intro-icon"></i>
        </div>
        <span class="eyebrow">Como funciona</span>
        <h2 class="product-title" style="margin-top:8px;">Scanner de Materiais</h2>
        <ul class="intro-steps">
          <li><i class="bi bi-1-circle-fill"></i> Aponte a câmera para o item que deseja reciclar</li>
          <li><i class="bi bi-2-circle-fill"></i> A IA identificará o material automaticamente</li>
          <li><i class="bi bi-3-circle-fill"></i> Confirme o material reconhecido</li>
          <li><i class="bi bi-4-circle-fill"></i> Veja os pontos de coleta recomendados</li>
        </ul>
        <p class="intro-dica">
          <i class="bi bi-lightbulb-fill"></i>
          <strong>Dica:</strong> Segure o item próximo à câmera, com boa iluminação e fundo neutro.
        </p>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <button @click="abrirScanner" class="btn-buy full-width btn-icon-label">
            <i class="bi bi-camera-fill"></i> Iniciar Scanner
          </button>
          <button @click="cancelarIA" class="btn-secondary full-width">
            <i class="bi bi-x-lg"></i> Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal IA Scanning -->
    <div v-if="etapa === 'ia_scanning'" class="modal-overlay">
      <div class="modal-content">
        <div class="video-wrapper">
          <video ref="videoRef" autoplay playsinline muted :class="{ 'frozen': isWaitingConfirmation }"></video>
          <div v-if="isLoadingIA" class="status-overlay">
            <i class="bi bi-cpu-fill" style="margin-right:6px;"></i>Carregando IA...
          </div>
          <div v-if="!isLoadingIA && !isWaitingConfirmation" class="scan-frame">
            <div class="scan-corner tl"></div>
            <div class="scan-corner tr"></div>
            <div class="scan-corner bl"></div>
            <div class="scan-corner br"></div>
            <div class="scan-line"></div>
          </div>
        </div>

        <div v-if="!isWaitingConfirmation && !isLoadingIA" class="scan-hint">
          <i class="bi bi-arrow-repeat spin"></i> Analisando material...
        </div>

        <div v-if="currentSuggestion" class="ia-feedback">
          <h2 class="product-title">{{ perguntaIA }}</h2>
          <p class="product-description" v-if="currentSuggestion.reciclavel === false">
            Este item não parece reciclável. Clique em "Não" para tentar novamente.
          </p>
          <div class="modal-actions">
            <button @click="confirmarMaterialIA" class="btn-buy btn-icon-label">
              <i class="bi bi-check-circle-fill"></i> Sim
            </button>
            <button @click="tryNextSuggestion" class="btn-secondary-border btn-icon-label">
              <i class="bi bi-x-circle"></i> Não
            </button>
          </div>
        </div>

        <button @click="pararCamera" class="btn-secondary full-width" style="margin-top:12px;">
          <i class="bi bi-x-lg"></i> Cancelar
        </button>
      </div>
    </div>

    <!-- Pontos IA -->
    <div v-if="etapa === 'ia_pontos'" class="selecionar-ponto-wrapper">
      <section class="admin-section">
        <div class="header-box">
          <span class="eyebrow">EcoWave Locator — IA</span>
          <h2 class="title-medium">
            Pontos de coleta para
            <span class="text-highlight">{{ materialFinalIA?.nome }}</span>
          </h2>
          <p class="subtitle">
            Material identificado pela IA. Selecione um ponto de coleta e escolha como deseja ir.
          </p>
        </div>

        <div class="map-layout">
          <div class="form-column">
            <div class="form-group">
              <label>Material identificado</label>
              <div class="custom-input readonly-input material-chip">
                <i class="bi bi-recycle"></i>
                {{ materialFinalIA?.nome || 'Material não identificado' }}
              </div>
              <small class="hint-text">
                Se o material estiver errado, clique em "Voltar" e escaneie novamente ou use a seleção manual.
              </small>
            </div>

            <div class="form-group">
              <label>Ponto selecionado</label>
              <div v-if="!pontoSelecionadoIA" class="empty-state-inline">
                <i class="bi bi-geo-alt"></i> Selecione um ponto na lista ao lado.
              </div>
              <div v-else class="custom-input readonly-input material-chip">
                <i class="bi bi-pin-map-fill"></i> {{ pontoSelecionadoIA.nome }}
              </div>
            </div>

            <div v-if="pontoSelecionadoIA" class="rota-inline">
              <p class="rota-inline-label"><i class="bi bi-compass-fill"></i> Como chegar</p>
              <div class="rota-opcoes-inline">
                <button class="btn-rota-inline btn-gmaps-inline" @click="abrirGoogleMaps(pontoSelecionadoIA)">
                  <i class="bi bi-map-fill"></i> Google Maps
                </button>
                <button class="btn-rota-inline btn-uber-inline" @click="abrirUber(pontoSelecionadoIA)">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                  Uber
                </button>
                <button class="btn-rota-inline btn-99-inline" @click="abrir99(pontoSelecionadoIA)">
                  <span style="font-weight:900;font-size:11px">99</span>
                </button>
              </div>
            </div>

            <div class="form-actions-column">
              <button v-if="pontoSelecionadoIA" @click="irParaLocal(pontoSelecionadoIA)" class="btn-buy full-width btn-icon-label">
                <i class="bi bi-signpost-fill"></i> Ir para o Local
              </button>
              <button @click="voltarAoInicio" class="btn-secondary full-width btn-icon-label">
                <i class="bi bi-chevron-left"></i> Voltar
              </button>
            </div>
          </div>

          <div class="map-and-list-column">
            <div class="map-container-user">
              <div id="map-ia" class="map-frame-user"></div>
            </div>

            <div class="locations-sidebar">
              <div class="sidebar-header">
                <span class="eyebrow">Pontos que aceitam este material</span>
                <span class="sidebar-count" v-if="pontosFiltradosIA.length > 0">
                  {{ pontosFiltradosIA.length }} encontrado(s)
                </span>
              </div>

              <div class="locations-list">
                <label
                  v-for="ponto in pontosFiltradosIA"
                  :key="ponto.id"
                  class="location-item"
                  :class="{ 'location-item-selected': pontoIdIA == ponto.id }"
                >
                  <div class="location-radio">
                    <input type="radio" name="pontoColetaIa" :value="ponto.id" v-model="pontoIdIA" @change="selecionarPontoIA(ponto)">
                  </div>
                  <div class="location-info">
                    <strong>{{ ponto.nome }}</strong>
                    <p class="location-address"><i class="bi bi-geo-alt-fill"></i> {{ ponto.endereco }}</p>
                    <p v-if="ponto.materiais || ponto.materiaisAceitos" class="location-materiais">
                      <i class="bi bi-recycle"></i> {{ formatarMateriaisExibicao(ponto.materiais || ponto.materiaisAceitos) }}
                    </p>
                    <div class="location-meta">
                      <span :class="['status-tag', obterStatusPonto(ponto).aberto ? 'tag-aberto' : 'tag-fechado']">
                        <i :class="obterStatusPonto(ponto).aberto ? 'bi bi-door-open-fill' : 'bi bi-door-closed-fill'"></i>
                        {{ obterStatusPonto(ponto).texto }}
                      </span>
                    </div>
                    <div class="location-actions" @click.prevent>
                      <button class="btn-card-primary" @click.stop="irParaLocal(ponto)">
                        <i class="bi bi-signpost-fill"></i> Ir para o Local
                      </button>
                      <button class="btn-card-secondary" @click.stop="abrirModalRota(ponto)">
                        <i class="bi bi-three-dots-vertical"></i> Como ir?
                      </button>
                    </div>
                  </div>
                </label>

                <div v-if="pontosFiltradosIA.length === 0" class="empty-state">
                  <i class="bi bi-geo-alt" style="font-size:1.5rem;display:block;margin-bottom:8px;opacity:.3"></i>
                  Nenhum ponto encontrado para este material. Use a seleção manual para buscar por CEP.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal Rota -->
    <div v-if="modalRota.visivel" class="modal-overlay" @click.self="modalRota.visivel = false">
      <div class="modal-content modal-rota">
        <span class="eyebrow">Escolha o transporte</span>
        <h2 class="product-title" style="margin-top:8px;">Como deseja ir?</h2>
        <p class="product-description" style="margin-bottom:20px;">
          <i class="bi bi-geo-alt-fill"></i> <strong>{{ modalRota.ponto?.nome }}</strong><br>
          <small style="color:#999;">{{ modalRota.ponto?.endereco }}</small>
        </p>

        <div class="rota-opcoes">
          <button class="btn-rota btn-gmaps" @click="abrirGoogleMaps(modalRota.ponto)">
            <span class="rota-icon">
              <i class="bi bi-map-fill" style="font-size:20px;color:#4285F4;"></i>
            </span>
            <div class="rota-label">
              <strong>Google Maps</strong>
              <small>Abrir navegação com rota</small>
            </div>
            <i class="bi bi-arrow-right" style="margin-left:auto;color:#999;"></i>
          </button>

          <button class="btn-rota btn-uber" @click="abrirUber(modalRota.ponto)">
            <span class="rota-icon rota-icon-uber">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 13.5v-7l6 3.5-6 3.5z"/></svg>
            </span>
            <div class="rota-label">
              <strong>Uber</strong>
              <small>Solicitar corrida até o local</small>
            </div>
            <i class="bi bi-arrow-right" style="margin-left:auto;color:#999;"></i>
          </button>

          <button class="btn-rota btn-99" @click="abrir99(modalRota.ponto)">
            <span class="rota-icon rota-icon-99">99</span>
            <div class="rota-label">
              <strong>99</strong>
              <small>Solicitar corrida até o local</small>
            </div>
            <i class="bi bi-arrow-right" style="margin-left:auto;color:#999;"></i>
          </button>
        </div>

        <button @click="modalRota.visivel = false" class="btn-secondary full-width" style="margin-top:14px;">
          <i class="bi bi-x-lg"></i> Cancelar
        </button>
      </div>
    </div>

    <!-- FAB IA -->
    <button class="fab-ia" @click="iniciarIA" :title="isLoadingIA ? 'Carregando IA...' : 'Identificar material com IA'">
      <i v-if="isLoadingIA" class="bi bi-hourglass-split spin fab-icon"></i>
      <i v-else class="bi bi-cpu-fill fab-icon"></i>
      <span class="fab-label">{{ isLoadingIA ? 'Carregando...' : 'Identificar com IA' }}</span>
    </button>

    <!-- Toast -->
    <div class="toast-container">
      <transition name="toast-fade">
        <div v-if="mostrarToast" class="toast-message">
          <i class="bi bi-check-circle-fill"></i> {{ toastMsg }}
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, reactive } from 'vue';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import axios from 'axios';
import { MATERIAL_MAP, MaterialMapEntry } from '../ia/materialMapping';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// ─── ÍCONE LEAFLET ────────────────────────────────────────────────────────────
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// ─── ESTADO DE ETAPAS ─────────────────────────────────────────────────────────
type Etapa = 'inicio' | 'manual_form' | 'ia_intro' | 'ia_scanning' | 'ia_pontos';
const etapa = ref<Etapa>('inicio');

// ─── DADOS DO BANCO ───────────────────────────────────────────────────────────
const materiaisBanco = ref<any[]>([]);
const pontosTodos    = ref<any[]>([]);
const pontosBanco    = ref<any[]>([]);

// ─── SELEÇÕES MANUAIS ─────────────────────────────────────────────────────────
const formManual       = ref({ cep: '', materialId: '' });
const pontoId          = ref('');
const pontoSelecionado = ref<any>(null);
const buscandoPontos   = ref(false);

// ─── IA ───────────────────────────────────────────────────────────────────────
const videoRef              = ref<HTMLVideoElement | null>(null);
const isLoadingIA           = ref(true);
const isWaitingConfirmation = ref(false);
const currentSuggestion     = ref<any>(null);
const materialIA            = ref<MaterialMapEntry | null>(null);
const perguntaIA            = ref('');
const materialFinalIA       = ref<any>(null);

const pontosFiltradosIA  = ref<any[]>([]);
const pontoIdIA          = ref('');
const pontoSelecionadoIA = ref<any>(null);

let model: any = null;
let stream: MediaStream | null = null;

// ─── MAPAS ────────────────────────────────────────────────────────────────────
const mapManual = ref<any>(null);
const mapIa     = ref<any>(null);

// ─── TEMPO / STATUS ───────────────────────────────────────────────────────────
const agora = ref(new Date());
let timerInterval: any = null;

// ─── MODAL ROTA ───────────────────────────────────────────────────────────────
const modalRota = reactive({ visivel: false, ponto: null as any });

// ─── TOAST ────────────────────────────────────────────────────────────────────
const mostrarToast = ref(false);
const toastMsg     = ref('');

const exibirToast = (msg: string) => {
  toastMsg.value = msg;
  mostrarToast.value = true;
  setTimeout(() => { mostrarToast.value = false; }, 2800);
};

// ─── TRATAMENTO ROBUSTO DE DADOS ──────────────────────────────────────────────
const extrairTextoMateriais = (campo: any): string => {
  if (!campo) return '';
  if (typeof campo === 'string') return campo;
  if (Array.isArray(campo)) {
    return campo.map(item => {
      if (!item) return '';
      if (typeof item === 'string') return item;
      if (typeof item === 'object') return item.nome ?? item.material?.nome ?? item.titulo ?? '';
      return String(item);
    }).join(' ');
  }
  if (typeof campo === 'object') return campo.nome ?? campo.titulo ?? '';
  return String(campo);
};

const formatarMateriaisExibicao = (campo: any): string => {
  if (!campo) return '';
  if (typeof campo === 'string') return campo;
  if (Array.isArray(campo)) {
    return campo.map(item => {
      if (!item) return '';
      if (typeof item === 'string') return item;
      if (typeof item === 'object') return item.nome ?? item.material?.nome ?? '';
      return String(item);
    }).filter(Boolean).join(', ');
  }
  if (typeof campo === 'object') return campo.nome ?? '';
  return String(campo);
};

const removerAcentos = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const formatarCep = () => {
  let v = formManual.value.cep.replace(/\D/g, '').slice(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  formManual.value.cep = v;
};

const obterStatusPonto = (ponto: any) => {
  if (!ponto.horarioAbertura || !ponto.horarioFechamento) {
    return { aberto: false, texto: 'Horário indisponível' };
  }
  const [hA, mA] = ponto.horarioAbertura.split(':').map(Number);
  const [hF, mF] = ponto.horarioFechamento.split(':').map(Number);
  const ab = new Date(agora.value); ab.setHours(hA, mA, 0, 0);
  const fe = new Date(agora.value); fe.setHours(hF, mF, 0, 0);
  const aberto = agora.value >= ab && agora.value <= fe;
  const alvo   = aberto ? fe : ab;
  if (!aberto && agora.value > ab) alvo.setDate(alvo.getDate() + 1);
  const diff = +alvo - +agora.value;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return {
    aberto,
    texto: aberto
      ? `Aberto — fecha em ${h}h ${m}m ${s}s`
      : `Fechado — abre em ${h}h ${m}m ${s}s`,
  };
};

// ─── ROTAS & DEEP LINKS ───────────────────────────────────────────────────────
const tentarAbrirApp = (deepLink: string, fallbackUrl: string, delay = 2000) => {
  const startTime = Date.now();
  window.location.href = deepLink;
  setTimeout(() => {
    if (Date.now() - startTime < delay + 500) window.open(fallbackUrl, '_blank');
  }, delay);
};

const abrirGoogleMaps = (ponto: any) => {
  if (!ponto) return;
  const lat = parseFloat(ponto.lat ?? ponto.latitude ?? '');
  const lng = parseFloat(ponto.lng ?? ponto.longitude ?? '');
  const dest = (!isNaN(lat) && !isNaN(lng)) ? `${lat},${lng}` : encodeURIComponent(ponto.endereco ?? '');
  window.open(`https://maps.google.com/?q=${dest}&travelmode=driving`, '_blank');
  modalRota.visivel = false;
};

const abrirUber = (ponto: any) => {
  if (!ponto) return;
  const lat  = parseFloat(ponto.lat ?? ponto.latitude ?? '');
  const lng  = parseFloat(ponto.lng ?? ponto.longitude ?? '');
  const nome = encodeURIComponent(ponto.nome ?? 'Ponto de Coleta');
  let enderecoTexto = ponto.endereco ?? ponto.logradouro ?? '';
  if (ponto.numero && !enderecoTexto.includes(ponto.numero)) enderecoTexto += `, ${ponto.numero}`;
  const end = encodeURIComponent(enderecoTexto);

  if (!isNaN(lat) && !isNaN(lng)) {
    const deepLink = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${nome}&dropoff[formatted_address]=${end}`;
    const fallback = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${nome}&dropoff[formatted_address]=${end}`;
    tentarAbrirApp(deepLink, fallback);
  } else {
    window.open(`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${end}`, '_blank');
  }
  modalRota.visivel = false;
};

const abrir99 = (ponto: any) => {
  if (!ponto) return;
  const lat  = parseFloat(ponto.lat ?? ponto.latitude ?? '');
  const lng  = parseFloat(ponto.lng ?? ponto.longitude ?? '');
  const nome = encodeURIComponent(ponto.nome ?? 'Ponto de Coleta');

  if (!isNaN(lat) && !isNaN(lng)) {
    const deepLink = `taxis99://x-callback-url/requestRide?pickup=current&dropoffLatitude=${lat}&dropoffLongitude=${lng}&dropoffName=${nome}`;
    tentarAbrirApp(deepLink, 'https://99app.com/');
  } else {
    window.open('https://99app.com/', '_blank');
  }
  modalRota.visivel = false;
};

const irParaLocal = (ponto: any) => abrirGoogleMaps(ponto);
const abrirModalRota = (ponto: any) => { modalRota.ponto = ponto; modalRota.visivel = true; };

// ─── MAPA MANUAL ──────────────────────────────────────────────────────────────
const initMapManual = () => {
  if (mapManual.value) return;
  mapManual.value = L.map('map-reciclagem', { zoomControl: false }).setView([-19.892, -43.812], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(mapManual.value);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap' }).addTo(mapManual.value);
  setTimeout(() => mapManual.value?.invalidateSize(), 80);
};

const popupHtml = (ponto: any) => {
  const s = obterStatusPonto(ponto);
  const lat = parseFloat(ponto.lat ?? ponto.latitude ?? '');
  const lng = parseFloat(ponto.lng ?? ponto.longitude ?? '');
  const dest = (!isNaN(lat) && !isNaN(lng)) ? `${lat},${lng}` : encodeURIComponent(ponto.endereco ?? '');
  return `
    <div style="font-family:Inter,sans-serif;min-width:180px">
      <span style="font-size:8px;text-transform:uppercase;letter-spacing:2px;color:#888">PONTO DE COLETA</span>
      <h4 style="margin:5px 0 2px;color:#000;font-size:13px">${ponto.nome}</h4>
      <p style="margin:0;color:#666;font-size:11px;line-height:1.4">${ponto.endereco ?? ''}</p>
      <div style="margin-top:7px;font-size:10px;font-weight:700;color:${s.aberto ? '#234e52' : '#c53030'}">${s.texto}</div>
      <hr style="border:0;border-top:1px solid #eee;margin:9px 0 7px">
      <a href="https://maps.google.com/?q=${dest}" target="_blank" style="color:#000;font-weight:700;text-decoration:none;font-size:10px;text-transform:uppercase">Como chegar →</a>
    </div>`;
};

const adicionarMarcadorManual = (ponto: any) => {
  const lat = parseFloat(ponto.lat ?? ponto.latitude ?? '');
  const lng = parseFloat(ponto.lng ?? ponto.longitude ?? '');
  if (isNaN(lat) || isNaN(lng) || !mapManual.value) return;
  const marker = L.marker([lat, lng], { icon: DefaultIcon }).addTo(mapManual.value);
  marker.bindPopup(popupHtml(ponto));
  ponto._marker = marker;
};

const limparMarcadoresManual = () => {
  pontosBanco.value.forEach((p: any) => {
    if (p._marker && mapManual.value) mapManual.value.removeLayer(p._marker);
    p._marker = null;
  });
};

const focarPontoMapa = (ponto: any) => {
  const lat = parseFloat(ponto.lat ?? ponto.latitude ?? '');
  const lng = parseFloat(ponto.lng ?? ponto.longitude ?? '');
  if (!isNaN(lat) && !isNaN(lng) && mapManual.value) {
    mapManual.value.flyTo([lat, lng], 16);
    ponto._marker?.openPopup();
  }
};

const renderizarPontosManual = (lista: any[]) => {
  limparMarcadoresManual();
  pontosBanco.value = lista.map((p: any) => ({ ...p }));
  pontosBanco.value.forEach(adicionarMarcadorManual);
  if (pontosBanco.value.length > 0) {
    const p0  = pontosBanco.value[0];
    const lat = parseFloat(p0.lat ?? p0.latitude ?? '');
    const lng = parseFloat(p0.lng ?? p0.longitude ?? '');
    if (!isNaN(lat) && !isNaN(lng)) mapManual.value?.setView([lat, lng], 12);
  }
};

const filtrarPontosPorMaterial = () => {
  const id = formManual.value.materialId;
  if (!id) { renderizarPontosManual(pontosTodos.value); return; }
  const mat = materiaisBanco.value.find((m) => m.id == id);
  if (!mat) { renderizarPontosManual(pontosTodos.value); return; }

  const nomeBase = removerAcentos((mat.nome ?? '').toLowerCase().trim());
  const palavrasChave = nomeBase.split(/\s+/).filter((p: string) => p.length > 2);

  const filtrados = pontosTodos.value.filter((p: any) => {
    const textoMateriais = extrairTextoMateriais(p.materiais ?? p.materiaisAceitos ?? p.Material);
    const textoPonto = removerAcentos(textoMateriais.toLowerCase());
    if (textoPonto.includes(nomeBase)) return true;
    if (palavrasChave.length > 0) return palavrasChave.some((palavra: string) => textoPonto.includes(palavra));
    return false;
  });

  if (filtrados.length === 0) {
    exibirToast(`Nenhum ponto estrito para "${mat.nome}". Mostrando abrangência total.`);
    renderizarPontosManual(pontosTodos.value);
  } else {
    renderizarPontosManual(filtrados);
  }
};

const onMaterialChange = () => {
  pontoId.value = '';
  pontoSelecionado.value = null;
  filtrarPontosPorMaterial();
};

const mostrarTodosPontos = () => {
  formManual.value.materialId = '';
  formManual.value.cep = '';
  pontoId.value = '';
  pontoSelecionado.value = null;
  renderizarPontosManual(pontosTodos.value);
};

// ─── BUSCA POR CEP ────────────────────────────────────────────────────────────
const buscarPontosPorCep = async () => {
  const cepLimpo = formManual.value.cep.replace(/\D/g, '');
  if (cepLimpo.length < 5) return;
  buscandoPontos.value = true;
  try {
    let base = pontosTodos.value;
    if (formManual.value.materialId) {
      const id = formManual.value.materialId;
      const mat = materiaisBanco.value.find((m) => m.id == id);
      if (mat) {
        const nomeBase = removerAcentos((mat.nome ?? '').toLowerCase().trim());
        const palavrasChave = nomeBase.split(/\s+/).filter((p: string) => p.length > 2);
        base = pontosTodos.value.filter((p: any) => {
          const tm = extrairTextoMateriais(p.materiais ?? p.materiaisAceitos ?? p.Material);
          const tp = removerAcentos(tm.toLowerCase());
          return tp.includes(nomeBase) || palavrasChave.some((w: string) => tp.includes(w));
        });
      }
    }
    const filtrados = base.filter((p: any) => {
      const cp = String(p.cep ?? p.CEP ?? p.cepDestino ?? '').replace(/\D/g, '');
      return cp && cp.startsWith(cepLimpo.slice(0, 5));
    });
    if (filtrados.length === 0) {
      exibirToast('Nenhum ponto encontrado nessa região do CEP. Mostrando abrangência total.');
      renderizarPontosManual(base);
    } else {
      renderizarPontosManual(filtrados);
    }
  } finally {
    buscandoPontos.value = false;
  }
};

watch(() => formManual.value.cep, (val) => {
  const cepLimpo = val.replace(/\D/g, '');
  if (!mapManual.value) return;
  if (cepLimpo.length < 5) { filtrarPontosPorMaterial(); return; }
  buscarPontosPorCep();
});

// ─── MAPA IA ──────────────────────────────────────────────────────────────────
const initMapIa = () => {
  if (mapIa.value) return;
  mapIa.value = L.map('map-ia', { zoomControl: false }).setView([-19.892, -43.812], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(mapIa.value);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap' }).addTo(mapIa.value);
  setTimeout(() => mapIa.value?.invalidateSize(), 80);
};

const limparMarcadoresIa = () => {
  pontosFiltradosIA.value.forEach((p: any) => {
    if (p._marker && mapIa.value) mapIa.value.removeLayer(p._marker);
    p._marker = null;
  });
};

const filtrarPontosPorMaterialIA = () => {
  if (!materialFinalIA.value) { pontosFiltradosIA.value = []; return; }
  const nomeBase = removerAcentos((materialFinalIA.value.nome ?? '').toLowerCase());
  const palavrasChave = nomeBase.split(' ').filter((p: string) => p.length > 2);
  const filtrados = pontosTodos.value.filter((p: any) => {
    const tm = extrairTextoMateriais(p.materiais ?? p.materiaisAceitos ?? p.Material);
    const mp = removerAcentos(tm.toLowerCase());
    return mp.includes(nomeBase) || palavrasChave.some((palavra: string) => mp.includes(palavra));
  });
  limparMarcadoresIa();
  pontosFiltradosIA.value = filtrados.map((p: any) => ({ ...p }));
  pontosFiltradosIA.value.forEach((ponto: any) => {
    const lat = parseFloat(ponto.lat ?? ponto.latitude ?? '');
    const lng = parseFloat(ponto.lng ?? ponto.longitude ?? '');
    if (isNaN(lat) || isNaN(lng) || !mapIa.value) return;
    const marker = L.marker([lat, lng], { icon: DefaultIcon }).addTo(mapIa.value);
    marker.bindPopup(popupHtml(ponto));
    ponto._marker = marker;
  });
  if (pontosFiltradosIA.value.length > 0 && mapIa.value) {
    const p0  = pontosFiltradosIA.value[0];
    const lat = parseFloat(p0.lat ?? p0.latitude ?? '');
    const lng = parseFloat(p0.lng ?? p0.longitude ?? '');
    if (!isNaN(lat) && !isNaN(lng)) mapIa.value.setView([lat, lng], 13);
  }
};

const selecionarPonto = (ponto: any) => {
  pontoId.value = ponto.id;
  pontoSelecionado.value = ponto;
  focarPontoMapa(ponto);
};

const selecionarPontoIA = (ponto: any) => {
  pontoIdIA.value = ponto.id;
  pontoSelecionadoIA.value = ponto;
  const lat = parseFloat(ponto.lat ?? ponto.latitude ?? '');
  const lng = parseFloat(ponto.lng ?? ponto.longitude ?? '');
  if (!isNaN(lat) && !isNaN(lng) && mapIa.value) {
    mapIa.value.flyTo([lat, lng], 16);
    ponto._marker?.openPopup();
  }
};

// ─── IA LOOP & CÂMERA ─────────────────────────────────────────────────────────
const findMaterialFromLabel = (rawName: string) => {
  const entry = Object.entries(MATERIAL_MAP).find(([k]) => k.includes(rawName));
  return entry ? entry[1] : null;
};

const loopIA = async () => {
  if (etapa.value !== 'ia_scanning' || isWaitingConfirmation.value || !videoRef.value) return;
  if (model && videoRef.value.readyState === 4) {
    const predictions = await model.classify(videoRef.value);
    const sorted = [...predictions].sort((a: any, b: any) => b.probability - a.probability);
    for (const pred of sorted) {
      if (pred.probability < 0.15) continue;
      const rawName = pred.className.split(',')[0].toLowerCase().trim();
      const mapped = findMaterialFromLabel(rawName);
      if (mapped) {
        isWaitingConfirmation.value = true;
        materialIA.value = mapped;
        currentSuggestion.value = { labelPt: mapped.labelPt, reciclavel: mapped.reciclavel };
        perguntaIA.value = mapped.reciclavel
          ? `Isso é um(a) ${mapped.labelPt}?`
          : `Isso parece ser ${mapped.labelPt}, que não é reciclável. Está correto?`;
        break;
      }
    }
  }
  if (!isWaitingConfirmation.value) requestAnimationFrame(loopIA);
};

const iniciarIA = async () => {
  if (isLoadingIA.value) {
    exibirToast('A IA ainda está carregando. Aguarde...');
    return;
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    etapa.value = 'ia_intro';
  } catch {
    stream = null;
    exibirToast('Acesso à câmera negado. Dê permissão para usar o scanner.');
  }
};

const abrirScanner = async () => {
  etapa.value = 'ia_scanning';
  await nextTick();
  if (videoRef.value && stream) {
    videoRef.value.srcObject = stream;
    videoRef.value.onloadedmetadata = () => loopIA();
  } else {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
        videoRef.value.onloadedmetadata = () => loopIA();
      }
    } catch {
      exibirToast('Câmera indisponível.');
      etapa.value = 'inicio';
    }
  }
};

const pararCamera = () => {
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
  isWaitingConfirmation.value = false;
  currentSuggestion.value = null;
  materialIA.value = null;
  etapa.value = 'inicio';
};

const cancelarIA = () => {
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
  etapa.value = 'inicio';
};

const tryNextSuggestion = () => {
  isWaitingConfirmation.value = false;
  currentSuggestion.value = null;
  materialIA.value = null;
  loopIA();
};

const confirmarMaterialIA = async () => {
  const mapped = materialIA.value;
  if (!mapped) return;
  const encontrado = materiaisBanco.value.find(m =>
    removerAcentos(m.nome.toLowerCase()).includes(removerAcentos(mapped.labelPt.toLowerCase()))
  );
  isWaitingConfirmation.value = false;
  currentSuggestion.value = null;
  if (!encontrado) {
    exibirToast('Material detectado, mas sem pontos específicos configurados no sistema.');
    etapa.value = 'inicio';
    return;
  }
  materialFinalIA.value = encontrado;
  pontoSelecionadoIA.value = null;
  pontoIdIA.value = '';
  etapa.value = 'ia_pontos';
};

const voltarAoInicio = () => {
  etapa.value = 'inicio';
  materialFinalIA.value = null;
  pontoSelecionadoIA.value = null;
  pontoIdIA.value = '';
};

// ─── WATCHERS ─────────────────────────────────────────────────────────────────
watch(() => etapa.value, async (nova) => {
  if (nova === 'inicio' || nova === 'manual_form') {
    await nextTick();
    initMapManual();
    if (pontosBanco.value.length === 0 && pontosTodos.value.length > 0) {
      renderizarPontosManual(pontosTodos.value);
    }
  }
  if (nova === 'ia_pontos') {
    await nextTick();
    initMapIa();
    filtrarPontosPorMaterialIA();
  }
});

const atualizarPopupsAbertos = () => {
  [...pontosBanco.value, ...pontosFiltradosIA.value].forEach((p: any) => {
    if (p._marker?.isPopupOpen()) p._marker.setPopupContent(popupHtml(p));
  });
};

// ─── LIFECYCLE ────────────────────────────────────────────────────────────────
onMounted(async () => {
  timerInterval = setInterval(() => {
    agora.value = new Date();
    atualizarPopupsAbertos();
  }, 1000);

  try {
    const [resMat, resPon] = await Promise.all([
      axios.get('http://localhost:3000/Materiais'),
      axios.get('http://localhost:3000/PontosDeColeta'),
    ]);

    let listaMat: any = resMat.data;
    if (listaMat?.materiais && Array.isArray(listaMat.materiais)) listaMat = listaMat.materiais;
    materiaisBanco.value = Array.isArray(listaMat) ? listaMat : [];

    const dp = resPon.data;
    const listaPon: any = dp?.pontos ?? dp?.Pontos ?? dp?.pontosDeColeta ?? dp?.PontosDeColeta ?? dp?.data ?? dp?.pontosBanco ?? dp;
    pontosTodos.value = Array.isArray(listaPon) ? listaPon : [];

    await nextTick();
    initMapManual();
    renderizarPontosManual(pontosTodos.value);

    await tf.ready();
    model = await mobilenet.load();
    isLoadingIA.value = false;
  } catch (e) {
    console.error('[Reciclagem] Erro no carregamento inicial:', e);
    isLoadingIA.value = false;
  }
});

onUnmounted(() => {
  clearInterval(timerInterval);
  stream?.getTracks().forEach(t => t.stop());
  if (mapManual.value) { mapManual.value.remove(); mapManual.value = null; }
  if (mapIa.value) { mapIa.value.remove(); mapIa.value = null; }
});
</script>

<style scoped>
.section-loja {
  position: relative;
  padding: 40px 2%;
  background: #fafafa;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}
.btn-cta {
  display: inline-block;
  background: #000;
  color: #fff;
  padding: 10px 20px;
  text-decoration: none;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  border-radius: 4px;
  transition: opacity 0.2s;
}
.btn-cta:hover { opacity: 0.8; }
.main-title {
  font-size: 2.4rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 5px 0 25px;
  letter-spacing: -1px;
}
.eyebrow {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #888;
}
.title-medium {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 5px 0 10px;
}
.text-highlight { color: #888; }
.subtitle { color: #666; margin-bottom: 0; font-size: 14px; }

.map-layout {
  display: grid;
  grid-template-columns: 1.1fr 1.6fr;
  gap: 0;
  background: white;
  border: 1px solid #eee;
  min-height: 68vh;
}
.form-column {
  padding: 24px 20px;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.form-group { margin-bottom: 18px; text-align: left; }
.form-group label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  display: block;
  margin-bottom: 5px;
}
.custom-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #000;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  box-sizing: border-box;
  background: #fff;
}
.cep-row { display: flex; gap: 8px; }
.cep-row .custom-input { flex: 1; }
.readonly-input { background: #f5f5f5 !important; border-color: #ddd !important; }
.material-chip { display: flex; align-items: center; gap: 8px; }
.hint-text { font-size: 11px; color: #666; margin-top: 5px; display: block; line-height: 1.4; }

.map-and-list-column {
  display: flex;
  flex-direction: column;
  height: 68vh;
}
.map-container-user {
  flex: 1.2;
  position: relative;
  background: #ececec;
}
.map-frame-user { width: 100%; height: 100%; min-height: 300px; z-index: 1; }

.locations-sidebar {
  flex: 1;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sidebar-header {
  padding: 12px 20px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sidebar-count { font-size: 11px; font-weight: 700; background: #000; color: #fff; padding: 2px 8px; border-radius: 10px; }
.locations-list { flex: 1; overflow-y: auto; }

.location-item {
  padding: 14px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  display: flex;
  gap: 12px;
  transition: background 0.15s;
  align-items: flex-start;
  text-align: left;
}
.location-item:hover { background: #f9f9f9; }
.location-item-selected { background: #f5f5f5; border-left: 3px solid #000; }
.location-radio { margin-top: 3px; flex-shrink: 0; }
.location-info strong { display: block; font-size: 13px; font-weight: 700; margin-bottom: 3px; }
.location-address { font-size: 11px; color: #888; margin: 0 0 3px; display: flex; align-items: flex-start; gap: 4px; line-height: 1.4; }
.location-materiais {
  font-size: 10px;
  color: #2d6a4f;
  background: #d8f3dc;
  padding: 2px 8px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 3px 0;
  font-weight: 600;
}
.location-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 5px; }
.status-tag { font-size: 10px; font-weight: 700; padding: 2px 7px; text-transform: uppercase; border-radius: 3px; display: inline-flex; align-items: center; gap: 4px; }
.tag-aberto { color: #234e52; background: #e6fffa; }
.tag-fechado { color: #c53030; background: #fff5f5; }
.distancia-tag { font-size: 10px; font-weight: 700; padding: 2px 6px; background: #f0f0f0; color: #555; border-radius: 3px; display: inline-flex; align-items: center; gap: 3px; }

.location-actions { display: flex; gap: 7px; margin-top: 10px; }
.btn-card-primary { background: #000; color: #fff; border: none; padding: 6px 12px; font-weight: 700; font-size: 10px; text-transform: uppercase; cursor: pointer; border-radius: 3px; }
.btn-card-secondary { background: transparent; color: #000; border: 1px solid #ccc; padding: 6px 10px; font-weight: 700; font-size: 10px; text-transform: uppercase; cursor: pointer; border-radius: 3px; }

.rota-inline { margin-top: 4px; margin-bottom: 18px; padding: 14px; border: 1px solid #eee; border-radius: 4px; background: #fafafa; text-align: left; }
.rota-inline-label { font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 8px; color: #555; }
.rota-opcoes-inline { display: flex; gap: 6px; }
.btn-rota-inline { flex: 1; padding: 8px; border: 1px solid #ddd; background: #fff; font-size: 11px; font-weight: 700; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center; gap: 4px; }
.btn-gmaps-inline { color: #4285F4; }
.btn-uber-inline { color: #000; }
.btn-99-inline { color: #f5a623; }

.btn-buy { background: #000; color: #fff; border: 1px solid #000; padding: 12px 24px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; border-radius: 4px; }
.btn-buy:disabled { background: #ccc; border-color: #ccc; cursor: not-allowed; }
.btn-secondary-border { background: transparent; color: #000; border: 2px solid #000; padding: 12px 24px; font-weight: 700; font-size: 13px; text-transform: uppercase; cursor: pointer; border-radius: 4px; }
.btn-secondary { background: none; border: none; color: #666; cursor: pointer; padding: 10px; font-weight: 600; font-size: 13px; }
.btn-icon-label { display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
.full-width { width: 100%; margin-top: 6px; }
.form-actions-column { margin-top: auto; }

.fab-ia { position: fixed; bottom: 32px; right: 32px; z-index: 800; background: #000; color: #fff; border: none; border-radius: 50px; padding: 14px 22px; display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 700; font-size: 13px; text-transform: uppercase; box-shadow: 0 4px 20px rgba(0,0,0,0.25); transition: transform 0.2s; }
.fab-ia:hover { transform: translateY(-2px); }
.fab-icon { font-size: 1.1rem; }

.modal-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); z-index: 900; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-content { width: 100%; max-width: 460px; padding: 32px; background: #fff; border: 1px solid #eee; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-radius: 8px; }
.video-wrapper { position: relative; width: 100%; aspect-ratio: 4/3; background: #000; border-radius: 6px; overflow: hidden; }
video { width: 100%; height: 100%; object-fit: cover; }
video.frozen { filter: grayscale(0.3) brightness(0.9); }
.status-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); color: #fff; font-weight: 700; font-size: 13px; }
.scan-frame { position: absolute; inset: 20px; pointer-events: none; }
.scan-corner { position: absolute; width: 16px; height: 16px; border-color: #fff; border-style: solid; }
.scan-corner.tl { top:0; left:0; border-width: 3px 0 0 3px; }
.scan-corner.tr { top:0; right:0; border-width: 3px 3px 0 0; }
.scan-corner.bl { bottom:0; left:0; border-width: 0 0 3px 3px; }
.scan-corner.br { bottom:0; right:0; border-width: 0 3px 3px 0; }
.scan-line { position: absolute; left: 0; right: 0; height: 2px; background: rgba(255,255,255,.6); animation: scanMove 2s ease-in-out infinite; }
@keyframes scanMove { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
.scan-hint { text-align: center; font-size: 12px; color: #666; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; }
.ia-feedback { margin-top: 16px; }
.product-title { font-size: 1.2rem; font-weight: 800; margin: 0 0 8px; }
.product-description { font-size: 13px; color: #666; margin: 0 0 12px; }
.modal-actions { display: flex; gap: 8px; }
.modal-intro { text-align: center; }
.intro-icon-wrap { margin-bottom: 16px; }
.intro-icon { font-size: 2.5rem; color: #000; }
.intro-steps { list-style: none; padding: 0; margin: 16px 0; text-align: left; }
.intro-steps li { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 13px; line-height: 1.5; }
.intro-dica { font-size: 12px; background: #f5f5f5; padding: 12px; border-radius: 4px; text-align: left; margin-bottom: 20px; display: flex; gap: 8px; align-items: flex-start; }

.btn-rota { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; border: 1px solid #eee; background: #fff; border-radius: 6px; cursor: pointer; margin-bottom: 8px; transition: background 0.15s; }
.btn-rota:hover { background: #f9f9f9; }
.rota-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; flex-shrink: 0; }
.rota-icon-uber { background: #000; }
.rota-icon-99 { background: #f5a623; color: #fff; font-weight: 900; font-size: 13px; }
.rota-label { display: flex; flex-direction: column; text-align: left; }
.rota-label strong { font-size: 13px; font-weight: 700; }
.rota-label small { font-size: 11px; color: #999; }

.selecionar-ponto-wrapper { padding-top: 10px; }
.admin-section { padding: 0; }

.empty-state { padding: 30px; color: #aaa; font-size: 13px; text-align: center; }
.empty-state-inline { padding: 14px; color: #aaa; font-size: 13px; text-align: center; border: 1px dashed #ddd; border-radius: 4px; }

.toast-container { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 2000; pointer-events: none; }
.toast-message { background: #000; color: #fff; padding: 14px 24px; border-radius: 4px; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(0,0,0,.2); }
.toast-fade-enter-active { animation: fadeInUp 0.35s; }
.toast-fade-leave-active { animation: fadeInUp 0.35s reverse; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

.spin { animation: spin 1.1s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

:deep(.leaflet-popup-content-wrapper) { border-radius: 4px; padding: 4px; box-shadow: 0 8px 30px rgba(0,0,0,.1); }

@media (max-width: 900px) {
  .map-layout { grid-template-columns: 1fr; }
  .form-column { border-right: none; border-bottom: 1px solid #eee; }
  .map-and-list-column { height: auto; }
  .map-container-user { height: 280px; }
}
</style>