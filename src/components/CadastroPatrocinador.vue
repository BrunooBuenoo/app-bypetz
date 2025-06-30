<template>
  <div class="cadastro-patrocinador">
    <!-- Formulário para novo patrocinador -->
    <div class="form-section">
      <h3>{{ editingPatrocinador ? 'Editar Patrocinador' : 'Adicionar Novo Patrocinador' }}</h3>
      <form @submit.prevent="addPatrocinador" class="patrocinador-form">
        <div class="form-row">
          <div class="form-group">
            <label for="nome">Nome da Empresa *</label>
            <input
              v-model="novoPatrocinador.nome"
              type="text"
              id="nome"
              placeholder="Ex: Royal Canin, Pedigree"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="site">Site/URL</label>
            <input
              v-model="novoPatrocinador.site"
              type="url"
              id="site"
              placeholder="https://www.empresa.com.br"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="tipo">Tipo de Patrocínio *</label>
            <select v-model="novoPatrocinador.tipo" id="tipo" required>
              <option value="">Selecione o tipo</option>
              <option value="premium">Premium</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
              <option value="parceiro">Parceiro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="status">Status *</label>
            <select v-model="novoPatrocinador.status" id="status" required>
              <option value="">Selecione o status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea
            v-model="novoPatrocinador.descricao"
            id="descricao"
            placeholder="Breve descrição sobre a empresa e parceria"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="contato">Email de Contato</label>
            <input
              v-model="novoPatrocinador.contato"
              type="email"
              id="contato"
              placeholder="contato@empresa.com.br"
            />
          </div>
          
          <div class="form-group">
            <label for="telefone">Telefone</label>
            <input
              v-model="novoPatrocinador.telefone"
              type="tel"
              id="telefone"
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="dataInicio">Data de Início da Parceria</label>
            <input
              v-model="novoPatrocinador.dataInicio"
              type="date"
              id="dataInicio"
            />
          </div>
          
          <div class="form-group">
            <label for="dataFim">Data de Fim da Parceria</label>
            <input
              v-model="novoPatrocinador.dataFim"
              type="date"
              id="dataFim"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="logo">Logo da Empresa</label>
          <div class="file-upload-container">
            <input
              type="file"
              id="logo"
              @change="handleFileUpload"
              accept="image/*"
              class="file-input"
            />
            <label for="logo" class="file-upload-label">
              <span v-if="!logoPreview">Escolher arquivo</span>
              <span v-else>Alterar logo</span>
            </label>
            <div v-if="logoPreview" class="logo-preview">
              <img :src="logoPreview" alt="Preview do logo" />
              <button type="button" @click="removeLogo" class="remove-logo">×</button>
            </div>
          </div>
        </div>
        
        <div class="form-buttons">
          <button 
            v-if="editingPatrocinador"
            type="button" 
            @click="cancelEdit" 
            class="btn-cancel"
          >
            Cancelar
          </button>
          
          <button type="submit" class="btn-add" :disabled="loading">
            {{ loading ? 'Salvando...' : (editingPatrocinador ? 'Atualizar Patrocinador' : 'Adicionar Patrocinador') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de patrocinadores -->
    <div class="patrocinadores-section">
      <h3>Patrocinadores Cadastrados</h3>
      
      <!-- Loading -->
      <div v-if="loadingPatrocinadores" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando patrocinadores...</p>
      </div>

      <!-- Lista -->
      <div v-else-if="patrocinadores.length > 0" class="patrocinadores-grid">
        <div v-for="patrocinador in patrocinadores" :key="patrocinador.id" class="patrocinador-card">
          <div class="patrocinador-header">
            <div class="patrocinador-logo">
              <img v-if="patrocinador.logo" :src="patrocinador.logo" :alt="patrocinador.nome" />
              <div v-else class="logo-placeholder">{{ patrocinador.nome.charAt(0) }}</div>
            </div>
            <div class="patrocinador-info">
              <h4>{{ patrocinador.nome }}</h4>
              <span class="patrocinador-tipo" :class="`tipo-${patrocinador.tipo}`">
                {{ patrocinador.tipo }}
              </span>
              <span class="patrocinador-status" :class="`status-${patrocinador.status}`">
                {{ patrocinador.status }}
              </span>
            </div>
          </div>

          <div class="patrocinador-details">
            <p v-if="patrocinador.descricao" class="patrocinador-descricao">
              {{ patrocinador.descricao }}
            </p>
            
            <div class="patrocinador-meta">
              <div v-if="patrocinador.site" class="meta-item">
                <strong>Site:</strong> 
                <a :href="patrocinador.site" target="_blank">{{ patrocinador.site }}</a>
              </div>
              <div v-if="patrocinador.contato" class="meta-item">
                <strong>Contato:</strong> {{ patrocinador.contato }}
              </div>
              <div v-if="patrocinador.telefone" class="meta-item">
                <strong>Telefone:</strong> {{ patrocinador.telefone }}
              </div>
              <div v-if="patrocinador.dataInicio" class="meta-item">
                <strong>Parceria desde:</strong> {{ formatDate(patrocinador.dataInicio) }}
              </div>
              <div v-if="patrocinador.dataFim" class="meta-item">
                <strong>Parceria até:</strong> {{ formatDate(patrocinador.dataFim) }}
              </div>
            </div>
          </div>

          <div class="patrocinador-actions">
            <button 
              @click="editPatrocinador(patrocinador)"
              class="btn-edit"
              title="Editar patrocinador"
            >
              Editar
            </button>
            
            <button 
              @click="deletePatrocinador(patrocinador.id)"
              class="btn-delete"
              title="Excluir patrocinador"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>

      <!-- Sem patrocinadores -->
      <div v-else class="no-patrocinadores">
        <div class="no-patrocinadores-icon">🤝</div>
        <h4>Nenhum patrocinador encontrado</h4>
        <p>Adicione o primeiro patrocinador usando o formulário acima</p>
      </div>
    </div>

    <!-- Mensagens -->
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
    
    <div v-if="errorMessage" class="alert alert-error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'CadastroPatrocinador',
  setup() {
    const loading = ref(false)
    const loadingPatrocinadores = ref(true)
    const patrocinadores = ref([])
    const logoPreview = ref('')
    const logoFile = ref(null)
    
    const novoPatrocinador = ref({
      nome: '',
      site: '',
      tipo: '',
      status: '',
      descricao: '',
      contato: '',
      telefone: '',
      dataInicio: '',
      dataFim: '',
      logo: ''
    })
    
    const editingPatrocinador = ref(null)
    const successMessage = ref('')
    const errorMessage = ref('')

    const formatDate = (dateString) => {
      if (!dateString) return 'Data não disponível'
      return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        logoFile.value = file
        const reader = new FileReader()
        reader.onload = (e) => {
          logoPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const removeLogo = () => {
      logoPreview.value = ''
      logoFile.value = null
      document.getElementById('logo').value = ''
    }

    const fetchPatrocinadores = async () => {
      try {
        const patrocinadoresQuery = query(
          collection(db, 'patrocinadores'),
          orderBy('nome', 'asc')
        )
        
        const querySnapshot = await getDocs(patrocinadoresQuery)
        const fetchedPatrocinadores = []
        
        querySnapshot.forEach((doc) => {
          fetchedPatrocinadores.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        patrocinadores.value = fetchedPatrocinadores
      } catch (error) {
        console.error('Erro ao buscar patrocinadores:', error)
        errorMessage.value = 'Erro ao carregar patrocinadores'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        loadingPatrocinadores.value = false
      }
    }

    const addPatrocinador = async () => {
      if (!novoPatrocinador.value.nome.trim()) return

      loading.value = true
      try {
        const patrocinadorData = {
          nome: novoPatrocinador.value.nome.trim(),
          site: novoPatrocinador.value.site.trim(),
          tipo: novoPatrocinador.value.tipo,
          status: novoPatrocinador.value.status,
          descricao: novoPatrocinador.value.descricao.trim(),
          contato: novoPatrocinador.value.contato.trim(),
          telefone: novoPatrocinador.value.telefone.trim(),
          dataInicio: novoPatrocinador.value.dataInicio,
          dataFim: novoPatrocinador.value.dataFim,
          logo: logoPreview.value,
          criadoEm: serverTimestamp()
        }

        if (editingPatrocinador.value) {
          // Atualizar patrocinador existente
          await updateDoc(doc(db, 'patrocinadores', editingPatrocinador.value.id), patrocinadorData)
          
          // Atualizar na lista local
          const index = patrocinadores.value.findIndex(p => p.id === editingPatrocinador.value.id)
          if (index !== -1) {
            patrocinadores.value[index] = { ...patrocinadorData, id: editingPatrocinador.value.id }
          }
          
          successMessage.value = 'Patrocinador atualizado com sucesso!'
          editingPatrocinador.value = null
        } else {
          // Adicionar novo patrocinador
          const docRef = await addDoc(collection(db, 'patrocinadores'), patrocinadorData)
          
          // Adicionar à lista local
          patrocinadores.value.push({
            id: docRef.id,
            ...patrocinadorData,
            criadoEm: new Date()
          })
          
          successMessage.value = 'Patrocinador adicionado com sucesso!'
        }

        // Ordenar lista
        patrocinadores.value.sort((a, b) => a.nome.localeCompare(b.nome))
        
        // Limpar formulário
        novoPatrocinador.value = {
          nome: '',
          site: '',
          tipo: '',
          status: '',
          descricao: '',
          contato: '',
          telefone: '',
          dataInicio: '',
          dataFim: '',
          logo: ''
        }
        removeLogo()
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      } catch (error) {
        console.error('Erro ao salvar patrocinador:', error)
        errorMessage.value = 'Erro ao salvar patrocinador: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        loading.value = false
      }
    }

    const editPatrocinador = (patrocinador) => {
      editingPatrocinador.value = patrocinador
      novoPatrocinador.value = { ...patrocinador }
      logoPreview.value = patrocinador.logo || ''
      
      // Scroll para o formulário
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' })
    }

    const cancelEdit = () => {
      editingPatrocinador.value = null
      novoPatrocinador.value = {
        nome: '',
        site: '',
        tipo: '',
        status: '',
        descricao: '',
        contato: '',
        telefone: '',
        dataInicio: '',
        dataFim: '',
        logo: ''
      }
      removeLogo()
    }

    const deletePatrocinador = async (patrocinadorId) => {
      if (!confirm('Tem certeza que deseja excluir este patrocinador?')) return

      try {
        await deleteDoc(doc(db, 'patrocinadores', patrocinadorId))
        
        // Remover da lista local
        patrocinadores.value = patrocinadores.value.filter(p => p.id !== patrocinadorId)
        
        successMessage.value = 'Patrocinador excluído com sucesso!'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      } catch (error) {
        console.error('Erro ao excluir patrocinador:', error)
        errorMessage.value = 'Erro ao excluir patrocinador: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    onMounted(async () => {
      await fetchPatrocinadores()
    })

    return {
      loading,
      loadingPatrocinadores,
      patrocinadores,
      novoPatrocinador,
      editingPatrocinador,
      successMessage,
      errorMessage,
      logoPreview,
      formatDate,
      handleFileUpload,
      removeLogo,
      addPatrocinador,
      editPatrocinador,
      cancelEdit,
      deletePatrocinador
    }
  }
}
</script>

<style scoped>
.cadastro-patrocinador {
  width: 100%;
}

.form-section {
  background: rgba(140, 82, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid rgba(140, 82, 255, 0.1);
}

.form-section h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.patrocinador-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid rgba(140, 82, 255, 0.3);
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8C52FF;
  box-shadow: 0 0 0 3px rgba(140, 82, 255, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.file-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  display: none;
}

.file-upload-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
  border: 1px solid rgba(140, 82, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 600;
}

.file-upload-label:hover {
  background: rgba(140, 82, 255, 0.15);
}

.logo-preview {
  position: relative;
  width: 120px;
  height: 80px;
  border: 1px solid rgba(140, 82, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  background: #f9f9f9;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.remove-logo {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  background: rgba(244, 67, 54, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-add,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
}

.btn-cancel:hover {
  background: rgba(140, 82, 255, 0.15);
}

.btn-add {
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  color: white;
}

.btn-add:hover:not(:disabled) {
  background: linear-gradient(135deg, #6B3DD6, #4A2B9A);
  transform: translateY(-2px);
}

.btn-add:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.patrocinadores-section {
  margin-top: 2rem;
}

.patrocinadores-section h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(140, 82, 255, 0.3);
  border-top: 3px solid #8C52FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.patrocinadores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.patrocinador-card {
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(140, 82, 255, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.patrocinador-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.patrocinador-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(140, 82, 255, 0.05);
  border-bottom: 1px solid rgba(140, 82, 255, 0.1);
}

.patrocinador-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(140, 82, 255, 0.2);
}

.patrocinador-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8C52FF;
}

.patrocinador-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 700;
}

.patrocinador-tipo,
.patrocinador-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
}

.tipo-premium { background: #FFD700; color: #8B4513; }
.tipo-gold { background: #FFA500; color: white; }
.tipo-silver { background: #C0C0C0; color: #333; }
.tipo-bronze { background: #CD7F32; color: white; }
.tipo-parceiro { background: #8C52FF; color: white; }

.status-ativo { background: #22C55E; color: white; }
.status-inativo { background: #EF4444; color: white; }
.status-pendente { background: #F59E0B; color: white; }

.patrocinador-details {
  padding: 1.5rem;
}

.patrocinador-descricao {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.patrocinador-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  font-size: 0.9rem;
  color: #555;
}

.meta-item strong {
  color: #333;
}

.meta-item a {
  color: #8C52FF;
  text-decoration: none;
}

.meta-item a:hover {
  text-decoration: underline;
}

.patrocinador-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: rgba(140, 82, 255, 0.02);
  border-top: 1px solid rgba(140, 82, 255, 0.1);
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-edit {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.btn-edit:hover {
  background: rgba(33, 150, 243, 0.2);
}

.btn-delete {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.btn-delete:hover {
  background: rgba(244, 67, 54, 0.2);
}

.no-patrocinadores {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
}

.no-patrocinadores-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-patrocinadores h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
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
  background: rgba(34, 197, 94, 0.95);
  color: white;
  border: 1px solid #22C55E;
}

.alert-error {
  background: rgba(239, 68, 68, 0.95);
  color: white;
  border: 1px solid #EF4444;
}

@media (max-width: 768px) {
  .form-section {
    padding: 1.5rem;
    margin: 0 1rem 2rem 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-buttons {
    flex-direction: column;
  }
  
  .patrocinadores-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .patrocinador-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .patrocinador-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .cadastro-patrocinador {
    padding: 0 0.5rem;
  }
  
  .form-section {
    padding: 1rem;
    margin: 0 0.5rem 1.5rem 0.5rem;
  }
  
  .patrocinador-logo {
    width: 50px;
    height: 50px;
  }
  
  .logo-placeholder {
    font-size: 1.2rem;
  }
}
</style>