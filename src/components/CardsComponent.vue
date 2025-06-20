<template>
  <div class="cards-section">
    <div class="background-effects">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
    </div>
    
    <div class="container">
      <div class="section-header">
        <h2>Como Funciona</h2>
        <div class="header-decoration"></div>
      </div>
      
      <div class="cards-grid">
        <div class="card card-1">
          <div class="card-icon">
            <i class="fas fa-search"></i>
          </div>
          <div class="card-number">01</div>
          <h3>Cadastre</h3>
          <p>Registre seu pet perdido ou encontrado com fotos e informações detalhadas</p>
          <div class="card-glow"></div>
        </div>
        
        <div class="card card-2">
          <div class="card-icon">
            <i class="fas fa-bullhorn"></i>
          </div>
          <div class="card-number">02</div>
          <h3>Divulgue</h3>
          <p>Sua publicação será vista por milhares de pessoas na região</p>
          <div class="card-glow"></div>
        </div>
        
        <div class="card card-3">
          <div class="card-icon">
            <i class="fas fa-heart"></i>
          </div>
          <div class="card-number">03</div>
          <h3>Reencontre</h3>
          <p>Conecte-se diretamente com quem pode ajudar no reencontro</p>
          <div class="card-glow"></div>
        </div>
      </div>
      
      <div class="section-footer">
        <div class="stats-row">
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
  name: 'CardsComoFuncionaCompacto'
}
</script>

<style scoped>
/* Importar FontAwesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.cards-section {
  padding: 4rem 0; /* Reduzido de 6rem para 4rem */
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FFB347 75%, #FFCC5C 100%);
  position: relative;
  overflow: hidden;
}

.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  animation: float 8s ease-in-out infinite;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.orb-1 {
  width: 150px;
  height: 150px;
  top: 15%;
  right: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 100px;
  height: 100px;
  bottom: 25%;
  left: 8%;
  animation-delay: 3s;
}

.orb-3 {
  width: 80px;
  height: 80px;
  top: 70%;
  right: 25%;
  animation-delay: 6s;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
  position: relative;
  z-index: 10;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem; /* Reduzido de 4rem para 3rem */
}

h2 {
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: slideInDown 0.8s ease-out;
}

.header-decoration {
  width: 100px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  margin: 0 auto;
  animation: expandWidth 1s ease-out 0.3s forwards;
  width: 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem; /* Reduzido de 3rem para 2.5rem */
  margin-bottom: 3rem; /* Reduzido de 4rem para 3rem */
}

.card {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 2.5rem 2rem; /* Reduzido de 3rem para 2.5rem */
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
  overflow: hidden;
  animation: slideInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.card-1 { animation-delay: 0.2s; }
.card-2 { animation-delay: 0.4s; }
.card-3 { animation-delay: 0.6s; }

.card:hover {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.25);
}

.card-icon {
  position: relative;
  width: 70px; /* Reduzido de 80px para 70px */
  height: 70px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem; /* Reduzido de 2rem para 1.5rem */
  font-size: 1.8rem; /* Reduzido de 2rem para 1.8rem */
  color: #FF8C00;
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 40px rgba(255, 255, 255, 0.4);
}

.card-number {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.card h3 {
  color: white;
  font-size: 1.6rem; /* Reduzido de 1.8rem para 1.6rem */
  margin-bottom: 1rem; /* Reduzido de 1.5rem para 1rem */
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card p {
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6; /* Reduzido de 1.7 para 1.6 */
  font-size: 1rem; /* Reduzido de 1.1rem para 1rem */
  font-weight: 500;
  margin: 0;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: shimmer 3s infinite;
}

.card:hover .card-glow {
  opacity: 1;
}

.section-footer {
  margin-top: 2rem; /* Reduzido de 4rem para 2rem */
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  animation: fadeInUp 0.8s ease-out 0.8s forwards;
  opacity: 0;
  transform: translateY(20px);
}

.stat-item:nth-child(2) { animation-delay: 1s; }
.stat-item:nth-child(3) { animation-delay: 1.2s; }

.stat-number {
  font-size: 2.2rem; /* Reduzido de 2.5rem para 2.2rem */
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem; /* Reduzido de 1rem para 0.9rem */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Animações */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(3deg); }
}

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInUp {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes expandWidth {
  to { width: 100px; }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Responsividade */
@media (max-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
  
  .cards-grid {
    gap: 2rem;
  }
  
  h2 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .cards-section {
    padding: 4rem 0; /* Mantém o mesmo para mobile */
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  h2 {
    font-size: 2rem;
  }
  
  .card {
    padding: 2.5rem 1.5rem;
  }
  
  .stats-row {
    gap: 2rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .card {
    padding: 2rem 1rem;
  }
  
  .card-icon {
    width: 70px;
    height: 70px;
    font-size: 1.8rem;
  }
  
  h2 {
    font-size: 1.8rem;
  }
  
  .stats-row {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>