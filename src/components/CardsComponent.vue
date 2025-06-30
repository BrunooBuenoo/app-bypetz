<template>
  <div class="cards-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Como Funciona</h2>
        <p class="section-subtitle">Simples, rápido e eficiente</p>
      </div>
      
      <div class="cards-grid">
        <div class="card">
          <div class="card-number">01</div>
          <h3 class="card-title">Cadastre</h3>
          <p class="card-description">Registre seu pet perdido ou encontrado com fotos e informações detalhadas</p>
        </div>
        
        <div class="card">
          <div class="card-number">02</div>
          <h3 class="card-title">Divulgue</h3>
          <p class="card-description">Sua publicação será vista por milhares de pessoas na região</p>
        </div>
        
        <div class="card">
          <div class="card-number">03</div>
          <h3 class="card-title">Reencontre</h3>
          <p class="card-description">Conecte-se diretamente com quem pode ajudar no reencontro</p>
        </div>
      </div>
      
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number" v-if="!loading">{{ foundPetsCount }}+</div>
            <div class="stat-number loading-shimmer" v-else>--</div>
            <div class="stat-label">Pets Encontrados</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" v-if="!loading">{{ activeUsersCount }}+</div>
            <div class="stat-number loading-shimmer" v-else>--</div>
            <div class="stat-label">Usuários Ativos</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" v-if="!loading">{{ successRate }}%</div>
            <div class="stat-number loading-shimmer" v-else>--</div>
            <div class="stat-label">Taxa de Sucesso</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'ComponentsComDados',
  setup() {
    const loading = ref(true)
    const foundPetsCount = ref(0)
    const totalPetsCount = ref(0)
    const activeUsersCount = ref(0)
    const adoptedPetsCount = ref(0)

    // Calcular taxa de sucesso baseada em pets encontrados + adotados vs total
    const successRate = computed(() => {
      if (totalPetsCount.value === 0) return 0
      const successfulPets = foundPetsCount.value + adoptedPetsCount.value
      const rate = Math.round((successfulPets / totalPetsCount.value) * 100)
      return Math.min(rate, 98) // Máximo de 98% para ser realista
    })

    // Buscar pets encontrados
    const fetchFoundPets = async () => {
      try {
        const petsQuery = query(
          collection(db, 'pets'),
          where('status', '==', 'encontrado')
        )
        const querySnapshot = await getDocs(petsQuery)
        foundPetsCount.value = querySnapshot.size
      } catch (error) {
        console.error('Erro ao buscar pets encontrados:', error)
        foundPetsCount.value = 0
      }
    }

    // Buscar pets adotados
    const fetchAdoptedPets = async () => {
      try {
        const petsQuery = query(
          collection(db, 'pets'),
          where('status', '==', 'adotado')
        )
        const querySnapshot = await getDocs(petsQuery)
        adoptedPetsCount.value = querySnapshot.size
      } catch (error) {
        console.error('Erro ao buscar pets adotados:', error)
        adoptedPetsCount.value = 0
      }
    }

    // Buscar total de pets para calcular taxa de sucesso
    const fetchTotalPets = async () => {
      try {
        const petsQuery = query(collection(db, 'pets'))
        const querySnapshot = await getDocs(petsQuery)
        totalPetsCount.value = querySnapshot.size
      } catch (error) {
        console.error('Erro ao buscar total de pets:', error)
        totalPetsCount.value = 0
      }
    }

    // Buscar usuários ativos (únicos que postaram pets ou comentaram)
    const fetchActiveUsers = async () => {
      try {
        const usersSet = new Set()
        
        // Buscar usuários que postaram pets
        const petsQuery = query(collection(db, 'pets'))
        const petsSnapshot = await getDocs(petsQuery)
        
        petsSnapshot.forEach((petDoc) => {
          const pet = petDoc.data()
          if (pet.userId) {
            usersSet.add(pet.userId)
          }
        })

        // Buscar usuários que comentaram
        for (const petDoc of petsSnapshot.docs) {
          try {
            const commentsQuery = query(collection(db, 'pets', petDoc.id, 'comments'))
            const commentsSnapshot = await getDocs(commentsQuery)
            
            commentsSnapshot.forEach((commentDoc) => {
              const comment = commentDoc.data()
              if (comment.userId) {
                usersSet.add(comment.userId)
              }
            })
          } catch (err) {
            // Ignorar erros de comentários individuais
            console.log('Erro ao buscar comentários do pet:', petDoc.id)
          }
        }

        activeUsersCount.value = usersSet.size
      } catch (error) {
        console.error('Erro ao buscar usuários ativos:', error)
        activeUsersCount.value = 0
      }
    }

    // Carregar todos os dados
    const loadData = async () => {
      loading.value = true
      
      try {
        // Executar todas as consultas em paralelo para melhor performance
        await Promise.all([
          fetchFoundPets(),
          fetchAdoptedPets(),
          fetchTotalPets(),
          fetchActiveUsers()
        ])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        // Valores de fallback em caso de erro
        foundPetsCount.value = 15
        activeUsersCount.value = 120
        totalPetsCount.value = 20
        adoptedPetsCount.value = 5
      } finally {
        // Pequeno delay para melhor UX
        setTimeout(() => {
          loading.value = false
        }, 500)
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      foundPetsCount,
      activeUsersCount,
      successRate
    }
  }
}
</script>

<style scoped>
.cards-section {
  padding: 5rem 0;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  color: #111827;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(147, 51, 234, 0.1);
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card:hover {
  background: rgba(147, 51, 234, 0.02);
  border-color: rgba(147, 51, 234, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(147, 51, 234, 0.15);
}

.card-number {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  box-shadow: 0 4px 8px rgba(147, 51, 234, 0.3);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
}

.card-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
}

.stats-section {
  margin-top: 2rem;
}

.stats-grid {
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(147, 51, 234, 0.02);
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin: 0 0 0.5rem 0;
  transition: all 0.3s ease;
}

.stat-label {
  color: #6b7280;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  color: transparent !important;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Responsividade */
@media (max-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
  
  .cards-grid {
    gap: 2rem;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .cards-section {
    padding: 4rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .card {
    padding: 2rem 1.5rem;
  }
  
  .stats-grid {
    gap: 2rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .cards-section {
    padding: 3rem 0;
  }
  
  .section-header {
    margin-bottom: 3rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .card {
    padding: 2rem 1rem;
  }
  
  .card-number {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .stats-grid {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
}
</style>