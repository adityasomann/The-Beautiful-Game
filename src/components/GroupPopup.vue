<template>
  <div v-if="group" @click="$emit('close')"
    style="position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)">
    <div @click.stop
      style="background:var(--c-bg-deep);border:1px solid var(--c-border);border-radius:16px;padding:28px;width:100%;max-width:480px;max-height:82vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.7)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
        <div>
          <div style="font-size:11px;letter-spacing:3px;color:var(--c-accent);text-transform:uppercase;margin-bottom:4px">Group Standings</div>
          <h2 style="margin:0 0 4px;font-size:24px;color:var(--c-t5);font-family:Georgia,serif">{{ group }}</h2>
          <div style="font-size:12px;color:var(--c-t2)">
            {{ standingsData.matchCounts[group]?.played ?? 0 }} / {{ standingsData.matchCounts[group]?.total ?? 6 }} matches played
          </div>
        </div>
        <button @click="$emit('close')"
          style="background:transparent;border:1px solid var(--c-border-solid);color:var(--c-t2);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:16px">✕</button>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;font-family:Georgia,serif">
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
      <div style="display:flex;gap:20px;padding:12px 2px 0;font-size:11px;letter-spacing:0.5px;color:var(--c-t0)">
        <span style="color:#3b82f6">▌ Advance</span>
        <span style="color:#d97706">▌ Potential 3rd-place qualifier</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import { COUNTRY_FLAGS } from '../data/constants.js'

const props = defineProps({ group: String })
defineEmits(['close'])

const standingsData = inject('standingsData')

const teams = computed(() => standingsData.value.standings[props.group] ?? [])
</script>
