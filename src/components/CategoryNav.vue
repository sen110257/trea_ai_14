<template>
  <div class="category-nav px-4 py-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white">全品类</h2>
      <router-link 
        to="/category" 
        class="text-sm text-primary-500 flex items-center gap-1 hover:text-primary-600 transition-colors"
      >
        查看全部
        <el-icon class="text-xs"><ArrowRight /></el-icon>
      </router-link>
    </div>

    <div class="grid grid-cols-4 sm:grid-cols-8 gap-4">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-item flex flex-col items-center cursor-pointer transition-all hover:-translate-y-1"
        @click="goToCategory(category.id)"
      >
        <div 
          class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2 shadow-lg transition-all hover:shadow-xl"
          :class="`bg-gradient-to-br ${category.color}`"
        >
          <el-icon class="text-white text-xl sm:text-2xl">
            <component :is="categoryIcons[category.icon]" />
          </el-icon>
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">
          {{ category.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { 
  Monitor, House, ShoppingBag, MagicStick, 
  User, Reading, Van, Trophy,
  ArrowRight 
} from '@element-plus/icons-vue'

const router = useRouter()
const productStore = useProductStore()

const categories = productStore.categories

const categoryIcons = {
  Monitor,
  House,
  ShoppingBag,
  MagicStick,
  Cpu: User,
  Reading,
  Van,
  Dishwasher: Trophy
}

const goToCategory = (categoryId) => {
  router.push({
    path: '/products',
    query: { category: categoryId }
  })
}
</script>

<style scoped>
.category-item {
  user-select: none;
}

.category-item:active {
  transform: scale(0.95);
}
</style>
