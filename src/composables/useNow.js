import { ref, onMounted, onUnmounted } from 'vue'

export function useNow() {
  const nowMs = ref(Date.now())
  let timer

  onMounted(() => {
    timer = setInterval(() => { nowMs.value = Date.now() }, 30_000)
  })
  onUnmounted(() => clearInterval(timer))

  return { nowMs }
}
