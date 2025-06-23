
<template>
  <div id="app" class="template metallic-bg">
    <CabecalhoSite/>
    <RouterView />
  </div>
</template>

<script>
import CabecalhoSite from './components/CabecalhoSite.vue'

export default {
  name: 'App',
  components: {
    CabecalhoSite
  }
}
</script>

<style>
.template {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  height: auto;
  /* REMOVER: align-items: center; */
  /* REMOVER: justify-content: center; */
  overflow-x: hidden;
}

.metallic-bg {
  background: linear-gradient(135deg, #8C52FF 0%, #6B3DD6 50%, #4A2B9A 100%);
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Reset global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}

body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
}

/* Estilos globais para links do router */
a {
  text-decoration: none;
}

/* Transições suaves entre páginas */
.router-link-active {
  font-weight: 600;
}
</style>