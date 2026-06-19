<template>
  <div v-if="country" class="overlay" @click="emit('close')" @keydown="handleKeydown">
    <div
      ref="modalRef"
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="squad-modal-title"
      tabindex="-1"
      @click.stop
    >
      <div class="modal-header">
        <div>
          <div class="eyebrow">World Cup 2026 Squad</div>
          <h2 id="squad-modal-title" class="title">{{ COUNTRY_FLAGS[country] ?? '' }} {{ country }}</h2>
          <div v-if="MANAGERS[country]" class="manager">Manager: <span>{{ MANAGERS[country] }}</span></div>
        </div>
        <button class="close-btn" aria-label="Close squad modal" @click="emit('close')">✕</button>
      </div>

      <div v-if="isTba" class="tba">
        <div class="tba-icon">📋</div>
        <div class="tba-text">Squad not yet officially announced</div>
        <div class="tba-sub">Final squads due June 2, 2026</div>
      </div>

      <template v-else>
        <div v-for="pos in positions" :key="pos.key" class="pos-group">
          <template v-if="squad[pos.key]?.length">
            <div class="pos-header">{{ pos.icon }} {{ pos.label }}</div>
            <div
              v-for="(p, i) in squad[pos.key]"
              :key="i"
              class="player-row"
              :class="{ 'player-row--alt': i % 2 === 0 }"
            >
              <span class="player-name">{{ p.name }}</span>
              <span class="player-club">{{ p.club }}</span>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { SQUADS } from '../data/squads.js'
import { positions, COUNTRY_FLAGS, MANAGERS } from '../data/constants.js'

const props = defineProps({ country: String })
const emit  = defineEmits(['close'])

const modalRef = ref(null)
let previousFocus = null

const squad = computed(() => SQUADS[props.country] ?? {})
const isTba = computed(() => !SQUADS[props.country])

watch(() => props.country, async (val) => {
  if (val) {
    previousFocus = document.activeElement
    await nextTick()
    modalRef.value?.focus()
  } else {
    previousFocus?.focus()
    previousFocus = null
  }
})

function handleKeydown(e) {
  if (e.key === 'Escape') {
    emit('close')
    return
  }
  if (e.key !== 'Tab' || !modalRef.value) return

  const focusable = [...modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )]
  if (!focusable.length) return

  const first = focusable[0]
  const last  = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  padding: 28px;
  width: 100%;
  max-width: 520px;
  max-height: 82vh;
  overflow-y: auto;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
  outline: none;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--c-accent);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.title {
  margin: 0;
  font-size: 24px;
  color: var(--c-t5);
  font-family: Georgia, serif;
  font-weight: normal;
}

.close-btn {
  background: transparent;
  border: 1px solid var(--c-border-solid);
  color: var(--c-t2);
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.close-btn:hover {
  border-color: #3b5a9e;
  color: var(--c-t3);
}

.manager {
  font-size: 12px;
  color: var(--c-t2);
  font-style: italic;
  margin-top: 4px;
}
.manager span { color: var(--c-t3); }

.tba {
  text-align: center;
  padding: 36px 0;
}

.tba-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.tba-text {
  font-size: 15px;
  color: var(--c-t2);
  margin-bottom: 6px;
}

.tba-sub {
  font-size: 12px;
  color: var(--c-t0);
  letter-spacing: 1px;
}

.pos-group {
  margin-bottom: 20px;
}

.pos-header {
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--c-accent);
  text-transform: uppercase;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  gap: 6px;
}

.player-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 5px 8px;
  border-radius: 5px;
}

.player-row--alt {
  background: var(--c-bg-card);
}

.player-name {
  color: var(--c-t4);
  font-size: 14px;
}

.player-club {
  color: var(--c-t1);
  font-size: 12px;
  font-style: italic;
  margin-left: 8px;
  flex-shrink: 0;
}
</style>
