<template>
  <div class="hero">
    <div class="background-effects">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
    </div>
    
    <div class="container-sm">
      <div class="img-box">
        <div class="pet-graphic">
          <div class="chart-container">
            <div class="chart-wrapper">
              <div class="chart-bar" :data-height="chartData.found">
                <div class="bar-fill"></div>
                <div class="bar-glow"></div>
              </div>
              <div class="chart-bar" :data-height="chartData.adopted">
                <div class="bar-fill"></div>
                <div class="bar-glow"></div>
              </div>
              <div class="chart-bar" :data-height="chartData.helping">
                <div class="bar-fill"></div>
                <div class="bar-glow"></div>
              </div>
              <div class="chart-bar" :data-height="chartData.comments">
                <div class="bar-fill"></div>
                <div class="bar-glow"></div>
              </div>
            </div>
            <div class="chart-base"></div>
            <div class="chart-labels">
              <span>Encontrados</span>
              <span>Adotados</span>
              <span>Ajudando</span>
              <span>Comentários</span>
            </div>
          </div>
          
          <div class="social-icons">
            <div class="social-icon mobile-icon">
              <div class="icon-content">📱</div>
            </div>
            <div class="social-icon chat-icon">
              <div class="icon-content">💬</div>
            </div>
            <div class="social-icon megaphone-icon">
              <div class="icon-content">📢</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-box">
        <div class="title-container">
          <h1 class="title2">
            <span class="title-word">Alcance</span>
            <span class="title-word highlight">milhares</span>
            <span class="title-word">em minutos!</span>
          </h1>
          <div class="title-decoration"></div>
        </div>
        
        <p class="description">
          Ative uma campanha de impacto nas redes sociais e aumente as chances de reencontro na região.
        </p>
        
        <div class="stats-card" v-if="!loading">
          <div class="stats-number">{{ String(foundPetsCount).padStart(2, '0') }}</div>
          <div class="stats-text">pet(s) encontrados na região</div>
          <div class="stats-pulse"></div>
        </div>
        
        <div class="stats-card" v-else>
          <div class="stats-number loading-shimmer">--</div>
          <div class="stats-text">Carregando dados...</div>
          <div class="stats-pulse"></div>
        </div>
        
        <div class="btn-box">
          <a href="/feed" class="btn-primary">
            <span class="btn-text">Ajude a aumentar esse número</span>
            <div class="btn-arrow">→</div>
          </a>
        </div>
        
        <div class="perfil-container" v-if="!loading && helpingUsers.length > 0">
          <div class="perfil-avatars">
            <div 
              v-for="(user, index) in displayedUsers" 
              :key="user.id"
              class="avatar"
              :class="`avatar-${index + 1}`"
              :title="user.displayName || user.name || 'Usuário'"
            >
              <div class="avatar-inner">
                <img 
                  v-if="user.photoURL" 
                  :src="user.photoURL" 
                  :alt="user.displayName || user.name || 'Usuário'"
                  class="avatar-image"
                />
                <span v-else class="avatar-placeholder">
                  {{ getInitials(user.displayName || user.name || 'U') }}
                </span>
              </div>
            </div>
            <div v-if="remainingUsersCount > 0" class="avatar-more">
              <div class="more-inner">+{{ remainingUsersCount }}</div>
            </div>
          </div>
          <div class="perfil-text-container">
            <span class="perfil-text">
              {{ helpingUsers.length }} pessoa{{ helpingUsers.length !== 1 ? 's' : '' }} ajudando na região
            </span>
            <div class="perfil-indicator"></div>
          </div>
        </div>
        
        <div class="perfil-container" v-else-if="loading">
          <div class="perfil-avatars">
            <div class="avatar loading-avatar" v-for="n in 3" :key="n">
              <div class="avatar-inner loading-shimmer"></div>
            </div>
            <div class="avatar-more">
              <div class="more-inner loading-shimmer">+--</div>
            </div>
          </div>
          <div class="perfil-text-container">
            <span class="perfil-text loading-shimmer">Carregando usuários...</span>
            <div class="perfil-indicator"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'SecaoInfoBranca',
  setup() {
    const loading = ref(true)
    const foundPetsCount = ref(0)
    const adoptedPetsCount = ref(0)
    const helpingUsers = ref([])
    const totalComments = ref(0)
    const userLocation = ref(null)

    // Computed para usuários exibidos (máximo 3)
    const displayedUsers = computed(() => {
      return helpingUsers.value.slice(0, 3)
    })

    // Computed para contagem de usuários restantes
    const remainingUsersCount = computed(() => {
      return Math.max(0, helpingUsers.value.length - 3)
    })

    // Substituir o computed chartData por valores mais simples e estáveis
    const chartData = computed(() => {
      // Usar valores fixos baseados nos dados, mas sem cálculos complexos
      return {
        found: foundPetsCount.value > 0 ? Math.min(100, foundPetsCount.value * 20 + 40) : 40,
        adopted: adoptedPetsCount.value > 0 ? Math.min(100, adoptedPetsCount.value * 15 + 60) : 60,
        helping: helpingUsers.value.length > 0 ? Math.min(100, helpingUsers.value.length * 10 + 80) : 80,
        comments: totalComments.value > 0 ? Math.min(100, Math.min(totalComments.value, 20) * 5 + 30) : 30
      }
    })

    // Função para obter iniciais do nome
    const getInitials = (name) => {
      if (!name) return 'U'
      return name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    // Função para obter localização do usuário (opcional)
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation.value = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          },
          (error) => {
            console.log('Localização não disponível:', error)
          }
        )
      }
    }

    // Função para buscar pets encontrados
    const fetchFoundPets = async () => {
      try {
        const petsQuery = query(
          collection(db, 'pets'),
          where('status', '==', 'encontrado')
        )
        
        const querySnapshot = await getDocs(petsQuery)
        foundPetsCount.value = querySnapshot.size
        
        console.log(`Pets encontrados: ${foundPetsCount.value}`)
      } catch (error) {
        console.error('Erro ao buscar pets encontrados:', error)
        foundPetsCount.value = 0
      }
    }

    // Função para buscar pets adotados
    const fetchAdoptedPets = async () => {
      try {
        const petsQuery = query(
          collection(db, 'pets'),
          where('status', '==', 'adotado')
        )
        
        const querySnapshot = await getDocs(petsQuery)
        adoptedPetsCount.value = querySnapshot.size
        
        console.log(`Pets adotados: ${adoptedPetsCount.value}`)
      } catch (error) {
        console.error('Erro ao buscar pets adotados:', error)
        adoptedPetsCount.value = 0
      }
    }

    // Função para buscar usuários únicos que comentaram
    const fetchHelpingUsers = async () => {
      try {
        const usersSet = new Set()
        const usersData = []
        
        // Buscar todos os pets para pegar os donos
        const petsQuery = query(collection(db, 'pets'))
        const petsSnapshot = await getDocs(petsQuery)
        
        // Adicionar donos de pets únicos
        petsSnapshot.forEach((petDoc) => {
          const pet = petDoc.data()
          if (pet.userId && !usersSet.has(pet.userId)) {
            usersSet.add(pet.userId)
            usersData.push({
              id: pet.userId,
              displayName: pet.userName || 'Usuário',
              name: pet.userName || 'Usuário',
              photoURL: null
            })
          }
        })

        // Buscar comentários de forma mais simples
        let commentCount = 0
        for (const petDoc of petsSnapshot.docs) {
          try {
            const commentsQuery = query(collection(db, 'pets', petDoc.id, 'comments'))
            const commentsSnapshot = await getDocs(commentsQuery)
            commentCount += commentsSnapshot.size
            
            // Adicionar usuários que comentaram
            commentsSnapshot.forEach((commentDoc) => {
              const comment = commentDoc.data()
              if (comment.userId && !usersSet.has(comment.userId)) {
                usersSet.add(comment.userId)
                usersData.push({
                  id: comment.userId,
                  displayName: comment.userName || comment.userDisplayName || 'Usuário',
                  name: comment.userName || 'Usuário',
                  photoURL: comment.userPhotoURL
                })
              }
            })
          } catch (err) {
            console.log('Erro ao buscar comentários do pet:', petDoc.id, err)
          }
        }

        totalComments.value = commentCount
        helpingUsers.value = usersData.slice(0, 15) // Limitar para performance
        
        console.log(`Usuários ajudando: ${helpingUsers.value.length}`)
        console.log(`Total de comentários: ${totalComments.value}`)
      } catch (error) {
        console.error('Erro ao buscar usuários ajudando:', error)
        helpingUsers.value = []
        totalComments.value = 0
      }
    }

    // Substituir a função loadData por uma versão mais estável
    const loadData = async () => {
      loading.value = true
      
      try {
        // Carregar dados de forma sequencial para evitar conflitos
        await fetchFoundPets()
        await new Promise(resolve => setTimeout(resolve, 100)) // Pequeno delay
        await fetchAdoptedPets()
        await new Promise(resolve => setTimeout(resolve, 100))
        await fetchHelpingUsers()
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        // Delay antes de remover loading para evitar flash
        setTimeout(() => {
          loading.value = false
        }, 200)
      }
    }

    // Carregar dados quando o componente for montado
    onMounted(() => {
      getUserLocation()
      loadData()
    })

    return {
      loading,
      foundPetsCount,
      adoptedPetsCount,
      helpingUsers,
      totalComments,
      displayedUsers,
      remainingUsersCount,
      chartData,
      getInitials
    }
  }
}
</script>

<style scoped>
.hero {
  width: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%);
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(140, 82, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(140, 82, 255, 0.1);
  /* REMOVIDO: animation que causava tremor */
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 10%;
}

.orb-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 5%;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.orb-3 {
  width: 100px;
  height: 100px;
  top: 60%;
  right: 30%;
}

.container-sm {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6rem;
  position: relative;
  z-index: 10;
}

.img-box {
  flex: 1;
  display: flex;
  justify-content: center;
}

.pet-graphic {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
}

.chart-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-wrapper {
  display: flex;
  align-items: end;
  gap: 1.5rem;
  height: 180px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(140, 82, 255, 0.1);
  box-shadow: 0 10px 40px rgba(140, 82, 255, 0.1);
}

.chart-bar {
  position: relative;
  width: 40px;
  height: 100%;
  display: flex;
  align-items: end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #8C52FF, #6B3DD6, #4A2B9A);
  border-radius: 8px 8px 0 0;
  position: relative;
  box-shadow: 0 4px 20px rgba(140, 82, 255, 0.3);
  /* ALTURA FIXA - SEM ANIMAÇÃO */
  height: 60%;
}

.chart-bar:nth-child(1) .bar-fill { height: 50%; }
.chart-bar:nth-child(2) .bar-fill { height: 70%; }
.chart-bar:nth-child(3) .bar-fill { height: 85%; }
.chart-bar:nth-child(4) .bar-fill { height: 40%; }

.bar-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom, rgba(140, 82, 255, 0.3), transparent);
  border-radius: 8px 8px 0 0;
  /* REMOVIDO: animation que causava tremor */
}

.chart-base {
  width: 100%;
  height: 4px;
  background: rgba(140, 82, 255, 0.2);
  border-radius: 2px;
  margin-top: 1rem;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 280px;
  margin: 0.5rem auto 0;
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-align: center;
}

.chart-labels span {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.7rem;
}

.social-icons {
  display: flex;
  gap: 2rem;
}

.social-icon {
  position: relative;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 8px 32px rgba(140, 82, 255, 0.2);
  border: 1px solid rgba(140, 82, 255, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
  /* REMOVIDO: animation bounce que causava tremor */
}

.social-icon:nth-child(2) { 
  background: linear-gradient(135deg, #FFD700, #FFA500);
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
}

.social-icon:hover {
  transform: translateY(-3px) scale(1.02);
  /* HOVER SIMPLES - SEM ANIMAÇÕES COMPLEXAS */
}

.social-icon:nth-child(2):hover {
  box-shadow: 0 10px 35px rgba(255, 215, 0, 0.3);
}

.icon-content {
  position: relative;
  z-index: 2;
  color: white;
}

.icon-ripple {
  /* REMOVIDO COMPLETAMENTE - CAUSAVA TREMOR */
  display: none;
}

.text-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.title-container {
  position: relative;
}

.title2 {
  font-size: 3.5rem;
  font-weight: 800;
  color: #333;
  line-height: 1.2;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.title-word {
  display: inline-block;
  /* REMOVIDO: animation slideInUp */
  opacity: 1;
  transform: translateY(0);
}

.highlight {
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.title-decoration {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #8C52FF, #6B3DD6);
  border-radius: 2px;
  margin-top: 1rem;
  /* REMOVIDO: animation expandWidth */
}

.description {
  font-size: 1.3rem;
  color: #666;
  line-height: 1.7;
  margin: 0;
  /* REMOVIDO: animation fadeInUp */
  opacity: 1;
  transform: translateY(0);
  font-weight: 500;
}

.stats-card {
  position: relative;
  background: rgba(140, 82, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(140, 82, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(140, 82, 255, 0.05);
}

.stats-number {
  font-size: 3rem;
  font-weight: 800;
  color: #00BF77;
  text-shadow: 0 0 20px rgba(0, 191, 119, 0.3);
}

.stats-text {
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
}

.stats-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(0, 191, 119, 0.05), transparent);
  /* REMOVIDO: animation shimmer */
  
}

.btn-box {
  display: flex;
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-arrow {
  font-size: 1.2rem;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.btn-shine {
  /* REMOVIDO COMPLETAMENTE - CAUSAVA TREMOR */
  display: none;
}

.perfil-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.perfil-avatars {
  display: flex;
  align-items: center;
}

.avatar {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: -15px;
  border: 3px solid rgba(140, 82, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease;
  box-shadow: 0 4px 15px rgba(140, 82, 255, 0.1);
}

.avatar:first-child {
  margin-left: 0;
}

.avatar:hover {
  transform: translateY(-2px) scale(1.05);
  z-index: 10;
}

.avatar-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-placeholder {
  font-size: 0.9rem;
  font-weight: 600;
}

.btn-primary {
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #8C52FF;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #FFA500, #FF8C00);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
}

.avatar-more {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: -15px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.1);
}

.more-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
}

.perfil-text-container {
  position: relative;
}

.perfil-text {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

.perfil-indicator {
  width: 8px;
  height: 8px;
  background: #00BF77;
  border-radius: 50%;
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  /* REMOVIDO: animation pulse que causava tremor */
  box-shadow: 0 0 10px rgba(0, 191, 119, 0.5);
}

/* Loading states */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  /* REMOVIDO: animation shimmer */
  border-radius: 4px;
}

.loading-avatar .avatar-inner {
  background: #f0f0f0;
}

/* TODAS AS ANIMAÇÕES REMOVIDAS PARA EVITAR TREMOR */

/* Responsividade */
@media (max-width: 1024px) {
  .container-sm {
    gap: 4rem;
    padding: 0 2rem;
  }
  
  .title2 {
    font-size: 3rem;
  }
  
  .pet-graphic {
    width: 350px;
    height: 350px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 0;
  }
  
  .container-sm {
    flex-direction: column;
    text-align: center;
    gap: 4rem;
    padding: 0 1rem;
  }

  .title2 {
    font-size: 2.5rem;
  }

  .img-box {
    order: 2;
  }

  .text-box {
    order: 1;
  }
  
  .pet-graphic {
    width: 300px;
    height: 300px;
  }
  
  .chart-wrapper {
    gap: 1rem;
    height: 150px;
  }
  
  .chart-bar {
    width: 30px;
  }
  
  .social-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .chart-labels {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .title2 {
    font-size: 2rem;
  }

  .description {
    font-size: 1.1rem;
  }

  .pet-graphic {
    width: 250px;
    height: 250px;
    gap: 2rem;
  }
  
  .social-icons {
    gap: 1rem;
  }
  
  .social-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .chart-labels {
    font-size: 0.6rem;
  }
}
</style>
