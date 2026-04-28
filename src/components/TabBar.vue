<template>
  <nav class="tab-bar fixed bottom-0 left-0 right-0 z-50 pb-safe">
    <div class="glass flex items-center justify-around py-2 px-2">
      <router-link 
        v-for="item in tabs" 
        :key="item.path"
        :to="item.path"
        class="tab-item flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all"
        :class="{ active: isActive(item.path) }"
      >
        <div class="relative">
          <el-icon class="text-xl" :class="{ 'text-primary-500': isActive(item.path), 'text-gray-500 dark:text-gray-400': !isActive(item.path) }">
            <component :is="item.icon" />
          </el-icon>
          <span 
            v-if="item.badge" 
            class="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1"
          >
            {{ item.badge }}
          </span>
        </div>
        <span class="text-xs mt-0.5" :class="{ 'text-primary-500 font-medium': isActive(item.path), 'text-gray-500 dark:text-gray-400': !isActive(item.path) }">
          {{ item.name }}
        </span>
      </router-link>
      
      <div 
        class="publish-btn flex flex-col items-center justify-center"
        @click="goPublish"
      >
        <div class="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 -mt-4">
          <el-icon class="text-white text-2xl"><Plus /></el-icon>
        </div>
        <span class="text-xs mt-0.5 text-gray-500 dark:text-gray-400">发布</span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { House, Grid, Bell, User, Plus } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const tabs = [
  { path: '/', name: '首页', icon: House },
  { path: '/category', name: '分类', icon: Grid },
  { path: '/message', name: '消息', icon: Bell, badge: 3 },
  { path: '/profile', name: '我的', icon: User }
]

const isActive = (path) => {
  return route.path === path
}

const goPublish = () => {
  router.push('/publish')
}
</script>

<style scoped>
.tab-bar {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.tab-item {
  min-width: 60px;
  transition: all 0.3s ease;
}

.tab-item:active {
  transform: scale(0.95);
}

.publish-btn {
  cursor: pointer;
  min-width: 60px;
}
</style>
