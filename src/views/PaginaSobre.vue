<template>
  <div class="about">
    <div class="about-row">
      <div class="esquerda">
        <div class="esquerdo-topo">
          <h1>Sobre a ByPetz 🐾</h1>
          <p>A ByPetz nasceu com um propósito: aproximar pets perdidos de suas famílias e conectar pessoas dispostas a ajudar com quem mais precisa.</p>
          <p>Somos uma plataforma feita com carinho para facilitar a busca por animais desaparecidos e incentivar a adoção consciente. Acreditamos que a tecnologia pode ser uma grande aliada quando usada com empatia e propósito, e foi assim que criamos um espaço onde cada clique pode representar um reencontro ou um novo começo.</p>
        </div>
        <div class="direito-topo">
          <h1>Nossa missão</h1>
          <p>Promover o bem-estar animal por meio da inovação, acolhimento e colaboração. Queremos ser um elo de confiança entre tutores, protetores e amantes de pets em todo o Brasil.</p>
        </div>
      </div>
      <div class="direita">
        <div class="esquerdo-bottom">
          <h1>Como ajudamos</h1>
          <p>Oferecemos uma experiência simples e eficiente para quem precisa de ajuda. Com um cadastro rápido de animais perdidos e encontrados, facilitamos a divulgação e a busca em poucos cliques. Nossa página de adoção conta com filtros por cidade e porte, conectando futuros tutores aos pets ideais com mais facilidade. Também disponibilizamos um sistema de contato direto com os responsáveis, promovendo agilidade e confiança nas interações.</p>
        </div>
        <div class="direito-bottom">
          <h1>Mais que um site, uma causa</h1>
          <p>Por trás da tela, existe uma equipe apaixonada por animais e comprometida com cada história. Na ByPetz, cada pet importa, e cada usuário é parte essencial dessa rede de cuidado e solidariedade.</p>
        </div>
      </div>
    </div>
  </div>
  <RodapeSite />
</template>

<script>
import RodapeSite from '../components/RodapeSite.vue'

export default {
  name: "PaginaSobre",
  components: {
    RodapeSite,
  },
}
</script>

<style scoped>
.about {
  margin: 10vh auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1200px;
  padding: 0 20px;
}

.about-row {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 60px;
}

.esquerda, .direita {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.esquerdo-topo, .direito-topo, .esquerdo-bottom, .direito-bottom {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.about-row h1 {
  font-size: 2.25rem;
  color: #d6c3fc;
  margin-bottom: 1rem;
  font-weight: bold;
}

.about-row p {
  font-size: 1.125rem;
  margin: 1rem 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .about-row {
    flex-direction: column;
    align-items: center;
  }
  
  .esquerda, .direita {
    max-width: 100%;
  }

  .about-row h1 {
    font-size: 1.875rem;
  }

  .about-row p {
    font-size: 1rem;
  }
}
</style>