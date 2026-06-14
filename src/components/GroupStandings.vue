<template>
  <div class="standings-outer">
    <div class="groups-grid">
      <div v-for="[group, teams] in groupEntries" :key="group" class="group-block">
        <div class="group-head">
          <span class="group-name">{{ group }}</span>
          <span v-if="complete[group]" class="badge-final">FINAL</span>
          <span v-else-if="teams.some(t => t.P > 0)" class="badge-live">IN PROGRESS</span>
        </div>
        <table class="group-table">
          <thead>
            <tr>
              <th class="th-team">Team</th>
              <th title="Played">P</th>
              <th title="Won">W</th>
              <th title="Drawn">D</th>
              <th title="Lost">L</th>
              <th title="Goals For">GF</th>
              <th title="Goals Against">GA</th>
              <th title="Goal Difference">GD</th>
              <th class="th-pts" title="Points">Pts</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(team, pos) in teams"
              :key="team.name"
              :class="rowClass(pos)"
            >
              <td class="td-team">
                <div class="team-cell">
                  <span class="pos-num">{{ pos + 1 }}</span>
                  <span class="flag">{{ COUNTRY_FLAGS[team.name] ?? '' }}</span>
                  <span class="tname">{{ team.name }}</span>
                </div>
              </td>
              <td>{{ team.P }}</td>
              <td>{{ team.W }}</td>
              <td>{{ team.D }}</td>
              <td>{{ team.L }}</td>
              <td>{{ team.GF }}</td>
              <td>{{ team.GA }}</td>
              <td>{{ team.GD > 0 ? '+' + team.GD : team.GD }}</td>
              <td class="td-pts">{{ team.Pts }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="legend">
      <span class="leg-item leg-advance">▌ Advance to Round of 32</span>
      <span class="leg-item leg-third">▌ Potential 3rd-place qualifier</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { COUNTRY_FLAGS, GROUPS } from '../data/constants.js'

const props = defineProps({
  standings: { type: Object, required: true },
  complete:  { type: Object, required: true },
})

const groupEntries = computed(() =>
  GROUPS
    .filter(g => g !== 'All Groups')
    .map(g => [g, props.standings[g] ?? []])
)

function rowClass(pos) {
  if (pos < 2) return 'row-advance'
  if (pos === 2) return 'row-third'
  return ''
}
</script>

<style scoped>
.standings-outer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 40px;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

/* ── Group card ─────────────────────────────── */
.group-block {
  background: #0c1a2e;
  border: 1px solid #1e3a6e44;
  border-radius: 10px;
  overflow: hidden;
}

.group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 14px;
  background: #0a1628;
  border-bottom: 1px solid #1e3a6e44;
}

.group-name {
  font-size: 12px;
  letter-spacing: 2px;
  color: #60a5fa;
  font-weight: 600;
}

.badge-final {
  font-size: 9px;
  letter-spacing: 1px;
  color: #22c55e;
  background: #14532d33;
  border: 1px solid #22c55e55;
  border-radius: 3px;
  padding: 2px 6px;
}

.badge-live {
  font-size: 9px;
  letter-spacing: 1px;
  color: #f59e0b;
  background: #78350f33;
  border: 1px solid #f59e0b55;
  border-radius: 3px;
  padding: 2px 6px;
}

/* ── Table ──────────────────────────────────── */
.group-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  font-family: Georgia, serif;
}

.group-table th {
  text-align: center;
  color: #334155;
  font-size: 10px;
  letter-spacing: 1px;
  padding: 5px 4px;
  border-bottom: 1px solid #1e3a6e22;
  font-weight: 400;
}

.th-team { text-align: left; padding-left: 10px; }
.th-pts  { color: #475569; }

.group-table td {
  text-align: center;
  padding: 6px 4px;
  color: #64748b;
  border-bottom: 1px solid #0d1f3822;
}

.group-table tr:last-child td { border-bottom: none; }

.td-team { text-align: left; }

.team-cell {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 8px;
}

.pos-num {
  color: #1e3a6e;
  font-size: 10px;
  width: 10px;
  flex-shrink: 0;
}

.flag { font-size: 13px; }

.tname {
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
}

.td-pts {
  font-weight: 700;
  color: #94a3b8;
}

/* ── Row states ─────────────────────────────── */
.row-advance td { background: #0d1f38; }
.row-advance .tname { color: #cbd5e1; }
.row-advance .td-pts { color: #e2e8f0; }
.row-advance .pos-num { color: #3b82f6; }

.row-third td { background: #1a1205; }
.row-third .tname { color: #b45309; }
.row-third .td-pts { color: #d97706; }

/* ── Legend ─────────────────────────────────── */
.legend {
  display: flex;
  gap: 24px;
  padding: 14px 2px 0;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: #334155;
}

.leg-advance { color: #3b82f6; }
.leg-third   { color: #d97706; }

/* ── Responsive ─────────────────────────────── */
@media (max-width: 960px) {
  .groups-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 580px) {
  .groups-grid { grid-template-columns: 1fr; }
  .tname { max-width: 120px; }
}
</style>
