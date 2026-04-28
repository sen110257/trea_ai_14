<template>
  <div class="profile-view min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <header class="relative overflow-hidden">
      <div class="absolute inset-0 gradient-bg opacity-90"></div>
      <div class="absolute inset-0 bg-[url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20geometric%20pattern%20subtle%20texture%20blue%20purple&image_size=square')] bg-cover bg-center opacity-20"></div>
      
      <div class="relative pt-safe px-4 py-6">
        <div class="flex items-center justify-between mb-6">
          <span class="text-white/80 text-sm">个人中心</span>
          <div class="flex items-center gap-2">
            <button 
              class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              @click="toggleTheme"
            >
              <el-icon class="text-white text-xl">
                <Sunny v-if="!isDark" />
                <Moon v-else />
              </el-icon>
            </button>
            <router-link 
              to="/message"
              class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all relative"
            >
              <el-icon class="text-white text-xl"><Setting /></el-icon>
            </router-link>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="relative">
            <img 
              :src="user.avatar" 
              :alt="user.nickname"
              class="w-20 h-20 rounded-full border-4 border-white/30 object-cover"
            />
            <button class="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
              <el-icon class="text-white text-sm"><Camera /></el-icon>
            </button>
          </div>
          
          <div class="flex-1 text-white">
            <div class="flex items-center gap-2 mb-1">
              <h2 class="text-xl font-bold">{{ user.nickname }}</h2>
              <el-icon class="text-green-400" title="已实名认证"><CircleCheckFilled /></el-icon>
            </div>
            <p class="text-white/70 text-sm mb-2">{{ user.location }}</p>
            <div class="flex items-center gap-4 text-sm">
              <div class="flex items-center gap-1">
                <el-icon class="text-yellow-400"><Star /></el-icon>
                <span>信誉良好</span>
              </div>
              <div class="flex items-center gap-1">
                <el-icon><Medal /></el-icon>
                <span>老卖家</span>
              </div>
            </div>
          </div>
          
          <button 
            class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            @click="editProfile"
          >
            <el-icon class="text-white text-xl"><Edit /></el-icon>
          </button>
        </div>
        
        <div class="flex items-center justify-around mt-6 py-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-white">{{ stats.published }}</p>
            <p class="text-sm text-white/70">发布商品</p>
          </div>
          <div class="w-px h-10 bg-white/20"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-white">{{ stats.sold }}</p>
            <p class="text-sm text-white/70">已售出</p>
          </div>
          <div class="w-px h-10 bg-white/20"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-white">{{ stats.favorites }}</p>
            <p class="text-sm text-white/70">收藏</p>
          </div>
          <div class="w-px h-10 bg-white/20"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-white">{{ stats.browsed }}</p>
            <p class="text-sm text-white/70">浏览</p>
          </div>
        </div>
      </div>
    </header>
    
    <main class="px-4 py-4 space-y-4 -mt-4 relative z-10">
      <div class="glass-card p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium text-gray-800 dark:text-white">我的发布</h3>
          <router-link 
            to="/profile/published"
            class="text-sm text-primary-500 flex items-center gap-1"
          >
            查看全部
            <el-icon class="text-xs"><ArrowRight /></el-icon>
          </router-link>
        </div>
        
        <el-tabs v-model="publishedTab" class="publish-tabs">
          <el-tab-pane label="在售" name="selling">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ProductCard 
                v-for="product in myProducts.selling" 
                :key="product.id"
                :product="product"
              />
              <div 
                v-if="myProducts.selling.length === 0"
                class="col-span-2 md:col-span-4 flex flex-col items-center justify-center py-12"
              >
                <el-icon class="text-5xl text-gray-300 dark:text-gray-600 mb-3"><DocumentAdd /></el-icon>
                <p class="text-gray-500 dark:text-gray-400 mb-3">暂无在售商品</p>
                <router-link 
                  to="/publish"
                  class="px-6 py-2 rounded-full gradient-bg text-white text-sm font-medium"
                >
                  立即发布
                </router-link>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="已售出" name="sold">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ProductCard 
                v-for="product in myProducts.sold" 
                :key="product.id"
                :product="product"
              />
              <div 
                v-if="myProducts.sold.length === 0"
                class="col-span-2 md:col-span-4 flex flex-col items-center justify-center py-12"
              >
                <el-icon class="text-5xl text-gray-300 dark:text-gray-600 mb-3"><ShoppingCart /></el-icon>
                <p class="text-gray-500 dark:text-gray-400">暂无已售出商品</p>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="已下架" name="offline">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ProductCard 
                v-for="product in myProducts.offline" 
                :key="product.id"
                :product="product"
              />
              <div 
                v-if="myProducts.offline.length === 0"
                class="col-span-2 md:col-span-4 flex flex-col items-center justify-center py-12"
              >
                <el-icon class="text-5xl text-gray-300 dark:text-gray-600 mb-3"><Close /></el-icon>
                <p class="text-gray-500 dark:text-gray-400">暂无已下架商品</p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="glass-card p-4">
        <h3 class="font-medium text-gray-800 dark:text-white mb-4">常用功能</h3>
        <div class="grid grid-cols-4 gap-4">
          <router-link 
            to="/profile/favorites"
            class="flex flex-col items-center"
          >
            <div class="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center mb-2">
              <el-icon class="text-pink-500 text-xl"><Heart /></el-icon>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">我的收藏</span>
          </router-link>
          
          <button 
            class="flex flex-col items-center"
            @click="showBrowseHistory = true"
          >
            <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-2">
              <el-icon class="text-blue-500 text-xl"><View /></el-icon>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">浏览记录</span>
          </button>
          
          <router-link 
            to="/profile/bought"
            class="flex flex-col items-center"
          >
            <div class="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-2">
              <el-icon class="text-green-500 text-xl"><ShoppingBag /></el-icon>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">我买到的</span>
          </router-link>
          
          <router-link 
            to="/profile/sold"
            class="flex flex-col items-center"
          >
            <div class="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mb-2">
              <el-icon class="text-orange-500 text-xl"><Money /></el-icon>
            </div>
            <span class="text-xs text-gray-600 dark:text-gray-400">我卖出的</span>
          </router-link>
        </div>
      </div>
      
      <div class="glass-card p-4">
        <h3 class="font-medium text-gray-800 dark:text-white mb-4">设置</h3>
        <div class="space-y-1">
          <div 
            class="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-4 px-4 rounded-lg transition-colors"
            @click="goToAddress"
          >
            <div class="flex items-center gap-3">
              <el-icon class="text-gray-500 dark:text-gray-400"><Location /></el-icon>
              <span class="text-gray-700 dark:text-gray-300">收货地址</span>
            </div>
            <el-icon class="text-gray-400"><ArrowRight /></el-icon>
          </div>
          
          <div 
            class="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-4 px-4 rounded-lg transition-colors"
            @click="goToAccount"
          >
            <div class="flex items-center gap-3">
              <el-icon class="text-gray-500 dark:text-gray-400"><User /></el-icon>
              <span class="text-gray-700 dark:text-gray-300">账户设置</span>
            </div>
            <el-icon class="text-gray-400"><ArrowRight /></el-icon>
          </div>
          
          <div 
            class="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-4 px-4 rounded-lg transition-colors"
            @click="toggleTheme"
          >
            <div class="flex items-center gap-3">
              <el-icon class="text-gray-500 dark:text-gray-400">
                <Sunny v-if="!isDark" />
                <Moon v-else />
              </el-icon>
              <span class="text-gray-700 dark:text-gray-300">{{ isDark ? '暗黑模式' : '明亮模式' }}</span>
            </div>
            <el-switch v-model="isDark" @change="toggleTheme" />
          </div>
          
          <div 
            class="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-4 px-4 rounded-lg transition-colors"
            @click="goToAbout"
          >
            <div class="flex items-center gap-3">
              <el-icon class="text-gray-500 dark:text-gray-400"><InfoFilled /></el-icon>
              <span class="text-gray-700 dark:text-gray-300">关于我们</span>
            </div>
            <el-icon class="text-gray-400"><ArrowRight /></el-icon>
          </div>
          
          <div 
            class="flex items-center justify-between py-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 -mx-4 px-4 rounded-lg transition-colors"
            @click="handleLogout"
          >
            <div class="flex items-center gap-3">
              <el-icon class="text-red-500"><SwitchButton /></el-icon>
              <span class="text-red-500">退出登录</span>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <el-dialog 
      v-model="showBrowseHistory" 
      title="浏览历史"
      width="90%"
      :show-close="true"
    >
      <div class="space-y-4">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            共 {{ browseHistory.length }} 条记录
          </span>
          <button 
            class="text-sm text-red-500 hover:text-red-600"
            @click="clearHistory"
          >
            清空历史
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ProductCard 
            v-for="product in browseHistory" 
            :key="product.id"
            :product="product"
          />
          <div 
            v-if="browseHistory.length === 0"
            class="col-span-2 md:col-span-4 flex flex-col items-center justify-center py-12"
          >
            <el-icon class="text-5xl text-gray-300 dark:text-gray-600 mb-3"><View /></el-icon>
            <p class="text-gray-500 dark:text-gray-400">暂无浏览记录</p>
          </div>
        </div>
      </div>
    </el-dialog>
    
    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { useProductStore } from '@/stores/product'
import TabBar from '@/components/TabBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import { 
  Sunny, Moon, Setting, Camera, Edit, Star, Medal,
  ArrowRight, DocumentAdd, ShoppingCart, Close,
  Heart, View, ShoppingBag, Money, Location, User,
  InfoFilled, SwitchButton
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()
const productStore = useProductStore()

const isDark = computed(() => themeStore.isDark)
const user = computed(() => userStore.user)
const browseHistory = computed(() => userStore.browseHistory)

const publishedTab = ref('selling')
const showBrowseHistory = ref(false)

const stats = ref({
  published: 12,
  sold: 5,
  favorites: 28,
  browsed: 156
})

const myProducts = computed(() => {
  const allProducts = productStore.products
  return {
    selling: allProducts.slice(0, 2),
    sold: allProducts.slice(2, 4),
    offline: allProducts.slice(4, 5)
  }
})

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const editProfile = () => {
  ElMessage.info('编辑资料功能开发中')
}

const goToAddress = () => {
  ElMessage.info('收货地址管理开发中')
}

const goToAccount = () => {
  ElMessage.info('账户设置开发中')
}

const goToAbout = () => {
  ElMessage.info('关于我们开发中')
}

const clearHistory = () => {
  ElMessageBox.confirm('确定要清空所有浏览历史吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.clearBrowseHistory()
    ElMessage.success('已清空浏览历史')
  }).catch(() => {})
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('已退出登录')
  }).catch(() => {})
}
</script>

<style scoped>
.profile-view {
  padding-bottom: 80px;
}

:deep(.publish-tabs .el-tabs__header) {
  margin: 0 0 16px 0;
}

:deep(.publish-tabs .el-tabs__nav-wrap::after) {
  display: none;
}
</style>
