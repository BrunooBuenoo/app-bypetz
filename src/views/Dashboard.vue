<template>
  <div class="dashboard-page">
    <!-- Verificação de acesso -->
    <div v-if="!hasAccess" class="access-denied">
      <div class="access-denied-content">
        <div class="access-denied-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h2 class="access-denied-title">Acesso Restrito</h2>
        <p class="access-denied-description">
          Você não possui permissão para acessar o painel administrativo.
          Entre em contato com o administrador do sistema.
        </p>
        <router-link to="/" class="btn-home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2"/>
          </svg>
          Voltar ao Início
        </router-link>
      </div>
    </div>

    <!-- Dashboard Admin -->
    <div v-else class="dashboard-container">
      <!-- Desktop Sidebar -->
      <aside class="desktop-sidebar">
        <div class="sidebar-header">
          <div class="logo-container">
            <div class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="logo-text">
              <span class="admin-badge">Admin</span>
            </div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <h3 class="nav-section-title">Painel Principal</h3>
            <button
              @click="activeSection = 'overview'"
              class="nav-item"
              :class="{ active: activeSection === 'overview' }"
            >
              <div class="nav-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="nav-item-text">Visão Geral</span>
            </button>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Gerenciamento</h3>
            
            <button
              @click="activeSection = 'pedidos'"
              class="nav-item"
              :class="{ active: activeSection === 'pedidos' }"
            >
              <div class="nav-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="nav-item-text">Pedidos</span>
              <span class="nav-item-badge">{{ stats.pedidos || 0 }}</span>
            </button>

            <button
              @click="activeSection = 'produtos'"
              class="nav-item"
              :class="{ active: activeSection === 'produtos' }"
            >
              <div class="nav-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7L12 3L4 7L12 11L20 7Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M4 12L12 16L20 12" stroke="currentColor" stroke-width="2"/>
                  <path d="M4 17L12 21L20 17" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="nav-item-text">Produtos</span>
              <span class="nav-item-badge">{{ stats.produtos || 0 }}</span>
            </button>

            <button
              @click="activeSection = 'categorias'"
              class="nav-item"
              :class="{ active: activeSection === 'categorias' }"
            >
              <div class="nav-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 7H17L19 9V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V9L7 7Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M7 7V5C7 4.46957 7.21071 3.96086 7.58579 3.58579C7.96086 3.21071 8.46957 3 9 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V7" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="nav-item-text">Categorias</span>
              <span class="nav-item-badge">{{ stats.categorias || 0 }}</span>
            </button>

            <button
              @click="activeSection = 'patrocinadores'"
              class="nav-item"
              :class="{ active: activeSection === 'patrocinadores' }"
            >
              <div class="nav-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                  <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7006C21.7033 16.047 20.9999 15.5866 20.2 15.3954" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13C16.8003 3.32127 17.5037 3.78204 18.0098 4.43564C18.5159 5.08923 18.8002 5.89971 18.8002 6.735C18.8002 7.57029 18.5159 8.38077 18.0098 9.03436C17.5037 9.68796 16.8003 10.1487 16 10.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="nav-item-text">Patrocinadores</span>
              <span class="nav-item-badge">{{ stats.patrocinadores || 0 }}</span>
            </button>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="user-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="user-info">
              <span class="user-name">{{ user?.displayName || 'Admin' }}</span>
              <span class="user-email">{{ user?.email }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Mobile Header -->
      <div class="mobile-header">
        <div class="mobile-header-content">
          <div class="mobile-logo">
            <div class="mobile-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="mobile-brand-name">ByPetz Admin</span>
          </div>
          
          <button @click="showMobileMenu = !showMobileMenu" class="mobile-menu-toggle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/>
              <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <div v-if="showMobileMenu" class="mobile-nav-overlay" @click="showMobileMenu = false">
          <div class="mobile-nav-menu" @click.stop>
            <div class="mobile-nav-header">
              <h3>Menu de Navegação</h3>
              <button @click="showMobileMenu = false" class="mobile-nav-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            
            <nav class="mobile-nav-items">
              <button
                @click="setActiveSection('overview')"
                class="mobile-nav-item"
                :class="{ active: activeSection === 'overview' }"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Visão Geral</span>
              </button>

              <button
                @click="setActiveSection('pedidos')"
                class="mobile-nav-item"
                :class="{ active: activeSection === 'pedidos' }"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Pedidos</span>
                <span class="mobile-nav-badge">{{ stats.pedidos || 0 }}</span>
              </button>

              <button
                @click="setActiveSection('produtos')"
                class="mobile-nav-item"
                :class="{ active: activeSection === 'produtos' }"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7L12 3L4 7L12 11L20 7Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M4 12L12 16L20 12" stroke="currentColor" stroke-width="2"/>
                  <path d="M4 17L12 21L20 17" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Produtos</span>
                <span class="mobile-nav-badge">{{ stats.produtos || 0 }}</span>
              </button>

              <button
                @click="setActiveSection('categorias')"
                class="mobile-nav-item"
                :class="{ active: activeSection === 'categorias' }"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 7H17L19 9V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V9L7 7Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M7 7V5C7 4.46957 7.21071 3.96086 7.58579 3.58579C7.96086 3.21071 8.46957 3 9 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V7" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Categorias</span>
                <span class="mobile-nav-badge">{{ stats.categorias || 0 }}</span>
              </button>

              <button
                @click="setActiveSection('patrocinadores')"
                class="mobile-nav-item"
                :class="{ active: activeSection === 'patrocinadores' }"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                  <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7006C21.7033 16.047 20.9999 15.5866 20.2 15.3954" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13C16.8003 3.32127 17.5037 3.78204 18.0098 4.43564C18.5159 5.08923 18.8002 5.89971 18.8002 6.735C18.8002 7.57029 18.5159 8.38077 18.0098 9.03436C17.5037 9.68796 16.8003 10.1487 16 10.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Patrocinadores</span>
                <span class="mobile-nav-badge">{{ stats.patrocinadores || 0 }}</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Content Header -->
        <div class="content-header">
          <div class="content-title-section">
            <h1 class="content-title">{{ getSectionTitle() }}</h1>
            <p class="content-subtitle">{{ getSectionSubtitle() }}</p>
          </div>
          
          <div class="content-actions">
            <div class="last-update">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>Atualizado agora</span>
            </div>
          </div>
        </div>

        <!-- Content Body -->
        <div class="content-body">
          <!-- Overview Dashboard -->
          <div v-if="activeSection === 'overview'" class="overview-section">
            <!-- Stats Cards -->
            <div class="stats-grid">
              <div class="stat-card pedidos">
                <div class="stat-card-header">
                  <div class="stat-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="stat-card-title">Pedidos</h3>
                </div>
                <div class="stat-card-content">
                  <div class="stat-number">{{ stats.pedidos || 0 }}</div>
                  <div class="stat-change positive">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" stroke-width="2"/>
                      <polyline points="17,6 23,6 23,12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    +12% este mês
                  </div>
                </div>
              </div>

              <div class="stat-card produtos">
                <div class="stat-card-header">
                  <div class="stat-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 7L12 3L4 7L12 11L20 7Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M4 12L12 16L20 12" stroke="currentColor" stroke-width="2"/>
                      <path d="M4 17L12 21L20 17" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="stat-card-title">Produtos</h3>
                </div>
                <div class="stat-card-content">
                  <div class="stat-number">{{ stats.produtos || 0 }}</div>
                  <div class="stat-change positive">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" stroke-width="2"/>
                      <polyline points="17,6 23,6 23,12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    +8% este mês
                  </div>
                </div>
              </div>

              <div class="stat-card categorias">
                <div class="stat-card-header">
                  <div class="stat-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 7H17L19 9V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V9L7 7Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M7 7V5C7 4.46957 7.21071 3.96086 7.58579 3.58579C7.96086 3.21071 8.46957 3 9 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V7" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="stat-card-title">Categorias</h3>
                </div>
                <div class="stat-card-content">
                  <div class="stat-number">{{ stats.categorias || 0 }}</div>
                  <div class="stat-change neutral">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2"/>
                      <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2"/>
                      <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Estável
                  </div>
                </div>
              </div>

              <div class="stat-card patrocinadores">
                <div class="stat-card-header">
                  <div class="stat-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                      <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7006C21.7033 16.047 20.9999 15.5866 20.2 15.3954" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16 3.13C16.8003 3.32127 17.5037 3.78204 18.0098 4.43564C18.5159 5.08923 18.8002 5.89971 18.8002 6.735C18.8002 7.57029 18.5159 8.38077 18.0098 9.03436C17.5037 9.68796 16.8003 10.1487 16 10.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="stat-card-title">Patrocinadores</h3>
                </div>
                <div class="stat-card-content">
                  <div class="stat-number">{{ stats.patrocinadores || 0 }}</div>
                  <div class="stat-change positive">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" stroke-width="2"/>
                      <polyline points="17,6 23,6 23,12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    +5% este mês
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions-section">
              <h2 class="section-title">Ações Rápidas</h2>
              <div class="quick-actions-grid">
                <button @click="activeSection = 'produtos'" class="quick-action-card">
                  <div class="quick-action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
                      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="quick-action-title">Adicionar Produto</h3>
                  <p class="quick-action-description">Cadastre um novo produto no sistema</p>
                </button>

                <button @click="activeSection = 'categorias'" class="quick-action-card">
                  <div class="quick-action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
                      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="quick-action-title">Nova Categoria</h3>
                  <p class="quick-action-description">Organize produtos em categorias</p>
                </button>

                <button @click="activeSection = 'patrocinadores'" class="quick-action-card">
                  <div class="quick-action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
                      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="quick-action-title">Novo Patrocinador</h3>
                  <p class="quick-action-description">Adicione parceiros e patrocinadores</p>
                </button>

                <button @click="activeSection = 'pedidos'" class="quick-action-card">
                  <div class="quick-action-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                      <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <h3 class="quick-action-title">Ver Pedidos</h3>
                  <p class="quick-action-description">Gerencie pedidos e vendas</p>
                </button>
              </div>
            </div>
          </div>

          <!-- Seções específicas -->
          <PedidosAdmin v-else-if="activeSection === 'pedidos'" />
          <CadastroProdutoClean v-else-if="activeSection === 'produtos'" />
          <CadastroCategoriaClean v-else-if="activeSection === 'categorias'" />
          <CadastroPatrocinadores v-else-if="activeSection === 'patrocinadores'" />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

// Importar componentes clean
import PedidosAdmin from '../components/PedidosAdmin.vue'
import CadastroProdutoClean from '../components/CadastroProduto.vue'
import CadastroCategoriaClean from '../components/CadastroCategoria.vue'
import CadastroPatrocinadores from '../components/CadastroPatrocinador.vue'

export default {
  name: 'DashboardClean',
  components: {
    PedidosAdmin,
    CadastroProdutoClean,
    CadastroCategoriaClean,
    CadastroPatrocinadores
  },
  setup() {
    const { user } = useAuth()
    const activeSection = ref('overview')
    const showMobileMenu = ref(false)
    const stats = ref({
      pedidos: 0,
      produtos: 0,
      categorias: 0,
      patrocinadores: 0
    })

    const hasAccess = computed(() => {
      return user.value?.email === 'bruno.buens@gmail.com'
    })

    const getSectionTitle = () => {
      const titles = {
        overview: 'Visão Geral',
        pedidos: 'Gerenciar Pedidos',
        produtos: 'Gerenciar Produtos',
        categorias: 'Gerenciar Categorias',
        patrocinadores: 'Gerenciar Patrocinadores'
      }
      return titles[activeSection.value] || 'Dashboard'
    }

    const getSectionSubtitle = () => {
      const subtitles = {
        overview: 'Acompanhe as principais métricas e estatísticas da plataforma',
        pedidos: 'Visualize e gerencie todos os pedidos realizados',
        produtos: 'Adicione, edite e organize o catálogo de produtos',
        categorias: 'Organize produtos em categorias e subcategorias',
        patrocinadores: 'Gerencie parceiros e patrocinadores da plataforma'
      }
      return subtitles[activeSection.value] || ''
    }

    const setActiveSection = (section) => {
      activeSection.value = section
      showMobileMenu.value = false
    }

    const fetchStats = async () => {
      try {
        // Buscar estatísticas de cada coleção
        const collections = ['pedidos', 'produtos', 'categorias', 'patrocinadores']
        
        for (const collectionName of collections) {
          try {
            const querySnapshot = await getDocs(collection(db, collectionName))
            stats.value[collectionName] = querySnapshot.size
          } catch (error) {
            console.warn(`Erro ao buscar ${collectionName}:`, error)
            stats.value[collectionName] = 0
          }
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      }
    }

    onMounted(() => {
      if (hasAccess.value) {
        fetchStats()
      }
    })

    return {
      user,
      activeSection,
      showMobileMenu,
      stats,
      hasAccess,
      getSectionTitle,
      getSectionSubtitle,
      setActiveSection
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Access Denied */
.access-denied {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  
}

.access-denied-content {
  text-align: center;
  max-width: 500px;
  background: white;
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.access-denied-icon {
  margin-bottom: 2rem;
  color: #dc2626;
}

.access-denied-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 1rem 0;
}

.access-denied-description {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.btn-home {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-home:hover {
  background: linear-gradient(135deg, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(147, 51, 234, 0.3);
}

/* Dashboard Container */
.dashboard-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

/* Desktop Sidebar */
.desktop-sidebar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid #e5e7eb;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-top: 100px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  border-radius: 12px;
  color: white;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.admin-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9333ea;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
  padding: 0 2rem;
}

.nav-item {
  width: 100%;
  background: none;
  border: none;
  padding: 1rem 2rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  position: relative;
}

.nav-item:hover {
  background: rgba(147, 51, 234, 0.05);
  color: #9333ea;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(37, 99, 235, 0.05));
  color: #9333ea;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(135deg, #9333ea, #2563eb);
}

.nav-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: currentColor;
}

.nav-item-text {
  flex: 1;
}

.nav-item-badge {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.nav-item.active .nav-item-badge {
  background: rgba(147, 51, 234, 0.2);
  color: #9333ea;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 10px;
  color: #6b7280;
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mobile Header */
.mobile-header {
  display: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.mobile-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  border-radius: 8px;
  color: white;
}

.mobile-brand-name {
  font-size: 1.125rem;
  font-weight: 800;
  color: #111827;
}

.mobile-menu-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-menu-toggle:hover {
  background: #f3f4f6;
  color: #9333ea;
}

/* Mobile Navigation Overlay */
.mobile-nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 1rem;
}

.mobile-nav-menu {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 320px;
  max-height: 80vh;
  overflow-y: auto;
}

.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-nav-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.mobile-nav-close {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-nav-close:hover {
  background: #f3f4f6;
  color: #dc2626;
}

.mobile-nav-items {
  padding: 1rem;
}

.mobile-nav-item {
  width: 100%;
  background: none;
  border: none;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.mobile-nav-item:hover {
  background: rgba(147, 51, 234, 0.05);
  color: #9333ea;
}

.mobile-nav-item.active {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(37, 99, 235, 0.05));
  color: #9333ea;
}

.mobile-nav-badge {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: auto;
}

.mobile-nav-item.active .mobile-nav-badge {
  background: rgba(147, 51, 234, 0.2);
  color: #9333ea;
}

/* Main Content */
.main-content {
  padding: 2rem;
  overflow-y: auto;
  background: transparent;
  padding-top: 100px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.content-title-section {
  flex: 1;
}

.content-title {
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.content-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
  line-height: 1.5;
}

.content-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.last-update {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.last-update svg {
  color: #9333ea;
}

/* Content Body */
.content-body {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Overview Section */
.overview-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.stat-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: white;
}

.stat-card.pedidos .stat-card-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.stat-card.produtos .stat-card-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-card.categorias .stat-card-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-card.patrocinadores .stat-card-icon {
  background: linear-gradient(135deg, #9333ea, #7c3aed);
}

.stat-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
}

.stat-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #059669;
}

.stat-change.neutral {
  color: #6b7280;
}

/* Quick Actions */
.quick-actions-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.quick-action-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.quick-action-card:hover {
  border-color: #9333ea;
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(147, 51, 234, 0.15);
}

.quick-action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 16px;
  color: #9333ea;
  transition: all 0.3s ease;
}

.quick-action-card:hover .quick-action-icon {
  background: linear-gradient(135deg, #9333ea, #2563eb);
  color: white;
}

.quick-action-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.quick-action-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }

  .desktop-sidebar {
    display: none;
  }

  .mobile-header {
    display: block;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .quick-actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .content-title {
    font-size: 1.5rem;
  }

  .content-body {
    padding: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .mobile-header-content {
    padding: 1rem;
  }

  .mobile-nav-overlay {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0.75rem;
  }

  .content-body {
    padding: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-card-header {
    margin-bottom: 1rem;
  }

  .stat-card-icon {
    width: 40px;
    height: 40px;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .quick-action-card {
    padding: 1.5rem;
  }

  .quick-action-icon {
    width: 56px;
    height: 56px;
  }

  .mobile-header-content {
    padding: 0.75rem 1rem;
  }

  .mobile-brand-name {
    font-size: 1rem;
  }

  .content-title {
    font-size: 1.25rem;
  }

  .content-subtitle {
    font-size: 0.875rem;
  }
}
</style>