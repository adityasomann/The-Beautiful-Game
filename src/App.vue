<template>
  <div style="min-height:100vh;background:#060d1c;font-family:Georgia,'Times New Roman',serif;color:#e2e8f0">

    <GroupPopup :group="groupPopup" @close="groupPopup = null" />
    <SquadModal :country="squadCountry" @close="squadCountry = null" />

    <!-- Sticky header + tabs -->
    <div style="position:sticky;top:0;z-index:100">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0a1628 0%,#0d2244 40%,#1a0a2e 100%);border-bottom:2px solid #1e40af44;padding:36px 24px 28px;text-align:center;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,#1e40af18 0%,transparent 70%);pointer-events:none"/>
      <div style="font-size:13px;letter-spacing:5px;color:#60a5fa;text-transform:uppercase;margin-bottom:8px">Official Tournament Schedule</div>
      <h1 style="font-size:clamp(22px,5vw,40px);font-weight:700;margin:0 0 6px;background:linear-gradient(90deg,#60a5fa,#ffffff,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:1px">FIFA WORLD CUP 2026™</h1>
      <div style="color:#94a3b8;font-size:14px;letter-spacing:2px">CANADA · MEXICO · UNITED STATES &nbsp;|&nbsp; JUNE 11 – JULY 19</div>
      <div style="margin-top:10px;color:#64748b;font-size:12px">All times Central (CT) · 104 matches · 48 teams · Click a country name to view its squad</div>
    </div>

    <!-- View tabs -->
    <div style="display:flex;background:#070f1f;border-bottom:1px solid #1e3a6e44;padding:0 20px;gap:4px">
      <button v-for="tab in tabs" :key="tab.id" @click="view = tab.id"
        :style="{ background: 'none', border: 'none', borderBottom: view === tab.id ? '2px solid #3b82f6' : '2px solid transparent', color: view === tab.id ? '#60a5fa' : '#475569', padding: '12px 18px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Georgia,serif', transition: 'color 0.15s' }">
        {{ tab.label }}
      </button>
    </div>
    </div><!-- end sticky wrapper -->

    <!-- Views -->
    <ScheduleView v-if="view === 'schedule'" />
    <GroupStandingsView v-else-if="view === 'standings'" />
    <BracketView v-else-if="view === 'bracket'" />

    <div style="text-align:center;padding:24px;color:#1e3a6e;font-size:12px;letter-spacing:2px">FIFA WORLD CUP 2026™ · CANADA · MEXICO · UNITED STATES</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import { ALL_MATCHES } from './data/matches.js'
import { useStandings } from './composables/useStandings.js'
import ScheduleView from './components/ScheduleView.vue'
import BracketView from './components/BracketView.vue'
import GroupStandingsView from './components/GroupStandingsView.vue'
import SquadModal from './components/SquadModal.vue'
import GroupPopup from './components/GroupPopup.vue'

const API_URL = 'https://wc2026.home/api'
const TODAY   = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time, not UTC

const tabs = [
  { id: 'schedule',  label: 'Schedule' },
  { id: 'standings', label: 'Group Standings' },
  { id: 'bracket',   label: 'Bracket' },
]

const matches      = ref([...ALL_MATCHES])
const scores       = ref({})
const view         = ref('schedule')
const squadCountry = ref(null)
const groupPopup   = ref(null)
const editingIdx   = ref(null)
const editBuf      = ref({})

onMounted(async () => {
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
</script>
