<template>
  <div class="product-detail-view min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <header class="fixed top-0 left-0 right-0 z-50 pt-safe">
      <div class="glass px-4 py-3 flex items-center justify-between">
        <button 
          class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
          @click="goBack"
        >
          <el-icon class="text-xl"><ArrowLeft /></el-icon>
        </button>
        <h1 class="font-medium text-gray-800 dark:text-white">商品详情</h1>
        <div class="flex items-center gap-2">
          <button 
            class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
            @click="showShare = true"
          >
            <el-icon class="text-xl"><Share /></el-icon>
          </button>
          <button 
            class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
            @click="toggleFavorite"
          >
            <el-icon class="text-xl" :class="{ 'text-red-500': isFavorite }">
              <Star v-if="isFavorite" :fill="'currentColor'" />
              <Star v-else />
            </el-icon>
          </button>
          <button 
            class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
            @click="showMore = true"
          >
            <el-icon class="text-xl"><MoreFilled /></el-icon>
          </button>
        </div>
      </div>
    </header>
    
    <main class="pt-16">
      <div class="bg-white dark:bg-gray-800">
        <el-tabs 
          v-model="activeTab" 
          class="product-tabs"
          :stretch="true"
        >
          <el-tab-pane label="图片" name="images">
            <div class="relative">
              <el-carousel 
                height="400px"
                :autoplay="false"
                indicator-position="inside"
                :loop="true"
                @change="handleImageChange"
              >
                <el-carousel-item v-for="(image, index) in product.images" :key="index">
                  <img 
                    :src="image" 
                    :alt="`${product.title} ${index + 1}`"
                    class="w-full h-full object-contain"
                  />
                </el-carousel-item>
              </el-carousel>
              <div class="absolute bottom-4 right-4 glass px-3 py-1.5 rounded-full text-xs text-gray-600 dark:text-gray-400">
                {{ currentImageIndex + 1 }} / {{ product.images.length }}
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane v-if="product.has3D" label="3D 预览" name="3d">
            <div class="p-4">
              <ModelViewer3D 
                :product="product" 
                :model-type="getModelType(product.category)"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="px-4 py-4 space-y-4">
        <div class="glass-card p-4">
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span 
                  v-for="tag in product.tags" 
                  :key="tag"
                  class="tag-badge px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  :class="getTagClass(tag)"
                >
                  {{ tag }}
                </span>
                <span 
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getConditionClass(product.condition)"
                >
                  {{ getConditionLabel(product.condition) }}
                </span>
              </div>
              <h1 class="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                {{ product.title }}
              </h1>
            </div>
          </div>
          
          <div class="flex items-baseline gap-3">
            <span class="text-2xl font-bold text-red-500">
              ¥{{ product.price }}
            </span>
            <span class="text-sm text-gray-400 line-through">
              原价 ¥{{ product.originalPrice }}
            </span>
            <span class="text-xs text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
              省 ¥{{ product.originalPrice - product.price }}
            </span>
          </div>
          
          <div class="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-1">
              <el-icon><View /></el-icon>
              <span>{{ formatNumber(product.views) }} 浏览</span>
            </div>
            <div class="flex items-center gap-1">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ product.likes }} 想要</span>
            </div>
            <div class="flex items-center gap-1">
              <el-icon><Clock /></el-icon>
              <span>{{ product.publishTime }} 发布</span>
            </div>
          </div>
        </div>
        
        <div class="glass-card p-4">
          <h3 class="font-medium text-gray-800 dark:text-white mb-3">交易方式</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="method in tradeMethods" 
              :key="method.value"
              class="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all"
              :class="[
                selectedTradeMethod === method.value 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
              ]"
              @click="selectedTradeMethod = method.value"
            >
              <el-icon><component :is="tradeIcons[method.icon]" /></el-icon>
              <span>{{ method.label }}</span>
            </button>
          </div>
        </div>
        
        <div class="glass-card p-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img 
                :src="product.seller.avatar" 
                :alt="product.seller.nickname"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-800 dark:text-white truncate">
                  {{ product.seller.nickname }}
                </span>
                <el-icon 
                  v-if="product.seller.verified" 
                  class="text-primary-500"
                  title="已实名认证"
                >
                  <CircleCheckFilled />
                </el-icon>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-1">
                  <el-icon><Star /></el-icon>
                  <span>{{ product.seller.rating }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <el-icon><Location /></el-icon>
                  <span class="truncate">{{ product.seller.location }}</span>
                </div>
              </div>
            </div>
            <button 
              class="px-4 py-2 rounded-full border border-primary-500 text-primary-500 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
              @click="startChat"
            >
              私信
            </button>
          </div>
        </div>
        
        <div class="glass-card p-4">
          <h3 class="font-medium text-gray-800 dark:text-white mb-3">规格参数</h3>
          <div class="grid grid-cols-2 gap-3">
            <div 
              v-for="(spec, index) in product.specs" 
              :key="index"
              class="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ spec.name }}</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white">{{ spec.value }}</span>
            </div>
          </div>
        </div>
        
        <div class="glass-card p-4">
          <h3 class="font-medium text-gray-800 dark:text-white mb-3">商品描述</h3>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ product.description }}
          </p>
        </div>
        
        <div class="glass-card p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-gray-800 dark:text-white">猜你喜欢</h3>
            <button class="text-sm text-primary-500 flex items-center gap-1">
              换一批
              <el-icon class="text-xs"><Refresh /></el-icon>
            </button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ProductCard 
              v-for="item in recommendProducts" 
              :key="item.id"
              :product="item"
            />
          </div>
        </div>
      </div>
    </main>
    
    <div class="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div class="glass px-4 py-3 flex items-center gap-4">
        <div class="flex items-center gap-6">
          <button 
            class="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
            @click="toggleFavorite"
          >
            <el-icon class="text-xl" :class="{ 'text-red-500': isFavorite }">
              <Star v-if="isFavorite" :fill="'currentColor'" />
              <Star v-else />
            </el-icon>
            <span class="text-xs mt-0.5">收藏</span>
          </button>
          <button 
            class="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
            @click="startChat"
          >
            <el-icon class="text-xl"><ChatDotRound /></el-icon>
            <span class="text-xs mt-0.5">咨询</span>
          </button>
        </div>
        <div class="flex-1 flex items-center gap-3">
          <button 
            class="flex-1 py-3 rounded-full border-2 border-primary-500 text-primary-500 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
            @click="startChat"
          >
            立即私聊
          </button>
          <button 
            class="flex-1 py-3 rounded-full gradient-bg text-white font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            @click="handleBuy"
          >
            我想要
          </button>
        </div>
      </div>
    </div>
    
    <el-dialog 
      v-model="showShare" 
      title="分享"
      width="320px"
      :show-close="true"
    >
      <div class="grid grid-cols-4 gap-4 py-4">
        <div class="flex flex-col items-center cursor-pointer" @click="handleShare('wechat')">
          <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2">
            <el-icon class="text-white text-xl"><ChatDotRound /></el-icon>
          </div>
          <span class="text-xs text-gray-600 dark:text-gray-400">微信</span>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleShare('moments')">
          <div class="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mb-2">
            <el-icon class="text-white text-xl"><Share /></el-icon>
          </div>
          <span class="text-xs text-gray-600 dark:text-gray-400">朋友圈</span>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleShare('qq')">
          <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mb-2">
            <el-icon class="text-white text-xl"><ChatLineRound /></el-icon>
          </div>
          <span class="text-xs text-gray-600 dark:text-gray-400">QQ</span>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleShare('copy')">
          <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
            <el-icon class="text-gray-600 dark:text-gray-400 text-xl"><CopyDocument /></el-icon>
          </div>
          <span class="text-xs text-gray-600 dark:text-gray-400">复制链接</span>
        </div>
      </div>
    </el-dialog>
    
    <el-dialog 
      v-model="showMore" 
      title="更多"
      width="280px"
      :show-close="true"
    >
      <div class="divide-y divide-gray-100 dark:divide-gray-700">
        <button class="w-full py-3 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-2 rounded-lg transition-colors">
          举报商品
        </button>
        <button class="w-full py-3 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-2 rounded-lg transition-colors">
          屏蔽卖家
        </button>
        <button class="w-full py-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 rounded-lg transition-colors">
          投诉违规
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderNav from '@/components/HeaderNav.vue'
import TabBar from '@/components/TabBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import ModelViewer3D from '@/components/ModelViewer3D.vue'
import { useProductStore } from '@/stores/product'
import { useUserStore } from '@/stores/user'
import { 
  ArrowLeft, Share, MoreFilled, View, ChatDotRound, 
  Clock, Location, Star, CircleCheckFilled, Refresh,
  ChatLineRound, CopyDocument, User, Document
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const userStore = useUserStore()

const activeTab = ref('images')
const currentImageIndex = ref(0)
const selectedTradeMethod = ref('self')
const showShare = ref(false)
const showMore = ref(false)

const product = computed(() => {
  return productStore.getProductById(route.params.id) || {}
})

const recommendProducts = computed(() => {
  return productStore.getRecommendProducts(route.params.id)
})

const isFavorite = computed(() => {
  return userStore.isFavorite(Number(route.params.id))
})

const tradeMethods = computed(() => productStore.tradeMethods)

const tradeIcons = {
  Location: Location,
  Document: 'Document',
  User: User
}

const getModelType = (categoryId) => {
  const types = {
    1: 'phone',
    2: 'laptop',
    3: 'generic',
    4: 'generic',
    5: 'generic',
    6: 'generic',
    7: 'generic',
    8: 'generic'
  }
  return types[categoryId] || 'generic'
}

const goBack = () => {
  router.back()
}

const toggleFavorite = () => {
  const isFav = userStore.isFavorite(Number(route.params.id))
  userStore.toggleFavorite(Number(route.params.id))
  if (isFav) {
    ElMessage.info('已取消收藏')
  } else {
    ElMessage.success('已添加到收藏')
  }
}

const startChat = () => {
  ElMessage({
    message: `正在打开与「${product.value?.seller?.nickname || '卖家'}」的聊天窗口...`,
    type: 'success',
    duration: 2000
  })
}

const handleBuy = () => {
  ElMessageBox.confirm(
    `确定要发送求购意向给卖家「${product.value?.seller?.nickname || '卖家'}」吗？`,
    '确认操作',
    {
      confirmButtonText: '确定发送',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    if (product.value) {
      product.value.likes += 1
    }
    ElMessage.success('求购意向已发送！卖家会尽快联系您')
  }).catch(() => {})
}

const handleShare = (platform) => {
  const shareUrl = window.location.href
  const shareTitle = product.value?.title || '闲置商品'
  
  const platformNames = {
    wechat: '微信',
    moments: '朋友圈',
    qq: 'QQ',
    copy: '复制链接'
  }
  
  if (platform === 'copy') {
    navigator.clipboard.writeText(shareUrl).then(() => {
      ElMessage.success('链接已复制到剪贴板')
      showShare.value = false
    }).catch(() => {
      ElMessage.info(`请手动复制链接：${shareUrl}`)
    })
  } else {
    ElMessage({
      message: `正在分享到${platformNames[platform]}...`,
      type: 'success',
      duration: 2000,
      onClose: () => {
        showShare.value = false
      }
    })
  }
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

const getTagClass = (tag) => {
  const classes = {
    '超值': 'bg-green-500',
    '急出': 'bg-red-500',
    '自提': 'bg-blue-500',
    '全新': 'bg-purple-500'
  }
  return classes[tag] || 'bg-gray-500'
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

const handleImageChange = (index) => {
  currentImageIndex.value = index
}

onMounted(() => {
  if (product.value) {
    userStore.addBrowseHistory(product.value)
  }
})
</script>

<style scoped>
.product-detail-view {
  padding-bottom: 80px;
}

:deep(.product-tabs .el-tabs__header) {
  margin: 0;
}

:deep(.product-tabs .el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.product-tabs .el-tabs__nav) {
  display: flex;
  justify-content: center;
  float: none;
}

:deep(.product-tabs .el-tabs__item) {
  padding: 0 24px;
  height: 44px;
  line-height: 44px;
}
</style>
