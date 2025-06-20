<template>
  <div class="hero">
    <div class="container-sm">
      <div class="img-box">
        <div class="pet-graphic">
          <div class="chart-container">
            <div class="chart-bar" style="height: 60%"></div>
            <div class="chart-bar" style="height: 80%"></div>
            <div class="chart-bar" style="height: 100%"></div>
            <div class="chart-bar" style="height: 40%"></div>
          </div>
          <div class="social-icons">
            <div class="social-icon">📱</div>
            <div class="social-icon">💬</div>
            <div class="social-icon">📢</div>
          </div>
        </div>
      </div>
      <div class="text-box">
        <h1 class="title2">Alcance milhares em minutos!</h1>
        <p>Ative uma campanha de impacto nas redes sociais e aumente as chances de reencontro na região.</p>
        <h3 class="g">03 pet(s) encontrados na região</h3>
        <div class="btn-box">
          <a href="/feed" class="btn">Ajude a aumentar esse número <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="perfil-container">
          <div class="perfil-avatars">
            <div class="avatar">👤</div>
            <div class="avatar">👤</div>
            <div class="avatar">👤</div>
            <div class="avatar-more">+12</div>
          </div>
          <span class="perfil-text">Pessoas ajudando na região</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecaoInfo'
}
</script>

<style scoped>
.hero {
  width: 100%;
  background-color: #8C52FF;
  padding: 4rem 0;
}

.container-sm {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
}

.img-box {
  flex: 1;
  display: flex;
  justify-content: center;
}

.pet-graphic {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.chart-container {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 150px;
}

.chart-bar {
  width: 30px;
  background: linear-gradient(to top, #FFD700, #FFA500);
  border-radius: 4px 4px 0 0;
  animation: growUp 2s ease-out;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: bounce 2s infinite;
}

.social-icon:nth-child(2) {
  animation-delay: 0.2s;
}

.social-icon:nth-child(3) {
  animation-delay: 0.4s;
}

.text-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title2 {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  line-height: 1.2;
}

.text-box p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.g {
  color: #00BF77;
  font-weight: bold;
  font-size: 1.3rem;
}

.btn-box {
  display: flex;
  gap: 1rem;
}

.btn {
  background: white;
  color: #8C52FF;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:hover {
  background: #FFD700;
  color: white;
  transform: translateY(-2px);
}

.perfil-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.perfil-avatars {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
  border: 3px solid #8C52FF;
  font-size: 1.2rem;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar-more {
  width: 40px;
  height: 40px;
  background: #FFD700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
  border: 3px solid #8C52FF;
  font-size: 0.8rem;
  font-weight: bold;
  color: #8C52FF;
}

.perfil-text {
  color: white;
  font-size: 0.9rem;
}

@keyframes growUp {
  from { height: 0; }
  to { height: var(--final-height); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@media (max-width: 992px) {
  .container-sm {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }

  .title2 {
    font-size: 2.5rem;
  }

  .img-box {
    order: 2;
  }

  .text-box {
    order: 1;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 0;
  }

  .title2 {
    font-size: 2rem;
  }

  .text-box p {
    font-size: 1rem;
  }

  .pet-graphic {
    width: 250px;
    height: 250px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>