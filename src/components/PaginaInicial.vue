<template>
  <div class="hero-container">
    <div class="hero-content">
      <div class="text-section">
        <h1 class="hero-title">Reunindo patas e corações de quem tanto amamos</h1>
        <p class="hero-description">
          Conectamos famílias e seus pets. Cadastre animais perdidos, publique achados ou descubra um novo amigo para adotar. Juntos, podemos transformar vidas!
        </p>
        <div class="button-group">
          <router-link to="/cadastrar-pet" class="btn-primary">
            Perdi meu pet
          </router-link>
          <router-link to="/feed" class="btn-secondary">
            Explorar Pets
          </router-link>
        </div>
      </div>
      
      <div class="image-section">
        <div class="main-image-container">
          <div class="pets-image">
            <img 
              src="/src/assets/pets.svg" 
              alt="Pets - Cachorro e Gato" 
              class="pets-photo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroComponent'
}
</script>

<style scoped>
.hero-container {
  padding-top: 90px;
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin: 0;
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
  transform: scaleX(-1);
}

.dog-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 3rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
  position: relative;
  z-index: 10;
}

.text-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 500px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin: 0;
}

.hero-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  border: 2px solid transparent;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: #9333ea;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.image-section {
  flex: 1.5;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 700px;
}

.main-image-container {
  position: relative;
  z-index: 5;
}

.pets-image {
  width: 700px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pets-photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
}

/* Responsividade */
@media (max-width: 1024px) {
  .hero-content {
    gap: 2rem;
    padding: 2rem 2rem;
    max-width: 1200px;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .image-section {
    height: 600px;
  }
  
  .pets-image {
    width: 500px;
    height: 500px;
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
}

@media (max-width: 768px) {
  .pets-photo{
    position: relative;
    top: 39px;
    height: 200%;
  }

  .hero-content {
    flex-direction: column;
    gap: 3rem;
    text-align: center;
    padding: 2rem 1rem;
  }

  .text-section {
    max-width: none;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .button-group {
    justify-content: center;
  }

  .image-section {
    height: 400px;
  }

  .pets-image {
    width: 500px;
    height: 350px;
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
}

@media (max-width: 480px) {
  .hero-content {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
  }

  .pets-image {
    width: 350px;
    height: 250px;
  }

  .image-section {
    height: 300px;
  }

  .hero-dog {
    display: none;
  }
}

@media (min-width: 1400px) {
  .hero-content {
    max-width: 1400px;
    padding: 2rem 4rem;
  }
  
  .image-section {
    height: 800px;
  }
  
  .pets-image {
    width: 700px;
    height: 700px;
  }
}
</style>