<template>
  <footer class="footer" role="contentinfo">
    <div class="container-footer">
      <div class="row">
        <nav class="menu" aria-label="Menu principal">
          <h3>Menu</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/lost-animals">Cadastrar Pet</a></li>
            <li><a href="/feed">Adoção</a></li>
          </ul>
        </nav>

        <section class="sobre" aria-labelledby="footer-sobre">
          <h3 id="footer-sobre">Nós</h3>
          <ul>
            <li><a href="/about">Sobre</a></li>
            <li><a href="/about#how-it-works">Como Funciona</a></li>
            <li><a href="/contact">Contato</a></li>
          </ul>
        </section>

        <section class="company" aria-labelledby="footer-company">
          <h3 id="footer-company">ByPetz</h3>
          <p>
            ByPetz é a plataforma que conecta donos e amantes de pets, oferecendo
            ferramentas para cadastro de animais perdidos e facilitação do processo
            de adoção responsável. Nosso objetivo é unir pessoas e pets de forma
            segura e transparente, promovendo o bem-estar animal e fortalecendo a
            comunidade de cuidados entre usuários.
          </p>
        </section>

        <div class="social" aria-label="Redes Sociais">
          <h3>Redes Sociais</h3>
          <ul class="social-list">
            <li>
              <a href="https://facebook.com/suaPagina" target="_blank" aria-label="Facebook">
                📘
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/bypetz.com.br/" target="_blank" aria-label="Instagram">
                📷
              </a>
            </li>
            <li>
              <a href="https://wa.me/5514998886799" target="_blank" aria-label="WhatsApp">
                💬
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/suaPagina" target="_blank" aria-label="YouTube">
                📺
              </a>
            </li>
          </ul>
        </div>
      </div>
      <small class="copyright">ByPetz © 2025</small>
    </div>
  </footer>
</template>

<script>
export default {
  name: "RodapeSite",
};
</script>

<style scoped>
.footer {
  background-color: #8C52FF;
  color: #fff;
  width: 100%;
  margin-top: 2rem;
}

.container-footer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem 2rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.menu,
.sobre,
.company,
.social {
  flex: 1 1 200px;
}

h3 {
  margin-bottom: 1rem;
  font-weight: 700;
  color: #FFD700;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 0.5rem;
}

ul li a {
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;
}

.menu ul li a:hover,
.sobre ul li a:hover {
  color: #FFD700;
  font-weight: bold;
}

.company p {
  line-height: 1.6;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
}

.social-list {
  display: flex;
  gap: 1rem;
}

.social-list li a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border: 2px solid #fff;
  border-radius: 50%;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  background-color: transparent;
}

.social-list li a:hover {
  background-color: #FFD700;
  border-color: #FFD700;
  transform: translateY(-2px);
}

.copyright {
  display: block;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
    text-align: center;
  }

  .menu,
  .sobre,
  .company,
  .social {
    width: 100%;
  }

  .social-list {
    justify-content: center;
  }

  .company p {
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>