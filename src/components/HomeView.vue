<template>
  <div style="max-width:960px;margin:0 auto;padding:28px 16px 48px">

    <!-- Pulse stats -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:32px">
      <div v-for="stat in stats" :key="stat.label"
        style="background:var(--c-bg-card);border:1px solid var(--c-border);border-radius:10px;padding:18px 16px;text-align:center">
        <div :style="{ fontSize: '28px', fontWeight: 700, color: stat.color, letterSpacing: '-0.5px' }">{{ stat.value }}</div>
        <div style="font-size:10px;letter-spacing:2px;color:var(--c-t1);text-transform:uppercase;margin-top:4px">{{ stat.label }}</div>
        <div v-if="stat.sub" style="font-size:11px;color:var(--c-t0);margin-top:3px">{{ stat.sub }}</div>
      </div>
    </div>

    <!-- Featured + Recent -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-bottom:32px">

      <!-- Today / upcoming matches -->
      <div>
        <div style="font-size:11px;letter-spacing:3px;color:var(--c-accent);text-transform:uppercase;margin-bottom:14px">
          {{ featuredLabel }}
        </div>
        <div v-if="featuredMatches.length === 0"
          style="color:var(--c-t0);font-size:14px;font-style:italic;padding:20px 0">
          No upcoming matches scheduled.
        </div>
        <div v-else style="display:flex;flex-direction:column;gap:8px">
          <div v-for="m in featuredMatches" :key="m._origIdx"
            :style="{ background: 'var(--c-bg-card)', border: `1px solid ${stageColor(m.stage).badge}33`, borderLeft: `3px solid ${stageColor(m.stage).badge}`, borderRadius: '8px', padding: '12px 14px' }">
            <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600">
              <span style="color:var(--c-accent);font-size:12px;font-style:italic;flex-shrink:0">{{ m.time }}</span>
              <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--c-t4);text-align:right">
                {{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}
              </span>
              <template v-if="hasScore(m._origIdx)">
                <span :style="{ color: score1Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t1)', fontWeight: 700, flexShrink: 0 }">{{ scores[m._origIdx].score1 }}</span>
                <span style="color:var(--c-t0);flex-shrink:0">–</span>
                <span :style="{ color: score2Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t1)', fontWeight: 700, flexShrink: 0 }">{{ scores[m._origIdx].score2 }}</span>
              </template>
              <span v-else style="color:var(--c-t0);font-size:11px;font-weight:400;flex-shrink:0">vs</span>
              <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--c-t4)">
                {{ m.team2 }} {{ COUNTRY_FLAGS[m.team2] ?? '' }}
              </span>
            </div>
            <div v-if="m.group || m.venue" style="text-align:center;margin-top:5px;font-size:10px;color:var(--c-t0)">
              {{ [m.group, m.venue?.split(',')[0]].filter(Boolean).join(' · ') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Recent results -->
      <div>
        <div style="font-size:11px;letter-spacing:3px;color:var(--c-accent);text-transform:uppercase;margin-bottom:14px">
          Recent Results
        </div>
        <div v-if="recentResults.length === 0"
          style="color:var(--c-t0);font-size:14px;font-style:italic;padding:20px 0">
          No results yet.
        </div>
        <div v-else style="display:flex;flex-direction:column;gap:8px">
          <div v-for="m in recentResults" :key="m._origIdx"
            style="background:var(--c-bg-card);border:1px solid var(--c-border);border-radius:8px;padding:10px 14px">
            <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600">
              <span :style="{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right', color: score1Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t1)' }">
                {{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}
              </span>
              <span style="background:var(--c-bg-deep);border:1px solid var(--c-border);border-radius:5px;padding:3px 10px;font-size:14px;font-weight:700;color:var(--c-t4);white-space:nowrap;flex-shrink:0">
                {{ scores[m._origIdx].score1 }} – {{ scores[m._origIdx].score2 }}
              </span>
              <span :style="{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: score2Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t1)' }">
                {{ m.team2 }} {{ COUNTRY_FLAGS[m.team2] ?? '' }}
              </span>
            </div>
            <div style="text-align:center;margin-top:5px;font-size:10px;color:var(--c-t0);letter-spacing:0.5px">
              {{ formatDateLabel(m.date) }} · {{ m.group ?? m.stage }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick nav -->
    <div style="border-top:1px solid var(--c-border);padding-top:28px">
      <div style="font-size:11px;letter-spacing:3px;color:var(--c-accent);text-transform:uppercase;margin-bottom:16px">Explore</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
        <div v-for="card in navCards" :key="card.view"
          @click="setView(card.view)"
          style="background:var(--c-bg-card);border:1px solid var(--c-border);border-radius:12px;padding:22px 20px;cursor:pointer;transition:all 0.15s"
          @mouseenter="e => { e.currentTarget.style.background='var(--c-bg-hover)'; e.currentTarget.style.borderColor='var(--c-border-solid)'; }"
          @mouseleave="e => { e.currentTarget.style.background='var(--c-bg-card)'; e.currentTarget.style.borderColor='var(--c-border)'; }">
          <div style="font-size:24px;margin-bottom:10px">{{ card.icon }}</div>
          <div style="font-size:15px;font-weight:600;color:var(--c-t4);margin-bottom:5px">{{ card.label }}</div>
          <div style="font-size:12px;color:var(--c-t1)">{{ card.desc }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import { COUNTRY_FLAGS, STAGE_COLORS } from '../data/constants.js'

const scores        = inject('scores')
const standingsData = inject('standingsData')
const TODAY         = inject('TODAY')
const setView       = inject('setView')

const navCards = [
  { view: 'schedule',  icon: '📅', label: 'Schedule',        desc: '72 group stage matches' },
  { view: 'standings', icon: '📊', label: 'Group Standings',  desc: '12 groups · 48 teams' },
  { view: 'bracket',   icon: '🏆', label: 'Bracket',          desc: 'Knockout rounds draw' },
]

const allMatches = computed(() =>
  standingsData.value.resolvedMatches.map((m, i) => ({ ...m, _origIdx: i }))
)

const featuredMatches = computed(() => {
  const todayMs = allMatches.value.filter(m => m.date === TODAY)
  if (todayMs.length > 0) return todayMs
  const future = allMatches.value
    .filter(m => m.date > TODAY && !hasScore(m._origIdx))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  if (!future.length) return []
  return future.filter(m => m.date === future[0].date)
})

const featuredLabel = computed(() => {
  if (allMatches.value.some(m => m.date === TODAY)) return "Today's Matches"
  const future = allMatches.value.filter(m => m.date > TODAY && !hasScore(m._origIdx))
  if (!future.length) return 'Upcoming'
  const next = future.sort((a, b) => a.date.localeCompare(b.date))[0]
  return `Next Matches · ${formatDateLabel(next.date)}`
})

const recentResults = computed(() => {
  const played = allMatches.value.filter(m => hasScore(m._origIdx))
  return played.slice(-5).reverse()
})

const stats = computed(() => {
  const played  = allMatches.value.filter(m => hasScore(m._origIdx))
  const goals   = played.reduce((s, m) => s + Number(scores.value[m._origIdx].score1) + Number(scores.value[m._origIdx].score2), 0)
  const groupsDone  = Object.values(standingsData.value.complete).filter(Boolean).length
  const totalGroups = Object.keys(standingsData.value.complete).length || 12
  const avgGoals    = played.length > 0 ? (goals / played.length).toFixed(1) : '—'

  const knocked = new Set()
  const rm = standingsData.value.resolvedMatches
  for (let i = 72; i <= 103; i++) {
    const m = rm[i]
    if (!hasScore(i)) continue
    const s1 = Number(scores.value[i].score1), s2 = Number(scores.value[i].score2)
    if (s1 !== s2) knocked.add(s1 < s2 ? m.team1 : m.team2)
  }

  return [
    { label: 'Matches Played', value: played.length,     color: '#3b82f6', sub: `of 104` },
    { label: 'Goals Scored',   value: goals,             color: '#22c55e', sub: `${avgGoals}/match` },
    { label: 'Groups Done',    value: groupsDone,        color: '#f59e0b', sub: `of ${totalGroups}` },
    { label: 'Teams Left',     value: 48 - knocked.size, color: 'var(--c-t4)', sub: 'in tournament' },
  ]
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

function stageColor(stage) {
  return STAGE_COLORS[stage] ?? STAGE_COLORS['Group Stage']
}

function formatDateLabel(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}
</script>
