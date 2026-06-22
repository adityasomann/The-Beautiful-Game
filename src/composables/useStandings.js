import { computed } from 'vue'

export function useStandings(matchesWithScores) {
  const standingsData = computed(() => buildStandingsData(matchesWithScores.value))
  return { standingsData }
}

function buildStandingsData(rawMatches) {
  // 1. Accumulate group stage stats
  const groups = {}
  const totalPerGroup = {}
  const scoredPerGroup = {}

  for (const m of rawMatches) {
    if (m.stage !== 'Group Stage') continue
    const g = m.group
    if (!groups[g]) { groups[g] = {}; totalPerGroup[g] = 0; scoredPerGroup[g] = 0 }
    totalPerGroup[g]++

    for (const team of [m.team1, m.team2]) {
      if (!groups[g][team])
        groups[g][team] = { name: team, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }
    }

    if (m.score1 !== '' && m.score2 !== '') {
      scoredPerGroup[g]++
      const s1 = Number(m.score1), s2 = Number(m.score2)
      const t1 = groups[g][m.team1], t2 = groups[g][m.team2]
      t1.P++; t2.P++
      t1.GF += s1; t1.GA += s2
      t2.GF += s2; t2.GA += s1
      if (s1 > s2)      { t1.W++; t1.Pts += 3; t2.L++ }
      else if (s2 > s1) { t2.W++; t2.Pts += 3; t1.L++ }
      else              { t1.D++; t1.Pts++;     t2.D++; t2.Pts++ }
    }
  }

  // 2. Sort each group; track completion, match counts, and clinch status
  const standings = {}
  const complete  = {}
  const matchCounts = {}
  for (const g of Object.keys(groups)) {
    const teams = Object.values(groups[g])
    for (const t of teams) t.GD = t.GF - t.GA
    standings[g] = teams.sort((a, b) =>
      b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.name.localeCompare(b.name)
    )
    complete[g] = totalPerGroup[g] > 0 && scoredPerGroup[g] === totalPerGroup[g]
    matchCounts[g] = { played: scoredPerGroup[g], total: totalPerGroup[g] }

    if (scoredPerGroup[g] > 0) {
      if (complete[g]) {
        // Group finished: final positions are definitive
        standings[g].forEach((x, pos) => {
          x.clinch = pos === 0 ? 'first' : pos === 1 ? 'qualified' : 'eliminated'
        })
      } else {
        // Group in progress: fixture-aware clinch (points-only, ignores GD).
        // Brute-force every remaining group result so that contenders who still
        // play EACH OTHER can't both reach their theoretical max — that's what
        // lets a leader clinch 'first' (1ST) before the group is mathematically
        // over by the naive independent-max method.
        const teams = standings[g]
        const remaining = rawMatches.filter(m =>
          m.stage === 'Group Stage' && m.group === g &&
          (m.score1 === '' || m.score2 === '')
        )
        const basePts = {}
        for (const t of teams) basePts[t.name] = t.Pts

        // Worst/best case rivals across all possible remaining results.
        // Ties on points are resolved optimistically (in the team's favour) — the
        // same convention the 'qualified' check uses — so a leader that rivals can
        // only draw *level* with still clinches 1ST.
        const maxStrictAbove = {} // most teams that can finish > x → 0 ⇒ 1st, ≤1 ⇒ top-2
        const minStrictAbove = {} // fewest teams above x even in x's best case → ≥2 ⇒ out
        for (const t of teams) {
          maxStrictAbove[t.name] = 0
          minStrictAbove[t.name] = Infinity
        }

        const n = remaining.length
        const scenarios = 3 ** n
        for (let s = 0; s < scenarios; s++) {
          const pts = { ...basePts }
          let code = s
          for (let k = 0; k < n; k++) {
            const outcome = code % 3; code = Math.floor(code / 3)
            const { team1, team2 } = remaining[k]
            if (outcome === 0)      pts[team1] += 3
            else if (outcome === 1) pts[team2] += 3
            else                    { pts[team1] += 1; pts[team2] += 1 }
          }
          for (const t of teams) {
            let strictAbove = 0
            for (const u of teams) {
              if (u === t) continue
              if (pts[u.name] > pts[t.name]) strictAbove++
            }
            if (strictAbove > maxStrictAbove[t.name]) maxStrictAbove[t.name] = strictAbove
            if (strictAbove < minStrictAbove[t.name]) minStrictAbove[t.name] = strictAbove
          }
        }

        for (const t of teams) {
          if (maxStrictAbove[t.name] === 0)     t.clinch = 'first'       // no rival can finish above
          else if (maxStrictAbove[t.name] <= 1) t.clinch = 'qualified'   // never worse than 2nd
          else if (minStrictAbove[t.name] >= 2) t.clinch = 'eliminated'  // can't reach top-2 even at best
          else t.clinch = null
        }
      }
    }
  }

  // 3. Best 3rd-place teams (needed when all 12 groups done)
  const allGroupsDone = Object.keys(complete).length === 12 && Object.values(complete).every(Boolean)
  const thirds = []
  for (const [g, teams] of Object.entries(standings)) {
    if (complete[g] && teams.length >= 3)
      thirds.push({ group: g.replace('Group ', ''), ...teams[2] })
  }
  thirds.sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF)
  const top8 = allGroupsDone ? thirds.slice(0, 8) : []

  // 3b. Live 3rd-place tracker (all groups with ≥1 match scored)
  const thirdsTracker = []
  for (const [g, teams] of Object.entries(standings)) {
    if (scoredPerGroup[g] > 0 && teams.length >= 3)
      thirdsTracker.push({ group: g, complete: complete[g], ...teams[2] })
  }
  thirdsTracker.sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.name.localeCompare(b.name))

  // 4. Resolve placeholder team names in knockout matches
  const resolved = rawMatches.map(m => ({ ...m }))
  const assignedThirds = new Set()

  // Returns { name, confirmed } or null.
  // confirmed=true  → group is finished, slot is locked in
  // confirmed=false → group in progress, showing current leader provisionally
  function resolvePlaceholder(ph) {
    const wm = ph.match(/^Winner ([A-L])$/)
    if (wm) {
      const g = `Group ${wm[1]}`
      const name = standings[g]?.[0]?.name ?? null
      if (!name) return null
      return { name, confirmed: !!complete[g] }
    }
    const rm = ph.match(/^Runner-up ([A-L])$/)
    if (rm) {
      const g = `Group ${rm[1]}`
      const name = standings[g]?.[1]?.name ?? null
      if (!name) return null
      return { name, confirmed: !!complete[g] }
    }
    const bm = ph.match(/^Best 3rd \(([A-L/]+)\)$/)
    if (bm && allGroupsDone) {
      const allowed = bm[1].split('/')
      for (const t of top8) {
        if (allowed.includes(t.group) && !assignedThirds.has(t.group)) {
          assignedThirds.add(t.group)
          return { name: t.name, confirmed: true }
        }
      }
    }
    return null
  }

  // Resolve R32 placeholders
  for (let i = 72; i <= 87; i++) {
    const r1 = resolvePlaceholder(resolved[i].team1)
    const r2 = resolvePlaceholder(resolved[i].team2)
    if (r1) resolved[i] = { ...resolved[i], team1: r1.name, team1Confirmed: r1.confirmed }
    if (r2) resolved[i] = { ...resolved[i], team2: r2.name, team2Confirmed: r2.confirmed }
  }

  // Cascade winners through bracket
  function getWinner(m) {
    if (!m || m.score1 === '' || m.score2 === '') return null
    const s1 = Number(m.score1), s2 = Number(m.score2)
    return s1 > s2 ? m.team1 : s2 > s1 ? m.team2 : null
  }
  function getLoser(m) {
    const w = getWinner(m)
    return w ? (w === m.team1 ? m.team2 : m.team1) : null
  }

  const winnerBracket = [
    [88, 72, 73], [89, 74, 75], [90, 76, 77], [91, 78, 79],
    [92, 80, 81], [93, 82, 83], [94, 84, 85], [95, 86, 87],
    [96, 88, 89], [97, 90, 91], [98, 92, 93], [99, 94, 95],
    [100, 96, 97], [101, 98, 99],
    [103, 100, 101],
  ]
  for (const [dst, s1, s2] of winnerBracket) {
    const w1 = getWinner(resolved[s1])
    const w2 = getWinner(resolved[s2])
    if (w1) resolved[dst] = { ...resolved[dst], team1: w1 }
    if (w2) resolved[dst] = { ...resolved[dst], team2: w2 }
  }

  // 3rd Place: SF losers
  const l1 = getLoser(resolved[100])
  const l2 = getLoser(resolved[101])
  if (l1) resolved[102] = { ...resolved[102], team1: l1 }
  if (l2) resolved[102] = { ...resolved[102], team2: l2 }

  return { standings, complete, matchCounts, resolvedMatches: resolved, thirdsTracker }
}
