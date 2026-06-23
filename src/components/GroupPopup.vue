<template>
  <div v-if="group" @click="$emit('close')"
    style="position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)">
    <div @click.stop
      style="background:var(--c-bg-deep);border:1px solid var(--c-border);border-radius:16px;padding:28px;width:100%;max-width:480px;max-height:82vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.7)">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
        <div>
          <div style="font-size:11px;letter-spacing:3px;color:var(--c-accent);text-transform:uppercase;margin-bottom:4px">
            {{ showThirds ? 'Best 3rd Place Race' : 'Group Standings' }}
          </div>
          <h2 style="margin:0 0 4px;font-size:24px;color:var(--c-t5);font-family:Georgia,serif">
            {{ showThirds ? '3rd Place' : group }}
          </h2>
          <div style="font-size:12px;color:var(--c-t2)">
            <template v-if="showThirds">Top 8 of 12 third-place teams advance to the Round of 32</template>
            <template v-else>{{ standingsData.matchCounts[group]?.played ?? 0 }} / {{ standingsData.matchCounts[group]?.total ?? 6 }} matches played</template>
          </div>
        </div>
        <button @click="$emit('close')"
          style="background:transparent;border:1px solid var(--c-border-solid);color:var(--c-t2);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:16px">✕</button>
      </div>

      <!-- Group standings table -->
      <table v-if="!showThirds" style="width:100%;border-collapse:collapse;font-size:13px;font-family:Georgia,serif">
        <thead>
          <tr>
            <th style="text-align:left;padding:6px 4px 6px 8px;color:var(--c-t0);font-size:10px;letter-spacing:1px;font-weight:400;border-bottom:1px solid var(--c-border)">Team</th>
            <th v-for="col in ['P','W','D','L','GF','GA','GD','Pts']" :key="col"
              style="text-align:center;color:var(--c-t0);font-size:10px;letter-spacing:1px;padding:6px 4px;font-weight:400;border-bottom:1px solid var(--c-border)">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, pos) in teams" :key="team.name"
            :style="{ background: pos < 2 ? 'var(--c-bg-input)' : pos === 2 ? 'var(--c-bg-warn)' : 'transparent' }">
            <td style="padding:8px 4px 8px 8px;border-bottom:1px solid var(--c-row-sep)">
              <div style="display:flex;align-items:center;gap:6px">
                <span :style="{ color: pos < 2 ? '#3b82f6' : 'var(--c-border-solid)', fontSize: '10px', width: '12px', flexShrink: 0 }">{{ pos + 1 }}</span>
                <span style="font-size:15px">{{ COUNTRY_FLAGS[team.name] ?? '' }}</span>
                <span :style="{ color: pos < 2 ? 'var(--c-advance-text)' : pos === 2 ? '#b45309' : 'var(--c-t2)' }">{{ team.name }}</span>
                <span v-if="team.clinch === 'first'"
                  style="font-size:9px;font-weight:700;background:var(--c-badge-first-bg);color:var(--c-badge-first-text);border:1px solid var(--c-badge-first-border);border-radius:3px;padding:1px 5px;flex-shrink:0">1ST</span>
                <span v-else-if="team.clinch === 'qualified'"
                  style="font-size:9px;font-weight:700;background:var(--c-badge-q-bg);color:var(--c-badge-q-text);border:1px solid var(--c-badge-q-border);border-radius:3px;padding:1px 5px;flex-shrink:0">Q</span>
                <span v-else-if="team.clinch === 'eliminated'"
                  style="font-size:9px;font-weight:700;background:var(--c-badge-e-bg);color:var(--c-badge-e-text);border:1px solid var(--c-badge-e-border);border-radius:3px;padding:1px 5px;flex-shrink:0">OUT</span>
              </div>
            </td>
            <td style="text-align:center;color:var(--c-t2);padding:8px 4px;border-bottom:1px solid var(--c-row-sep)">{{ team.P }}</td>
            <td style="text-align:center;color:var(--c-t2);padding:8px 4px;border-bottom:1px solid var(--c-row-sep)">{{ team.W }}</td>
            <td style="text-align:center;color:var(--c-t2);padding:8px 4px;border-bottom:1px solid var(--c-row-sep)">{{ team.D }}</td>
            <td style="text-align:center;color:var(--c-t2);padding:8px 4px;border-bottom:1px solid var(--c-row-sep)">{{ team.L }}</td>
            <td style="text-align:center;color:var(--c-t2);padding:8px 4px;border-bottom:1px solid var(--c-row-sep)">{{ team.GF }}</td>
            <td style="text-align:center;color:var(--c-t2);padding:8px 4px;border-bottom:1px solid var(--c-row-sep)">{{ team.GA }}</td>
            <td style="text-align:center;color:var(--c-t2);padding:8px 4px;border-bottom:1px solid var(--c-row-sep)">{{ team.GD > 0 ? '+' + team.GD : team.GD }}</td>
            <td style="text-align:center;font-weight:700;padding:8px 4px;border-bottom:1px solid var(--c-row-sep)"
              :style="{ color: pos < 2 ? 'var(--c-t4)' : pos === 2 ? '#d97706' : 'var(--c-t3)' }">{{ team.Pts }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Best 3rd-place standings table -->
      <table v-else style="width:100%;border-collapse:collapse;font-size:13px;font-family:Georgia,serif">
        <thead>
          <tr>
            <th style="text-align:left;padding:6px 4px 6px 8px;color:var(--c-t0);font-size:10px;letter-spacing:1px;font-weight:400;border-bottom:1px solid var(--c-border)">#</th>
            <th style="text-align:left;padding:6px 4px;color:var(--c-t0);font-size:10px;letter-spacing:1px;font-weight:400;border-bottom:1px solid var(--c-border)">Team</th>
            <th style="text-align:center;padding:6px 4px;color:var(--c-t0);font-size:10px;letter-spacing:1px;font-weight:400;border-bottom:1px solid var(--c-border)">Grp</th>
            <th v-for="col in ['GD','Pts']" :key="col"
              style="text-align:center;color:var(--c-t0);font-size:10px;letter-spacing:1px;padding:6px 4px;font-weight:400;border-bottom:1px solid var(--c-border)">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, idx) in thirds" :key="team.name"
            :style="{ background: idx < 8 ? 'var(--c-bg-input)' : 'transparent' }">
            <td style="padding:8px 4px 8px 8px;border-bottom:1px solid var(--c-row-sep)">
              <span :style="{ color: idx < 8 ? '#3b82f6' : 'var(--c-border-solid)', fontSize: '11px', fontWeight: idx < 8 ? 700 : 400 }">{{ idx + 1 }}</span>
            </td>
            <td style="padding:8px 4px;border-bottom:1px solid var(--c-row-sep)">
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:15px">{{ COUNTRY_FLAGS[team.name] ?? '' }}</span>
                <span :style="{ color: idx < 8 ? 'var(--c-advance-text)' : 'var(--c-t2)', fontWeight: team.group === group ? 700 : 400 }">{{ team.name }}</span>
                <span v-if="idx === 7 && thirds.length > 8"
                  style="font-size:9px;letter-spacing:1px;color:#3b82f6;background:#1e40af22;border:1px solid #3b82f655;border-radius:3px;padding:1px 5px;flex-shrink:0">LAST</span>
              </div>
            </td>
            <td style="text-align:center;padding:8px 4px;border-bottom:1px solid var(--c-row-sep)">
              <span :style="{ fontSize: '10px', color: team.complete ? '#22c55e' : '#f59e0b', fontWeight: team.group === group ? 700 : 400 }">{{ team.group.replace('Group ', '') }}</span>
            </td>
            <td style="text-align:center;color:var(--c-t2);padding:8px 4px;border-bottom:1px solid var(--c-row-sep)">{{ team.GD > 0 ? '+' + team.GD : team.GD }}</td>
            <td style="text-align:center;font-weight:700;padding:8px 4px;border-bottom:1px solid var(--c-row-sep)"
              :style="{ color: idx < 8 ? 'var(--c-t4)' : 'var(--c-t3)' }">{{ team.Pts }}</td>
          </tr>
          <tr v-if="thirds.length === 0">
            <td colspan="5" style="text-align:center;color:var(--c-t1);padding:18px 4px;font-size:12px">No third-place results yet</td>
          </tr>
        </tbody>
      </table>

      <!-- Footer: legend + toggle link -->
      <div style="display:flex;align-items:center;gap:16px;padding:12px 2px 0;font-size:11px;letter-spacing:0.5px;color:var(--c-t0)">
        <template v-if="!showThirds">
          <span style="color:#3b82f6">▌ Advance</span>
          <span style="color:#d97706">▌ Potential 3rd-place qualifier</span>
          <a @click="showThirds = true"
            style="margin-left:auto;color:var(--c-accent);cursor:pointer;white-space:nowrap;text-decoration:none;border-bottom:1px dotted var(--c-accent)">3rd-place standings →</a>
        </template>
        <template v-else>
          <span style="color:#22c55e">● Final</span>
          <span style="color:#f59e0b">● Live</span>
          <a @click="showThirds = false"
            style="margin-left:auto;color:var(--c-accent);cursor:pointer;white-space:nowrap;text-decoration:none;border-bottom:1px dotted var(--c-accent)">← Back to {{ group }}</a>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref, watch } from 'vue'
import { COUNTRY_FLAGS } from '../data/constants.js'

const props = defineProps({ group: String })
defineEmits(['close'])

const standingsData = inject('standingsData')

const teams  = computed(() => standingsData.value.standings[props.group] ?? [])
const thirds = computed(() => standingsData.value.thirdsTracker ?? [])

const showThirds = ref(false)
// Reset to the group view whenever a different group popup is opened.
watch(() => props.group, () => { showThirds.value = false })
</script>
