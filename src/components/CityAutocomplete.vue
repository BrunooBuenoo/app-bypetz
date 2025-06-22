<template>
  <div class="city-autocomplete" ref="autocompleteRef">
    <div class="input-container">
      <input
        v-model="inputValue"
        type="text"
        :placeholder="placeholder"
        :class="inputClass"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        autocomplete="off"
      />
      <i class="fas fa-map-marker-alt input-icon"></i>
    </div>
    
    <div 
      v-if="showDropdown && filteredCities.length > 0" 
      class="dropdown"
    >
      <div
        v-for="(city, index) in filteredCities"
        :key="city.id"
        class="dropdown-item"
        :class="{ 'highlighted': index === highlightedIndex }"
        @mousedown="selectCity(city)"
        @mouseenter="highlightedIndex = index"
      >
        <i class="fas fa-map-marker-alt"></i>
        <span class="city-name">{{ city.name }}</span>
        <span class="state-name">{{ city.state }}</span>
      </div>
    </div>
    
    <div v-if="loading" class="loading-indicator">
      <i class="fas fa-spinner fa-spin"></i>
      Carregando cidades...
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useCities } from '../composables/useCities'

export default {
  name: 'CityAutocomplete',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Digite o nome da cidade...'
    },
    inputClass: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'citySelected'],
  setup(props, { emit }) {
    console.log('🔧 CityAutocomplete iniciado')
    const { cities, loading, searchTerm, filteredCities, loadCities } = useCities()
    
    const autocompleteRef = ref(null)
    const inputValue = ref(props.modelValue)
    const showDropdown = ref(false)
    const highlightedIndex = ref(-1)
    
    // Carregar cidades ao montar o componente
    onMounted(() => {
      console.log('🚀 Montando CityAutocomplete, carregando cidades...')
      loadCities()
    })
    
    // Sincronizar com v-model
    watch(() => props.modelValue, (newValue) => {
      inputValue.value = newValue
    })
    
    watch(inputValue, (newValue) => {
      emit('update:modelValue', newValue)
      searchTerm.value = newValue
    })
    
    const handleInput = () => {
      console.log('⌨️ Input alterado:', inputValue.value)
      showDropdown.value = true
      highlightedIndex.value = -1
    }
    
    const handleFocus = () => {
      if (inputValue.value.length >= 2) {
        showDropdown.value = true
      }
    }
    
    const handleBlur = () => {
      // Delay para permitir clique nos itens
      setTimeout(() => {
        showDropdown.value = false
        highlightedIndex.value = -1
      }, 150)
    }
    
    const handleKeydown = (event) => {
      if (!showDropdown.value || filteredCities.value.length === 0) return
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          highlightedIndex.value = Math.min(
            highlightedIndex.value + 1,
            filteredCities.value.length - 1
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
          break
        case 'Enter':
          event.preventDefault()
          if (highlightedIndex.value >= 0) {
            selectCity(filteredCities.value[highlightedIndex.value])
          }
          break
        case 'Escape':
          showDropdown.value = false
          highlightedIndex.value = -1
          break
      }
    }
    
    const selectCity = (city) => {
      inputValue.value = city.fullName
      showDropdown.value = false
      highlightedIndex.value = -1
      emit('citySelected', city)
    }
    
    // Fechar dropdown ao clicar fora
    const handleClickOutside = (event) => {
      if (autocompleteRef.value && !autocompleteRef.value.contains(event.target)) {
        showDropdown.value = false
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      autocompleteRef,
      inputValue,
      showDropdown,
      highlightedIndex,
      filteredCities,
      loading,
      handleInput,
      handleFocus,
      handleBlur,
      handleKeydown,
      selectCity
    }
  }
}
</script>

<style scoped>
.city-autocomplete {
  position: relative;
  width: 100%;
}

.input-container {
  position: relative;
}

.input-container input {
  width: 100%;
  padding-right: 2.5rem;
}

.input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #8B5CF6;
  pointer-events: none;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #E5E7EB;
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-top: -1px; /* Para conectar com o input */
}

.dropdown-item {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #F3F4F6;
}

.dropdown-item:hover,
.dropdown-item.highlighted {
  background: #F3F4F6;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item i {
  color: #8B5CF6;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.city-name {
  font-weight: 600;
  color: #374151;
  flex: 1;
}

.state-name {
  font-size: 0.85rem;
  color: #6B7280;
  background: #F3F4F6;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 500;
}

.loading-indicator {
  padding: 1rem;
  text-align: center;
  color: #6B7280;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-indicator i {
  color: #8B5CF6;
}

/* Responsividade */
@media (max-width: 768px) {
  .dropdown {
    max-height: 250px;
  }
  
  .dropdown-item {
    padding: 1rem;
  }
  
  .city-name {
    font-size: 0.9rem;
  }
  
  .state-name {
    font-size: 0.8rem;
  }
}
</style>
