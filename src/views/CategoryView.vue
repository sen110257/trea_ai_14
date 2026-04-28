<template>
  <div class="category-view min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <HeaderNav />
    
    <main class="pt-2">
      <div class="px-4 py-4">
        <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">全部分类</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-card glass-card p-4 cursor-pointer transition-all hover:-translate-y-1"
            @click="goToCategory(category.id)"
          >
            <div class="flex items-center gap-4">
              <div 
                class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                :class="`bg-gradient-to-br ${category.color}`"
              >
                <el-icon class="text-white text-2xl">
                  <component :is="categoryIcons[category.icon]" />
                </el-icon>
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-gray-800 dark:text-white mb-1">
                  {{ category.name }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ getCategoryCount(category.id) }} 件商品
                </p>
              </div>
              <el-icon class="text-gray-400"><ArrowRight /></el-icon>
            </div>
            
            <div class="mt-4 flex gap-2 overflow-x-auto">
              <div 
                v-for="(sub, index) in getSubCategories(category.id)" 
                :key="index"
                class="flex-shrink-0 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
              >
                {{ sub }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="px-4 py-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-800 dark:text-white">热门推荐</h2>
          <button class="text-sm text-primary-500 flex items-center gap-1">
            换一批
            <el-icon class="text-xs"><Refresh /></el-icon>
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ProductCard 
            v-for="product in recommendProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </main>
    
    <TabBar />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import HeaderNav from '@/components/HeaderNav.vue'
import TabBar from '@/components/TabBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductStore } from '@/stores/product'
import { 
  Monitor, House, ShoppingBag, MagicStick, 
  Cpu, Reading, Van, Dishwasher,
  ArrowRight, Refresh 
} from '@element-plus/icons-vue'

const router = useRouter()
const productStore = useProductStore()

const categories = computed(() => productStore.categories)
const products = computed(() => productStore.products)
const recommendProducts = computed(() => productStore.getRecommendProducts())

const categoryIcons = {
  Monitor,
  House,
  ShoppingBag,
  MagicStick,
  Cpu,
  Reading,
  Van,
  Dishwasher
}

const subCategories = {
  1: ['手机', '平板', '耳机', '相机', '笔记本'],
  2: ['沙发', '桌椅', '床品', '收纳', '装饰'],
  3: ['男装', '女装', '童装', '鞋靴', '箱包'],
  4: ['护肤', '彩妆', '香水', '工具', '美容仪'],
  5: ['玩具', '服饰', '喂养', '出行', '教育'],
  6: ['小说', '教材', '文具', '办公用品', '乐器'],
  7: ['电动车', '自行车', '配件', '平衡车', '摩托车'],
  8: ['健身器材', '运动服饰', '户外装备', '球类']
}

const goToCategory = (categoryId) => {
  router.push({
    path: '/products',
    query: { category: categoryId }
  })
}

const getCategoryCount = (categoryId) => {
  return products.value.filter(p => p.category === categoryId).length
}

const getSubCategories = (categoryId) => {
  return subCategories[categoryId] || []
}
</script>

<style scoped>
.category-view {
  padding-bottom: 80px;
}
</style>
