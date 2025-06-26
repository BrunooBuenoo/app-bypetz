<template>
  <div class="cards-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Como Funciona</h2>
        <p class="section-subtitle">Simples, rápido e eficiente</p>
      </div>
      
      <div class="cards-grid">
        <div class="card">
          <div class="card-number">01</div>
          <h3 class="card-title">Cadastre</h3>
          <p class="card-description">Registre seu pet perdido ou encontrado com fotos e informações detalhadas</p>
        </div>
        
        <div class="card">
          <div class="card-number">02</div>
          <h3 class="card-title">Divulgue</h3>
          <p class="card-description">Sua publicação será vista por milhares de pessoas na região</p>
        </div>
        
        <div class="card">
          <div class="card-number">03</div>
          <h3 class="card-title">Reencontre</h3>
          <p class="card-description">Conecte-se diretamente com quem pode ajudar no reencontro</p>
        </div>
      </div>
      
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">Pets Encontrados</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">2.5k+</div>
            <div class="stat-label">Usuários Ativos</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">98%</div>
            <div class="stat-label">Taxa de Sucesso</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardsComponent'
}
</script>

<style scoped>
.cards-section {
  padding: 5rem 0;
  background: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  color: #111827;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.card {
  position: relative;
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  overflow: hidden;
}

.card:hover {
  background: rgba(147, 51, 234, 0.02);
  border-color: rgba(147, 51, 234, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.card-number {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.card-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.stats-section {
  margin-top: 2rem;
}

.stats-grid {
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
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
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Responsividade */
@media (max-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
  
  .cards-grid {
    gap: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .cards-section {
    padding: 4rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }
  
  .card {
    padding: 2rem 1.5rem;
  }
  
  .stats-grid {
    gap: 2rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .cards-section {
    padding: 3rem 0;
  }

  .section-header {
    margin-bottom: 3rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .card {
    padding: 2rem 1rem;
  }
  
  .stats-grid {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>