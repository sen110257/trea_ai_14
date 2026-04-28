<template>
  <div class="message-view min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <HeaderNav />
    
    <main class="pt-2">
      <div class="px-4 py-4">
        <el-tabs v-model="activeTab" class="message-tabs">
          <el-tab-pane label="私信" name="chat">
            <div class="space-y-2">
              <div 
                v-for="chat in chatList" 
                :key="chat.id"
                class="glass-card p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                @click="openChat(chat.id)"
              >
                <div class="flex items-start gap-3">
                  <div class="relative flex-shrink-0">
                    <img 
                      :src="chat.avatar" 
                      :alt="chat.name"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <span 
                      v-if="chat.unread > 0"
                      class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1"
                    >
                      {{ chat.unread > 99 ? '99+' : chat.unread }}
                    </span>
                    <span 
                      v-if="chat.online"
                      class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                    ></span>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-medium text-gray-800 dark:text-white truncate">
                        {{ chat.name }}
                      </span>
                      <span class="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {{ chat.time }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {{ chat.lastMessage }}
                      </p>
                      <span 
                        v-if="chat.isProduct"
                        class="flex-shrink-0 ml-2 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full"
                      >
                        商品咨询
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="chatList.length === 0" class="flex flex-col items-center justify-center py-20">
                <el-icon class="text-6xl text-gray-300 dark:text-gray-600 mb-4"><ChatDotRound /></el-icon>
                <p class="text-gray-500 dark:text-gray-400">暂无私信</p>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="通知" name="notification">
            <div class="space-y-3">
              <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="glass-card p-4"
                :class="{ 'border-l-4 border-primary-500': !notification.read }"
              >
                <div class="flex items-start gap-3">
                  <div 
                    class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    :class="getNotificationBg(notification.type)"
                  >
                    <el-icon :class="getNotificationColor(notification.type)">
                      <component :is="notificationIcons[notification.icon]" />
                    </el-icon>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <h4 class="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                        {{ notification.title }}
                        <span 
                          v-if="!notification.read"
                          class="w-2 h-2 rounded-full bg-red-500"
                        ></span>
                      </h4>
                      <span class="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {{ notification.time }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ notification.content }}</p>
                    
                    <div v-if="notification.product" class="mt-3 flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <img 
                        :src="notification.product.image" 
                        :alt="notification.product.title"
                        class="w-16 h-16 rounded-lg object-cover"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {{ notification.product.title }}
                        </p>
                        <p class="text-sm text-red-500 font-medium">
                          ¥{{ notification.product.price }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-20">
                <el-icon class="text-6xl text-gray-300 dark:text-gray-600 mb-4"><Bell /></el-icon>
                <p class="text-gray-500 dark:text-gray-400">暂无通知</p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>
    
    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HeaderNav from '@/components/HeaderNav.vue'
import TabBar from '@/components/TabBar.vue'
import { 
  ChatDotRound, Bell, Heart, Star, ShoppingCart,
  Warning, Checked, User, Message
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const activeTab = ref('chat')

const notificationIcons = {
  Heart: Heart,
  Star: Star,
  ShoppingCart: ShoppingCart,
  Warning: Warning,
  Checked: Checked,
  User: User
}

const chatList = ref([
  {
    id: 1,
    name: '数码小达人',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20young%20man%20avatar%20portrait&image_size=square',
    lastMessage: '好的，那我们明天下午3点在地铁站见面交易吧',
    time: '刚刚',
    unread: 2,
    online: true,
    isProduct: true
  },
  {
    id: 2,
    name: '音乐发烧友',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20musician%20avatar%20portrait&image_size=square',
    lastMessage: '这个耳机还能再便宜点吗？',
    time: '10:30',
    unread: 1,
    online: false,
    isProduct: true
  },
  {
    id: 3,
    name: '程序猿小王',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nerdy%20programmer%20avatar%20portrait&image_size=square',
    lastMessage: '好的，我考虑一下再联系你',
    time: '昨天',
    unread: 0,
    online: true,
    isProduct: true
  },
  {
    id: 4,
    name: '官方客服',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20customer%20service%20avatar&image_size=square',
    lastMessage: '您的问题我们已收到，将在24小时内回复您',
    time: '3天前',
    unread: 0,
    online: false,
    isProduct: false
  }
])

const notifications = ref([
  {
    id: 1,
    type: 'favorite',
    icon: 'Heart',
    title: '有人收藏了你的商品',
    content: '用户"数码爱好者"收藏了你的商品「iPhone 14 Pro Max 256G」',
    time: '刚刚',
    read: false,
    product: {
      title: 'iPhone 14 Pro Max 256G 深空黑',
      price: 5999,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20smartphone%20product%20photo&image_size=square'
    }
  },
  {
    id: 2,
    type: 'like',
    icon: 'Star',
    title: '有人想要你的商品',
    content: '用户"手机控"点击了想要你的商品「Sony WH-1000XM4 无线降噪耳机」',
    time: '10分钟前',
    read: false,
    product: {
      title: 'Sony WH-1000XM4 无线降噪耳机 黑色',
      price: 1299,
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20headphones%20product%20photo&image_size=square'
    }
  },
  {
    id: 3,
    type: 'system',
    icon: 'Checked',
    title: '商品审核通过',
    content: '您发布的商品「MacBook Pro 14寸 M1 Pro」已通过审核，现在开始展示',
    time: '1小时前',
    read: true,
    product: null
  },
  {
    id: 4,
    type: 'warning',
    icon: 'Warning',
    title: '商品违规提醒',
    content: '您发布的商品存在违规内容，请尽快修改',
    time: '昨天',
    read: true,
    product: null
  }
])

const getNotificationBg = (type) => {
  const bgs = {
    favorite: 'bg-pink-100 dark:bg-pink-900/50',
    like: 'bg-orange-100 dark:bg-orange-900/50',
    system: 'bg-green-100 dark:bg-green-900/50',
    warning: 'bg-red-100 dark:bg-red-900/50'
  }
  return bgs[type] || 'bg-gray-100 dark:bg-gray-700'
}

const getNotificationColor = (type) => {
  const colors = {
    favorite: 'text-pink-500',
    like: 'text-orange-500',
    system: 'text-green-500',
    warning: 'text-red-500'
  }
  return colors[type] || 'text-gray-500'
}

const openChat = (chatId) => {
  ElMessage.info('打开聊天窗口')
}
</script>

<style scoped>
.message-view {
  padding-bottom: 80px;
}

:deep(.message-tabs .el-tabs__header) {
  margin: 0 0 16px 0;
}

:deep(.message-tabs .el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.message-tabs .el-tabs__item) {
  padding: 0 24px;
  height: 40px;
  line-height: 40px;
}
</style>
