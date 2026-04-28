<template>
  <div class="product-list-view min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <header class="fixed top-0 left-0 right-0 z-50 pt-safe">
      <div class="glass px-4 py-3">
        <div class="flex items-center gap-3">
          <button 
            class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all flex-shrink-0"
            @click="goBack"
          >
            <el-icon class="text-xl"><ArrowLeft /></el-icon>
          </button>
          
          <div class="flex-1 flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30">
            <el-icon class="text-gray-400"><Search /></el-icon>
            <input 
              v-model="searchKeyword"
              type="text" 
              placeholder="搜索闲置商品..." 
              class="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400"
              @keyup.enter="doSearch"
            />
            <button 
              v-if="searchKeyword"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              @click="searchKeyword = ''; doSearch()"
            >
              <el-icon><CircleClose /></el-icon>
            </button>
          </div>
          
          <button 
            class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all flex-shrink-0"
            @click="showFilter = true"
          >
            <el-icon class="text-xl"><Filter /></el-icon>
          </button>
        </div>
      </div>
    </header>
    
    <main class="pt-16">
      <div class="sticky top-16 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-1 px-4 py-2 overflow-x-auto">
          <button 
            v-for="sort in sortOptions" 
            :key="sort.value"
            class="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            :class="currentSort === sort.value 
              ? 'bg-primary-500 text-white' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="currentSort = sort.value"
          >
            {{ sort.label }}
          </button>
        </div>
      </div>
      
      <div v-if="activeFilters.length > 0" class="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-sm text-gray-500 dark:text-gray-400">已选：</span>
          <template v-for="filter in activeFilters" :key="filter.key">
            <span class="flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm rounded-full">
              {{ filter.label }}
              <button @click="clearFilter(filter.key)">
                <el-icon class="text-xs"><CircleClose /></el-icon>
              </button>
            </span>
          </template>
          <button 
            class="text-sm text-red-500 hover:text-red-600"
            @click="clearAllFilters"
          >
            清除全部
          </button>
        </div>
      </div>
      
      <div class="px-4 py-4">
        <div v-if="filteredProducts.length > 0">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id"
              :product="product"
            />
          </div>
          
          <div class="flex items-center justify-center gap-2 mt-8">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="filteredProducts.length"
              layout="prev, pager, next"
              :small="true"
            />
          </div>
        </div>
        
        <div v-else class="flex flex-col items-center justify-center py-20">
          <el-icon class="text-6xl text-gray-300 dark:text-gray-600 mb-4"><Search /></el-icon>
          <p class="text-gray-500 dark:text-gray-400 mb-2">暂无相关商品</p>
          <button 
            class="text-primary-500 hover:text-primary-600"
            @click="clearAllFilters"
          >
            清除筛选条件
          </button>
        </div>
      </div>
    </main>
    
    <el-drawer 
      v-model="showFilter" 
      title="筛选"
      direction="right"
      :size="isMobile ? '100%' : '400px'"
    >
      <div class="space-y-6">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white mb-3">商品分类</h4>
          <div class="flex flex-wrap gap-2">
            <button 
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="filterCategoryId === null 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
              @click="filterCategoryId = null"
            >
              全部
            </button>
            <button 
              v-for="category in categories" 
              :key="category.id"
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="filterCategoryId === category.id 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
              @click="filterCategoryId = category.id"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white mb-3">价格区间</h4>
          <div class="flex items-center gap-2">
            <el-input 
              v-model.number="filterMinPrice"
              type="number"
              placeholder="最低价"
              class="flex-1"
            />
            <span class="text-gray-400">-</span>
            <el-input 
              v-model.number="filterMaxPrice"
              type="number"
              placeholder="最高价"
              class="flex-1"
            />
          </div>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white mb-3">商品成色</h4>
          <div class="flex flex-wrap gap-2">
            <button 
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="filterCondition === null 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
              @click="filterCondition = null"
            >
              全部
            </button>
            <button 
              v-for="condition in conditionTypes" 
              :key="condition.value"
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="filterCondition === condition.value 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
              @click="filterCondition = condition.value"
            >
              {{ condition.label }}
            </button>
          </div>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white mb-3">特殊筛选</h4>
          <div class="flex flex-wrap gap-2">
            <label 
              class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all"
              :class="filterHas3D 
                ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
            >
              <el-checkbox v-model="filterHas3D" />
              支持 3D 预览
            </label>
            <label 
              class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all"
              :class="filterIsBargain 
                ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
            >
              <el-checkbox v-model="filterIsBargain" />
              超值捡漏
            </label>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex gap-3">
          <el-button class="flex-1" @click="resetFilters">
            重置
          </el-button>
          <el-button type="primary" class="flex-1" @click="applyFilters">
            确定
          </el-button>
        </div>
      </template>
    </el-drawer>
    
    <TabBar />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductStore } from '@/stores/product'
import { 
  ArrowLeft, Search, CircleClose, Filter 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const isMobile = ref(window.innerWidth < 768)
const showFilter = ref(false)
const searchKeyword = ref('')
const currentSort = ref('newest')
const currentPage = ref(1)
const pageSize = ref(20)

const filterCategoryId = ref(null)
const filterMinPrice = ref(null)
const filterMaxPrice = ref(null)
const filterCondition = ref(null)
const filterHas3D = ref(false)
const filterIsBargain = ref(false)

const categories = computed(() => productStore.categories)
const conditionTypes = computed(() => productStore.conditionTypes)

const sortOptions = [
  { value: 'newest', label: '最新发布' },
  { value: 'price-asc', label: '价格最低' },
  { value: 'price-desc', label: '价格最高' },
  { value: 'popular', label: '人气优先' },
  { value: 'distance', label: '距离最近' }
]

const activeFilters = computed(() => {
  const filters = []
  
  if (filterCategoryId.value !== null) {
    const category = categories.value.find(c => c.id === filterCategoryId.value)
    if (category) {
      filters.push({ key: 'category', label: category.name })
    }
  }
  
  if (filterMinPrice.value !== null && filterMinPrice.value !== '') {
    filters.push({ key: 'minPrice', label: `¥${filterMinPrice.value}起` })
  }
  
  if (filterMaxPrice.value !== null && filterMaxPrice.value !== '') {
    filters.push({ key: 'maxPrice', label: `¥${filterMaxPrice.value}以内` })
  }
  
  if (filterCondition.value !== null) {
    const condition = conditionTypes.value.find(c => c.value === filterCondition.value)
    if (condition) {
      filters.push({ key: 'condition', label: condition.label })
    }
  }
  
  if (filterHas3D.value) {
    filters.push({ key: 'has3D', label: '3D 预览' })
  }
  
  if (filterIsBargain.value) {
    filters.push({ key: 'isBargain', label: '超值捡漏' })
  }
  
  return filters
})

const filteredProducts = computed(() => {
  let result = productStore.filterProducts({
    categoryId: filterCategoryId.value,
    minPrice: filterMinPrice.value,
    maxPrice: filterMaxPrice.value,
    condition: filterCondition.value,
    sortBy: currentSort.value,
    searchKeyword: searchKeyword.value
  })
  
  if (filterHas3D.value) {
    result = result.filter(p => p.has3D)
  }
  
  if (filterIsBargain.value) {
    result = result.filter(p => p.tags.includes('超值') || p.tags.includes('急出'))
  }
  
  return result
})

const goBack = () => {
  router.back()
}

const doSearch = () => {
  currentPage.value = 1
}

const clearFilter = (key) => {
  switch (key) {
    case 'category':
      filterCategoryId.value = null
      break
    case 'minPrice':
      filterMinPrice.value = null
      break
    case 'maxPrice':
      filterMaxPrice.value = null
      break
    case 'condition':
      filterCondition.value = null
      break
    case 'has3D':
      filterHas3D.value = false
      break
    case 'isBargain':
      filterIsBargain.value = false
      break
  }
}

const clearAllFilters = () => {
  filterCategoryId.value = null
  filterMinPrice.value = null
  filterMaxPrice.value = null
  filterCondition.value = null
  filterHas3D.value = false
  filterIsBargain.value = false
  currentSort.value = 'newest'
  searchKeyword.value = ''
}

const resetFilters = () => {
  filterCategoryId.value = null
  filterMinPrice.value = null
  filterMaxPrice.value = null
  filterCondition.value = null
  filterHas3D.value = false
  filterIsBargain.value = false
}

const applyFilters = () => {
  showFilter.value = false
  currentPage.value = 1
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  if (route.query.category) {
    filterCategoryId.value = Number(route.query.category)
  }
  if (route.query.sort) {
    currentSort.value = route.query.sort
  }
  if (route.query.has3D === 'true') {
    filterHas3D.value = true
  }
  
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
.product-list-view {
  padding-bottom: 80px;
}
</style>
