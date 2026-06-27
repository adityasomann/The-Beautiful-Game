// A stored score string normally holds goals ("2"). Knockout draws decided on
// penalties encode the shootout in parentheses: "2(5)" = 2 goals, 5 penalties.
// This keeps everything inside the existing score1/score2 string fields, which is
// all the backend persists.

export function parseGoals(v) {
  if (v == null || v === '') return null
  const m = String(v).match(/^(\d+)/)
  return m ? Number(m[1]) : null
}

export function parsePens(v) {
  if (v == null || v === '') return null
  const m = String(v).match(/\((\d+)\)/)
  return m ? Number(m[1]) : null
}

// Combine a goals value and an optional penalty value into the stored string.
// Empty goals → "" (no score). Empty/absent pens → plain goals.
export function formatScore(goals, pens) {
  const g = goals === 0 || goals ? String(goals) : ''
  if (g === '') return ''
  const hasPen = pens === 0 || pens
  return hasPen ? `${g}(${pens})` : g
}
