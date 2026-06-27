<template>
  <div style="min-height:100vh;background:var(--c-bg);font-family:Georgia,'Times New Roman',serif;color:var(--c-t4)">

    <GroupPopup :group="groupPopup" @close="groupPopup = null" />
    <SquadModal :country="squadCountry" @close="squadCountry = null" />
    <MatchEditPopup :idx="editMatchIdx" @close="cancelEdit" />

    <!-- Competition switcher menu (teleported so the header's overflow can't clip it) -->
    <Teleport to="body">
      <div v-if="compMenuOpen">
        <div @click="compMenuOpen = false" style="position:fixed;inset:0;z-index:1100"></div>
        <div :style="{ position: 'fixed', top: menuPos.top + 'px', left: menuPos.left + 'px', transform: 'translateX(-50%)', zIndex: 1101, background: 'var(--c-bg-deep)', border: '1px solid var(--c-border-solid)', borderRadius: '10px', padding: '5px', minWidth: '230px', boxShadow: '0 16px 40px rgba(0,0,0,0.55)' }">
          <button v-for="c in competitions" :key="c.id" @click="selectCompetition(c.id)"
            :style="{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: c.id === competitionId ? 'var(--c-bg-input)' : 'transparent', border: 'none', color: c.id === competitionId ? 'var(--c-accent)' : 'var(--c-t2)', borderRadius: '7px', padding: '9px 12px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Georgia,serif', textAlign: 'left' }">
            <span style="font-size:16px">{{ c.icon }}</span>
            <span style="flex:1">{{ c.name }}</span>
            <span v-if="c.id === competitionId" style="color:var(--c-accent);font-size:12px">✓</span>
          </button>
        </div>
      </div>
    </Teleport>

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
      <button ref="compBtn" @click="toggleCompMenu"
        style="display:inline-flex;align-items:center;gap:8px;margin-bottom:14px;background:var(--c-bg-card);border:1px solid var(--c-border-solid);color:var(--c-t3);border-radius:8px;padding:7px 14px;font-size:12px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:Georgia,serif;position:relative;z-index:1">
        <span style="font-size:14px">{{ competition.icon }}</span>
        <span>{{ competition.name }}</span>
        <span style="font-size:8px;opacity:0.7;transition:transform 0.15s" :style="{ transform: compMenuOpen ? 'rotate(180deg)' : 'none' }">▼</span>
      </button>
      <h1 style="font-size:clamp(22px,5vw,40px);font-weight:700;margin:0 0 6px;background:var(--c-title-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:1px">{{ competition.title }}</h1>
      <div style="color:var(--c-t3);font-size:14px;letter-spacing:2px">{{ competition.subtitle }}</div>
      <div v-if="competition.note" style="margin-top:10px;color:var(--c-t2);font-size:12px">{{ competition.note }}</div>
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
import { ref, computed, onMounted, onUnmounted, provide, watch } from 'vue'
import { COMPETITIONS, DEFAULT_COMPETITION } from './data/competitions.js'
import { parseGoals, parsePens, formatScore } from './utils/score.js'
import { useStandings } from './composables/useStandings.js'
import ScheduleView from './components/ScheduleView.vue'
import BracketView from './components/BracketView.vue'
import GroupStandingsView from './components/GroupStandingsView.vue'
import HomeView from './components/HomeView.vue'
import SquadModal from './components/SquadModal.vue'
import GroupPopup from './components/GroupPopup.vue'
import MatchEditPopup from './components/MatchEditPopup.vue'

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

const TAB_LABELS = {
  home: 'Home', schedule: 'Schedule',
  standings: 'Group Standings', bracket: 'Bracket', table: 'Table',
}

const competitions  = COMPETITIONS
const competitionId = ref(localStorage.getItem('competition') ?? DEFAULT_COMPETITION)
const competition   = computed(() =>
  COMPETITIONS.find(c => c.id === competitionId.value) ?? COMPETITIONS[0]
)

// Tabs are driven by the active competition's format (e.g. a league hides Bracket).
const tabs = computed(() =>
  competition.value.tabs.map(id => ({ id, label: TAB_LABELS[id] ?? id }))
)

// Custom dropdown switcher state. The menu is teleported to <body> and
// positioned from the button's rect so the header's overflow:hidden can't clip it.
const compBtn      = ref(null)
const compMenuOpen = ref(false)
const menuPos      = ref({ top: 0, left: 0 })

function toggleCompMenu() {
  if (!compMenuOpen.value && compBtn.value) {
    const r = compBtn.value.getBoundingClientRect()
    menuPos.value = { top: r.bottom + 6, left: r.left + r.width / 2 }
  }
  compMenuOpen.value = !compMenuOpen.value
}

function selectCompetition(id) {
  competitionId.value = id
  localStorage.setItem('competition', id)
  compMenuOpen.value = false
}

const matches      = computed(() => competition.value.matches)
const scores       = ref({})
const view         = ref('home')
const highlightIdx = ref(null)
const squadCountry = ref(null)
const groupPopup   = ref(null)
const editingIdx   = ref(null)
const editMatchIdx = ref(null)
const editBuf      = ref({})

// If the active view isn't offered by the newly selected competition, fall back to Home.
watch(competition, (c) => {
  if (!c.tabs.includes(view.value)) view.value = 'home'
})

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

// Parse a stored match into the edit buffer's separate goals + penalty fields.
function fillEditBuf(i) {
  const s = scores.value[i] ?? {}
  editBuf.value = {
    score1: parseGoals(s.score1) ?? '',
    score2: parseGoals(s.score2) ?? '',
    pen1:   parsePens(s.score1) ?? '',
    pen2:   parsePens(s.score2) ?? '',
  }
}

// Inline editing (group stage, in the schedule).
function startEdit(i) {
  editingIdx.value = i
  fillEditBuf(i)
}

// Popup editing (knockout rounds, from the bracket) — supports penalties.
function openMatchEdit(i) {
  editMatchIdx.value = i
  fillEditBuf(i)
}

async function saveEdit(idx) {
  // Penalties only count when the goals are level; otherwise drop them.
  const g1 = editBuf.value.score1, g2 = editBuf.value.score2
  const level = g1 !== '' && g2 !== '' && Number(g1) === Number(g2)
  const s1 = formatScore(g1, level ? editBuf.value.pen1 : '')
  const s2 = formatScore(g2, level ? editBuf.value.pen2 : '')
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
  editMatchIdx.value = null
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
  editMatchIdx.value = null
}

function cancelEdit() { editingIdx.value = null; editMatchIdx.value = null }

onUnmounted(() => window.removeEventListener('resize', updateStickyTop))

provide('competition', competition)
provide('crests',      computed(() => competition.value.crests))
provide('scores',      scores)
provide('editingIdx',  editingIdx)
provide('editBuf',     editBuf)
provide('standingsData', standingsData)
provide('TODAY',       TODAY)
provide('startEdit',   startEdit)
provide('openMatchEdit', openMatchEdit)
provide('saveEdit',    saveEdit)
provide('cancelEdit',  cancelEdit)
provide('clearScore',  clearScore)
provide('openSquad',   (c) => { squadCountry.value = c })
provide('openGroup',   (g) => { groupPopup.value = g })
provide('setView',     (v) => { view.value = v })
provide('highlightIdx', highlightIdx)
provide('goToMatch',  (idx) => { highlightIdx.value = idx; view.value = 'schedule' })
</script>
