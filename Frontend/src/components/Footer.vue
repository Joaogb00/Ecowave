<template>
  <footer class="eco-footer" :class="{ 'fade-visible': isVisible }" ref="footerRef">
    <div class="footer-grid">

      <!-- COLUNA PRINCIPAL -->
      <div class="col-main">
        <img src="../assets/img/logo6.png" alt="EcoWave" class="f-logo">
        <p class="f-description">
          Liderando a transição para a economia circular através de sistemas inteligentes de logística reversa e rastreabilidade.
        </p>
        <div class="founders-badge">
          <span class="dot"></span>
          Direção: J. Gabriel & J. Pablo
        </div>
      </div>

      <!-- LINKS -->
      <div class="col-links">
        <div class="link-group">
          <h4>Navegação</h4>
          <a href="#" @click.prevent="openModal('visao')">Visão Geral</a>
          <a href="#" @click.prevent="openModal('solucoes')">Soluções</a>
          <a href="#" @click.prevent="openModal('recursos')">Recursos</a>
          <a href="#" @click.prevent="openModal('manifesto')">Manifesto</a>
        </div>
        <div class="link-group">
          <h4>Suporte</h4>
          <a href="#" @click.prevent="openModal('documentacao')">Documentação</a>
          <a href="#" @click.prevent="openModal('api')">API</a>
          <a href="#" @click.prevent="openModal('privacidade')">Privacidade</a>
          <a href="#" @click.prevent="openModal('termos')">Termos</a>
        </div>
      </div>

      <!-- NEWSLETTER -->
      <div class="col-newsletter">
        <h4>Newsletter</h4>
        <p>Receba insights sobre impacto ambiental e tecnologia.</p>
        <form @submit.prevent class="f-input-group">
          <input type="email" placeholder="E-mail corporativo">
          <button type="submit">Inscrever</button>
        </form>
      </div>
    </div>

    <!-- BASE -->
    <div class="footer-base">
      <div class="base-content">
        <span>© 2026 ECOWAVE TECHNOLOGY. TODOS OS DIREITOS RESERVADOS.</span>
        <div class="social-minimal">
          <a href="#">LINKEDIN</a>
          <span class="sep">/</span>
          <a href="#">INSTAGRAM</a>
          <span class="sep">/</span>
          <a href="#">TWITTER</a>
        </div>
      </div>
    </div>

    <!-- ============================================================
         MODAL INFORMATIVO
         ============================================================ -->
    <transition name="modal-fade">
      <div
        v-if="activeModal"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <transition name="modal-slide">
          <div class="modal-box" v-if="activeModal">

            <!-- Cabeçalho -->
            <div class="modal-header">
              <div class="modal-eyebrow">{{ currentModal.eyebrow }}</div>
              <h2 class="modal-title">{{ currentModal.title }}<span class="title-dot">.</span></h2>
              <button class="modal-close" @click="closeModal" aria-label="Fechar modal">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <!-- Corpo com scroll -->
            <div class="modal-body">
              <div
                v-for="(section, i) in currentModal.sections"
                :key="i"
                class="modal-section"
                :style="{ animationDelay: `${i * 0.06}s` }"
              >
                <h3 v-if="section.heading" class="section-heading">{{ section.heading }}</h3>
                <p class="section-text">{{ section.text }}</p>
              </div>
            </div>

            <!-- Rodapé -->
            <div class="modal-footer">
              <button class="btn-modal-close" @click="closeModal">FECHAR</button>
            </div>

          </div>
        </transition>
      </div>
    </transition>

  </footer>
</template>

<script>
const MODALS = {
  visao: {
    eyebrow: 'Navegação',
    title: 'Visão Geral',
    sections: [
      {
        heading: 'O que é a EcoWave?',
        text: 'A EcoWave é uma plataforma tecnológica dedicada à transformação da cadeia de descarte e reciclagem no Brasil. Unimos cidadãos, empresas e pontos de coleta em um ecossistema digital inteligente voltado para a economia circular.'
      },
      {
        heading: 'Como funciona?',
        text: 'Usuários registram reciclagens pelo app, acumulam EcoWave Coins e trocam por recompensas. Empresas parceiras e pontos de coleta gerenciam fluxos de resíduos em tempo real através de um painel dedicado.'
      },
      {
        heading: 'Nossa abrangência',
        text: 'Atuando em múltiplas regiões do Brasil, a plataforma conecta dezenas de pontos de coleta e centenas de usuários ativos, processando toneladas de resíduos mensalmente com rastreabilidade ponta a ponta.'
      }
    ]
  },

  solucoes: {
    eyebrow: 'Navegação',
    title: 'Soluções',
    sections: [
      {
        heading: 'Para Cidadãos',
        text: 'Registre reciclagens, localize pontos de coleta próximos, acompanhe seu histórico e acumule EcoWave Coins para trocar por benefícios reais. Tornar o descarte correto simples e recompensador é o nosso objetivo.'
      },
      {
        heading: 'Para Empresas',
        text: 'Gerencie o descarte de resíduos corporativos com rastreabilidade completa, relatórios de impacto ambiental e integração via API. Cumpra obrigações regulatórias e demonstre responsabilidade ambiental de forma mensurável.'
      },
      {
        heading: 'Para Pontos de Coleta',
        text: 'Proprietários de pontos de coleta têm acesso a um painel completo para gerenciar entradas de resíduos, emitir e validar pontos EcoWave, acompanhar métricas e se comunicar com usuários da plataforma.'
      }
    ]
  },

  recursos: {
    eyebrow: 'Navegação',
    title: 'Recursos',
    sections: [
      {
        heading: 'EcoWave Coins',
        text: 'Sistema de recompensas baseado em reciclagens verificadas. Cada descarte registrado gera pontos que podem ser trocados por produtos, serviços e benefícios junto aos parceiros da plataforma.'
      },
      {
        heading: 'Rastreabilidade',
        text: 'Acompanhe o ciclo completo dos seus resíduos: da coleta ao destino final. Cada etapa é registrada e auditável, garantindo transparência e confiabilidade em toda a cadeia.'
      },
      {
        heading: 'Mapa de Coleta',
        text: 'Localize pontos de coleta em tempo real com filtros por tipo de resíduo, horário de funcionamento e avaliações de outros usuários. Disponível para web e dispositivos móveis.'
      },
      {
        heading: 'QR Code de Identidade',
        text: 'Cada usuário possui um QR Code único que pode ser apresentado nos pontos de coleta para registro automático de reciclagens, eliminando erros e agilizando o processo.'
      }
    ]
  },

  manifesto: {
    eyebrow: 'Navegação',
    title: 'Manifesto',
    sections: [
      {
        heading: 'Acreditamos na ação coletiva',
        text: 'A crise ambiental não será resolvida por governos ou empresas isoladamente. A transformação real nasce de milhões de pequenas ações coordenadas. A EcoWave existe para dar escala a essas ações.'
      },
      {
        heading: 'Tecnologia a serviço do planeta',
        text: 'Não construímos tecnologia por tecnologia. Cada funcionalidade da plataforma existe para reduzir a barreira entre a intenção de reciclar corretamente e o ato de fazê-lo. Simplicidade e impacto são nossos princípios de design.'
      },
      {
        heading: 'Transparência radical',
        text: 'Dados ambientais devem ser acessíveis a todos. Publicamos métricas de impacto abertas, auditamos nossos parceiros e nos comprometemos a nunca inflacionar números para parecer maiores do que somos.'
      },
      {
        heading: 'Economia circular ou nada',
        text: 'Reciclagem linear não basta. Nossa visão é de sistemas onde materiais não têm fim de vida — apenas novos ciclos. Cada produto vendido pelos nossos parceiros deve ter uma rota de retorno planejada.'
      }
    ]
  },

  documentacao: {
    eyebrow: 'Suporte',
    title: 'Documentação',
    sections: [
      {
        heading: 'Guia de início rápido',
        text: 'Para novos usuários: crie sua conta, explore o mapa de coleta, registre sua primeira reciclagem e acompanhe seus EcoWave Coins no painel. O processo completo leva menos de 5 minutos.'
      },
      {
        heading: 'Para proprietários de pontos',
        text: 'Após a aprovação do upgrade de perfil, acesse o painel administrativo para configurar seu ponto, definir tipos de resíduos aceitos e começar a receber reciclagens dos usuários cadastrados.'
      },
      {
        heading: 'Integrações e API',
        text: 'Desenvolvedores e parceiros empresariais podem integrar sistemas externos com a EcoWave via API REST documentada. Consulte a seção de API para endpoints, autenticação e exemplos de uso.'
      },
      {
        heading: 'Suporte técnico',
        text: 'Em caso de dúvidas ou problemas, utilize o assistente virtual disponível na plataforma ou entre em contato com nossa equipe de suporte. Atendemos em horário comercial com SLA de 24 horas para respostas.'
      }
    ]
  },

  api: {
    eyebrow: 'Suporte',
    title: 'API EcoWave',
    sections: [
      {
        heading: 'Visão geral da API',
        text: 'A API REST da EcoWave permite que sistemas externos se integrem à plataforma para leitura e gravação de dados de reciclagem, gerenciamento de usuários e consulta de métricas. Baseada em JSON com autenticação via Bearer Token.'
      },
      {
        heading: 'Autenticação',
        text: 'Todas as requisições autenticadas requerem um token JWT obtido via endpoint de login. O token deve ser incluído no header Authorization: Bearer <token>. Tokens expiram em 24 horas e podem ser renovados via refresh endpoint.'
      },
      {
        heading: 'Endpoints principais',
        text: 'Os principais recursos disponíveis são: /Usuario (gestão de usuários), /Reciclagem (registro e consulta de reciclagens), /PontoColeta (listagem e detalhes de pontos) e /Recompensa (consulta e resgate de EcoWave Coins).'
      },
      {
        heading: 'Rate limits e SLA',
        text: 'O plano padrão permite 1.000 requisições por hora por token. Parceiros com volume maior devem solicitar um plano dedicado. A API possui SLA de disponibilidade de 99,5% com monitoramento em tempo real.'
      }
    ]
  },

  privacidade: {
    eyebrow: 'Suporte',
    title: 'Política de Privacidade',
    sections: [
      {
        heading: '1. Dados que coletamos',
        text: 'Coletamos nome completo, endereço de e-mail, foto de perfil (opcional) e dados de atividade na plataforma (reciclagens registradas, pontos acumulados, localização aproximada dos descartes). Não coletamos dados de pagamento diretamente.'
      },
      {
        heading: '2. Como usamos seus dados',
        text: 'Seus dados são utilizados exclusivamente para operar a plataforma, personalizar sua experiência, calcular recompensas e gerar relatórios de impacto ambiental agregados e anonimizados. Nunca vendemos dados pessoais a terceiros.'
      },
      {
        heading: '3. Compartilhamento de informações',
        text: 'Compartilhamos dados apenas com pontos de coleta parceiros para confirmar reciclagens (apenas ID de usuário e tipo de resíduo) e com prestadores de serviço técnico sujeitos a acordos de confidencialidade.'
      },
      {
        heading: '4. Seus direitos (LGPD)',
        text: 'Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a acessar, corrigir, portar e solicitar a exclusão dos seus dados a qualquer momento através das configurações da sua conta ou por contato direto com nossa equipe.'
      },
      {
        heading: '5. Retenção e segurança',
        text: 'Dados de conta são mantidos enquanto a conta estiver ativa. Após exclusão, os dados são removidos em até 30 dias, exceto quando exigida retenção por obrigação legal. Utilizamos criptografia em trânsito (TLS) e em repouso para todos os dados sensíveis.'
      }
    ]
  },

  termos: {
    eyebrow: 'Suporte',
    title: 'Termos de Uso',
    sections: [
      {
        heading: '1. Aceitação dos termos',
        text: 'Ao criar uma conta e utilizar a plataforma EcoWave, você concorda com estes Termos de Uso na sua integralidade. Caso não concorde com qualquer disposição, não utilize a plataforma. Estes termos podem ser atualizados periodicamente com aviso prévio de 15 dias.'
      },
      {
        heading: '2. Elegibilidade',
        text: 'A plataforma é destinada a pessoas físicas com 18 anos ou mais, ou menores de 18 anos com consentimento dos responsáveis legais. Pessoas jurídicas podem utilizar a plataforma através do perfil de Proprietário, sujeito à aprovação administrativa.'
      },
      {
        heading: '3. Uso aceitável',
        text: 'É proibido registrar reciclagens falsas, manipular o sistema de pontuação, criar múltiplas contas para obter vantagens indevidas, ou utilizar a plataforma para fins ilegais. Violações resultam em suspensão ou banimento permanente da conta.'
      },
      {
        heading: '4. EcoWave Coins',
        text: 'Os EcoWave Coins são pontos de fidelidade sem valor monetário conversível em dinheiro. Podem ser resgatados exclusivamente por produtos e serviços dos parceiros cadastrados, conforme disponibilidade. A EcoWave se reserva o direito de ajustar o programa de recompensas.'
      },
      {
        heading: '5. Limitação de responsabilidade',
        text: 'A EcoWave não se responsabiliza por indisponibilidades temporárias, perda de dados por eventos de força maior ou condutas de terceiros parceiros. A plataforma é fornecida "como está", com compromisso de melhoria contínua mas sem garantia de disponibilidade ininterrupta.'
      },
      {
        heading: '6. Foro e legislação',
        text: 'Estes termos são regidos pelas leis da República Federativa do Brasil. Quaisquer disputas serão submetidas ao foro da comarca de Belo Horizonte, Minas Gerais, com renúncia expressa a qualquer outro, por mais privilegiado que seja.'
      }
    ]
  }
}

export default {
  name: 'Footer',
  data() {
    return {
      isVisible: false,
      activeModal: null
    }
  },
  computed: {
    currentModal() {
      return this.activeModal ? MODALS[this.activeModal] : null
    }
  },
  mounted() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.isVisible = true
      }
    }, { threshold: 0.1 })

    observer.observe(this.$refs.footerRef)

    window.addEventListener('keydown', this.onKeyDown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    openModal(key) {
      if (MODALS[key]) {
        this.activeModal = key
        document.body.style.overflow = 'hidden'
      }
    },
    closeModal() {
      this.activeModal = null
      document.body.style.overflow = ''
    },
    onKeyDown(e) {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal()
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

/* =====================================================
   ECO-FOOTER — ECOWAVE DESIGN SYSTEM
   ===================================================== */

.eco-footer {
  background-color: #000000;
  color: #ffffff;
  padding: 100px 50px 0;
  font-family: 'Inter', sans-serif;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
              transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ---- GRID ---- */
.footer-grid {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 2fr 1.5fr;
  gap: 80px;
  padding-bottom: 80px;
}

/* ---- COLUNA PRINCIPAL ---- */
.f-logo {
  height: 42px;
  margin-bottom: 28px;
  filter: grayscale(1) brightness(2);
  display: block;
  transition: opacity 0.25s ease;
}
.f-logo:hover { opacity: 0.75; }

.f-description {
  font-size: 0.92rem;
  line-height: 1.65;
  color: rgba(255,255,255,0.45);
  max-width: 300px;
  margin: 0;
}

.founders-badge {
  margin-top: 32px;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,0.55);
  font-weight: 600;
}

.dot {
  width: 6px;
  height: 6px;
  background: #ffffff;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ---- LINKS ---- */
.col-links { display: flex; gap: 70px; }
.link-group { display: flex; flex-direction: column; }

.link-group h4,
.col-newsletter h4 {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #ffffff;
  margin: 0 0 24px 0;
}

.link-group a {
  display: inline-block;
  color: rgba(255,255,255,0.38);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 400;
  margin-bottom: 13px;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.link-group a:hover {
  color: #ffffff;
  transform: translateX(4px);
}

/* ---- NEWSLETTER ---- */
.col-newsletter p {
  font-size: 0.88rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.42);
  margin: 0 0 28px 0;
}

.f-input-group {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.18);
  padding-bottom: 10px;
  transition: border-color 0.3s ease;
}
.f-input-group:focus-within { border-color: #ffffff; }

.f-input-group input {
  background: transparent;
  border: none;
  color: #ffffff;
  flex: 1;
  outline: none;
  font-size: 0.88rem;
  font-family: 'Inter', sans-serif;
  padding: 4px 0;
}
.f-input-group input::placeholder { color: rgba(255,255,255,0.25); }

.f-input-group button {
  background: transparent;
  border: none;
  color: #ffffff;
  text-transform: uppercase;
  font-size: 0.68rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.1em;
  cursor: pointer;
  padding: 4px 0 4px 12px;
  white-space: nowrap;
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.f-input-group button:hover { opacity: 0.65; transform: translateX(2px); }

/* ---- BASE INFERIOR ---- */
.footer-base {
  max-width: 1300px;
  margin: 0 auto;
  padding: 28px 0 40px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.base-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.25);
  text-transform: uppercase;
}

.social-minimal { display: flex; align-items: center; }
.social-minimal a {
  color: rgba(255,255,255,0.25);
  text-decoration: none;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  font-weight: 600;
  transition: color 0.25s ease;
}
.social-minimal a:hover { color: #ffffff; }
.sep { margin: 0 10px; color: rgba(255,255,255,0.15); }

/* =====================================================
   MODAL — OVERLAY + BOX
   ===================================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 20px;
}

.modal-box {
  background: #ffffff;
  color: #000000;
  width: 100%;
  max-width: 560px;
  max-height: 82vh;
  border: 1px solid #000000;
  border-radius: 2px;
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* ---- CABEÇALHO DO MODAL ---- */
.modal-header {
  padding: 36px 36px 24px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  flex-shrink: 0;
}

.modal-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #000000;
  margin-bottom: 10px;
}

.modal-title {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-size: clamp(2rem, 5vw, 2.8rem);
  line-height: 0.88;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #000000;
  margin: 0;
  -webkit-font-smoothing: antialiased;
}

.title-dot {
  color: #000000;
}

.modal-close {
  position: absolute;
  top: 32px;
  right: 32px;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #000000;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.modal-close:hover {
  background: #000000;
  border-color: #000000;
  color: #ffffff;
  transform: rotate(90deg);
}

/* ---- CORPO COM SCROLL ---- */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 36px;
  scroll-behavior: smooth;
}

.modal-body::-webkit-scrollbar {
  width: 4px;
}
.modal-body::-webkit-scrollbar-track {
  background: #f5f5f5;
}
.modal-body::-webkit-scrollbar-thumb {
  background: #cccccc;
  border-radius: 2px;
}
.modal-body::-webkit-scrollbar-thumb:hover {
  background: #999999;
}

/* ---- SEÇÕES DO MODAL ---- */
.modal-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;

  animation: sectionReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.modal-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

@keyframes sectionReveal {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0);    }
}

.section-heading {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #000000;
  margin: 0 0 10px 0;
}

.section-text {
  font-size: 0.92rem;
  line-height: 1.7;
  color: #444444;
  margin: 0;
}

/* ---- RODAPÉ DO MODAL ---- */
.modal-footer {
  padding: 20px 36px 28px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.btn-modal-close {
  width: 100%;
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 1rem;
  border-radius: 2px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              transform  0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s ease;
}
.btn-modal-close:hover {
  background: #1c1c1e;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
.btn-modal-close:active {
  transform: translateY(0);
}

/* =====================================================
   TRANSIÇÕES DO MODAL (Vue <transition>)
   ===================================================== */

/* Overlay */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Box */
.modal-slide-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-slide-leave-active {
  transition: opacity 0.22s ease,
              transform 0.22s ease;
}
.modal-slide-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.97);
}
.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

/* ---- RESPONSIVIDADE ---- */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    padding-bottom: 60px;
  }
  .col-newsletter { grid-column: span 2; }
}

@media (max-width: 640px) {
  .eco-footer { padding: 70px 24px 0; }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    padding-bottom: 50px;
  }

  .col-links { gap: 40px; }
  .col-newsletter { grid-column: span 1; }

  .base-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .modal-header { padding: 28px 24px 20px; }
  .modal-body   { padding: 22px 24px; }
  .modal-footer { padding: 16px 24px 24px; }
  .modal-close  { top: 24px; right: 20px; }
}
</style>