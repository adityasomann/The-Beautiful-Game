<template>
  <!-- Edit mode -->
  <div v-if="isEditing" class="card-edit">
    <div class="score-entry">
      <span class="se-team se-team--left">
        {{ COUNTRY_FLAGS[match.team1] ?? '' }} {{ match.team1 }}
      </span>
      <input
        v-model="editBuf.score1"
        type="number"
        min="0"
        class="score-input"
        placeholder="0"
        @keyup.enter="save"
      />
      <span class="se-sep">—</span>
      <input
        v-model="editBuf.score2"
        type="number"
        min="0"
        class="score-input"
        placeholder="0"
        @keyup.enter="save"
      />
      <span class="se-team se-team--right">
        {{ COUNTRY_FLAGS[match.team2] ?? '' }} {{ match.team2 }}
      </span>
    </div>
    <div class="edit-actions">
      <button class="btn-cancel" @click="cancel">Cancel</button>
      <button v-if="hasScore" class="btn-delete" @click="clearScore">Delete Score</button>
      <button class="btn-save" @click="save">Save Score</button>
    </div>
  </div>

  <!-- View mode -->
  <div
    v-else
    class="card-view"
    :style="{
      '--accent': stageColor.accent,
      '--badge-color': stageColor.badge,
    }"
  >
    <!--
      Teams are first in DOM so they appear first on mobile (column layout).
      On desktop they're pushed after the time column via CSS order.
    -->
    <div class="match-teams">
      <button
        v-if="isReal(match.team1)"
        class="team-name team-name--btn"
        :class="{ 'team-name--winner': score1Wins }"
        :aria-label="`View ${match.team1} squad`"
        @click="$emit('squadClick', match.team1)"
      >{{ COUNTRY_FLAGS[match.team1] }} {{ match.team1 }}</button>
      <span v-else class="team-name" :class="{ 'team-name--winner': score1Wins }">{{ match.team1 }}</span>

      <template v-if="hasScore">
        <span class="score-val" :class="{ 'score-val--win': score1Wins }">{{ match.score1 }}</span>
        <span class="score-sep">–</span>
        <span class="score-val" :class="{ 'score-val--win': score2Wins }">{{ match.score2 }}</span>
      </template>
      <span v-else class="vs">vs</span>

      <button
        v-if="isReal(match.team2)"
        class="team-name team-name--btn"
        :class="{ 'team-name--winner': score2Wins }"
        :aria-label="`View ${match.team2} squad`"
        @click="$emit('squadClick', match.team2)"
      >{{ COUNTRY_FLAGS[match.team2] }} {{ match.team2 }}</button>
      <span v-else class="team-name" :class="{ 'team-name--winner': score2Wins }">{{ match.team2 }}</span>
    </div>

    <!-- Time + venue: order: -1 puts this before teams on desktop -->
    <div class="match-time-col">
      <span class="match-time">{{ match.time }}</span>
      <span v-if="match.venue" class="match-venue">{{ match.venue }}</span>
    </div>

    <div class="match-meta">
      <span v-if="match.group" class="badge">{{ match.group }}</span>
      <span class="badge">{{ match.stage }}</span>
      <button class="edit-btn" aria-label="Edit match" @click="startEdit">✎</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { STAGE_COLORS, COUNTRY_FLAGS } from '../data/constants.js'

const props = defineProps({ match: Object })
const emit  = defineEmits(['save', 'squadClick'])

const isEditing = ref(false)
const editBuf   = ref({})

const stageColor = computed(() => STAGE_COLORS[props.match.stage] ?? STAGE_COLORS["Group Stage"])

const hasScore   = computed(() => props.match.score1 !== "" && props.match.score2 !== "")
const score1Wins = computed(() => hasScore.value && Number(props.match.score1) > Number(props.match.score2))
const score2Wins = computed(() => hasScore.value && Number(props.match.score2) > Number(props.match.score1))

function isReal(name) {
  return !["TBD", "Winner", "Runner", "Best"].some(p => name.startsWith(p))
}

function startEdit() {
  const { _origIdx, ...rest } = props.match
  editBuf.value = rest
  isEditing.value = true
}

function save() {
  emit('save', { origIdx: props.match._origIdx, data: { ...editBuf.value } })
  isEditing.value = false
}

function clearScore() {
  emit('save', { origIdx: props.match._origIdx, data: { ...editBuf.value, score1: '', score2: '' } })
  isEditing.value = false
}

function cancel() {
  isEditing.value = false
}
</script>

<style scoped>
/* ── Edit mode ───────────────────────────────────── */
.card-edit {
  background: #0f1e35;
  border: 1px solid #3b82f644;
  border-left: 3px solid #3b82f6;
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-entry {
  display: flex;
  align-items: center;
  gap: 10px;
}

.se-team {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.se-team--left  { text-align: right; }
.se-team--right { text-align: left; }

.score-input {
  background: #0d1f38;
  border: 1px solid #3b82f655;
  color: #e2e8f0;
  border-radius: 6px;
  padding: 8px 0;
  font-size: 22px;
  font-weight: 700;
  font-family: Georgia, serif;
  width: 52px;
  text-align: center;
  outline: none;
  flex-shrink: 0;
  -moz-appearance: textfield;
}

.score-input::-webkit-inner-spin-button,
.score-input::-webkit-outer-spin-button { -webkit-appearance: none; }

.score-input:focus {
  border-color: #3b82f6;
  background: #0a1f40;
}

.se-sep {
  color: #334155;
  font-size: 18px;
  flex-shrink: 0;
}

.edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-cancel {
  background: transparent;
  color: #64748b;
  border: 1px solid #1e3a6e;
  border-radius: 6px;
  padding: 7px 18px;
  font-size: 12px;
  cursor: pointer;
  font-family: Georgia, serif;
}

.btn-delete {
  background: transparent;
  color: #ef4444;
  border: 1px solid #7f1d1d;
  border-radius: 6px;
  padding: 7px 18px;
  font-size: 12px;
  cursor: pointer;
  font-family: Georgia, serif;
}

.btn-delete:hover {
  background: #7f1d1d33;
}

.btn-save {
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 18px;
  font-size: 12px;
  cursor: pointer;
  font-family: Georgia, serif;
}

/* ── View mode ───────────────────────────────────── */
.card-view {
  background: #0c1a2e;
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-left: 3px solid var(--badge-color);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  transition: background 0.15s;
}

.card-view:hover {
  background: #0f2040;
}

/* Teams: order 1 on desktop so time-col (order -1) appears first */
.match-teams {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  min-width: 200px;
  order: 1;
}

/* Time+venue column appears first on desktop via order: -1 */
.match-time-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 110px;
  flex-shrink: 0;
  order: -1;
}

.match-time {
  color: #60a5fa;
  font-size: 13px;
  font-style: italic;
}

.match-venue {
  color: #475569;
  font-size: 11px;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.match-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
  order: 2;
}

.team-name {
  color: #94a3b8;
  border-radius: 4px;
  display: inline-block;
}

.team-name--btn {
  color: #f1f5f9;
  padding: 1px 5px;
  cursor: pointer;
  background: none;
  border: none;
  font: inherit;
  border-radius: 4px;
}

.team-name--btn:hover {
  background: #1e40af44;
  color: #93c5fd;
}

.team-name--btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.team-name--winner {
  color: #f1f5f9;
}

.vs {
  color: #334155;
  font-size: 12px;
  font-weight: 400;
  font-style: italic;
}

.score-val {
  color: #475569;
  font-size: 18px;
  font-weight: 700;
  min-width: 16px;
  text-align: center;
}

.score-val--win {
  color: #e2e8f0;
}

.score-sep {
  color: #334155;
  font-size: 14px;
  font-weight: 400;
}

.badge {
  background: color-mix(in srgb, var(--badge-color) 13%, transparent);
  color: var(--badge-color);
  border: 1px solid color-mix(in srgb, var(--badge-color) 27%, transparent);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  letter-spacing: 1px;
}

.edit-btn {
  background: transparent;
  border: none;
  color: #334155;
  font-size: 13px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.15s;
  font-family: Georgia, serif;
  line-height: 1;
}

.edit-btn:hover { color: #60a5fa; }

.edit-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* ── Mobile ──────────────────────────────────────── */
@media (max-width: 580px) {
  .card-view {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
  }

  /* Teams move to top of column */
  .match-teams {
    order: -2;
    min-width: unset;
    width: 100%;
    font-size: 16px;
    flex-wrap: wrap;
  }

  /* Time+venue become a single horizontal row below teams */
  .match-time-col {
    order: -1;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    min-width: unset;
  }

  .match-venue::before {
    content: "·  ";
    color: #334155;
  }

  /* Meta sits at the bottom */
  .match-meta {
    order: 0;
    flex-wrap: wrap;
  }
}
</style>
