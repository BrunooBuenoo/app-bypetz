<template>
  <div class="help-page">
    <h1>Ajude a Causa Animal</h1>
    <p>Tem uma ONG? Seja um parceiro ou, se não tiver, doe um valor para ajudar na causa animal.</p>
    
    <div class="help-options">
      <div class="help-card">
        <div class="help-icon">🏢</div>
        <h3>Seja um Parceiro</h3>
        <p>Se você tem uma ONG ou trabalha com proteção animal, vamos conversar sobre uma parceria!</p>
        <a href="/contact" class="btn">Contato para Parceria</a>
      </div>

      <div class="help-card">
        <div class="help-icon">💝</div>
        <h3>Faça uma Doação</h3>
        <p>Sua contribuição ajuda a manter a plataforma funcionando e apoia ONGs parceiras.</p>
        <button class="btn" @click="mostrarChavePix">Ver Chave PIX</button>
      </div>
    </div>

    <div v-if="mostrandoPix" class="pix-modal" @click="fecharPix">
      <div class="pix-content" @click.stop>
        <button class="close-btn" @click="fecharPix">&times;</button>
        <h3>Chave PIX para Doação</h3>
        <div class="pix-key">
          <p>{{ chavePix }}</p>
          <button @click="copiarChavePix" class="copy-btn">
            <i class="fa-solid fa-copy"></i>
            Copiar
          </button>
        </div>
        <p class="pix-info">Escaneie o QR Code ou copie a chave PIX acima</p>
        <div class="qr-placeholder">
          <div class="qr-code">📱</div>
          <p>QR Code aqui</p>
        </div>
      </div>
    </div>

    <div class="impact-section">
      <h2>Nosso Impacto</h2>
      <div class="stats">
        <div class="stat-card">
          <div class="stat-number">150+</div>
          <div class="stat-label">Pets Reunidos</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">50+</div>
          <div class="stat-label">Adoções Realizadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">25+</div>
          <div class="stat-label">ONGs Parceiras</div>
        </div>
      </div>
    </div>
  </div>
  <RodapeSite/>
</template>

<script>
import RodapeSite from '../components/RodapeSite.vue'

export default {
  name: "PaginaAjuda",
  components: {
    RodapeSite,
  },
  data() {
    return {
      mostrandoPix: false,
      chavePix: 'contato@bypetz.com.br'
    }
  },
  methods: {
    mostrarChavePix() {
      this.mostrandoPix = true
    },
    fecharPix() {
      this.mostrandoPix = false
    },
    async copiarChavePix() {
      try {
        await navigator.clipboard.writeText(this.chavePix)
        alert('Chave PIX copiada!')
      } catch (err) {
        console.error('Erro ao copiar:', err)
        alert('Erro ao copiar a chave PIX')
      }
    }
  }
}
</script>

<style>
.help-page {
  margin: 5vh auto;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 2rem;
  text-align: center;
}

.help-page h1 {
  font-size: 2.25rem;
  color: #d6c3fc;
  margin-bottom: 1rem;
}

.help-page > p {
  font-size: 1.25rem;
  margin: 1rem 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.help-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.help-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.help-card:hover {
  transform: translateY(-5px);
}

.help-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.help-card h3 {
  color: #FFD700;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.help-card p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.btn {
  background: white;
  color: #8C52FF;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background: #FFD700;
  color: white;
  transform: translateY(-2px);
}

.pix-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pix-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  position: relative;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #8C52FF;
}

.pix-content h3 {
  color: #8C52FF;
  margin-bottom: 1rem;
}

.pix-key {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pix-key p {
  flex: 1;
  margin: 0;
  color: #333;
  font-family: monospace;
}

.copy-btn {
  background: #8C52FF;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pix-info {
  color: #666;
  font-size: 0.9rem;
  margin: 1rem 0;
}

.qr-placeholder {
  background: #f5f5f5;
  border-radius: 10px;
  padding: 2rem;
  margin-top: 1rem;
}

.qr-code {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.impact-section {
  margin-top: 4rem;
}

.impact-section h2 {
  color: #FFD700;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: white;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .help-page {
    padding: 1rem;
  }

  .help-page h1 {
    font-size: 1.875rem;
  }

  .help-options {
    grid-template-columns: 1fr;
  }

  .pix-content {
    margin: 1rem;
  }
}
</style>