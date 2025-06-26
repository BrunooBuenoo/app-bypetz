<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">Menu</h3>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/cadastrar-pet">Cadastrar Pet</router-link></li>
            <li><router-link to="/feed">Feed</router-link></li>
            <li><router-link to="/loja">Loja</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Sobre Nós</h3>
          <ul class="footer-links">
            <li><router-link to="/sobre">Sobre</router-link></li>
            <li><router-link to="/contato">Contato</router-link></li>
            <li><a href="#como-funciona">Como Funciona</a></li>
          </ul>
        </div>

        <div class="footer-section company-section">
          <h3 class="footer-title">ByPetz</h3>
          <p class="company-description">
            ByPetz é a plataforma que conecta donos e amantes de pets, oferecendo
            ferramentas para cadastro de animais perdidos e facilitação do processo
            de adoção responsável.
          </p>
          <div class="company-stats">
            <div class="stat">
              <span class="stat-number">2.5k+</span>
              <span class="stat-label">Usuários</span>
            </div>
            <div class="stat">
              <span class="stat-number">500+</span>
              <span class="stat-label">Pets Salvos</span>
            </div>
          </div>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Redes Sociais</h3>
          <div class="social-links">
            <a href="https://www.instagram.com/bypetz.com.br/" target="_blank" class="social-link instagram">
              Instagram
            </a>
            <a href="https://wa.me/5514998886799" target="_blank" class="social-link whatsapp">
              WhatsApp
            </a>
          </div>
          
          <div class="newsletter">
            <h4 class="newsletter-title">Newsletter</h4>
            <div class="newsletter-form">
              <input type="email" placeholder="Seu e-mail" class="newsletter-input">
              <button type="submit" class="newsletter-button">
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="copyright">
          ByPetz © 2025 - Todos os direitos reservados
        </div>
        <div class="footer-bottom-links">
          <a href="/privacy">Privacidade</a>
          <a href="/terms">Termos</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "RodapeSite"
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  color: white;
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 3rem 0;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.footer-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links li a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 400;
  transition: all 0.3s ease;
}

.footer-links li a:hover {
  color: white;
  transform: translateX(4px);
}

.company-section {
  max-width: 300px;
}

.company-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 0.9rem;
  margin: 0;
}

.company-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 80px;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 500;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateY(-2px);
}

.social-link.instagram:hover {
  background: rgba(228, 64, 95, 0.2);
  border-color: rgba(228, 64, 95, 0.5);
}

.social-link.whatsapp:hover {
  background: rgba(37, 211, 102, 0.2);
  border-color: rgba(37, 211, 102, 0.5);
}

.newsletter {
  margin-top: 1rem;
}

.newsletter-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.newsletter-input {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.newsletter-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.newsletter-button {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.newsletter-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.footer-bottom-links {
  display: flex;
  gap: 2rem;
}

.footer-bottom-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.footer-bottom-links a:hover {
  color: white;
}

/* Responsividade */
@media (max-width: 1024px) {
  .container {
    padding: 3rem 2rem 0;
  }
  
  .footer-content {
    gap: 2.5rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 3rem 1rem 0;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .company-section {
    max-width: none;
  }

  .company-stats {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .newsletter-form {
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 2rem 1rem 0;
  }

  .footer-content {
    gap: 2rem;
  }
  
  .company-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .footer-bottom-links {
    flex-direction: column;
    gap: 1rem;
  }

  .social-links {
    max-width: 200px;
    margin: 0 auto;
  }
}
</style>