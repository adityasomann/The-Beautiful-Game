<template>
  <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;padding:24px 0 48px">
    <div style="min-width:1000px;padding:0 20px">
      <!-- Round labels -->
      <div style="display:flex;margin-bottom:16px">
        <div v-for="col in bracketColumns" :key="col.label"
          style="width:200px;text-align:center;font-size:10px;letter-spacing:2px;color:var(--c-t1);text-transform:uppercase;flex-shrink:0">
          {{ col.label }}
        </div>
      </div>

      <!-- Bracket body -->
      <div :style="{ display: 'flex', position: 'relative', height: BRACKET_TOTAL + 'px' }">
        <div v-for="(col, colIdx) in bracketColumns" :key="col.label"
          style="width:200px;position:relative;flex-shrink:0">
          <div v-for="(m, i) in col.matches" :key="m._origIdx"
            :style="{ position: 'absolute', top: bracketTop(colIdx, i) + 'px', left: '6px', right: '6px', zIndex: editingIdx === m._origIdx ? 10 : 1 }">

            <!-- Edit mode -->
            <div v-if="editingIdx === m._origIdx"
              style="background:var(--c-bg-edit);border:1px solid #3b82f644;border-left:2px solid #3b82f6;border-radius:6px;padding:8px;font-size:12px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
                <span style="color:var(--c-t3);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px">{{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}</span>
                <input v-model="editBuf.score1" type="number" min="0" @keyup.enter="saveEdit(m._origIdx)"
                  style="background:var(--c-bg-input);border:1px solid #3b82f655;color:var(--c-t4);border-radius:4px;padding:3px 0;font-size:15px;font-weight:700;font-family:Georgia,serif;width:34px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
              </div>
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                <span style="color:var(--c-t3);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px">{{ COUNTRY_FLAGS[m.team2] ?? '' }} {{ m.team2 }}</span>
                <input v-model="editBuf.score2" type="number" min="0" @keyup.enter="saveEdit(m._origIdx)"
                  style="background:var(--c-bg-input);border:1px solid #3b82f655;color:var(--c-t4);border-radius:4px;padding:3px 0;font-size:15px;font-weight:700;font-family:Georgia,serif;width:34px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
              </div>
              <div style="display:flex;gap:4px">
                <button @click="cancelEdit" style="flex:1;background:transparent;color:var(--c-t2);border:1px solid var(--c-border-solid);border-radius:4px;padding:3px 0;font-size:10px;cursor:pointer;font-family:Georgia,serif">Cancel</button>
                <button v-if="hasScore(m._origIdx)" @click="clearScore(m._origIdx)" style="background:transparent;color:#ef4444;border:1px solid #7f1d1d;border-radius:4px;padding:3px 5px;font-size:10px;cursor:pointer;font-family:Georgia,serif">✕</button>
                <button @click="saveEdit(m._origIdx)" style="flex:1;background:#1d4ed8;color:#fff;border:none;border-radius:4px;padding:3px 0;font-size:10px;cursor:pointer;font-family:Georgia,serif">Save</button>
              </div>
            </div>

            <!-- View mode -->
            <div v-else :style="{ background: 'var(--c-bg-card)', border: `1px solid ${stageColor(m.stage).badge}44`, borderLeft: `2px solid ${stageColor(m.stage).badge}`, borderRadius: '6px', overflow: 'hidden', fontSize: '12px' }">
              <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', background: score1Wins(m._origIdx) ? 'var(--c-bg-win)' : 'transparent', borderBottom: '1px solid var(--c-row-sep-d)' }">
                <span :style="{ color: hasScore(m._origIdx) ? (score1Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t0)') : 'var(--c-t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px', cursor: isReal(m.team1) ? 'pointer' : 'default' }"
                  @click="isReal(m.team1) ? openSquad(m.team1) : null">
                  {{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}
                </span>
                <span v-if="hasScore(m._origIdx)" :style="{ fontSize: '13px', fontWeight: 700, color: score1Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t1)', flexShrink: 0, marginLeft: '4px' }">{{ scores[m._origIdx].score1 }}</span>
              </div>
              <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', background: score2Wins(m._origIdx) ? 'var(--c-bg-win)' : 'transparent', borderBottom: '1px solid var(--c-row-sep-d)' }">
                <span :style="{ color: hasScore(m._origIdx) ? (score2Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t0)') : 'var(--c-t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px', cursor: isReal(m.team2) ? 'pointer' : 'default' }"
                  @click="isReal(m.team2) ? openSquad(m.team2) : null">
                  {{ COUNTRY_FLAGS[m.team2] ?? '' }} {{ m.team2 }}
                </span>
                <span v-if="hasScore(m._origIdx)" :style="{ fontSize: '13px', fontWeight: 700, color: score2Wins(m._origIdx) ? 'var(--c-t5)' : 'var(--c-t1)', flexShrink: 0, marginLeft: '4px' }">{{ scores[m._origIdx].score2 }}</span>
              </div>
              <div style="border-top:1px solid var(--c-row-sep);padding:3px 8px">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:9px;color:var(--c-t0);letter-spacing:0.3px">{{ m.date }} · {{ m.time }}</span>
                  <div @click="startEdit(m._origIdx)" style="color:var(--c-border-solid);font-size:11px;cursor:pointer;padding:1px 3px;border-radius:3px;transition:color 0.15s"
                    @mouseenter="e => e.currentTarget.style.color = 'var(--c-accent)'"
                    @mouseleave="e => e.currentTarget.style.color = 'var(--c-border-solid)'">✎</div>
                </div>
                <div v-if="m.venue" style="font-size:9px;color:var(--c-border-solid);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px">📍 {{ m.venue }}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 3rd Place -->
      <div style="max-width:400px;margin:36px auto 0;border-top:1px solid var(--c-border-2);padding-top:24px">
        <div style="text-align:center;margin-bottom:10px">
          <div style="font-size:10px;letter-spacing:2px;color:#b45309;text-transform:uppercase">3rd Place</div>
          <div style="font-size:11px;color:var(--c-t1);margin-top:3px">{{ bracketThirdPlace.date }} · {{ bracketThirdPlace.time }}</div>
          <div v-if="bracketThirdPlace.venue" style="font-size:11px;color:var(--c-t0);margin-top:1px">📍 {{ bracketThirdPlace.venue }}</div>
        </div>

        <!-- 3rd Place edit mode -->
        <div v-if="editingIdx === 102"
          style="background:var(--c-bg-edit);border:1px solid #3b82f644;border-left:2px solid #3b82f6;border-radius:6px;padding:12px;font-size:13px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="color:var(--c-t3);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ COUNTRY_FLAGS[bracketThirdPlace.team1] ?? '' }} {{ bracketThirdPlace.team1 }}</span>
            <input v-model="editBuf.score1" type="number" min="0" @keyup.enter="saveEdit(102)"
              style="background:var(--c-bg-input);border:1px solid #3b82f655;color:var(--c-t4);border-radius:4px;padding:4px 0;font-size:18px;font-weight:700;font-family:Georgia,serif;width:40px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <span style="color:var(--c-t3);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ COUNTRY_FLAGS[bracketThirdPlace.team2] ?? '' }} {{ bracketThirdPlace.team2 }}</span>
            <input v-model="editBuf.score2" type="number" min="0" @keyup.enter="saveEdit(102)"
              style="background:var(--c-bg-input);border:1px solid #3b82f655;color:var(--c-t4);border-radius:4px;padding:4px 0;font-size:18px;font-weight:700;font-family:Georgia,serif;width:40px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
          </div>
          <div style="display:flex;gap:6px;justify-content:flex-end">
            <button @click="cancelEdit" style="background:transparent;color:var(--c-t2);border:1px solid var(--c-border-solid);border-radius:4px;padding:5px 14px;font-size:11px;cursor:pointer;font-family:Georgia,serif">Cancel</button>
            <button v-if="hasScore(102)" @click="clearScore(102)" style="background:transparent;color:#ef4444;border:1px solid #7f1d1d;border-radius:4px;padding:5px 14px;font-size:11px;cursor:pointer;font-family:Georgia,serif">Delete</button>
            <button @click="saveEdit(102)" style="background:#1d4ed8;color:#fff;border:none;border-radius:4px;padding:5px 14px;font-size:11px;cursor:pointer;font-family:Georgia,serif">Save</button>
          </div>
        </div>

        <!-- 3rd Place view mode -->
        <div v-else style="background:var(--c-bg-card);border:1px solid #b4530933;border-left:2px solid #b45309;border-radius:6px;overflow:hidden;font-size:13px">
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', background: score1Wins(102) ? 'var(--c-bg-win)' : 'transparent', borderBottom: '1px solid var(--c-row-sep-d)' }">
            <span :style="{ color: hasScore(102) ? (score1Wins(102) ? 'var(--c-t5)' : 'var(--c-t1)') : 'var(--c-t3)', cursor: isReal(bracketThirdPlace.team1) ? 'pointer' : 'default' }"
              @click="isReal(bracketThirdPlace.team1) ? openSquad(bracketThirdPlace.team1) : null">
              {{ COUNTRY_FLAGS[bracketThirdPlace.team1] ?? '' }} {{ bracketThirdPlace.team1 }}
            </span>
            <span v-if="hasScore(102)" :style="{ fontWeight: 700, color: score1Wins(102) ? 'var(--c-t5)' : 'var(--c-t2)' }">{{ scores[102].score1 }}</span>
          </div>
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', background: score2Wins(102) ? 'var(--c-bg-win)' : 'transparent', borderBottom: '1px solid var(--c-row-sep-d)' }">
            <span :style="{ color: hasScore(102) ? (score2Wins(102) ? 'var(--c-t5)' : 'var(--c-t1)') : 'var(--c-t3)', cursor: isReal(bracketThirdPlace.team2) ? 'pointer' : 'default' }"
              @click="isReal(bracketThirdPlace.team2) ? openSquad(bracketThirdPlace.team2) : null">
              {{ COUNTRY_FLAGS[bracketThirdPlace.team2] ?? '' }} {{ bracketThirdPlace.team2 }}
            </span>
            <span v-if="hasScore(102)" :style="{ fontWeight: 700, color: score2Wins(102) ? 'var(--c-t5)' : 'var(--c-t2)' }">{{ scores[102].score2 }}</span>
          </div>
          <div style="display:flex;justify-content:flex-end;padding:3px 8px;border-top:1px solid var(--c-row-sep)">
            <div @click="startEdit(102)" style="color:var(--c-border-solid);font-size:11px;cursor:pointer;padding:1px 3px;border-radius:3px;transition:color 0.15s"
              @mouseenter="e => e.currentTarget.style.color = 'var(--c-accent)'"
              @mouseleave="e => e.currentTarget.style.color = 'var(--c-border-solid)'">✎</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { COUNTRY_FLAGS, STAGE_COLORS } from '../data/constants.js'

const BRACKET_SLOT  = 96
const BRACKET_CARD  = 82
const BRACKET_TOTAL = 16 * BRACKET_SLOT

const scores      = inject('scores')
const editingIdx  = inject('editingIdx')
const editBuf     = inject('editBuf')
const standingsData = inject('standingsData')
const startEdit   = inject('startEdit')
const saveEdit    = inject('saveEdit')
const cancelEdit  = inject('cancelEdit')
const clearScore  = inject('clearScore')
const openSquad   = inject('openSquad')

const bracketColumns = computed(() => {
  const rm = standingsData.value.resolvedMatches
  return [
    { label: 'Round of 32',  matches: rm.slice(72, 88).map((m, i) => ({ ...m, _origIdx: 72 + i })) },
    { label: 'Round of 16',  matches: rm.slice(88, 96).map((m, i) => ({ ...m, _origIdx: 88 + i })) },
    { label: 'Quarterfinal', matches: rm.slice(96, 100).map((m, i) => ({ ...m, _origIdx: 96 + i })) },
    { label: 'Semifinal',    matches: rm.slice(100, 102).map((m, i) => ({ ...m, _origIdx: 100 + i })) },
    { label: 'Final',        matches: [{ ...rm[103], _origIdx: 103 }] },
  ]
})

const bracketThirdPlace = computed(() => ({
  ...standingsData.value.resolvedMatches[102], _origIdx: 102,
}))

function bracketTop(roundIdx, matchIdx) {
  const slotSize = BRACKET_SLOT * Math.pow(2, roundIdx)
  return matchIdx * slotSize + slotSize / 2 - BRACKET_CARD / 2
}

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

function isReal(name) {
  return !['TBD', 'Winner', 'Runner', 'Best'].some(p => name.startsWith(p))
}

function stageColor(stage) {
  return STAGE_COLORS[stage] ?? STAGE_COLORS['Group Stage']
}
</script>
