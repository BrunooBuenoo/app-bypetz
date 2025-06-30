<template>
  <div>
    <HeroComponent/>
    <CardsComponent/>
    <Patrocinadores/>
    <SecaoInfo/>
    <RodapeSite/>
  </div>
</template>

<script>
import HeroComponent from '../components/PaginaInicial.vue'
import SecaoInfo from '../components/SecaoInfo.vue'
import CardsComponent from '../components/CardsComponent.vue'
import RodapeSite from '../components/RodapeSite.vue'
import ExemploComponente from '../components/Exemplo.vue'
import Patrocinadores from './Patrocinadores.vue'

export default {
  name: 'PaginaInicial',
  components: {
    HeroComponent,
    Patrocinadores,
    ExemploComponente,
    CardsComponent,
    SecaoInfo,
    RodapeSite,
  },
}
</script>