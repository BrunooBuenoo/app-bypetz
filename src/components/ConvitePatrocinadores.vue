<template>
  <div class="convite-patrocinadores">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            Programa de Patrocínio
          </div>
          
          <h1 class="hero-title">
            Conecte sua marca com
            <span class="highlight">milhares de tutores</span>
            apaixonados por pets
          </h1>
          
          <p class="hero-subtitle">
            Junte-se à ByPetz e alcance uma comunidade engajada de amantes de animais. 
            Sua empresa pode fazer a diferença na vida de pets e suas famílias.
          </p>

          <div class="hero-stats" v-if="!loading">
            <div class="stat-item">
              <div class="stat-number">{{ totalUsers }}+</div>
              <div class="stat-label">Usuários Ativos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ totalPets }}+</div>
              <div class="stat-label">Pets Cadastrados</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ totalComments }}+</div>
              <div class="stat-label">Interações Mensais</div>
            </div>
          </div>

          <div class="hero-cta">
            <button @click="scrollToContact" class="btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              Quero ser Patrocinador
            </button>
            <button @click="scrollToExamples" class="btn-secondary">
              Ver Exemplos de Parceria
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefícios Section -->
    <section class="beneficios-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Por que patrocinar a ByPetz?</h2>
          <p class="section-subtitle">
            Sua marca ganha visibilidade em uma comunidade altamente engajada e segmentada
          </p>
        </div>

        <div class="beneficios-grid">
          <div class="beneficio-card">
            <div class="beneficio-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" stroke-width="2"/>
                <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3 class="beneficio-title">Público Segmentado</h3>
            <p class="beneficio-description">
              Alcance diretamente tutores de pets, um público com alto poder de compra e fidelidade à marca
            </p>
          </div>

          <div class="beneficio-card">
            <div class="beneficio-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="beneficio-title">Engajamento Real</h3>
            <p class="beneficio-description">
              Comunidade ativa que interage, compartilha e confia nas recomendações da plataforma
            </p>
          </div>

          <div class="beneficio-card">
            <div class="beneficio-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3 class="beneficio-title">Impacto Social</h3>
            <p class="beneficio-description">
              Associe sua marca a uma causa nobre: reunir famílias e promover adoção responsável
            </p>
          </div>

          <div class="beneficio-card">
            <div class="beneficio-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3 class="beneficio-title">Crescimento Acelerado</h3>
            <p class="beneficio-description">
              Plataforma em expansão com crescimento orgânico e alta retenção de usuários
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Exemplos de Parceria -->
    <section ref="examplesSection" class="exemplos-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Exemplos de Parcerias</h2>
          <p class="section-subtitle">
            Veja como diferentes tipos de empresas podem se beneficiar do patrocínio
          </p>
        </div>

        <div class="exemplos-grid">
          <!-- Pet Shop -->
          <div class="exemplo-card featured">
            <div class="exemplo-header">
              <div class="exemplo-icon petshop">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 7H16V6C16 4.93913 15.5786 3.92172 14.8284 3.17157C14.0783 2.42143 13.0609 2 12 2C10.9391 2 9.92172 2.42143 9.17157 3.17157C8.42143 3.92172 8 4.93913 8 6V7H5C4.46957 7 3.96086 7.21071 3.58579 7.58579C3.21071 7.96086 3 8.46957 3 9V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V9C21 8.46957 20.7893 7.96086 20.4142 7.58579C20.0391 7.21071 19.5304 7 19 7Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6V7H10V6Z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="exemplo-info">
                <h3 class="exemplo-title">Pet Shops</h3>
                <div class="exemplo-badge">Mais Popular</div>
              </div>
            </div>
            
            <div class="exemplo-content">
              <div class="exemplo-benefit">
                <h4>Cupom Exclusivo "BYPETZ"</h4>
                <p>15% de desconto em produtos para usuários da plataforma</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Destaque no Feed</h4>
                <p>Logo da empresa em posts de pets da região</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Programa de Fidelidade</h4>
                <p>Pontos extras para tutores que adotam pela ByPetz</p>
              </div>
            </div>
            
            <div class="exemplo-results">
              <div class="result-item">
                <span class="result-number">+40%</span>
                <span class="result-label">Novos clientes</span>
              </div>
              <div class="result-item">
                <span class="result-number">+25%</span>
                <span class="result-label">Vendas online</span>
              </div>
            </div>
          </div>

          <!-- Marcas de Ração -->
          <div class="exemplo-card">
            <div class="exemplo-header">
              <div class="exemplo-icon racao">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C13.1046 2 14 2.89543 14 4V6H10V4C10 2.89543 10.8954 2 12 2Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M4 8H20L19 20H5L4 8Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 8V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="exemplo-info">
                <h3 class="exemplo-title">Marcas de Ração</h3>
              </div>
            </div>
            
            <div class="exemplo-content">
              <div class="exemplo-benefit">
                <h4>Kit Boas-Vindas</h4>
                <p>Amostras grátis para pets recém-adotados</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Conteúdo Educativo</h4>
                <p>Dicas de nutrição com a marca da empresa</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Programa de Doação</h4>
                <p>Ração para ONGs parceiras da ByPetz</p>
              </div>
            </div>
          </div>

          <!-- Clínicas Veterinárias -->
          <div class="exemplo-card">
            <div class="exemplo-header">
              <div class="exemplo-icon veterinaria">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20 9L14 14L16.18 22L12 18.27L7.82 22L10 14L4 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6V18" stroke="currentColor" stroke-width="2"/>
                  <path d="M6 12H18" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="exemplo-info">
                <h3 class="exemplo-title">Clínicas Veterinárias</h3>
              </div>
            </div>
            
            <div class="exemplo-content">
              <div class="exemplo-benefit">
                <h4>Consulta Gratuita</h4>
                <p>Primeira consulta grátis para pets adotados</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Telemedicina</h4>
                <p>Suporte online para emergências</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Programa Preventivo</h4>
                <p>Descontos em vacinas e check-ups</p>
              </div>
            </div>
          </div>

          <!-- Seguradoras -->
          <div class="exemplo-card">
            <div class="exemplo-header">
              <div class="exemplo-icon seguradora">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22S2 16 2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9C22 16 12 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="exemplo-info">
                <h3 class="exemplo-title">Seguradoras Pet</h3>
              </div>
            </div>
            
            <div class="exemplo-content">
              <div class="exemplo-benefit">
                <h4>Seguro Gratuito</h4>
                <p>30 dias de cobertura para pets adotados</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Desconto Especial</h4>
                <p>20% off no primeiro ano de contrato</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Cobertura Emergencial</h4>
                <p>Atendimento 24h para pets encontrados</p>
              </div>
            </div>
          </div>

          <!-- E-commerce Pet -->
          <div class="exemplo-card">
            <div class="exemplo-header">
              <div class="exemplo-icon ecommerce">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 17.5304 17.2107 18.0391 17.5858 18.4142C17.9609 18.7893 18.4696 19 19 19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17C21 16.4696 20.7893 15.9609 20.4142 15.5858C20.0391 15.2107 19.5304 15 19 15H17Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="9" cy="20" r="1" stroke="currentColor" stroke-width="2"/>
                  <circle cx="20" cy="20" r="1" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="exemplo-info">
                <h3 class="exemplo-title">E-commerce Pet</h3>
              </div>
            </div>
            
            <div class="exemplo-content">
              <div class="exemplo-benefit">
                <h4>Frete Grátis</h4>
                <p>Entrega gratuita para usuários ByPetz</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Cashback Especial</h4>
                <p>5% de volta em compras para adoção</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Kit Personalizado</h4>
                <p>Produtos selecionados por espécie/porte</p>
              </div>
            </div>
          </div>

          <!-- Hotéis Pet -->
          <div class="exemplo-card">
            <div class="exemplo-header">
              <div class="exemplo-icon hotel">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V7Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 7V17" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 7V17" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 12H21" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="exemplo-info">
                <h3 class="exemplo-title">Hotéis Pet</h3>
              </div>
            </div>
            
            <div class="exemplo-content">
              <div class="exemplo-benefit">
                <h4>Day Care Gratuito</h4>
                <p>1 dia grátis para novos tutores</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Pacote Adaptação</h4>
                <p>Desconto especial para pets recém-adotados</p>
              </div>
              
              <div class="exemplo-benefit">
                <h4>Emergência 24h</h4>
                <p>Hospedagem de emergência para pets encontrados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Planos de Patrocínio -->
    <section class="planos-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Planos de Patrocínio</h2>
          <p class="section-subtitle">
            Escolha o plano ideal para o porte e objetivos da sua empresa
          </p>
        </div>

        <div class="planos-grid">
          <div class="plano-card">
            <div class="plano-header">
              <h3 class="plano-title">Apoiador</h3>
              <div class="plano-price">
                <span class="price-currency">R$</span>
                <span class="price-value">9,90</span>
                <span class="price-period">/mês</span>
              </div>
              <p class="plano-description">Apoio simbólico para ajudar a causa animal.</p>
            </div>
            <div class="plano-features">
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Agradecimento mensal nas redes sociais
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Nome na página de apoiadores
              </div>
            </div>
          </div>

          <div class="plano-card featured">
            <div class="plano-badge">Mais Escolhido</div>
            <div class="plano-header">
              <h3 class="plano-title">Parceiro</h3>
              <div class="plano-price">
                <span class="price-currency">R$</span>
                <span class="price-value">39,90</span>
                <span class="price-period">/mês</span>
              </div>
              <p class="plano-description">Para quem quer mais visibilidade e apoiar ativamente.</p>
            </div>
            <div class="plano-features">
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Tudo do plano Apoiador
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                2 postagens patrocinadas/mês nas redes sociais
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Cupom de desconto (opcional)
              </div>
            </div>
          </div>

          <div class="plano-card">
            <div class="plano-header">
              <h3 class="plano-title">Premium</h3>
              <div class="plano-price">
                <span class="price-currency">R$</span>
                <span class="price-value">99,90</span>
                <span class="price-period">/mês</span>
              </div>
              <p class="plano-description">Mais presença na comunidade e impacto social.</p>
            </div>
            <div class="plano-features">
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Tudo do plano Parceiro
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Banner em página de feed
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                4 postagens patrocinadas/mês nas redes
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Menção especial como patrocinador premium
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contato Section -->
    <section ref="contactSection" class="contato-section">
      <div class="container">
        <div class="contato-content">
          <div class="contato-info">
            <h2 class="contato-title">Pronto para fazer parte da ByPetz?</h2>
            <p class="contato-description">
              Entre em contato conosco e descubra como sua empresa pode se beneficiar 
              de uma parceria com a maior plataforma de pets do Brasil.
            </p>
            
            <div class="contato-benefits">
              <div class="benefit-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Consultoria gratuita
              </div>
              <div class="benefit-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Proposta personalizada
              </div>
              <div class="benefit-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Suporte dedicado
              </div>
            </div>
          </div>

          <div class="contato-form">
            <form @submit.prevent="submitForm" class="form">
              <div class="form-group">
                <label for="empresa" class="form-label">Nome da Empresa *</label>
                <input 
                  v-model="form.empresa" 
                  type="text" 
                  id="empresa" 
                  required 
                  class="form-input"
                  placeholder="Digite o nome da sua empresa"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="nome" class="form-label">Seu Nome *</label>
                  <input 
                    v-model="form.nome" 
                    type="text" 
                    id="nome" 
                    required 
                    class="form-input"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div class="form-group">
                  <label for="cargo" class="form-label">Cargo</label>
                  <input 
                    v-model="form.cargo" 
                    type="text" 
                    id="cargo" 
                    class="form-input"
                    placeholder="Seu cargo na empresa"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email" class="form-label">E-mail *</label>
                  <input 
                    v-model="form.email" 
                    type="email" 
                    id="email" 
                    required 
                    class="form-input"
                    placeholder="seu@email.com"
                  />
                </div>
                <div class="form-group">
                  <label for="telefone" class="form-label">Telefone</label>
                  <input 
                    v-model="form.telefone" 
                    type="tel" 
                    id="telefone" 
                    class="form-input"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="segmento" class="form-label">Segmento da Empresa *</label>
                <select v-model="form.segmento" id="segmento" required class="form-select">
                  <option value="">Selecione o segmento</option>
                  <option value="petshop">Pet Shop</option>
                  <option value="veterinaria">Clínica Veterinária</option>
                  <option value="racao">Marca de Ração</option>
                  <option value="seguradora">Seguradora Pet</option>
                  <option value="ecommerce">E-commerce Pet</option>
                  <option value="hotel">Hotel/Creche Pet</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div class="form-group">
                <label for="mensagem" class="form-label">Mensagem</label>
                <textarea 
                  v-model="form.mensagem" 
                  id="mensagem" 
                  rows="4" 
                  class="form-textarea"
                  placeholder="Conte-nos mais sobre sua empresa e como podemos ajudar..."
                ></textarea>
              </div>

              <button type="submit" class="btn-submit" :disabled="submitting">
                <svg v-if="submitting" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" stroke-width="2"/>
                  <polygon points="22,2 15,22 11,13 2,9 22,2" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ submitting ? 'Enviando...' : 'Enviar Proposta' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Message -->
    <div v-if="showSuccess" class="success-message">
      <div class="success-content">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>Proposta enviada com sucesso! Entraremos em contato em breve.</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'ConvitePatrocinadores',
  setup() {
    const loading = ref(true)
    const submitting = ref(false)
    const showSuccess = ref(false)
    const totalUsers = ref(0)
    const totalPets = ref(0)
    const totalComments = ref(0)
    const examplesSection = ref(null)
    const contactSection = ref(null)

    const form = ref({
      empresa: '',
      nome: '',
      cargo: '',
      email: '',
      telefone: '',
      segmento: '',
      mensagem: ''
    })

    const fetchStats = async () => {
      try {
        // Buscar total de pets
        const petsSnapshot = await getDocs(collection(db, 'pets'))
        totalPets.value = petsSnapshot.size

        // Buscar usuários únicos e comentários
        const usersSet = new Set()
        let commentsCount = 0

        petsSnapshot.forEach((doc) => {
          const pet = doc.data()
          if (pet.userId) {
            usersSet.add(pet.userId)
          }
        })

        // Buscar comentários
        for (const petDoc of petsSnapshot.docs) {
          try {
            const commentsSnapshot = await getDocs(
              collection(db, 'pets', petDoc.id, 'comments')
            )
            commentsCount += commentsSnapshot.size

            commentsSnapshot.forEach((commentDoc) => {
              const comment = commentDoc.data()
              if (comment.userId) {
                usersSet.add(comment.userId)
              }
            })
          } catch (err) {
            console.log('Erro ao buscar comentários:', err)
          }
        }

        totalUsers.value = usersSet.size
        totalComments.value = commentsCount

      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
        totalUsers.value = 0
        totalPets.value = 0
        totalComments.value = 0
      } finally {
        loading.value = false
      }
    }

    const scrollToExamples = () => {
      examplesSection.value?.scrollIntoView({ behavior: 'smooth' })
    }

    const scrollToContact = () => {
      contactSection.value?.scrollIntoView({ behavior: 'smooth' })
    }

    const submitForm = async () => {
      submitting.value = true
      
      try {
        await addDoc(collection(db, 'propostas-patrocinio'), {
          ...form.value,
          criadoEm: serverTimestamp(),
          status: 'pendente'
        })

        // Reset form
        form.value = {
          empresa: '',
          nome: '',
          cargo: '',
          email: '',
          telefone: '',
          segmento: '',
          mensagem: ''
        }

        showSuccess.value = true
        setTimeout(() => {
          showSuccess.value = false
        }, 5000)

      } catch (error) {
        console.error('Erro ao enviar proposta:', error)
        alert('Erro ao enviar proposta. Tente novamente.')
      } finally {
        submitting.value = false
      }
    }

    onMounted(() => {
      fetchStats()
    })

    return {
      loading,
      submitting,
      showSuccess,
      totalUsers,
      totalPets,
      totalComments,
      form,
      examplesSection,
      contactSection,
      scrollToExamples,
      scrollToContact,
      submitForm
    }
  }
}
</script>

<style scoped>
.convite-patrocinadores {
  min-height: 100vh;
  background: #ffffff;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  padding: 6rem 0 4rem;
  color: white;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
}

.highlight {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 3rem 0;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  display: block;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: white;
  padding: 1rem 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Benefícios Section */
.beneficios-section {
  padding: 6rem 0;
  background: #f9fafb;
}

.beneficios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.beneficio-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.8);
}

.beneficio-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.beneficio-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
}

.beneficio-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
}

.beneficio-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Exemplos Section */
.exemplos-section {
  padding: 6rem 0;
}

.exemplos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.exemplo-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
}

.exemplo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.exemplo-card.featured {
  border: 2px solid #9333ea;
  transform: scale(1.02);
}

.exemplo-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.exemplo-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.exemplo-icon.petshop {
  background: linear-gradient(135deg, #059669, #10b981);
}

.exemplo-icon.racao {
  background: linear-gradient(135deg, #dc2626, #ef4444);
}

.exemplo-icon.veterinaria {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}

.exemplo-icon.seguradora {
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
}

.exemplo-icon.ecommerce {
  background: linear-gradient(135deg, #ea580c, #f97316);
}

.exemplo-icon.hotel {
  background: linear-gradient(135deg, #0891b2, #06b6d4);
}

.exemplo-info {
  flex: 1;
}

.exemplo-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.exemplo-badge {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
  display: inline-block;
}

.exemplo-content {
  margin-bottom: 1.5rem;
}

.exemplo-benefit {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.exemplo-benefit:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.exemplo-benefit h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.exemplo-benefit p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.exemplo-results {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.result-item {
  text-align: center;
  flex: 1;
}

.result-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #059669;
  margin-bottom: 0.25rem;
}

.result-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

/* Planos Section */
.planos-section {
  padding: 6rem 0;
  background: #f9fafb;
}

.planos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.plano-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
}

.plano-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.plano-card.featured {
  border: 2px solid #9333ea;
  transform: scale(1.05);
}

.plano-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #9333ea, #2563eb);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.plano-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.plano-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
}

.plano-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
}

.price-currency {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
}

.price-value {
  font-size: 3rem;
  font-weight: 800;
  color: #111827;
}

.price-period {
  font-size: 1rem;
  color: #6b7280;
}

.plano-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #374151;
  font-size: 0.875rem;
}

.feature-item svg {
  color: #059669;
  flex-shrink: 0;
}

/* Contato Section */
.contato-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05));
}

.contato-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.contato-title {
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 1rem 0;
}

.contato-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.contato-benefits {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #374151;
  font-weight: 500;
}

.benefit-item svg {
  color: #059669;
  flex-shrink: 0;
}

/* Form */
.contato-form {
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.form {
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

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #9333ea, #2563eb);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
}

.btn-submit:disabled {
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

/* Success Message */
.success-message {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  background: #d1fae5;
  color: #059669;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #a7f3d0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.success-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-stats {
    gap: 2rem;
  }
  
  .contato-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0 3rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .hero-cta {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 300px;
  }
  
  .beneficios-grid,
  .exemplos-grid {
    grid-template-columns: 1fr;
  }
  
  .planos-grid {
    grid-template-columns: 1fr;
  }
  
  .plano-card.featured {
    transform: none;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .hero-container {
    padding: 0 1rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .contato-form {
    padding: 1.5rem;
  }
  
  .success-message {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }
}

.plano-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 1rem 0 0 0;
  font-style: italic;
}
</style>
