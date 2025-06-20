<template>
  <div class="contact">
    <h1>Fale com a gente!</h1>
    <p>Se você precisa de ajuda, quer relatar um animal perdido ou encontrado, ou tem alguma dúvida sobre o funcionamento do nosso site, estamos aqui para te ouvir!</p>
    <p>Na ByPetz, acreditamos que cada mensagem pode fazer a diferença na vida de um pet e de uma família. Nossa equipe está pronta para te apoiar da melhor forma possível.</p>
    
    <div class="contact-buttons">
      <a href="tel:+5514998886799" class="btn">
        <i class="fa-solid fa-phone"></i>
        Telefone
      </a>
      <a href="mailto:contato@bypetz.com.br" class="btn">
        <i class="fa-solid fa-envelope"></i>
        E-mail
      </a>
    </div>

    <div class="contact-info">
      <div class="info-card">
        <h3>📞 Telefone</h3>
        <p>(14) 99888-6799</p>
      </div>
      <div class="info-card">
        <h3>📧 E-mail</h3>
        <p>contato@bypetz.com.br</p>
      </div>
      <div class="info-card">
        <h3>📱 WhatsApp</h3>
        <p>Clique no botão telefone para falar conosco</p>
      </div>
    </div>
  </div>
  <RodapeSite/>
</template>

<script>
import RodapeSite from '../components/RodapeSite.vue'

export default {
  name: "PaginaContato",
  components: {
    RodapeSite,
  },
}
</script>

<style scoped>
.contact {
  margin: 11vh auto;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  text-align: center;
}

.contact h1 {
  font-size: 2.25rem;
  color: #d6c3fc;
  margin-bottom: 1rem;
}

.contact p {
  font-size: 1.25rem;
  margin: 1rem 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.contact-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  background: #FFD700;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card h3 {
  color: #FFD700;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.info-card p {
  color: white;
  font-size: 1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .contact {
    padding: 1rem;
  }

  .contact h1 {
    font-size: 1.875rem;
  }

  .contact p {
    font-size: 1rem;
  }

  .contact-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>