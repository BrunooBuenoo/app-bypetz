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
          
          <!-- Loading da empresa -->
          <div v-if="loadingCompany" class="company-loading">
            <div class="loading-spinner-small"></div>
            <p>Carregando informações...</p>
          </div>
          
          <!-- Dados da empresa -->
          <div v-else>
            <p class="company-description">
              ByPetz é a plataforma que conecta donos e amantes de pets, oferecendo ferramentas para cadastro de animais perdidos e facilitação do processo de adoção responsável.
            </p>
            <div class="company-stats">
              <div class="stat">
                <span class="stat-number">{{ helpingUsersCount }}+</span>
                <span class="stat-label">Usuários</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ foundPetsCount + adoptedPetsCount }}+</span>
                <span class="stat-label">Pets Salvos</span>
              </div>
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

        <!-- Futura Div Vertical -->
        <div></div>



        <!-- Nova seção separada para apoiadores -->
        <div class="footer-section apoiadores-footer-section">
          <h3 class="footer-title">Apoiadores</h3>
          <div v-if="loadingApoiadores" class="apoiadores-loading">
            <div class="loading-spinner-small"></div>
          </div>
          <div v-else-if="apoiadores.length > 0" class="apoiadores-wrapper">
            <div 
              class="apoiadores-track" 
              :style="{ 
                animationDuration: `${apoiadoresAnimationDuration}s`
              }"
            >
              <!-- Primeira sequência -->
              <div class="apoiador-item" v-for="apoiador in apoiadores" :key="`first-${apoiador.id}`">
                {{ apoiador.nome }}
              </div>
              
              <!-- Segunda sequência (para loop infinito) -->
              <div class="apoiador-item" v-for="apoiador in apoiadores" :key="`second-${apoiador.id}`">
                {{ apoiador.nome }}
              </div>
            </div>
          </div>
          <div v-else class="no-apoiadores">
            <p>Nenhum apoiador ativo</p>
          </div>
        </div>
      </div>
      
      <!-- Seção de Patrocinadores/Parceiros Horizontal -->
      <div class="sponsors-section">
        <div v-if="loadingSponsors" class="sponsors-loading">
          <div class="loading-spinner"></div>
          <p>Carregando parceiros...</p>
        </div>

        <div v-else-if="parceirosPatrocinadores.length > 0" class="sponsors-wrapper">
          <div 
            class="sponsors-track" 
            :style="{ 
              animationDuration: `${sponsorsAnimationDuration}s`
            }"
          >
            <!-- Primeira sequência -->
            <div class="sponsor-item" v-for="sponsor in parceirosPatrocinadores" :key="`first-${sponsor.id}`">
              <div class="sponsor-logo">
                <img v-if="sponsor.logo" :src="sponsor.logo" :alt="sponsor.nome" />
                <span v-else class="sponsor-placeholder">{{ sponsor.nome }}</span>
              </div>
            </div>
            
            <!-- Segunda sequência (para loop infinito) -->
            <div class="sponsor-item" v-for="sponsor in parceirosPatrocinadores" :key="`second-${sponsor.id}`">
              <div class="sponsor-logo">
                <img v-if="sponsor.logo" :src="sponsor.logo" :alt="sponsor.nome" />
                <span v-else class="sponsor-placeholder">{{ sponsor.nome }}</span>
              </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  doc,
  getDoc,
  where
} from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: "RodapeSite",
  setup() {
    const sponsors = ref([])
    const companyData = ref({})
    const loadingSponsors = ref(true)
    const loadingApoiadores = ref(true)
    const loadingCompany = ref(true)
    const sponsorsAnimationDuration = ref(30)
    const apoiadoresAnimationDuration = ref(20)

    // Adicionar estas refs no início do setup()
    const foundPetsCount = ref(0)
    const adoptedPetsCount = ref(0)
    const helpingUsersCount = ref(0)
    const totalComments = ref(0)

    // Computed para apoiadores (scroll vertical)
    const apoiadores = computed(() => {
      return sponsors.value.filter(sponsor => 
        sponsor.status === 'ativo' && sponsor.tipo === 'apoiador'
      )
    })

    // Computed para parceiros e patrocinadores (scroll horizontal)
    const parceirosPatrocinadores = computed(() => {
      return sponsors.value.filter(sponsor => 
        sponsor.status === 'ativo' && 
        (sponsor.tipo === 'parceiro' || sponsor.tipo === 'premium' || !sponsor.tipo)
      )
    })

    // Calcular duração da animação para sponsors horizontais
    const calculateSponsorsAnimationDuration = () => {
      const sponsorCount = parceirosPatrocinadores.value.length
      if (sponsorCount === 0) return
      
      const baseDuration = sponsorCount * 2.5
      sponsorsAnimationDuration.value = Math.max(15, Math.min(45, baseDuration))
    }

    // Calcular duração da animação para apoiadores verticais
    const calculateApoiadoresAnimationDuration = () => {
      const apoiadoresCount = apoiadores.value.length
      if (apoiadoresCount === 0) return
      
      const baseDuration = apoiadoresCount * 3
      apoiadoresAnimationDuration.value = Math.max(15, Math.min(40, baseDuration))
    }

    // Observar mudanças
    watch(parceirosPatrocinadores, () => {
      calculateSponsorsAnimationDuration()
    }, { immediate: true })

    watch(apoiadores, () => {
      calculateApoiadoresAnimationDuration()
      loadingApoiadores.value = false
    }, { immediate: true })

    // Adicionar estas funções antes do onMounted
    const fetchFoundPets = async () => {
      try {
        const petsQuery = query(
          collection(db, 'pets'),
          where('status', '==', 'encontrado')
        )
        
        const querySnapshot = await getDocs(petsQuery)
        foundPetsCount.value = querySnapshot.size
      } catch (error) {
        console.error('Erro ao buscar pets encontrados:', error)
        foundPetsCount.value = 0
      }
    }

    const fetchAdoptedPets = async () => {
      try {
        const petsQuery = query(
          collection(db, 'pets'),
          where('status', '==', 'adotado')
        )
        
        const querySnapshot = await getDocs(petsQuery)
        adoptedPetsCount.value = querySnapshot.size
      } catch (error) {
        console.error('Erro ao buscar pets adotados:', error)
        adoptedPetsCount.value = 0
      }
    }

    const fetchHelpingUsers = async () => {
      try {
        const usersSet = new Set()
        
        const petsQuery = query(collection(db, 'pets'))
        const petsSnapshot = await getDocs(petsQuery)
        
        petsSnapshot.forEach((petDoc) => {
          const pet = petDoc.data()
          if (pet.userId && !usersSet.has(pet.userId)) {
            usersSet.add(pet.userId)
          }
        })

        let commentCount = 0
        for (const petDoc of petsSnapshot.docs) {
          try {
            const commentsQuery = query(collection(db, 'pets', petDoc.id, 'comments'))
            const commentsSnapshot = await getDocs(commentsQuery)
            commentCount += commentsSnapshot.size
            
            commentsSnapshot.forEach((commentDoc) => {
              const comment = commentDoc.data()
              if (comment.userId && !usersSet.has(comment.userId)) {
                usersSet.add(comment.userId)
              }
            })
          } catch (err) {
            console.log('Erro ao buscar comentários do pet:', petDoc.id, err)
          }
        }
        
        totalComments.value = commentCount
        helpingUsersCount.value = usersSet.size
      } catch (error) {
        console.error('Erro ao buscar usuários ajudando:', error)
        helpingUsersCount.value = 0
        totalComments.value = 0
      }
    }

    // Modificar a função fetchSponsors para também carregar os dados da empresa
    const fetchCompanyData = async () => {
      try {
        loadingCompany.value = true
        
        await Promise.all([
          fetchFoundPets(),
          fetchAdoptedPets(), 
          fetchHelpingUsers()
        ])
        
      } catch (error) {
        console.error('Erro ao buscar dados da empresa:', error)
      } finally {
        loadingCompany.value = false
      }
    }

    // Função para buscar patrocinadores do Firebase
    const fetchSponsors = async () => {
      try {
        loadingSponsors.value = true
        loadingApoiadores.value = true

        // Buscar patrocinadores
        const patrocinadoresQuery = query(
          collection(db, 'patrocinadores'),
          orderBy('nome', 'asc')
        )
        const patrocinadoresSnapshot = await getDocs(patrocinadoresQuery)
        
        // Buscar apoiadores
        const apoiadoresQuery = query(
          collection(db, 'apoiadores'),
          orderBy('nome', 'asc')
        )
        const apoiadoresSnapshot = await getDocs(apoiadoresQuery)

        const fetchedSponsors = []

        // Processar patrocinadores
        patrocinadoresSnapshot.forEach((doc) => {
          const sponsorData = {
            id: `patrocinador-${doc.id}`,
            tipo: doc.data().tipo || 'patrocinador',
            ...doc.data()
          }
          
          const now = new Date()
          const dataInicio = sponsorData.dataInicio ? new Date(sponsorData.dataInicio) : null
          const dataFim = sponsorData.dataFim ? new Date(sponsorData.dataFim) : null

          const isActive = sponsorData.status === 'ativo' &&
                          (!dataInicio || dataInicio <= now) &&
                          (!dataFim || dataFim >= now)

          if (isActive) {
            fetchedSponsors.push(sponsorData)
          }
        })

        // Processar apoiadores
        apoiadoresSnapshot.forEach((doc) => {
          const apoiadorData = {
            id: `apoiador-${doc.id}`,
            tipo: 'apoiador',
            ...doc.data()
          }
          
          if (apoiadorData.status === 'ativo') {
            fetchedSponsors.push(apoiadorData)
          }
        })

        sponsors.value = fetchedSponsors

        // Se não houver dados, mostrar exemplos
        if (fetchedSponsors.length === 0) {
          sponsors.value = [
            { id: 'demo1', nome: 'João Silva', tipo: 'apoiador', status: 'ativo' },
            { id: 'demo2', nome: 'Maria Santos', tipo: 'apoiador', status: 'ativo' },
            { id: 'demo3', nome: 'Pedro Costa', tipo: 'apoiador', status: 'ativo' },
            { id: 'demo4', nome: 'Ana Oliveira', tipo: 'apoiador', status: 'ativo' },
            { id: 'demo5', nome: 'Carlos Lima', tipo: 'apoiador', status: 'ativo' },
            { id: 'demo6', nome: 'Dog Chow', logo: null, tipo: 'parceiro', status: 'ativo' },
            { id: 'demo7', nome: 'Casa das Rações', logo: null, tipo: 'parceiro', status: 'ativo' },
            { id: 'demo8', nome: 'Whiskas', logo: null, tipo: 'premium', status: 'ativo' },
            { id: 'demo9', nome: 'Royal Canin', logo: null, tipo: 'premium', status: 'ativo' },
            { id: 'demo10', nome: 'Pedigree', logo: null, tipo: 'parceiro', status: 'ativo' }
          ]
        }

      } catch (err) {
        console.error('Erro ao buscar patrocinadores:', err)
        
        // Em caso de erro, mostrar dados de exemplo
        sponsors.value = [
          { id: 'demo1', nome: 'João Silva', tipo: 'apoiador', status: 'ativo' },
          { id: 'demo2', nome: 'Maria Santos', tipo: 'apoiador', status: 'ativo' },
          { id: 'demo3', nome: 'Pedro Costa', tipo: 'apoiador', status: 'ativo' },
          { id: 'demo4', nome: 'Ana Oliveira', tipo: 'apoiador', status: 'ativo' },
          { id: 'demo5', nome: 'Carlos Lima', tipo: 'apoiador', status: 'ativo' },
          { id: 'demo6', nome: 'Dog Chow', logo: null, tipo: 'parceiro', status: 'ativo' },
          { id: 'demo7', nome: 'Casa das Rações', logo: null, tipo: 'parceiro', status: 'ativo' },
          { id: 'demo8', nome: 'Whiskas', logo: null, tipo: 'premium', status: 'ativo' },
          { id: 'demo9', nome: 'Royal Canin', logo: null, tipo: 'premium', status: 'ativo' },
          { id: 'demo10', nome: 'Pedigree', logo: null, tipo: 'parceiro', status: 'ativo' }
        ]
      } finally {
        loadingSponsors.value = false
        loadingApoiadores.value = false
      }
    }

    onMounted(() => {
      fetchCompanyData()
      fetchSponsors()
    })

    return {
      sponsors,
      apoiadores,
      parceirosPatrocinadores,
      companyData,
      loadingSponsors,
      loadingApoiadores,
      loadingCompany,
      sponsorsAnimationDuration,
      apoiadoresAnimationDuration,
      foundPetsCount,
      adoptedPetsCount,
      helpingUsersCount,
      totalComments
    }
  }
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

.company-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
}

.company-loading p {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
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

/* Seção de Apoiadores Vertical */
.apoiadores-section {
  margin-top: 1.5rem;
}

.apoiadores-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
}

.apoiadores-loading {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.loading-spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.apoiadores-wrapper {
  position: relative;
  overflow: hidden;
  height: 120px;
  width: 100%;
  mask: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 10%,
    black 25%,
    black 75%,
    rgba(0, 0, 0, 0.1) 90%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 10%,
    black 25%,
    black 75%,
    rgba(0, 0, 0, 0.1) 90%,
    transparent 100%
  );
}

.apoiadores-track {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: scroll-vertical linear infinite;
  width: 100%;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes scroll-vertical {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.apoiador-item {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
  text-align: center;
  transition: all 0.3s ease;
  transform: translateZ(0);
}

.apoiador-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(2px);
}

.no-apoiadores {
  text-align: center;
  padding: 1rem;
}

.no-apoiadores p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
}

/* Seção de Patrocinadores Horizontal */
.sponsors-section {
  margin: 3rem 0 2rem 0;
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.sponsors-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.sponsors-loading .loading-spinner {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.sponsors-loading p {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}

.sponsors-wrapper {
  position: relative;
  overflow: hidden;
  height: 80px;
  width: 100%;
  mask: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 5%,
    rgba(0, 0, 0, 0.8) 15%,
    black 25%,
    black 75%,
    rgba(0, 0, 0, 0.8) 85%,
    rgba(0, 0, 0, 0.1) 95%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 5%,
    rgba(0, 0, 0, 0.8) 15%,
    black 25%,
    black 75%,
    rgba(0, 0, 0, 0.8) 85%,
    rgba(0, 0, 0, 0.1) 95%,
    transparent 100%
  );
}

.sponsors-track {
  display: flex;
  gap: 1.5rem;
  animation: scroll-infinite linear infinite;
  width: fit-content;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes scroll-infinite {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.sponsor-item {
  flex-shrink: 0;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  transform: translateZ(0);
}

.sponsor-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.sponsor-logo {
  width: 140px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
}

.sponsor-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
}

.sponsor-item:hover .sponsor-logo img {
  transform: scale(1.05);
}

.sponsor-placeholder {
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  color: white;
  line-height: 1.2;
  padding: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

  .apoiadores-wrapper {
    height: 100px;
  }

  .apoiador-item {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .sponsors-wrapper {
    height: 65px;
    mask: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 8%,
      black 20%,
      black 80%,
      rgba(0, 0, 0, 0.2) 92%,
      transparent 100%
    );
    -webkit-mask: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 8%,
      black 20%,
      black 80%,
      rgba(0, 0, 0, 0.2) 92%,
      transparent 100%
    );
  }
  
  .sponsor-item {
    height: 60px;
  }
  
  .sponsors-track {
    gap: 1rem;
  }
  
  .sponsor-logo {
    width: 120px;
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

  .apoiadores-wrapper {
    height: 80px;
  }

  .apoiador-item {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }

  .sponsors-wrapper {
    height: 55px;
    mask: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 10%,
      black 25%,
      black 75%,
      rgba(0, 0, 0, 0.3) 90%,
      transparent 100%
    );
    -webkit-mask: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 10%,
      black 25%,
      black 75%,
      rgba(0, 0, 0, 0.3) 90%,
      transparent 100%
    );
  }
  
  .sponsor-item {
    height: 50px;
  }
  
  .sponsor-logo {
    width: 100px;
  }
  
  .sponsor-placeholder {
    font-size: 0.75rem;
  }
}

/* Animação mais suave em dispositivos com preferência por movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .sponsors-track {
    animation-duration: 60s !important;
  }
  
  .apoiadores-track {
    animation-duration: 40s !important;
  }
  
  .sponsor-item:hover,
  .apoiador-item:hover {
    transform: none;
  }
  
  .sponsors-wrapper,
  .apoiadores-wrapper {
    mask: none;
    -webkit-mask: none;
  }
}

/* Estilos para a nova seção de apoiadores */
.apoiadores-footer-section {
  max-width: 300px;
}

.apoiadores-footer-section .apoiadores-wrapper {
  position: relative;
  overflow: hidden;
  height: 120px;
  width: 100%;
  mask: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 10%,
    black 25%,
    black 75%,
    rgba(0, 0, 0, 0.1) 90%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 10%,
    black 25%,
    black 75%,
    rgba(0, 0, 0, 0.1) 90%,
    transparent 100%
  );
}

.apoiadores-footer-section .apoiadores-track {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: scroll-vertical linear infinite;
  width: 100%;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.apoiadores-footer-section .apoiador-item {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
  text-align: center;
  transition: all 0.3s ease;
  transform: translateZ(0);
}

.apoiadores-footer-section .apoiador-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(2px);
}

.apoiadores-footer-section .no-apoiadores {
  text-align: center;
  padding: 1rem;
}

.apoiadores-footer-section .no-apoiadores p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
}

.apoiadores-footer-section .apoiadores-loading {
  display: flex;
  justify-content: center;
  padding: 1rem;
}
</style>
