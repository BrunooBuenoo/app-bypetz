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
                <i class="fas fa-camera"></i>
                <span>Foto {{ index + 1 }}</span>
                <small>Clique para adicionar</small>
              </div>
              <button 
                v-if="photo" 
                type="button" 
                class="remove-photo-btn"
                @click.stop="removePhoto(index)"
              >
                <i class="fas fa-times"></i>
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
            <label for="gender"><i class="fas fa-venus-mars"></i> Gênero</label>
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
            
                <label  for="city"><i class="fas fa-map-marker-alt"></i> Cidade *</label>
                <CityAutocomplete id="citis"
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
          <h3><i class="fas fa-address-book"></i> Informações de Contato</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="email"><i class="fas fa-envelope"></i> Email</label>
              <input
                v-model="petForm.email"
                type="email"
                id="email"
                placeholder="seu@email.com"
              />
            </div>

            <div class="form-group">
              <label for="phone"><i class="fab fa-whatsapp"></i> WhatsApp *</label>
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
            <label for="instagram"><i class="fab fa-instagram"></i> Instagram (opcional)</label>
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
            <i class="fas fa-arrow-left"></i>
            Cancelar
          </button>
          <button type="submit" class="btn-submit" :disabled="loading">
            <i class="fas fa-paw"></i>
            {{ loading ? 'Cadastrando...' : 'Cadastrar Pet' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Mensagens -->
    <div v-if="successMessage" class="alert alert-success">
      <i class="fas fa-check-circle"></i>
      {{ successMessage }}
    </div>
    <div v-if="error" class="alert alert-error">
      <i class="fas fa-exclamation-triangle"></i>
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import CityAutocomplete from '../components/CityAutocomplete.vue'

export default {
  name: 'PaginaCadastrarPet',
  components: {
    CityAutocomplete
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
      photos: [null, null, null] // Array para até 3 fotos
    })

    const handleCitySelected = (city) => {
      // Armazenar dados da cidade selecionada
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
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        error.value = 'Por favor, selecione apenas arquivos de imagem'
        return
      }
      
      // Validar tamanho (máximo 10MB para permitir maior qualidade)
      if (file.size > 10 * 1024 * 1024) {
        error.value = 'A imagem deve ter no máximo 10MB'
        return
      }
      
      try {
        // Redimensionar e converter para base64 com alta qualidade
        const optimizedBase64 = await resizeAndConvertToBase64(file, 1200, 900, 0.92)
        petForm.value.photos[index] = optimizedBase64
        
        // Limpar erro se houver
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
          
          // Calcular novas dimensões mantendo proporção
          const aspectRatio = width / height
          
          // Só redimensionar se a imagem for maior que os limites
          if (width > maxWidth || height > maxHeight) {
            if (aspectRatio > 1) {
              // Paisagem - limitar pela largura
              if (width > maxWidth) {
                width = maxWidth
                height = width / aspectRatio
              }
            } else {
              // Retrato - limitar pela altura
              if (height > maxHeight) {
                height = maxHeight
                width = height * aspectRatio
              }
            }
          }
          
          // Configurar canvas com as dimensões calculadas
          canvas.width = width
          canvas.height = height
          
          // Melhorar qualidade do redimensionamento
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          
          // Desenhar imagem redimensionada
          ctx.drawImage(img, 0, 0, width, height)
          
          // Determinar formato e qualidade baseado no arquivo original
          let format = 'image/jpeg'
          let finalQuality = quality
          
          // Preservar PNG para imagens com transparência
          if (file.type === 'image/png') {
            // Verificar se tem transparência
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
              finalQuality = 1.0 // PNG não usa compressão com perda
            }
          }
          
          // Converter para base64
          const base64 = canvas.toDataURL(format, finalQuality)
          resolve(base64)
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

    const handleSubmit = async () => {
      if (!user.value) {
        error.value = 'Você precisa estar logado para cadastrar um pet'
        return
      }

      // Verificar se pelo menos uma foto foi adicionada
      const hasPhotos = petForm.value.photos.some(photo => photo !== null)
      if (!hasPhotos) {
        error.value = 'Adicione pelo menos uma foto do pet'
        return
      }

      // Verificar se cidade foi selecionada
      if (!petForm.value.city) {
        error.value = 'Selecione uma cidade'
        return
      }

      try {
        loading.value = true
        error.value = ''

        // Filtrar apenas as fotos que não são null
        const validPhotos = petForm.value.photos.filter(photo => photo !== null)

        // Preparar dados do pet
        const petData = {
          name: petForm.value.name,
          type: petForm.value.type,
          species: petForm.value.species || 'Não informado',
          gender: petForm.value.gender || '',
          status: petForm.value.status,
          city: petForm.value.city, // Cidade completa "Nome - UF"
          cityData: petForm.value.cityData || null, // Dados estruturados da cidade
          lastSeen: petForm.value.lastSeen || '', // Local específico
          description: petForm.value.description || '',
          email: petForm.value.email || user.value.email,
          phone: petForm.value.phone || '',
          instagram: petForm.value.instagram || '',
          photos: validPhotos, // Array de fotos
          photo: validPhotos[0] || null, // Primeira foto como principal (compatibilidade)
          userId: user.value.uid,
          userEmail: user.value.email,
          userName: user.value.displayName || 'Usuário',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        // Salvar no Firestore
        await addDoc(collection(db, 'pets'), petData)

        successMessage.value = 'Pet cadastrado com sucesso!'
        
        // Limpar formulário
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

        // Redirecionar após 2 segundos
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
#citis{
    padding: 1rem;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    background: white;
    color: #9CA3AF;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.cadastrar-pet-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.cadastrar-container {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  background: transparent;
}

.header h1 {
  color: #8B5CF6;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.header p {
  color: #6B7280;
  font-size: 1.1rem;
}

.pet-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #374151;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group label i {
  color: #8B5CF6;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  background: white;
  color: #9CA3AF;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9CA3AF;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-group select option {
  background: white;
  color: #374151;
}

.field-help {
  color: #6B7280;
  font-size: 0.85rem;
  font-style: italic;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.photo-section {
  background: #F9FAFB;
  padding: 2rem;
  border-radius: 16px;
  border: 2px dashed #D1D5DB;
}

.photos-upload {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  justify-items: center;
}

.photo-preview {
  position: relative;
  width: 180px;
  height: 140px;
  border: 2px dashed #D1D5DB;
  border-radius: 12px;
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
  border-color: #8B5CF6;
  background: #F3F4F6;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  text-align: center;
  color: #6B7280;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.photo-placeholder i {
  font-size: 2rem;
  color: #8B5CF6;
}

.photo-placeholder small {
  font-size: 0.75rem;
  opacity: 0.8;
}

.remove-photo-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-photo-btn:hover {
  background: #DC2626;
  transform: scale(1.1);
}

.photo-help {
  text-align: center;
  color: #6B7280;
  font-size: 0.9rem;
  margin-top: 1rem;
  font-style: italic;
}

.contact-section {
  background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #D1D5DB;
}

.contact-section h3 {
  color: #374151;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-section h3 i {
  color: #8B5CF6;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-cancel {
  background: #F3F4F6;
  color: #6B7280;
  border: 2px solid #D1D5DB;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel:hover {
  background: #E5E7EB;
  color: #374151;
}

.btn-submit {
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #7C3AED, #9333EA);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-success {
  background: rgba(34, 197, 94, 0.95);
  color: white;
  border: 1px solid #22C55E;
}

.alert-error {
  background: rgba(239, 68, 68, 0.95);
  color: white;
  border: 1px solid #EF4444;
}

/* Estilos específicos para o autocomplete de cidade no cadastro */
.city-input-cadastro {
  padding: 1rem;
  border: none; /* remove a borda */
  border-radius: 12px;
  background: white;
  color: #0f0f0f;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  
}

::v-deep(.input-container input) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  font-size: 16px;
  
}


.city-input-cadastro:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

@media (max-width: 768px) {
  .cadastrar-pet-page {
    padding: 1rem;
  }
  
  .cadastrar-container {
    padding: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .photos-upload {
    grid-template-columns: 1fr;
  }
  
  .photo-preview {
    width: 100%;
    max-width: 250px;
    height: 180px;
  }
  
  .form-buttons {
    flex-direction: column;
  }
  
  .header h1 {
    font-size: 2rem;
  }
}
</style>