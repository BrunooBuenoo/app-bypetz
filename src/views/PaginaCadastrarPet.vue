<template>
  <div class="cadastrar-pet-page">
    <div class="cadastrar-container">
      <div class="header">
        <h1>Cadastrar Pet</h1>
        <p>Ajude a reunir famílias com seus pets</p>
      </div>

      <form @submit.prevent="handleSubmit" class="pet-form">
        <!-- Fotos do Pet -->
        <div class="form-group photo-section">
          <label>Fotos do Pet (até 3 fotos)</label>
          <div class="photos-upload">
            <div 
              v-for="(photo, index) in petForm.photos" 
              :key="index"
              class="photo-preview"
              @click="triggerFileInput(index)"
            >
              <img v-if="photo" :src="photo" :alt="`Foto ${index + 1}`" />
              <div v-else class="photo-placeholder">
                <span class="camera-icon"></span>
                <span>Foto {{ index + 1 }}</span>
                <small>Clique para adicionar</small>
              </div>
              <button 
                v-if="photo" 
                type="button" 
                class="remove-photo-btn"
                @click.stop="removePhoto(index)"
              >
                <span class="close-icon"></span>
              </button>
            </div>
          </div>
          <p class="photo-help">A primeira foto será a principal no feed</p>
          <input 
            v-for="(photo, index) in petForm.photos"
            :key="`input-${index}`"
            :ref="el => fileInputs[index] = el"
            type="file" 
            accept="image/*" 
            @change="handlePhotoChange($event, index)" 
            style="display: none"
          />
        </div>

        <!-- Informações Básicas -->
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nome do Pet *</label>
            <input
              v-model="petForm.name"
              type="text"
              id="name"
              placeholder="Ex: Rex, Mimi, Buddy"
              required
            />
          </div>

          <div class="form-group">
            <label for="type">Tipo *</label>
            <select v-model="petForm.type" id="type" required>
              <option value="">Selecione o tipo</option>
              <option value="cachorro">Cachorro</option>
              <option value="gato">Gato</option>
              <option value="passaro">Pássaro</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="species">Raça</label>
            <input
              v-model="petForm.species"
              type="text"
              id="species"
              placeholder="Ex: Labrador, Siamês, Vira-lata"
            />
          </div>

          <div class="form-group">
            <label for="gender">
              <span class="gender-icon"></span>
              Gênero
            </label>
            <select v-model="petForm.gender" id="gender">
              <option value="">Selecione o gênero</option>
              <option value="macho">Macho</option>
              <option value="femea">Fêmea</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="status">Status *</label>
            <select v-model="petForm.status" id="status" required>
              <option value="">Selecione o status</option>
              <option value="perdido">Perdido</option>
              <option value="encontrado">Encontrado</option>
              <option value="adocao">Para Adoção</option>
              <option value="adotado">Adotado</option>
            </select>
          </div>

          <div class="form-group">
            <label for="city">
              <span class="location-icon"></span>
              Cidade *
            </label>
            <CityAutocomplete
              v-model="petForm.city"
              placeholder="Digite o nome da cidade..."
              input-class="city-input-cadastro"
              @citySelected="handleCitySelected"
            />
          </div>
        </div>

        <!-- Local específico (opcional) -->
        <div class="form-group">
          <label for="lastSeen">Local específico (opcional)</label>
          <input
            v-model="petForm.lastSeen"
            type="text"
            id="lastSeen"
            placeholder="Ex: Parque Central, Rua das Flores, próximo ao shopping"
          />
          <small class="field-help">Informe um local mais específico dentro da cidade</small>
        </div>

        <!-- Descrição -->
        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea
            v-model="petForm.description"
            id="description"
            placeholder="Descreva características do pet, comportamento, etc."
            rows="4"
          ></textarea>
        </div>

        <!-- Informações de Contato -->
        <div class="contact-section">
          <h3>
            <span class="contact-icon"></span>
            Informações de Contato
          </h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="email">
                <span class="email-icon"></span>
                Email
              </label>
              <input
                v-model="petForm.email"
                type="email"
                id="email"
                placeholder="seu@email.com"
              />
            </div>

            <div class="form-group">
              <label for="phone">
                <span class="whatsapp-icon"></span>
                WhatsApp *
              </label>
              <input
                v-model="petForm.phone"
                type="tel"
                id="phone"
                placeholder="(11) 99999-9999"
                required
              />
              <small class="field-help">Número será usado para contato via WhatsApp</small>
            </div>
          </div>

          <div class="form-group">
            <label for="instagram">
              <span class="instagram-icon"></span>
              Instagram (opcional)
            </label>
            <input
              v-model="petForm.instagram"
              type="text"
              id="instagram"
              placeholder="@seuperfil ou https://instagram.com/seuperfil"
            />
            <small class="field-help">Seu perfil do Instagram para contato adicional</small>
          </div>
        </div>

        <!-- Botões -->
        <div class="form-buttons">
          <button type="button" @click="$router.go(-1)" class="btn-cancel">
            <span class="arrow-left-icon"></span>
            Cancelar
          </button>
          <button type="submit" class="btn-submit" :disabled="loading">
            <span class="paw-icon"></span>
            {{ loading ? 'Cadastrando...' : 'Cadastrar Pet' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Mensagens -->
    <div v-if="successMessage" class="alert alert-success">
      <span class="check-icon"></span>
      {{ successMessage }}
    </div>
    <div v-if="error" class="alert alert-error">
      <span class="warning-icon"></span>
      {{ error }}
    </div>
  </div>
  <RodapeSite/>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import CityAutocomplete from '../components/CityAutocomplete.vue'
import RodapeSite from '../components/RodapeSite.vue'

export default {
  name: 'PaginaCadastrarPet',
  components: {
    CityAutocomplete,
    RodapeSite
  },
  setup() {
    const router = useRouter()
    const { user } = useAuth()
    
    const loading = ref(false)
    const successMessage = ref('')
    const error = ref('')
    const fileInputs = ref([])
    
    const petForm = ref({
      name: '',
      type: '',
      species: '',
      gender: '',
      status: '',
      city: '',
      lastSeen: '',
      description: '',
      email: '',
      phone: '',
      instagram: '',
      photos: [null, null, null]
    })

    const handleCitySelected = (city) => {
      petForm.value.cityData = {
        id: city.id,
        name: city.name,
        state: city.state,
        fullName: city.fullName
      }
    }

    const triggerFileInput = (index) => {
      fileInputs.value[index]?.click()
    }

    const handlePhotoChange = async (event, index) => {
      const file = event.target.files[0]
      if (!file) return
      
      if (!file.type.startsWith('image/')) {
        error.value = 'Por favor, selecione apenas arquivos de imagem'
        return
      }
      
      if (file.size > 10 * 1024 * 1024) {
        error.value = 'A imagem deve ter no máximo 10MB'
        return
      }
      
      try {
        const optimizedBase64 = await resizeAndConvertToBase64(file, 1200, 900, 0.92)
        petForm.value.photos[index] = optimizedBase64
        
        error.value = ''
      } catch (err) {
        error.value = 'Erro ao processar imagem: ' + err.message
      }
    }

    const removePhoto = (index) => {
      petForm.value.photos[index] = null
    }

    const resizeAndConvertToBase64 = (file, maxWidth = 1200, maxHeight = 900, quality = 0.92) => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          let { width, height } = img
          
          const aspectRatio = width / height
          
          if (width > maxWidth || height > maxHeight) {
            if (aspectRatio > 1) {
              if (width > maxWidth) {
                width = maxWidth
                height = width / aspectRatio
              }
            } else {
              if (height > maxHeight) {
                height = maxHeight
                width = height * aspectRatio
              }
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          
          ctx.drawImage(img, 0, 0, width, height)
          
          let format = 'image/jpeg'
          let finalQuality = quality
          
          if (file.type === 'image/png') {
            const imageData = ctx.getImageData(0, 0, width, height)
            const data = imageData.data
            let hasTransparency = false
            
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] < 255) {
                hasTransparency = true
                break
              }
            }
            
            if (hasTransparency) {
              format = 'image/png'
              finalQuality = 1.0
            }
          }
          
          const base64 = canvas.toDataURL(format, finalQuality)
          resolve(base64)
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

    const handleSubmit = async () => {
      if (!user.value) {
        error.value = 'Você precisa estar logado para cadastrar um pet'
        return
      }

      const hasPhotos = petForm.value.photos.some(photo => photo !== null)
      if (!hasPhotos) {
        error.value = 'Adicione pelo menos uma foto do pet'
        return
      }

      if (!petForm.value.city) {
        error.value = 'Selecione uma cidade'
        return
      }

      try {
        loading.value = true
        error.value = ''

        const validPhotos = petForm.value.photos.filter(photo => photo !== null)

        const petData = {
          name: petForm.value.name,
          type: petForm.value.type,
          species: petForm.value.species || 'Não informado',
          gender: petForm.value.gender || '',
          status: petForm.value.status,
          city: petForm.value.city,
          cityData: petForm.value.cityData || null,
          lastSeen: petForm.value.lastSeen || '',
          description: petForm.value.description || '',
          email: petForm.value.email || user.value.email,
          phone: petForm.value.phone || '',
          instagram: petForm.value.instagram || '',
          photos: validPhotos,
          photo: validPhotos[0] || null,
          userId: user.value.uid,
          userEmail: user.value.email,
          userName: user.value.displayName || 'Usuário',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        await addDoc(collection(db, 'pets'), petData)

        successMessage.value = 'Pet cadastrado com sucesso!'
        
        petForm.value = {
          name: '',
          type: '',
          species: '',
          gender: '',
          status: '',
          city: '',
          lastSeen: '',
          description: '',
          email: '',
          phone: '',
          instagram: '',
          photos: [null, null, null]
        }

        setTimeout(() => {
          router.push('/feed')
        }, 2000)

      } catch (err) {
        console.error('Erro ao cadastrar pet:', err)
        error.value = 'Erro ao cadastrar pet: ' + err.message
      } finally {
        loading.value = false
      }
    }

    return {
      petForm,
      loading,
      successMessage,
      error,
      fileInputs,
      handleCitySelected,
      triggerFileInput,
      handlePhotoChange,
      removePhoto,
      handleSubmit,
      resizeAndConvertToBase64
    }
  }
}
</script>

<style scoped>
/* Reset e base */
* {
  box-sizing: border-box;
}

.cadastrar-pet-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 80px;
}

.cadastrar-container {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #111827;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.header p {
  color: #6b7280;
  font-size: 1rem;
}

.pet-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  color: #111827;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.field-help {
  color: #6b7280;
  font-size: 0.75rem;
  font-style: italic;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.photo-section {
  background: rgba(249, 250, 251, 0.8);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 2px dashed #d1d5db;
}

.photos-upload {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  justify-items: center;
}

.photo-preview {
  position: relative;
  width: 100%;
  max-width: 180px;
  height: 140px;
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  background: white;
}

.photo-preview:hover {
  border-color: #9333ea;
  background: #f9fafb;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.camera-icon {
  width: 2rem;
  height: 2rem;
  background: #9333ea;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z'/%3E%3C/svg%3E") no-repeat center;
}

.photo-placeholder small {
  font-size: 0.75rem;
  opacity: 0.8;
}

.remove-photo-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-photo-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.close-icon {
  width: 0.875rem;
  height: 0.875rem;
  background: currentColor;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'/%3E%3C/svg%3E") no-repeat center;
}

.photo-help {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 1rem;
  font-style: italic;
}

.contact-section {
  background: rgba(243, 244, 246, 0.8);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
}

.contact-section h3 {
  color: #111827;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Ícones CSS */
.gender-icon {
  width: 1rem;
  height: 1rem;
  background: #9333ea;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'/%3E%3C/svg%3E") no-repeat center;
}

.location-icon {
  width: 1rem;
  height: 1rem;
  background: #9333ea;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'/%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'/%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'/%3E%3C/svg%3E") no-repeat center;
}

.contact-icon {
  width: 1rem;
  height: 1rem;
  background: #9333ea;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'/%3E%3C/svg%3E") no-repeat center;
}

.email-icon {
  width: 1rem;
  height: 1rem;
  background: #9333ea;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/%3E%3C/svg%3E") no-repeat center;
}

.whatsapp-icon {
  width: 1rem;
  height: 1rem;
  background: #9333ea;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'%3E%3Cpath d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'%3E%3Cpath d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488'/%3E%3C/svg%3E") no-repeat center;
}

.instagram-icon {
  width: 1rem;
  height: 1rem;
  background: #9333ea;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'%3E%3Cpath d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'%3E%3Cpath d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/%3E%3C/svg%3E") no-repeat center;
}

.arrow-left-icon {
  width: 1rem;
  height: 1rem;
  background: currentColor;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 19l-7-7 7-7'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 19l-7-7 7-7'/%3E%3C/svg%3E") no-repeat center;
}

.paw-icon {
  width: 1rem;
  height: 1rem;
  background: currentColor;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E") no-repeat center;
}

.check-icon {
  width: 1rem;
  height: 1rem;
  background: currentColor;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'/%3E%3C/svg%3E") no-repeat center;
}

.warning-icon {
  width: 1rem;
  height: 1rem;
  background: currentColor;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'/%3E%3C/svg%3E") no-repeat center;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.btn-submit {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.city-input-cadastro {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  color: #111827;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.city-input-cadastro:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  .cadastrar-pet-page {
    padding-top: 80px;
    
  }

  .cadastrar-container {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .photos-upload {
    grid-template-columns: 1fr;
  }

  .photo-preview {
    max-width: 100%;
    height: 200px;
  }

  .form-buttons {
    flex-direction: column;
  }

  .alert {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .cadastrar-pet-page {
    padding-top: 80px;
  }

  .cadastrar-container {
    padding: 1rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .photos-upload {
    gap: 0.5rem;
  }

  .photo-preview {
    height: 150px;
  }
}
</style>