export const STAGE_COLORS = {
  "Group Stage":  { accent: "#1e40af", badge: "#1d4ed8" },
  "Round of 32":  { accent: "#065f46", badge: "#059669" },
  "Round of 16":  { accent: "#6b21a8", badge: "#9333ea" },
  "Quarterfinal": { accent: "#92400e", badge: "#d97706" },
  "Semifinal":    { accent: "#991b1b", badge: "#dc2626" },
  "3rd Place":    { accent: "#78350f", badge: "#b45309" },
  "Final":        { accent: "#854d0e", badge: "#eab308" },
}

export const COUNTRY_FLAGS = {
  "Mexico":               "🇲🇽",
  "South Africa":         "🇿🇦",
  "South Korea":          "🇰🇷",
  "Czechia":              "🇨🇿",
  "Canada":               "🇨🇦",
  "Bosnia & Herzegovina": "🇧🇦",
  "Qatar":                "🇶🇦",
  "Switzerland":          "🇨🇭",
  "Brazil":               "🇧🇷",
  "Morocco":              "🇲🇦",
  "Haiti":                "🇭🇹",
  "Scotland":             "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "USA":                  "🇺🇸",
  "Paraguay":             "🇵🇾",
  "Australia":            "🇦🇺",
  "Türkiye":              "🇹🇷",
  "Germany":              "🇩🇪",
  "Curaçao":              "🇨🇼",
  "Ivory Coast":          "🇨🇮",
  "Ecuador":              "🇪🇨",
  "Netherlands":          "🇳🇱",
  "Japan":                "🇯🇵",
  "Sweden":               "🇸🇪",
  "Tunisia":              "🇹🇳",
  "Belgium":              "🇧🇪",
  "Egypt":                "🇪🇬",
  "Iran":                 "🇮🇷",
  "New Zealand":          "🇳🇿",
  "Spain":                "🇪🇸",
  "Cape Verde":           "🇨🇻",
  "Saudi Arabia":         "🇸🇦",
  "Uruguay":              "🇺🇾",
  "France":               "🇫🇷",
  "Senegal":              "🇸🇳",
  "Iraq":                 "🇮🇶",
  "Norway":               "🇳🇴",
  "Argentina":            "🇦🇷",
  "Algeria":              "🇩🇿",
  "Austria":              "🇦🇹",
  "Jordan":               "🇯🇴",
  "Portugal":             "🇵🇹",
  "DR Congo":             "🇨🇩",
  "Uzbekistan":           "🇺🇿",
  "Colombia":             "🇨🇴",
  "England":              "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Croatia":              "🇭🇷",
  "Ghana":                "🇬🇭",
  "Panama":               "🇵🇦",
}

export const STAGES = [
  "All", "Group Stage", "Round of 32", "Round of 16",
  "Quarterfinal", "Semifinal", "3rd Place", "Final",
]

export const GROUPS = [
  "All Groups",
  "Group A", "Group B", "Group C", "Group D", "Group E", "Group F",
  "Group G", "Group H", "Group I", "Group J", "Group K", "Group L",
]

export const positions = [
  { key: "goalkeepers", label: "Goalkeepers", icon: "🧤" },
  { key: "defenders",   label: "Defenders",   icon: "🛡️" },
  { key: "midfielders", label: "Midfielders", icon: "⚙️" },
  { key: "forwards",    label: "Forwards",    icon: "⚡" },
]

export const MANAGERS = {
  "Mexico":               "Javier Aguirre",
  "South Africa":         "Hugo Broos",
  "South Korea":          "Hong Myung-bo",
  "Czechia":              "Miroslav Kouček",
  "Canada":               "Jesse Marsch",
  "Bosnia & Herzegovina": "Sergej Barbarez",
  "Qatar":                "Julen Lopetegui",
  "Switzerland":          "Murat Yakin",
  "Brazil":               "Carlo Ancelotti",
  "Morocco":              "Mohamed Ouahbi",
  "Haiti":                "Sébastien Migné",
  "Scotland":             "Steve Clarke",
  "USA":                  "Mauricio Pochettino",
  "Paraguay":             "Gustavo Alfaro",
  "Australia":            "Tony Popovic",
  "Türkiye":              "Vincenzo Montella",
  "Germany":              "Julian Nagelsmann",
  "Curaçao":              "Dick Advocaat",
  "Ivory Coast":          "Emerse Faé",
  "Ecuador":              "Sebastián Beccacece",
  "Netherlands":          "Ronald Koeman",
  "Japan":                "Hajime Moriyasu",
  "Sweden":               "Graham Potter",
  "Tunisia":              "Sabri Lamouchi",
  "Belgium":              "Rudi Garcia",
  "Egypt":                "Hossam Hassan",
  "Iran":                 "Amir Ghalenoei",
  "New Zealand":          "Darren Bazeley",
  "Spain":                "Luis de la Fuente",
  "Cape Verde":           "Bubista",
  "Saudi Arabia":         "Georgios Donis",
  "Uruguay":              "Marcelo Bielsa",
  "France":               "Didier Deschamps",
  "Senegal":              "Pape Thiaw",
  "Iraq":                 "Graham Arnold",
  "Norway":               "Ståle Solbakken",
  "Argentina":            "Lionel Scaloni",
  "Algeria":              "Vladimir Petković",
  "Austria":              "Ralf Rangnick",
  "Jordan":               "Jamal Sellami",
  "Portugal":             "Roberto Martínez",
  "DR Congo":             "Sébastien Desabre",
  "Uzbekistan":           "Fabio Cannavaro",
  "Colombia":             "Néstor Lorenzo",
  "England":              "Thomas Tuchel",
  "Croatia":              "Zlatko Dalić",
  "Ghana":                "Carlos Queiroz",
  "Panama":               "Thomas Christiansen",
}

// Returns ms timestamp for match kickoff. Times in data are CT (CDT = UTC-5 during tournament).
export function matchStartMs(dateStr, timeStr) {
  const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return null
  let h = parseInt(m[1])
  const min = parseInt(m[2])
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0
  return new Date(`${dateStr}T${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}:00-05:00`).getTime()
}

export const MATCH_DURATION_MS = 150 * 60 * 1000 // 2.5 h covers extra time + penalties

export const editFields = [
  ["TEAM 1",    "team1"],
  ["TEAM 2",    "team2"],
  ["TIME (CT)", "time"],
  ["GROUP",     "group"],
  ["VENUE",     "venue"],
  ["SCORE 1",   "score1"],
  ["SCORE 2",   "score2"],
]
