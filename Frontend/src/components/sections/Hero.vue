<template>
  <div class="page-wrapper" ref="mainContainer">
    <Header />

    <nav class="side-timeline-nav" aria-label="Navegação da página">
      <button 
        v-for="(step, index) in navigationSteps" 
        :key="index"
        class="nav-dot-wrapper"
        :class="{ 'is-active': activeStep === index }"
        @click="scrollToStep(index)"
      >
        <span class="dot-label">{{ step.label }}</span>
        <span class="dot-core"></span>
      </button>
    </nav>

    <section
      class="unified-immersive-container"
      ref="scrollTriggerContainer"
      @mousemove="onMouseMove"
    >
      <div class="sticky-viewport">
        <div class="hero-bg-grid"></div>

        <div class="mega-title-wrapper">
          <h1 
            class="mega-title title-ecowave" 
            :class="{ 'is-clickable': isLogoClickable }"
            @click="handleLogoClick"
            role="banner"
          >
            ECOWAVE
          </h1>
        </div>

        <div class="hero-decor" ref="decorSubstrate">
          <div class="decor-item layer-bg" data-speed="15" style="left: 6%; top: 18%; width: 65px;">
            <img src="../../assets/img/elementos/papel.png" alt="Papel" style="opacity: 0.25; width: 100%;" />
          </div>
          <div class="decor-item layer-bg" data-speed="25" style="right: 10%; top: 50%; width: 90px;">
            <img src="../../assets/img/elementos/papelao.png" alt="Papelão" style="opacity: 0.2; width: 100%;" />
          </div>

          <div class="decor-item layer-mg" data-speed="40" style="right: 5%; top: 10%; width: 100px;">
            <img src="../../assets/img/elementos/saquinho.png" alt="Saquinho Ziplock" style="width: 100%;" />
          </div>
          <div class="decor-item layer-mg" data-speed="55" style="right: 24%; top: 22%; width: 85px;">
            <img src="../../assets/img/elementos/garrafa-azul.png" alt="Garrafa Azul" style="width: 100%;" />
          </div>
          <div class="decor-item layer-mg" data-speed="35" style="left: 4%; top: 32%; width: 110px;">
            <img src="../../assets/img/elementos/sacola.png" alt="Sacola" style="width: 100%;" />
          </div>
          <div class="decor-item layer-mg" data-speed="50" style="right: 14%; bottom: 18%; width: 90px;">
            <img src="../../assets/img/elementos/escova.png" alt="Escova" style="width: 100%;" />
          </div>

          <div class="decor-item layer-fg" data-speed="75" style="left: -3%; bottom: 5%; width: 170px;">
            <img src="../../assets/img/elementos/lata.png" alt="Lata" style="filter: blur(5px); opacity: 0.85; width: 100%;" />
          </div>
          <div class="decor-item layer-fg" data-speed="70" style="right: -5%; bottom: -4%; width: 220px;">
            <img src="../../assets/img/elementos/papelao.png" alt="Caixa" style="filter: blur(4px); opacity: 0.85; width: 100%;" />
          </div>
        </div>

        <div class="dynamic-content-stage">
          <div class="story-flow-wrapper step-story-1">
            <div class="kinetic-text-mask">
              <h2 class="premium-text-display">
                SISTEMA DE RECOMPENSAS EM RECICLAGEM, COM RESULTADOS NO MESMO DIA
              </h2>
            </div>
          </div>

          <div class="story-flow-wrapper step-story-2">
            <div class="kinetic-text-mask">
              <h2 class="premium-text-display">
                IDENTIFICAÇÃO INTELIGENTE COM IA PARA MATERIAIS RECICLÁVEIS
              </h2>
            </div>
          </div>

          <div class="story-flow-wrapper step-about-us">
            <div class="editorial-block-layout platform-manifesto">
              <span class="editorial-tag">00 // QUEM SOMOS</span>
              <h3 class="editorial-title">SOBRE NÓS</h3>
              <p class="editorial-body legacy-indent">
                Somos uma startup pioneira em tecnologia climática focada na aceleração da economia circular. 
                Acreditamos que o futuro da sustentabilidade urbana depende da fusão entre automação inteligente, 
                visão computacional avançada e gamificação de recompensas financeiras. Criamos pontes funcionais entre 
                a intenção ecológica dos cidadãos e a cadeia global de suprimentos e logística reversa de materiais.
              </p>
              <div class="brand-pillars-minimal">
                <div class="pillar-bullet"><strong>MISSÃO:</strong> Tornar a reciclagem um ato instintivo e rentável.</div>
                <div class="pillar-bullet"><strong>VALORES:</strong> Transparência absoluta via IA, inovação líquida e impacto direto.</div>
              </div>
            </div>
          </div>

          <div class="story-flow-wrapper step-vision">
            <div class="editorial-block-layout">
              <span class="editorial-tag">01 // PROPÓSITO</span>
              <h3 class="editorial-title">NOSSA VISÃO</h3>
              <p class="editorial-body">
                A recycling tradicional falha pela falta de incentivos claros e processos complexos. A
                <strong>EcoWave</strong> nasceu para quebrar essa barreira: utilizamos inteligência artificial
                para transformar o descarte correto em um fluxo simples, rastreável e financeiramente recompensado.
                Nosso objetivo é transformar a responsabilidade ambiental em valor tangível direto no bolso do usuário,
                gerando impacto coletivo imediato.
              </p>
            </div>
          </div>

          <div class="story-flow-wrapper step-history">
            <div class="editorial-block-layout">
              <span class="editorial-tag">02 // COLETIVO</span>
              <h3 class="editorial-title">NOSSA HISTÓRIA</h3>
              <p class="editorial-body">
                Idealizado em 2026 por uma aliança de engenheiros de software e designers ambientais, o projeto surgiu
                após identificarmos o abismo entre a intenção ecológica das pessoas e as taxas reais de triagem urbana.
                Motivados pelo desejo de automatizar e tornar a economia circular atraente, projetamos um ecossistema
                fluido baseado em visão computacional, aproximando a alta tecnologia do cotidiano das comunidades mundiais.
              </p>
            </div>
          </div>

          <div class="story-flow-wrapper step-carousel-gallery">
            <div class="gallery-layout-container">
              <p class="gallery-subtitle">UM FUTURO MAIS LIMPO COMEÇA AGORA</p>

              <div
                class="video-gallery" 
                @mouseenter="engageCarouselDepth"
                @mousemove="onCarouselMouseMove" 
                @mouseleave="disengageCarouselDepth"
              >
                <button class="gallery-nav prev" @click="prevVideo" aria-label="Anterior">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                
                <div class="gallery-track-3d" ref="carouselTrack">
                  <div
                    v-for="(item, index) in mediaItems"
                    :key="item.id"
                    class="gallery-card-3d"
                    :class="{ 'is-active': index === currentVideoIndex }"
                    :data-index="index"
                  >
                    <div class="premium-video-box">
                      <div class="video-dark-overlay" :class="{ 'is-clear': index === currentVideoIndex }"></div>
                      <div class="glow-overlay"></div>
                      
                      <video 
                        v-if="item.type === 'video' && index === currentVideoIndex" 
                        :src="item.src" 
                        autoplay 
                        loop 
                        muted 
                        playsinline
                        preload="auto"
                        class="gallery-video-element"
                      ></video>
                      <img 
                        v-else 
                        :src="item.poster" 
                        alt="Media preview" 
                        class="carousel-static-img" 
                      />

                      <div class="video-tag">{{ item.tag }}</div>
                      <div class="video-meta">
                        <span>{{ item.label }}</span>
                        <span>{{ item.duration }}</span>
                      </div>
                      
                      <div class="center-action-btn" v-if="index === currentVideoIndex">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <button class="gallery-nav next" @click="nextVideo" aria-label="Próximo">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              <div class="cta-container">
                <button class="cta-premium-btn">
                  <span>Começar agora na plataforma</span>
                  <span class="btn-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div class="story-flow-wrapper step-about-grid">
            <div class="about-grid">
              <div class="about-card">
                <div class="card-accent-line"></div>
                <h3>01 // ECOSSISTEMA</h3>
                <p>Uma infraestrutura projetada para rastreamento transparente e automatizado de resíduos urbanos.</p>
              </div>
              <div class="about-card">
                <div class="card-accent-line"></div>
                <h3>02 // RECOMPENSAS</h3>
                <p>Conversão direta do seu impacto sustentável em benefícios líquidos e tangíveis no mesmo dia.</p>
              </div>
              <div class="about-card">
                <div class="card-accent-line"></div>
                <h3>03 // ESCALABILIDADE</h3>
                <p>Alta tecnologia de visão computacional desenhada para integrar comunidades globais ao fluxo circular de resíduos urbanos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <button
      class="back-to-top"
      ref="backToTopBtn"
      @click="scrollToTop"
      aria-label="Voltar ao topo"
    >
      <span class="arrow-up">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </span>
      <span class="txt-up">TOP</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from '../Header.vue'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const mainContainer = ref<HTMLElement | null>(null)
const scrollTriggerContainer = ref<HTMLElement | null>(null)
const backToTopBtn = ref<HTMLElement | null>(null)
const carouselTrack = ref<HTMLElement | null>(null)
const decorSubstrate = ref<HTMLElement | null>(null)

const currentVideoIndex = ref(2)
const activeStep = ref(0)
const isLogoClickable = ref(false)

// Estados para controle de interpolação fluida (Lerp) via RequestAnimationFrame
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
const carouselMouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
let rafId: number | null = null
let isHoveringCarousel = false

// Passos de mapeamento linear reconfigurados milimetricamente para extinguir gaps pretos ou vazios no scroll
const navigationSteps = [
  { label: 'Início',     progress: 0.04 },
  { label: 'Inovação',   progress: 0.18 },
  { label: 'Sobre Nós',  progress: 0.32 },
  { label: 'Visão',      progress: 0.48 },
  { label: 'História',   progress: 0.64 },
  { label: 'Galeria',    progress: 0.80 }
]

// Lista unificada baseada estritamente na pasta /public/videos/ para evitar falhas do compilador dinâmico do Vite
// O campo 'poster' serve como imagem de standby leve enquanto o card não estiver no foco central
const mediaItems = ref([
  { id: 1, type: 'video', src: '/videos/galeria1.mp4', poster: '/img/posters/galeria1.jpg', tag: 'CREATIVE // LAB',  label: 'ECO MATRIX 01',  duration: '0:12' },
  { id: 2, type: 'video', src: '/videos/galeria2.mp4', poster: '/img/posters/galeria2.jpg', tag: 'MOTION // FRAME',    label: 'SURFACE ASSET',  duration: '0:10' },
  { id: 3, type: 'video', src: '/videos/galeria3.mp4', poster: '/img/posters/galeria3.jpg', tag: 'AI // COGNITIVE',    label: 'NEURAL SYSTEM',  duration: '0:08' },
  { id: 4, type: 'video', src: '/videos/galeria4.mp4', poster: '/img/posters/galeria4.jpg', tag: 'ECO // DISPLAY',     label: 'RECLAIM FRAME',  duration: '0:06' },
  { id: 5, type: 'video', src: '/videos/galeria5.mp4', poster: '/img/posters/galeria5.jpg', tag: 'FUTURE // STUDIO',   label: 'PURE CANVAS',    duration: '0:15' }
])

const totalItems = () => mediaItems.value.length

const handleLogoClick = () => {
  if (isLogoClickable.value) {
    router.push('/')
  }
}

const onMouseMove = (event: MouseEvent) => {
  const { innerWidth, innerHeight } = window
  mouse.targetX = (event.clientX / innerWidth) - 0.5
  mouse.targetY = (event.clientY / innerHeight) - 0.5
}

const onCarouselMouseMove = (event: MouseEvent) => {
  if (!carouselTrack.value) return
  const rect = carouselTrack.value.getBoundingClientRect()
  carouselMouse.targetX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
  carouselMouse.targetY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)
}

const renderLoop = () => {
  mouse.x += (mouse.targetX - mouse.x) * 0.08
  mouse.y += (mouse.targetY - mouse.y) * 0.08

  if (decorSubstrate.value && window.innerWidth > 768) {
    const items = decorSubstrate.value.querySelectorAll('.decor-item')
    items.forEach((item, index) => {
      const img = item.querySelector('img')
      if (!img) return
      const speed = parseFloat((item as HTMLElement).dataset.speed || '30')
      const rotationForce = index % 2 === 0 ? 12 : -12

      gsap.set(img, {
        x: mouse.x * speed,
        y: mouse.y * speed,
        rotate: mouse.x * rotationForce,
        force3D: true
      })
    })
  }

  if (carouselTrack.value && isHoveringCarousel) {
    carouselMouse.x += (carouselMouse.targetX - carouselMouse.x) * 0.1
    carouselMouse.y += (carouselMouse.targetY - carouselMouse.y) * 0.1
    
    gsap.set(carouselTrack.value, {
      rotateY: carouselMouse.x * 7,
      rotateX: -carouselMouse.y * 6,
      force3D: true
    })
  }

  rafId = requestAnimationFrame(renderLoop)
}

const updateCarouselLayout = (smooth = true) => {
  if (!carouselTrack.value) return
  const cards = carouselTrack.value.querySelectorAll<HTMLElement>('.gallery-card-3d')
  const isMobile = window.innerWidth <= 768
  
  cards.forEach((card) => {
    const idx = parseInt(card.dataset.index || '0')
    const offset = idx - currentVideoIndex.value
    const absOffset = Math.abs(offset)
    
    const baseX = offset * (isMobile ? 140 : 250)
    const baseZ = absOffset * (isMobile ? -50 : -85)
    const baseYRot = offset * (isMobile ? -12 : -18)
    const baseZRot = offset * -1.5
    const baseScale = 1 - (absOffset * 0.08)
    const baseOpacity = absOffset > 2 ? 0 : 1 - (absOffset * 0.35)
    
    gsap.to(card, {
      x: baseX,
      z: baseZ,
      rotateY: baseYRot,
      rotateZ: baseZRot,
      scale: baseScale,
      opacity: baseOpacity,
      zIndex: 100 - absOffset,
      duration: smooth ? 0.75 : 0,
      ease: 'power4.out',
      overwrite: 'auto'
    })
  })
}

const nextVideo = () => {
  currentVideoIndex.value = (currentVideoIndex.value + 1) % totalItems()
  updateCarouselLayout()
}

const prevVideo = () => {
  currentVideoIndex.value = (currentVideoIndex.value - 1 + totalItems()) % totalItems()
  updateCarouselLayout()
}

const engageCarouselDepth = () => {
  if (window.innerWidth <= 768) return
  isHoveringCarousel = true
  if (!carouselTrack.value) return
  const cards = carouselTrack.value.querySelectorAll<HTMLElement>('.gallery-card-3d')
  gsap.to(carouselTrack.value, { perspective: 2000, duration: 0.6, ease: 'power3.out' })

  cards.forEach((card) => {
    const idx = parseInt(card.dataset.index || '0')
    const offset = idx - currentVideoIndex.value
    const absOffset = Math.abs(offset)
    
    if (offset !== 0) {
      gsap.to(card, {
        x: offset * 290, 
        z: (absOffset * -110) - 20,
        rotateY: offset * -26,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto'
      })
    } else {
      gsap.to(card, { z: 60, scale: 1.05, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
    }
  })
}

const disengageCarouselDepth = () => {
  isHoveringCarousel = false
  if (!carouselTrack.value) return
  carouselMouse.targetX = 0
  carouselMouse.targetY = 0
  
  gsap.to(carouselTrack.value, {
    rotateY: 0,
    rotateX: 0,
    perspective: 1600,
    duration: 0.8,
    ease: 'power4.out'
  })
  updateCarouselLayout()
}

const scrollToStep = (stepIndex: number) => {
  const triggerInstance = ScrollTrigger.getById('ecoMasterTrigger')
  if (!triggerInstance) return

  const progressTarget = navigationSteps[stepIndex].progress
  const scrollPosition = triggerInstance.start + (progressTarget * (triggerInstance.end - triggerInstance.start))

  window.scrollTo({
    top: scrollPosition,
    behavior: 'smooth'
  })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  await nextTick()
  updateCarouselLayout(false)
  renderLoop()

  const ctx = gsap.context(() => {
    if (!scrollTriggerContainer.value || !decorSubstrate.value) return

    const ambientItems = decorSubstrate.value.querySelectorAll('.decor-item')
    ambientItems.forEach((item, index) => {
      gsap.to(item, {
        yPercent: '+=12',
        xPercent: index % 2 === 0 ? '+=5' : '-=5',
        rotation: index % 2 === 0 ? '+=8' : '-=8',
        duration: 6 + (index * 0.7),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        id: 'ecoMasterTrigger',
        trigger: scrollTriggerContainer.value,
        start: 'top top',
        end: '+=1100%', // Reduzido cirurgicamente para fechar o espaço em branco final
        pin: true,
        scrub: 1.5, 
        anticipatePin: 1,
        onUpdate: (self) => {
          const currentProg = self.progress
          isLogoClickable.value = currentProg > 0.10

          if (currentProg < 0.12) activeStep.value = 0
          else if (currentProg < 0.26) activeStep.value = 1
          else if (currentProg < 0.42) activeStep.value = 2
          else if (currentProg < 0.58) activeStep.value = 3
          else if (currentProg < 0.74) activeStep.value = 4
          else activeStep.value = 5
        }
      }
    })

    gsap.set('.story-flow-wrapper', {
      opacity: 0,
      y: 60,
      scale: 0.98,
      pointerEvents: 'none'
    })

    const isMobile = window.innerWidth <= 768

    masterTimeline.fromTo('.title-ecowave',
      { scale: isMobile ? 1.6 : 2.5, y: isMobile ? '4vh' : '8vh', opacity: 0.15 },
      { scale: isMobile ? 0.45 : 0.38, y: isMobile ? '-45.5vh' : '-44.5vh', opacity: 1, duration: 2, ease: 'power4.inOut' },
      0
    )

    ambientItems.forEach((item) => {
      const speedAttr = parseFloat((item as HTMLElement).dataset.speed || '30')
      masterTimeline.to(item, { y: -speedAttr * 24, ease: 'none' }, 0)
    })

    // Sequenciamento milimétrico do fluxo vertical para impedir seções vazias
    masterTimeline.to('.step-story-1', { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.4 }, 0.5)
    masterTimeline.to('.step-story-1', { opacity: 0, y: -60, scale: 0.98, pointerEvents: 'none', duration: 1.2 }, 1.8)

    masterTimeline.to('.step-story-2', { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.4 }, 2.1)
    masterTimeline.to('.step-story-2', { opacity: 0, y: -60, scale: 0.98, pointerEvents: 'none', duration: 1.2 }, 3.4)

    masterTimeline.to('.step-about-us', { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.4 }, 3.7)
    masterTimeline.to('.step-about-us', { opacity: 0, y: -60, scale: 0.98, pointerEvents: 'none', duration: 1.2 }, 5.0)

    masterTimeline.to('.step-vision', { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.4 }, 5.3)
    masterTimeline.to('.step-vision', { opacity: 0, y: -60, scale: 0.98, pointerEvents: 'none', duration: 1.2 }, 6.6)

    masterTimeline.to('.step-history', { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.4 }, 6.9)
    masterTimeline.to('.step-history', { opacity: 0, y: -60, scale: 0.98, pointerEvents: 'none', duration: 1.2 }, 8.2)

    masterTimeline.to('.layer-fg', { opacity: 0.02, scale: 0.8, duration: 1 }, 8.2)
    masterTimeline.to('.layer-mg', { opacity: 0.05, duration: 1 }, 8.2)
    
    // Entrada da galeria
    masterTimeline.to('.step-carousel-gallery', { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.6 }, 8.5)
    // Fechamento instantâneo acoplado ao grid final eliminando qualquer resquício de background vazio
    masterTimeline.to('.step-carousel-gallery', { opacity: 0, y: -50, scale: 0.95, pointerEvents: 'none', duration: 1.2 }, 9.8)

    masterTimeline.to('.layer-mg', { opacity: 0.8, duration: 0.6 }, 9.8)
    masterTimeline.to('.layer-fg', { opacity: 0.7, scale: 1, duration: 0.6 }, 9.8)
    masterTimeline.to('.title-ecowave', { opacity: 0, y: '-52vh', duration: 0.6 }, 9.6)

    // Transição imediata para o bloco informático final
    masterTimeline.fromTo('.about-card', 
      { y: 60, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 1.2, ease: 'power4.out', pointerEvents: 'auto' },
      10.0
    )

    gsap.set(backToTopBtn.value, { opacity: 0, y: 30, scale: 0.8, pointerEvents: 'none' })
    ScrollTrigger.create({
      trigger: scrollTriggerContainer.value,
      start: 'top+=500 top',
      onEnter: () => gsap.to(backToTopBtn.value, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 0.4, ease: 'back.out(1.5)' }),
      onLeaveBack: () => gsap.to(backToTopBtn.value, { opacity: 0, y: 30, scale: 0.8, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' })
    })
  }, mainContainer.value)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');

:deep(.main-header),
:deep(header),
:deep(.logo-wrapper),
:deep(.logo-text) {
  background: transparent !important;
  background-color: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: none !important;
  border: none !important;
  text-decoration: none !important;
  border-bottom: none !important;
  z-index: 10002 !important;
}

.side-timeline-nav {
  position: fixed;
  right: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  z-index: 1000;
}

.nav-dot-wrapper {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  padding: 6px;
  position: relative;
  outline: none;
}

.dot-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #111;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  margin-right: 1rem;
  pointer-events: none;
}

.dot-core {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.12);
  transition: background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-dot-wrapper:hover .dot-label,
.nav-dot-wrapper.is-active .dot-label {
  opacity: 1;
  transform: translateX(0);
}
.nav-dot-wrapper:hover .dot-core {
  background: #111;
  transform: scale(1.4);
}
.nav-dot-wrapper.is-active .dot-core {
  background: #111;
  transform: scale(1.8);
}

.page-wrapper {
  background: #fcfcfc; 
  color: #111; 
  overflow-x: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.unified-immersive-container {
  position: relative;
  width: 100%;
}

.sticky-viewport {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fcfcfc;
}

.mega-title-wrapper {
  position: absolute;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1001 !important;
}

.mega-title {
  position: absolute;
  margin: 0;
  color: #111;
  text-transform: uppercase;
  font-family: 'Bebas Neue', Impact, sans-serif;
  letter-spacing: -0.01em;
  will-change: transform, opacity;
  user-select: none;
  font-size: clamp(3.5rem, 14vw, 11rem);
  white-space: nowrap;
}

.title-ecowave {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), letter-spacing 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.title-ecowave.is-clickable {
  pointer-events: auto !important;
  cursor: pointer !important;
}
.title-ecowave.is-clickable:hover {
  opacity: 0.6 !important;
  letter-spacing: 0.03em;
}

.dynamic-content-stage {
  position: relative;
  width: 100%;
  max-width: 1300px;
  height: 100%;
  padding: 0 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.story-flow-wrapper {
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
}

.kinetic-text-mask {
  overflow: hidden;
  padding: 10px 0;
}

.premium-text-display {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.2rem, 5.2vw, 4.8rem);
  line-height: 0.95;
  letter-spacing: 0.01em;
  text-align: center;
  margin: 0;
  max-width: 1000px;
}

.editorial-block-layout {
  max-width: 780px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
  padding: 3.5rem;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.01),
    0 20px 50px rgba(0, 0, 0, 0.015),
    0 40px 90px rgba(0, 0, 0, 0.02);
}

.platform-manifesto {
  max-width: 820px;
}
.legacy-indent {
  margin-bottom: 1.5rem !important;
}
.brand-pillars-minimal {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  text-align: left;
}
.pillar-bullet {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #4a4a4a;
}
.pillar-bullet strong {
  color: #000;
  font-weight: 700;
}

.editorial-tag {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #8a8a8a;
  margin-bottom: 1rem;
}

.editorial-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.5rem, 4.8vw, 4.2rem);
  margin: 0 0 1.25rem 0;
  letter-spacing: 0.01em;
}

.editorial-body {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #3d3d3d;
  margin: 0;
  font-weight: 400;
  text-align: justify;
}
.editorial-body strong {
  font-weight: 700;
  color: #000;
}

.gallery-layout-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.gallery-subtitle {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  letter-spacing: 0.05em;
  margin: 0;
  color: #222;
}

.video-gallery {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
}

.gallery-track-3d {
  position: relative;
  width: 100%;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  perspective: 1600px;
}

.gallery-card-3d {
  position: absolute;
  width: 250px; 
  height: 370px;
  will-change: transform, opacity;
  transform-style: preserve-3d;
}

.premium-video-box {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  background: #000; 
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.025);
  transform: translateZ(0);
}

.gallery-card-3d.is-active .premium-video-box {
  box-shadow: 0 35px 80px rgba(0, 0, 0, 0.18);
}

/* Máscara de escurecimento e desfoque para vídeos inativos */
.video-dark-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 1;
  transition: background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.6s;
  pointer-events: none;
}
/* Remove o escurecimento apenas no vídeo central focado */
.video-dark-overlay.is-clear {
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
}

.glow-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 65%);
  z-index: 2;
  pointer-events: none;
}

.gallery-video-element,
.carousel-static-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background-color: #000;
}

.video-tag {
  position: absolute;
  top: 18px;
  left: 18px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  border: 1px solid rgba(0, 0, 0, 0.03);
  z-index: 3;
}

.video-meta {
  position: absolute;
  bottom: 18px;
  left: 18px;
  right: 18px;
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.01em;
  z-index: 3;
  background: rgba(255, 255, 255, 0.75);
  padding: 6px 12px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
}

.center-action-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  background: #111;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s;
  z-index: 4;
}
.center-action-btn:hover {
  transform: translate(-50%, -50%) scale(1.1);
  background: #222;
}

.gallery-nav {
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  color: #111;
  border-radius: 50%;
  width: 56px; 
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 200;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.03);
}
.gallery-nav.prev { left: 1%; }
.gallery-nav.next { right: 1%; }
.gallery-nav:hover {
  background: #111;
  color: #fff;
  border-color: #111;
  transform: scale(1.08);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  width: 100%;
  margin-top: 22vh;
}

.about-card {
  position: relative;
  background: #fff;
  padding: 4.5rem 2.5rem;
  border-radius: 28px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.01);
  transition:
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.5s ease,
    box-shadow 0.6s ease;
  transform: translateZ(0);
}

.about-card:hover {
  transform: translateY(-10px) scale(1.01);
  border-color: rgba(0,0,0,0.85);
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.04);
}

.card-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #111;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.about-card:hover .card-accent-line {
  transform: scaleX(1);
}

.about-card h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.4rem;
  margin: 0 0 1.2rem 0;
  letter-spacing: 0.02em;
}

.about-card p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #4a4a4a;
  margin: 0;
}

.back-to-top {
  position: fixed;
  bottom: 2.5rem;
  right: 6.5rem; 
  z-index: 999;
  background: #111;
  color: #fff;
  border: none;
  padding: 0.95rem 1.8rem; 
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1rem;
  letter-spacing: 0.15em;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  border-radius: 999px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  will-change: transform, opacity;
  transition: background-color 0.3s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.back-to-top:hover {
  background: #252525;
  transform: translateY(-2px);
}

.cta-premium-btn {
  background: #111;
  color: #fff;
  border: none;
  padding: 1.25rem 3.2rem;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  border-radius: 999px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.04);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.cta-premium-btn:hover {
  background: #222;
  transform: translateY(-4px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.15);
}
.btn-arrow {
  transition: transform 0.4s ease;
  display: flex;
  align-items: center;
}
.cta-premium-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.hero-bg-grid {
  position: absolute;
  inset: 2.5rem;
  border-radius: 32px;
  border: 1px solid rgba(0, 0, 0, 0.025);
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.015) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.015) 1px, transparent 1px);
  background-size: 64px 64px;
  pointer-events: none;
  mask-image: radial-gradient(circle at center, black 45%, transparent 90%);
  -webkit-mask-image: radial-gradient(circle at center, black 45%, transparent 90%);
}

.hero-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  transform-style: preserve-3d;
}
.decor-item {
  position: absolute;
  transform: translateZ(0);
  will-change: transform;
}

/* ==========================================================================
   SISTEMA DE RESPONSIVIDADE ADAPTATIVA
   ========================================================================== */

@media (max-width: 1400px) {
  .dynamic-content-stage { max-width: 1100px; }
  .about-grid { gap: 1.5rem; }
}

@media (max-width: 1150px) {
  .side-timeline-nav { right: 1.5rem; }
  .back-to-top { right: 5rem; }
}

@media (max-width: 1024px) {
  .editorial-block-layout {
    max-width: 85%;
    padding: 3rem 2.5rem;
  }
  .gallery-track-3d { height: 380px; }
  .gallery-card-3d {
    width: 220px;
    height: 325px;
  }
  .hero-bg-grid { inset: 1.5rem; border-radius: 24px; }
}

@media (max-width: 850px) {
  .about-grid { gap: 1rem; grid-template-columns: repeat(3, 1fr); }
  .about-card { padding: 3.5rem 1.5rem; }
  .about-card h3 { font-size: 1.9rem; }
}

@media (max-width: 768px) {
  .side-timeline-nav { display: none; }
  .mega-title { font-size: clamp(3rem, 15vw, 6.5rem); }

  .about-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 10vh;
    max-height: 58vh;
    overflow-y: auto;
    padding-right: 6px;
  }
  
  .about-card { padding: 2.5rem 2rem; }

  .editorial-block-layout {
    padding: 2.2rem 1.8rem;
    max-width: 95%;
    border-radius: 24px;
  }
  .brand-pillars-minimal { text-align: center; }

  .gallery-track-3d { height: 320px; }
  .gallery-card-3d {
    width: 170px;
    height: 250px;
  }

  .gallery-nav {
    width: 48px;
    height: 48px;
  }
  .gallery-nav.prev { left: -10px; }
  .gallery-nav.next { right: -10px; }

  .back-to-top {
    right: 2rem;
    bottom: 2rem;
    padding: 0.8rem 1.4rem;
  }

  .dynamic-content-stage { padding: 0 4%; }
}

@media (max-width: 480px) {
  .hero-bg-grid { inset: 1rem; border-radius: 16px; }
  
  .premium-text-display {
    font-size: 1.9rem;
    line-height: 1.1;
  }

  .editorial-title { font-size: 2.2rem; margin-bottom: 1rem; }
  .editorial-body {
    font-size: 0.95rem;
    line-height: 1.65;
    text-align: left;
  }

  .gallery-subtitle { font-size: 1.35rem; text-align: center; }
  
  .gallery-track-3d { height: 260px; }
  .gallery-card-3d {
    width: 130px;
    height: 195px;
  }
  
  .video-tag { top: 10px; left: 10px; padding: 4px 10px; }
  .video-meta { bottom: 10px; left: 10px; right: 10px; font-size: 0.6rem; padding: 4px 8px; }
  .center-action-btn { width: 42px; height: 42px; }
  .gallery-nav { width: 40px; height: 40px; }

  .cta-premium-btn {
    padding: 1.1rem 2rem;
    font-size: 0.8rem;
    width: 100%;
    justify-content: center;
  }
}
</style>