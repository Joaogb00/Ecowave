<template>
  <section class="specs-section">
    <div class="container">
      
      <!-- Título -->
      <div 
        class="section-header"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      >
        <h2 class="section-title">
          Sistema UHPC de economia circular<br>
          com proteção <span class="accent">CBRN integrada</span>
        </h2>
        <p class="section-subtitle">
          Tecnologia de classificação por IA, rastreamento blockchain<br>
          e logística reversa em uma única plataforma.
        </p>
      </div>

      <!-- Grid de Specs -->
      <div class="specs-grid">
        <div 
          v-for="(spec, index) in specs" 
          :key="index"
          class="spec-card"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 100 } }"
        >
          <div class="spec-icon">{{ spec.icon }}</div>
          <h3 class="spec-title">{{ spec.title }}</h3>
          <p class="spec-description">{{ spec.description }}</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
export default {
  name: 'SpecsSection',
  data() {
    return {
      specs: [
        {
          icon: '♻️',
          title: '100+ anos de ciclo',
          description: 'Infraestrutura livre de manutenção com rastreamento perpétuo'
        },
        {
          icon: '🎯',
          title: 'Precisão IA qualificada',
          description: 'Performance de classificação validada independentemente'
        },
        {
          icon: '🔒',
          title: 'Blockchain hermético',
          description: 'Estrutura de dados avançada com certificação completa'
        },
        {
          icon: '⚡',
          title: 'Resistente a choques',
          description: 'Sistema robusto com impacto mínimo em operação'
        }
      ]
    }
  }
}
</script>

<style scoped>
.specs-section {
  padding: 160px 0;
  background: #000;
  color: #fff;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 100px;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 300;
  line-height: 1.2;
  margin-bottom: 30px;
}

.accent {
  color: #00BFA5;
  font-weight: 700;
}

.section-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.spec-card {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 40px 30px;
  transition: all 0.4s ease;
}

.spec-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 191, 165, 0.3);
  transform: translateY(-8px);
}

.spec-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.spec-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  letter-spacing: 0.5px;
}

.spec-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .specs-section {
    padding: 100px 0;
  }

  .section-header {
    margin-bottom: 60px;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }
}
</style>