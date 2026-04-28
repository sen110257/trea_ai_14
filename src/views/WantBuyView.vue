<template>
  <div class="want-buy-view min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <header class="fixed top-0 left-0 right-0 z-50 pt-safe">
      <div class="glass px-4 py-3 flex items-center justify-between">
        <button 
        class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
        @click="goBack"
      >
        <el-icon class="text-xl"><ArrowLeft /></el-icon>
      </button>
      <h1 class="font-bold text-lg text-gray-800 dark:text-white">求购专区</h1>
      <router-link 
        to="/publish-want-buy"
        class="px-4 py-1.5 rounded-full gradient-bg text-white text-sm font-medium flex items-center gap-1"
      >
        <el-icon><Plus /></el-icon>
        发布
      </router-link>
    </div>
  </header>
  
  <main class="pt-16">
    <div class="px-4 py-4">
      <div class="glass-card p-4 mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <el-icon class="text-purple-500 text-2xl"><Search /></el-icon>
            </div>
            <div>
              <h3 class="font-medium text-gray-800 dark:text-white">有求购需求？</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">发布求购，让卖家主动联系你</p>
            </div>
          </div>
          <router-link 
            to="/publish-want-buy"
            class="px-4 py-2 rounded-full border border-primary-500 text-primary-500 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
          >
            立即发布
          </router-link>
        </div>
      </div>
      
      <div class="sticky top-16 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700 -mx-4 px-4 py-3">
        <div class="flex items-center gap-2 overflow-x-auto">
          <button 
            v-for="category in categories" 
            :key="category.id"
            class="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            :class="activeCategory === category.id 
              ? 'bg-primary-500 text-white' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="activeCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
      
      <div class="space-y-3 mt-4">
        <div 
          v-for="want in filteredWantBuys" 
          :key="want.id"
          class="glass-card p-4 cursor-pointer hover:-translate-y-0.5 transition-all"
          @click="viewWantBuy(want.id)"
        >
          <div class="flex items-start gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">
                  求购
                </span>
                <span 
                  v-if="want.urgent"
                  class="px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-xs rounded-full font-medium animate-pulse"
                >
                  急
                </span>
                <h3 class="font-medium text-gray-800 dark:text-white truncate flex-1">
                  {{ want.title }}
                </h3>
              </div>
              
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {{ want.description }}
              </p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <span class="text-orange-500 font-bold">
                    心理价: ¥{{ want.maxPrice }}
                  </span>
                  <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <el-icon><Location /></el-icon>
                    <span>{{ want.location }}</span>
                  </div>
                </div>
                <button 
                  class="px-4 py-1.5 rounded-full bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-all"
                  @click.stop="contactPublisher(want)"
                >
                  联系TA
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <img 
                :src="want.publisher.avatar" 
                :alt="want.publisher.nickname"
                class="w-6 h-6 rounded-full object-cover"
              />
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ want.publisher.nickname }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-400">
              <span>{{ want.publishTime }}</span>
              <span>{{ want.views }} 浏览</span>
              <span>{{ want.contacts }} 人联系</span>
            </div>
          </div>
        </div>
        
        <div 
          v-if="filteredWantBuys.length === 0"
          class="flex flex-col items-center justify-center py-20"
        >
          <el-icon class="text-6xl text-gray-300 dark:text-gray-600 mb-4"><Search /></el-icon>
          <p class="text-gray-500 dark:text-gray-400 mb-2">暂无相关求购信息</p>
          <router-link 
            to="/publish-want-buy"
            class="text-primary-500 hover:text-primary-600"
          >
            发布我的求购需求
          </router-link>
        </div>
      </div>
    </div>
  </main>
  
  <TabBar />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import { useProductStore } from '@/stores/product'
import { 
  ArrowLeft, Plus, Search, Location 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const productStore = useProductStore()

const categories = computed(() => [
  { id: null, name: '全部' },
  ...productStore.categories
])

const activeCategory = ref(null)

const wantBuys = computed(() => productStore.wantBuys)

const filteredWantBuys = computed(() => {
  if (activeCategory.value === null) {
    return wantBuys.value
  }
  return wantBuys.value.filter(w => w.category === activeCategory.value)
})

const goBack = () => {
  router.back()
}

const viewWantBuy = (id) => {
  ElMessage.info('查看求购详情')
}

const contactPublisher = (want) => {
  ElMessage.success(`已打开与 ${want.publisher.nickname} 的聊天窗口`)
}
</script>

<style scoped>
.want-buy-view {
  padding-bottom: 80px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
