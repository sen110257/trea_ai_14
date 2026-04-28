<template>
  <router-link 
    :to="`/product/${product.id}`"
    class="product-card group block"
  >
    <div class="glass-card overflow-hidden card-hover">
      <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img 
          :src="product.images[0]" 
          :alt="product.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        <div class="absolute top-2 left-2 flex gap-1 flex-wrap">
          <span 
            v-for="tag in product.tags" 
            :key="tag"
            class="tag-badge px-2 py-0.5 rounded-full text-xs font-medium text-white backdrop-blur-sm"
            :class="getTagClass(tag)"
          >
            {{ tag }}
          </span>
          <span 
            v-if="product.has3D"
            class="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm flex items-center gap-1"
          >
            <el-icon class="text-xs"><Promotion /></el-icon>
            3D
          </span>
        </div>

        <div class="absolute top-2 right-2">
          <span 
            class="condition-badge px-2 py-0.5 rounded-full text-xs font-medium"
            :class="getConditionClass(product.condition)"
          >
            {{ getConditionLabel(product.condition) }}
          </span>
        </div>

        <div class="absolute bottom-2 right-2 flex items-center gap-1 text-white text-xs bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
          <el-icon><View /></el-icon>
          <span>{{ formatNumber(product.views) }}</span>
        </div>
      </div>

      <div class="p-3">
        <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 mb-2 leading-tight">
          {{ product.title }}
        </h3>

        <div class="flex items-baseline gap-2 mb-2">
          <span class="text-lg font-bold text-red-500">
            ¥{{ product.price }}
          </span>
          <span class="text-xs text-gray-400 line-through">
            ¥{{ product.originalPrice }}
          </span>
        </div>

        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-1">
            <el-icon class="text-xs"><Location /></el-icon>
            <span class="truncate max-w-[100px]">{{ product.location }}</span>
          </div>
          <div class="flex items-center gap-1">
            <el-icon class="text-xs"><ChatDotRound /></el-icon>
            <span>{{ product.likes }}</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { Promotion, View, Location, ChatDotRound } from '@element-plus/icons-vue'

defineProps({
  product: {
    type: Object,
    required: true
  }
})

const getConditionLabel = (condition) => {
  const labels = {
    'new': '全新',
    '99': '99新',
    '95': '95新',
    '90': '9成新',
    '80': '8成新',
    '70': '7成新'
  }
  return labels[condition] || condition
}

const getConditionClass = (condition) => {
  const classes = {
    'new': 'condition-new',
    '99': 'condition-99',
    '95': 'condition-95',
    '90': 'condition-90',
    '80': 'condition-80',
    '70': 'condition-70'
  }
  return classes[condition] || ''
}

const getTagClass = (tag) => {
  const classes = {
    '超值': 'bg-green-500/90',
    '急出': 'bg-red-500/90',
    '自提': 'bg-blue-500/90',
    '全新': 'bg-purple-500/90'
  }
  return classes[tag] || 'bg-gray-500/90'
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}
</script>

<style scoped>
.product-card {
  text-decoration: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
