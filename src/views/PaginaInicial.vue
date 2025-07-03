<template>
  <div>
    <HeroComponent/>
    <CardsComponent/>
    <Patrocinadores/>
    <ConvitePatrocinadores/>
    <SecaoInfo/>
    <RodapeSite/>
  </div>
</template>

<script>
import HeroComponent from '../components/PaginaInicial.vue'
import SecaoInfo from '../components/SecaoInfo.vue'
import CardsComponent from '../components/CardsComponent.vue'
import RodapeSite from '../components/RodapeSite.vue'
import Patrocinadores from './Patrocinadores.vue'
import ConvitePatrocinadores from '../components/ConvitePatrocinadores.vue'


export default {
  name: 'PaginaInicial',
  components: {
    HeroComponent,
    Patrocinadores,
    ConvitePatrocinadores,
    CardsComponent,
    SecaoInfo,
    RodapeSite,
  },
}
</script>