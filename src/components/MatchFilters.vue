<template>
  <div class="filters">
    <input
      v-model="search"
      placeholder="🔍  Search team or group..."
      class="filter-input"
    />
    <div class="filter-selects">
      <select v-model="stage" class="filter-select">
        <option v-for="s in STAGES" :key="s">{{ s }}</option>
      </select>
      <select v-model="group" class="filter-select">
        <option v-for="g in GROUPS" :key="g">{{ g }}</option>
      </select>
    </div>
    <span class="match-count">{{ count }} MATCHES</span>
  </div>
</template>

<script setup>
import { STAGES, GROUPS } from '../data/constants.js'

const search = defineModel('search')
const stage  = defineModel('stage')
const group  = defineModel('group')

defineProps({ count: Number })
</script>

<style scoped>
.filters {
  background: #0a1628;
  border-bottom: 1px solid #1e3a6e33;
  padding: 16px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.filter-input {
  background: #0d1f38;
  border: 1px solid #1e40af44;
  color: #e2e8f0;
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 13px;
  width: 200px;
  outline: none;
  font-family: Georgia, serif;
}

.filter-selects {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-select {
  background: #0d1f38;
  border: 1px solid #1e40af44;
  color: #e2e8f0;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 13px;
  outline: none;
  cursor: pointer;
  font-family: Georgia, serif;
}

.match-count {
  margin-left: auto;
  color: #64748b;
  font-size: 12px;
  letter-spacing: 1px;
  white-space: nowrap;
}

/* ── Mobile ──────────────────────────────────────── */
@media (max-width: 580px) {
  .filters {
    padding: 12px 16px;
    gap: 8px;
  }

  .filter-input {
    width: 100%;
    box-sizing: border-box;
  }

  .filter-selects {
    width: 100%;
  }

  .filter-select {
    flex: 1;
  }

  .match-count {
    margin-left: 0;
  }
}
</style>
