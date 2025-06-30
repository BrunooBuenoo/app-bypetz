<template>
  <div>
    <HeroComponent/>
    <CardsComponent/>
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

export default {
  name: 'PaginaInicial',
  components: {
    HeroComponent,
    ExemploComponente,
    CardsComponent,
    SecaoInfo,
    RodapeSite,
  },
}
</script>