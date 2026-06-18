<template>
  <div>
    <!-- Filters -->
    <div style="background:#0a1628;border-bottom:1px solid #1e3a6e33;padding:16px 20px;display:flex;flex-wrap:wrap;gap:10px;align-items:center">
      <input v-model="search" placeholder="🔍  Search team or group..."
        style="background:#0d1f38;border:1px solid #1e40af44;color:#e2e8f0;border-radius:6px;padding:7px 12px;font-size:13px;width:200px;outline:none;font-family:Georgia,serif"/>
      <select v-model="stageFilter"
        style="background:#0d1f38;border:1px solid #1e40af44;color:#e2e8f0;border-radius:6px;padding:7px 10px;font-size:13px;outline:none;cursor:pointer;font-family:Georgia,serif">
        <option v-for="s in SCHEDULE_STAGES" :key="s">{{ s }}</option>
      </select>
      <select v-model="groupFilter"
        style="background:#0d1f38;border:1px solid #1e40af44;color:#e2e8f0;border-radius:6px;padding:7px 10px;font-size:13px;outline:none;cursor:pointer;font-family:Georgia,serif">
        <option v-for="g in GROUPS" :key="g">{{ g }}</option>
      </select>
      <button @click="todayOnly = !todayOnly"
        :style="{ background: todayOnly ? '#1e40af' : 'transparent', color: todayOnly ? '#fff' : '#475569', border: '1px solid', borderColor: todayOnly ? '#3b82f6' : '#1e3a6e', borderRadius: '6px', padding: '7px 14px', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'Georgia,serif', transition: 'all 0.15s' }">
        TODAY
      </button>
      <span style="margin-left:auto;color:#64748b;font-size:12px;letter-spacing:1px">{{ filtered.length }} MATCHES</span>
    </div>

    <!-- Match list -->
    <div style="max-width:900px;margin:0 auto;padding:24px 16px">
      <div v-if="grouped.length === 0" style="text-align:center;color:#475569;padding:60px 0;font-size:16px">No matches found.</div>
      <div v-for="[date, dayMatches] in grouped" :key="date" style="margin-bottom:32px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #1e3a6e33">
          <div style="background:#1e40af;color:#fff;border-radius:6px;padding:4px 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase">{{ getDay(dayMatches[0].date) }}</div>
          <div style="color:#94a3b8;font-size:15px;font-style:italic">{{ formatDateLabel(date) }}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <template v-for="m in dayMatches" :key="m._origIdx">

            <!-- Edit mode -->
            <div v-if="editingIdx === m._origIdx"
              style="background:#0f1e35;border:1px solid #3b82f644;border-left:3px solid #3b82f6;border-radius:8px;padding:14px 16px;display:flex;flex-direction:column;gap:12px">
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                <span style="color:#94a3b8;font-size:14px;font-weight:600;flex:1;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                  {{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}
                </span>
                <input v-model="editBuf.score1" type="number" min="0"
                  @keyup.enter="saveEdit(m._origIdx)"
                  style="background:#0d1f38;border:1px solid #3b82f655;color:#e2e8f0;border-radius:6px;padding:8px 0;font-size:22px;font-weight:700;font-family:Georgia,serif;width:52px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
                <span style="color:#334155;font-size:18px;flex-shrink:0">—</span>
                <input v-model="editBuf.score2" type="number" min="0"
                  @keyup.enter="saveEdit(m._origIdx)"
                  style="background:#0d1f38;border:1px solid #3b82f655;color:#e2e8f0;border-radius:6px;padding:8px 0;font-size:22px;font-weight:700;font-family:Georgia,serif;width:52px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
                <span style="color:#94a3b8;font-size:14px;font-weight:600;flex:1;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                  {{ COUNTRY_FLAGS[m.team2] ?? '' }} {{ m.team2 }}
                </span>
              </div>
              <div style="display:flex;gap:8px;justify-content:flex-end">
                <button @click="cancelEdit"
                  style="background:transparent;color:#64748b;border:1px solid #1e3a6e;border-radius:6px;padding:7px 18px;font-size:12px;cursor:pointer;font-family:Georgia,serif">Cancel</button>
                <button v-if="hasScore(m._origIdx)" @click="clearScore(m._origIdx)"
                  style="background:transparent;color:#ef4444;border:1px solid #7f1d1d;border-radius:6px;padding:7px 18px;font-size:12px;cursor:pointer;font-family:Georgia,serif">Delete Score</button>
                <button @click="saveEdit(m._origIdx)"
                  style="background:#1d4ed8;color:#fff;border:none;border-radius:6px;padding:7px 18px;font-size:12px;cursor:pointer;font-family:Georgia,serif">Save Score</button>
              </div>
            </div>

            <!-- View mode -->
            <div v-else
              :style="{ background: '#0c1a2e', border: `1px solid ${stageColor(m.stage).accent}33`, borderLeft: `3px solid ${stageColor(m.stage).badge}`, borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.15s', flexWrap: 'wrap' }"
              @mouseenter="e => e.currentTarget.style.background = '#0f2040'"
              @mouseleave="e => e.currentTarget.style.background = '#0c1a2e'">
              <div style="min-width:100px;color:#60a5fa;font-size:13px;font-style:italic;flex-shrink:0">{{ m.time }}</div>
              <div style="flex:1;display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;min-width:200px">
                <!-- Team 1 -->
                <span
                  :style="{ cursor: isReal(m.team1) ? 'pointer' : 'default', color: teamColor(m._origIdx, true), borderRadius: '4px', padding: isReal(m.team1) ? '1px 5px' : '0', display: 'inline-block' }"
                  @click="isReal(m.team1) ? openSquad(m.team1) : null"
                  @mouseenter="e => { if (isReal(m.team1)) { e.currentTarget.style.background = '#1e40af44'; e.currentTarget.style.color = '#93c5fd'; } }"
                  @mouseleave="e => { if (isReal(m.team1)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = teamColor(m._origIdx, true); } }">
                  {{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}
                </span>
                <!-- Score -->
                <template v-if="hasScore(m._origIdx)">
                  <span :style="{ color: score1Wins(m._origIdx) ? '#e2e8f0' : '#475569', fontSize: '18px', fontWeight: 700, minWidth: '16px', textAlign: 'center' }">{{ scores[m._origIdx].score1 }}</span>
                  <span style="color:#334155;font-size:14px">–</span>
                  <span :style="{ color: score2Wins(m._origIdx) ? '#e2e8f0' : '#475569', fontSize: '18px', fontWeight: 700, minWidth: '16px', textAlign: 'center' }">{{ scores[m._origIdx].score2 }}</span>
                </template>
                <span v-else style="color:#334155;font-size:12px;font-weight:400;font-style:italic">vs</span>
                <!-- Team 2 -->
                <span
                  :style="{ cursor: isReal(m.team2) ? 'pointer' : 'default', color: teamColor(m._origIdx, false), borderRadius: '4px', padding: isReal(m.team2) ? '1px 5px' : '0', display: 'inline-block' }"
                  @click="isReal(m.team2) ? openSquad(m.team2) : null"
                  @mouseenter="e => { if (isReal(m.team2)) { e.currentTarget.style.background = '#1e40af44'; e.currentTarget.style.color = '#93c5fd'; } }"
                  @mouseleave="e => { if (isReal(m.team2)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = teamColor(m._origIdx, false); } }">
                  {{ COUNTRY_FLAGS[m.team2] ?? '' }} {{ m.team2 }}
                </span>
              </div>
              <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
                <span v-if="m.group" :style="{ ...badgeStyle(m.stage), cursor: 'pointer' }"
                  @click.stop="openGroup(m.group)"
                  @mouseenter="e => e.currentTarget.style.opacity = '0.75'"
                  @mouseleave="e => e.currentTarget.style.opacity = '1'">{{ m.group }}</span>
                <span :style="badgeStyle(m.stage)">{{ m.stage }}</span>
                <div @click="startEdit(m._origIdx)" title="Edit score"
                  style="color:#334155;font-size:13px;cursor:pointer;padding:2px 6px;border-radius:4px;transition:color 0.15s"
                  @mouseenter="e => e.currentTarget.style.color = '#60a5fa'"
                  @mouseleave="e => e.currentTarget.style.color = '#334155'">✎</div>
              </div>
              <div v-if="m.venue" style="width:100%;padding-top:6px;font-size:11px;color:#475569;letter-spacing:0.3px">
                📍 {{ m.venue }}
              </div>
            </div>

          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { COUNTRY_FLAGS, STAGE_COLORS, GROUPS } from '../data/constants.js'

const SCHEDULE_STAGES = ['All', 'Group Stage']

const scores      = inject('scores')
const editingIdx  = inject('editingIdx')
const editBuf     = inject('editBuf')
const standingsData = inject('standingsData')
const TODAY       = inject('TODAY')
const startEdit   = inject('startEdit')
const saveEdit    = inject('saveEdit')
const cancelEdit  = inject('cancelEdit')
const clearScore  = inject('clearScore')
const openSquad   = inject('openSquad')
const openGroup   = inject('openGroup')

const stageFilter = ref('All')
const groupFilter = ref('All Groups')
const search      = ref('')
const todayOnly   = ref(false)

const filtered = computed(() =>
  standingsData.value.resolvedMatches
    .map((m, i) => ({ ...m, _origIdx: i }))
    .filter(m => {
      if (m.stage !== 'Group Stage') return false
      if (todayOnly.value && m.date !== TODAY) return false
      if (stageFilter.value !== 'All' && m.stage !== stageFilter.value) return false
      if (groupFilter.value !== 'All Groups' && m.group !== groupFilter.value) return false
      if (search.value) {
        const s = search.value.toLowerCase()
        return m.team1.toLowerCase().includes(s) || m.team2.toLowerCase().includes(s) || m.group.toLowerCase().includes(s)
      }
      return true
    })
)

const grouped = computed(() => {
  const map = {}
  for (const m of filtered.value) (map[m.date] ??= []).push(m)
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
})

function hasScore(idx) {
  const s = scores.value[idx]
  return s != null && s.score1 !== '' && s.score2 !== ''
}

function score1Wins(idx) {
  const s = scores.value[idx]
  return hasScore(idx) && Number(s.score1) > Number(s.score2)
}

function score2Wins(idx) {
  const s = scores.value[idx]
  return hasScore(idx) && Number(s.score2) > Number(s.score1)
}

function teamColor(idx, isTeam1) {
  if (hasScore(idx)) {
    const s = scores.value[idx]
    const isDraw = Number(s.score1) === Number(s.score2)
    if (isDraw) return '#94a3b8'
    return (isTeam1 ? score1Wins(idx) : score2Wins(idx)) ? '#f1f5f9' : '#475569'
  }
  return '#f1f5f9'
}

function isReal(name) {
  return !['TBD', 'Winner', 'Runner', 'Best'].some(p => name.startsWith(p))
}

function stageColor(stage) {
  return STAGE_COLORS[stage] ?? STAGE_COLORS['Group Stage']
}

function badgeStyle(stage) {
  const c = stageColor(stage)
  return { background: c.badge + '22', color: c.badge, border: `1px solid ${c.badge}44`, borderRadius: '4px', padding: '2px 8px', fontSize: '11px', letterSpacing: '1px' }
}

function formatDateLabel(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function getDay(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })
}
</script>
