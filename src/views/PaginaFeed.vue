<template>
  <div class="bypetz-app">
    <!-- Filtros estilo ByPetz com Lupa -->
    <div class="filters-section">
      <div class="filters-container">
        <!-- Botão de Lupa -->
        <button 
          class="search-toggle-btn" 
          @click="toggleFilters"
          :class="{ 'active': showFilters }"
        >
          <i class="fas fa-search"></i>
          <span v-if="hasActiveFilters" class="filter-indicator"></span>
        </button>
        
        <!-- Filtros Expandidos -->
        <div class="filters-expanded" :class="{ 'show': showFilters }">
          <div class="filters-grid">
            <select v-model="filter.status" class="filter-select">
              <option value="">Situação</option>
              <option value="perdido">Perdido</option>
              <option value="encontrado">Encontrado</option>
              <option value="adocao">Adoção</option>
              <option value="adotado">Adotado</option>
            </select>

            <!-- Filtro de Cidade com Autocomplete -->
            <div class="city-filter-container">
              <CityAutocomplete  id="citis"
                v-model="filter.city"
                placeholder="Cidade..."
                input-class="filter-city-input"
                @citySelected="handleCityFilterSelected"
              />
            </div>
            
            <select v-model="filter.type" class="filter-select">
              <option value="">Tipo</option>
              <option value="cachorro">Cachorro</option>
              <option value="gato">Gato</option>
              <option value="passaro">Pássaro</option>
              <option value="outro">Outro</option>
            </select>
            
            <select v-model="filter.gender" class="filter-select">
              <option value="">Genero</option>
              <option value="macho">Macho</option>
              <option value="femea">Fêmea</option>
            </select>

            <select v-model="filter.sortOrder" class="filter-select">
              <option value="desc">Mais recente</option>
              <option value="asc">Mais antigos</option>
            </select>
            
            <button class="search-button" @click="applyFilters">
              BUSCAR
            </button>
            
            <button class="clear-filters-btn" @click="clearFilters" v-if="hasActiveFilters">
              LIMPAR
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando pets...</p>
    </div>

    <!-- Grid estilo Instagram -->
    <div v-else-if="sortedAndFilteredPets.length > 0" class="pet-grid">
      <div 
        v-for="(pet, index) in sortedAndFilteredPets" 
        :key="pet.id"
        class="pet-card"
        :style="{ backgroundColor: getRandomColor() }"
        @click="selectPet(pet, index)"
      >
        <img 
          :src="getMainPhoto(pet) || placeholderImg" 
          :alt="pet.name"
          class="pet-image smart-crop"
          @error="onImageError"
        />
        <div v-if="hasMultiplePhotos(pet)" class="photo-count">
          <span>+{{ pet.photos?.length || 1 }}</span>
        </div>
        <!-- Badge da cidade -->
        <div v-if="pet.city || pet.cityData" class="city-badge">
          <i class="fas fa-map-marker-alt"></i>
          {{ getCityName(pet) }}
        </div>
      </div>
    </div>

    <!-- Mensagem quando não há pets -->
    <div v-else class="no-pets">
      <div class="no-pets-icon">🐾</div>
      <h3>Nenhum pet encontrado</h3>
      <p>Tente ajustar os filtros ou cadastre um novo pet</p>
      <router-link to="/cadastrar-pet" class="btn-cadastrar">
        Cadastrar Pet
      </router-link>
    </div>

    <!-- Modal Redesenhado -->
    <div v-if="selectedPet" class="modal-overlay-new" @click="closePopup" @wheel.prevent @touchmove.prevent>
      <div 
        class="modal-content-new" 
        @click.stop
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @wheel.stop
        :class="{ 'transitioning': isTransitioning }"
      >
        <button class="modal-close-new" @click="closePopup">
          <i class="fas fa-times"></i>
        </button>
        
        <!-- Desktop Layout -->
        <div class="modal-body-desktop">
          <!-- Left side - Image Card -->
          <div class="modal-image-card">
            <div class="image-card">
              <img 
                :src="currentPhoto || placeholderImg" 
                :alt="selectedPet.name"
                class="modal-image-new smart-crop"
                @error="onImageError"
              />
            </div>
            
            <!-- Image navigation dots -->
            <div v-if="selectedPet.photos && selectedPet.photos.length > 1" class="image-nav-new">
              <button 
                v-for="(photo, index) in selectedPet.photos"
                :key="index"
                class="nav-dot-new"
                :class="{ active: currentPhoto === photo }"
                @click="currentPhoto = photo"
              ></button>
            </div>
          </div>
          
          <!-- Right side - Pet Info & Comments -->
          <div class="modal-info-section">
            <!-- User Info Header -->
            <div class="user-header">
              <div class="user-info-new">
                <div class="owner-avatar">
                  <img v-if="petOwner?.photoURL" :src="petOwner.photoURL" :alt="petOwner.displayName || 'Usuário'" />
                  <span v-else class="avatar-placeholder">{{ getOwnerInitials() }}</span>
                </div>
                <span class="owner-name">{{ getOwnerDisplayName() }}</span>
              </div>
            </div>
            
            <!-- Pet Details -->
            <div class="pet-details-new">
              <div class="detail-row">
                <span class="detail-text" :class="getStatusClass(selectedPet.status)">{{ getStatusLabel(selectedPet.status) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-text">{{ getTypeLabel(selectedPet.type) }}</span>
              </div>
              <div class="detail-row" v-if="selectedPet.species">
                <span class="detail-text">Raça do pet: {{ selectedPet.species }}</span>
              </div>
              <div class="detail-row" v-if="selectedPet.gender">
                <span class="detail-text">Gênero: {{ getGenderLabel(selectedPet.gender) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-text">Nome do Pet: {{ selectedPet.name }}</span>
              </div>
              <!-- Localização -->
              <div class="detail-row" v-if="selectedPet.city || selectedPet.cityData">
                <span class="detail-text">
                  <i class="fas fa-map-marker-alt"></i>
                  Cidade: {{ getCityName(selectedPet) }}
                </span>
              </div>
              <div class="detail-row" v-if="selectedPet.lastSeen">
                <span class="detail-text">
                  <i class="fas fa-location-dot"></i>
                  Local: {{ selectedPet.lastSeen }}
                </span>
              </div>
            </div>

            <!-- Social Contact Buttons -->
            <div class="social-contact-buttons">
              <button 
                v-if="selectedPet.phone" 
                class="whatsapp-btn" 
                @click="contactWhatsApp"
                title="Contatar via WhatsApp"
              >
                <i class="fab fa-whatsapp"></i>
              </button>
              
              <button 
                v-if="selectedPet.instagram" 
                class="instagram-btn" 
                @click="openInstagram"
                title="Ver perfil no Instagram"
              >
                <i class="fab fa-instagram"></i>
              </button>
            </div>

            <!-- Comments Section with Fixed Layout -->
            <div class="comments-section-desktop">
              <h4 class="comments-title">comentários</h4>
              
              <!-- Comments List with Fixed Height -->
              <div class="comments-list-container-desktop">
                <div class="comments-list-desktop" v-if="comments.length > 0">
                  <div v-for="comment in comments" :key="comment.id" class="comment-item">
                    <div class="comment-avatar">
                      <img v-if="comment.userPhotoURL" :src="comment.userPhotoURL" :alt="comment.userName" />
                      <span v-else class="avatar-placeholder">{{ getCommentUserInitials(comment) }}</span>
                    </div>
                    <div class="comment-content">
                      <span class="comment-username">{{ comment.userName || comment.userDisplayName }}</span>
                      <p class="comment-text">{{ comment.text }}</p>
                      <div class="comment-actions">
                        <span class="comment-time">{{ formatCommentTime(comment.createdAt) }}</span>
                        <button 
                          class="reply-btn" 
                          @click="startReply(comment)"
                        >
                          Responder
                        </button>
                      </div>
                      
                      <!-- Respostas aninhadas -->
                      <div v-if="comment.replies && comment.replies.length > 0" class="replies-container">
                        <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                          <div class="reply-avatar">
                            <img v-if="reply.userPhotoURL" :src="reply.userPhotoURL" :alt="reply.userName" />
                            <span v-else class="avatar-placeholder">{{ getCommentUserInitials(reply) }}</span>
                          </div>
                          <div class="reply-content">
                            <span class="reply-username">{{ reply.userName || reply.userDisplayName }}</span>
                            <p class="reply-text">{{ reply.text }}</p>
                            <span class="reply-time">{{ formatCommentTime(reply.createdAt) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="no-comments">
                  <p>Seja o primeiro a comentar!</p>
                </div>
              </div>
              
              <!-- ALWAYS VISIBLE Fixed Add Comment at Bottom -->
              <div class="add-comment-fixed-desktop">
                <!-- Indicador de resposta FORA e ACIMA do input -->
                <div v-if="replyingTo" class="replying-indicator-floating">
                  <span>Respondendo a {{ replyingTo.userName }}</span>
                  <button @click="cancelReply" class="cancel-reply-btn">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <input 
                  v-model="newComment" 
                  type="text" 
                  :placeholder="replyingTo ? `Responder a ${replyingTo.userName}...` : 'Comentar'"
                  class="comment-input"
                  @keyup.enter="addComment"
                >
                <button @click="addComment" class="send-comment-btn" :disabled="!newComment.trim()">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Layout -->
        <div class="modal-body-mobile">
          <!-- Centralized Pet Image -->
          <div class="mobile-image-section">
            <img 
              :src="currentPhoto || placeholderImg" 
              :alt="selectedPet.name"
              class="mobile-image-centered smart-crop"
              @error="onImageError"
            />
            
            <!-- Image navigation dots -->
            <div v-if="selectedPet.photos && selectedPet.photos.length > 1" class="mobile-image-nav">
              <button 
                v-for="(photo, index) in selectedPet.photos"
                :key="index"
                class="mobile-nav-dot"
                :class="{ active: currentPhoto === photo }"
                @click="currentPhoto = photo"
              ></button>
            </div>
          </div>

          <!-- Bottom Info Section -->
          <div class="mobile-bottom-info">
            <!-- User Info -->
            <div class="mobile-user-section">
              <div class="mobile-user-info">
                <div class="mobile-owner-avatar">
                  <img v-if="petOwner?.photoURL" :src="petOwner.photoURL" :alt="petOwner.displayName || 'Usuário'" />
                  <span v-else class="mobile-avatar-placeholder">{{ getOwnerInitials() }}</span>
                </div>
                <span class="mobile-owner-name">{{ getOwnerDisplayName() }}</span>
              </div>
            </div>

            <!-- Pet Details Below User -->
            <div class="mobile-pet-details-section">
              <div class="mobile-detail-item" :class="getStatusClass(selectedPet.status)">Status do Pet:{{ getStatusLabel(selectedPet.status) }}</div>
              <div class="mobile-detail-item">{{ getTypeLabel(selectedPet.type) }}</div>
              <div v-if="selectedPet.species" class="mobile-detail-item">Raça do pet: {{ selectedPet.species }}</div>
              <div v-if="selectedPet.gender" class="mobile-detail-item">Gênero: {{ getGenderLabel(selectedPet.gender) }}</div>
              <div class="mobile-detail-item">Nome do Pet: {{ selectedPet.name }}</div>
            </div>

            <!-- Social Buttons - OVERLAPPING INFO SECTION -->
            <div class="mobile-social-buttons-overlay">
              <button 
                v-if="selectedPet.phone" 
                class="mobile-whatsapp-btn-overlay" 
                @click="contactWhatsApp"
              >
                <i class="fab fa-whatsapp"></i>
              </button>
              
              <button 
                v-if="selectedPet.instagram" 
                class="mobile-instagram-btn-overlay" 
                @click="openInstagram"
              >
                <i class="fab fa-instagram"></i>
              </button>
            </div>

            <!-- Comment Input Always Visible -->
            <div class="mobile-comment-input-container">
              <!-- Indicador de resposta FORA e ACIMA do input -->
              <div v-if="replyingTo" class="mobile-replying-indicator-floating">
                <span>Respondendo a {{ replyingTo.userName }}</span>
                <button @click="cancelReply" class="mobile-cancel-reply-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <input 
                v-model="newComment" 
                type="text" 
                :placeholder="replyingTo ? `Responder a ${replyingTo.userName}...` : 'Comentar'"
                class="mobile-comment-input"
                @keyup.enter="addComment"
              >
              <button @click="addComment" class="mobile-send-btn" :disabled="!newComment.trim()">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>

            <!-- Comments Toggle Button - BELOW PET INFO -->
            <div class="mobile-comments-toggle-section">
              <button class="mobile-comments-toggle-btn" @click="toggleComments">
                <span class="mobile-comments-toggle-text">
                  Ver comentários {{ comments.length > 0 ? `(${comments.length})` : '' }}
                </span>
                <i class="fas fa-chevron-up" :class="{ 'rotated-down': showComments }"></i>
              </button>
            </div>

            <!-- Comments Overlay - SLIDES UP FROM BOTTOM -->
            <div class="mobile-comments-overlay-popup" :class="{ 'show': showComments }" @click="closeCommentsIfClickOutside">
              <div class="mobile-comments-content" @click.stop>
                <div class="mobile-comments-header-overlay">
                  <h4>Comentários</h4>
                  <button @click="toggleComments" class="close-comments-btn">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div 
                  class="mobile-comments-scroll"
                  @touchstart="handleCommentsScrollStart"
                  @touchmove="handleCommentsScrollMove"
                  @touchend="handleCommentsScrollEnd"
                >
                  <div v-if="comments.length > 0" class="mobile-comments-list">
                    <div v-for="comment in comments" :key="comment.id" class="mobile-comment-item">
                      <div class="mobile-comment-avatar">
                        <img v-if="comment.userPhotoURL" :src="comment.userPhotoURL" :alt="comment.userName" />
                        <span v-else class="mobile-comment-avatar-placeholder">{{ getCommentUserInitials(comment) }}</span>
                      </div>
                      <div class="mobile-comment-content">
                        <span class="mobile-comment-username">{{ comment.userName || comment.userDisplayName }}</span>
                        <p class="mobile-comment-text">{{ comment.text }}</p>
                        <div class="mobile-comment-actions">
                          <span class="mobile-comment-time">{{ formatCommentTime(comment.createdAt) }}</span>
                          <button 
                            class="mobile-reply-btn" 
                            @click="startReply(comment)"
                          >
                            Responder
                          </button>
                        </div>
                        
                        <!-- Respostas aninhadas mobile -->
                        <div v-if="comment.replies && comment.replies.length > 0" class="mobile-replies-container">
                          <div v-for="reply in comment.replies" :key="reply.id" class="mobile-reply-item">
                            <div class="mobile-reply-avatar">
                              <img v-if="reply.userPhotoURL" :src="reply.userPhotoURL" :alt="reply.userName" />
                              <span v-else class="mobile-comment-avatar-placeholder">{{ getCommentUserInitials(reply) }}</span>
                            </div>
                            <div class="mobile-reply-content">
                              <span class="mobile-reply-username">{{ reply.userName || reply.userDisplayName }}</span>
                              <p class="mobile-reply-text">{{ reply.text }}</p>
                              <span class="mobile-reply-time">{{ formatCommentTime(reply.createdAt) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else class="mobile-no-comments">
                    <p>Seja o primeiro a comentar!</p>
                  </div>
                </div>

                <!-- INPUT FIXO NO OVERLAY DE COMENTÁRIOS - SEMPRE VISÍVEL -->
                <div class="mobile-comments-overlay-input-fixed">
                  <!-- Indicador de resposta FORA e ACIMA do input -->
                  <div v-if="replyingTo" class="mobile-overlay-replying-indicator-floating">
                    <span>Respondendo a {{ replyingTo.userName }}</span>
                    <button @click="cancelReply" class="mobile-overlay-cancel-reply-btn">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <input 
                    v-model="newComment" 
                    type="text" 
                    :placeholder="replyingTo ? `Responder a ${replyingTo.userName}...` : 'Comentar'"
                    class="mobile-comments-overlay-input"
                    @keyup.enter="addComment"
                  >
                  <button @click="addComment" class="mobile-comments-overlay-send-btn" :disabled="!newComment.trim()">
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <RodapeSite />
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { collection, getDocs, query, orderBy, addDoc, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../firebase/config'
import RodapeSite from '../components/RodapeSite.vue'
import CityAutocomplete from '../components/CityAutocomplete.vue'

export default {
  name: "PaginaFeed",
  components: {
    RodapeSite,
    CityAutocomplete
  },
  setup() {
    const pets = ref([])
    const loading = ref(true)
    const filter = ref({
      status: '',
      location: '',
      type: '',
      gender: '',
      city: '',
      sortOrder: 'desc'
    })
    
    const selectedPet = ref(null)
    const selectedPetIndex = ref(0)
    const currentPhoto = ref(null)
    const comments = ref([])
    const newComment = ref('')
    const petOwner = ref(null)
    const currentUser = ref(null)
    const auth = getAuth()
    
    // Mobile comments state
    const showComments = ref(false)
    const isTransitioning = ref(false)
    
    // Filters state
    const showFilters = ref(false)
    
    // Reply state
    const replyingTo = ref(null)
    
    // Touch/Swipe variables
    const touchStartY = ref(0)
    const touchStartX = ref(0)
    const touchEndY = ref(0)
    const touchEndX = ref(0)
    const isScrollingComments = ref(false)
    
    // Placeholders válidos
    const placeholderImg = 'https://via.placeholder.com/400x300/8C52FF/FFFFFF?text=Sem+Foto'
    const userAvatarPlaceholder = 'https://via.placeholder.com/32x32/8C52FF/FFFFFF?text=U'

    // Cores para o background dos cards
    const backgroundColors = [
      '#90EE90', '#87CEEB', '#DDA0DD', '#FF7F50', '#F0E68C', 
      '#FFD700', '#98FB98', '#87CEFA', '#696969', '#FF6B6B',
      '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#BB8FCE'
    ]

    // Monitor auth state
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user
    })

    // Computed for active filters
    const hasActiveFilters = computed(() => {
      return filter.value.status || filter.value.type || filter.value.gender || filter.value.city || filter.value.sortOrder !== 'desc'
    })

    const filteredPets = computed(() => {
      return pets.value.filter((pet) => {
        const matchesStatus = !filter.value.status || pet.status === filter.value.status
        const matchesType = !filter.value.type || pet.type === filter.value.type
        const matchesGender = !filter.value.gender || pet.gender === filter.value.gender
        
        // Filtro de cidade - buscar tanto no campo city quanto cityData
        const matchesCity = !filter.value.city || 
          (pet.city && pet.city.toLowerCase().includes(filter.value.city.toLowerCase())) ||
          (pet.cityData && pet.cityData.fullName && pet.cityData.fullName.toLowerCase().includes(filter.value.city.toLowerCase())) ||
          (pet.lastSeen && pet.lastSeen.toLowerCase().includes(filter.value.city.toLowerCase()))
        
        const matchesLocation = !filter.value.location || 
          pet.lastSeen?.toLowerCase().includes(filter.value.location.toLowerCase())
        
        return matchesStatus && matchesType && matchesGender && matchesCity && matchesLocation
      })
    })

    const sortedAndFilteredPets = computed(() => {
      const filtered = filteredPets.value
      
      return [...filtered].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
        
        if (filter.value.sortOrder === 'asc') {
          return dateA - dateB
        } else {
          return dateB - dateA
        }
      })
    })

    const toggleFilters = () => {
      showFilters.value = !showFilters.value
    }

    const clearFilters = () => {
      filter.value = {
        status: '',
        location: '',
        type: '',
        gender: '',
        city: '',
        sortOrder: 'desc'
      }
      showFilters.value = false
    }

    const handleCityFilterSelected = (city) => {
      // Quando uma cidade é selecionada no filtro, usar o nome completo
      filter.value.cityData = city
    }

    const getCityName = (pet) => {
      if (pet.cityData && pet.cityData.fullName) {
        return pet.cityData.fullName
      }
      if (pet.city) {
        return pet.city
      }
      return 'Localização não informada'
    }

    const selectPet = async (pet, index) => {
      selectedPet.value = pet
      selectedPetIndex.value = index
      currentPhoto.value = getMainPhoto(pet)
      showComments.value = false // Reset comments state
      replyingTo.value = null // Reset reply state
      
      // BLOQUEAR SCROLL DO BODY COMPLETAMENTE
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      
      await loadPetOwner(pet.userId || pet.ownerId)
      await loadComments(pet.id)
    }

    const toggleComments = () => {
      showComments.value = !showComments.value
    }

    const closeCommentsIfClickOutside = (e) => {
      if (e.target.classList.contains('mobile-comments-overlay-popup')) {
        showComments.value = false
      }
    }

    // Reply functions
    const startReply = (comment) => {
      replyingTo.value = {
        ...comment,
        userName: comment.userName || comment.userDisplayName || 'Usuário'
      }
      newComment.value = ''
    }

    const cancelReply = () => {
      replyingTo.value = null
      newComment.value = ''
    }

    // Touch/Swipe handlers for main modal
    const handleTouchStart = (e) => {
      touchStartY.value = e.touches[0].clientY
      touchStartX.value = e.touches[0].clientX
      isScrollingComments.value = false
    }

    const handleTouchMove = (e) => {
      // Se os comentários estão abertos e o usuário está fazendo scroll nos comentários, não interferir
      if (showComments.value && isScrollingComments.value) {
        return // Permite scroll normal nos comentários
      }
      
      // Se os comentários estão abertos mas não está fazendo scroll nos comentários, prevenir navegação
      if (showComments.value && !isScrollingComments.value) {
        e.preventDefault()
        return
      }
      
      // Se comentários estão fechados, prevenir scroll para permitir navegação entre pets
      if (!showComments.value) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e) => {
      touchEndY.value = e.changedTouches[0].clientY
      touchEndX.value = e.changedTouches[0].clientX
      
      // Só processar swipe se comentários estão fechados ou não está fazendo scroll nos comentários
      if (!showComments.value && !isScrollingComments.value) {
        handleSwipe()
      }
    }

    // Touch handlers específicos para área de comentários
    const handleCommentsScrollStart = (e) => {
      isScrollingComments.value = true
      e.stopPropagation()
    }

    const handleCommentsScrollMove = (e) => {
      isScrollingComments.value = true
      e.stopPropagation()
    }

    const handleCommentsScrollEnd = (e) => {
      setTimeout(() => {
        isScrollingComments.value = false
      }, 100)
      e.stopPropagation()
    }

    const handleSwipe = () => {
      const deltaY = touchStartY.value - touchEndY.value
      const deltaX = Math.abs(touchStartX.value - touchEndX.value)
      
      // Só processar swipes verticais (ignorar horizontais)
      if (Math.abs(deltaY) > 50 && deltaX < 100) {
        if (deltaY > 0) {
          // Swipe up = próximo pet
          goToNextPet()
        } else {
          // Swipe down = pet anterior
          goToPreviousPet()
        }
      }
    }

    const goToNextPet = async () => {
      const nextIndex = selectedPetIndex.value + 1
      if (nextIndex < sortedAndFilteredPets.value.length) {
        isTransitioning.value = true
        const nextPet = sortedAndFilteredPets.value[nextIndex]
        
        // Add slide animation
        setTimeout(async () => {
          await selectPet(nextPet, nextIndex)
          isTransitioning.value = false
        }, 150)
      }
    }

    const goToPreviousPet = async () => {
      const prevIndex = selectedPetIndex.value - 1
      if (prevIndex >= 0) {
        isTransitioning.value = true
        const prevPet = sortedAndFilteredPets.value[prevIndex]
        
        // Add slide animation
        setTimeout(async () => {
          await selectPet(prevPet, prevIndex)
          isTransitioning.value = false
        }, 150)
      }
    }

    const loadPetOwner = async (userId) => {
      if (!userId) {
        petOwner.value = null
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists()) {
          petOwner.value = userDoc.data()
        } else {
          petOwner.value = null
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dono:', error)
        petOwner.value = null
      }
    }

    const getOwnerDisplayName = () => {
      if (petOwner.value?.displayName) return petOwner.value.displayName
      if (petOwner.value?.name) return petOwner.value.name
      if (selectedPet.value?.userName) return selectedPet.value.userName
      if (selectedPet.value?.ownerName) return selectedPet.value.ownerName
      return 'Usuário'
    }

    const getOwnerInitials = () => {
      const name = getOwnerDisplayName()
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getCommentUserInitials = (comment) => {
      const name = comment.userName || comment.userDisplayName || 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const closePopup = () => {
      selectedPet.value = null
      selectedPetIndex.value = 0
      currentPhoto.value = null
      comments.value = []
      newComment.value = ''
      petOwner.value = null
      showComments.value = false
      replyingTo.value = null
      
      // RESTAURAR SCROLL DO BODY COMPLETAMENTE
      document.body.style.overflow = 'auto'
      document.body.style.position = 'static'
      document.body.style.width = 'auto'
      document.body.style.height = 'auto'
    }

    const loadComments = async (petId) => {
      try {
        const commentsQuery = query(
          collection(db, 'pets', petId, 'comments'),
          orderBy('createdAt', 'desc')
        )
        
        // Real-time listener para comentários
        onSnapshot(commentsQuery, async (snapshot) => {
          const loadedComments = []
          
          for (const commentDoc of snapshot.docs) {
            const commentData = {
              id: commentDoc.id,
              ...commentDoc.data()
            }
            
            // Listener em tempo real para respostas de cada comentário
            const repliesQuery = query(
              collection(db, 'pets', petId, 'comments', commentDoc.id, 'replies'),
              orderBy('createdAt', 'asc')
            )
            
            // Usar onSnapshot também para as respostas
            onSnapshot(repliesQuery, (repliesSnapshot) => {
              const replies = []
              repliesSnapshot.forEach((replyDoc) => {
                replies.push({
                  id: replyDoc.id,
                  ...replyDoc.data()
                })
              })
              
              // Atualizar as respostas do comentário específico
              const commentIndex = comments.value.findIndex(c => c.id === commentDoc.id)
              if (commentIndex !== -1) {
                comments.value[commentIndex].replies = replies
              }
            })
            
            commentData.replies = []
            loadedComments.push(commentData)
          }
          
          comments.value = loadedComments
        })
      } catch (error) {
        console.error('Erro ao carregar comentários:', error)
      }
    }

    const addComment = async () => {
      if (!newComment.value.trim() || !selectedPet.value || !currentUser.value) return

      try {
        if (replyingTo.value) {
          // Adicionar resposta
          await addDoc(collection(db, 'pets', selectedPet.value.id, 'comments', replyingTo.value.id, 'replies'), {
            text: newComment.value.trim(),
            userId: currentUser.value.uid,
            userName: currentUser.value.displayName || currentUser.value.email?.split('@')[0] || 'Usuário',
            userDisplayName: currentUser.value.displayName,
            userPhotoURL: currentUser.value.photoURL,
            createdAt: new Date(),
            petId: selectedPet.value.id,
            parentCommentId: replyingTo.value.id
          })
          
          replyingTo.value = null
        } else {
          // Adicionar comentário normal
          await addDoc(collection(db, 'pets', selectedPet.value.id, 'comments'), {
            text: newComment.value.trim(),
            userId: currentUser.value.uid,
            userName: currentUser.value.displayName || currentUser.value.email?.split('@')[0] || 'Usuário',
            userDisplayName: currentUser.value.displayName,
            userPhotoURL: currentUser.value.photoURL,
            createdAt: new Date(),
            petId: selectedPet.value.id
          })
        }
        
        newComment.value = ''
      } catch (error) {
        console.error('Erro ao adicionar comentário:', error)
        alert('Erro ao enviar comentário. Tente novamente.')
      }
    }

    const contactWhatsApp = () => {
      if (selectedPet.value.phone) {
        const phone = selectedPet.value.phone.replace(/\D/g, '') // Remove caracteres não numéricos
        const message = `Olá! Vi seu pet ${selectedPet.value.name} no ByPetz e gostaria de entrar em contato.`
        const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
      } else {
        alert('Número de WhatsApp não disponível')
      }
    }

    const openInstagram = () => {
      if (selectedPet.value.instagram) {
        let instagramUrl = selectedPet.value.instagram
        
        // Se não começar com http, adicionar
        if (!instagramUrl.startsWith('http')) {
          // Se for apenas o username, construir URL completa
          if (!instagramUrl.includes('instagram.com')) {
            instagramUrl = `https://instagram.com/${instagramUrl.replace('@', '')}`
          } else {
            instagramUrl = `https://${instagramUrl}`
          }
        }
        
        window.open(instagramUrl, '_blank')
      } else {
        alert('Instagram não disponível')
      }
    }

    const formatCommentTime = (timestamp) => {
      if (!timestamp) return ''
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      
      if (diffInMinutes < 1) return 'agora'
      if (diffInMinutes < 60) return `${diffInMinutes}m`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
      return `${Math.floor(diffInMinutes / 1440)}d`
    }

    const onImageError = (event) => {
      event.target.src = placeholderImg
    }

    const getMainPhoto = (pet) => {
      if (pet.photos && pet.photos.length > 0) {
        return pet.photos[0]
      }
      return pet.photo || placeholderImg
    }

    const hasMultiplePhotos = (pet) => {
      return pet.photos && pet.photos.length > 1
    }

    const getStatusLabel = (status) => {
      const labels = {
        'perdido': ' Perdido',
        'encontrado': ' Encontrado',
        'adocao': ' Para Adoção',
        'adotado': ' Adotado',
      }
      return labels[status] || `${status}`
    }

    const getTypeLabel = (type) => {
      const labels = {
        'cachorro': 'Tipo do pet: Cachorro',
        'gato': 'Tipo do pet: Gato',
        'passaro': 'Tipo do pet: Pássaro',
        'outro': 'Tipo do pet: Outro'
      }
      return labels[type] || `Tipo do pet: ${type}`
    }

    const getGenderLabel = (gender) => {
      const labels = {
        'macho': 'Macho',
        'femea': 'Fêmea'
      }
      return labels[gender] || gender
    }

    const getRandomColor = () => {
      return backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
    }

    const applyFilters = () => {
      console.log('Aplicando filtros:', filter.value)
      showFilters.value = false
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return 'Data não disponível'
      
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('pt-BR')
      }
      
      return new Date(timestamp).toLocaleDateString('pt-BR')
    }

    const fetchPets = async () => {
      try {
        loading.value = true
        
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
      selectedPet,
      selectedPetIndex,
      currentPhoto,
      comments,
      newComment,
      currentUser,
      petOwner,
      showComments,
      isTransitioning,
      showFilters,
      hasActiveFilters,
      placeholderImg,
      userAvatarPlaceholder,
      filteredPets,
      sortedAndFilteredPets,
      replyingTo,
      toggleFilters,
      clearFilters,
      handleCityFilterSelected,
      getCityName,
      selectPet,
      toggleComments,
      closeCommentsIfClickOutside,
      closePopup,
      loadPetOwner,
      loadComments,
      addComment,
      startReply,
      cancelReply,
      contactWhatsApp,
      openInstagram,
      formatCommentTime,
      getOwnerDisplayName,
      getOwnerInitials,
      getCommentUserInitials,
      onImageError,
      getMainPhoto,
      hasMultiplePhotos,
      getStatusLabel,
      getTypeLabel,
      getGenderLabel,
      getRandomColor,
      applyFilters,
      formatDate,
      fetchPets,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleCommentsScrollStart,
      handleCommentsScrollMove,
      handleCommentsScrollEnd,
      goToNextPet,
      goToPreviousPet,
      getStatusClass: (status) => {
        const statusClasses = {
          'perdido': 'status-perdido',
          'encontrado': 'status-encontrado', 
          'adocao': 'status-adocao',
          'adotado': 'status-adotado',
        }
        return statusClasses[status] || ''
      },
    }
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.bypetz-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f0f0 0%, #efeff0 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

#citis{
    padding: 1rem;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    background: white;
    color: #374151;
    font-size: 1rem;
    transition: all 0.3s ease;
}

::v-deep(.input-container input) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  font-size: 16px;
}

/* Filtros estilo ByPetz com Lupa */
.filters-section {
  padding: 2rem 0;
}



.filters-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem;
}

/* Botão de Lupa */
.search-toggle-btn {
  background: #8B5CF6;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-toggle-btn:hover {
  background: #7C3AED;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.search-toggle-btn.active {
  background: #7C3AED;
  border-radius: 50px 50px 0 0;
}

.filter-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #FFD700;
  border-radius: 50%;
  border: 2px solid white;
}

/* Filtros Expandidos */
.filters-expanded {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}

.filters-expanded.show {
  max-height: 400px;
}

.filters-grid {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  align-items: center;
}

.filter-select {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #8B5CF6;
}

.city-filter-container {
  width: 100%;
}

.filter-city-input {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  width: 100%;
  transition: border-color 0.2s;
}

.filter-city-input:focus {
  outline: none;
  border-color: #8B5CF6;
}

.search-button {
  background: #8B5CF6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background: #7C3AED;
}

.clear-filters-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-filters-btn:hover {
  background: #dc2626;
}

/* Loading */
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
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* No pets */
.no-pets {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.no-pets-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-pets h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.no-pets p {
  opacity: 0.8;
  margin-bottom: 2rem;
}

.btn-cadastrar {
  background: #FFD700;
  color: #8B5CF6;
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

/* Grid estilo Instagram */
.pet-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 0 2rem 2rem;
}

.pet-card {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
}

.pet-card:hover {
  transform: scale(1.02);
}

/* SMART CROP - Centralização Inteligente das Imagens */
.pet-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.smart-crop {
  object-position: center 30%; /* Foca na parte superior-central (onde geralmente está o rosto) */
}

/* Para diferentes tipos de animais, podemos usar classes específicas */
.pet-image.dog {
  object-position: center 25%; /* Cachorros - foco um pouco mais alto */
}

.pet-image.cat {
  object-position: center 35%; /* Gatos - foco um pouco mais baixo */
}

.pet-image.bird {
  object-position: center 20%; /* Pássaros - foco bem alto */
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

/* Badge da cidade */
.city-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(139, 92, 246, 0.9);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  backdrop-filter: blur(10px);
}

.city-badge i {
  font-size: 0.7rem;
}

/* Modal Overlay - COMPLETELY BLOCK SCROLL + 50% TRANSPARENCY */
.modal-overlay-new {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* 50% TRANSPARENCY */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow: hidden; /* BLOQUEIA SCROLL COMPLETAMENTE */
}

.modal-content-new {
  background: transparent;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  position: relative;
  transition: transform 0.3s ease;
  overflow: hidden; /* BLOQUEIA SCROLL COMPLETAMENTE */
}

.modal-content-new.transitioning {
  transform: translateY(10px);
  opacity: 0.8;
}

.modal-close-new {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(180, 180, 180, 0.3);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  font-size: 1.2rem;
}

/* Desktop Layout - ALTURA 600PX MANTIDA */
.modal-body-desktop {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  height: 600px; /* ALTURA MANTIDA COMO SOLICITADO */
}

/* Left side - Image Card */
.modal-image-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-card {
  background: white;
  border-radius: 20px;
  padding: 0;
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-image-new {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.image-nav-new {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.nav-dot-new {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-dot-new.active {
  background: white;
}

/* Right side - Info & Comments */
.modal-info-section {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
  height: 600px; /* ALTURA FIXA */
}

.user-header {
  margin-bottom: 1.5rem;
  flex-shrink: 0; /* NÃO ENCOLHE */
}

.user-info-new {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.owner-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #8B5CF6;
}

.owner-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.owner-name {
  font-weight: 600;
  font-size: 1rem;
}

.pet-details-new {
  margin-bottom: 1.5rem;
  flex-shrink: 0; /* NÃO ENCOLHE */
}

.detail-row {
  margin-bottom: 0.5rem;
}

.detail-text {
  font-size: 0.9rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-text i {
  color: #8B5CF6;
  font-size: 0.8rem;
}

/* Social Contact Buttons */
.social-contact-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  flex-shrink: 0; /* NÃO ENCOLHE */
}

.whatsapp-btn {
  background: #25D366;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

.whatsapp-btn:hover {
  background: #128C7E;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
}

.instagram-btn {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(188, 24, 136, 0.3);
}

.instagram-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(188, 24, 136, 0.4);
}

/* DESKTOP: Comments Section with GUARANTEED Fixed Input */
.comments-section-desktop {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0; /* IMPORTANTE PARA FLEXBOX */
  position: relative; /* IMPORTANTE PARA POSICIONAMENTO */
}

.comments-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  opacity: 0.8;
  flex-shrink: 0; /* NÃO ENCOLHE */
}

/* DESKTOP: Container com altura calculada para comentários */
.comments-list-container-desktop {
  flex: 1;
  overflow: hidden;
  margin-bottom: 0; /* REMOVIDO MARGIN */
  min-height: 0; /* IMPORTANTE PARA FLEXBOX */
  padding-bottom: 70px; /* ESPAÇO PARA O INPUT FIXO */
}

.comments-list-desktop {
  height: 100%;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.comment-item {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #8B5CF6;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-avatar .avatar-placeholder {
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
}

.comment-content {
  flex: 1;
}

.comment-username {
  font-weight: 600;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.25rem;
}

.comment-text {
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  opacity: 0.9;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.comment-time {
  font-size: 0.75rem;
  opacity: 0.6;
}

.reply-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
  transition: color 0.2s;
}

.reply-btn:hover {
  color: white;
}

/* Respostas aninhadas */
.replies-container {
  margin-left: 1rem;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.reply-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.reply-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #8B5CF6;
}

.reply-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reply-avatar .avatar-placeholder {
  color: white;
  font-weight: 600;
  font-size: 0.7rem;
}

.reply-content {
  flex: 1;
}

.reply-username {
  font-weight: 600;
  font-size: 0.8rem;
  display: block;
  margin-bottom: 0.2rem;
}

.reply-text {
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 0.2rem;
  opacity: 0.9;
}

.reply-time {
  font-size: 0.7rem;
  opacity: 0.6;
}

.no-comments {
  text-align: center;
  opacity: 0.6;
  font-size: 0.9rem;
  margin: 2rem 0;
}

/* Indicador de resposta */
/* Remover estes estilos antigos */
.replying-indicator,
.mobile-replying-indicator,
.mobile-overlay-replying-indicator {
  display: none;
}

/* INPUT FIXO NO OVERLAY DE COMENTÁRIOS - SEMPRE VISÍVEL */
.mobile-comments-overlay-input-fixed {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 0.5rem;
  z-index: 10;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-comments-overlay-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  font-size: 16px; /* PREVINE ZOOM NO iOS */
  outline: none;
}

.mobile-comments-overlay-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.mobile-comments-overlay-send-btn {
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.mobile-comments-overlay-send-btn:disabled {
  opacity: 0.5;
}

/* DESKTOP: ABSOLUTELY POSITIONED Fixed Add Comment */
.add-comment-fixed-desktop {
  position: relative;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 20px;
  padding: 0.75rem;
  z-index: 10;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  color: white;
  padding: 0.75rem 1rem;
  font-size: 16px;
  outline: none;
  margin-right: 0.5rem;
}

.comment-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.comment-input:focus {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.send-comment-btn {
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.send-comment-btn:hover:not(:disabled) {
  background: #0056b3;
}

.send-comment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile Layout */
.modal-body-mobile {
  display: none;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .modal-overlay-new {
    padding: 0; /* REMOVIDO PADDING PARA OCUPAR TELA TODA */
    background: rgba(0, 0, 0, 0.7); /* 50% TRANSPARENCY MANTIDO */
    /* IMPORTANTE: Cobrir TODA a tela incluindo navbar */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999; /* Z-INDEX ALTO PARA FICAR ACIMA DA NAVBAR */
  }

  .pet-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 1rem 2rem;
  }

  .modal-content-new {
    max-width: 90%;
    width: 100%;
    height: 100vh; /* ALTURA TOTAL DA TELA */
    max-height: 98vh; /* ALTURA MÁXIMA TOTAL */
    border-radius: 20px; /* BORDAS ARREDONDADAS RESTAURADAS */
    overflow: hidden;
    margin: 10px; /* PEQUENA MARGEM PARA MOSTRAR AS BORDAS */
    background: rgba(0, 0, 0, 0.95); /* BACKGROUND ESCURO PARA O MODAL */
  }

  .modal-close-new {
    position: absolute;
    top: 50px; /* MAIS PRÓXIMO DO TOPO */
    right: 35px; /* MAIS PRÓXIMO DA LATERAL */
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: white;
    z-index: 20;
    width: 45px; /* MENOR */
    height: 45px; /* MENOR */
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .modal-body-desktop {
    display: none;
  }

  .modal-body-mobile {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    border-radius: 20px; /* BORDAS ARREDONDADAS */
  }

  /* MOBILE: Centralized Pet Image Section */
  .mobile-image-section {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    max-height: 55vh; /* REDUZIDO PARA DAR MAIS ESPAÇO PARA INFO AQUIII */
    border-radius: 20px 20px 0 0; /* BORDAS ARREDONDADAS APENAS NO TOPO */
  }

  .mobile-image-centered {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px 20px 0 0; /* BORDAS ARREDONDADAS APENAS NO TOPO */
  }

  .mobile-image-nav {
    position: absolute;
    bottom: 15px; /* MAIS PRÓXIMO DA BORDA */
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 5;
  }

  .mobile-nav-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
  }

  .mobile-nav-dot.active {
    background: white;
  }

  /* MOBILE: Bottom Info Section - MAIS ESPAÇO */
  .mobile-bottom-info {
    background: rgba(0, 0, 0, 0.95); /* BACKGROUND MAIS ESCURO */
    color: white;
    padding: 1rem; /* PADDING RESTAURADO */
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 45vh; /* MAIS ESPAÇO */
    max-height: 45vh; /* LIMITADO */
    overflow: hidden;
    border-radius: 0 0 20px 20px; /* BORDAS ARREDONDADAS APENAS EMBAIXO */
    position: relative; /* IMPORTANTE PARA POSICIONAMENTO DOS ÍCONES */
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 20px));
  }

  /* MOBILE: Social Buttons - OVERLAPPING INFO SECTION */
  .mobile-social-buttons-overlay {
    position: absolute;
    top: 80px; /* POSICIONADO NO TOPO DA SEÇÃO DE INFO */
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 10; /* ACIMA DAS INFORMAÇÕES */
  }

  .mobile-whatsapp-btn-overlay {
    background: #25D366;
    color: white;
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.5rem;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
    transition: transform 0.2s;
  }

  .mobile-whatsapp-btn-overlay:active {
    transform: scale(0.95);
  }

  .mobile-instagram-btn-overlay {
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    color: white;
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.5rem;
    box-shadow: 0 4px 15px rgba(188, 24, 136, 0.4);
    transition: transform 0.2s;
  }

  .mobile-instagram-btn-overlay:active {
    transform: scale(0.95);
  }

  /* MOBILE: User Section */
  .mobile-user-section {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
    padding-right: 140px; /* ESPAÇO PARA OS ÍCONES SOCIAIS */
  }

  .mobile-user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .mobile-owner-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #8B5CF6;
    border: 2px solid white;
  }

  .mobile-owner-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .mobile-avatar-placeholder {
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .mobile-owner-name {
    font-weight: 600;
    font-size: 1rem;
    color: white;
  }

  /* MOBILE: Pet Details Section */
  .mobile-pet-details-section {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
    padding-right: 140px; /* ESPAÇO PARA OS ÍCONES SOCIAIS */
  }

  .mobile-detail-item {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mobile-detail-item:last-child {
    margin-bottom: 0;
  }

  .mobile-detail-item i {
    color: #8B5CF6;
    font-size: 0.8rem;
  }

  /* MOBILE: Indicador de resposta */
  .mobile-replying-indicator {
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.4);
    border-radius: 12px;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.9);
    min-height: 36px;
    backdrop-filter: blur(10px);
  }

  .mobile-replying-indicator span {
    flex: 1;
    margin-right: 0.75rem;
    font-weight: 500;
    color: #a78bfa;
  }

  .mobile-cancel-reply-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    padding: 0.2rem;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .mobile-cancel-reply-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  /* MOBILE: Comment Input Always Visible */
  .mobile-comment-input-container {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    flex-shrink: 0;
    position: relative;
  }

  .mobile-comment-input {
    flex: 1;
    background: transparent;
    border: none;
    color: white;
    padding: 0.75rem 1rem;
    font-size: 16px; /* PREVINE ZOOM NO iOS */
    outline: none;
  }

  .mobile-comment-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .mobile-send-btn {
    background: #007BFF;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .mobile-send-btn:disabled {
    opacity: 0.5;
  }

  /* MOBILE: Comments Toggle Section - BELOW PET INFO */
  .mobile-comments-toggle-section {
    flex-shrink: 0;
    margin-bottom: 1rem;
  }

  .mobile-comments-toggle-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 15px;
    transition: background-color 0.2s;
  }

  .mobile-comments-toggle-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .mobile-comments-toggle-text {
    font-size: 1rem;
    font-weight: 600;
    color: white;
  }

  .mobile-comments-toggle-btn i.fa-chevron-up {
    color: white;
    transition: transform 0.3s ease;
    font-size: 0.9rem;
  }

  .mobile-comments-toggle-btn i.fa-chevron-up.rotated-down {
    transform: rotate(180deg);
  }

  /* MOBILE: Comments Overlay - SLIDES UP FROM BOTTOM */
  .mobile-comments-overlay-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    display: flex;
    align-items: flex-end;
  }

  .mobile-comments-overlay-popup.show {
    transform: translateY(0);
  }

  .mobile-comments-content {
    background: rgba(0, 0, 0, 0.95);
    width: 100%;
    max-height: 70vh;
    border-radius: 20px 20px 0 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    position: relative; /* IMPORTANTE PARA O INPUT FIXO */
  }

  .mobile-comments-header-overlay {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }

  .mobile-comments-header-overlay h4 {
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .close-comments-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .mobile-comments-scroll {
    flex: 1;
    overflow-y: auto;
    padding-right: 0.5rem;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    padding-bottom: 80px; /* ESPAÇO PARA O INPUT FIXO */
    min-height: 0;
  }

  .mobile-comments-list {
    padding-bottom: 1rem;
  }

  .mobile-comment-item {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .mobile-comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #8B5CF6;
  }

  .mobile-comment-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .mobile-comment-avatar-placeholder {
    color: white;
    font-weight: 600;
    font-size: 0.75rem;
  }

  .mobile-comment-content {
    flex: 1;
  }

  .mobile-comment-username {
    font-weight: 600;
    font-size: 0.9rem;
    display: block;
    margin-bottom: 0.25rem;
    color: white;
  }

  .mobile-comment-text {
    font-size: 0.85rem;
    line-height: 1.4;
    margin-bottom: 0.25rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .mobile-comment-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .mobile-comment-time {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .mobile-reply-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0;
    font-weight: 600;
    transition: color 0.2s;
  }

  .mobile-reply-btn:hover {
    color: white;
  }

  /* MOBILE: Respostas aninhadas */
  .mobile-replies-container {
    margin-left: 1rem;
    border-left: 2px solid rgba(255, 255, 255, 0.1);
    padding-left: 1rem;
    margin-top: 0.5rem;
  }

  .mobile-reply-item {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .mobile-reply-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #8B5CF6;
  }

  .mobile-reply-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .mobile-reply-avatar-placeholder {
    color: white;
    font-weight: 600;
    font-size: 0.7rem;
  }

  .mobile-reply-content {
    flex: 1;
  }

  .mobile-reply-username {
    font-weight: 600;
    font-size: 0.8rem;
    display: block;
    margin-bottom: 0.2rem;
    color: white;
  }

  .mobile-reply-text {
    font-size: 0.8rem;
    line-height: 1.4;
    margin-bottom: 0.2rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .mobile-reply-time {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .mobile-no-comments {
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    margin: 2rem 0;
  }

  /* MOBILE: Indicador de resposta no overlay */
  .mobile-overlay-replying-indicator-floating {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    background: rgba(139, 92, 246, 0.9);
    border: 1px solid rgba(139, 92, 246, 0.6);
    border-radius: 12px 12px 0 0;
    padding: 0.5rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8rem;
    color: white;
    min-height: 36px;
    backdrop-filter: blur(10px);
    z-index: 100;
    margin-bottom: 0;
  }

  .mobile-overlay-replying-indicator-floating span {
    flex: 1;
    margin-right: 0.75rem;
    font-weight: 500;
    color: white;
  }

  /* Ajustar containers para position relative */
  .add-comment-fixed-desktop {
    position: relative;
  }

  .mobile-comment-input-container {
    position: relative;
  }

  .mobile-comments-overlay-input-fixed {
    position: relative;
  }
}

/* Indicador de resposta FORA e ACIMA do input */
.replying-indicator-floating {
  position: absolute;
  top: -40px; /* Ajuste a posição conforme necessário */
  left: 0;
  background: rgba(139, 92, 246, 0.9);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.replying-indicator-floating span {
  flex: 1;
  margin-right: 0.75rem;
}

.cancel-reply-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.cancel-reply-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Mobile - Indicador de resposta FORA e ACIMA do input */
.mobile-replying-indicator-floating {
  position: absolute;
  top: -40px; /* Ajuste a posição conforme necessário */
  left: 0;
  background: rgba(139, 92, 246, 0.9);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.mobile-replying-indicator-floating span {
  flex: 1;
  margin-right: 0.75rem;
}

.mobile-cancel-reply-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.mobile-cancel-reply-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Mobile - Indicador de resposta no overlay FORA e ACIMA do input */
.mobile-overlay-replying-indicator-floating {
  position: absolute;
  top: -40px; /* Ajuste a posição conforme necessário */
  left: 0;
  background: rgba(139, 92, 246, 0.9);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.mobile-overlay-replying-indicator-floating span {
  flex: 1;
  margin-right: 0.75rem;
}

.mobile-overlay-cancel-reply-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.mobile-overlay-cancel-reply-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Status Classes */
.status-perdido {
    color: #dc3545; /* Vermelho */
}

.status-encontrado {
    color: #28a745; /* Verde */
}

.status-adocao {
    color: #ffc107; /* Amarelo */
}

.status-adotado {
    color: #007bff; /* Azul */
}

/* Mobile Extra Small - Ajustes para telas muito pequenas */
@media (max-width: 480px) {
  .modal-content-new {
    height: 95vh; /* Reduzir altura total */
    max-height: 95vh;
    margin: 5px; /* Margem menor */
  }

  /* Reduzir altura da seção de imagem */
  .mobile-image-section {
    max-height: 45vh; /* Reduzido de 55vh para 45vh */
  }

  /* Ajustar seção de informações */
  .mobile-bottom-info {
    min-height: 50vh; /* Aumentado de 45vh para 50vh */
    max-height: 50vh;
    padding: 0.75rem; /* Padding menor */
  }

  /* Reduzir espaçamentos das seções */
  .mobile-user-section {
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .mobile-pet-details-section {
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
  }

  /* Ajustar container do input de comentário */
  .mobile-comment-input-container {
    margin-bottom: 0.75rem; /* Reduzido de 1rem */
    padding: 0.4rem; /* Padding menor */
  }

  /* Garantir que o botão de comentários seja sempre visível */
  .mobile-comments-toggle-section {
    margin-bottom: 0.5rem; /* Reduzido */
    flex-shrink: 0; /* Nunca encolher */
  }

  .mobile-comments-toggle-btn {
    padding: 0.75rem; /* Padding menor */
    font-size: 0.9rem; /* Fonte menor */
  }

  .mobile-comments-toggle-text {
    font-size: 0.9rem; /* Fonte menor */
  }

  /* Ajustar detalhes do pet para ocupar menos espaço */
  .mobile-detail-item {
    font-size: 0.85rem; /* Fonte menor */
    margin-bottom: 0.4rem; /* Espaçamento menor */
  }

  /* Reduzir tamanho dos botões sociais */
  .mobile-whatsapp-btn-overlay,
  .mobile-instagram-btn-overlay {
    width: 48px;
    height: 48px;
    font-size: 1.3rem;
  }

  /* Posicionar botões sociais mais próximos */
  .mobile-social-buttons-overlay {
    top: 60px; /* Mais próximo do topo */
    gap: 10px; /* Gap menor */
  }

  /* Ajustar padding do usuário para dar espaço aos botões menores */
  .mobile-user-section {
    padding-right: 120px; /* Reduzido de 140px */
  }

  .mobile-pet-details-section {
    padding-right: 120px; /* Reduzido de 140px */
  }
}
</style>