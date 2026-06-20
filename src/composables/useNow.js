import { ref, onMounted, onUnmounted } from 'vue'

export function useNow({ interval = 30_000 } = {}) {
  const nowMs = ref(Date.now())
  let timer

  onMounted(() => {
    timer = setInterval(() => { nowMs.value = Date.now() }, interval)
  })
  onUnmounted(() => clearInterval(timer))

  return { nowMs }
}
