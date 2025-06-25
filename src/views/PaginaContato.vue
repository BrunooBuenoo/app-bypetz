<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>Fale com a gente!</h1>
        <p class="hero-subtitle">Estamos aqui para ajudar você e seu pet</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="contact-container">
      <!-- Description -->
      <div class="description-section">
        <p>Se você precisa de ajuda, quer relatar um animal perdido ou encontrado, ou tem alguma dúvida sobre o funcionamento do nosso site, estamos aqui para te ouvir!</p>
        <p>Na <strong>ByPetz</strong>, acreditamos que cada mensagem pode fazer a diferença na vida de um pet e de uma família. Nossa equipe está pronta para te apoiar da melhor forma possível.</p>
      </div>

      <!-- Contact Buttons -->
      <div class="contact-buttons">
        <a href="https://wa.me/5514998886799" target="_blank" class="btn btn-whatsapp">
          <span>WhatsApp</span>
          <small>Resposta rápida</small>
        </a>
        
        <a href="mailto:contato@bypetz.com.br" class="btn btn-email">
          <span>E-mail</span>
          <small>Suporte detalhado</small>
        </a>
        
        <a href="tel:+5514998886799" class="btn btn-phone">
          <span>Telefone</span>
          <small>Atendimento direto</small>
        </a>
        
        <a href="https://instagram.com/bypetz.com.br" target="_blank" class="btn btn-instagram">
          <span>Instagram</span>
          <small>Novidades e dicas</small>
        </a>
      </div>

      <!-- FAQ Section -->
      <div class="faq-section">
        <h2>Perguntas Frequentes</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <div class="faq-icon"><i class="fas fa-question-circle"></i></div>
            <h4>Como cadastrar um pet?</h4>
            <p>Clique em "Cadastrar Pet" e preencha as informações. É rápido e gratuito!</p>
          </div>
          
          <div class="faq-item">
            <div class="faq-icon"><i class="fas fa-search"></i></div>
            <h4>Como buscar pets?</h4>
            <p>Use os filtros no feed para encontrar pets por cidade, tipo e status.</p>
          </div>
          
          <div class="faq-item">
            <div class="faq-icon"><i class="fas fa-mobile-alt"></i></div>
            <h4>Como entrar em contato?</h4>
            <p>Use WhatsApp, e-mail ou telefone. Estamos sempre disponíveis para ajudar!</p>
          </div>
          
          <div class="faq-item">
            <div class="faq-icon"><i class="fas fa-exclamation-triangle"></i></div>
            <h4>Emergência?</h4>
            <p>Para casos urgentes, ligue diretamente ou mande WhatsApp. Priorizamos emergências!</p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="cta-section">
        <h3>Pronto para ajudar mais um pet?</h3>
        <p>Junte-se à nossa comunidade e ajude a reunir famílias!</p>
        <router-link to="/cadastrar-pet" class="cta-button">
          Cadastrar Pet Agora
        </router-link>
      </div>
    </div>
  </div>
  <RodapeSite/>
</template>

<script scoped>
import RodapeSite from '../components/RodapeSite.vue'

export default {
  name: "PaginaContato",
  components: {
    RodapeSite,
  },
}
</script>

<style>
.contact-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #8C52FF 0%, #6B3DD6 50%, #4A2B9A 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 8rem 2rem 4rem;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-section h1 {
  font-size: 3.5rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 800;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0;
  font-weight: 300;
}

/* Main Container */
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

/* Description Section */
.description-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  margin-bottom: 4rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.description-section p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.description-section p:last-child {
  margin-bottom: 0;
}

.description-section strong {
  color: #FFD700;
  font-weight: 700;
}

/* Contact Buttons */
.contact-buttons {
  display: flex;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.btn {
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  padding: 2rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn span {
  font-size: 1.3rem;
  font-weight: 700;
}

.btn small {
  font-size: 0.9rem;
  opacity: 0.7;
  font-weight: 400;
}

.btn-whatsapp {
  background: linear-gradient(135deg, #25D366, #128C7E);
  color: white;
}

.btn-whatsapp:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(37, 211, 102, 0.4);
}

.btn-email {
  background: linear-gradient(135deg, #3B82F6, #1E40AF);
  color: white;
}

.btn-email:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4);
}

.btn-phone {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: white;
}

.btn-phone:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(245, 158, 11, 0.4);
}

.btn-instagram {
  background: linear-gradient(135deg, #E1306C, #C13584, #833AB4);
  color: white;
}

.btn-instagram:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(225, 48, 108, 0.4);
}

/* FAQ Section */
.faq-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  margin-bottom: 4rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.faq-section h2 {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 700;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.faq-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.faq-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.faq-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.faq-item h4 {
  color: #FFD700;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.faq-item p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

/* Hours Section */
.hours-section {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 4rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hours-section h3 {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  font-weight: 700;
}

.hours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.hours-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* CTA Section */
.cta-section {
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
  border-radius: 24px;
  padding: 4rem 2rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.cta-section h3 {
  color: white;
  font-size: 2.2rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.cta-section p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #8B5CF6;
  padding: 1.25rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
}

.cta-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);
  background: linear-gradient(135deg, #FFA500, #FF8C00);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 6rem 1rem 3rem;
  }
  
  .hero-section h1 {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .contact-container {
    padding: 0 1rem 3rem;
  }
  
  .description-section {
    padding: 2rem;
  }
  
  .description-section p {
    font-size: 1rem;
  }
  
  .contact-buttons {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    display: grid;
  }
  
  .btn {
    padding: 1.5rem;
  }
  
  .btn span {
    font-size: 1.1rem;
  }
  
  .faq-section {
    padding: 2rem;
  }
  
  .faq-section h2 {
    font-size: 2rem;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .hours-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-section {
    padding: 3rem 1.5rem;
  }
  
  .cta-section h3 {
    font-size: 1.8rem;
  }
  
  .cta-button {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .description-section {
    padding: 1.5rem;
  }
  
  .btn {
    padding: 1.25rem;
  }
  
  .faq-section {
    padding: 1.5rem;
  }
  
  .faq-item {
    padding: 1.5rem;
  }
  
  .hours-section {
    padding: 2rem;
  }
  
  .cta-section {
    padding: 2rem 1rem;
  }
}
</style>
