<template>
  <footer class="footer" role="contentinfo">
    <div class="background-effects">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
    </div>
    
    <div class="container-footer">
      <div class="row">
        <nav class="menu" aria-label="Menu principal">
          <h3>
            <i class="fas fa-bars"></i>
            Menu
          </h3>
          <ul>
            <li><a href="/"><i class="fas fa-home"></i>Home</a></li>
            <li><a href="/lost-animals"><i class="fas fa-plus-circle"></i>Cadastrar Pet</a></li>
            <li><a href="/feed"><i class="fas fa-heart"></i>Adoção</a></li>
          </ul>
        </nav>

        <section class="sobre" aria-labelledby="footer-sobre">
          <h3 id="footer-sobre">
            <i class="fas fa-info-circle"></i>
            Nós
          </h3>
          <ul>
            <li><a href="/about"><i class="fas fa-users"></i>Sobre</a></li>
            <li><a href="/about#how-it-works"><i class="fas fa-cogs"></i>Como Funciona</a></li>
            <li><a href="/contact"><i class="fas fa-envelope"></i>Contato</a></li>
          </ul>
        </section>

        <section class="company" aria-labelledby="footer-company">
          <h3 id="footer-company">
            <i class="fas fa-paw"></i>
            ByPetz
          </h3>
          <p>
            ByPetz é a plataforma que conecta donos e amantes de pets, oferecendo
            ferramentas para cadastro de animais perdidos e facilitação do processo
            de adoção responsável. Nosso objetivo é unir pessoas e pets de forma
            segura e transparente, promovendo o bem-estar animal e fortalecendo a
            comunidade de cuidados entre usuários.
          </p>
          <div class="company-stats">
            <div class="stat">
              <i class="fas fa-users"></i>
              <span>2.5k+ Usuários</span>
            </div>
            <div class="stat">
              <i class="fas fa-heart"></i>
              <span>500+ Pets Salvos</span>
            </div>
          </div>
        </section>

        <div class="social" aria-label="Redes Sociais">
          <h3>
            <i class="fas fa-share-alt"></i>
            Redes Sociais
          </h3>
          <ul class="social-list">
            <li>
              <a href="https://facebook.com/suaPagina" target="_blank" aria-label="Facebook" class="social-facebook">
                <i class="fab fa-facebook-f"></i>
                <div class="social-ripple"></div>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/bypetz.com.br/" target="_blank" aria-label="Instagram" class="social-instagram">
                <i class="fab fa-instagram"></i>
                <div class="social-ripple"></div>
              </a>
            </li>
            <li>
              <a href="https://wa.me/5514998886799" target="_blank" aria-label="WhatsApp" class="social-whatsapp">
                <i class="fab fa-whatsapp"></i>
                <div class="social-ripple"></div>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/suaPagina" target="_blank" aria-label="YouTube" class="social-youtube">
                <i class="fab fa-youtube"></i>
                <div class="social-ripple"></div>
              </a>
            </li>
          </ul>
          
          <div class="newsletter">
            <h4>Newsletter</h4>
            <div class="newsletter-form">
              <input type="email" placeholder="Seu e-mail">
              <button type="submit">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <small class="copyright">
          <i class="fas fa-copyright"></i>
          ByPetz © 2025 - Todos os direitos reservados
        </small>
        <div class="footer-links">
          <a href="/privacy">Privacidade</a>
          <a href="/terms">Termos</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterModerno",
};
</script>

<style scoped>
/* Importar FontAwesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.footer {
  background: linear-gradient(135deg, #8C52FF 0%, #6B3DD6 50%, #4A2B9A 100%);
  color: #fff;
  width: 100%;
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
  background: rgba(255, 215, 0, 0.1);
  backdrop-filter: blur(20px);
  animation: float 10s ease-in-out infinite;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.orb-1 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 80px;
  height: 80px;
  bottom: 30%;
  left: 15%;
  animation-delay: 3s;
}

.orb-3 {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 30%;
  animation-delay: 6s;
}

.container-footer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 0;
  position: relative;
  z-index: 10;
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.menu,
.sobre,
.company,
.social {
  animation: slideInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.menu { animation-delay: 0.1s; }
.sobre { animation-delay: 0.2s; }
.company { animation-delay: 0.3s; }
.social { animation-delay: 0.4s; }

h3 {
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.3rem;
  color: #FFD700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 i {
  font-size: 1.1rem;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 0.8rem;
}

ul li a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0;
  border-radius: 5px;
  font-weight: 500;
}

ul li a i {
  font-size: 0.9rem;
  width: 16px;
}

.menu ul li a:hover,
.sobre ul li a:hover {
  color: #FFD700;
  transform: translateX(5px);
  text-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
}

.company {
  max-width: 350px;
}

.company p {
  line-height: 1.7;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.5rem;
}

.company-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 215, 0, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  font-size: 0.85rem;
  font-weight: 600;
}

.stat i {
  color: #FFD700;
}

.social-list {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.social-list li a {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.3rem;
  transition: all 0.4s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.social-facebook:hover {
  background: #1877F2;
  border-color: #1877F2;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(24, 119, 242, 0.3);
}

.social-instagram:hover {
  background: linear-gradient(45deg, #E4405F, #C13584, #833AB4);
  border-color: #E4405F;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(228, 64, 95, 0.3);
}

.social-whatsapp:hover {
  background: #25D366;
  border-color: #25D366;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
}

.social-youtube:hover {
  background: #FF0000;
  border-color: #FF0000;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(255, 0, 0, 0.3);
}

.social-ripple {
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

.newsletter {
  margin-top: 1rem;
}

.newsletter h4 {
  color: #FFD700;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-form input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.newsletter-form input:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(255, 255, 255, 0.15);
}

.newsletter-form button {
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.newsletter-form button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: #FFD700;
}

/* Animações */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
}

@keyframes slideInUp {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes ripple {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 60px; height: 60px; opacity: 0; }
}

/* Responsividade */
@media (max-width: 1024px) {
  .container-footer {
    padding: 3rem 1.5rem 0;
  }
  
  .row {
    gap: 2.5rem;
  }
}

@media (max-width: 768px) {
  .container-footer {
    padding: 3rem 1rem 0;
  }
  
  .row {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .company {
    max-width: none;
  }

  .company-stats {
    justify-content: center;
  }

  .social-list {
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
  .social-list {
    gap: 0.8rem;
  }
  
  .social-list li a {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  .company-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>