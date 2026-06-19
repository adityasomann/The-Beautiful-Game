<template>
  <div style="min-height:100vh;background:var(--c-bg);font-family:Georgia,'Times New Roman',serif;color:var(--c-t4)">

    <GroupPopup :group="groupPopup" @close="groupPopup = null" />
    <SquadModal :country="squadCountry" @close="squadCountry = null" />

    <!-- Sticky header + tabs -->
    <div ref="stickyHeader" style="position:sticky;top:0;z-index:100">
    <!-- Header -->
    <div style="background:var(--c-header-bg);border-bottom:2px solid var(--c-border);padding:36px 24px 28px;text-align:center;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background:var(--c-header-glow);pointer-events:none"/>
      <button @click="toggleTheme"
        style="position:absolute;top:14px;right:16px;background:transparent;border:1px solid var(--c-border-solid);color:var(--c-t2);border-radius:6px;padding:5px 10px;font-size:14px;cursor:pointer;line-height:1;z-index:1"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
      <div style="font-size:13px;letter-spacing:5px;color:var(--c-accent);text-transform:uppercase;margin-bottom:8px">Official Tournament Schedule</div>
      <h1 style="font-size:clamp(22px,5vw,40px);font-weight:700;margin:0 0 6px;background:var(--c-title-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:1px">FIFA WORLD CUP 2026™</h1>
      <div style="color:var(--c-t3);font-size:14px;letter-spacing:2px">CANADA · MEXICO · UNITED STATES &nbsp;|&nbsp; JUNE 11 – JULY 19</div>
      <div style="margin-top:10px;color:var(--c-t2);font-size:12px">All times Central (CT) · 104 matches · 48 teams · Click a country name to view its squad</div>
    </div>

    <!-- View tabs -->
    <div style="display:flex;background:var(--c-bg-tab);border-bottom:1px solid var(--c-border);padding:0 20px;gap:4px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none">
      <button v-for="tab in tabs" :key="tab.id" @click="view = tab.id"
        :style="{ background: 'none', border: 'none', borderBottom: view === tab.id ? '2px solid #3b82f6' : '2px solid transparent', color: view === tab.id ? 'var(--c-accent)' : 'var(--c-t1)', padding: '12px 18px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Georgia,serif', transition: 'color 0.15s', whiteSpace: 'nowrap', flexShrink: 0 }">
        {{ tab.label }}
      </button>
    </div>
    </div><!-- end sticky wrapper -->

    <!-- Views -->
    <HomeView v-if="view === 'home'" />
    <ScheduleView v-else-if="view === 'schedule'" />
    <GroupStandingsView v-else-if="view === 'standings'" />
    <BracketView v-else-if="view === 'bracket'" />

    <div style="text-align:center;padding:24px;color:var(--c-border-solid);font-size:12px;letter-spacing:2px">FIFA WORLD CUP 2026™ · CANADA · MEXICO · UNITED STATES</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, provide } from 'vue'
import { ALL_MATCHES } from './data/matches.js'
import { useStandings } from './composables/useStandings.js'
import ScheduleView from './components/ScheduleView.vue'
import BracketView from './components/BracketView.vue'
import GroupStandingsView from './components/GroupStandingsView.vue'
import HomeView from './components/HomeView.vue'
import SquadModal from './components/SquadModal.vue'
import GroupPopup from './components/GroupPopup.vue'

const API_URL = 'https://wc2026.home/api'
const TODAY   = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time, not UTC

const stickyHeader = ref(null)

function updateStickyTop() {
  const h = stickyHeader.value?.offsetHeight ?? 0
  document.documentElement.style.setProperty('--sticky-top', h + 'px')
}

const isDark = ref(localStorage.getItem('theme') === 'dark')
document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

const tabs = [
  { id: 'home',      label: 'Home' },
  { id: 'schedule',  label: 'Schedule' },
  { id: 'standings', label: 'Group Standings' },
  { id: 'bracket',   label: 'Bracket' },
]

const matches      = ref([...ALL_MATCHES])
const scores       = ref({})
const view         = ref('home')
const squadCountry = ref(null)
const groupPopup   = ref(null)
const editingIdx   = ref(null)
const editBuf      = ref({})

onMounted(async () => {
  updateStickyTop()
  window.addEventListener('resize', updateStickyTop)
  try {
    const res  = await fetch(`${API_URL}/scores`)
    const data = await res.json()
    const map  = {}
    data.forEach(row => { map[row.id] = { score1: row.score1, score2: row.score2 } })
    scores.value = map
  } catch (e) {
    console.error('Could not load scores:', e)
  }
})

const matchesWithScores = computed(() =>
  matches.value.map((m, i) => ({
    ...m,
    score1: scores.value[i]?.score1 ?? '',
    score2: scores.value[i]?.score2 ?? '',
  }))
)

const { standingsData } = useStandings(matchesWithScores)

function startEdit(i) {
  editingIdx.value = i
  editBuf.value = {
    score1: scores.value[i]?.score1 ?? '',
    score2: scores.value[i]?.score2 ?? '',
  }
}

async function saveEdit(idx) {
  const s1 = String(editBuf.value.score1 ?? '')
  const s2 = String(editBuf.value.score2 ?? '')
  scores.value = { ...scores.value, [idx]: { score1: s1, score2: s2 } }
  try {
    await fetch(`${API_URL}/scores/${idx}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score1: s1, score2: s2 }),
    })
  } catch (e) {
    console.error('Could not save score:', e)
  }
  editingIdx.value = null
}

async function clearScore(idx) {
  scores.value = { ...scores.value, [idx]: { score1: '', score2: '' } }
  try {
    await fetch(`${API_URL}/scores/${idx}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score1: '', score2: '' }),
    })
  } catch (e) {}
  editingIdx.value = null
}

function cancelEdit() { editingIdx.value = null }

onUnmounted(() => window.removeEventListener('resize', updateStickyTop))

provide('scores',      scores)
provide('editingIdx',  editingIdx)
provide('editBuf',     editBuf)
provide('standingsData', standingsData)
provide('TODAY',       TODAY)
provide('startEdit',   startEdit)
provide('saveEdit',    saveEdit)
provide('cancelEdit',  cancelEdit)
provide('clearScore',  clearScore)
provide('openSquad',   (c) => { squadCountry.value = c })
provide('openGroup',   (g) => { groupPopup.value = g })
provide('setView',     (v) => { view.value = v })
</script>
