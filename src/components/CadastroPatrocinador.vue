<template>
  <div class="patrocinadores">
    <!-- Header -->
    <div class="section-header">
      <div class="header-content">
        <h2 class="section-title">
          <div class="title-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7006C21.7033 16.047 20.9999 15.5866 20.2 15.3954" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13C16.8003 3.32127 17.5037 3.78204 18.0098 4.43564C18.5159 5.08923 18.8002 5.89971 18.8002 6.735C18.8002 7.57029 18.5159 8.38077 18.0098 9.03436C17.5037 9.68796 16.8003 10.1487 16 10.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          Gerenciar Patrocinadores
        </h2>
        <p class="section-subtitle">Gerencie parceiros e patrocinadores da plataforma</p>
      </div>
      
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ activeSponsors.length }}</span>
            <span class="stat-label">Ativos</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon total">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ sponsors.length }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulário -->
    <div class="form-section">
      <div class="form-header">
        <h3 class="form-title">
          {{ editingPatrocinador ? 'Editar Patrocinador' : 'Novo Patrocinador' }}
        </h3>
        <div v-if="editingPatrocinador" class="editing-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Editando
        </div>
      </div>

      <form @submit.prevent="submitPatrocinador" class="patrocinador-form">
        <!-- Upload de Logo -->
        <div class="form-section-group">
          <h4 class="group-title">Logo do Patrocinador</h4>
          <div class="logo-upload-container">
            <div class="logo-upload-area" @click="triggerFileInput">
              <img v-if="patrocinadorForm.logo" :src="patrocinadorForm.logo" alt="Logo Preview" class="logo-preview" />
              <div v-else class="upload-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                  <polyline points="21,15 16,10 5,21" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span class="upload-text">Clique para adicionar logo</span>
                <span class="upload-hint">PNG, JPG até 5MB</span>
              </div>
              <button 
                v-if="patrocinadorForm.logo" 
                type="button" 
                class="remove-logo-btn"
                @click.stop="removeLogo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*" 
              @change="handleLogoChange" 
              style="display: none"
            />
          </div>
        </div>

        <!-- Informações Básicas -->
        <div class="form-section-group">
          <h4 class="group-title">Informações Básicas</h4>
          <div class="form-grid">
            <div class="form-field">
              <label for="nome" class="field-label">Nome do Patrocinador *</label>
              <input
                v-model="patrocinadorForm.nome"
                type="text"
                id="nome"
                placeholder="Ex: Empresa ABC, Marca XYZ"
                required
                class="field-input"
              />
            </div>

            <div class="form-field">
              <label for="status" class="field-label">Status *</label>
              <select v-model="patrocinadorForm.status" id="status" required class="field-select">
                <option value="">Selecione o status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>

            <div class="form-field">
              <label for="email" class="field-label">Email de Contato</label>
              <input
                v-model="patrocinadorForm.email"
                type="email"
                id="email"
                placeholder="contato@empresa.com"
                class="field-input"
              />
            </div>

            <div class="form-field">
              <label for="telefone" class="field-label">Telefone</label>
              <input
                v-model="patrocinadorForm.telefone"
                type="tel"
                id="telefone"
                placeholder="(11) 99999-9999"
                class="field-input"
              />
            </div>

            <div class="form-field">
              <label for="website" class="field-label">Website</label>
              <input
                v-model="patrocinadorForm.website"
                type="url"
                id="website"
                placeholder="https://www.empresa.com"
                class="field-input"
              />
            </div>

            <div class="form-field">
              <label for="categoria" class="field-label">Categoria</label>
              <select v-model="patrocinadorForm.categoria" id="categoria" class="field-select">
                <option value="">Selecione uma categoria</option>
                <option value="alimentacao">Alimentação</option>
                <option value="veterinaria">Veterinária</option>
                <option value="petshop">Pet Shop</option>
                <option value="servicos">Serviços</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="outros">Outros</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Período de Patrocínio -->
        <div class="form-section-group">
          <h4 class="group-title">Período de Patrocínio</h4>
          <div class="form-grid">
            <div class="form-field">
              <label for="dataInicio" class="field-label">Data de Início</label>
              <input
                v-model="patrocinadorForm.dataInicio"
                type="date"
                id="dataInicio"
                class="field-input"
              />
            </div>

            <div class="form-field">
              <label for="dataFim" class="field-label">Data de Fim</label>
              <input
                v-model="patrocinadorForm.dataFim"
                type="date"
                id="dataFim"
                class="field-input"
              />
            </div>
          </div>
        </div>

        <!-- Descrição -->
        <div class="form-section-group">
          <h4 class="group-title">Descrição</h4>
          <div class="form-field">
            <label for="descricao" class="field-label">Descrição do Patrocinador</label>
            <textarea
              v-model="patrocinadorForm.descricao"
              id="descricao"
              placeholder="Descreva o patrocinador, seus produtos/serviços e benefícios oferecidos"
              rows="4"
              class="field-textarea"
            ></textarea>
          </div>
        </div>

        <!-- Botões -->
        <div class="form-actions">
          <button 
            v-if="editingPatrocinador"
            type="button" 
            @click="cancelEdit" 
            class="btn secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
            Cancelar
          </button>
          
          <button type="submit" class="btn primary" :disabled="loading">
            <svg v-if="loading" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2"/>
              <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2"/>
              <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ loading ? 'Salvando...' : (editingPatrocinador ? 'Atualizar Patrocinador' : 'Adicionar Patrocinador') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Patrocinadores -->
    <div class="patrocinadores-section">
      <div class="patrocinadores-header">
        <div class="header-content">
          <h3 class="patrocinadores-title">Patrocinadores Cadastrados</h3>
          <p class="patrocinadores-subtitle">{{ filteredPatrocinadores.length }} patrocinador(es) encontrado(s)</p>
        </div>
        
        <!-- Filtros -->
        <div class="patrocinadores-filters">
          <div class="search-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="search-icon">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
            </svg>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nome..."
              class="search-input"
            />
          </div>
          
          <select v-model="filterStatus" class="filter-select">
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="pendente">Pendente</option>
          </select>
          
          <select v-model="filterCategoria" class="filter-select">
            <option value="">Todas as categorias</option>
            <option value="alimentacao">Alimentação</option>
            <option value="veterinaria">Veterinária</option>
            <option value="petshop">Pet Shop</option>
            <option value="servicos">Serviços</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="outros">Outros</option>
          </select>
        </div>
      </div>
      
      <!-- Loading -->
      <div v-if="loadingPatrocinadores" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">Carregando patrocinadores...</p>
      </div>

      <!-- Grid de Patrocinadores -->
      <div v-else-if="filteredPatrocinadores.length > 0" class="patrocinadores-grid">
        <div v-for="patrocinador in filteredPatrocinadores" :key="patrocinador.id" class="patrocinador-card" @click="openModal(patrocinador)">
          <div class="patrocinador-header">
            <div class="patrocinador-logo">
              <img v-if="patrocinador.logo" :src="patrocinador.logo" :alt="patrocinador.nome" />
              <div v-else class="logo-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                  <polyline points="21,15 16,10 5,21" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>
            
            <div class="patrocinador-status">
              <span class="status-badge" :class="patrocinador.status">
                {{ getStatusLabel(patrocinador.status) }}
              </span>
            </div>
          </div>
          
          <div class="patrocinador-content">
            <h4 class="patrocinador-nome">{{ patrocinador.nome }}</h4>
            
            <div v-if="patrocinador.categoria" class="patrocinador-categoria">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7H17L19 9V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V9L7 7Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              {{ getCategoriaLabel(patrocinador.categoria) }}
            </div>
            
            <p v-if="patrocinador.descricao" class="patrocinador-descricao">{{ patrocinador.descricao }}</p>
            
            <div class="patrocinador-info">
              <div v-if="patrocinador.email" class="info-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ patrocinador.email }}
              </div>
              
              <div v-if="patrocinador.telefone" class="info-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V19.92C22 20.9 21.11 21.74 20.13 21.95C19.88 21.98 19.62 22 19.35 22C8.93 22 0.68 13.75 0.68 3.32C0.68 3.05 0.7 2.79 0.72 2.54C0.93 1.56 1.77 0.67 2.75 0.67H5.75C6.24 0.67 6.66 1.02 6.75 1.5C6.84 2.25 6.98 2.99 7.17 3.71C7.3 4.12 7.18 4.57 6.89 4.84L5.5 6.23C6.57 8.69 8.31 10.43 10.77 11.5L12.16 10.11C12.43 9.82 12.88 9.7 13.29 9.83C14.01 10.02 14.75 10.16 15.5 10.25C15.98 10.34 16.33 10.76 16.33 11.25V14.25C16.33 14.73 15.98 15.15 15.5 15.24C15.25 15.26 14.99 15.28 14.72 15.28C13.73 15.28 12.78 15.11 11.89 14.8" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ patrocinador.telefone }}
              </div>
              
              <div v-if="patrocinador.website" class="info-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <a :href="patrocinador.website" target="_blank" rel="noopener noreferrer">
                  {{ formatWebsite(patrocinador.website) }}
                </a>
              </div>
            </div>
            
            <div v-if="patrocinador.dataInicio || patrocinador.dataFim" class="patrocinador-periodo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>
                {{ formatPeriodo(patrocinador.dataInicio, patrocinador.dataFim) }}
              </span>
            </div>
          </div>
          
          <div class="patrocinador-actions">
            <button 
              @click.stop="editPatrocinador(patrocinador)"
              class="action-btn edit"
              title="Editar patrocinador"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <button 
              @click.stop="deletePatrocinador(patrocinador.id)"
              class="action-btn delete"
              title="Excluir patrocinador"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                <path d="M19,6V20C19,21 18,22 17,22H7C6,22 5,21 5,20V6M8,6V4C8,3 9,2 10,2H14C15,2 16,3 16,4V6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Estado Vazio -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7006C21.7033 16.047 20.9999 15.5866 20.2 15.3954" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 3.13C16.8003 3.32127 17.5037 3.78204 18.0098 4.43564C18.5159 5.08923 18.8002 5.89971 18.8002 6.735C18.8002 7.57029 18.5159 8.38077 18.0098 9.03436C17.5037 9.68796 16.8003 10.1487 16 10.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="empty-title">
          {{ searchTerm || filterStatus || filterCategoria ? 'Nenhum patrocinador encontrado' : 'Nenhum patrocinador cadastrado' }}
        </h3>
        <p class="empty-description">
          {{ searchTerm || filterStatus || filterCategoria 
            ? 'Tente ajustar os filtros para encontrar patrocinadores' 
            : 'Adicione o primeiro patrocinador usando o formulário acima' }}
        </p>
      </div>
    </div>

    <!-- Notificações -->
    <div v-if="successMessage" class="notification success">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
      </svg>
      {{ successMessage }}
    </div>
    
    <div v-if="errorMessage" class="notification error">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
      </svg>
      {{ errorMessage }}
    </div>

    <!-- Modal do Patrocinador -->
    <PatrocinadorModal
      v-if="selectedPatrocinador"
      :patrocinador="selectedPatrocinador"
      :is-open="isModalOpen"
      @close="closeModal"
      @edit="handleModalEdit"
      @status-change="handleModalStatusChange"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
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
import PatrocinadorModal from './PatrocinadorModal.vue'

export default {
  name: 'PatrocinadoresClean',
  components: {
    PatrocinadorModal
  },
  setup() {
    const loading = ref(false)
    const loadingPatrocinadores = ref(true)
    const sponsors = ref([])
    const editingPatrocinador = ref(null)
    const successMessage = ref('')
    const errorMessage = ref('')
    const fileInput = ref(null)
    const searchTerm = ref('')
    const filterStatus = ref('')
    const filterCategoria = ref('')

    const selectedPatrocinador = ref(null)
    const isModalOpen = ref(false)

    const patrocinadorForm = ref({
      nome: '',
      email: '',
      telefone: '',
      website: '',
      categoria: '',
      status: '',
      dataInicio: '',
      dataFim: '',
      descricao: '',
      logo: ''
    })

    const activeSponsors = computed(() => {
      return sponsors.value.filter(sponsor => sponsor.status === 'ativo')
    })

    const filteredPatrocinadores = computed(() => {
      let filtered = sponsors.value

      if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase()
        filtered = filtered.filter(patrocinador => 
          patrocinador.nome.toLowerCase().includes(search)
        )
      }

      if (filterStatus.value) {
        filtered = filtered.filter(patrocinador => patrocinador.status === filterStatus.value)
      }

      if (filterCategoria.value) {
        filtered = filtered.filter(patrocinador => patrocinador.categoria === filterCategoria.value)
      }

      return filtered
    })

    const getStatusLabel = (status) => {
      const labels = {
        'ativo': 'Ativo',
        'inativo': 'Inativo',
        'pendente': 'Pendente'
      }
      return labels[status] || status
    }

    const getCategoriaLabel = (categoria) => {
      const labels = {
        'alimentacao': 'Alimentação',
        'veterinaria': 'Veterinária',
        'petshop': 'Pet Shop',
        'servicos': 'Serviços',
        'tecnologia': 'Tecnologia',
        'outros': 'Outros'
      }
      return labels[categoria] || categoria
    }

    const formatWebsite = (website) => {
      return website.replace(/^https?:\/\//, '').replace(/\/$/, '')
    }

    const formatPeriodo = (dataInicio, dataFim) => {
      const formatDate = (date) => {
        if (!date) return null
        return new Date(date).toLocaleDateString('pt-BR')
      }

      const inicio = formatDate(dataInicio)
      const fim = formatDate(dataFim)

      if (inicio && fim) {
        return `${inicio} - ${fim}`
      } else if (inicio) {
        return `A partir de ${inicio}`
      } else if (fim) {
        return `Até ${fim}`
      }
      return 'Período indefinido'
    }

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleLogoChange = async (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      if (!file.type.startsWith('image/')) {
        errorMessage.value = 'Por favor, selecione apenas arquivos de imagem'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        errorMessage.value = 'A imagem deve ter no máximo 5MB'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }
      
      try {
        const base64 = await convertToBase64(file)
        patrocinadorForm.value.logo = base64
        errorMessage.value = ''
      } catch (err) {
        errorMessage.value = 'Erro ao processar imagem: ' + err.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          let { width, height } = img
          const maxWidth = 400
          const maxHeight = 400
          
          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height
            
            if (aspectRatio > 1) {
              width = maxWidth
              height = width / aspectRatio
            } else {
              height = maxHeight
              width = height * aspectRatio
            }
          }
          
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          
          const base64 = canvas.toDataURL('image/jpeg', 0.8)
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

    const removeLogo = () => {
      patrocinadorForm.value.logo = ''
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
        
        sponsors.value = fetchedPatrocinadores
      } catch (error) {
        console.error('Erro ao buscar patrocinadores:', error)
        errorMessage.value = 'Erro ao carregar patrocinadores'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      } finally {
        loadingPatrocinadores.value = false
      }
    }

    const submitPatrocinador = async () => {
      if (!patrocinadorForm.value.nome.trim() || !patrocinadorForm.value.status) {
        errorMessage.value = 'Preencha todos os campos obrigatórios'
        setTimeout(() => { errorMessage.value = '' }, 3000)
        return
      }

      loading.value = true
      try {
        const patrocinadorData = {
          nome: patrocinadorForm.value.nome.trim(),
          email: patrocinadorForm.value.email.trim(),
          telefone: patrocinadorForm.value.telefone.trim(),
          website: patrocinadorForm.value.website.trim(),
          categoria: patrocinadorForm.value.categoria,
          status: patrocinadorForm.value.status,
          dataInicio: patrocinadorForm.value.dataInicio || null,
          dataFim: patrocinadorForm.value.dataFim || null,
          descricao: patrocinadorForm.value.descricao.trim(),
          logo: patrocinadorForm.value.logo,
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp()
        }

        if (editingPatrocinador.value) {
          await updateDoc(doc(db, 'patrocinadores', editingPatrocinador.value.id), {
            ...patrocinadorData,
            criadoEm: editingPatrocinador.value.criadoEm
          })

          const index = sponsors.value.findIndex(p => p.id === editingPatrocinador.value.id)
          if (index !== -1) {
            sponsors.value[index] = {
              id: editingPatrocinador.value.id,
              ...patrocinadorData,
              criadoEm: editingPatrocinador.value.criadoEm,
              atualizadoEm: new Date()
            }
          }

          successMessage.value = 'Patrocinador atualizado com sucesso!'
          editingPatrocinador.value = null
        } else {
          const docRef = await addDoc(collection(db, 'patrocinadores'), patrocinadorData)
          
          sponsors.value.push({
            id: docRef.id,
            ...patrocinadorData,
            criadoEm: new Date(),
            atualizadoEm: new Date()
          })

          successMessage.value = 'Patrocinador adicionado com sucesso!'
        }

        sponsors.value.sort((a, b) => a.nome.localeCompare(b.nome))

        patrocinadorForm.value = {
          nome: '',
          email: '',
          telefone: '',
          website: '',
          categoria: '',
          status: '',
          dataInicio: '',
          dataFim: '',
          descricao: '',
          logo: ''
        }
        
        setTimeout(() => { successMessage.value = '' }, 3000)
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
      
      patrocinadorForm.value = {
        nome: patrocinador.nome,
        email: patrocinador.email || '',
        telefone: patrocinador.telefone || '',
        website: patrocinador.website || '',
        categoria: patrocinador.categoria || '',
        status: patrocinador.status,
        dataInicio: patrocinador.dataInicio || '',
        dataFim: patrocinador.dataFim || '',
        descricao: patrocinador.descricao || '',
        logo: patrocinador.logo || ''
      }
      
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' })
    }

    const cancelEdit = () => {
      editingPatrocinador.value = null
      patrocinadorForm.value = {
        nome: '',
        email: '',
        telefone: '',
        website: '',
        categoria: '',
        status: '',
        dataInicio: '',
        dataFim: '',
        descricao: '',
        logo: ''
      }
    }

    const deletePatrocinador = async (patrocinadorId) => {
      if (!confirm('Tem certeza que deseja excluir este patrocinador?')) return

      try {
        await deleteDoc(doc(db, 'patrocinadores', patrocinadorId))
        sponsors.value = sponsors.value.filter(p => p.id !== patrocinadorId)
        successMessage.value = 'Patrocinador excluído com sucesso!'
        setTimeout(() => { successMessage.value = '' }, 3000)
      } catch (error) {
        console.error('Erro ao excluir patrocinador:', error)
        errorMessage.value = 'Erro ao excluir patrocinador: ' + error.message
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    const openModal = (patrocinador) => {
      selectedPatrocinador.value = patrocinador
      isModalOpen.value = true
    }

    const closeModal = () => {
      selectedPatrocinador.value = null
      isModalOpen.value = false
    }

    const handleModalEdit = (patrocinador) => {
      editPatrocinador(patrocinador)
      closeModal()
    }

    const handleModalStatusChange = async (updatedPatrocinador) => {
      try {
        await updateDoc(doc(db, 'patrocinadores', updatedPatrocinador.id), {
          status: updatedPatrocinador.status,
          atualizadoEm: serverTimestamp()
        })

        const index = sponsors.value.findIndex(p => p.id === updatedPatrocinador.id)
        if (index !== -1) {
          sponsors.value[index] = {
            ...sponsors.value[index],
            status: updatedPatrocinador.status,
            atualizadoEm: new Date()
          }
        }

        selectedPatrocinador.value = { ...selectedPatrocinador.value, status: updatedPatrocinador.status }
        
        successMessage.value = `Patrocinador ${updatedPatrocinador.status === 'ativo' ? 'ativado' : 'desativado'} com sucesso!`
        setTimeout(() => { successMessage.value = '' }, 3000)
      } catch (error) {
        console.error('Erro ao alterar status:', error)
        errorMessage.value = 'Erro ao alterar status do patrocinador'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }

    onMounted(() => {
      fetchPatrocinadores()
    })

    return {
      loading,
      loadingPatrocinadores,
      sponsors,
      activeSponsors,
      editingPatrocinador,
      patrocinadorForm,
      successMessage,
      errorMessage,
      fileInput,
      searchTerm,
      filterStatus,
      filterCategoria,
      selectedPatrocinador,
      isModalOpen,
      filteredPatrocinadores,
      getStatusLabel,
      getCategoriaLabel,
      formatWebsite,
      formatPeriodo,
      triggerFileInput,
      handleLogoChange,
      removeLogo,
      submitPatrocinador,
      editPatrocinador,
      cancelEdit,
      deletePatrocinador,
      openModal,
      closeModal,
      handleModalEdit,
      handleModalStatusChange
    }
  }
}
</script>

<style scoped>
.patrocinadores {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-content {
  flex: 1;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  border-radius: 12px;
  color: white;
}

.section-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

/* Stats Cards */
.stats-cards {
  display: flex;
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 160px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: white;
}

.stat-icon.active {
  background: linear-gradient(135deg, #059669, #10b981);
}

.stat-icon.total {
  background: linear-gradient(135deg, #9333ea, #2563eb);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Form Section */
.form-section {
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.editing-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #dbeafe;
  color: #2563eb;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.patrocinador-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Form Section Groups */
.form-section-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.group-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

/* Logo Upload */
.logo-upload-container {
  display: flex;
  justify-content: center;
}

.logo-upload-area {
  position: relative;
  width: 200px;
  height: 200px;
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

.logo-upload-area:hover {
  border-color: #9333ea;
  background: #faf5ff;
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
  text-align: center;
  padding: 1rem;
}

.upload-placeholder svg {
  color: #9333ea;
}

.upload-text {
  font-size: 1rem;
  font-weight: 600;
}

.upload-hint {
  font-size: 0.875rem;
  color: #9ca3af;
}

.remove-logo-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
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

.remove-logo-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Form Fields */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.field-input,
.field-select,
.field-textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #111827;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.field-input:focus,
.field-select:focus,
.field-textarea:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.field-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn.secondary:hover {
  background: #e5e7eb;
}

.btn.primary {
  background: linear-gradient(135deg, #9333ea, #2563eb);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed, #1d4ed8);
  transform: translateY(-1px);
}

.btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Patrocinadores Section */
.patrocinadores-section {
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.patrocinadores-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.patrocinadores-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.patrocinadores-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  font-weight: 500;
}

/* Filters */
.patrocinadores-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #111827;
  font-size: 0.875rem;
  min-width: 250px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #111827;
  font-size: 0.875rem;
  min-width: 160px;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #9333ea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

/* Patrocinadores Grid */
.patrocinadores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.patrocinador-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.patrocinador-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Patrocinador Header */
.patrocinador-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e5e7eb;
}

.patrocinador-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.patrocinador-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  color: #9ca3af;
}

.patrocinador-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.ativo {
  background: #d1fae5;
  color: #059669;
}

.status-badge.inativo {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.pendente {
  background: #fef3c7;
  color: #d97706;
}

/* Patrocinador Content */
.patrocinador-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.patrocinador-nome {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.4;
}

.patrocinador-categoria {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.patrocinador-categoria svg {
  color: #9333ea;
}

.patrocinador-descricao {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.patrocinador-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.info-item svg {
  color: #9333ea;
  flex-shrink: 0;
}

.info-item a {
  color: #2563eb;
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}

.patrocinador-periodo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.patrocinador-periodo svg {
  color: #9333ea;
}

/* Patrocinador Actions */
.patrocinador-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.edit {
  background: #dbeafe;
  color: #2563eb;
}

.action-btn.edit:hover {
  background: #bfdbfe;
  transform: scale(1.1);
}

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fecaca;
  transform: scale(1.1);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  margin-bottom: 1.5rem;
  color: #d1d5db;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
  max-width: 400px;
  line-height: 1.5;
}

/* Notifications */
.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  z-index: 1001;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.notification.success {
  background: #d1fae5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.notification.error {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .patrocinadores-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    min-width: auto;
  }

  .filter-select {
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .patrocinadores {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .stats-cards {
    flex-direction: column;
    width: 100%;
  }

  .stat-card {
    min-width: auto;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .title-icon {
    width: 36px;
    height: 36px;
  }

  .form-section {
    padding: 1.5rem;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .logo-upload-area {
    width: 160px;
    height: 160px;
  }

  .form-actions {
    flex-direction: column;
  }

  .patrocinadores-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .patrocinadores-grid {
    grid-template-columns: 1fr;
  }

  .patrocinador-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .patrocinador-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 1rem;
  }

  .group-title {
    font-size: 1rem;
  }

  .field-input,
  .field-select,
  .field-textarea {
    padding: 0.625rem;
    font-size: 0.875rem;
  }

  .btn {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .logo-upload-area {
    width: 140px;
    height: 140px;
  }

  .upload-text {
    font-size: 0.875rem;
  }

  .upload-hint {
    font-size: 0.75rem;
  }

  .patrocinador-nome {
    font-size: 1rem;
  }

  .patrocinador-content {
    padding: 1rem;
  }

  .patrocinador-actions {
    padding: 1rem;
  }

  .action-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
