<template>
  <div class="publish-want-buy-view min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <header class="fixed top-0 left-0 right-0 z-50 pt-safe">
      <div class="glass px-4 py-3 flex items-center justify-between">
        <button 
        class="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
        @click="goBack"
      >
        <el-icon class="text-xl"><ArrowLeft /></el-icon>
      </button>
      <h1 class="font-bold text-lg text-gray-800 dark:text-white">发布求购</h1>
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
        <h3 class="font-medium text-gray-800 dark:text-white mb-4">求购信息</h3>
        
        <el-form-item label="想要的商品" prop="title" class="mb-4">
          <el-input 
            v-model="form.title" 
            placeholder="请输入您想要的商品名称（如：iPhone 13 Pro"
            :maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
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
        
        <el-form-item label="心理价位" prop="maxPrice" class="mb-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 flex-1">
              <span class="text-red-500 font-medium">¥</span>
              <el-input-number 
                v-model="form.maxPrice" 
                :min="0"
                :precision="0"
                placeholder="0"
                class="w-full"
              />
            </div>
            <span class="text-gray-500 dark:text-gray-400 text-sm">元以内</span>
          </div>
        </el-form-item>
        
        <el-form-item label="是否急购" class="mb-4">
          <div class="flex items-center gap-4">
            <label 
              class="flex items-center gap-2 cursor-pointer"
              @click="form.urgent = true"
            >
              <el-radio :model-value="form.urgent" :value="true" />
              <span class="text-gray-700 dark:text-gray-300">急购（会加急推送给卖家）</span>
            </label>
            <label 
              class="flex items-center gap-2 cursor-pointer"
              @click="form.urgent = false"
            >
              <el-radio :model-value="form.urgent" :value="false" />
              <span class="text-gray-700 dark:text-gray-300">普通求购</span>
            </label>
          </div>
        </el-form-item>
      </div>
      
      <div class="glass-card p-4">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3">详细描述</h3>
        <el-form-item prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea"
            :rows="5"
            placeholder="请详细描述您的需求，如：想要的具体型号、颜色偏好、成色要求、交易方式等，描述越详细越容易找到合适的卖家哦~"
            :maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </div>
      
      <div class="glass-card p-4">
        <h3 class="font-medium text-gray-800 dark:text-white mb-3">联系方式</h3>
        
        <el-form-item label="所在地区" prop="location" class="mb-4">
          <el-input 
            v-model="form.location" 
            placeholder="请输入您的所在地区"
            clearable
          >
            <template #prefix>
              <el-icon class="text-gray-400"><Location /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="交易方式" prop="tradeMethods" class="mb-4">
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
        class="flex-1 py-3 rounded-xl gradient-bg text-white font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
        @click="submitForm"
      >
        发布求购
      </button>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { 
  ArrowLeft, Location, Document, User 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const productStore = useProductStore()

const formRef = ref(null)

const categories = computed(() => productStore.categories)
const tradeMethods = computed(() => productStore.tradeMethods)

const tradeIcons = {
  Location: Location,
  Document: Document,
  User: User
}

const form = reactive({
  title: '',
  categoryId: null,
  maxPrice: null,
  urgent: false,
  description: '',
  location: '北京市朝阳区',
  tradeMethods: ['self']
})

const rules = {
  title: [
    { required: true, message: '请输入想要的商品名称', trigger: 'blur' },
    { min: 3, max: 50, message: '名称长度在 3-50 个字符之间', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  maxPrice: [
    { required: true, message: '请输入心理价位', trigger: 'blur' },
    { type: 'number', min: 1, message: '价位必须大于 0', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入需求描述', trigger: 'blur' },
    { min: 10, message: '描述至少 10 个字符', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入所在地区', trigger: 'blur' }
  ]
}

const goBack = () => {
  router.back()
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
    form.title = ''
    form.categoryId = null
    form.maxPrice = null
    form.urgent = false
    form.description = ''
    form.location = '北京市朝阳区'
    form.tradeMethods = ['self']
    ElMessage.success('表单已重置')
  }).catch(() => {})
}

const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    ElMessageBox.confirm('确定要发布此求购信息吗？', '发布确认', {
      confirmButtonText: '立即发布',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      ElMessage.success('发布成功！')
      setTimeout(() => {
        router.push('/want-buy')
      }, 1500)
    }).catch(() => {})
  } catch (error) {
    console.log('表单验证失败', error)
  }
}
</script>

<style scoped>
.publish-want-buy-view {
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
