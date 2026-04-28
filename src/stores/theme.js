import { reactive, watch } from 'vue'

const state = reactive({
  isDark: localStorage.getItem('theme') === 'dark'
})

export function useThemeStore() {
  const initTheme = () => {
    if (state.isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    state.isDark = !state.isDark
    localStorage.setItem('theme', state.isDark ? 'dark' : 'light')
    initTheme()
  }

  watch(() => state.isDark, () => {
    initTheme()
  })

  return {
    state,
    isDark: state.isDark,
    initTheme,
    toggleTheme
  }
}
