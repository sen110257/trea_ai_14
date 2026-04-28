import { reactive, computed } from 'vue'

const categories = [
  { id: 1, name: '数码电子', icon: 'Monitor', color: 'from-blue-400 to-cyan-400' },
  { id: 2, name: '家居家具', icon: 'House', color: 'from-amber-400 to-orange-400' },
  { id: 3, name: '服饰鞋包', icon: 'ShoppingBag', color: 'from-pink-400 to-rose-400' },
  { id: 4, name: '美妆护肤', icon: 'MagicStick', color: 'from-purple-400 to-violet-400' },
  { id: 5, name: '母婴用品', icon: 'Cpu', color: 'from-green-400 to-emerald-400' },
  { id: 6, name: '书籍文具', icon: 'Reading', color: 'from-teal-400 to-cyan-400' },
  { id: 7, name: '代步机车', icon: 'Van', color: 'from-gray-400 to-slate-400' },
  { id: 8, name: '运动户外', icon: 'Dishwasher', color: 'from-red-400 to-orange-400' }
]

const conditionTypes = [
  { value: 'new', label: '全新', class: 'condition-new' },
  { value: '99', label: '99新', class: 'condition-99' },
  { value: '95', label: '95新', class: 'condition-95' },
  { value: '90', label: '9成新', class: 'condition-90' },
  { value: '80', label: '8成新', class: 'condition-80' },
  { value: '70', label: '7成新及以下', class: 'condition-70' }
]

const tradeMethods = [
  { value: 'self', label: '同城自提', icon: 'Location' },
  { value: 'express', label: '快递邮寄', icon: 'Document' },
  { value: 'face', label: '当面交易', icon: 'User' }
]

const generateImages = (seed, count = 3) => {
  const images = []
  const prompts = [
    'modern minimalist smart phone tech product',
    'premium wireless headphones audio device',
    'elegant laptop computer workspace',
    'vintage classic camera photography equipment',
    'luxury wristwatch accessory',
    'stylish electric scooter urban transport',
    'comfortable sofa furniture interior',
    'high-end camera lens professional'
  ]
  for (let i = 0; i < count; i++) {
    const prompt = prompts[(seed + i) % prompts.length]
    images.push(`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square_hd`)
  }
  return images
}

const products = reactive([
  {
    id: 1,
    title: 'iPhone 14 Pro Max 256G 深空黑',
    price: 5999,
    originalPrice: 8999,
    condition: '99',
    category: 1,
    images: generateImages(0, 5),
    description: '自用 iPhone 14 Pro Max，256G 深空黑色，使用不到半年，电池健康度 95%，无磕碰无划痕，配件齐全，包装盒在。因为换了新手机所以闲置出售，价格可小刀，同城自提优先。',
    specs: [
      { name: '容量', value: '256GB' },
      { name: '颜色', value: '深空黑' },
      { name: '网络', value: '全网通 5G' },
      { name: '电池健康', value: '95%' }
    ],
    seller: {
      id: 101,
      nickname: '数码小达人',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20young%20man%20avatar%20portrait%20warm%20smile&image_size=square',
      location: '北京市海淀区',
      rating: 4.9,
      verified: true
    },
    location: '北京市海淀区中关村',
    distance: 2.5,
    publishTime: '2024-01-15',
    views: 1256,
    likes: 89,
    favorites: 45,
    tags: ['超值', '急出'],
    has3D: true,
    tradeMethods: ['self', 'express']
  },
  {
    id: 2,
    title: 'Sony WH-1000XM4 无线降噪耳机 黑色',
    price: 1299,
    originalPrice: 2499,
    condition: '95',
    category: 1,
    images: generateImages(1, 4),
    description: 'Sony 顶级降噪耳机，音质出色，降噪效果一流。使用一年左右，保养良好，无明显划痕。耳罩海绵有轻微使用痕迹，不影响使用。配件齐全，充电线、音频线都在。',
    specs: [
      { name: '型号', value: 'WH-1000XM4' },
      { name: '颜色', value: '黑色' },
      { name: '续航', value: '30小时' },
      { name: '连接', value: '蓝牙 5.0' }
    ],
    seller: {
      id: 102,
      nickname: '音乐发烧友',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20musician%20avatar%20portrait%20cool%20style&image_size=square',
      location: '上海市浦东新区',
      rating: 4.8,
      verified: true
    },
    location: '上海市浦东新区陆家嘴',
    distance: 5.2,
    publishTime: '2024-01-18',
    views: 856,
    likes: 56,
    favorites: 23,
    tags: ['自提'],
    has3D: true,
    tradeMethods: ['self', 'express', 'face']
  },
  {
    id: 3,
    title: 'MacBook Pro 14寸 M1 Pro 16G/512G',
    price: 8999,
    originalPrice: 14999,
    condition: '90',
    category: 1,
    images: generateImages(2, 5),
    description: '2021 款 MacBook Pro 14 英寸，M1 Pro 芯片，16GB 内存，512GB 固态硬盘。办公利器，性能强劲。边角有轻微磕碰，屏幕完美无划痕。适合程序员、设计师使用。',
    specs: [
      { name: '处理器', value: 'M1 Pro' },
      { name: '内存', value: '16GB' },
      { name: '存储', value: '512GB SSD' },
      { name: '屏幕', value: '14英寸 Liquid Retina XDR' }
    ],
    seller: {
      id: 103,
      nickname: '程序猿小王',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nerdy%20programmer%20avatar%20portrait%20glasses%20friendly&image_size=square',
      location: '杭州市西湖区',
      rating: 4.7,
      verified: false
    },
    location: '杭州市西湖区文三路',
    distance: 8.3,
    publishTime: '2024-01-20',
    views: 2341,
    likes: 167,
    favorites: 89,
    tags: ['超值'],
    has3D: true,
    tradeMethods: ['self', 'express']
  },
  {
    id: 4,
    title: '北欧简约风格布艺沙发 三人座',
    price: 1599,
    originalPrice: 3999,
    condition: '95',
    category: 2,
    images: generateImages(6, 4),
    description: '北欧简约风格布艺三人沙发，深灰色可拆洗布艺，实木框架，高弹海绵填充。使用一年多，因为搬家放不下所以出售。沙发很新，没有污渍破损，自提需要找货车。',
    specs: [
      { name: '尺寸', value: '210×95×85cm' },
      { name: '材质', value: '棉麻布艺 + 实木框架' },
      { name: '颜色', value: '深灰色' },
      { name: '风格', value: '北欧简约' }
    ],
    seller: {
      id: 104,
      nickname: '家居控小美',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20interior%20designer%20avatar%20portrait&image_size=square',
      location: '广州市天河区',
      rating: 4.9,
      verified: true
    },
    location: '广州市天河区珠江新城',
    distance: 3.1,
    publishTime: '2024-01-12',
    views: 567,
    likes: 34,
    favorites: 12,
    tags: ['自提', '急出'],
    has3D: false,
    tradeMethods: ['self']
  },
  {
    id: 5,
    title: 'Nike Air Jordan 1 黑红配色 US10',
    price: 899,
    originalPrice: 1499,
    condition: '90',
    category: 3,
    images: generateImages(3, 4),
    description: 'Air Jordan 1 经典黑红配色，US10 码（44码）。穿过几次，鞋底有轻微磨损，鞋面保养良好。正品购买，支持鉴定。因为脚型不太合适所以出售。',
    specs: [
      { name: '品牌', value: 'Nike Air Jordan' },
      { name: '型号', value: 'Air Jordan 1 Retro High' },
      { name: '尺码', value: 'US10 / 44码' },
      { name: '配色', value: '黑红 Bred' }
    ],
    seller: {
      id: 105,
      nickname: 'Sneaker控',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=trendy%20sneaker%20collector%20avatar%20portrait%20young&image_size=square',
      location: '深圳市南山区',
      rating: 4.8,
      verified: true
    },
    location: '深圳市南山区科技园',
    distance: 1.8,
    publishTime: '2024-01-22',
    views: 789,
    likes: 67,
    favorites: 28,
    tags: ['超值'],
    has3D: false,
    tradeMethods: ['self', 'express']
  },
  {
    id: 6,
    title: 'Leica Q2 全画幅便携相机',
    price: 28999,
    originalPrice: 42000,
    condition: '99',
    category: 1,
    images: generateImages(3, 5),
    description: '徕卡 Q2 全画幅便携相机，4730万像素，28mm f/1.7 定焦镜头。购买不到一年，快门次数不足 5000，几乎全新。配件齐全，包装盒、保修卡都在。因为想换 M 系统所以出售。',
    specs: [
      { name: '型号', value: 'Leica Q2' },
      { name: '传感器', value: '4730万像素全画幅 CMOS' },
      { name: '镜头', value: 'Summilux 28mm f/1.7 ASPH' },
      { name: '快门次数', value: '4820次' }
    ],
    seller: {
      id: 106,
      nickname: '徕卡玩家',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20photographer%20avatar%20portrait%20artistic&image_size=square',
      location: '北京市朝阳区',
      rating: 5.0,
      verified: true
    },
    location: '北京市朝阳区三里屯',
    distance: 4.5,
    publishTime: '2024-01-08',
    views: 1567,
    likes: 123,
    favorites: 67,
    tags: [],
    has3D: true,
    tradeMethods: ['self', 'face']
  },
  {
    id: 7,
    title: '小米九号平衡车 Pro',
    price: 1899,
    originalPrice: 3499,
    condition: '90',
    category: 7,
    images: generateImages(5, 4),
    description: '小米九号平衡车 Pro，续航约 35km，最高时速 18km/h。购买一年多，使用不多，里程约 500km。有轻微使用痕迹，功能完好。适合短途代步、公园遛弯。',
    specs: [
      { name: '型号', value: '九号平衡车 Pro' },
      { name: '续航', value: '约 35km' },
      { name: '最高时速', value: '18km/h' },
      { name: '载重', value: '100kg' }
    ],
    seller: {
      id: 107,
      nickname: '科技玩家',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tech%20gadget%20enthusiast%20avatar%20portrait%20casual&image_size=square',
      location: '成都市武侯区',
      rating: 4.6,
      verified: false
    },
    location: '成都市武侯区天府大道',
    distance: 6.2,
    publishTime: '2024-01-25',
    views: 432,
    likes: 23,
    favorites: 8,
    tags: ['急出'],
    has3D: false,
    tradeMethods: ['self']
  },
  {
    id: 8,
    title: 'SK-II 神仙水 230ml 全新未拆封',
    price: 1099,
    originalPrice: 1590,
    condition: 'new',
    category: 4,
    images: generateImages(4, 3),
    description: 'SK-II 神仙水 230ml，全新未拆封，保质期到 2026 年。朋友赠送，自己不用这个牌子所以出售。正品保证，支持专柜验货。价格不刀，非诚勿扰。',
    specs: [
      { name: '品牌', value: 'SK-II' },
      { name: '产品', value: '护肤精华露（神仙水）' },
      { name: '容量', value: '230ml' },
      { name: '保质期', value: '2026年12月' }
    ],
    seller: {
      id: 108,
      nickname: '美妆小铺',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beauty%20skincare%20specialist%20avatar%20portrait%20elegant&image_size=square',
      location: '南京市鼓楼区',
      rating: 4.9,
      verified: true
    },
    location: '南京市鼓楼区新街口',
    distance: 2.3,
    publishTime: '2024-01-28',
    views: 321,
    likes: 45,
    favorites: 15,
    tags: ['全新', '超值'],
    has3D: false,
    tradeMethods: ['self', 'express']
  }
])

const wantBuys = reactive([
  {
    id: 1,
    title: '收一台 iPhone 13 Pro 256G',
    maxPrice: 4000,
    description: '收一台自用 iPhone 13 Pro，256G 优先，颜色无所谓。要求无拆无修，功能完好，电池健康度 85% 以上。成色 95 新以上最好，价格可以商量，同城可以面交。',
    category: 1,
    location: '北京市朝阳区',
    publisher: {
      id: 201,
      nickname: '刚需用户',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=casual%20user%20avatar%20portrait%20friendly%20smile&image_size=square'
    },
    publishTime: '2024-01-28',
    views: 234,
    contacts: 12
  },
  {
    id: 2,
    title: '求购一台便携相机 预算 3000 内',
    maxPrice: 3000,
    description: '想买一台便携相机用来扫街，预算 3000 以内。可以考虑卡片机或者微单，要求画质好、便携。品牌不限，索尼、富士、松下都可以。有闲置的小伙伴联系我吧！',
    category: 1,
    location: '上海市徐汇区',
    publisher: {
      id: 202,
      nickname: '摄影新手',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=amateur%20photographer%20avatar%20portrait%20enthusiastic&image_size=square'
    },
    publishTime: '2024-01-27',
    views: 189,
    contacts: 8
  },
  {
    id: 3,
    title: '收一把入门级电吉他',
    maxPrice: 1500,
    description: '新手想学电吉他，收一把入门级的练练手。预算 1500 以内，最好带音箱效果器。品牌不限，Ibanez、Squier、Epiphone 都可以。同城可以面交试琴。',
    category: 8,
    location: '广州市天河区',
    publisher: {
      id: 203,
      nickname: '吉他爱好者',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=music%20lover%20guitar%20player%20avatar%20portrait&image_size=square'
    },
    publishTime: '2024-01-26',
    views: 156,
    contacts: 5
  }
])

const bannerData = [
  {
    id: 1,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20smartphone%20technology%20banner%20gradient%20blue%20purple&image_size=landscape_16_9',
    title: '数码精选',
    subtitle: '精选优质二手数码好物'
  },
  {
    id: 2,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20clothing%20sale%20banner%20trendy%20style&image_size=landscape_16_9',
    title: '服饰特惠',
    subtitle: '品牌服饰超值低价'
  },
  {
    id: 3,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=home%20furniture%20interior%20design%20banner%20cozy%20warm&image_size=landscape_16_9',
    title: '家居精选',
    subtitle: '品质家居提升生活格调'
  }
]

export function useProductStore() {
  const getProductById = (id) => {
    return products.find(p => p.id === Number(id))
  }

  const getWantBuyById = (id) => {
    return wantBuys.find(w => w.id === Number(id))
  }

  const getProductsByCategory = (categoryId) => {
    if (!categoryId) return products
    return products.filter(p => p.category === Number(categoryId))
  }

  const searchProducts = (keyword, categoryId = null) => {
    let result = [...products]
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerKeyword) ||
        p.description.toLowerCase().includes(lowerKeyword)
      )
    }
    if (categoryId) {
      result = result.filter(p => p.category === Number(categoryId))
    }
    return result
  }

  const filterProducts = ({ categoryId, minPrice, maxPrice, condition, sortBy, searchKeyword }) => {
    let result = searchProducts(searchKeyword, categoryId)

    if (minPrice !== undefined && minPrice !== null) {
      result = result.filter(p => p.price >= minPrice)
    }
    if (maxPrice !== undefined && maxPrice !== null) {
      result = result.filter(p => p.price <= maxPrice)
    }
    if (condition) {
      result = result.filter(p => p.condition === condition)
    }

    if (sortBy) {
      switch (sortBy) {
        case 'newest':
          result.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
          break
        case 'price-asc':
          result.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          result.sort((a, b) => b.price - a.price)
          break
        case 'popular':
          result.sort((a, b) => b.views - a.views)
          break
        case 'distance':
          result.sort((a, b) => a.distance - b.distance)
          break
      }
    }

    return result
  }

  const getFeaturedProducts = () => {
    return products.filter(p => p.has3D).slice(0, 4)
  }

  const getBargainProducts = () => {
    return products.filter(p => 
      p.tags.includes('超值') || p.tags.includes('急出')
    ).slice(0, 6)
  }

  const getNearbyProducts = () => {
    return [...products].sort((a, b) => a.distance - b.distance).slice(0, 6)
  }

  const getRecommendProducts = (excludeId = null) => {
    let result = [...products]
    if (excludeId) {
      result = result.filter(p => p.id !== Number(excludeId))
    }
    return result.slice(0, 6)
  }

  const addProduct = (productData) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1
    const newProduct = {
      id: newId,
      title: productData.title,
      price: productData.price,
      originalPrice: productData.originalPrice || productData.price,
      condition: productData.condition,
      category: productData.categoryId,
      images: productData.images,
      description: productData.description,
      specs: [],
      seller: {
        id: 999,
        nickname: '我',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait%20friendly&image_size=square',
        location: productData.location || '北京市',
        rating: 5.0,
        verified: false
      },
      location: productData.location || '北京市',
      distance: 0.1,
      publishTime: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      favorites: 0,
      tags: [],
      has3D: false,
      tradeMethods: productData.tradeMethods || ['self']
    }
    products.unshift(newProduct)
    return newProduct
  }

  return {
    products,
    wantBuys,
    categories,
    conditionTypes,
    tradeMethods,
    bannerData,
    getProductById,
    getWantBuyById,
    getProductsByCategory,
    searchProducts,
    filterProducts,
    getFeaturedProducts,
    getBargainProducts,
    getNearbyProducts,
    getRecommendProducts,
    addProduct
  }
}
