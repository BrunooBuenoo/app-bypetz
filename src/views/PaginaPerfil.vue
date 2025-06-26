<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Header do Perfil -->
      <div class="profile-header">
        <div class="profile-avatar-section">
          <div class="profile-avatar">
            <img v-if="user?.photoURL" :src="user.photoURL" :alt="user.displayName" />
            <span v-else class="avatar-placeholder">{{ userInitials }}</span>
            <button class="avatar-edit-btn" @click="triggerFileInput">
              <span class="camera-icon"></span>
            </button>

            <input 
              ref="fileInput" 
              type="file" 
              accept="image/*" 
              @change="handleAvatarChange" 
              style="display: none"
            />
          </div>
          <div class="profile-info">
            <h1>{{ user?.displayName || 'Usuário' }}</h1>
            <p>{{ user?.email }}</p>
            <span class="member-since">
              Membro desde {{ formatDate(user?.metadata?.creationTime) }}
            </span>
          </div>
        </div>
        <button @click="editMode = !editMode" class="btn-edit-profile">
          {{ editMode ? 'Cancelar' : 'Editar Perfil' }}
        </button>
      </div>

      <!-- Formulário de Edição -->
      <div v-if="editMode" class="edit-form">
        <h2>Editar Informações</h2>
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label for="displayName">Nome Completo</label>
            <input
              v-model="profileForm.displayName"
              type="text"
              id="displayName"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div class="form-group">
            <label for="bio">Biografia</label>
            <textarea
              v-model="profileForm.bio"
              id="bio"
              placeholder="Conte um pouco sobre você e seus pets..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="phone">Telefone</label>
            <input
              v-model="profileForm.phone"
              type="tel"
              id="phone"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div class="form-group city-autocomplete-container">
            <label for="location">Localização</label>
            <CityAutocomplete
              v-model="profileForm.location"
              placeholder="Digite o nome da cidade..."
              input-class="city-input-profile"
              @citySelected="handleCitySelected"
            />
          </div>

          <div class="form-buttons">
            <button type="submit" class="btn-save" :disabled="loading">
              {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
            <button type="button" @click="editMode = false" class="btn-cancel">
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <!-- Estatísticas -->
      <div class="profile-stats">
        <div class="stat-card">
          <div class="stat-number">{{ userStats.petsRegistered }}</div>
          <div class="stat-label">Pets Cadastrados</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ userStats.petsFound }}</div>
          <div class="stat-label">Pets Encontrados</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ userStats.helpedFamilies }}</div>
          <div class="stat-label">Famílias Ajudadas</div>
        </div>
      </div>

      <!-- Meus Pets -->
      <div class="my-pets-section">
        <div class="section-header">
          <h2>Meus Pets Cadastrados</h2>
          <router-link to="/cadastrar-pet" class="btn-add-pet">
            Cadastrar Pet
          </router-link>
        </div>

        <!-- Loading dos pets -->
        <div v-if="loadingPets" class="loading-pets">
          <div class="loading-spinner"></div>
          <p>Carregando seus pets...</p>
        </div>

        <div v-else-if="userPets.length === 0" class="empty-pets">
          <div class="empty-icon">🐾</div>
          <h3>Nenhum pet cadastrado ainda</h3>
          <p>Cadastre seu primeiro pet perdido, encontrado ou para adoção</p>
          <router-link to="/cadastrar-pet" class="btn-first-pet">
            Cadastrar Primeiro Pet
          </router-link>
        </div>

        <div v-else class="pets-grid">
          <div v-for="pet in userPets" :key="pet.id" class="pet-card">
            <div class="pet-image-container">
              <img :src="getMainPhoto(pet) || placeholderImage" :alt="pet.name" />
              <div v-if="hasMultiplePhotos(pet)" class="photo-count">
                <span>+{{ pet.photos?.length || 1 }}</span>
              </div>
              
              <!-- Botão Encontrado - só aparece se for perdido -->
              <div v-if="pet.status === 'perdido'" class="action-button-overlay">
                <button 
                  class="btn-found"
                  @click="markAsFound(pet)"
                  :disabled="loading"
                >
                  {{ loading ? 'Atualizando...' : 'Encontrado!' }}
                </button>
              </div>

              <!-- Botão Adotado - só aparece se for para adoção -->
              <div v-if="pet.status === 'adocao'" class="action-button-overlay">
                <button 
                  class="btn-adopted"
                  @click="markAsAdopted(pet)"
                  :disabled="loading"
                >
                  {{ loading ? 'Atualizando...' : 'Adotado!' }}
                </button>
              </div>
            </div>
            <div class="pet-info">
              <h3>{{ pet.name }}</h3>
              <span class="pet-status" :class="pet.status">{{ getStatusLabel(pet.status) }}</span>
              <p class="pet-location">{{ pet.lastSeen }}</p>
              <p class="pet-date">Cadastrado em: {{ formatDate(pet.createdAt) }}</p>
              <div class="pet-actions">
                <button @click="editPet(pet)" class="btn-edit-pet">Editar</button>
                <button @click="deletePet(pet)" class="btn-delete-pet">Excluir</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configurações de Conta -->
      <div class="account-settings">
        <h2>Configurações da Conta</h2>
        <div class="settings-grid">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Alterar Senha</h3>
              <p>Mantenha sua conta segura</p>
            </div>
            <button @click="showPasswordModal = true" class="btn-setting">
              Alterar
            </button>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>Notificações</h3>
              <p>Gerencie suas preferências</p>
            </div>
            <button @click="showNotificationModal = true" class="btn-setting">
              Configurar
            </button>
          </div>
          
          <div class="setting-item danger">
            <div class="setting-info">
              <h3>Excluir Conta</h3>
              <p>Ação irreversível</p>
            </div>
            <button @click="showDeleteModal = true" class="btn-danger">
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Alteração de Senha -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="showPasswordModal = false">
      <div class="modal-content" @click.stop>
        <h3>Alterar Senha</h3>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>Senha Atual</label>
            <input v-model="passwordForm.current" type="password" required />
          </div>
          <div class="form-group">
            <label>Nova Senha</label>
            <input v-model="passwordForm.new" type="password" required />
          </div>
          <div class="form-group">
            <label>Confirmar Nova Senha</label>
            <input v-model="passwordForm.confirm" type="password" required />
          </div>
          <div class="modal-buttons">
            <button type="submit" class="btn-save" :disabled="loading">
              Alterar Senha
            </button>
            <button type="button" @click="showPasswordModal = false" class="btn-cancel">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensagens -->
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { updateProfile as firebaseUpdateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { doc, updateDoc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import CityAutocomplete from '../components/CityAutocomplete.vue'

export default {
  name: 'PaginaPerfil',
  components: {
    CityAutocomplete
  },
  setup() {
    const { user, loading } = useAuth()
    
    const editMode = ref(false)
    const showPasswordModal = ref(false)
    const showAvatarModal = ref(false)
    const showNotificationModal = ref(false)
    const showDeleteModal = ref(false)
    const loadingPets = ref(true)
    
    const successMessage = ref('')
    const error = ref('')
    
    const profileForm = ref({
      displayName: '',
      bio: '',
      phone: '',
      location: ''
    })
    
    const passwordForm = ref({
      current: '',
      new: '',
      confirm: ''
    })
    
    const userPets = ref([])
    const userStats = ref({
      petsRegistered: 0,
      petsFound: 0,
      helpedFamilies: 0
    })
    
    const placeholderImage = 'https://via.placeholder.com/300x200/9333ea/FFFFFF?text=Sem+Foto'

    const userInitials = computed(() => {
      if (!user.value?.displayName) return '?'
      return user.value.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    })

    const formatDate = (timestamp) => {
      if (!timestamp) return 'Data não disponível'
      
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('pt-BR')
      }
      
      return new Date(timestamp).toLocaleDateString('pt-BR')
    }

    const getStatusLabel = (status) => {
      const labels = {
        'perdido': 'Perdido',
        'encontrado': 'Encontrado',
        'adocao': 'Para Adoção',
        'adotado': 'Adotado'
      }
      return labels[status] || status
    }

    const loadUserProfile = async () => {
      if (!user.value) return
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.value.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          profileForm.value = {
            displayName: userData.displayName || user.value.displayName || '',
            bio: userData.bio || '',
            phone: userData.phone || '',
            location: userData.location || ''
          }
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
      }
    }

    const loadUserPets = async () => {
      if (!user.value) return
      
      try {
        loadingPets.value = true
        
        const petsQuery = query(
          collection(db, 'pets'),
          where('userId', '==', user.value.uid)
        )
        
        const querySnapshot = await getDocs(petsQuery)
        const fetchedPets = []
        
        querySnapshot.forEach((doc) => {
          fetchedPets.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        userPets.value = fetchedPets
        
        userStats.value = {
          petsRegistered: fetchedPets.length,
          petsFound: fetchedPets.filter(pet => pet.status === 'encontrado').length,
          helpedFamilies: Math.floor(fetchedPets.length / 2)
        }
        
      } catch (err) {
        console.error('Erro ao carregar pets:', err)
      } finally {
        loadingPets.value = false
      }
    }

    const saveProfile = async () => {
      if (!user.value) return
      
      try {
        loading.value = true
        
        await firebaseUpdateProfile(user.value, {
          displayName: profileForm.value.displayName
        })
        
        await updateDoc(doc(db, 'users', user.value.uid), {
          displayName: profileForm.value.displayName,
          bio: profileForm.value.bio,
          phone: profileForm.value.phone,
          location: profileForm.value.location,
          updatedAt: new Date().toISOString()
        })
        
        successMessage.value = 'Perfil atualizado com sucesso!'
        editMode.value = false
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
        
      } catch (err) {
        error.value = 'Erro ao atualizar perfil: ' + err.message
        setTimeout(() => {
          error.value = ''
        }, 5000)
      } finally {
        loading.value = false
      }
    }

    const changePassword = async () => {
      if (passwordForm.value.new !== passwordForm.value.confirm) {
        error.value = 'As senhas não coincidem'
        return
      }
      
      if (passwordForm.value.new.length < 6) {
        error.value = 'A nova senha deve ter pelo menos 6 caracteres'
        return
      }
      
      try {
        loading.value = true
        
        const credential = EmailAuthProvider.credential(
          user.value.email,
          passwordForm.value.current
        )
        await reauthenticateWithCredential(user.value, credential)
        
        await updatePassword(user.value, passwordForm.value.new)
        
        successMessage.value = 'Senha alterada com sucesso!'
        showPasswordModal.value = false
        passwordForm.value = { current: '', new: '', confirm: '' }
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
        
      } catch (err) {
        error.value = 'Erro ao alterar senha: ' + err.message
        setTimeout(() => {
          error.value = ''
        }, 5000)
      } finally {
        loading.value = false
      }
    }

    const editPet = (pet) => {
      console.log('Editar pet:', pet)
    }

    const deletePet = async (pet) => {
      if (!confirm(`Tem certeza que deseja excluir ${pet.name}?`)) {
        return
      }
      
      try {
        loading.value = true
        
        await deleteDoc(doc(db, 'pets', pet.id))
        
        userPets.value = userPets.value.filter(p => p.id !== pet.id)
        
        userStats.value.petsRegistered = userPets.value.length
        userStats.value.petsFound = userPets.value.filter(p => p.status === 'encontrado').length
        userStats.value.helpedFamilies = Math.floor(userPets.value.length / 2)
        
        successMessage.value = 'Pet excluído com sucesso!'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
        
      } catch (err) {
        error.value = 'Erro ao excluir pet: ' + err.message
        setTimeout(() => {
          error.value = ''
        }, 5000)
      } finally {
        loading.value = false
      }
    }

    const fileInput = ref(null)

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleAvatarChange = async (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      if (!file.type.startsWith('image/')) {
        error.value = 'Por favor, selecione apenas arquivos de imagem'
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        error.value = 'A imagem deve ter no máximo 5MB'
        return
      }
      
      try {
        loading.value = true
        
        const optimizedBase64 = await resizeAndConvertToBase64(file, 150, 150, 0.8)
        
        await updateDoc(doc(db, 'users', user.value.uid), {
          photoURL: optimizedBase64,
          updatedAt: new Date().toISOString()
        })
        
        if (user.value) {
          user.value.photoURL = optimizedBase64
        }
        
        successMessage.value = 'Foto de perfil atualizada com sucesso!'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
        
      } catch (err) {
        error.value = 'Erro ao atualizar foto: ' + err.message
        setTimeout(() => {
          error.value = ''
        }, 5000)
      } finally {
        loading.value = false
        event.target.value = ''
      }
    }

    const resizeAndConvertToBase64 = (file, maxWidth = 150, maxHeight = 150, quality = 0.8) => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          let { width, height } = img
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          ctx.drawImage(img, 0, 0, width, height)
          
          const base64 = canvas.toDataURL('image/jpeg', quality)
          
          if (base64.length > 50000) {
            const smallerBase64 = canvas.toDataURL('image/jpeg', 0.5)
            resolve(smallerBase64)
          } else {
            resolve(base64)
          }
        }
        
        img.onerror = () => reject(new Error('Erro ao carregar imagem'))
        
        const reader = new FileReader()
        reader.onload = (e) => {
          img.src = e.target.result
        }
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
        reader.readAsDataURL(file)
      })
    }

    const loadUserPhoto = async () => {
      if (!user.value) return
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.value.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (userData.photoURL && user.value) {
            user.value.photoURL = userData.photoURL
          }
        }
      } catch (err) {
        console.error('Erro ao carregar foto:', err)
      }
    }

    const getMainPhoto = (pet) => {
      if (pet.photos && pet.photos.length > 0) {
        return pet.photos[0]
      }
      return pet.photo || null
    }

    const hasMultiplePhotos = (pet) => {
      return pet.photos && pet.photos.length > 1
    }

    const markAsFound = async (pet) => {
      if (!confirm(`Confirmar que ${pet.name} foi encontrado?`)) {
        return
      }
      
      try {
        loading.value = true
        
        await updateDoc(doc(db, 'pets', pet.id), {
          status: 'encontrado',
          foundAt: new Date(),
          updatedAt: new Date()
        })
        
        const petIndex = userPets.value.findIndex(p => p.id === pet.id)
        if (petIndex !== -1) {
          userPets.value[petIndex].status = 'encontrado'
          userPets.value[petIndex].foundAt = new Date()
          userPets.value[petIndex].updatedAt = new Date()
        }
        
        userStats.value.petsFound = userPets.value.filter(p => p.status === 'encontrado').length
        
        successMessage.value = `${pet.name} foi marcado como encontrado!`
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
        
      } catch (err) {
        error.value = 'Erro ao atualizar status: ' + err.message
        setTimeout(() => {
          error.value = ''
        }, 5000)
      } finally {
        loading.value = false
      }
    }

    const markAsAdopted = async (pet) => {
      if (!confirm(`Confirmar que ${pet.name} foi adotado?`)) {
        return
      }
      
      try {
        loading.value = true
        
        await updateDoc(doc(db, 'pets', pet.id), {
          status: 'adotado',
          adoptedAt: new Date(),
          updatedAt: new Date()
        })
        
        const petIndex = userPets.value.findIndex(p => p.id === pet.id)
        if (petIndex !== -1) {
          userPets.value[petIndex].status = 'adotado'
          userPets.value[petIndex].adoptedAt = new Date()
          userPets.value[petIndex].updatedAt = new Date()
        }
        
        userStats.value.helpedFamilies = userPets.value.filter(p => p.status === 'adotado').length
        
        successMessage.value = `${pet.name} foi marcado como adotado!`
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
        
      } catch (err) {
        error.value = 'Erro ao atualizar status: ' + err.message
        setTimeout(() => {
          error.value = ''
        }, 5000)
      } finally {
        loading.value = false
      }
    }

    const handleCitySelected = (city) => {
      profileForm.value.locationData = {
        id: city.id,
        name: city.name,
        state: city.state,
        fullName: city.fullName
      }
    }

    onMounted(() => {
      loadUserProfile()
      loadUserPets()
      loadUserPhoto()
    })

    return {
      user,
      loading,
      loadingPets,
      editMode,
      showPasswordModal,
      showAvatarModal,
      showNotificationModal,
      showDeleteModal,
      successMessage,
      error,
      profileForm,
      passwordForm,
      userPets,
      userStats,
      userInitials,
      placeholderImage,
      formatDate,
      getStatusLabel,
      saveProfile,
      changePassword,
      editPet,
      deletePet,
      fileInput,
      triggerFileInput,
      handleAvatarChange,
      resizeAndConvertToBase64,
      getMainPhoto,
      hasMultiplePhotos,
      markAsFound,
      markAsAdopted,
      handleCitySelected
    }
  }
}
</script>

<style scoped>
/* Reset e base */
* {
  box-sizing: border-box;
}

.profile-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 1rem;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header do Perfil */
.profile-header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1.5rem;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  position: relative;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 3px solid transparent;
  background-clip: padding-box;
}

.profile-avatar::before {
  content: '';
  position: absolute;
  inset: -3px;
  padding: 3px;
  background: linear-gradient(45deg, #9333ea, #2563eb, #9333ea);
  border-radius: 50%;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: #374151;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  background: #9333ea;
  transform: scale(1.1);
}

.camera-icon {
  width: 0.75rem;
  height: 0.75rem;
  background: currentColor;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z'/%3E%3C/svg%3E") no-repeat center;
}

.profile-info h1 {
  color: #111827;
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.profile-info p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
}

.member-since {
  color: #9ca3af;
  font-size: 0.875rem;
}

.btn-edit-profile {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-edit-profile:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Formulário de Edição */
.edit-form {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.edit-form h2 {
  color: #111827;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  color: #111827;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

/* Container especial para o CityAutocomplete com z-index alto */
.city-autocomplete-container {
  position: relative;
  z-index: 9999; /* Z-INDEX ALTO PARA APARECER POR CIMA */
}

.city-input-profile {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  color: #111827;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.city-input-profile:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-save {
  background: linear-gradient(to right, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(to right, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

/* Estatísticas */
.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Seção Meus Pets */
.my-pets-section {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  color: #111827;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.btn-add-pet {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-add-pet:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.loading-pets {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #9333ea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-pets {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-pets h3 {
  color: #111827;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.empty-pets p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.btn-first-pet {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-first-pet:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Grid de Pets */
.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.pet-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.pet-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.pet-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.pet-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.pet-card:hover .pet-image-container img {
  transform: scale(1.05);
}

.photo-count {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.action-button-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pet-image-container:hover .action-button-overlay {
  opacity: 1;
}

.btn-found {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-found:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

.btn-adopted {
  background: linear-gradient(135deg, #a855f7, #8b5cf6);
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-adopted:hover:not(:disabled) {
  background: linear-gradient(135deg, #9333ea, #7c3aed);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
}

.pet-info {
  padding: 1.5rem;
}

.pet-info h3 {
  color: #111827;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.pet-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.pet-status.perdido {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.pet-status.encontrado {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.pet-status.adocao {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.pet-status.adotado {
  background: rgba(168, 85, 247, 0.1);
  color: #9333ea;
}

.pet-location {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.pet-date {
  color: #9ca3af;
  font-size: 0.75rem;
  margin: 0 0 1rem 0;
}

.pet-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit-pet {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-edit-pet:hover {
  background: #e5e7eb;
  color: #111827;
}

.btn-delete-pet {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-delete-pet:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}

/* Configurações da Conta */
.account-settings {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.account-settings h2 {
  color: #111827;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(249, 250, 251, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.setting-item:hover {
  background: rgba(243, 244, 246, 0.8);
}

.setting-item.danger {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(254, 242, 242, 0.8);
}

.setting-item.danger:hover {
  background: rgba(254, 226, 226, 0.8);
}

.setting-info h3 {
  color: #111827;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.setting-info p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.btn-setting {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.btn-setting:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #b91c1c;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-content h3 {
  color: #111827;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* Alertas */
.alert {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  z-index: 10000;
  max-width: 400px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* Responsividade */
@media (max-width: 768px) {
  .profile-page {
    padding: 1rem 0.5rem;
  }

  .profile-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .form-buttons {
    flex-direction: column;
  }

  .pets-grid {
    grid-template-columns: 1fr;
  }

  .profile-stats {
    grid-template-columns: 1fr;
  }

  .setting-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .pet-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: 0.5rem;
  }

  .profile-container {
    gap: 1.5rem;
  }

  .profile-header,
  .edit-form,
  .my-pets-section,
  .account-settings {
    padding: 1.5rem;
  }

  .profile-avatar {
    width: 4rem;
    height: 4rem;
    font-size: 1.25rem;
  }

  .profile-info h1 {
    font-size: 1.5rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .action-button-overlay {
    opacity: 1;
  }

  .btn-found,
  .btn-adopted {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }

  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .alert {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}
</style>