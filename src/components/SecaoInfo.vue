<template>
  <div class="info-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-word">Alcance</span>
          <span class="title-word highlight">milhares</span>
          <span class="title-word">em minutos!</span>
        </h2>
        <p class="section-subtitle">
          Ative uma campanha de impacto nas redes sociais e aumente as chances de reencontro na região.
        </p>
      </div>

      <div class="content-grid">
        <div class="stats-section">
          <div class="main-stat-card" v-if="!loading">
            <div class="stat-number">{{ String(foundPetsCount).padStart(2, '0') }}</div>
            <div class="stat-label">pets encontrados na região</div>
          </div>
          
          <div class="main-stat-card" v-else>
            <div class="stat-number loading-shimmer">--</div>
            <div class="stat-label">Carregando dados...</div>
          </div>

          <div class="secondary-stats">
            <div class="secondary-stat">
              <div class="secondary-number">{{ adoptedPetsCount }}+</div>
              <div class="secondary-label">Adotados</div>
            </div>
            <div class="secondary-stat">
              <div class="secondary-number">{{ helpingUsers.length }}+</div>
              <div class="secondary-label">Ajudando</div>
            </div>
            <div class="secondary-stat">
              <div class="secondary-number">{{ totalComments }}+</div>
              <div class="secondary-label">Comentários</div>
            </div>
          </div>

          <div class="action-section">
            <router-link to="/feed" class="btn-primary">
              Ajude a aumentar esse número
            </router-link>
          </div>
        </div>

        <div class="visual-section">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Atividade da Comunidade</h3>
            </div>
            <div class="chart-container">
              <div class="chart-wrapper">
                <div class="chart-bar" v-for="(bar, index) in chartBars" :key="index">
                  <div class="bar-fill" :style="{ height: bar.height + '%' }"></div>
                </div>
              </div>
              <div class="chart-labels">
                <span>Encontrados</span>
                <span>Adotados</span>
                <span>Ajudando</span>
                <span>Comentários</span>
              </div>
            </div>
          </div>

          <div class="users-card" v-if="!loading && helpingUsers.length > 0">
            <div class="users-header">
              <h4 class="users-title">Pessoas Ajudando</h4>
            </div>
            <div class="users-content">
              <div class="user-avatars">
                <div 
                  v-for="(user, index) in displayedUsers" 
                  :key="user.id"
                  class="avatar"
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
              <div class="users-text">
                {{ helpingUsers.length }} pessoa{{ helpingUsers.length !== 1 ? 's' : '' }} na região
              </div>
            </div>
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
  name: 'SecaoInfo',
  setup() {
    const loading = ref(true)
    const foundPetsCount = ref(0)
    const adoptedPetsCount = ref(0)
    const helpingUsers = ref([])
    const totalComments = ref(0)

    const displayedUsers = computed(() => {
      return helpingUsers.value.slice(0, 4)
    })

    const remainingUsersCount = computed(() => {
      return Math.max(0, helpingUsers.value.length - 4)
    })

    const chartBars = computed(() => {
      return [
        { height: foundPetsCount.value > 0 ? Math.min(100, foundPetsCount.value * 15 + 30) : 30 },
        { height: adoptedPetsCount.value > 0 ? Math.min(100, adoptedPetsCount.value * 12 + 45) : 45 },
        { height: helpingUsers.value.length > 0 ? Math.min(100, helpingUsers.value.length * 8 + 60) : 60 },
        { height: totalComments.value > 0 ? Math.min(100, Math.min(totalComments.value, 25) * 3 + 25) : 25 }
      ]
    })

    const getInitials = (name) => {
      if (!name) return 'U'
      return name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

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

    const fetchHelpingUsers = async () => {
      try {
        const usersSet = new Set()
        const usersData = []
        
        const petsQuery = query(collection(db, 'pets'))
        const petsSnapshot = await getDocs(petsQuery)
        
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

        let commentCount = 0
        for (const petDoc of petsSnapshot.docs) {
          try {
            const commentsQuery = query(collection(db, 'pets', petDoc.id, 'comments'))
            const commentsSnapshot = await getDocs(commentsQuery)
            commentCount += commentsSnapshot.size
            
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
        helpingUsers.value = usersData.slice(0, 20)
      } catch (error) {
        console.error('Erro ao buscar usuários ajudando:', error)
        helpingUsers.value = []
        totalComments.value = 0
      }
    }

    const loadData = async () => {
      loading.value = true
      
      try {
        await fetchFoundPets()
        await new Promise(resolve => setTimeout(resolve, 100))
        await fetchAdoptedPets()
        await new Promise(resolve => setTimeout(resolve, 100))
        await fetchHelpingUsers()
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 200)
      }
    }

    onMounted(() => {
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
      chartBars,
      getInitials
    }
  }
}
</script>

<style scoped>
.info-section {
  padding: 5rem 0;
  background: #ffffff;
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
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.title-word {
  display: inline-block;
}

.highlight {
  background: linear-gradient(135deg, #9333ea, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.main-stat-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.main-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #059669, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
}

.stat-label {
  color: #374151;
  font-weight: 500;
  font-size: 1.125rem;
}

.secondary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.secondary-stat {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 0.75rem;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.secondary-stat:hover {
  background: rgba(147, 51, 234, 0.02);
  border-color: rgba(147, 51, 234, 0.2);
  transform: translateY(-2px);
}

.secondary-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #9333ea;
  margin: 0 0 0.25rem 0;
}

.secondary-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-section {
  display: flex;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  padding: 1rem 2rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.visual-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.chart-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-wrapper {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 0.75rem;
  height: 120px;
  padding: 1rem;
  background: rgba(249, 250, 251, 0.5);
  border-radius: 0.5rem;
}

.chart-bar {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #9333ea, #2563eb);
  border-radius: 3px 3px 0 0;
  transition: height 0.8s ease;
  min-height: 8px;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.chart-labels span {
  flex: 1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.users-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.users-header {
  margin-bottom: 1.5rem;
}

.users-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.users-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-avatars {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar:hover {
  transform: translateY(-2px) scale(1.05);
  z-index: 10;
}

.avatar-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
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
  font-size: 0.75rem;
  font-weight: 600;
}

.avatar-more {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.more-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
}

.users-text {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
}

/* Responsividade */
@media (max-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
  
  .content-grid {
    gap: 3rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .info-section {
    padding: 4rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .secondary-stats {
    grid-template-columns: 1fr;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .chart-wrapper {
    height: 100px;
  }
}

@media (max-width: 480px) {
  .info-section {
    padding: 3rem 0;
  }

  .section-title {
    font-size: 1.75rem;
    flex-direction: column;
    gap: 0;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .main-stat-card {
    padding: 2rem 1.5rem;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .secondary-stat {
    padding: 1rem;
  }

  .chart-labels {
    font-size: 0.6rem;
  }

  .user-avatars {
    gap: 0.25rem;
  }

  .avatar {
    width: 35px;
    height: 35px;
  }

  .avatar-more {
    width: 35px;
    height: 35px;
  }
}
</style>