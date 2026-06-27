import { ALL_MATCHES } from './matches.js'
import { COUNTRY_FLAGS } from './constants.js'

// Registry of competitions the app can host. Each entry bundles the
// competition's identity, its match dataset, its team→crest map, the tabs it
// exposes, and a `format` that drives format-specific behaviour:
//   'groups-knockout' → group standings + knockout bracket (World Cup, Champions League)
//   'league'          → single league table, no bracket (Premier League)
//
// Adding a competition is data-only: drop a new entry here once its dataset and
// crest map exist (Champions League → #T6, Premier League → #T9).
export const COMPETITIONS = [
  {
    id:       'wc2026',
    name:     'World Cup 2026',
    icon:     '🏆',
    title:    'FIFA WORLD CUP 2026™',
    subtitle: 'CANADA · MEXICO · UNITED STATES  |  JUNE 11 – JULY 19',
    note:     'All times Central (CT) · 104 matches · 48 teams · Click a country name to view its squad',
    format:   'groups-knockout',
    matches:  ALL_MATCHES,
    crests:   COUNTRY_FLAGS,
    tabs:     ['home', 'schedule', 'standings', 'bracket'],
  },
]

export const DEFAULT_COMPETITION = 'wc2026'
