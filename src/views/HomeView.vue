<template>
  <div class="home-view min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <HeaderNav />
    
    <div class="space-y-4">
      <BannerCarousel />
      
      <CategoryNav />
      
      <section class="px-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-1 h-6 rounded-full gradient-bg"></div>
            <h2 class="text-lg font-bold text-gray-800 dark:text-white">3D 精选好物</h2>
            <span class="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
              可旋转预览
            </span>
          </div>
          <router-link 
            to="/products?has3D=true" 
            class="text-sm text-primary-500 flex items-center gap-1 hover:text-primary-600 transition-colors"
          >
            更多
            <el-icon class="text-xs"><ArrowRight /></el-icon>
          </router-link>
        </div>
        
        <div class="glass-card p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="product in featuredProducts" 
              :key="product.id"
              class="featured-item group cursor-pointer"
              @click="goToProduct(product.id)"
            >
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="w-full sm:w-40 h-40 sm:h-40 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img 
                    :src="product.images[0]" 
                    :alt="product.title"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm flex items-center gap-1">
                    <el-icon class="text-xs"><Promotion /></el-icon>
                    3D 预览
                  </div>
                </div>
                <div class="flex-1 flex flex-col justify-between min-h-[120px]">
                  <div>
                    <h3 class="font-medium text-gray-800 dark:text-white line-clamp-2 mb-2">
                      {{ product.title }}
                    </h3>
                    <div class="flex items-center gap-2 mb-2">
                      <span 
                        class="px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="getConditionClass(product.condition)"
                      >
                        {{ getConditionLabel(product.condition) }}
                      </span>
                      <span v-for="tag in product.tags" :key="tag" class="text-xs text-gray-500 dark:text-gray-400">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-baseline gap-2">
                      <span class="text-xl font-bold text-red-500">¥{{ product.price }}</span>
                      <span class="text-xs text-gray-400 line-through">¥{{ product.originalPrice }}</span>
                    </div>
                    <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <el-icon><View /></el-icon>
                      <span>{{ formatNumber(product.views) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="px-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-1 h-6 rounded-full bg-gradient-to-b from-green-400 to-emerald-500"></div>
            <h2 class="text-lg font-bold text-gray-800 dark:text-white">同城闲置</h2>
            <div class="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <el-icon><Location /></el-icon>
              <span>附近 2km</span>
            </div>
          </div>
          <router-link 
            to="/products?sort=distance" 
            class="text-sm text-primary-500 flex items-center gap-1 hover:text-primary-600 transition-colors"
          >
            更多
            <el-icon class="text-xs"><ArrowRight /></el-icon>
          </router-link>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ProductCard 
            v-for="product in nearbyProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </section>
      
      <section class="px-4">
        <div class="glass-card overflow-hidden">
          <div class="bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 px-4 py-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <el-icon class="text-white text-xl"><Fire /></el-icon>
                <h2 class="text-lg font-bold text-white">限时捡漏</h2>
                <span class="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                  超值低价
                </span>
              </div>
              <div class="flex items-center gap-1 text-white text-sm">
                <span class="animate-pulse">●</span>
                <span>距结束还剩 23:59:59</span>
              </div>
            </div>
          </div>
          
          <div class="p-4">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ProductCard 
                v-for="product in bargainProducts" 
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section class="px-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500"></div>
            <h2 class="text-lg font-bold text-gray-800 dark:text-white">猜你喜欢</h2>
          </div>
          <router-link 
            to="/products" 
            class="text-sm text-primary-500 flex items-center gap-1 hover:text-primary-600 transition-colors"
          >
            更多
            <el-icon class="text-xs"><ArrowRight /></el-icon>
          </router-link>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ProductCard 
            v-for="product in recommendProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </section>
      
      <section class="px-4 pb-4">
        <div class="glass-card">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <div class="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-violet-500"></div>
              <h2 class="text-lg font-bold text-gray-800 dark:text-white">求购专区</h2>
            </div>
            <router-link 
              to="/want-buy" 
              class="text-sm text-primary-500 flex items-center gap-1 hover:text-primary-600 transition-colors"
            >
              查看全部
              <el-icon class="text-xs"><ArrowRight /></el-icon>
            </router-link>
          </div>
          
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div 
              v-for="want in wantBuys.slice(0, 3)" 
              :key="want.id"
              class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              @click="goToWantBuy(want.id)"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs rounded-full">
                      求购
                    </span>
                    <h3 class="font-medium text-gray-800 dark:text-white truncate">
                      {{ want.title }}
                    </h3>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                    {{ want.description }}
                  </p>
                  <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span class="text-orange-500 font-medium">
                      心理价位: ¥{{ want.maxPrice }}
                    </span>
                    <span>{{ want.location }}</span>
                    <span>{{ want.publishTime }}</span>
                  </div>
                </div>
                <button class="px-3 py-1.5 rounded-full bg-purple-500 text-white text-xs font-medium hover:bg-purple-600 transition-colors flex-shrink-0">
                  联系TA
                </button>
              </div>
            </div>
          </div>
          
          <div class="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <router-link 
              to="/publish-want-buy"
              class="flex items-center justify-center gap-2 py-2 text-primary-500 hover:text-primary-600 transition-colors"
            >
              <el-icon><Plus /></el-icon>
              <span>发布我的求购需求</span>
            </router-link>
          </div>
        </div>
      </section>
    </div>
    
    <TabBar />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import HeaderNav from '@/components/HeaderNav.vue'
import TabBar from '@/components/TabBar.vue'
import BannerCarousel from '@/components/BannerCarousel.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductStore } from '@/stores/product'
import { 
  ArrowRight, Promotion, View, Location, Fire, Plus 
} from '@element-plus/icons-vue'

const router = useRouter()
const productStore = useProductStore()

const featuredProducts = computed(() => productStore.getFeaturedProducts())
const nearbyProducts = computed(() => productStore.getNearbyProducts())
const bargainProducts = computed(() => productStore.getBargainProducts())
const recommendProducts = computed(() => productStore.getRecommendProducts())
const wantBuys = computed(() => productStore.wantBuys)

const goToProduct = (id) => {
  router.push(`/product/${id}`)
}

const goToWantBuy = (id) => {
  router.push('/want-buy')
}

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
.home-view {
  padding-bottom: 80px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
