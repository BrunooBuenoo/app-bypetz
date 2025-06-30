<template>
  <div class="sponsors-section">
    <div class="sponsors-container">
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando parceiros...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
      </div>

      <!-- Sponsors Display -->
      <div v-else-if="activeSponsors.length > 0" class="sponsors-wrapper">
        <div 
          class="sponsors-track" 
          :style="{ 
            animationDuration: `${animationDuration}s`
          }"
        >
          <!-- Primeira sequência -->
          <div class="sponsor-card" v-for="sponsor in activeSponsors" :key="`first-${sponsor.id}`">
            <div class="sponsor-logo">
              <img v-if="sponsor.logo" :src="sponsor.logo" :alt="sponsor.nome" />
              <span v-else class="sponsor-placeholder">{{ sponsor.nome }}</span>
            </div>
          </div>
          
          <!-- Segunda sequência (para loop infinito) -->
          <div class="sponsor-card" v-for="sponsor in activeSponsors" :key="`second-${sponsor.id}`">
            <div class="sponsor-logo">
              <img v-if="sponsor.logo" :src="sponsor.logo" :alt="sponsor.nome" />
              <span v-else class="sponsor-placeholder">{{ sponsor.nome }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Sponsors State -->
      <div v-else class="no-sponsors">
        <div class="no-sponsors-icon">🤝</div>
        <h3>Nenhum parceiro ativo no momento</h3>
        <p>Em breve teremos novos parceiros para apresentar!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'Patrocinadores',
  setup() {
    const sponsors = ref([])
    const loading = ref(true)
    const error = ref('')
    const animationDuration = ref(30)

    // Computed para filtrar apenas patrocinadores ativos
    const activeSponsors = computed(() => {
      return sponsors.value.filter(sponsor => sponsor.status === 'ativo')
    })

    // Calcular duração da animação baseada na quantidade de patrocinadores
    const calculateAnimationDuration = () => {
      const sponsorCount = activeSponsors.value.length
      if (sponsorCount === 0) return
      
      // Velocidade base: 3 segundos por patrocinador
      // Mínimo de 20s, máximo de 60s
      const baseDuration = sponsorCount * 3
      animationDuration.value = Math.max(20, Math.min(60, baseDuration))
    }

    // Observar mudanças nos patrocinadores ativos
    watch(activeSponsors, () => {
      calculateAnimationDuration()
    }, { immediate: true })

    // Função para buscar patrocinadores do Firebase
    const fetchSponsors = async () => {
      try {
        loading.value = true
        error.value = ''

        // Query para buscar patrocinadores ordenados por nome
        const sponsorsQuery = query(
          collection(db, 'patrocinadores'),
          orderBy('nome', 'asc')
        )

        const querySnapshot = await getDocs(sponsorsQuery)
        const fetchedSponsors = []

        querySnapshot.forEach((doc) => {
          const sponsorData = {
            id: doc.id,
            ...doc.data()
          }
          
          // Verificar se o patrocinador está dentro do período de validade
          const now = new Date()
          const dataInicio = sponsorData.dataInicio ? new Date(sponsorData.dataInicio) : null
          const dataFim = sponsorData.dataFim ? new Date(sponsorData.dataFim) : null

          // Incluir se:
          // 1. Status é ativo
          // 2. Não tem data de início OU data de início já passou
          // 3. Não tem data de fim OU data de fim ainda não chegou
          const isActive = sponsorData.status === 'ativo' &&
                          (!dataInicio || dataInicio <= now) &&
                          (!dataFim || dataFim >= now)

          if (isActive) {
            fetchedSponsors.push(sponsorData)
          }
        })

        sponsors.value = fetchedSponsors

        // Se não houver patrocinadores ativos, mostrar dados de exemplo
        if (fetchedSponsors.length === 0) {
          sponsors.value = [
            { id: 'demo1', nome: 'Dog Chow', logo: null, status: 'ativo' },
            { id: 'demo2', nome: 'Casa das Rações', logo: null, status: 'ativo' },
            { id: 'demo3', nome: 'Whiskas', logo: null, status: 'ativo' },
            { id: 'demo4', nome: 'Royal Canin', logo: null, status: 'ativo' },
            { id: 'demo5', nome: 'Pedigree', logo: null, status: 'ativo' },
            { id: 'demo6', nome: 'Purina', logo: null, status: 'ativo' },
            { id: 'demo7', nome: 'Hills', logo: null, status: 'ativo' },
            { id: 'demo8', nome: 'Premier', logo: null, status: 'ativo' },
            { id: 'demo9', nome: 'Friskies', logo: null, status: 'ativo' },
            { id: 'demo10', nome: 'Biofresh', logo: null, status: 'ativo' }
          ]
        }

      } catch (err) {
        console.error('Erro ao buscar patrocinadores:', err)
        error.value = 'Erro ao carregar parceiros. Tente novamente mais tarde.'
        
        // Em caso de erro, mostrar dados de exemplo
        sponsors.value = [
          { id: 'demo1', nome: 'Dog Chow', logo: null, status: 'ativo' },
          { id: 'demo2', nome: 'Casa das Rações', logo: null, status: 'ativo' },
          { id: 'demo3', nome: 'Whiskas', logo: null, status: 'ativo' },
          { id: 'demo4', nome: 'Royal Canin', logo: null, status: 'ativo' },
          { id: 'demo5', nome: 'Pedigree', logo: null, status: 'ativo' },
          { id: 'demo6', nome: 'Purina', logo: null, status: 'ativo' },
          { id: 'demo7', nome: 'Hills', logo: null, status: 'ativo' },
          { id: 'demo8', nome: 'Premier', logo: null, status: 'ativo' },
          { id: 'demo9', nome: 'Friskies', logo: null, status: 'ativo' },
          { id: 'demo10', nome: 'Biofresh', logo: null, status: 'ativo' }
        ]
      } finally {
        loading.value = false
      }
    }

    // Carregar patrocinadores quando o componente for montado
    onMounted(() => {
      fetchSponsors()
    })

    return {
      sponsors,
      activeSponsors,
      loading,
      error,
      animationDuration,
      fetchSponsors
    }
  }
}
</script>

<style scoped>
.sponsors-section {
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  padding: 2rem;
  padding-top: 3rem;
  overflow: hidden;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.sponsors-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.sponsors-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 3rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 1.1rem;
  font-weight: 500;
  opacity: 0.9;
}

/* Error State */
.error-container {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.error-container p {
  font-size: 1.1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

/* No Sponsors State */
.no-sponsors {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.no-sponsors-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.no-sponsors h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.no-sponsors p {
  font-size: 1rem;
  opacity: 0.8;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Sponsors Display */
.sponsors-wrapper {
  position: relative;
  overflow: hidden;
  height: 140px;
  width: 100%;
  /* Máscara sutil para fade nas bordas */
  mask: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 5%,
    rgba(0, 0, 0, 0.8) 15%,
    black 25%,
    black 75%,
    rgba(0, 0, 0, 0.8) 85%,
    rgba(0, 0, 0, 0.1) 95%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 5%,
    rgba(0, 0, 0, 0.8) 15%,
    black 25%,
    black 75%,
    rgba(0, 0, 0, 0.8) 85%,
    rgba(0, 0, 0, 0.1) 95%,
    transparent 100%
  );
}

.sponsors-track {
  display: flex;
  gap: 2rem;
  animation: scroll-infinite linear infinite;
  width: fit-content;
  will-change: transform;
}

/* Animação de loop infinito perfeito */
@keyframes scroll-infinite {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.sponsor-card {
  flex-shrink: 0;
  width: 200px;
  height: 130px;
  background: white;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.sponsor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.sponsor-logo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.sponsor-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: all 0.3s ease; /* Manter apenas a transição suave */
}

.sponsor-card:hover .sponsor-logo img {
  transform: scale(1.05); /* Adicionar um leve zoom no hover em vez do grayscale */
}

.sponsor-placeholder {
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  line-height: 1.2;
  padding: 0.5rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .sponsors-section {
    padding: 1.5rem;
  }
  
  .sponsors-container {
    padding: 0 1rem;
  }
  
  .sponsors-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .sponsors-wrapper {
    height: 110px;
    /* Máscara mais suave para mobile */
    mask: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 8%,
      black 20%,
      black 80%,
      rgba(0, 0, 0, 0.2) 92%,
      transparent 100%
    );
    -webkit-mask: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 8%,
      black 20%,
      black 80%,
      rgba(0, 0, 0, 0.2) 92%,
      transparent 100%
    );
  }
  
  .sponsor-card {
    width: 160px;
    height: 100px;
  }
  
  .sponsors-track {
    gap: 1.5rem;
  }
  
  .loading-container,
  .error-container,
  .no-sponsors {
    padding: 3rem 1rem;
  }
  
  .no-sponsors-icon {
    font-size: 3rem;
  }
  
  .no-sponsors h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .sponsors-title {
    font-size: 1.5rem;
  }
  
  .sponsors-wrapper {
    height: 95px;
    /* Máscara ainda mais suave para mobile pequeno */
    mask: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 10%,
      black 25%,
      black 75%,
      rgba(0, 0, 0, 0.3) 90%,
      transparent 100%
    );
    -webkit-mask: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 10%,
      black 25%,
      black 75%,
      rgba(0, 0, 0, 0.3) 90%,
      transparent 100%
    );
  }
  
  .sponsor-card {
    width: 140px;
    height: 90px;
  }
  
  .sponsor-placeholder {
    font-size: 0.9rem;
  }
  
  .sponsors-track {
    gap: 1rem;
  }
  
  .loading-container,
  .error-container,
  .no-sponsors {
    padding: 2rem 1rem;
  }
  
  .no-sponsors-icon {
    font-size: 2.5rem;
  }
  
  .no-sponsors h3 {
    font-size: 1.2rem;
  }
  
  .no-sponsors p {
    font-size: 0.9rem;
  }
}

/* Animação mais suave em dispositivos com preferência por movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .sponsors-track {
    animation-duration: 120s !important;
  }
  
  .sponsor-card:hover {
    transform: none;
  }
  
  .loading-spinner {
    animation: none;
  }
  
  .sponsors-wrapper {
    mask: none;
    -webkit-mask: none;
  }
}

/* Otimizações de performance */
.sponsors-track {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.sponsor-card {
  transform: translateZ(0);
}
</style>