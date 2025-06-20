<template>
  <div class="container-sm">
    <div class="hero">
      <div class="text-box">
        <h1 class="title">Reunindo patas e corações de quem tanto amamos</h1>
        <p>Conectamos famílias e seus pets. Cadastre animais perdidos, publique achados ou descubra um novo amigo para adotar. Juntos, podemos transformar vidas!</p>
        <div class="btn-box">
          <a href="/lost-animals" class="btn">Perdi meu pet <i class="fa-solid fa-arrow-right"></i></a>
          <a href="/lost-animals" class="btn1">Achei um pet <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
      <div class="img-box">
        <div class="pet-container">
          <div class="pet-emoji">🐕</div>
        </div>
        <div class="vetor"></div>
        <div class="vetor1"></div>
        <!-- Patinhas decorativas -->
        <div class="paw paw-1">🐾</div>
        <div class="paw paw-2">🐾</div>
        <div class="paw paw-3">🐾</div>
        <div class="paw paw-4">🐾</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginaInicial'
}
</script>

<style scoped>
.container-sm {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  display: flex;
  align-items: center;
  min-height: 90vh;
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4rem;
  width: 100%;
}

.text-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  z-index: 10;
}

.title {
  font-size: 3.5rem;
  font-weight: bold;
  color: #d6c3fc;
  line-height: 1.2;
}

.text-box p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.btn-box {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn, .btn1 {
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn {
  background: white;
  color: #8C52FF;
}

.btn:hover {
  background: #FFD700;
  color: white;
  transform: translateY(-2px);
}

.btn1 {
  background: #8C52FF;
  color: white;
  border: 2px solid white;
}

.btn1:hover {
  background: white;
  color: #8C52FF;
  transform: translateY(-2px);
}

.img-box {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
}

.pet-container {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.pet-emoji {
  font-size: 8rem;
}

.vetor, .vetor1 {
  position: absolute;
  background: rgba(140, 82, 255, 0.3);
  border-radius: 50%;
}

.vetor {
  width: 400px;
  height: 400px;
  right: -10%;
  bottom: -10%;
  z-index: 1;
}

.vetor1 {
  width: 200px;
  height: 200px;
  left: -20%;
  top: -10%;
  z-index: 1;
}

.paw {
  position: absolute;
  font-size: 2rem;
  color: #FFD700;
  opacity: 0.7;
  animation: float 3s ease-in-out infinite;
}

.paw-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.paw-2 {
  top: 20%;
  right: 20%;
  animation-delay: 1s;
}

.paw-3 {
  bottom: 30%;
  left: 5%;
  animation-delay: 2s;
}

.paw-4 {
  bottom: 10%;
  right: 10%;
  animation-delay: 1.5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 992px) {
  .hero {
    flex-direction: column;
    gap: 3rem;
    text-align: center;
  }

  .title {
    font-size: 2.5rem;
  }

  .text-box p {
    font-size: 1.1rem;
  }

  .btn-box {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .container-sm {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .text-box p {
    font-size: 1rem;
  }

  .pet-container {
    width: 250px;
    height: 250px;
  }

  .pet-emoji {
    font-size: 6rem;
  }

  .btn-box {
    flex-direction: column;
    align-items: center;
  }

  .btn, .btn1 {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>