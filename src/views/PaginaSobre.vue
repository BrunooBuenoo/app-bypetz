<template>
  <div class="sobre-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <!-- Cachorrinho esquerda -->
        <div class="hero-dog hero-dog-left">
          <img src="/src/assets/filhote1.png" alt="Cachorrinho ByPetz" class="dog-image" />
        </div>
        
        <!-- Cachorrinho direita -->
        <div class="hero-dog hero-dog-right">
          <img src="/src/assets/gatinho1.png" alt="Cachorrinho ByPetz" class="cat-image" />
        </div>
        
        <div class="hero-content">
          <h1 class="hero-title">Sobre a ByPetz</h1>
          <p class="hero-subtitle">Conectando corações, reunindo famílias</p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="main-container">
      <!-- Nossa História -->
      <section class="content-section">
        <div class="section-header">
          <h2 class="section-title">Nossa História</h2>
        </div>
        <div class="content-grid">
          <div class="content-card large">
            <div class="card-content">
              <p>A ByPetz nasceu com um propósito: aproximar pets perdidos de suas famílias e conectar pessoas dispostas a ajudar com quem mais precisa.</p>
              <p>Somos uma plataforma feita com carinho para facilitar a busca por animais desaparecidos e incentivar a adoção consciente. Acreditamos que a tecnologia pode ser uma grande aliada quando usada com empatia e propósito.</p>
            </div>
          </div>
          <div class="content-card">
            <h3 class="card-title">Nossa Missão</h3>
            <div class="card-content">
              <p>Promover o bem-estar animal por meio da inovação, acolhimento e colaboração. Queremos ser um elo de confiança entre tutores, protetores e amantes de pets em todo o Brasil.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- O que oferecemos -->
      <section class="content-section">
        <div class="section-header">
          <h2 class="section-title">O que oferecemos</h2>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <h3 class="feature-title">Pets Perdidos</h3>
            <p class="feature-description">Sistema inteligente de busca e divulgação para reunir famílias</p>
          </div>
          <div class="feature-card">
            <h3 class="feature-title">Pets Encontrados</h3>
            <p class="feature-description">Plataforma para reportar animais encontrados com geolocalização</p>
          </div>
          <div class="feature-card">
            <h3 class="feature-title">Adoção Responsável</h3>
            <p class="feature-description">Conectamos pets que precisam de um lar com famílias amorosas</p>
          </div>
          <div class="feature-card">
            <h3 class="feature-title">Comunidade Ativa</h3>
            <p class="feature-description">Rede de apoio entre tutores e protetores de animais</p>
          </div>
        </div>
      </section>

      <!-- Nossos Valores -->
      <section class="content-section">
        <div class="section-header">
          <h2 class="section-title">Nossos Valores</h2>
        </div>
        <div class="values-container">
          <div class="values-text">
            <p>Por trás da tela, existe uma equipe apaixonada por animais e comprometida com cada história. Na ByPetz, cada pet importa, e cada usuário é parte essencial dessa rede de cuidado e solidariedade.</p>
          </div>
          <div class="values-grid">
            <div class="value-item">
              <span class="value-name">Empatia</span>
            </div>
            <div class="value-item">
              <span class="value-name">Confiança</span>
            </div>
            <div class="value-item">
              <span class="value-name">Comunidade</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Estatísticas -->
      <section class="content-section">
        <div class="section-header">
          <h2 class="section-title">Nosso Impacto</h2>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">1000+</div>
            <div class="stat-label">Pets Cadastrados</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">500+</div>
            <div class="stat-label">Adoções Realizadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">2000+</div>
            <div class="stat-label">Usuários Ativos</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">50+</div>
            <div class="stat-label">Cidades Atendidas</div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Faça Parte da Nossa Missão</h2>
          <p class="cta-description">Junte-se a milhares de pessoas que já fazem a diferença na vida dos animais</p>
          <div class="cta-buttons">
            <router-link to="/cadastrar-pet" class="btn-primary">
              Cadastrar Pet
            </router-link>
            <router-link to="/feed" class="btn-secondary">
              Explorar Pets
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
  <RodapeSite />
</template>

<script>
import RodapeSite from '../components/RodapeSite.vue';
export default {
    components: {
    RodapeSite
  },  
  name: "PaginaSobre"
}
</script>

<style scoped>
.sobre-page {
  min-height: 100vh;
  background: #ffffff;
  padding-top: 80px;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  padding: 6rem 0 4rem;
  position: relative;
}

/* Hero Dogs */
.hero-dog {
  position: absolute;
  top: 0;
  width: 200px;
  height: 300px;
  z-index: 2;
}

.hero-dog-left {
  left: 2rem;
}

.hero-dog-right {
  right: 2rem;
  transform: scaleX(-1); /* Espelha a imagem da direita */
}

.dog-image {
  position: relative;
  bottom: 61px;
  width: 300px;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

.cat-image {
  position: relative;
  bottom: 75px;
  width: 300px;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

/* Ajustar o hero-container para position relative */
.hero-container {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1rem 0;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  margin: 0;
}

/* Main Container */
.main-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Content Sections */
.content-section {
  padding: 4rem 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.content-section:last-child {
  border-bottom: none;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  color: #111827;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #9233ea, #2564eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.content-card {
  background: rgba(249, 250, 251, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.content-card:hover {
  background: rgba(147, 51, 234, 0.02);
  border-color: rgba(147, 51, 234, 0.1);
  transform: translateY(-2px);
}

.content-card.large {
  grid-row: span 2;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.card-content p {
  color: #374151;
  line-height: 1.7;
  margin: 0 0 1rem 0;
}

.card-content p:last-child {
  margin-bottom: 0;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(147, 51, 234, 0.02);
  border-color: rgba(147, 51, 234, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Values */
.values-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.values-text p {
  font-size: 1.125rem;
  color: #374151;
  line-height: 1.7;
  margin: 0;
}

.values-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.value-item {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1));
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  text-align: center;
}

.value-name {
  font-weight: 600;
  color: #9333ea;
  font-size: 0.875rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin: 0 0 0.5rem 0;
}

.stat-label {
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05));
  border: 1px solid rgba(147, 51, 234, 0.1);
  border-radius: 1.5rem;
  padding: 4rem 2rem;
  margin: 4rem 0;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
}

.cta-description {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background: white;
  color: #374151;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid rgba(229, 231, 235, 0.8);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(147, 51, 234, 0.05);
  border-color: rgba(147, 51, 234, 0.2);
  color: #9333ea;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .content-grid,
  .values-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .content-card.large {
    grid-row: span 1;
  }

  .hero-dog {
    width: 150px;
    height: 225px;
  }
  
  .hero-dog-left {
    left: 1rem;
  }
  
  .hero-dog-right {
    right: 1rem;
  }

  .dog-image{
    bottom: 8px;
    width: 200px;
  }

  .cat-image{
    bottom: 17px;
    width: 200px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0 3rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .content-section {
    padding: 3rem 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .values-grid {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
  }

  .hero-dog {
    width: 120px;
    height: 180px;
  }
  
  .hero-dog-left {
    left: 0.5rem;
  }
  
  .hero-dog-right {
    right: 0.5rem;
  }

  .dog-image{
    top: 11px;
    width: 100px;
  }

  .cat-image{
    top: 8px;
    width: 100px;
  }
}

@media (max-width: 480px) {
  .main-container {
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
  
  .content-section {
    padding: 2rem 0;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .content-card,
  .feature-card,
  .stat-card {
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-section {
    padding: 3rem 1.5rem;
    margin: 3rem 0;
  }
  
  .cta-title {
    font-size: 1.5rem;
  }
  
  .cta-description {
    font-size: 1rem;
  }

  .hero-dog {
    display: none; /* Esconde as imagens em telas muito pequenas */
  }
}
</style>