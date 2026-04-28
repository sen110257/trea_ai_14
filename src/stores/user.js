import { reactive } from 'vue'

const state = reactive({
  user: {
    id: 1,
    nickname: '闲品用户',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20minimalist%20user%20avatar%20portrait%20clean%20simple%20design&image_size=square',
    phone: '138****8888',
    email: '',
    location: '北京市朝阳区'
  },
  favorites: [],
  browseHistory: [],
  myProducts: []
})

export function useUserStore() {
  const toggleFavorite = (productId) => {
    const index = state.favorites.indexOf(productId)
    if (index > -1) {
      state.favorites.splice(index, 1)
    } else {
      state.favorites.push(productId)
    }
  }

  const addBrowseHistory = (product) => {
    const index = state.browseHistory.findIndex(p => p.id === product.id)
    if (index > -1) {
      state.browseHistory.splice(index, 1)
    }
    state.browseHistory.unshift(product)
    if (state.browseHistory.length > 50) {
      state.browseHistory.pop()
    }
  }

  const clearBrowseHistory = () => {
    state.browseHistory = []
  }

  const isFavorite = (productId) => {
    return state.favorites.includes(productId)
  }

  return {
    state,
    user: state.user,
    favorites: state.favorites,
    browseHistory: state.browseHistory,
    myProducts: state.myProducts,
    toggleFavorite,
    addBrowseHistory,
    clearBrowseHistory,
    isFavorite
  }
}
