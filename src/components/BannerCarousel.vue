<template>
  <div class="banner-carousel relative overflow-hidden rounded-2xl mx-4 my-4">
    <el-carousel 
      height="180px" 
      :autoplay="true" 
      :interval="4000"
      :arrow="isMobile ? 'never' : 'hover'"
      indicator-position="outside"
    >
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <div class="relative w-full h-full overflow-hidden">
          <img 
            :src="banner.image" 
            :alt="banner.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          <div class="absolute bottom-4 left-4 text-white">
            <h3 class="text-xl font-bold mb-1">{{ banner.title }}</h3>
            <p class="text-sm opacity-80">{{ banner.subtitle }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useProductStore } from '@/stores/product'

const productStore = useProductStore()
const banners = ref(productStore.bannerData)
const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.banner-carousel {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

:deep(.el-carousel__indicator) {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  width: 8px;
  height: 8px;
  transition: all 0.3s ease;
}

:deep(.el-carousel__indicator.is-active) {
  background-color: white;
  width: 20px;
}

:deep(.el-carousel__indicators) {
  bottom: 12px;
}

:deep(.el-carousel__arrow) {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  transition: all 0.3s ease;
}

:deep(.el-carousel__arrow:hover) {
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
