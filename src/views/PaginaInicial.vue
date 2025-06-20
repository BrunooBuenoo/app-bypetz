<template>
  <div>
    <HeroComponent/>
    <SecaoInfo/>
    <CardsComponent/>
    <RodapeSite/>
  </div>
</template>

<script>
import HeroComponent from '../components/PaginaInicial.vue'
import SecaoInfo from '../components/SecaoInfo.vue'
import CardsComponent from '../components/CardsComponent.vue'
import RodapeSite from '../components/RodapeSite.vue'

export default {
  name: 'PaginaInicial',
  components: {
    HeroComponent,
    SecaoInfo,
    CardsComponent,
    RodapeSite,
  },
}
</script>