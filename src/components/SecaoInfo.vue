<template>
  <div class="hero">
    <div class="background-effects">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
    </div>
    
    <div class="container-sm">
      <div class="img-box">
        <div class="pet-graphic">
          <div class="chart-container">
            <div class="chart-wrapper">
              <div class="chart-bar" data-height="60">
                <div class="bar-fill"></div>
                <div class="bar-glow"></div>
              </div>
              <div class="chart-bar" data-height="80">
                <div class="bar-fill"></div>
                <div class="bar-glow"></div>
              </div>
              <div class="chart-bar" data-height="100">
                <div class="bar-fill"></div>
                <div class="bar-glow"></div>
              </div>
              <div class="chart-bar" data-height="40">
                <div class="bar-fill"></div>
                <div class="bar-glow"></div>
              </div>
            </div>
            <div class="chart-base"></div>
          </div>
          
          <div class="social-icons">
            <div class="social-icon mobile-icon">
              <div class="icon-content">📱</div>
              <div class="icon-ripple"></div>
            </div>
            <div class="social-icon chat-icon">
              <div class="icon-content">💬</div>
              <div class="icon-ripple"></div>
            </div>
            <div class="social-icon megaphone-icon">
              <div class="icon-content">📢</div>
              <div class="icon-ripple"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-box">
        <div class="title-container">
          <h1 class="title2">
            <span class="title-word">Alcance</span>
            <span class="title-word highlight">milhares</span>
            <span class="title-word">em minutos!</span>
          </h1>
          <div class="title-decoration"></div>
        </div>
        
        <p class="description">
          Ative uma campanha de impacto nas redes sociais e aumente as chances de reencontro na região.
        </p>
        
        <div class="stats-card">
          <div class="stats-number">03</div>
          <div class="stats-text">pet(s) encontrados na região</div>
          <div class="stats-pulse"></div>
        </div>
        
        <div class="btn-box">
          <a href="/feed" class="btn-primary">
            <span class="btn-text">Ajude a aumentar esse número</span>
            <div class="btn-arrow">→</div>
            <div class="btn-shine"></div>
          </a>
        </div>
        
        <div class="perfil-container">
          <div class="perfil-avatars">
            <div class="avatar avatar-1">
              <div class="avatar-inner">👤</div>
            </div>
            <div class="avatar avatar-2">
              <div class="avatar-inner">👤</div>
            </div>
            <div class="avatar avatar-3">
              <div class="avatar-inner">👤</div>
            </div>
            <div class="avatar-more">
              <div class="more-inner">+12</div>
            </div>
          </div>
          <div class="perfil-text-container">
            <span class="perfil-text">Pessoas ajudando na região</span>
            <div class="perfil-indicator"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecaoInfoBranca'
}
</script>

<style scoped>
.hero {
  width: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%);
  padding: 6rem 0;
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
  background: rgba(140, 82, 255, 0.05);
  backdrop-filter: blur(20px);
  animation: float 6s ease-in-out infinite;
  border: 1px solid rgba(140, 82, 255, 0.1);
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 5%;
  animation-delay: 2s;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.orb-3 {
  width: 100px;
  height: 100px;
  top: 60%;
  right: 30%;
  animation-delay: 4s;
}

.container-sm {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6rem;
  position: relative;
  z-index: 10;
}

.img-box {
  flex: 1;
  display: flex;
  justify-content: center;
}

.pet-graphic {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
}

.chart-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-wrapper {
  display: flex;
  align-items: end;
  gap: 1.5rem;
  height: 180px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(140, 82, 255, 0.1);
  box-shadow: 0 10px 40px rgba(140, 82, 255, 0.1);
}

.chart-bar {
  position: relative;
  width: 40px;
  height: 100%;
  display: flex;
  align-items: end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #8C52FF, #6B3DD6, #4A2B9A);
  border-radius: 8px 8px 0 0;
  position: relative;
  animation: growUp 2s ease-out forwards;
  box-shadow: 0 4px 20px rgba(140, 82, 255, 0.3);
}

.chart-bar[data-height="60"] .bar-fill { height: 60%; }
.chart-bar[data-height="80"] .bar-fill { height: 80%; }
.chart-bar[data-height="100"] .bar-fill { height: 100%; }
.chart-bar[data-height="40"] .bar-fill { height: 40%; }

.bar-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom, rgba(140, 82, 255, 0.6), transparent);
  border-radius: 8px 8px 0 0;
  animation: pulse 2s ease-in-out infinite;
}

.chart-base {
  width: 100%;
  height: 4px;
  background: rgba(140, 82, 255, 0.2);
  border-radius: 2px;
  margin-top: 1rem;
}

.social-icons {
  display: flex;
  gap: 2rem;
}

.social-icon {
  position: relative;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 8px 32px rgba(140, 82, 255, 0.2);
  border: 1px solid rgba(140, 82, 255, 0.1);
  cursor: pointer;
  transition: all 0.4s ease;
  animation: bounce 3s infinite;
}

.social-icon:nth-child(2) { 
  animation-delay: 0.3s;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
}
.social-icon:nth-child(3) { animation-delay: 0.6s; }

.social-icon:hover {
  transform: translateY(-10px) scale(1.1);
  box-shadow: 0 15px 40px rgba(140, 82, 255, 0.3);
}

.social-icon:nth-child(2):hover {
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.3);
}

.icon-content {
  position: relative;
  z-index: 2;
  color: white;
}

.icon-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 2s infinite;
}

.text-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.title-container {
  position: relative;
}

.title2 {
  font-size: 3.5rem;
  font-weight: 800;
  color: #333;
  line-height: 1.2;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.title-word {
  display: inline-block;
  animation: slideInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.title-word:nth-child(1) { animation-delay: 0.1s; }
.title-word:nth-child(2) { animation-delay: 0.2s; }
.title-word:nth-child(3) { animation-delay: 0.3s; }

.highlight {
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.title-decoration {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #8C52FF, #6B3DD6);
  border-radius: 2px;
  margin-top: 1rem;
  animation: expandWidth 1s ease-out 0.5s forwards;
  width: 0;
}

.description {
  font-size: 1.3rem;
  color: #666;
  line-height: 1.7;
  margin: 0;
  animation: fadeInUp 0.8s ease-out 0.4s forwards;
  opacity: 0;
  transform: translateY(20px);
  font-weight: 500;
}

.stats-card {
  position: relative;
  background: rgba(140, 82, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(140, 82, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(140, 82, 255, 0.05);
}

.stats-number {
  font-size: 3rem;
  font-weight: 800;
  color: #00BF77;
  text-shadow: 0 0 20px rgba(0, 191, 119, 0.3);
}

.stats-text {
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
}

.stats-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(0, 191, 119, 0.05), transparent);
  animation: shimmer 3s infinite;
}

.btn-box {
  display: flex;
}

.btn-primary {
  position: relative;
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  color: white;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.4s ease;
  box-shadow: 0 8px 32px rgba(140, 82, 255, 0.2);
  border: 2px solid transparent;
  overflow: hidden;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(140, 82, 255, 0.3);
  background: linear-gradient(135deg, #6B3DD6, #4A2B9A);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-arrow {
  font-size: 1.2rem;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-arrow {
  transform: translateX(5px);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

.perfil-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.perfil-avatars {
  display: flex;
  align-items: center;
}

.avatar {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: -15px;
  border: 3px solid rgba(140, 82, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(140, 82, 255, 0.1);
}

.avatar:first-child {
  margin-left: 0;
}

.avatar:hover {
  transform: translateY(-5px) scale(1.1);
  z-index: 10;
  box-shadow: 0 8px 25px rgba(140, 82, 255, 0.2);
}

.avatar-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
}

.avatar-more {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: -15px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.1);
}

.more-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
}

.perfil-text-container {
  position: relative;
}

.perfil-text {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

.perfil-indicator {
  width: 8px;
  height: 8px;
  background: #00BF77;
  border-radius: 50%;
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  animation: pulse 2s infinite;
  box-shadow: 0 0 10px rgba(0, 191, 119, 0.5);
}

/* Animações */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes growUp {
  from { height: 0; opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-15px); }
  60% { transform: translateY(-8px); }
}

@keyframes ripple {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 100px; height: 100px; opacity: 0; }
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

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

/* Responsividade */
@media (max-width: 1024px) {
  .container-sm {
    gap: 4rem;
    padding: 0 2rem;
  }
  
  .title2 {
    font-size: 3rem;
  }
  
  .pet-graphic {
    width: 350px;
    height: 350px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 0;
  }
  
  .container-sm {
    flex-direction: column;
    text-align: center;
    gap: 4rem;
    padding: 0 1rem;
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
  
  .pet-graphic {
    width: 300px;
    height: 300px;
  }
  
  .chart-wrapper {
    gap: 1rem;
    height: 150px;
  }
  
  .chart-bar {
    width: 30px;
  }
  
  .social-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .title2 {
    font-size: 2rem;
  }

  .description {
    font-size: 1.1rem;
  }

  .pet-graphic {
    width: 250px;
    height: 250px;
    gap: 2rem;
  }
  
  .social-icons {
    gap: 1rem;
  }
  
  .social-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}
</style>