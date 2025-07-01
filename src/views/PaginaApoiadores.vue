<template>
  <div>
    <ConvitePatrocinadores/>
    <RodapeSite/>
  </div>
</template>

<script>
import RodapeSite from '../components/RodapeSite.vue'
import ConvitePatrocinadores from '../components/ConvitePatrocinadores.vue'

export default {
  name: 'PaginaApoiadores',
  components: {
    ConvitePatrocinadores,
    RodapeSite,
  },
}
</script>