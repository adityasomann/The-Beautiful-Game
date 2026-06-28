<template>
  <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;padding:24px 0 48px">
    <div style="min-width:1820px;padding:0 20px">

      <!-- Round labels -->
      <div style="display:flex;margin-bottom:16px">
        <div v-for="col in allColumns" :key="col.key"
          style="width:200px;flex-shrink:0;text-align:center;font-size:10px;letter-spacing:2px;color:var(--c-t1);text-transform:uppercase">
          {{ col.label }}
        </div>
      </div>

      <!-- Bracket body -->
      <div :style="{ display: 'flex', position: 'relative', height: HALF_HEIGHT + 'px' }">
        <div v-for="col in allColumns" :key="col.key"
          style="width:200px;flex-shrink:0;position:relative">
          <div v-for="(m, i) in col.matches" :key="m._origIdx"
            :style="{ position: 'absolute', top: bracketTop(col.depth, i) + 'px', left: '6px', right: '6px', zIndex: 1 }">

            <div :id="'bracket-match-' + m._origIdx"
              :style="{ background: col.isFinal ? 'var(--c-bg-deep)' : 'var(--c-bg-card)', border: flashingIdx === m._origIdx ? '1px solid var(--c-accent)' : (col.isFinal ? '1px solid #f59e0b66' : `1px solid ${stageColor(m.stage).badge}44`), borderLeft: col.isFinal ? '2px solid #f59e0b' : `2px solid ${stageColor(m.stage).badge}`, borderRadius: '6px', overflow: 'hidden', fontSize: '12px', boxShadow: flashingIdx === m._origIdx ? '0 0 0 3px var(--c-accent)' : 'none', transition: 'box-shadow 0.3s, border-color 0.3s' }">
              <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', background: score1Wins(m._origIdx) ? 'var(--c-bg-win)' : 'transparent', borderBottom: '1px solid var(--c-row-sep-d)' }">
                <span :style="{ color: hasScore(m._origIdx) ? (score1Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t0)') : (m.team1Confirmed === false ? 'var(--c-t1)' : 'var(--c-t3)'), fontStyle: m.team1Confirmed === false ? 'italic' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px', cursor: isReal(m.team1) ? 'pointer' : 'default' }"
                  @click="isReal(m.team1) ? openSquad(m.team1) : null">
                  {{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}
                </span>
                <span v-if="hasScore(m._origIdx)" :style="{ fontSize: '13px', fontWeight: 700, color: score1Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t1)', flexShrink: 0, marginLeft: '4px' }">{{ goalsOf(m._origIdx, 1) }}<span v-if="pensOf(m._origIdx, 1) != null" style="font-size:9px;font-weight:400;opacity:0.85">&nbsp;({{ pensOf(m._origIdx, 1) }})</span></span>
              </div>
              <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', background: score2Wins(m._origIdx) ? 'var(--c-bg-win)' : 'transparent', borderBottom: '1px solid var(--c-row-sep-d)' }">
                <span :style="{ color: hasScore(m._origIdx) ? (score2Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t0)') : (m.team2Confirmed === false ? 'var(--c-t1)' : 'var(--c-t3)'), fontStyle: m.team2Confirmed === false ? 'italic' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px', cursor: isReal(m.team2) ? 'pointer' : 'default' }"
                  @click="isReal(m.team2) ? openSquad(m.team2) : null">
                  {{ COUNTRY_FLAGS[m.team2] ?? '' }} {{ m.team2 }}
                </span>
                <span v-if="hasScore(m._origIdx)" :style="{ fontSize: '13px', fontWeight: 700, color: score2Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t1)', flexShrink: 0, marginLeft: '4px' }">{{ goalsOf(m._origIdx, 2) }}<span v-if="pensOf(m._origIdx, 2) != null" style="font-size:9px;font-weight:400;opacity:0.85">&nbsp;({{ pensOf(m._origIdx, 2) }})</span></span>
              </div>
              <div style="border-top:1px solid var(--c-row-sep);padding:3px 8px">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:9px;color:var(--c-t0);letter-spacing:0.3px">{{ m.date }} · {{ m.time }}</span>
                  <div @click="openMatchEdit(m._origIdx)" style="color:var(--c-border-solid);font-size:11px;cursor:pointer;padding:1px 3px;border-radius:3px;transition:color 0.15s"
                    @mouseenter="e => e.currentTarget.style.color = 'var(--c-accent)'"
                    @mouseleave="e => e.currentTarget.style.color = 'var(--c-border-solid)'">✎</div>
                </div>
                <div v-if="m.venue" style="font-size:9px;color:var(--c-t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px">📍 {{ m.venue }}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 3rd Place -->
      <div style="max-width:400px;margin:36px auto 0;border-top:1px solid var(--c-border-2);padding-top:24px">
        <div style="text-align:center;margin-bottom:10px">
          <div style="font-size:10px;letter-spacing:2px;color:#b45309;text-transform:uppercase">3rd Place</div>
          <div style="font-size:11px;color:var(--c-t1);margin-top:3px">{{ thirdPlace.date }} · {{ thirdPlace.time }}</div>
          <div v-if="thirdPlace.venue" style="font-size:11px;color:var(--c-t0);margin-top:1px">📍 {{ thirdPlace.venue }}</div>
        </div>

        <div id="bracket-match-102"
          :style="{ background: 'var(--c-bg-card)', border: flashingIdx === 102 ? '1px solid var(--c-accent)' : '1px solid #b4530933', borderLeft: '2px solid #b45309', borderRadius: '6px', overflow: 'hidden', fontSize: '13px', boxShadow: flashingIdx === 102 ? '0 0 0 3px var(--c-accent)' : 'none', transition: 'box-shadow 0.3s, border-color 0.3s' }">
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', background: score1Wins(102) ? 'var(--c-bg-win)' : 'transparent', borderBottom: '1px solid var(--c-row-sep-d)' }">
            <span :style="{ color: hasScore(102) ? (score1Wins(102) ? 'var(--c-t5)' : 'var(--c-t1)') : 'var(--c-t3)', cursor: isReal(thirdPlace.team1) ? 'pointer' : 'default' }"
              @click="isReal(thirdPlace.team1) ? openSquad(thirdPlace.team1) : null">
              {{ COUNTRY_FLAGS[thirdPlace.team1] ?? '' }} {{ thirdPlace.team1 }}
            </span>
            <span v-if="hasScore(102)" :style="{ fontWeight: 700, color: score1Wins(102) ? 'var(--c-t5)' : 'var(--c-t2)' }">{{ goalsOf(102, 1) }}<span v-if="pensOf(102, 1) != null" style="font-size:10px;font-weight:400;opacity:0.85">&nbsp;({{ pensOf(102, 1) }})</span></span>
          </div>
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', background: score2Wins(102) ? 'var(--c-bg-win)' : 'transparent', borderBottom: '1px solid var(--c-row-sep-d)' }">
            <span :style="{ color: hasScore(102) ? (score2Wins(102) ? 'var(--c-t5)' : 'var(--c-t1)') : 'var(--c-t3)', cursor: isReal(thirdPlace.team2) ? 'pointer' : 'default' }"
              @click="isReal(thirdPlace.team2) ? openSquad(thirdPlace.team2) : null">
              {{ COUNTRY_FLAGS[thirdPlace.team2] ?? '' }} {{ thirdPlace.team2 }}
            </span>
            <span v-if="hasScore(102)" :style="{ fontWeight: 700, color: score2Wins(102) ? 'var(--c-t5)' : 'var(--c-t2)' }">{{ goalsOf(102, 2) }}<span v-if="pensOf(102, 2) != null" style="font-size:10px;font-weight:400;opacity:0.85">&nbsp;({{ pensOf(102, 2) }})</span></span>
          </div>
          <div style="display:flex;justify-content:flex-end;padding:3px 8px;border-top:1px solid var(--c-row-sep)">
            <div @click="openMatchEdit(102)" style="color:var(--c-border-solid);font-size:11px;cursor:pointer;padding:1px 3px;border-radius:3px;transition:color 0.15s"
              @mouseenter="e => e.currentTarget.style.color = 'var(--c-accent)'"
              @mouseleave="e => e.currentTarget.style.color = 'var(--c-border-solid)'">✎</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref, onMounted, nextTick } from 'vue'
import { COUNTRY_FLAGS, STAGE_COLORS } from '../data/constants.js'
import { parseGoals, parsePens } from '../utils/score.js'

const HALF_SLOT   = 132  // px per R32 slot. Cards are absolutely positioned, so the
                         // gap between them is HALF_SLOT − card height. The card's last
                         // line is the venue, so HALF_SLOT must exceed the full card
                         // height (incl. venue ≈118px) or the next card covers the venue.
const BRACKET_CARD = 82  // card height (used only for vertical centering, not the gap)
const HALF_HEIGHT  = 8 * HALF_SLOT  // 1056px

const scores        = inject('scores')
const standingsData = inject('standingsData')
const openMatchEdit = inject('openMatchEdit')
const openSquad     = inject('openSquad')
const highlightIdx  = inject('highlightIdx')

const flashingIdx = ref(null)

// When arriving from elsewhere (e.g. the home page), scroll the target knockout
// match into view and flash it.
onMounted(async () => {
  const idx = highlightIdx.value
  if (idx == null) return
  await nextTick()
  setTimeout(() => {
    const el = document.getElementById(`bracket-match-${idx}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    flashingIdx.value = idx
    setTimeout(() => { flashingIdx.value = null; highlightIdx.value = null }, 2400)
  }, 80)
})

// 9 columns: R32 | R16 | QF | SF | Final | SF | QF | R16 | R32
const allColumns = computed(() => {
  const rm = standingsData.value.resolvedMatches
  const tag = (m, i, base) => ({ ...m, _origIdx: base + i })
  return [
    { key: 'l-r32', label: 'Round of 32',  depth: 0, matches: rm.slice(72, 80).map((m,i) => tag(m,i,72)) },
    { key: 'l-r16', label: 'Round of 16',  depth: 1, matches: rm.slice(88, 92).map((m,i) => tag(m,i,88)) },
    { key: 'l-qf',  label: 'Quarterfinal', depth: 2, matches: rm.slice(96, 98).map((m,i) => tag(m,i,96)) },
    { key: 'l-sf',  label: 'Semifinal',    depth: 3, matches: [{ ...rm[100], _origIdx: 100 }] },
    { key: 'final', label: '🏆 Final',     depth: 3, matches: [{ ...rm[103], _origIdx: 103 }], isFinal: true },
    { key: 'r-sf',  label: 'Semifinal',    depth: 3, matches: [{ ...rm[101], _origIdx: 101 }] },
    { key: 'r-qf',  label: 'Quarterfinal', depth: 2, matches: rm.slice(98, 100).map((m,i) => tag(m,i,98)) },
    { key: 'r-r16', label: 'Round of 16',  depth: 1, matches: rm.slice(92, 96).map((m,i) => tag(m,i,92)) },
    { key: 'r-r32', label: 'Round of 32',  depth: 0, matches: rm.slice(80, 88).map((m,i) => tag(m,i,80)) },
  ]
})

const thirdPlace = computed(() => ({ ...standingsData.value.resolvedMatches[102], _origIdx: 102 }))

// depth 0=R32(8 matches), 1=R16(4), 2=QF(2), 3=SF+Final(1)
function bracketTop(depth, matchIdx) {
  const slotSize = HALF_SLOT * Math.pow(2, depth)
  return matchIdx * slotSize + slotSize / 2 - BRACKET_CARD / 2
}

function hasScore(idx) {
  const s = scores.value[idx]
  return s != null && s.score1 !== '' && s.score2 !== ''
}
function goalsOf(idx, n) { return parseGoals(scores.value[idx]?.['score' + n]) }
function pensOf(idx, n)  { return parsePens(scores.value[idx]?.['score' + n]) }
// Winner is by goals, then penalty shootout if goals are level (knockout).
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
function isReal(name) {
  return !['TBD', 'Winner', 'Runner', 'Best'].some(p => name.startsWith(p))
}
function stageColor(stage) {
  return STAGE_COLORS[stage] ?? STAGE_COLORS['Group Stage']
}
</script>
