<template>
  <div class="main-wrapper">
    <router-link to="/cadastrado" class="btn-cta">Voltar ao Início</router-link>

    <section class="admin-section">
      <div class="header-box">
        <span class="eyebrow">EcoWave Locator</span>
        <h2 class="title-medium">Encontre um <span class="text-highlight">Ponto de Coleta.</span></h2>
        <p class="subtitle">Visualize no mapa os locais disponíveis para descarte sustentável na sua região.</p>
      </div>

      <div class="map-layout">
        <div class="map-container-user">
          <div id="map-user" class="map-frame-user"></div>
        </div>

        <div class="locations-sidebar">
          <div class="sidebar-header">
            <span class="eyebrow">Locais Disponíveis</span>
          </div>
          <div class="locations-list">
            <div v-for="ponto in pontos" :key="ponto.id" class="location-item" @click="focarPonto(ponto)">
              <i class="bi bi-geo-alt-fill"></i>
              <div>
                <strong>{{ ponto.nome }}</strong>
                <p>{{ ponto.endereco }}</p>
              </div>
            </div>
            <div v-if="pontos.length === 0" class="empty-state">
              Buscando pontos próximos...
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../../../backend/src/services/api';

// Configuração de ícone personalizado para combinar com o design
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

export default {
  data() {
    return {
      map: null,
      pontos: []
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // Inicia o mapa com foco em Sabará
      this.map = L.map('map-user', { zoomControl: false }).setView([-19.892, -43.812], 13);

      // Adiciona controle de zoom no canto inferior direito
      L.control.zoom({ position: 'bottomright' }).addTo(this.map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(this.map);

      this.carregarPontosDoServidor();
    },

    async carregarPontosDoServidor() {
      try {
        const response = await api.get('/PontosDeColeta');

        // Lógica de "blindagem" para pegar os pontos independente do formato do objeto
        this.pontos = Array.isArray(response.data) ? response.data : (response.data.Pontos || response.data.pontos || []);

        this.pontos.forEach(ponto => {
          const lat = parseFloat(ponto.lat);
          const lng = parseFloat(ponto.lng);

          if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng], { icon: DefaultIcon })
              .addTo(this.map)
              .bindPopup(`
                <div class="custom-popup">
                  <span class="eyebrow" style="font-size: 8px">PONTO DE COLETA</span>
                  <h4 style="margin: 5px 0; color: #000;">${ponto.nome}</h4>
                  <p style="margin: 0; color: #666; font-size: 11px;">${ponto.endereco}</p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" style="color: #000; font-weight: bold; text-decoration: none; font-size: 10px;">COMO CHEGAR →</a>
                </div>
              `);
          }
        });
      } catch (error) {
        console.error("Erro ao carregar pontos:", error);
      }
    },

    focarPonto(ponto) {
      if (ponto.lat && ponto.lng) {
        this.map.flyTo([ponto.lat, ponto.lng], 16);
      }
    }
  }
}
</script>

<style scoped>
/* Base Style (Sincronizado com Admin) */
.main-wrapper {
  background: #fdfdfd;
  min-height: 100vh;
  padding: 80px 40px;
  font-family: 'Inter', sans-serif;
  color: #000;
}

.admin-section {
  max-width: 1100px;
  margin: 0 auto;
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
  margin-bottom: 5px;
}

.text-highlight {
  color: #bbb;
}

.subtitle {
  color: #666;
  margin-bottom: 40px;
  font-size: 14px;
}

/* Layout do Mapa */
.map-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  background: white;
  border: 1px solid #eee;
  height: 60vh;
}

.map-container-user {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-frame-user {
  height: 100%;
  width: 100%;
  outline: none;
}

/* Sidebar de Locais */
.locations-sidebar {
  border-left: 1px solid #eee;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.locations-list {
  flex: 1;
  overflow-y: auto;
}

.location-item {
  padding: 20px;
  border-bottom: 1px solid #f9f9f9;
  cursor: pointer;
  display: flex;
  gap: 15px;
  transition: 0.2s;
}

.location-item:hover {
  background: #f5f5f5;
}

.location-item i {
  color: #000;
  margin-top: 3px;
}

.location-item strong {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}

.location-item p {
  font-size: 11px;
  color: #888;
  line-height: 1.4;
  margin: 0;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 12px;
}

/* Custom Popup Style */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 0;
  padding: 5px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

@media (max-width: 768px) {
  .map-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .locations-sidebar {
    height: 300px;
    order: 2;
  }

  .map-container-user {
    height: 400px;
  }
}
</style>