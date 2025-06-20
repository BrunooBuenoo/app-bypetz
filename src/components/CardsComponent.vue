<template>
  <div class="cards-section">
    <div class="container">
      <h2>Como Funciona</h2>
      <div class="cards-grid">
        <div class="card">
          <div class="card-icon">🔍</div>
          <h3>1. Cadastre</h3>
          <p>Registre seu pet perdido ou encontrado com fotos e informações detalhadas</p>
        </div>
        
        <div class="card">
          <div class="card-icon">📢</div>
          <h3>2. Divulgue</h3>
          <p>Sua publicação será vista por milhares de pessoas na região</p>
        </div>
        
        <div class="card">
          <div class="card-icon">❤️</div>
          <h3>3. Reencontre</h3>
          <p>Conecte-se diretamente com quem pode ajudar no reencontro</p>
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
  padding: 4rem 0;
  background: rgba(255, 255, 255, 0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #FFD700;
  margin-bottom: 3rem;
  font-weight: bold;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card h3 {
  color: #FFD700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.card p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  h2 {
    font-size: 2rem;
  }
}
</style>