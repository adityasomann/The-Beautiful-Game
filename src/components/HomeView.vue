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
            :style="{ background: 'var(--c-bg-card)', border: `1px solid ${stageColor(m.stage).badge}33`, borderLeft: `3px solid ${stageColor(m.stage).badge}`, borderRadius: '8px', padding: '12px 14px', cursor: 'pointer', transition: 'background 0.15s' }"
            @click="goToMatch(m._origIdx)"
            @mouseenter="e => e.currentTarget.style.background = 'var(--c-bg-hover)'"
            @mouseleave="e => e.currentTarget.style.background = 'var(--c-bg-card)'">
            <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600">
              <span style="color:var(--c-accent);font-size:12px;font-style:italic;flex-shrink:0">{{ m.time }}</span>
              <span v-if="isLive(m)"
                style="background:#dc26261a;color:#f87171;border:1px solid #dc262644;border-radius:4px;padding:1px 6px;font-size:10px;letter-spacing:1.5px;flex-shrink:0;animation:livePulse 1.5s ease-in-out infinite">LIVE</span>
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
              <div @click.stop="openMatchEdit(m._origIdx)" title="Edit score"
                style="flex-shrink:0;color:var(--c-border-solid);font-size:12px;cursor:pointer;padding:0 2px"
                @mouseenter="e => e.currentTarget.style.color = 'var(--c-accent)'"
                @mouseleave="e => e.currentTarget.style.color = 'var(--c-border-solid)'">✎</div>
            </div>
            <div style="text-align:center;margin-top:5px;font-size:10px;color:var(--c-t0)">
              {{ [m.group || m.stage, m.venue?.split(',')[0]].filter(Boolean).join(' · ') }}
            </div>
            <div v-if="countdown(m)" style="display:flex;justify-content:center;margin-top:8px">
              <span :style="{
                background: countdown(m).urgent ? '#dc26261a' : 'var(--c-bg-deep)',
                color: countdown(m).urgent ? '#f87171' : 'var(--c-t2)',
                border: `1px solid ${countdown(m).urgent ? '#dc262644' : 'var(--c-border)'}`,
                borderRadius: '20px', padding: '3px 12px', fontSize: '11px', letterSpacing: '0.5px',
                fontVariantNumeric: 'tabular-nums'
              }">⏱ {{ countdown(m).label }}</span>
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
            style="background:var(--c-bg-card);border:1px solid var(--c-border);border-radius:8px;padding:10px 14px;cursor:pointer;transition:background 0.15s"
            @click="goToMatch(m._origIdx)"
            @mouseenter="e => e.currentTarget.style.background = 'var(--c-bg-hover)'"
            @mouseleave="e => e.currentTarget.style.background = 'var(--c-bg-card)'">
            <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600">
              <span :style="{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right', color: score1Wins(m._origIdx) ? 'var(--c-t5)' : (winnerSide(m._origIdx) ? 'var(--c-t0)' : 'var(--c-t1)'), fontWeight: score1Wins(m._origIdx) ? 700 : 600 }">
                {{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}
              </span>
              <span v-if="score1Wins(m._origIdx)" style="color:#22c55e;font-size:12px;flex-shrink:0" title="Winner">✓</span>
              <span style="background:var(--c-bg-deep);border:1px solid var(--c-border);border-radius:5px;padding:3px 10px;font-size:14px;font-weight:700;color:var(--c-t4);white-space:nowrap;flex-shrink:0">
                {{ goalsOf(m._origIdx, 1) }} – {{ goalsOf(m._origIdx, 2) }}<span v-if="pensOf(m._origIdx, 1) != null" style="font-size:10px;font-weight:400;opacity:0.8">&nbsp;({{ pensOf(m._origIdx, 1) }}–{{ pensOf(m._origIdx, 2) }}p)</span>
              </span>
              <span v-if="score2Wins(m._origIdx)" style="color:#22c55e;font-size:12px;flex-shrink:0" title="Winner">✓</span>
              <span :style="{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: score2Wins(m._origIdx) ? 'var(--c-t5)' : (winnerSide(m._origIdx) ? 'var(--c-t0)' : 'var(--c-t1)'), fontWeight: score2Wins(m._origIdx) ? 700 : 600 }">
                {{ m.team2 }} {{ COUNTRY_FLAGS[m.team2] ?? '' }}
              </span>
              <div @click.stop="openMatchEdit(m._origIdx)" title="Edit score"
                style="flex-shrink:0;color:var(--c-border-solid);font-size:12px;cursor:pointer;padding:0 2px"
                @mouseenter="e => e.currentTarget.style.color = 'var(--c-accent)'"
                @mouseleave="e => e.currentTarget.style.color = 'var(--c-border-solid)'">✎</div>
            </div>
            <div style="text-align:center;margin-top:5px;font-size:10px;color:var(--c-t0);letter-spacing:0.5px">
              {{ formatDateLabel(m.date) }} · {{ m.group || m.stage }}
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
import { COUNTRY_FLAGS, STAGE_COLORS, matchStartMs, MATCH_DURATION_MS } from '../data/constants.js'
import { parseGoals, parsePens } from '../utils/score.js'
import { useNow } from '../composables/useNow.js'

const { nowMs } = useNow({ interval: 1000 })

const scores        = inject('scores')
const standingsData = inject('standingsData')
const TODAY         = inject('TODAY')
const setView       = inject('setView')
const goToMatch     = inject('goToMatch')
const openMatchEdit = inject('openMatchEdit')

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
  if (todayMs.length > 0) {
    // Live games float to the top; everything else keeps its schedule order.
    return [...todayMs.filter(m => isLive(m)), ...todayMs.filter(m => !isLive(m))]
  }
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
  const goals   = played.reduce((s, m) =>
    s + (parseGoals(scores.value[m._origIdx].score1) ?? 0) + (parseGoals(scores.value[m._origIdx].score2) ?? 0), 0)
  const groupsDone  = Object.values(standingsData.value.complete).filter(Boolean).length
  const totalGroups = Object.keys(standingsData.value.complete).length || 12
  const avgGoals    = played.length > 0 ? (goals / played.length).toFixed(1) : '—'

  // A team is out once it's mathematically eliminated in the group stage, or it
  // loses a knockout match (penalty shootouts included).
  const eliminated = new Set()
  for (const teams of Object.values(standingsData.value.standings))
    for (const t of teams) if (t.clinch === 'eliminated') eliminated.add(t.name)
  for (let i = 72; i <= 103; i++) {
    if (i === 102) continue // 3rd-place playoff eliminates no one new (both already out)
    const loser = knockoutLoser(i)
    if (loser) eliminated.add(loser)
  }

  return [
    { label: 'Matches Played', value: played.length,           color: '#3b82f6', sub: `of 104` },
    { label: 'Goals Scored',   value: goals,                   color: '#22c55e', sub: `${avgGoals}/match` },
    { label: 'Groups Done',    value: groupsDone,              color: '#f59e0b', sub: `of ${totalGroups}` },
    { label: 'Teams Left',     value: 48 - eliminated.size,    color: 'var(--c-t4)', sub: 'in tournament' },
  ]
})

function hasScore(idx) {
  const s = scores.value[idx]
  return s != null && s.score1 !== '' && s.score2 !== ''
}

function goalsOf(idx, n) { return parseGoals(scores.value[idx]?.['score' + n]) }
function pensOf(idx, n)  { return parsePens(scores.value[idx]?.['score' + n]) }

// 1 = team1 wins, 2 = team2 wins, 0 = no result yet (goals, then penalties).
function winnerSide(idx) {
  if (!hasScore(idx)) return 0
  const g1 = goalsOf(idx, 1), g2 = goalsOf(idx, 2)
  if (g1 > g2) return 1
  if (g2 > g1) return 2
  const p1 = pensOf(idx, 1), p2 = pensOf(idx, 2)
  if (p1 == null || p2 == null) return 0
  return p1 > p2 ? 1 : p2 > p1 ? 2 : 0
}
function score1Wins(idx) { return winnerSide(idx) === 1 }
function score2Wins(idx) { return winnerSide(idx) === 2 }

function knockoutLoser(idx) {
  const side = winnerSide(idx)
  if (side === 0) return null
  const m = standingsData.value.resolvedMatches[idx]
  return side === 1 ? m.team2 : m.team1
}

function isLive(m) {
  const start = matchStartMs(m.date, m.time)
  if (start === null) return false
  return nowMs.value >= start && nowMs.value < start + MATCH_DURATION_MS
}

function countdown(m) {
  const start = matchStartMs(m.date, m.time)
  if (start === null) return null
  const diff = start - nowMs.value
  if (diff <= 0) return null
  const totalSec = Math.floor(diff / 1000)
  const h = Math.floor(totalSec / 3600)
  const min = Math.floor((totalSec % 3600) / 60)
  const sec = totalSec % 60
  if (h > 0) return { label: `${h}h ${min}m`, urgent: false }
  if (min > 0) return { label: `${min}m ${String(sec).padStart(2, '0')}s`, urgent: min < 15 }
  return { label: `${sec}s`, urgent: true }
}

function stageColor(stage) {
  return STAGE_COLORS[stage] ?? STAGE_COLORS['Group Stage']
}

function formatDateLabel(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}
</script>
