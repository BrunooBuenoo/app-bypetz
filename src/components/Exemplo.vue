<template>
  <div class="container">
    <!-- Exemplo seguindo sua identidade visual -->
    <div class="content-card">
      <h2 class="section-title">Seção Exemplo</h2>
      <p class="section-description">
        Descrição seguindo o padrão clean estabelecido no seu projeto
      </p>
      
      <div class="button-group">
        <button class="btn-primary">Ação Principal</button>
        <button class="btn-secondary">Ação Secundária</button>
      </div>
      
      <div class="cards-grid">
        <div class="feature-card" v-for="item in 3" :key="item">
          <h3 class="card-title">Título do Card</h3>
          <p class="card-description">Descrição do card seguindo o padrão</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExemploComponente'
}
</script>

<style scoped>
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.content-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #9333ea, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.section-description {
  font-size: 1.1rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  max-width: 600px;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background: white;
  color: #9333ea;
  border: 2px solid rgba(147, 51, 234, 0.3);
}

.btn-secondary:hover {
  background: rgba(147, 51, 234, 0.05);
  border-color: rgba(147, 51, 234, 0.4);
  transform: translateY(-2px);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: rgba(249, 250, 251, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(147, 51, 234, 0.05);
  border-color: rgba(147, 51, 234, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.card-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem 1rem;
  }
  
  .content-card {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>