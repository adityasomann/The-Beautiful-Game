<template>
  <div style="max-width:1200px;margin:0 auto;padding:24px 16px 40px">
    <GroupStandings
      :standings="standingsData.standings"
      :complete="standingsData.complete"
      :matchCounts="standingsData.matchCounts"
    />

    <!-- Best 3rd Place Tracker -->
    <div v-if="standingsData.thirdsTracker.length > 0" style="margin-top:32px;border-top:1px solid #1e3a6e33;padding-top:24px">
      <div style="margin-bottom:14px">
        <div style="font-size:11px;letter-spacing:3px;color:#60a5fa;text-transform:uppercase;margin-bottom:4px">Best 3rd Place Race</div>
        <div style="font-size:12px;color:#475569">Top 8 of 12 third-place teams advance to the Round of 32</div>
      </div>
      <div style="background:#0c1a2e;border:1px solid #1e3a6e44;border-radius:10px;overflow:hidden">
        <table style="width:100%;border-collapse:collapse;font-size:12px;font-family:Georgia,serif">
          <thead>
            <tr style="background:#0a1628">
              <th style="text-align:left;padding:7px 4px 7px 12px;color:#334155;font-size:10px;letter-spacing:1px;font-weight:400;border-bottom:1px solid #1e3a6e33">#</th>
              <th style="text-align:left;padding:7px 4px;color:#334155;font-size:10px;letter-spacing:1px;font-weight:400;border-bottom:1px solid #1e3a6e33">Team</th>
              <th style="text-align:center;padding:7px 4px;color:#334155;font-size:10px;letter-spacing:1px;font-weight:400;border-bottom:1px solid #1e3a6e33">Grp</th>
              <th v-for="col in ['P','W','D','L','GF','GA','GD','Pts']" :key="col"
                style="text-align:center;color:#334155;font-size:10px;letter-spacing:1px;padding:7px 4px;font-weight:400;border-bottom:1px solid #1e3a6e33">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, idx) in standingsData.thirdsTracker" :key="team.name"
              :style="{ background: idx < 8 ? '#0d1f38' : 'transparent' }">
              <td style="padding:7px 4px 7px 12px;border-bottom:1px solid #0d1f3822">
                <span :style="{ color: idx < 8 ? '#3b82f6' : '#1e3a6e', fontSize: '11px', fontWeight: idx < 8 ? 700 : 400 }">{{ idx + 1 }}</span>
              </td>
              <td style="padding:7px 4px;border-bottom:1px solid #0d1f3822">
                <div style="display:flex;align-items:center;gap:5px">
                  <span style="font-size:13px">{{ COUNTRY_FLAGS[team.name] ?? '' }}</span>
                  <span :style="{ color: idx < 8 ? '#cbd5e1' : '#475569' }">{{ team.name }}</span>
                  <span v-if="idx === 7 && standingsData.thirdsTracker.length > 8"
                    style="font-size:9px;letter-spacing:1px;color:#3b82f6;background:#1e40af22;border:1px solid #3b82f655;border-radius:3px;padding:1px 5px;flex-shrink:0">LAST</span>
                </div>
              </td>
              <td style="text-align:center;padding:7px 4px;border-bottom:1px solid #0d1f3822">
                <span :style="{ fontSize: '10px', color: team.complete ? '#22c55e' : '#f59e0b' }">{{ team.group.replace('Group ', '') }}</span>
              </td>
              <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.P }}</td>
              <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.W }}</td>
              <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.D }}</td>
              <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.L }}</td>
              <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.GF }}</td>
              <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.GA }}</td>
              <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.GD > 0 ? '+' + team.GD : team.GD }}</td>
              <td style="text-align:center;font-weight:700;padding:7px 4px;border-bottom:1px solid #0d1f3822"
                :style="{ color: idx < 8 ? '#e2e8f0' : '#475569' }">{{ team.Pts }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="display:flex;gap:20px;padding:10px 2px 0;font-size:11px;letter-spacing:0.5px;color:#334155">
        <span>{{ standingsData.thirdsTracker.length }}/12 groups have results</span>
        <span style="color:#22c55e">● Final</span>
        <span style="color:#f59e0b">● Live</span>
        <span style="color:#3b82f6;margin-left:auto">Top 8 advance</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { COUNTRY_FLAGS } from '../data/constants.js'
import GroupStandings from './GroupStandings.vue'

const standingsData = inject('standingsData')
</script>
