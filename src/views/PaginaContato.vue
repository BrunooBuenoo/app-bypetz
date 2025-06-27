<template>
  <div class="contato-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">Fale com a gente</h1>
          <p class="hero-subtitle">Estamos aqui para ajudar você e seu pet</p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="main-container">
      <!-- Descrição -->
      <section class="intro-section">
        <div class="intro-content">
          <p>Se você precisa de ajuda, quer relatar um animal perdido ou encontrado, ou tem alguma dúvida sobre o funcionamento do nosso site, estamos aqui para te ouvir!</p>
          <p>Na <strong>ByPetz</strong>, acreditamos que cada mensagem pode fazer a diferença na vida de um pet e de uma família. Nossa equipe está pronta para te apoiar da melhor forma possível.</p>
        </div>
      </section>

      <!-- Formas de Contato -->
      <section class="contact-section">
        <div class="section-header">
          <h2 class="section-title">Como entrar em contato</h2>
        </div>
        <div class="contact-grid">
          <a href="https://wa.me/5514998886799" target="_blank" class="contact-card whatsapp">
            <div class="contact-info">
              <h3 class="contact-title">WhatsApp</h3>
              <p class="contact-description">Resposta rápida</p>
              <span class="contact-detail">(14) 99888-6799</span>
            </div>
          </a>
          
          <a href="mailto:contato@bypetz.com.br" class="contact-card email">
            <div class="contact-info">
              <h3 class="contact-title">E-mail</h3>
              <p class="contact-description">Suporte detalhado</p>
              <span class="contact-detail">contato@bypetz.com.br</span>
            </div>
          </a>
          
          <a href="tel:+5514998886799" class="contact-card phone">
            <div class="contact-info">
              <h3 class="contact-title">Telefone</h3>
              <p class="contact-description">Atendimento direto</p>
              <span class="contact-detail">(14) 99888-6799</span>
            </div>
          </a>
          
          <a href="https://instagram.com/bypetz.com.br" target="_blank" class="contact-card instagram">
            <div class="contact-info">
              <h3 class="contact-title">Instagram</h3>
              <p class="contact-description">Novidades e dicas</p>
              <span class="contact-detail">@bypetz.com.br</span>
            </div>
          </a>
        </div>
      </section>

      <!-- FAQ -->
      <section class="faq-section">
        <div class="section-header">
          <h2 class="section-title">Perguntas Frequentes</h2>
        </div>
        <div class="faq-grid">
          <div class="faq-card">
            <h3 class="faq-question">Como cadastrar um pet?</h3>
            <p class="faq-answer">Clique em "Cadastrar Pet" e preencha as informações. É rápido e gratuito!</p>
          </div>
          
          <div class="faq-card">
            <h3 class="faq-question">Como buscar pets?</h3>
            <p class="faq-answer">Use os filtros no feed para encontrar pets por cidade, tipo e status.</p>
          </div>
          
          <div class="faq-card">
            <h3 class="faq-question">Como entrar em contato com tutores?</h3>
            <p class="faq-answer">Clique no pet desejado e use os botões de WhatsApp ou Instagram disponíveis.</p>
          </div>
          
          <div class="faq-card">
            <h3 class="faq-question">Casos de emergência?</h3>
            <p class="faq-answer">Para casos urgentes, ligue diretamente ou mande WhatsApp. Priorizamos emergências!</p>
          </div>
        </div>
      </section>

      <!-- Horários -->
      <section class="hours-section">
        <div class="section-header">
          <h2 class="section-title">Horários de Atendimento</h2>
        </div>
        <div class="hours-grid">
          <div class="hours-card">
            <h3 class="hours-title">WhatsApp</h3>
            <p class="hours-time">24 horas por dia</p>
            <p class="hours-note">Resposta automática</p>
          </div>
          
          <div class="hours-card">
            <h3 class="hours-title">E-mail</h3>
            <p class="hours-time">Seg - Sex: 8h às 18h</p>
            <p class="hours-note">Resposta em até 24h</p>
          </div>
          
          <div class="hours-card">
            <h3 class="hours-title">Telefone</h3>
            <p class="hours-time">Seg - Sex: 9h às 17h</p>
            <p class="hours-note">Atendimento ao vivo</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Pronto para ajudar mais um pet?</h2>
          <p class="cta-description">Junte-se à nossa comunidade e ajude a reunir famílias!</p>
          <router-link to="/cadastrar-pet" class="btn-primary">
            Cadastrar Pet Agora
          </router-link>
        </div>
      </section>
    </div>
  </div>
    <!-- Footer -->
    <RodapeSite />
</template>

<script>
import RodapeSite from '../components/RodapeSite.vue';
export default {
  components: {
    RodapeSite
  },
  name: "PaginaContato"
}
</script>

<style scoped>
.contato-page {
  min-height: 100vh;
  background: #ffffff;
  padding-top: 80px;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  padding: 6rem 0 4rem;
}

.hero-container {
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

/* Intro Section */
.intro-section {
  padding: 4rem 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.intro-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.intro-content p {
  font-size: 1.125rem;
  color: #374151;
  line-height: 1.7;
  margin: 0 0 1.5rem 0;
}

.intro-content p:last-child {
  margin-bottom: 0;
}

.intro-content strong {
  color: #9333ea;
  font-weight: 600;
}

/* Contact Section */
.contact-section {
  padding: 4rem 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.contact-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1rem;
  padding: 2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.contact-card.whatsapp:hover {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.02);
}

.contact-card.email:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.02);
}

.contact-card.phone:hover {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.02);
}

.contact-card.instagram:hover {
  border-color: #ec4899;
  background: rgba(236, 72, 153, 0.02);
}

.contact-info {
  text-align: center;
}

.contact-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.contact-description {
  color: #6b7280;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
}

.contact-detail {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

/* FAQ Section */
.faq-section {
  padding: 4rem 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.faq-card {
  background: rgba(249, 250, 251, 0.8);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.faq-card:hover {
  background: rgba(147, 51, 234, 0.02);
  border-color: rgba(147, 51, 234, 0.1);
  transform: translateY(-2px);
}

.faq-question {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.faq-answer {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Hours Section */
.hours-section {
  padding: 4rem 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.hours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.hours-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.hours-card:hover {
  background: rgba(147, 51, 234, 0.02);
  border-color: rgba(147, 51, 234, 0.1);
  transform: translateY(-2px);
}

.hours-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
}

.hours-time {
  color: #9333ea;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.hours-note {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
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

.btn-primary {
  background: linear-gradient(to right, #9333ea, #2563eb);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: inline-block;
}

.btn-primary:hover {
  background: linear-gradient(to right, #7c3aed, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
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
  
  .intro-section,
  .contact-section,
  .faq-section,
  .hours-section {
    padding: 3rem 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
  }
  
  .hours-grid {
    grid-template-columns: 1fr;
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
  
  .intro-section,
  .contact-section,
  .faq-section,
  .hours-section {
    padding: 2rem 0;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .intro-content p {
    font-size: 1rem;
  }
  
  .contact-card,
  .faq-card,
  .hours-card {
    padding: 1.5rem;
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
}
</style>