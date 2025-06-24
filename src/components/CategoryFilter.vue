<template>
  <div class="category-filter">
    <h3 class="filter-title">
      <i class="fas fa-filter"></i>
      Categorias
    </h3>
    
    <div class="categories-container">
      <button
        @click="handleFilter(null)"
        class="category-chip"
        :class="{ active: selectedCategory === null }"
      >
        <span>Todas</span>
      </button>
      
      <button
        v-for="categoria in categorias"
        :key="categoria.id"
        @click="handleFilter(categoria.id)"
        class="category-chip"
        :class="{ active: selectedCategory === categoria.id }"
      >
        <span>{{ categoria.nome }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'CategoryFilter',
  props: {
    categorias: {
      type: Array,
      required: true
    }
  },
  emits: ['filtrar'],
  setup(props, { emit }) {
    const selectedCategory = ref(null)

    const handleFilter = (categoryId) => {
      selectedCategory.value = categoryId
      emit('filtrar', categoryId)
    }

    return {
      selectedCategory,
      handleFilter
    }
  }
}
</script>

<style scoped>
.category-filter {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(140, 82, 255, 0.1);
  border: 1px solid rgba(140, 82, 255, 0.1);
  margin-bottom: 2rem;
}

.filter-title {
  color: #333;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-title i {
  color: #8C52FF;
}

.categories-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.category-chip {
  background: rgba(140, 82, 255, 0.1);
  color: #8C52FF;
  border: 2px solid rgba(140, 82, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.category-chip:hover {
  background: rgba(140, 82, 255, 0.15);
  border-color: rgba(140, 82, 255, 0.3);
  transform: translateY(-2px);
}

.category-chip.active {
  background: linear-gradient(135deg, #8C52FF, #6B3DD6);
  color: white;
  border-color: #8C52FF;
  box-shadow: 0 4px 15px rgba(140, 82, 255, 0.3);
}

.category-chip.active:hover {
  background: linear-gradient(135deg, #6B3DD6, #4A2B9A);
}

@media (max-width: 768px) {
  .category-filter {
    padding: 1rem;
  }
  
  .categories-container {
    gap: 0.5rem;
  }
  
  .category-chip {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
