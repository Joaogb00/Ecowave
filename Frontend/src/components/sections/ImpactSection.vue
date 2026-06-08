<template>
  <section class="impact-section">
    
    <!-- Vídeo Background -->
    <video autoplay muted loop playsinline class="impact-video">
      <source src="https://cdn.coverr.co/videos/coverr-recycling-plastic-bottles-5043/1080p.mp4" type="video/mp4">
    </video>
    <div class="impact-overlay"></div>

    <div class="container">
      
      <div 
        class="impact-content"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 1000 } }"
      >
        <h2 class="impact-title">
          Cobertura de proteção<br>
          <span class="highlight">ambiental completa</span>
        </h2>
        
        <p class="impact-description">
          Abrangência total de ameaças ambientais através de reciclagem,<br>
          logística reversa e economia circular alinhada aos frameworks ODS.
        </p>

        <router-link to="/contato" class="impact-cta">
          Solicitar orientação especializada
        </router-link>
      </div>

    </div>
  </section>
</template>

<script>
export default {
  name: 'ImpactSection'
}
</script>

<style scoped>
.impact-section {
  position: relative;
  padding: 200px 0;
  overflow: hidden;
}

.impact-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.3);
}

.impact-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.container {
  position: relative;
  z-index: 10;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

.impact-content {
  text-align: center;
  color: #fff;
}

.impact-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  line-height: 1.2;
  margin-bottom: 30px;
}

.highlight {
  color: #00BFA5;
  font-weight: 700;
}

.impact-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin-bottom: 50px;
}

.impact-cta {
  display: inline-block;
  padding: 18px 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  transition: all 0.4s ease;
}

.impact-cta:hover {
  background: rgba(0, 191, 165, 0.2);
  border-color: #00BFA5;
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .impact-section {
    padding: 120px 0;
  }

  .impact-title {
    font-size: 2rem;
  }

  .impact-description {
    font-size: 1rem;
  }
}
</style>