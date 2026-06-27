<template>
  <div v-if="match" @click="$emit('close')"
    style="position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)">
    <div @click.stop
      style="background:var(--c-bg-deep);border:1px solid var(--c-border);border-radius:16px;padding:26px;width:100%;max-width:420px;box-shadow:0 25px 60px rgba(0,0,0,0.7)">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
        <div>
          <div style="font-size:11px;letter-spacing:3px;color:var(--c-accent);text-transform:uppercase;margin-bottom:4px">{{ match.stage }}</div>
          <h2 style="margin:0;font-size:20px;color:var(--c-t5);font-family:Georgia,serif">Edit Result</h2>
          <div style="font-size:11px;color:var(--c-t1);margin-top:3px">{{ match.date }} · {{ match.time }}</div>
        </div>
        <button @click="$emit('close')"
          style="background:transparent;border:1px solid var(--c-border-solid);color:var(--c-t2);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:16px">✕</button>
      </div>

      <!-- Goals -->
      <div style="display:flex;flex-direction:column;gap:10px">
        <div v-for="n in [1, 2]" :key="n" style="display:flex;align-items:center;gap:10px">
          <span style="font-size:18px">{{ COUNTRY_FLAGS[teamName(n)] ?? '' }}</span>
          <span style="flex:1;color:var(--c-t3);font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
            :style="{ fontStyle: confirmed(n) === false ? 'italic' : 'normal' }">{{ teamName(n) }}</span>
          <input v-model="editBuf['score' + n]" type="number" min="0" @keyup.enter="saveEdit(idx)"
            style="background:var(--c-bg-input);border:1px solid #3b82f655;color:var(--c-t4);border-radius:6px;padding:7px 0;font-size:20px;font-weight:700;font-family:Georgia,serif;width:54px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
        </div>
      </div>

      <!-- Penalty shootout (only when goals are level) -->
      <div v-if="isDraw" style="margin-top:16px;border-top:1px dashed var(--c-border-solid);padding-top:14px">
        <div style="font-size:10px;letter-spacing:2px;color:#f59e0b;text-transform:uppercase;margin-bottom:10px">⚽ Penalty Shootout</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div v-for="n in [1, 2]" :key="n" style="display:flex;align-items:center;gap:10px">
            <span style="font-size:16px">{{ COUNTRY_FLAGS[teamName(n)] ?? '' }}</span>
            <span style="flex:1;color:var(--c-t2);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ teamName(n) }}</span>
            <input v-model="editBuf['pen' + n]" type="number" min="0" @keyup.enter="saveEdit(idx)"
              placeholder="–"
              style="background:var(--c-bg-input);border:1px solid #f59e0b55;color:var(--c-t4);border-radius:6px;padding:5px 0;font-size:16px;font-weight:700;font-family:Georgia,serif;width:46px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
          </div>
        </div>
        <div v-if="penWinner" style="margin-top:10px;font-size:12px;color:var(--c-t2);text-align:center">
          {{ COUNTRY_FLAGS[penWinner] ?? '' }} <span style="color:#22c55e;font-weight:700">{{ penWinner }}</span> advance on penalties
        </div>
        <div v-else style="margin-top:10px;font-size:11px;color:var(--c-t1);text-align:center;font-style:italic">
          Enter shootout score to decide who advances
        </div>
      </div>

      <!-- Actions -->
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:22px">
        <button @click="$emit('close')"
          style="background:transparent;color:var(--c-t2);border:1px solid var(--c-border-solid);border-radius:6px;padding:8px 18px;font-size:12px;cursor:pointer;font-family:Georgia,serif">Cancel</button>
        <button v-if="hasScore" @click="clearScore(idx)"
          style="background:transparent;color:#ef4444;border:1px solid #7f1d1d;border-radius:6px;padding:8px 16px;font-size:12px;cursor:pointer;font-family:Georgia,serif">Delete</button>
        <button @click="saveEdit(idx)"
          style="background:#1d4ed8;color:#fff;border:none;border-radius:6px;padding:8px 20px;font-size:12px;cursor:pointer;font-family:Georgia,serif">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import { COUNTRY_FLAGS } from '../data/constants.js'

const props = defineProps({ idx: { type: Number, default: null } })
defineEmits(['close'])

const scores        = inject('scores')
const editBuf       = inject('editBuf')
const standingsData = inject('standingsData')
const saveEdit      = inject('saveEdit')
const clearScore    = inject('clearScore')

const match = computed(() =>
  props.idx == null ? null : standingsData.value.resolvedMatches[props.idx] ?? null
)

function teamName(n) { return match.value?.['team' + n] ?? '' }
function confirmed(n) { return match.value?.['team' + n + 'Confirmed'] }

const isDraw = computed(() => {
  const a = editBuf.value.score1, b = editBuf.value.score2
  return a !== '' && a != null && b !== '' && b != null && Number(a) === Number(b)
})

const hasScore = computed(() => {
  const s = scores.value[props.idx]
  return s != null && s.score1 !== '' && s.score2 !== ''
})

const penWinner = computed(() => {
  if (!isDraw.value) return null
  const p1 = editBuf.value.pen1, p2 = editBuf.value.pen2
  if (p1 === '' || p2 === '' || p1 == null || p2 == null || Number(p1) === Number(p2)) return null
  return Number(p1) > Number(p2) ? teamName(1) : teamName(2)
})
</script>
