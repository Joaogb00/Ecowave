<template>
  <section class="process-section">
    <div class="container">
      
      <div class="process-header">
        <h2 class="process-title">
          Cadeia logística controlada,<br>
          da produção à implantação em <span class="highlight">7 dias</span>
        </h2>
      </div>

      <!-- Timeline -->
      <div class="timeline">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="timeline-step"
          v-motion
          :initial="{ opacity: 0, x: -60 }"
          :visible-once="{ opacity: 1, x: 0, transition: { duration: 800, delay: index * 200 } }"
        >
          <div class="step-number">00{{ index + 1 }}</div>
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
export default {
  name: 'ProcessSection',
  data() {
    return {
      steps: [
        {
          title: 'D+0: Ativação do sistema',
          description: 'Containers inteligentes implantados discretamente em pontos estratégicos da cidade, sem necessidade de comboios especiais.'
        },
        {
          title: 'D+1 a D+3: Integração logística',
          description: 'Conexão com rotas de coleta existentes via transporte rodoviário convencional. Entrega discreta garantida em toda Europa.'
        },
        {
          title: 'D+3 a D+7: Operação completa',
          description: 'Ativação dos sistemas de IA, testes de rastreamento blockchain e validação de logística reversa. Equipe EcoWave dedicada, pegada mínima no local.'
        }
      ]
    }
  }
}
</script>

<style scoped>
.process-section {
  padding: 160px 0;
  background: linear-gradient(180deg, #000 0%, #001a0d 50%, #000 100%);
  color: #fff;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

.process-header {
  text-align: center;
  margin-bottom: 100px;
}

.process-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300;
  line-height: 1.3;
}

.highlight {
  color: #00BFA5;
  font-weight: 700;
}

.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.timeline-step {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 60px;
  align-items: start;
}

.step-number {
  font-size: 5rem;
  font-weight: 900;
  color: rgba(0, 191, 165, 0.15);
  font-family: monospace;
  line-height: 1;
}

.step-content {
  padding-top: 20px;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  letter-spacing: -0.5px;
}

.step-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.8;
}

@media (max-width: 768px) {
  .timeline-step {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .step-number {
    font-size: 3rem;
  }
}
</style>