<template>
  <div class="model-viewer-3d relative" ref="containerRef">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
    
    <div class="absolute top-2 right-2 flex gap-2">
      <button 
        class="glass px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all flex items-center gap-1"
        @click="toggleAutoRotate"
      >
        <el-icon v-if="autoRotate"><VideoPause /></el-icon>
        <el-icon v-else><VideoPlay /></el-icon>
        {{ autoRotate ? '暂停' : '自动旋转' }}
      </button>
      <button 
        class="glass px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all flex items-center gap-1"
        @click="resetCamera"
      >
        <el-icon><Refresh /></el-icon>
        重置
      </button>
    </div>

    <div class="absolute bottom-2 left-2 glass px-3 py-1.5 rounded-full text-xs text-gray-500 dark:text-gray-400">
      <span class="hidden sm:inline">拖拽旋转 · 滚轮缩放 · 双指缩放</span>
      <span class="sm:hidden">拖拽旋转 · 双指缩放</span>
    </div>

    <div class="absolute inset-0 flex items-center justify-center pointer-events-none" v-if="loading">
      <div class="loader w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VideoPlay, VideoPause, Refresh } from '@element-plus/icons-vue'

const props = defineProps({
  product: {
    type: Object,
    default: null
  },
  modelType: {
    type: String,
    default: 'phone'
  }
})

const containerRef = ref(null)
const canvasRef = ref(null)
const loading = ref(true)
const autoRotate = ref(true)

let scene, camera, renderer, controls
let productGroup
let animationId

const modelTypes = {
  phone: createPhoneModel,
  headphone: createHeadphoneModel,
  laptop: createLaptopModel,
  camera: createCameraModel,
  generic: createGenericModel
}

function createPhoneModel() {
  const group = new THREE.Group()
  
  const bodyGeo = new THREE.BoxGeometry(1.5, 2.8, 0.12)
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a1a,
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1
  })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  group.add(body)
  
  const screenGeo = new THREE.BoxGeometry(1.4, 2.7, 0.01)
  const screenMat = new THREE.MeshPhysicalMaterial({
    color: 0x111122,
    metalness: 0.3,
    roughness: 0.1
  })
  const screen = new THREE.Mesh(screenGeo, screenMat)
  screen.position.z = 0.07
  group.add(screen)
  
  const screenGlowGeo = new THREE.BoxGeometry(1.3, 2.5, 0.005)
  const screenGlowMat = new THREE.MeshBasicMaterial({
    color: 0x667eea,
    transparent: true,
    opacity: 0.3
  })
  const screenGlow = new THREE.Mesh(screenGlowGeo, screenGlowMat)
  screenGlow.position.z = 0.075
  group.add(screenGlow)
  
  const cameraGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16)
  const cameraMat = new THREE.MeshPhysicalMaterial({
    color: 0x333344,
    metalness: 0.9,
    roughness: 0.1
  })
  const camera1 = new THREE.Mesh(cameraGeo, cameraMat)
  camera1.rotation.x = Math.PI / 2
  camera1.position.set(-0.3, 1.25, 0.08)
  group.add(camera1)
  
  const camera2 = new THREE.Mesh(cameraGeo, cameraMat)
  camera2.rotation.x = Math.PI / 2
  camera2.position.set(0, 1.25, 0.08)
  group.add(camera2)
  
  const camera3 = new THREE.Mesh(cameraGeo, cameraMat)
  camera3.rotation.x = Math.PI / 2
  camera3.position.set(0.3, 1.25, 0.08)
  group.add(camera3)
  
  return group
}

function createHeadphoneModel() {
  const group = new THREE.Group()
  
  const bandGeo = new THREE.TorusGeometry(1.8, 0.08, 16, 32, Math.PI)
  const bandMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.6,
    roughness: 0.3
  })
  const band = new THREE.Mesh(bandGeo, bandMat)
  band.rotation.z = Math.PI
  band.position.y = 0.5
  group.add(band)
  
  for (let side = -1; side <= 1; side += 2) {
    const earGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32)
    const earMat = new THREE.MeshPhysicalMaterial({
      color: 0x222222,
      metalness: 0.7,
      roughness: 0.2
    })
    const ear = new THREE.Mesh(earGeo, earMat)
    ear.rotation.z = Math.PI / 2
    ear.position.set(side * 1.2, -0.3, 0)
    group.add(ear)
    
    const cushionGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.15, 32)
    const cushionMat = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      metalness: 0.1,
      roughness: 0.8
    })
    const cushion = new THREE.Mesh(cushionGeo, cushionMat)
    cushion.rotation.z = Math.PI / 2
    cushion.position.set(side * 1.5, -0.3, 0)
    group.add(cushion)
    
    const logoGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.02, 32)
    const logoMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.3
    })
    const logo = new THREE.Mesh(logoGeo, logoMat)
    logo.rotation.z = Math.PI / 2
    logo.position.set(side * 1.1, -0.3, 0)
    group.add(logo)
  }
  
  return group
}

function createLaptopModel() {
  const group = new THREE.Group()
  
  const baseGeo = new THREE.BoxGeometry(3, 2, 0.15)
  const baseMat = new THREE.MeshPhysicalMaterial({
    color: 0x222222,
    metalness: 0.8,
    roughness: 0.3
  })
  const base = new THREE.Mesh(baseGeo, baseMat)
  base.position.y = -0.075
  group.add(base)
  
  const keyboardGeo = new THREE.BoxGeometry(2.8, 1.8, 0.02)
  const keyboardMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.6,
    roughness: 0.4
  })
  const keyboard = new THREE.Mesh(keyboardGeo, keyboardMat)
  keyboard.position.set(0, 0.01, 0)
  group.add(keyboard)
  
  const screenGeo = new THREE.BoxGeometry(2.8, 1.8, 0.05)
  const screenMat = new THREE.MeshPhysicalMaterial({
    color: 0x222222,
    metalness: 0.7,
    roughness: 0.3
  })
  const screen = new THREE.Mesh(screenGeo, screenMat)
  screen.position.set(0, 0.9, -1.5)
  screen.rotation.x = -Math.PI / 4
  group.add(screen)
  
  const displayGeo = new THREE.BoxGeometry(2.6, 1.6, 0.01)
  const displayMat = new THREE.MeshBasicMaterial({
    color: 0x1a1a3e,
    transparent: true,
    opacity: 0.9
  })
  const display = new THREE.Mesh(displayGeo, displayMat)
  display.position.set(0, 0.9, -1.52)
  display.rotation.x = -Math.PI / 4
  group.add(display)
  
  return group
}

function createCameraModel() {
  const group = new THREE.Group()
  
  const bodyGeo = new THREE.BoxGeometry(1.8, 1.4, 1.2)
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.7,
    roughness: 0.3
  })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  group.add(body)
  
  const lensGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 32)
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0x222222,
    metalness: 0.8,
    roughness: 0.2
  })
  const lens = new THREE.Mesh(lensGeo, lensMat)
  lens.rotation.x = Math.PI / 2
  lens.position.set(0, 0, 0.9)
  group.add(lens)
  
  const glassGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 32)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x112244,
    metalness: 0.1,
    roughness: 0.1,
    transparent: true,
    opacity: 0.8
  })
  const glass = new THREE.Mesh(glassGeo, glassMat)
  glass.rotation.x = Math.PI / 2
  glass.position.set(0, 0, 1.33)
  group.add(glass)
  
  const topGeo = new THREE.BoxGeometry(0.4, 0.15, 0.6)
  const topMat = new THREE.MeshPhysicalMaterial({
    color: 0x333333,
    metalness: 0.6,
    roughness: 0.4
  })
  const top = new THREE.Mesh(topGeo, topMat)
  top.position.set(0, 0.775, -0.2)
  group.add(top)
  
  const flashGeo = new THREE.BoxGeometry(0.3, 0.1, 0.2)
  const flashMat = new THREE.MeshBasicMaterial({
    color: 0xffffee
  })
  const flash = new THREE.Mesh(flashGeo, flashMat)
  flash.position.set(-0.6, 0.55, -0.4)
  group.add(flash)
  
  return group
}

function createGenericModel() {
  const group = new THREE.Group()
  
  const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const boxMat = new THREE.MeshPhysicalMaterial({
    color: 0x667eea,
    metalness: 0.3,
    roughness: 0.4
  })
  const box = new THREE.Mesh(boxGeo, boxMat)
  group.add(box)
  
  const sphereGeo = new THREE.SphereGeometry(0.6, 32, 32)
  const sphereMat = new THREE.MeshPhysicalMaterial({
    color: 0x764ba2,
    metalness: 0.5,
    roughness: 0.2
  })
  const sphere = new THREE.Mesh(sphereGeo, sphereMat)
  sphere.position.set(0.8, 0.8, 0.8)
  group.add(sphere)
  
  const torusGeo = new THREE.TorusGeometry(0.5, 0.1, 16, 32)
  const torusMat = new THREE.MeshPhysicalMaterial({
    color: 0xf093fb,
    metalness: 0.4,
    roughness: 0.3
  })
  const torus = new THREE.Mesh(torusGeo, torusMat)
  torus.position.set(-0.6, -0.6, 0)
  torus.rotation.x = Math.PI / 4
  group.add(torus)
  
  return group
}

function initScene() {
  if (!containerRef.value || !canvasRef.value) return
  
  const container = containerRef.value
  const canvas = canvasRef.value
  
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf8fafc)
  
  const aspect = container.clientWidth / container.clientHeight
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
  camera.position.set(4, 3, 5)
  
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enableZoom = true
  controls.enablePan = false
  controls.minDistance = 3
  controls.maxDistance = 10
  controls.autoRotate = autoRotate.value
  controls.autoRotateSpeed = 2
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  scene.add(directionalLight)
  
  const fillLight = new THREE.DirectionalLight(0x764ba2, 0.3)
  fillLight.position.set(-5, 5, -5)
  scene.add(fillLight)
  
  const rimLight = new THREE.DirectionalLight(0x667eea, 0.4)
  rimLight.position.set(0, 5, -10)
  scene.add(rimLight)
  
  const modelCreator = modelTypes[props.modelType] || modelTypes.generic
  productGroup = modelCreator()
  productGroup.position.y = 0
  productGroup.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  scene.add(productGroup)
  
  const floorGeo = new THREE.CircleGeometry(5, 64)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.5
  floor.receiveShadow = true
  scene.add(floor)
  
  loading.value = false
  
  animate()
}

function animate() {
  animationId = requestAnimationFrame(animate)
  
  if (productGroup) {
    productGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1
  }
  
  controls.update()
  renderer.render(scene, camera)
}

function handleResize() {
  if (!containerRef.value || !camera || !renderer) return
  
  const container = containerRef.value
  const aspect = container.clientWidth / container.clientHeight
  
  camera.aspect = aspect
  camera.updateProjectionMatrix()
  
  renderer.setSize(container.clientWidth, container.clientHeight)
}

function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value
  if (controls) {
    controls.autoRotate = autoRotate.value
  }
}

function resetCamera() {
  if (controls) {
    controls.reset()
  }
}

watch(() => props.modelType, () => {
  if (productGroup && scene) {
    scene.remove(productGroup)
    const modelCreator = modelTypes[props.modelType] || modelTypes.generic
    productGroup = modelCreator()
    productGroup.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    scene.add(productGroup)
  }
})

watch(autoRotate, (val) => {
  if (controls) {
    controls.autoRotate = val
  }
})

onMounted(() => {
  initScene()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.model-viewer-3d {
  width: 100%;
  height: 300px;
  min-height: 300px;
  border-radius: 1rem;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

:deep(.dark .model-viewer-3d) {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

canvas {
  display: block;
  touch-action: none;
}

.loader {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
