<template>
  <div class="page-wrapper" ref="mainContainer">
    <Header />

    <!-- Navegação lateral (desktop) -->
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
      @mousemove="handleGlobalMouseMove"
    >
      <div class="sticky-viewport">
        <div class="hero-bg-grid"></div>

        <!-- Logo / Mega title -->
        <div class="mega-title-wrapper">
          <h1 
            class="mega-title title-ecowave" 
            :class="{ 'is-clickable': isLogoClickable }"
            @click="handleLogoClick"
            role="banner"
          >
            ECOWAVE
          </h1>
          <!-- <h1 class="mega-title title-about" style="opacity: 0;">SOBRE NÓS</h1> -->
        </div>

        <!-- Decorações parallax -->
        <div class="hero-decor" ref="decorSubstrate">
          <div class="decor-item layer-bg" data-v-speed="100" style="left: 6%; top: 18%; width: 65px;">
            <img src="../../assets/img/elementos/papel.png" alt="Papel" style="opacity: 0.25; width: 100%;" />
          </div>
          <div class="decor-item layer-bg" data-v-speed="150" style="right: 10%; top: 50%; width: 90px;">
            <img src="../../assets/img/elementos/papelao.png" alt="Papelão" style="opacity: 0.2; width: 100%;" />
          </div>

          <div class="decor-item layer-mg" data-v-speed="220" style="right: 5%; top: 10%; width: 100px;">
            <img src="../../assets/img/elementos/saquinho.png" alt="Saquinho Ziplock" style="width: 100%;" />
          </div>
          <div class="decor-item layer-mg" data-v-speed="260" style="right: 24%; top: 22%; width: 85px;">
            <img src="../../assets/img/elementos/garrafa-azul.png" alt="Garrafa Azul" style="width: 100%;" />
          </div>
          <div class="decor-item layer-mg" data-v-speed="190" style="left: 4%; top: 32%; width: 110px;">
            <img src="../../assets/img/elementos/sacola.png" alt="Sacola" style="width: 100%;" />
          </div>
          <div class="decor-item layer-mg" data-v-speed="240" style="right: 14%; bottom: 18%; width: 90px;">
            <img src="../../assets/img/elementos/escova.png" alt="Escova" style="width: 100%;" />
          </div>

          <div class="decor-item layer-fg" data-v-speed="380" style="left: -3%; bottom: 5%; width: 170px;">
            <img src="../../assets/img/elementos/lata.png" alt="Lata" style="filter: blur(6px); opacity: 0.85; width: 100%;" />
          </div>
          <div class="decor-item layer-fg" data-v-speed="350" style="right: -5%; bottom: -4%; width: 220px;">
            <img src="../../assets/img/elementos/papelao.png" alt="Caixa" style="filter: blur(5px); opacity: 0.85; width: 100%;" />
          </div>
        </div>

        <!-- Conteúdo dinâmico -->
        <div class="dynamic-content-stage">
          <!-- Story 01 -->
          <div class="story-flow-wrapper step-story-1">
            <div class="kinetic-text-mask">
              <h2 class="premium-text-display">
                SISTEMA DE RECOMPENSAS EM RECICLAGEM, COM RESULTADOS NO MESMO DIA
              </h2>
            </div>
          </div>

          <!-- Story 02 -->
          <div class="story-flow-wrapper step-story-2">
            <div class="kinetic-text-mask">
              <h2 class="premium-text-display">
                IDENTIFICAÇÃO INTELIGENTE COM IA PARA MATERIAIS RECICLÁVEIS
              </h2>
            </div>
          </div>

          <!-- Visão -->
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

          <!-- História -->
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

          <!-- Galeria / Carrossel 3D -->
          <div class="story-flow-wrapper step-carousel-gallery">
            <div class="gallery-layout-container">
              <p class="gallery-subtitle">UM FUTURO MAIS LIMPO COMEÇA AGORA</p>

              <div
                class="video-gallery" 
                @mouseenter="engageCarouselDepth"
                @mousemove="handleCarouselDynamicTrack" 
                @mouseleave="disengageCarouselDepth"
              >
                <button class="gallery-nav prev" @click="prevVideo" aria-label="Anterior">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
                
                <div class="gallery-track-3d" ref="carouselTrack">
                  <div
                    v-for="(video, index) in videos"
                    :key="video.id"
                    class="gallery-card-3d"
                    :class="{ 'is-active': index === currentVideoIndex }"
                    :data-index="index"
                  >
                    <div class="premium-video-box">
                      <video :src="video.src" autoplay loop muted playsinline></video>
                      <div class="video-tag">{{ video.tag }}</div>
                      <div class="video-meta">
                        <span>{{ video.label }}</span>
                        <span>{{ video.duration }}</span>
                      </div>
                      <div class="center-action-btn" v-if="index === currentVideoIndex">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <button class="gallery-nav next" @click="nextVideo" aria-label="Próximo">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              <div class="cta-container">
                <button class="cta-premium-btn">
                  <span>Começar agora na plataforma</span>
                  <span class="btn-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- About grid -->
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

    <!-- Back to top -->
    <button
      class="back-to-top"
      ref="backToTopBtn"
      @click="scrollToTop"
      aria-label="Voltar ao topo"
    >
      <span class="arrow-up">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
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

const navigationSteps = [
  { label: 'Início',    progress: 0.05 },
  { label: 'Inovação',  progress: 0.23 },
  { label: 'Visão',     progress: 0.41 },
  { label: 'História',  progress: 0.59 },
  { label: 'Galeria',   progress: 0.77 }
]

const videos = ref([
  { id: 1, src: '../../assets/img/elementos/papelao.png', tag: 'CREATIVE // LAB',    label: 'ECO MATRIX 01',  duration: '0:12' },
  { id: 2, src: '../../assets/img/elementos/papelao.png', tag: 'DYNAMICS // HD',     label: 'STREAM WAVE',   duration: '0:24' },
  { id: 3, src: '../../assets/img/elementos/papelao.png', tag: 'AI // COGNITIVE',    label: 'NEURAL SYSTEM', duration: '0:08' },
  { id: 4, src: '../../assets/img/elementos/papelao.png', tag: 'ECO // APPS',        label: 'RECLAIM TRACK', duration: '0:30' },
  { id: 5, src: '../../assets/img/elementos/papelao.png', tag: 'FUTURE // STUDIO',   label: 'PURE CANVAS',   duration: '0:15' }
])

const totalVideos = () => videos.value.length

// Logo redireciona apenas quando comprimida/topo
const handleLogoClick = () => {
  if (isLogoClickable.value) {
    router.push('/')
  }
}

const updateCarouselLayout = (smooth = true) => {
  if (!carouselTrack.value) return
  const cards = carouselTrack.value.querySelectorAll<HTMLElement>('.gallery-card-3d')
  
  cards.forEach((card) => {
    const idx = parseInt(card.dataset.index || '0')
    const offset = idx - currentVideoIndex.value
    const absOffset = Math.abs(offset)
    
    const baseX = offset * 220
    const baseZ = absOffset * -60
    const baseYRot = offset * -16
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
      duration: smooth ? 0.65 : 0,
      ease: 'power4.out',
      overwrite: 'auto'
    })
  })
}

const nextVideo = () => {
  currentVideoIndex.value = (currentVideoIndex.value + 1) % totalVideos()
  updateCarouselLayout()
}

const prevVideo = () => {
  currentVideoIndex.value = (currentVideoIndex.value - 1 + totalVideos()) % totalVideos()
  updateCarouselLayout()
}

const engageCarouselDepth = () => {
  if (!carouselTrack.value) return
  const cards = carouselTrack.value.querySelectorAll<HTMLElement>('.gallery-card-3d')
  gsap.to(carouselTrack.value, { perspective: 2200, duration: 0.5, ease: 'power3.out' })

  cards.forEach((card) => {
    const idx = parseInt(card.dataset.index || '0')
    const offset = idx - currentVideoIndex.value
    const absOffset = Math.abs(offset)
    
    if (offset !== 0) {
      gsap.to(card, {
        x: offset * 260, 
        z: (absOffset * -90) - 30,
        rotateY: offset * -24,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto'
      })
    } else {
      gsap.to(card, { z: 40, scale: 1.04, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    }
  })
}

const handleCarouselDynamicTrack = (event: MouseEvent) => {
  if (!carouselTrack.value) return
  const track = carouselTrack.value
  const rect = track.getBoundingClientRect()
  const normX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
  const normY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)

  gsap.to(track, {
    rotateY: normX * 6,
    rotateX: -normY * 5,
    duration: 0.4,
    ease: 'power2.out',
    overwrite: 'auto'
  })
}

const disengageCarouselDepth = () => {
  if (!carouselTrack.value) return
  gsap.to(carouselTrack.value, {
    rotateY: 0,
    rotateX: 0,
    perspective: 1600,
    duration: 0.6,
    ease: 'power4.out'
  })
  updateCarouselLayout()
}

const handleGlobalMouseMove = (event: MouseEvent) => {
  if (!decorSubstrate.value) return
  const { clientX, clientY } = event
  const { innerWidth, innerHeight } = window

  const normX = (clientX / innerWidth) - 0.5
  const normY = (clientY / innerHeight) - 0.5

  const items = decorSubstrate.value.querySelectorAll('.decor-item')
  items.forEach((item, index) => {
    const img = item.querySelector('img')
    if (!img) return

    const movementForce = (index % 3 + 1) * 22
    const rotationForce = index % 2 === 0 ? 8 : -8

    gsap.to(img, {
      x: normX * movementForce,
      y: normY * movementForce,
      rotate: normX * rotationForce,
      duration: 1.2,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  })
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

  const ctx = gsap.context(() => {
    if (!scrollTriggerContainer.value || !decorSubstrate.value) return

    const ambientItems = decorSubstrate.value.querySelectorAll('.decor-item')
    ambientItems.forEach((item, index) => {
      gsap.to(item, {
        yPercent: '+=10',
        xPercent: index % 2 === 0 ? '+=4' : '-=4',
        rotation: index % 2 === 0 ? '+=6' : '-=6',
        duration: 5 + (index * 0.5),
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
        end: '+=1100%', 
        pin: true,
        scrub: 2.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const currentProg = self.progress

          // Logo clicável ao subir / comprimir
          isLogoClickable.value = currentProg > 0.12

          if (currentProg < 0.15) activeStep.value = 0
          else if (currentProg < 0.33) activeStep.value = 1
          else if (currentProg < 0.51) activeStep.value = 2
          else if (currentProg < 0.68) activeStep.value = 3
          else if (currentProg < 0.88) activeStep.value = 4
          else activeStep.value = 5
        }
      }
    })

    gsap.set('.story-flow-wrapper', {
      opacity: 0,
      y: 100,
      scale: 0.97,
      pointerEvents: 'none'
    })

    // Logo ECOWAVE – animação principal
    masterTimeline.fromTo('.title-ecowave',
      { scale: 2.5, y: '8vh', opacity: 0.15 },
      { scale: 0.38, y: '-44.5vh', opacity: 1, duration: 2, ease: 'power4.inOut' },
      0
    )

    ambientItems.forEach((item) => {
      const vSpeed = parseFloat((item as HTMLElement).dataset.vSpeed || '200')
      masterTimeline.to(item, { y: -vSpeed * 4.5, ease: 'none' }, 0)
    })

    masterTimeline.to('.step-story-1', {
      opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.4
    }, 0.5)
    masterTimeline.to('.step-story-1', {
      opacity: 0, y: -90, scale: 0.96, pointerEvents: 'none', duration: 1.2
    }, 2.0)

    masterTimeline.to('.step-story-2', {
      opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.4
    }, 2.3)
    masterTimeline.to('.step-story-2', {
      opacity: 0, y: -90, scale: 0.96, pointerEvents: 'none', duration: 1.2
    }, 3.8)

    masterTimeline.to('.step-vision', {
      opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.4
    }, 4.1)
    masterTimeline.to('.step-vision', {
      opacity: 0, y: -90, scale: 0.96, pointerEvents: 'none', duration: 1.2
    }, 5.6)

    masterTimeline.to('.step-history', {
      opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.4
    }, 5.9)
    masterTimeline.to('.step-history', {
      opacity: 0, y: -90, scale: 0.96, pointerEvents: 'none', duration: 1.2
    }, 7.4)

    masterTimeline.to('.layer-fg', { opacity: 0, scale: 0.8, duration: 1 }, 7.4)
    masterTimeline.to('.layer-mg', { opacity: 0.08, duration: 1 }, 7.4)
    
    masterTimeline.to('.step-carousel-gallery', {
      opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 1.6
    }, 7.7)
    masterTimeline.to('.step-carousel-gallery', {
      opacity: 0, y: -80, scale: 0.95, pointerEvents: 'none', duration: 1.2
    }, 9.3)

    masterTimeline.to('.layer-mg', { opacity: 1, duration: 1 }, 9.3)
    masterTimeline.to('.layer-fg', { opacity: 0.85, scale: 1, duration: 1 }, 9.3)

    masterTimeline.to('.title-ecowave', {
      opacity: 0, y: '-50vh', duration: 1.2
    }, 9.0)
    masterTimeline.to('.title-about', {
      opacity: 1, y: '-40vh', scale: 1, duration: 1.4
    }, 9.3)

    masterTimeline.fromTo('.about-card', 
      { y: 80, opacity: 0, scale: 0.93 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 1.8, ease: 'power4.out', pointerEvents: 'auto' },
      9.6
    )

    // Back to top
    gsap.set(backToTopBtn.value, {
      opacity: 0, y: 35, scale: 0.8, pointerEvents: 'none'
    })
    ScrollTrigger.create({
      trigger: scrollTriggerContainer.value,
      start: 'top+=600 top',
      onEnter: () =>
        gsap.to(backToTopBtn.value, {
          opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 0.5, ease: 'back.out(1.4)'
        }),
      onLeaveBack: () =>
        gsap.to(backToTopBtn.value, {
          opacity: 0, y: 35, scale: 0.8, pointerEvents: 'none', duration: 0.4, ease: 'power2.in'
        })
    })
  }, mainContainer.value)
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');

/* Header transparente */
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
  z-index: 10 !important;
}

:deep(.main-header:hover),
:deep(header:hover) {
  background: transparent !important;
}

/* Timeline lateral (desktop) */
.side-timeline-nav {
  position: fixed;
  right: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 1000;
}

.nav-dot-wrapper {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  padding: 4px;
  position: relative;
  outline: none;
}

.dot-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #111;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.35rem cubic-bezier(0.16, 1, 0.3, 1);
  margin-right: 1rem;
  pointer-events: none;
}

.dot-core {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-dot-wrapper:hover .dot-label {
  opacity: 0.8;
  transform: translateX(0);
}
.nav-dot-wrapper:hover .dot-core,
.nav-dot-wrapper.is-active .dot-core {
  background: #111;
  transform: scale(1.6);
}
.nav-dot-wrapper.is-active .dot-label {
  opacity: 1;
  transform: translateX(0);
}

/* Página */
.page-wrapper {
  background: #fcfcfc; 
  color: #111111; 
  overflow-x: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

/* Logo / mega title */
.mega-title-wrapper {
  position: absolute;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10001 !important;
}

.mega-title {
  position: absolute;
  margin: 0;
  color: #111111;
  text-transform: uppercase;
  font-family: 'Bebas Neue', Impact, sans-serif;
  letter-spacing: -0.01em;
  will-change: transform, opacity;
  transform: translateZ(0);
  border-bottom: none !important;
  text-decoration: none !important;
  user-select: none;
  font-size: clamp(3rem, 15vw, 11rem);
  white-space: nowrap;
}

.title-ecowave {
  pointer-events: none;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1), letter-spacing 0.4s ease;
}

.title-ecowave.is-clickable {
  pointer-events: auto !important;
  cursor: pointer !important;
}

.title-ecowave.is-clickable:hover {
  opacity: 0.7 !important;
  letter-spacing: 0.04em;
}

/* Conteúdo dinâmico */
.dynamic-content-stage {
  position: relative;
  width: 100%;
  max-width: 1250px;
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
  transform: translateZ(0);
}

.kinetic-text-mask {
  overflow: hidden;
  padding: 10px 0;
}

.premium-text-display {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.2rem, 5.5vw, 4.8rem);
  line-height: 0.95;
  letter-spacing: 0.01em;
  text-align: center;
  margin: 0;
  max-width: 950px;
}

/* Editorial boxes */
.editorial-block-layout {
  max-width: 760px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 3rem;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.02);
}

.editorial-tag {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #888;
  margin-bottom: 0.8rem;
}

.editorial-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4.2rem);
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.01em;
}

.editorial-body {
  font-size: 1.05rem;
  line-height: 1.75;
  color: #444;
  margin: 0;
  font-weight: 400;
  text-align: justify;
}
.editorial-body strong {
  font-weight: 600;
  color: #000;
}

/* Galeria / carrossel */
.gallery-layout-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  width: 100%;
  margin-top: 4vh;
}
.gallery-subtitle {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.9rem;
  letter-spacing: 0.04em;
  margin: 0;
  color: #333;
}
.video-gallery {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-track-3d {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  perspective: 1600px;
  transition: perspective 0.5s ease;
}

.gallery-card-3d {
  position: absolute;
  width: 230px;
  height: 345px;
  will-change: transform, opacity;
  transform-style: preserve-3d;
}

.premium-video-box {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.4s ease;
}
.gallery-card-3d.is-active .premium-video-box {
  box-shadow: 0 35px 80px rgba(0, 0, 0, 0.1);
}
.premium-video-box video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.video-meta {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.01em;
}

.center-action-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  background: #111;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.center-action-btn:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.gallery-nav {
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  color: #111;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 200;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
}
.gallery-nav.prev { left: 1%; }
.gallery-nav.next { right: 1%; }
.gallery-nav:hover {
  background: #111;
  color: #fff;
  border-color: #111;
  transform: scale(1.05);
}

/* About grid */
.about-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  width: 100%;
  margin-top: 25vh;
}
.about-card {
  position: relative;
  background: #fff;
  padding: 4rem 2.5rem;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.015);
  transition:
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.4s ease,
    box-shadow 0.5s ease;
}
.about-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: #111;
  box-shadow: 0 45px 80px rgba(0, 0, 0, 0.06);
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
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.about-card:hover .card-accent-line {
  transform: scaleX(1);
}
.about-card h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.3rem;
  margin: 0 0 1.2rem 0;
  letter-spacing: 0.01em;
}
.about-card p {
  font-size: 0.95rem;
  line-height: 1.65;
  color: #555;
  margin: 0;
}

/* Back to top */
.back-to-top {
  position: fixed;
  bottom: 2.5rem;
  right: 6.5rem; 
  z-index: 999;
  background: #111;
  color: #fff;
  border: none;
  padding: 0.8rem 1.5rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 0.95rem;
  letter-spacing: 0.12em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 999px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  will-change: transform, opacity;
  transition: background 0.3s, transform 0.2s;
}
.back-to-top:hover {
  background: #333;
  transform: scale(1.02);
}

/* CTA */
.cta-premium-btn {
  background: #111;
  color: #fff;
  border: none;
  padding: 1.2rem 2.8rem;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  border-radius: 999px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.06);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.cta-premium-btn:hover {
  background: #222;
  transform: translateY(-3px);
  box-shadow: 0 22px 45px rgba(0,0,0,0.15);
}

/* Background grid */
.hero-bg-grid {
  position: absolute;
  inset: 2.5rem;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
  background-size: 64px 64px;
  pointer-events: none;
  mask-image: radial-gradient(circle at center, black 50%, transparent 95%);
  -webkit-mask-image: radial-gradient(circle at center, black 50%, transparent 95%);
}

/* Decor */
.hero-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}
.decor-item {
  position: absolute;
  transform: translateZ(0);
  will-change: transform;
}
.decor-item img {
  display: block;
  will-change: transform;
  transition: transform 0.2s ease-out;
}

/* ===== Responsividade ===== */

@media (max-width: 1024px) {
  .editorial-block-layout {
    max-width: 90%;
    padding: 2.5rem 2rem;
  }
  .gallery-track-3d {
    height: 360px;
  }
  .gallery-card-3d {
    width: 200px;
    height: 300px;
  }
  .hero-bg-grid {
    inset: 1.5rem;
  }
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 15vh;
  }
  .about-card {
    padding: 3rem 2rem;
  }
  .editorial-block-layout {
    padding: 2rem 1.5rem;
  }
  .gallery-track-3d {
    height: 300px;
  }
  .gallery-card-3d {
    width: 160px;
    height: 240px;
  }

  .side-timeline-nav {
    display: none;
  }

  .back-to-top {
    right: 2.5rem;
    bottom: 1.8rem;
  }

  .dynamic-content-stage {
    padding: 0 6%;
  }
}

@media (max-width: 480px) {
  .premium-text-display {
    font-size: 1.8rem;
    padding: 0 10px;
  }
  .editorial-title {
    font-size: 2.2rem;
  }
  .editorial-body {
    font-size: 0.95rem;
    line-height: 1.6;
    text-align: left;
  }
  .gallery-subtitle {
    font-size: 1.4rem;
    text-align: center;
  }
  .gallery-track-3d {
    height: 260px;
  }
  .gallery-card-3d {
    width: 130px;
    height: 195px;
  }
  .gallery-nav {
    width: 38px;
    height: 38px;
  }
  .cta-premium-btn {
    padding: 1rem 1.8rem;
    font-size: 0.75rem;
    width: 100%;
    justify-content: center;
  }
  .hero-bg-grid {
    inset: 1rem;
    border-radius: 18px;
  }
}

/* Reforço de header transparente em qualquer tema */
:deep(.main-header),
:deep(header),
:deep(.logo-wrapper) {
  background: transparent !important;
  background-color: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: none !important;
  border: none !important;
  text-decoration: none !important;
  z-index: 10 !important;
}
:deep(.logo-text) {
  text-decoration: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
}
:deep(.main-header:hover),
:deep(header:hover) {
  background: transparent !important;
  background-color: transparent !important;
}
</style>