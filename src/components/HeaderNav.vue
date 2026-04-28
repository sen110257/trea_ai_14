<template>
  <header class="header-nav pt-safe sticky top-0 z-50">
    <div class="glass px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
            <span class="text-white font-bold text-sm">闲</span>
          </div>
          <span class="font-bold text-lg gradient-text hidden sm:block">闲品</span>
        </router-link>
      </div>

      <div class="flex-1 mx-4 max-w-xl">
        <div 
          class="search-box flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30 cursor-pointer transition-all hover:bg-white/80 dark:hover:bg-gray-800/80"
          @click="goToSearch"
        >
          <el-icon class="text-gray-400"><Search /></el-icon>
          <input 
            type="text" 
            placeholder="搜索闲置商品..." 
            class="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400"
            @click.stop="goToSearch"
            readonly
          />
          <div class="flex items-center gap-1 text-xs text-gray-500">
            <el-icon><Location /></el-icon>
            <span class="hidden sm:inline">北京</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button 
          class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
          @click="toggleTheme"
        >
          <el-icon class="text-xl">
            <Sunny v-if="!isDark" />
            <Moon v-else />
          </el-icon>
        </button>
        <router-link 
          to="/message" 
          class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all relative"
        >
          <el-icon class="text-xl"><Bell /></el-icon>
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { Search, Sunny, Moon, Bell, Location } from '@element-plus/icons-vue'

const router = useRouter()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const goToSearch = () => {
  router.push('/products')
}
</script>

<style scoped>
.header-nav {
  backdrop-filter: blur(0);
}

.search-box {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
