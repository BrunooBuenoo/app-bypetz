<template>
  <div class="lost-pets-feed">
    <h1>Feed de Animais Perdidos</h1>
    <h2>Animais Perdidos e Achados</h2>
    
    <!-- Filtros -->
    <div class="filters">
      <div class="filter-group">
        <label>Status</label>
        <div class="filter-options">
          <button
            v-for="status in filters.statusOptions"
            :key="status.value"
            :class="{ active: filter.status === status.value }"
            @click="setFilter('status', status.value)"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <label>Tipo de Pet</label>
        <div class="filter-options">
          <button
            v-for="type in filters.typeOptions"
            :key="type.value"
            :class="{ active: filter.type === type.value }"
            @click="setFilter('type', type.value)"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando pets...</p>
    </div>

    <!-- Cards -->
    <div v-else class="pet-cards">
      <div
        class="pet-card"
        v-for="pet in filteredPets"
        :key="pet.id"
        @click="selectPet(pet)"
      >
        <div class="pet-image-container">
          <img
            :src="getMainPhoto(pet) || placeholderImg"
            alt="Foto do Pet"
            @error="onImageError($event)"
          />
          <div v-if="hasMultiplePhotos(pet)" class="photo-count">
            <span>+{{ pet.photos?.length || 1 }}</span>
          </div>
        </div>
        <div class="pet-info">
          <h3>{{ pet.name }}</h3>
          <p><strong>Status:</strong> {{ getStatusLabel(pet.status) }}</p>
          <p><strong>Tipo:</strong> {{ getTypeLabel(pet.type) }}</p>
          <p><strong>Último Local Visto:</strong> {{ pet.lastSeen }}</p>
          <p class="posted-by">Por: {{ pet.userName || 'Usuário' }}</p>
        </div>
      </div>
    </div>

    <!-- Mensagem quando não há pets -->
    <div v-if="!loading && filteredPets.length === 0" class="no-pets">
      <div class="no-pets-text">Nenhum pet encontrado</div>
      <h3>Nenhum pet encontrado</h3>
      <p>Tente ajustar os filtros ou cadastre um novo pet</p>
      <router-link to="/cadastrar-pet" class="btn-cadastrar">
        Cadastrar Pet
      </router-link>
    </div>

    <!-- Popup -->
    <div class="popup" v-if="selectedPet" @click="closePopup">
      <div class="popup-content" @click.stop>
        <button class="close-btn" @click="selectedPet = null">&times;</button>
        
        <!-- Galeria de Fotos -->
        <div class="photo-gallery">
          <div class="main-photo">
            <img :src="currentPhoto || placeholderImg" alt="Foto do Pet" />
          </div>
          
          <!-- Thumbnails se houver múltiplas fotos -->
          <div v-if="selectedPet.photos && selectedPet.photos.length > 1" class="photo-thumbnails">
            <div 
              v-for="(photo, index) in selectedPet.photos"
              :key="index"
              class="thumbnail"
              :class="{ active: currentPhoto === photo }"
              @click="currentPhoto = photo"
            >
              <img :src="photo" :alt="`Foto ${index + 1}`" />
            </div>
          </div>
        </div>

        <div class="popup-info">
          <h2>{{ selectedPet.name }}</h2>
          <p><strong>Status:</strong> {{ getStatusLabel(selectedPet.status) }}</p>
          <p><strong>Tipo:</strong> {{ getTypeLabel(selectedPet.type) }}</p>
          <p><strong>Raça:</strong> {{ selectedPet.species || 'Não informado' }}</p>
          <p><strong>Último Local Visto:</strong> {{ selectedPet.lastSeen }}</p>
          <p><strong>Descrição:</strong> {{ selectedPet.description || 'Sem descrição' }}</p>
          
          <div class="contact-info" v-if="selectedPet.email || selectedPet.phone">
            <h3>Informações de Contato:</h3>
            <p v-if="selectedPet.email"><strong>Email:</strong> {{ selectedPet.email }}</p>
            <p v-if="selectedPet.phone"><strong>Telefone:</strong> {{ selectedPet.phone }}</p>
          </div>

          <div class="posted-info">
            <p><strong>Postado por:</strong> {{ selectedPet.userName || 'Usuário' }}</p>
            <p><strong>Data:</strong> {{ formatDate(selectedPet.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <RodapeSite />
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import RodapeSite from '../components/RodapeSite.vue'

export default {
  name: "PaginaFeed",
  components: {
    RodapeSite,
  },
  setup() {
    const pets = ref([])
    const loading = ref(true)
    const filter = ref({
      status: '',
      location: '',
      type: '',
      species: '',
    })
    
    const filters = {
      statusOptions: [
        { label: 'Todos', value: '' },
        { label: 'Perdidos', value: 'perdido' },
        { label: 'Achados', value: 'encontrado' },
        { label: 'Adoção', value: 'adocao' },
      ],
      typeOptions: [
        { label: 'Todos', value: '' },
        { label: 'Cachorros', value: 'cachorro' },
        { label: 'Gatos', value: 'gato' },
        { label: 'Pássaros', value: 'passaro' },
        { label: 'Outros', value: 'outro' },
      ],
    }
    
    const selectedPet = ref(null)
    const currentPhoto = ref(null)
    const placeholderImg = 'https://via.placeholder.com/400x300/8C52FF/FFFFFF?text=Sem+Foto'

    const filteredPets = computed(() => {
      return pets.value.filter((pet) => {
        const matchesStatus = !filter.value.status || pet.status === filter.value.status
        const matchesType = !filter.value.type || pet.type === filter.value.type
        const matchesLocation = !filter.value.location || 
          pet.lastSeen?.toLowerCase().includes(filter.value.location.toLowerCase())
        return matchesStatus && matchesType && matchesLocation
      })
    })

    const setFilter = (key, value) => {
      filter.value[key] = value
    }

    const selectPet = (pet) => {
      selectedPet.value = pet
      // Definir a primeira foto como atual
      currentPhoto.value = getMainPhoto(pet)
    }

    const closePopup = () => {
      selectedPet.value = null
      currentPhoto.value = null
    }

    const onImageError = (event) => {
      event.target.src = placeholderImg
    }

    const getMainPhoto = (pet) => {
      // Priorizar o array photos, depois photo (compatibilidade)
      if (pet.photos && pet.photos.length > 0) {
        return pet.photos[0]
      }
      return pet.photo || null
    }

    const hasMultiplePhotos = (pet) => {
      return pet.photos && pet.photos.length > 1
    }

    const getStatusLabel = (status) => {
      const labels = {
        'perdido': 'Perdido',
        'encontrado': 'Encontrado',
        'adocao': 'Para Adoção'
      }
      return labels[status] || status
    }

    const getTypeLabel = (type) => {
      const labels = {
        'cachorro': 'Cachorro',
        'gato': 'Gato',
        'passaro': 'Pássaro',
        'outro': 'Outro'
      }
      return labels[type] || type
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return 'Data não disponível'
      
      // Se for um timestamp do Firestore
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('pt-BR')
      }
      
      // Se for uma string ou Date
      return new Date(timestamp).toLocaleDateString('pt-BR')
    }

    const fetchPets = async () => {
      try {
        loading.value = true
        
        // Buscar todos os pets ordenados por data de criação (mais recentes primeiro)
        const petsQuery = query(
          collection(db, 'pets'),
          orderBy('createdAt', 'desc')
        )
        
        const querySnapshot = await getDocs(petsQuery)
        const fetchedPets = []
        
        querySnapshot.forEach((doc) => {
          fetchedPets.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        pets.value = fetchedPets
        console.log('Pets carregados:', fetchedPets.length)
        
      } catch (error) {
        console.error('Erro ao buscar pets:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchPets()
    })

    return {
      pets,
      loading,
      filter,
      filters,
      selectedPet,
      currentPhoto,
      placeholderImg,
      filteredPets,
      setFilter,
      selectPet,
      closePopup,
      onImageError,
      getMainPhoto,
      hasMultiplePhotos,
      getStatusLabel,
      getTypeLabel,
      formatDate,
      fetchPets
    }
  },
}
</script>

<style scoped>
.lost-pets-feed {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
}

h1 {
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #d6c3fc;
  font-size: 2.5rem;
  font-weight: bold;
}

h2 {
  color: #ffffff;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.filters {
  margin-bottom: 3rem;
}

.filters label {
  font-size: 1.25rem;
  font-weight: 600;
  color: #FFD700;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-options button {
  background-color: white;
  border: 2px solid #8C52FF;
  border-radius: 10px;
  color: #8C52FF;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  min-width: 120px;
}

.filter-options button:hover {
  background-color: #8C52FF;
  color: white;
  transform: translateY(-2px);
}

.filter-options button.active {
  background-color: #8C52FF;
  color: white;
  box-shadow: 0 4px 15px rgba(140, 82, 255, 0.3);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #FFD700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pet-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.pet-card {
  background: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  overflow: hidden;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  color: #8C52FF;
}

.pet-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.pet-image-container {
  position: relative;
  width: 100%;
  height: 250px;
}

.pet-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.pet-info {
  padding: 1.5rem;
}

.pet-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #8C52FF;
  font-weight: bold;
}

.pet-info p {
  text-align: left;
  margin: 0.5rem 0;
  color: #666;
  font-weight: 500;
}

.pet-info strong {
  color: #8C52FF;
}

.posted-by {
  font-size: 0.9rem;
  color: #999 !important;
  font-style: italic;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.no-pets {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.no-pets-text {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.6);
}

.no-pets h3 {
  color: #FFD700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.no-pets p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.btn-cadastrar {
  background: #FFD700;
  color: #8C52FF;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-cadastrar:hover {
  background: #FFA500;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
}

.popup-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.photo-gallery {
  margin-bottom: 2rem;
}

.main-photo {
  width: 100%;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.main-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-thumbnails {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail:hover {
  border-color: #8C52FF;
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: #8C52FF;
  box-shadow: 0 0 10px rgba(140, 82, 255, 0.5);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup-info h2 {
  margin-bottom: 1rem;
  color: #8C52FF;
  font-weight: 700;
  font-size: 2rem;
  text-align: center;
}

.popup-info p {
  margin: 0.75rem 0;
  color: #666;
  font-weight: 500;
  line-height: 1.6;
}

.popup-info strong {
  color: #8C52FF;
}

.contact-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 1.5rem;
}

.contact-info h3 {
  color: #8C52FF;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.posted-info {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #8C52FF;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

@media (max-width: 999px) {
  .pet-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-options {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .lost-pets-feed {
    padding: 1rem;
  }
  
  .pet-cards {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .filter-options button {
    min-width: 100px;
    padding: 0.5rem 1rem;
  }
  
  .popup-content {
    margin: 0.5rem;
    padding: 1.5rem;
  }
  
  .main-photo {
    height: 250px;
  }
  
  .photo-thumbnails {
    gap: 0.25rem;
  }
  
  .thumbnail {
    width: 60px;
    height: 45px;
  }
}
</style>
