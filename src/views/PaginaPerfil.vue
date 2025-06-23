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
              <i class="fas fa-camera"></i>
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

          <div class="form-group">
            <label for="location">Localização</label>
            <input
              v-model="profileForm.location"
              type="text"
              id="location"
              placeholder="Cidade, Estado"
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
            + Cadastrar Pet
          </router-link>
        </div>

        <!-- Loading dos pets -->
        <div v-if="loadingPets" class="loading-pets">
          <div class="loading-spinner"></div>
          <p>Carregando seus pets...</p>
        </div>

        <div v-else-if="userPets.length === 0" class="empty-pets">
          <div class="empty-text">Nenhum pet cadastrado</div>
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
              <div v-if="pet.status === 'perdido'" class="found-button-overlay">
                <button 
                  class="btn-found"
                  @click="markAsFound(pet)"
                  :disabled="loading"
                >
                  <i class="fas fa-check"></i>
                  {{ loading ? 'Atualizando...' : 'Encontrado!' }}
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

export default {
  name: 'PaginaPerfil',
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
    
    const placeholderImage = 'https://via.placeholder.com/300x200/8C52FF/FFFFFF?text=Sem+Foto'

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
      
      // Se for um timestamp do Firestore
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('pt-BR')
      }
      
      // Se for uma string ou Date
      return new Date(timestamp).toLocaleDateString('pt-BR')
    }

    const getStatusLabel = (status) => {
      const labels = {
        'perdido': 'Perdido',
        'encontrado': 'Encontrado',
        'adocao': 'Para Adoção'
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
        
        // Buscar pets do usuário atual
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
        
        // Calcular estatísticas
        userStats.value = {
          petsRegistered: fetchedPets.length,
          petsFound: fetchedPets.filter(pet => pet.status === 'encontrado').length,
          helpedFamilies: Math.floor(fetchedPets.length / 2) // Simulação
        }
        
        console.log('Pets do usuário carregados:', fetchedPets.length)
        
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
        
        // Atualizar perfil do Firebase Auth usando o nome importado
        await firebaseUpdateProfile(user.value, {
          displayName: profileForm.value.displayName
        })
        
        // Atualizar documento do usuário no Firestore
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
        
        // Reautenticar usuário
        const credential = EmailAuthProvider.credential(
          user.value.email,
          passwordForm.value.current
        )
        await reauthenticateWithCredential(user.value, credential)
        
        // Atualizar senha
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
      // Implementar edição de pet
      console.log('Editar pet:', pet)
      // Aqui você pode redirecionar para uma página de edição ou abrir um modal
    }

    const deletePet = async (pet) => {
      if (!confirm(`Tem certeza que deseja excluir ${pet.name}?`)) {
        return
      }
      
      try {
        loading.value = true
        
        // Deletar pet do Firestore
        await deleteDoc(doc(db, 'pets', pet.id))
        
        // Remover da lista local
        userPets.value = userPets.value.filter(p => p.id !== pet.id)
        
        // Atualizar estatísticas
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
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        error.value = 'Por favor, selecione apenas arquivos de imagem'
        return
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        error.value = 'A imagem deve ter no máximo 5MB'
        return
      }
      
      try {
        loading.value = true
        
        // Redimensionar e converter para base64 otimizado
        const optimizedBase64 = await resizeAndConvertToBase64(file, 150, 150, 0.8)
        
        // Salvar apenas no Firestore (não no Firebase Auth devido ao limite de tamanho)
        await updateDoc(doc(db, 'users', user.value.uid), {
          photoURL: optimizedBase64,
          updatedAt: new Date().toISOString()
        })
        
        // Atualizar o estado local para refletir a mudança imediatamente
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
        // Limpar input
        event.target.value = ''
      }
    }

    // Função para redimensionar e converter imagem para base64 otimizado
    const resizeAndConvertToBase64 = (file, maxWidth = 150, maxHeight = 150, quality = 0.8) => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          // Calcular novas dimensões mantendo proporção
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
          
          // Configurar canvas
          canvas.width = width
          canvas.height = height
          
          // Desenhar imagem redimensionada
          ctx.drawImage(img, 0, 0, width, height)
          
          // Converter para base64 com qualidade otimizada
          const base64 = canvas.toDataURL('image/jpeg', quality)
          
          // Verificar se o base64 não é muito longo (limite do Firebase Auth é ~2000 caracteres)
          if (base64.length > 50000) {
            // Se ainda for muito grande, reduzir mais a qualidade
            const smallerBase64 = canvas.toDataURL('image/jpeg', 0.5)
            resolve(smallerBase64)
          } else {
            resolve(base64)
          }
        }
        
        img.onerror = () => reject(new Error('Erro ao carregar imagem'))
        
        // Carregar arquivo como URL
        const reader = new FileReader()
        reader.onload = (e) => {
          img.src = e.target.result
        }
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
        reader.readAsDataURL(file)
      })
    }

    // Função para carregar foto do perfil do Firestore
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
      // Priorizar o array photos, depois photo (compatibilidade)
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
        
        // Atualizar no Firestore
        await updateDoc(doc(db, 'pets', pet.id), {
          status: 'encontrado',
          foundAt: new Date(),
          updatedAt: new Date()
        })
        
        // Atualizar na lista local
        const petIndex = userPets.value.findIndex(p => p.id === pet.id)
        if (petIndex !== -1) {
          userPets.value[petIndex].status = 'encontrado'
          userPets.value[petIndex].foundAt = new Date()
          userPets.value[petIndex].updatedAt = new Date()
        }
        
        // Atualizar estatísticas
        userStats.value.petsFound = userPets.value.filter(p => p.status === 'encontrado').length
        
        successMessage.value = `${pet.name} foi marcado como encontrado! 🎉`
        
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
      markAsFound
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.profile-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFD700;
  color: #8C52FF;
  font-size: 2rem;
  font-weight: bold;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #5a01ff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  background: #7a47e6;
  transform: scale(1.1);
}

.profile-info h1 {
  color: #FFD700;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.profile-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.member-since {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.btn-edit-profile {
  background: #FFD700;
  color: #8C52FF;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit-profile:hover {
  background: #FFA500;
  transform: translateY(-2px);
}

.edit-form {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.edit-form h2 {
  color: #FFD700;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #FFD700;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(255, 255, 255, 0.15);
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-save {
  background: linear-gradient(135deg, #00b894, #00a085);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #00a085, #008f75);
  transform: translateY(-2px);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.3);
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.my-pets-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #FFD700;
  font-size: 1.5rem;
}

.btn-add-pet {
  background: #8C52FF;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-add-pet:hover {
  background: #7a47e6;
  transform: translateY(-2px);
}

.loading-pets {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #FFD700;
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

.empty-text {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.6);
}

.empty-pets h3 {
  color: #FFD700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.empty-pets p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.btn-first-pet {
  background: #FFD700;
  color: #8C52FF;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-first-pet:hover {
  background: #FFA500;
  transform: translateY(-2px);
}

.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.pet-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.pet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.pet-image-container {
  position: relative;
  width: 100%;
  height: 200px;
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

.pet-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.pet-info {
  padding: 1.5rem;
}

.pet-info h3 {
  color: #8C52FF;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.pet-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.pet-status.perdido {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.pet-status.encontrado {
  background: rgba(46, 213, 115, 0.2);
  color: #2ed573;
}

.pet-status.adocao {
  background: rgba(255, 165, 2, 0.2);
  color: #ffa502;
}

.pet-location {
  color: #666;
  margin-bottom: 0.5rem;
}

.pet-date {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.pet-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit-pet {
  background: #8C52FF;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-edit-pet:hover {
  background: #7a47e6;
}

.btn-delete-pet {
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-delete-pet:hover {
  background: #ff3742;
}

.account-settings {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.account-settings h2 {
  color: #FFD700;
  font-size: 1.5rem;
  margin-bottom: 2rem;
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item.danger {
  border-color: rgba(255, 71, 87, 0.3);
  background: rgba(255, 71, 87, 0.05);
}

.setting-info h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.setting-info p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.btn-setting {
  background: #8C52FF;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-setting:hover {
  background: #7a47e6;
}

.btn-danger {
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #ff3742;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  color: #333;
}

.modal-content h3 {
  color: #8C52FF;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.alert {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  z-index: 10000;
  max-width: 400px;
}

.alert-success {
  background: rgba(46, 213, 115, 0.9);
  color: white;
  border: 1px solid #2ed573;
}

.alert-error {
  background: rgba(255, 71, 87, 0.9);
  color: white;
  border: 1px solid #ff4757;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }
  
  .profile-header {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  
  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
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
}

.found-button-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pet-image-container:hover .found-button-overlay {
  opacity: 1;
}

.btn-found {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-found:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1ea085 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.5);
}

.btn-found:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-found i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .found-button-overlay {
    opacity: 1; /* Sempre visível no mobile */
  }
  
  .btn-found {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
}
</style>