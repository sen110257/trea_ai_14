<template>
  <div class="publish-view min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <header class="fixed top-0 left-0 right-0 z-50 pt-safe">
      <div class="glass px-4 py-3 flex items-center justify-between">
        <button 
        class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
        @click="goBack"
      >
        <el-icon class="text-xl"><ArrowLeft /></el-icon>
      </button>
      <h1 class="font-bold text-lg text-gray-800 dark:text-white">发布闲置</h1>
      <div class="w-10"></div>
    </div>
  </header>
  
  <main class="pt-16">
    <el-form 
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="px-4 py-4 space-y-4"
    >
      <div class="glass-card p-4">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3">商品图片</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">最多上传9张图片，第一张将作为商品主图</p>
        
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          <div 
            v-for="(image, index) in form.images" 
            :key="index"
            class="relative aspect-square rounded-xl overflow-hidden group"
          >
            <img 
              :src="image" 
              :alt="`图片 ${index + 1}`"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button 
                class="p-2 bg-white/90 rounded-full shadow-lg transition-all hover:scale-110"
                @click="removeImage(index)"
              >
                <el-icon class="text-red-500"><Delete /></el-icon>
              </button>
            </div>
            <div v-if="index === 0" class="absolute top-1 left-1 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
              主图
            </div>
          </div>
          
          <div 
            v-if="form.images.length < 9"
            class="upload-btn aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all"
            @click="addImage"
          >
            <el-icon class="text-3xl text-gray-400"><Plus /></el-icon>
            <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">添加图片</span>
          </div>
        </div>
      </div>
      
      <div class="glass-card p-4">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3">基本信息</h3>
        
        <el-form-item label="所属分类" prop="categoryId" class="mb-4">
          <el-select 
            v-model="form.categoryId" 
            placeholder="请选择分类"
            class="w-full"
          >
            <el-option 
              v-for="category in categories" 
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="商品标题" prop="title" class="mb-4">
          <el-input 
            v-model="form.title" 
            placeholder="请输入商品标题（如：iPhone 14 Pro Max 256G"
            :maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="售价" prop="price" class="mb-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 flex-1">
              <span class="text-red-500 font-medium">¥</span>
              <el-input-number 
                v-model="form.price" 
                :min="0"
                :precision="0"
                placeholder="0"
                class="w-full"
              />
            </div>
            <span class="text-gray-500 dark:text-gray-400 text-sm">元</span>
          </div>
        </el-form-item>
        
        <el-form-item label="原价（可选）" class="mb-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 flex-1">
              <span class="text-gray-400 font-medium">¥</span>
              <el-input-number 
                v-model="form.originalPrice" 
                :min="0"
                :precision="0"
                placeholder="原价"
                class="w-full"
              />
            </div>
            <span class="text-gray-500 dark:text-gray-400 text-sm">元</span>
          </div>
        </el-form-item>
        
        <el-form-item label="商品成色" prop="condition" class="mb-4">
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="c in conditionTypes" 
              :key="c.value"
              class="px-4 py-2 rounded-xl border transition-all text-sm font-medium"
              :class="[
                form.condition === c.value 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
              ]"
              @click="form.condition = c.value"
            >
              {{ c.label }}
            </button>
          </div>
        </el-form-item>
      </div>
      
      <div class="glass-card p-4">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3">详细描述</h3>
        <el-form-item prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea"
            :rows="6"
            placeholder="请详细描述商品的使用情况、转让原因等，帮助买家更详细越容易成交哦~"
            :maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </div>
      
      <div class="glass-card p-4">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3">交易方式</h3>
        <el-form-item prop="tradeMethods">
          <div class="flex flex-wrap gap-3">
            <label 
              v-for="method in tradeMethods" 
              :key="method.value"
              class="flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all"
              :class="[
                form.tradeMethods.includes(method.value) 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
              ]"
            >
              <el-checkbox 
                :value="form.tradeMethods.includes(method.value)" 
                @change="toggleTradeMethod(method.value)"
              />
              <el-icon><component :is="tradeIcons[method.icon]" /></el-icon>
              <span>{{ method.label }}</span>
            </label>
          </div>
        </el-form-item>
        
        <el-form-item label="同城位置" prop="location" v-if="form.tradeMethods.includes('self') || form.tradeMethods.includes('face')">
          <el-input 
            v-model="form.location" 
            placeholder="请输入您的位置，方便买家自提更方便"
            clearable
          >
            <template #prefix>
              <el-icon class="text-gray-400"><Location /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
  </main>
  
  <div class="fixed bottom-0 left-0 right-0 z-50 pb-safe">
    <div class="glass px-4 py-3 flex items-center gap-3">
      <button 
        class="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
        @click="resetForm"
      >
        重置
      </button>
      <button 
        class="flex-1 py-3 rounded-xl border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
        @click="previewForm"
      >
        预览草稿
      </button>
      <button 
        class="flex-1 py-3 rounded-xl gradient-bg text-white font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
        @click="submitForm"
      >
        立即发布
      </button>
    </div>
  </div>
  
  <el-dialog 
    v-model="showPreview" 
    title="预览草稿"
    width="90%"
    :show-close="true"
  >
    <div class="p-4">
      <div class="grid grid-cols-3 gap-2 mb-4">
        <div 
          v-for="(image, index) in form.images" 
          :key="index"
          class="aspect-square rounded-lg overflow-hidden"
        >
          <img :src="image" class="w-full h-full object-cover" />
        </div>
      </div>
      
      <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">{{ form.title || '未填写标题' }}</h3>
      <div class="flex items-baseline gap-2 mb-3">
        <span class="text-2xl font-bold text-red-500">¥{{ form.price || 0 }}</span>
        <span v-if="form.originalPrice" class="text-sm text-gray-400 line-through">原价 ¥{{ form.originalPrice }}</span>
      </div>
      <p class="text-gray-600 dark:text-gray-300">{{ form.description || '未填写描述' }}</p>
    </div>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { 
  ArrowLeft, Plus, Delete, Location, Document, User 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const productStore = useProductStore()

const formRef = ref(null)
const showPreview = ref(false)

const categories = computed(() => productStore.categories)
const conditionTypes = computed(() => productStore.conditionTypes)
const tradeMethods = computed(() => productStore.tradeMethods)

const tradeIcons = {
  Location: Location,
  Document: Document,
  User: User
}

const form = reactive({
  images: [
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20smartphone%20product%20photo&image_size=square_hd'
  ],
  categoryId: null,
  title: '',
  price: null,
  originalPrice: null,
  condition: '90',
  description: '',
  tradeMethods: ['self'],
  location: '北京市朝阳区'
})

const rules = {
  images: [
    { required: true, message: '请至少上传一张商品图片', trigger: 'change' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入商品标题', trigger: 'blur' },
    { min: 5, max: 50, message: '标题长度在 5-50 个字符之间', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入售价', trigger: 'blur' },
    { type: 'number', min: 1, message: '售价必须大于 0', trigger: 'blur' }
  ],
  condition: [
    { required: true, message: '请选择商品成色', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 10, message: '描述至少 10 个字符', trigger: 'blur' }
  ]
}

const goBack = () => {
  router.back()
}

const addImage = () => {
  if (form.images.length >= 9) {
    ElMessage.warning('最多只能上传 9 张图片')
    return
  }
  
  const sampleImages = [
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20headphones%20product%20photo&image_size=square_hd',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laptop%20computer%20product%20photo&image_size=square_hd',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=camera%20photography%20equipment%20photo&image_size=square_hd'
  ]
  
  const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)]
  form.images.push(randomImage)
}

const removeImage = (index) => {
  form.images.splice(index, 1)
}

const toggleTradeMethod = (value) => {
  const index = form.tradeMethods.indexOf(value)
  if (index > -1) {
    form.tradeMethods.splice(index, 1)
  } else {
    form.tradeMethods.push(value)
  }
}

const resetForm = () => {
  ElMessageBox.confirm('确定要重置表单吗？所有已填写的内容将被清空。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.images = []
    form.categoryId = null
    form.title = ''
    form.price = null
    form.originalPrice = null
    form.condition = '90'
    form.description = ''
    form.tradeMethods = ['self']
    form.location = '北京市朝阳区'
    ElMessage.success('表单已重置')
  }).catch(() => {})
}

const previewForm = () => {
  showPreview.value = true
}

const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    ElMessageBox.confirm('确定要发布此商品吗？', '发布确认', {
      confirmButtonText: '立即发布',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      const newProduct = productStore.addProduct({
        title: form.title,
        price: form.price,
        originalPrice: form.originalPrice || form.price,
        condition: form.condition,
        categoryId: form.categoryId,
        images: form.images,
        description: form.description,
        tradeMethods: form.tradeMethods,
        location: form.location
      })
      
      if (newProduct) {
        ElMessage.success('发布成功！商品已上架')
        setTimeout(() => {
          router.push('/profile')
        }, 1500)
      } else {
        ElMessage.error('发布失败，请重试')
      }
    }).catch(() => {})
  } catch (error) {
    console.log('表单验证失败', error)
  }
}
</script>

<style scoped>
.publish-view {
  padding-bottom: 80px;
}

:deep(.el-form-item__label) {
  color: inherit;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
