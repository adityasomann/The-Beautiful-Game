<template>
  <div style="min-height:100vh;background:#060d1c;font-family:Georgia,'Times New Roman',serif;color:#e2e8f0">

    <!-- Group Standings Popup -->
    <div v-if="groupPopup" @click="groupPopup=null"
      style="position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)">
      <div @click.stop style="background:#0a1628;border:1px solid #1e40af55;border-radius:16px;padding:28px;width:100%;max-width:480px;max-height:82vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.7)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
          <div>
            <div style="font-size:11px;letter-spacing:3px;color:#60a5fa;text-transform:uppercase;margin-bottom:4px">Group Standings</div>
            <h2 style="margin:0 0 4px;font-size:24px;color:#f1f5f9;font-family:Georgia,serif">{{ GROUP_FLAGS[groupPopup] }} {{ groupPopup }}</h2>
            <div style="font-size:12px;color:#64748b">
              {{ standingsData.matchCounts[groupPopup]?.played ?? 0 }} / {{ standingsData.matchCounts[groupPopup]?.total ?? 6 }} matches played
            </div>
          </div>
          <button @click="groupPopup=null" style="background:transparent;border:1px solid #1e3a6e;color:#64748b;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:16px">✕</button>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px;font-family:Georgia,serif">
          <thead>
            <tr>
              <th style="text-align:left;padding:6px 4px 6px 8px;color:#334155;font-size:10px;letter-spacing:1px;font-weight:400;border-bottom:1px solid #1e3a6e44">Team</th>
              <th v-for="col in ['P','W','D','L','GF','GA','GD','Pts']" :key="col"
                style="text-align:center;color:#334155;font-size:10px;letter-spacing:1px;padding:6px 4px;font-weight:400;border-bottom:1px solid #1e3a6e44">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, pos) in (standingsData.standings[groupPopup] ?? [])" :key="team.name"
              :style="{background: pos < 2 ? '#0d1f38' : pos === 2 ? '#1a1205' : 'transparent'}">
              <td style="padding:8px 4px 8px 8px;border-bottom:1px solid #0d1f3822">
                <div style="display:flex;align-items:center;gap:6px">
                  <span :style="{color:pos<2?'#3b82f6':'#1e3a6e',fontSize:'10px',width:'12px',flexShrink:0}">{{ pos+1 }}</span>
                  <span style="font-size:15px">{{ COUNTRY_FLAGS[team.name] ?? '' }}</span>
                  <span :style="{color:pos<2?'#cbd5e1':pos===2?'#b45309':'#64748b'}">{{ team.name }}</span>
                </div>
              </td>
              <td style="text-align:center;color:#64748b;padding:8px 4px;border-bottom:1px solid #0d1f3822">{{ team.P }}</td>
              <td style="text-align:center;color:#64748b;padding:8px 4px;border-bottom:1px solid #0d1f3822">{{ team.W }}</td>
              <td style="text-align:center;color:#64748b;padding:8px 4px;border-bottom:1px solid #0d1f3822">{{ team.D }}</td>
              <td style="text-align:center;color:#64748b;padding:8px 4px;border-bottom:1px solid #0d1f3822">{{ team.L }}</td>
              <td style="text-align:center;color:#64748b;padding:8px 4px;border-bottom:1px solid #0d1f3822">{{ team.GF }}</td>
              <td style="text-align:center;color:#64748b;padding:8px 4px;border-bottom:1px solid #0d1f3822">{{ team.GA }}</td>
              <td style="text-align:center;color:#64748b;padding:8px 4px;border-bottom:1px solid #0d1f3822">{{ team.GD > 0 ? '+'+team.GD : team.GD }}</td>
              <td style="text-align:center;font-weight:700;padding:8px 4px;border-bottom:1px solid #0d1f3822"
                :style="{color:pos<2?'#e2e8f0':pos===2?'#d97706':'#94a3b8'}">{{ team.Pts }}</td>
            </tr>
          </tbody>
        </table>
        <div style="display:flex;gap:20px;padding:12px 2px 0;font-size:11px;letter-spacing:0.5px;color:#334155">
          <span style="color:#3b82f6">▌ Advance</span>
          <span style="color:#d97706">▌ Potential 3rd-place qualifier</span>
        </div>
      </div>
    </div>

    <!-- Squad Modal -->
    <div v-if="squadCountry" @click="squadCountry=null"
      style="position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)">
      <div @click.stop style="background:#0a1628;border:1px solid #1e40af55;border-radius:16px;padding:28px;width:100%;max-width:520px;max-height:82vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.7)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
          <div>
            <div style="font-size:11px;letter-spacing:3px;color:#60a5fa;text-transform:uppercase;margin-bottom:4px">World Cup 2026 Squad</div>
            <h2 style="margin:0 0 4px;font-size:24px;color:#f1f5f9;font-family:Georgia,serif">{{ COUNTRY_FLAGS[squadCountry] ?? '' }} {{ squadCountry }}</h2>
            <div v-if="MANAGERS[squadCountry]" style="font-size:12px;color:#64748b;font-style:italic">
              Manager: <span style="color:#94a3b8">{{ MANAGERS[squadCountry] }}</span>
            </div>
          </div>
          <button @click="squadCountry=null" style="background:transparent;border:1px solid #1e3a6e;color:#64748b;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:16px">✕</button>
        </div>
        <div v-if="!SQUADS[squadCountry]" style="text-align:center;padding:36px 0;color:#475569">
          <div style="font-size:32px;margin-bottom:12px">📋</div>
          <div style="font-size:15px;color:#64748b">Squad data not available</div>
        </div>
        <template v-else>
          <div v-for="pos in positions" :key="pos.key" style="margin-bottom:20px">
            <div v-if="SQUADS[squadCountry][pos.key]?.length">
              <div style="font-size:11px;letter-spacing:2px;color:#60a5fa;text-transform:uppercase;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #1e3a6e44;display:flex;align-items:center;gap:6px">
                {{ pos.icon }} {{ pos.label }}
              </div>
              <div v-for="(p, i) in SQUADS[squadCountry][pos.key]" :key="i"
                :style="{display:'flex',justifyContent:'space-between',alignItems:'baseline',padding:'5px 8px',borderRadius:'5px',background:i%2===0?'#0c1a2e':'transparent'}">
                <span style="color:#e2e8f0;font-size:14px">{{ p.name }}</span>
                <span style="color:#475569;font-size:12px;font-style:italic;margin-left:8px;flex-shrink:0">{{ p.club }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0a1628 0%,#0d2244 40%,#1a0a2e 100%);border-bottom:2px solid #1e40af44;padding:36px 24px 28px;text-align:center;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,#1e40af18 0%,transparent 70%);pointer-events:none"/>
      <div style="font-size:13px;letter-spacing:5px;color:#60a5fa;text-transform:uppercase;margin-bottom:8px">Official Tournament Schedule</div>
      <h1 style="font-size:clamp(22px,5vw,40px);font-weight:700;margin:0 0 6px;background:linear-gradient(90deg,#60a5fa,#ffffff,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:1px">FIFA WORLD CUP 2026™</h1>
      <div style="color:#94a3b8;font-size:14px;letter-spacing:2px">CANADA · MEXICO · UNITED STATES &nbsp;|&nbsp; JUNE 11 – JULY 19</div>
      <div style="margin-top:10px;color:#64748b;font-size:12px">All times Central (CT) · 104 matches · 48 teams · Click a country name to view its squad</div>
    </div>

    <!-- View tabs -->
    <div style="display:flex;background:#070f1f;border-bottom:1px solid #1e3a6e44;padding:0 20px;gap:4px">
      <button @click="view='schedule'"
        :style="{background:'none',border:'none',borderBottom:view==='schedule'?'2px solid #3b82f6':'2px solid transparent',color:view==='schedule'?'#60a5fa':'#475569',padding:'12px 18px',fontSize:'12px',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',fontFamily:'Georgia,serif',transition:'color 0.15s'}">
        Schedule
      </button>
      <button @click="view='standings'"
        :style="{background:'none',border:'none',borderBottom:view==='standings'?'2px solid #3b82f6':'2px solid transparent',color:view==='standings'?'#60a5fa':'#475569',padding:'12px 18px',fontSize:'12px',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',fontFamily:'Georgia,serif',transition:'color 0.15s'}">
        Group Standings
      </button>
    </div>

    <!-- Schedule view -->
    <template v-if="view === 'schedule'">
      <!-- Filters -->
      <div style="background:#0a1628;border-bottom:1px solid #1e3a6e33;padding:16px 20px;display:flex;flex-wrap:wrap;gap:10px;align-items:center">
        <input v-model="search" placeholder="🔍  Search team or group..."
          style="background:#0d1f38;border:1px solid #1e40af44;color:#e2e8f0;border-radius:6px;padding:7px 12px;font-size:13px;width:200px;outline:none;font-family:Georgia,serif"/>
        <select v-model="stageFilter"
          style="background:#0d1f38;border:1px solid #1e40af44;color:#e2e8f0;border-radius:6px;padding:7px 10px;font-size:13px;outline:none;cursor:pointer;font-family:Georgia,serif">
          <option v-for="s in STAGES" :key="s">{{ s }}</option>
        </select>
        <select v-model="groupFilter"
          style="background:#0d1f38;border:1px solid #1e40af44;color:#e2e8f0;border-radius:6px;padding:7px 10px;font-size:13px;outline:none;cursor:pointer;font-family:Georgia,serif">
          <option v-for="g in GROUPS" :key="g">{{ g }}</option>
        </select>
        <button @click="todayOnly=!todayOnly"
          :style="{background:todayOnly?'#1e40af':'transparent',color:todayOnly?'#fff':'#475569',border:'1px solid',borderColor:todayOnly?'#3b82f6':'#1e3a6e',borderRadius:'6px',padding:'7px 14px',fontSize:'12px',letterSpacing:'1px',cursor:'pointer',fontFamily:'Georgia,serif',transition:'all 0.15s'}">
          TODAY
        </button>
        <span style="margin-left:auto;color:#64748b;font-size:12px;letter-spacing:1px">{{ filtered.length }} MATCHES</span>
      </div>

      <!-- Match list -->
      <div style="max-width:900px;margin:0 auto;padding:24px 16px">
        <div v-if="grouped.length===0" style="text-align:center;color:#475569;padding:60px 0;font-size:16px">No matches found.</div>
        <div v-for="[date, dayMatches] in grouped" :key="date" style="margin-bottom:32px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #1e3a6e33">
            <div style="background:#1e40af;color:#fff;border-radius:6px;padding:4px 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase">{{ dayMatches[0].day }}</div>
            <div style="color:#94a3b8;font-size:15px;font-style:italic">{{ formatDateLabel(date) }}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <template v-for="m in dayMatches" :key="m._origIdx">

              <!-- Edit mode: score only -->
              <div v-if="editingIdx===m._origIdx"
                style="background:#0f1e35;border:1px solid #3b82f644;border-left:3px solid #3b82f6;border-radius:8px;padding:14px 16px;display:flex;flex-direction:column;gap:12px">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                  <span style="color:#94a3b8;font-size:14px;font-weight:600;flex:1;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    {{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}
                  </span>
                  <input v-model="editBuf.score1" type="number" min="0"
                    @keyup.enter="saveEdit(m._origIdx)"
                    style="background:#0d1f38;border:1px solid #3b82f655;color:#e2e8f0;border-radius:6px;padding:8px 0;font-size:22px;font-weight:700;font-family:Georgia,serif;width:52px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
                  <span style="color:#334155;font-size:18px;flex-shrink:0">—</span>
                  <input v-model="editBuf.score2" type="number" min="0"
                    @keyup.enter="saveEdit(m._origIdx)"
                    style="background:#0d1f38;border:1px solid #3b82f655;color:#e2e8f0;border-radius:6px;padding:8px 0;font-size:22px;font-weight:700;font-family:Georgia,serif;width:52px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
                  <span style="color:#94a3b8;font-size:14px;font-weight:600;flex:1;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    {{ COUNTRY_FLAGS[m.team2] ?? '' }} {{ m.team2 }}
                  </span>
                </div>
                <div style="display:flex;gap:8px;justify-content:flex-end">
                  <button @click="cancelEdit"
                    style="background:transparent;color:#64748b;border:1px solid #1e3a6e;border-radius:6px;padding:7px 18px;font-size:12px;cursor:pointer;font-family:Georgia,serif">Cancel</button>
                  <button v-if="hasScore(m._origIdx)" @click="clearScore(m._origIdx)"
                    style="background:transparent;color:#ef4444;border:1px solid #7f1d1d;border-radius:6px;padding:7px 18px;font-size:12px;cursor:pointer;font-family:Georgia,serif">Delete Score</button>
                  <button @click="saveEdit(m._origIdx)"
                    style="background:#1d4ed8;color:#fff;border:none;border-radius:6px;padding:7px 18px;font-size:12px;cursor:pointer;font-family:Georgia,serif">Save Score</button>
                </div>
              </div>

              <!-- View mode -->
              <div v-else
                :style="{background:'#0c1a2e',border:`1px solid ${stageColor(m.stage).accent}33`,borderLeft:`3px solid ${stageColor(m.stage).badge}`,borderRadius:'8px',padding:'12px 16px',display:'flex',alignItems:'center',gap:'12px',transition:'background 0.15s',flexWrap:'wrap'}"
                @mouseenter="e=>e.currentTarget.style.background='#0f2040'"
                @mouseleave="e=>e.currentTarget.style.background='#0c1a2e'">
                <div style="min-width:100px;color:#60a5fa;font-size:13px;font-style:italic;flex-shrink:0">{{ m.time }}</div>
                <div style="flex:1;display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;min-width:200px">
                  <!-- Team 1 -->
                  <span
                    :style="{cursor:isReal(m.team1)?'pointer':'default',color:teamColor(m._origIdx,true),borderRadius:'4px',padding:isReal(m.team1)?'1px 5px':'0',display:'inline-block'}"
                    @click="isReal(m.team1)?squadCountry=m.team1:null"
                    @mouseenter="e=>{if(isReal(m.team1)){e.currentTarget.style.background='#1e40af44';e.currentTarget.style.color='#93c5fd';}}"
                    @mouseleave="e=>{if(isReal(m.team1)){e.currentTarget.style.background='transparent';e.currentTarget.style.color=teamColor(m._origIdx,true);}}">
                    {{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}
                  </span>
                  <!-- Score -->
                  <template v-if="hasScore(m._origIdx)">
                    <span :style="{color:score1Wins(m._origIdx)?'#e2e8f0':'#475569',fontSize:'18px',fontWeight:700,minWidth:'16px',textAlign:'center'}">{{ scores[m._origIdx].score1 }}</span>
                    <span style="color:#334155;font-size:14px">–</span>
                    <span :style="{color:score2Wins(m._origIdx)?'#e2e8f0':'#475569',fontSize:'18px',fontWeight:700,minWidth:'16px',textAlign:'center'}">{{ scores[m._origIdx].score2 }}</span>
                  </template>
                  <span v-else style="color:#334155;font-size:12px;font-weight:400;font-style:italic">vs</span>
                  <!-- Team 2 -->
                  <span
                    :style="{cursor:isReal(m.team2)?'pointer':'default',color:teamColor(m._origIdx,false),borderRadius:'4px',padding:isReal(m.team2)?'1px 5px':'0',display:'inline-block'}"
                    @click="isReal(m.team2)?squadCountry=m.team2:null"
                    @mouseenter="e=>{if(isReal(m.team2)){e.currentTarget.style.background='#1e40af44';e.currentTarget.style.color='#93c5fd';}}"
                    @mouseleave="e=>{if(isReal(m.team2)){e.currentTarget.style.background='transparent';e.currentTarget.style.color=teamColor(m._origIdx,false);}}">
                    {{ COUNTRY_FLAGS[m.team2] ?? '' }} {{ m.team2 }}
                  </span>
                </div>
                <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
                  <span v-if="m.group" :style="{...badgeStyle(m.stage),cursor:'pointer'}"
                    @click.stop="groupPopup=m.group"
                    @mouseenter="e=>e.currentTarget.style.opacity='0.75'"
                    @mouseleave="e=>e.currentTarget.style.opacity='1'">{{ GROUP_FLAGS[m.group] }} {{ m.group }}</span>
                  <span :style="badgeStyle(m.stage)">{{ m.stage }}</span>
                  <div @click="startEdit(m._origIdx)" title="Edit score"
                    style="color:#334155;font-size:13px;cursor:pointer;padding:2px 6px;border-radius:4px;transition:color 0.15s"
                    @mouseenter="e=>e.currentTarget.style.color='#60a5fa'"
                    @mouseleave="e=>e.currentTarget.style.color='#334155'">✎</div>
                </div>
              </div>

            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- Group Standings view -->
    <div v-else style="max-width:1200px;margin:0 auto;padding:24px 16px 40px">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px">
        <div v-for="[group, teams] in groupEntries" :key="group"
          style="background:#0c1a2e;border:1px solid #1e3a6e44;border-radius:10px;overflow:hidden">
          <!-- Group header -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 14px;background:#0a1628;border-bottom:1px solid #1e3a6e44">
            <span style="font-size:12px;letter-spacing:2px;color:#60a5fa;font-weight:600">{{ group }}</span>
            <span style="font-size:10px;color:#64748b;letter-spacing:0.5px">
              {{ standingsData.matchCounts[group]?.played ?? 0 }}/{{ standingsData.matchCounts[group]?.total ?? 6 }} played
            </span>
            <span v-if="standingsData.complete[group]"
              style="font-size:9px;letter-spacing:1px;color:#22c55e;background:#14532d33;border:1px solid #22c55e55;border-radius:3px;padding:2px 6px">FINAL</span>
            <span v-else-if="teams.some(t=>t.P>0)"
              style="font-size:9px;letter-spacing:1px;color:#f59e0b;background:#78350f33;border:1px solid #f59e0b55;border-radius:3px;padding:2px 6px">IN PROGRESS</span>
          </div>
          <!-- Standings table -->
          <table style="width:100%;border-collapse:collapse;font-size:12px;font-family:Georgia,serif">
            <thead>
              <tr>
                <th style="text-align:left;padding:5px 4px 5px 10px;color:#334155;font-size:10px;letter-spacing:1px;font-weight:400;border-bottom:1px solid #1e3a6e22">Team</th>
                <th v-for="col in ['P','W','D','L','GF','GA','GD','Pts']" :key="col"
                  style="text-align:center;color:#334155;font-size:10px;letter-spacing:1px;padding:5px 4px;font-weight:400;border-bottom:1px solid #1e3a6e22">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(team, pos) in teams" :key="team.name"
                :style="{background: pos < 2 ? '#0d1f38' : pos === 2 ? '#1a1205' : 'transparent'}">
                <td style="padding:6px 4px 6px 8px;border-bottom:1px solid #0d1f3822">
                  <div style="display:flex;align-items:center;gap:5px">
                    <span :style="{color:pos<2?'#3b82f6':'#1e3a6e',fontSize:'10px',width:'10px',flexShrink:0}">{{ pos+1 }}</span>
                    <span style="font-size:13px">{{ COUNTRY_FLAGS[team.name] ?? '' }}</span>
                    <span :style="{color:pos<2?'#cbd5e1':pos===2?'#b45309':'#64748b',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:'90px'}">{{ team.name }}</span>
                  </div>
                </td>
                <td style="text-align:center;color:#64748b;padding:6px 4px;border-bottom:1px solid #0d1f3822">{{ team.P }}</td>
                <td style="text-align:center;color:#64748b;padding:6px 4px;border-bottom:1px solid #0d1f3822">{{ team.W }}</td>
                <td style="text-align:center;color:#64748b;padding:6px 4px;border-bottom:1px solid #0d1f3822">{{ team.D }}</td>
                <td style="text-align:center;color:#64748b;padding:6px 4px;border-bottom:1px solid #0d1f3822">{{ team.L }}</td>
                <td style="text-align:center;color:#64748b;padding:6px 4px;border-bottom:1px solid #0d1f3822">{{ team.GF }}</td>
                <td style="text-align:center;color:#64748b;padding:6px 4px;border-bottom:1px solid #0d1f3822">{{ team.GA }}</td>
                <td style="text-align:center;color:#64748b;padding:6px 4px;border-bottom:1px solid #0d1f3822">{{ team.GD > 0 ? '+'+team.GD : team.GD }}</td>
                <td style="text-align:center;font-weight:700;padding:6px 4px;border-bottom:1px solid #0d1f3822"
                  :style="{color:pos<2?'#e2e8f0':pos===2?'#d97706':'#94a3b8'}">{{ team.Pts }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Legend -->
      <div style="display:flex;gap:24px;padding:14px 2px 0;font-size:11px;letter-spacing:0.5px;color:#334155">
        <span style="color:#3b82f6">▌ Advance to Round of 32</span>
        <span style="color:#d97706">▌ Potential 3rd-place qualifier</span>
      </div>
    </div>

    <div style="text-align:center;padding:24px;color:#1e3a6e;font-size:12px;letter-spacing:2px">FIFA WORLD CUP 2026™ · CANADA · MEXICO · UNITED STATES</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SQUADS } from './data/squads.js'

const API_URL = 'https://wc2026.home/api'

// ── Constants ─────────────────────────────────────────────────────────────────

const COUNTRY_FLAGS = {
  "Mexico":"🇲🇽","South Africa":"🇿🇦","South Korea":"🇰🇷","Czechia":"🇨🇿",
  "Canada":"🇨🇦","Bosnia & Herzegovina":"🇧🇦","Qatar":"🇶🇦","Switzerland":"🇨🇭",
  "Brazil":"🇧🇷","Morocco":"🇲🇦","Haiti":"🇭🇹","Scotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "USA":"🇺🇸","Paraguay":"🇵🇾","Australia":"🇦🇺","Türkiye":"🇹🇷",
  "Germany":"🇩🇪","Curaçao":"🇨🇼","Ivory Coast":"🇨🇮","Ecuador":"🇪🇨",
  "Netherlands":"🇳🇱","Japan":"🇯🇵","Sweden":"🇸🇪","Tunisia":"🇹🇳",
  "Belgium":"🇧🇪","Egypt":"🇪🇬","Iran":"🇮🇷","New Zealand":"🇳🇿",
  "Spain":"🇪🇸","Cape Verde":"🇨🇻","Saudi Arabia":"🇸🇦","Uruguay":"🇺🇾",
  "France":"🇫🇷","Senegal":"🇸🇳","Iraq":"🇮🇶","Norway":"🇳🇴",
  "Argentina":"🇦🇷","Algeria":"🇩🇿","Austria":"🇦🇹","Jordan":"🇯🇴",
  "Portugal":"🇵🇹","DR Congo":"🇨🇩","Uzbekistan":"🇺🇿","Colombia":"🇨🇴",
  "England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croatia":"🇭🇷","Ghana":"🇬🇭","Panama":"🇵🇦",
}

const GROUP_FLAGS = {
  "Group A":"🇲🇽","Group B":"🇨🇦","Group C":"🇧🇷","Group D":"🇺🇸",
  "Group E":"🇩🇪","Group F":"🇳🇱","Group G":"🇧🇪","Group H":"🇪🇸",
  "Group I":"🇫🇷","Group J":"🇦🇷","Group K":"🇵🇹","Group L":"🏴󠁧󠁢󠁥󠁮󠁧󠁿",
} 

const STAGE_COLORS = {
  "Group Stage":  { accent:"#1e40af", badge:"#1d4ed8" },
  "Round of 32":  { accent:"#065f46", badge:"#059669" },
  "Round of 16":  { accent:"#6b21a8", badge:"#9333ea" },
  "Quarterfinal": { accent:"#92400e", badge:"#d97706" },
  "Semifinal":    { accent:"#991b1b", badge:"#dc2626" },
  "3rd Place":    { accent:"#78350f", badge:"#b45309" },
  "Final":        { accent:"#854d0e", badge:"#eab308" },
}

const STAGES = ["All","Group Stage","Round of 32","Round of 16","Quarterfinal","Semifinal","3rd Place","Final"]
const GROUPS = ["All Groups","Group A","Group B","Group C","Group D","Group E","Group F","Group G","Group H","Group I","Group J","Group K","Group L"]

const positions = [
  { key:"goalkeepers", label:"Goalkeepers", icon:"🧤" },
  { key:"defenders",   label:"Defenders",   icon:"🛡️" },
  { key:"midfielders", label:"Midfielders", icon:"⚙️" },
  { key:"forwards",    label:"Forwards",    icon:"⚡" },
]

const MANAGERS = {
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

// ── Match data ────────────────────────────────────────────────────────────────

const ALL_MATCHES = [
  { date:"2026-06-11", day:"Thursday",  time:"2:00 PM CT",  group:"Group A", team1:"Mexico",              team2:"South Africa",       stage:"Group Stage" },
  { date:"2026-06-11", day:"Thursday",  time:"9:00 PM CT",  group:"Group A", team1:"South Korea",         team2:"Czechia",            stage:"Group Stage" },
  { date:"2026-06-12", day:"Friday",    time:"2:00 PM CT",  group:"Group B", team1:"Canada",              team2:"Bosnia & Herzegovina",stage:"Group Stage" },
  { date:"2026-06-12", day:"Friday",    time:"8:00 PM CT",  group:"Group D", team1:"USA",                 team2:"Paraguay",           stage:"Group Stage" },
  { date:"2026-06-13", day:"Saturday",  time:"2:00 PM CT",  group:"Group B", team1:"Qatar",               team2:"Switzerland",        stage:"Group Stage" },
  { date:"2026-06-13", day:"Saturday",  time:"5:00 PM CT",  group:"Group C", team1:"Brazil",              team2:"Morocco",            stage:"Group Stage" },
  { date:"2026-06-13", day:"Saturday",  time:"8:00 PM CT",  group:"Group C", team1:"Haiti",               team2:"Scotland",           stage:"Group Stage" },
  { date:"2026-06-13", day:"Saturday",  time:"11:00 PM CT", group:"Group D", team1:"Australia",           team2:"Türkiye",            stage:"Group Stage" },
  { date:"2026-06-14", day:"Sunday",    time:"12:00 PM CT", group:"Group E", team1:"Germany",             team2:"Curaçao",            stage:"Group Stage" },
  { date:"2026-06-14", day:"Sunday",    time:"3:00 PM CT",  group:"Group F", team1:"Netherlands",         team2:"Japan",              stage:"Group Stage" },
  { date:"2026-06-14", day:"Sunday",    time:"6:00 PM CT",  group:"Group E", team1:"Ivory Coast",         team2:"Ecuador",            stage:"Group Stage" },
  { date:"2026-06-14", day:"Sunday",    time:"9:00 PM CT",  group:"Group F", team1:"Sweden",              team2:"Tunisia",            stage:"Group Stage" },
  { date:"2026-06-15", day:"Monday",    time:"11:00 AM CT", group:"Group H", team1:"Spain",               team2:"Cape Verde",         stage:"Group Stage" },
  { date:"2026-06-15", day:"Monday",    time:"2:00 PM CT",  group:"Group G", team1:"Belgium",             team2:"Egypt",              stage:"Group Stage" },
  { date:"2026-06-15", day:"Monday",    time:"5:00 PM CT",  group:"Group H", team1:"Saudi Arabia",        team2:"Uruguay",            stage:"Group Stage" },
  { date:"2026-06-15", day:"Monday",    time:"8:00 PM CT",  group:"Group G", team1:"Iran",                team2:"New Zealand",        stage:"Group Stage" },
  { date:"2026-06-16", day:"Tuesday",   time:"2:00 PM CT",  group:"Group I", team1:"France",              team2:"Senegal",            stage:"Group Stage" },
  { date:"2026-06-16", day:"Tuesday",   time:"5:00 PM CT",  group:"Group I", team1:"Iraq",                team2:"Norway",             stage:"Group Stage" },
  { date:"2026-06-16", day:"Tuesday",   time:"8:00 PM CT",  group:"Group J", team1:"Argentina",           team2:"Algeria",            stage:"Group Stage" },
  { date:"2026-06-16", day:"Tuesday",   time:"11:00 PM CT", group:"Group J", team1:"Austria",             team2:"Jordan",             stage:"Group Stage" },
  { date:"2026-06-17", day:"Wednesday", time:"12:00 PM CT", group:"Group K", team1:"Portugal",            team2:"DR Congo",           stage:"Group Stage" },
  { date:"2026-06-17", day:"Wednesday", time:"3:00 PM CT",  group:"Group L", team1:"England",             team2:"Croatia",            stage:"Group Stage" },
  { date:"2026-06-17", day:"Wednesday", time:"6:00 PM CT",  group:"Group L", team1:"Ghana",               team2:"Panama",             stage:"Group Stage" },
  { date:"2026-06-17", day:"Wednesday", time:"9:00 PM CT",  group:"Group K", team1:"Uzbekistan",          team2:"Colombia",           stage:"Group Stage" },
  { date:"2026-06-17", day:"Wednesday", time:"11:00 PM CT", group:"Group A", team1:"Czechia",             team2:"South Africa",       stage:"Group Stage" },
  { date:"2026-06-18", day:"Thursday",  time:"2:00 PM CT",  group:"Group B", team1:"Switzerland",         team2:"Bosnia & Herzegovina",stage:"Group Stage" },
  { date:"2026-06-18", day:"Thursday",  time:"5:00 PM CT",  group:"Group B", team1:"Canada",              team2:"Qatar",              stage:"Group Stage" },
  { date:"2026-06-18", day:"Thursday",  time:"8:00 PM CT",  group:"Group A", team1:"Mexico",              team2:"South Korea",        stage:"Group Stage" },
  { date:"2026-06-19", day:"Friday",    time:"2:00 PM CT",  group:"Group D", team1:"USA",                 team2:"Australia",          stage:"Group Stage" },
  { date:"2026-06-19", day:"Friday",    time:"5:00 PM CT",  group:"Group C", team1:"Scotland",            team2:"Morocco",            stage:"Group Stage" },
  { date:"2026-06-19", day:"Friday",    time:"7:30 PM CT",  group:"Group C", team1:"Brazil",              team2:"Haiti",              stage:"Group Stage" },
  { date:"2026-06-19", day:"Friday",    time:"10:00 PM CT", group:"Group D", team1:"Türkiye",             team2:"Paraguay",           stage:"Group Stage" },
  { date:"2026-06-20", day:"Saturday",  time:"12:00 PM CT", group:"Group F", team1:"Netherlands",         team2:"Sweden",             stage:"Group Stage" },
  { date:"2026-06-20", day:"Saturday",  time:"3:00 PM CT",  group:"Group E", team1:"Germany",             team2:"Ivory Coast",        stage:"Group Stage" },
  { date:"2026-06-20", day:"Saturday",  time:"7:00 PM CT",  group:"Group E", team1:"Ecuador",             team2:"Curaçao",            stage:"Group Stage" },
  { date:"2026-06-20", day:"Saturday",  time:"11:00 PM CT", group:"Group F", team1:"Tunisia",             team2:"Japan",              stage:"Group Stage" },
  { date:"2026-06-21", day:"Sunday",    time:"11:00 AM CT", group:"Group H", team1:"Spain",               team2:"Saudi Arabia",       stage:"Group Stage" },
  { date:"2026-06-21", day:"Sunday",    time:"2:00 PM CT",  group:"Group G", team1:"Belgium",             team2:"Iran",               stage:"Group Stage" },
  { date:"2026-06-21", day:"Sunday",    time:"5:00 PM CT",  group:"Group H", team1:"Uruguay",             team2:"Cape Verde",         stage:"Group Stage" },
  { date:"2026-06-21", day:"Sunday",    time:"8:00 PM CT",  group:"Group G", team1:"New Zealand",         team2:"Egypt",              stage:"Group Stage" },
  { date:"2026-06-22", day:"Monday",    time:"12:00 PM CT", group:"Group J", team1:"Argentina",           team2:"Austria",            stage:"Group Stage" },
  { date:"2026-06-22", day:"Monday",    time:"4:00 PM CT",  group:"Group I", team1:"France",              team2:"Iraq",               stage:"Group Stage" },
  { date:"2026-06-22", day:"Monday",    time:"7:00 PM CT",  group:"Group I", team1:"Norway",              team2:"Senegal",            stage:"Group Stage" },
  { date:"2026-06-22", day:"Monday",    time:"10:00 PM CT", group:"Group J", team1:"Jordan",              team2:"Algeria",            stage:"Group Stage" },
  { date:"2026-06-23", day:"Tuesday",   time:"12:00 PM CT", group:"Group K", team1:"Portugal",            team2:"Uzbekistan",         stage:"Group Stage" },
  { date:"2026-06-23", day:"Tuesday",   time:"3:00 PM CT",  group:"Group L", team1:"England",             team2:"Ghana",              stage:"Group Stage" },
  { date:"2026-06-23", day:"Tuesday",   time:"6:00 PM CT",  group:"Group L", team1:"Panama",              team2:"Croatia",            stage:"Group Stage" },
  { date:"2026-06-23", day:"Tuesday",   time:"9:00 PM CT",  group:"Group K", team1:"Colombia",            team2:"DR Congo",           stage:"Group Stage" },
  { date:"2026-06-24", day:"Wednesday", time:"2:00 PM CT",  group:"Group B", team1:"Switzerland",         team2:"Canada",             stage:"Group Stage" },
  { date:"2026-06-24", day:"Wednesday", time:"2:00 PM CT",  group:"Group B", team1:"Bosnia & Herzegovina",team2:"Qatar",              stage:"Group Stage" },
  { date:"2026-06-24", day:"Wednesday", time:"5:00 PM CT",  group:"Group C", team1:"Scotland",            team2:"Brazil",             stage:"Group Stage" },
  { date:"2026-06-24", day:"Wednesday", time:"5:00 PM CT",  group:"Group C", team1:"Morocco",             team2:"Haiti",              stage:"Group Stage" },
  { date:"2026-06-24", day:"Wednesday", time:"8:00 PM CT",  group:"Group A", team1:"Czechia",             team2:"Mexico",             stage:"Group Stage" },
  { date:"2026-06-24", day:"Wednesday", time:"8:00 PM CT",  group:"Group A", team1:"South Africa",        team2:"South Korea",        stage:"Group Stage" },
  { date:"2026-06-25", day:"Thursday",  time:"3:00 PM CT",  group:"Group E", team1:"Curaçao",             team2:"Ivory Coast",        stage:"Group Stage" },
  { date:"2026-06-25", day:"Thursday",  time:"3:00 PM CT",  group:"Group E", team1:"Ecuador",             team2:"Germany",            stage:"Group Stage" },
  { date:"2026-06-25", day:"Thursday",  time:"6:00 PM CT",  group:"Group F", team1:"Japan",               team2:"Sweden",             stage:"Group Stage" },
  { date:"2026-06-25", day:"Thursday",  time:"6:00 PM CT",  group:"Group F", team1:"Tunisia",             team2:"Netherlands",        stage:"Group Stage" },
  { date:"2026-06-25", day:"Thursday",  time:"9:00 PM CT",  group:"Group D", team1:"Türkiye",             team2:"USA",                stage:"Group Stage" },
  { date:"2026-06-25", day:"Thursday",  time:"9:00 PM CT",  group:"Group D", team1:"Paraguay",            team2:"Australia",          stage:"Group Stage" },
  { date:"2026-06-26", day:"Friday",    time:"2:00 PM CT",  group:"Group I", team1:"Norway",              team2:"France",             stage:"Group Stage" },
  { date:"2026-06-26", day:"Friday",    time:"2:00 PM CT",  group:"Group I", team1:"Senegal",             team2:"Iraq",               stage:"Group Stage" },
  { date:"2026-06-26", day:"Friday",    time:"7:00 PM CT",  group:"Group H", team1:"Cape Verde",          team2:"Saudi Arabia",       stage:"Group Stage" },
  { date:"2026-06-26", day:"Friday",    time:"7:00 PM CT",  group:"Group H", team1:"Uruguay",             team2:"Spain",              stage:"Group Stage" },
  { date:"2026-06-26", day:"Friday",    time:"10:00 PM CT", group:"Group G", team1:"Egypt",               team2:"Iran",               stage:"Group Stage" },
  { date:"2026-06-26", day:"Friday",    time:"10:00 PM CT", group:"Group G", team1:"New Zealand",         team2:"Belgium",            stage:"Group Stage" },
  { date:"2026-06-27", day:"Saturday",  time:"4:00 PM CT",  group:"Group L", team1:"Panama",              team2:"England",            stage:"Group Stage" },
  { date:"2026-06-27", day:"Saturday",  time:"4:00 PM CT",  group:"Group L", team1:"Croatia",             team2:"Ghana",              stage:"Group Stage" },
  { date:"2026-06-27", day:"Saturday",  time:"6:30 PM CT",  group:"Group K", team1:"Colombia",            team2:"Portugal",           stage:"Group Stage" },
  { date:"2026-06-27", day:"Saturday",  time:"6:30 PM CT",  group:"Group K", team1:"DR Congo",            team2:"Uzbekistan",         stage:"Group Stage" },
  { date:"2026-06-27", day:"Saturday",  time:"9:00 PM CT",  group:"Group J", team1:"Algeria",             team2:"Austria",            stage:"Group Stage" },
  { date:"2026-06-27", day:"Saturday",  time:"9:00 PM CT",  group:"Group J", team1:"Jordan",              team2:"Argentina",          stage:"Group Stage" },
  // Round of 32 (indices 72–87)
  { date:"2026-06-28", day:"Sunday",    time:"2:00 PM CT",  group:"", team1:"Runner-up A",           team2:"Runner-up B",           stage:"Round of 32" },
  { date:"2026-06-29", day:"Monday",    time:"12:00 PM CT", group:"", team1:"Winner C",              team2:"Runner-up F",           stage:"Round of 32" },
  { date:"2026-06-29", day:"Monday",    time:"3:30 PM CT",  group:"", team1:"Winner E",              team2:"Best 3rd (A/B/C/D/F)", stage:"Round of 32" },
  { date:"2026-06-29", day:"Monday",    time:"8:00 PM CT",  group:"", team1:"Winner F",              team2:"Runner-up C",           stage:"Round of 32" },
  { date:"2026-06-30", day:"Tuesday",   time:"12:00 PM CT", group:"", team1:"Runner-up E",           team2:"Runner-up I",           stage:"Round of 32" },
  { date:"2026-06-30", day:"Tuesday",   time:"4:00 PM CT",  group:"", team1:"Winner I",              team2:"Best 3rd (C/D/F/G/H)", stage:"Round of 32" },
  { date:"2026-06-30", day:"Tuesday",   time:"8:00 PM CT",  group:"", team1:"Winner A",              team2:"Best 3rd (C/E/F/H/I)", stage:"Round of 32" },
  { date:"2026-06-30", day:"Tuesday",   time:"11:00 PM CT", group:"", team1:"Winner L",              team2:"Best 3rd (E/H/I/J/K)", stage:"Round of 32" },
  { date:"2026-07-01", day:"Wednesday", time:"3:00 PM CT",  group:"", team1:"Winner G",              team2:"Best 3rd (A/E/H/I/J)", stage:"Round of 32" },
  { date:"2026-07-01", day:"Wednesday", time:"7:00 PM CT",  group:"", team1:"Winner D",              team2:"Best 3rd (B/E/F/I/J)", stage:"Round of 32" },
  { date:"2026-07-02", day:"Thursday",  time:"2:00 PM CT",  group:"", team1:"Winner H",              team2:"Runner-up J",           stage:"Round of 32" },
  { date:"2026-07-02", day:"Thursday",  time:"6:00 PM CT",  group:"", team1:"Runner-up K",           team2:"Runner-up L",           stage:"Round of 32" },
  { date:"2026-07-02", day:"Thursday",  time:"10:00 PM CT", group:"", team1:"Winner B",              team2:"Best 3rd (E/F/G/I/J)", stage:"Round of 32" },
  { date:"2026-07-03", day:"Friday",    time:"1:00 PM CT",  group:"", team1:"Runner-up D",           team2:"Runner-up G",           stage:"Round of 32" },
  { date:"2026-07-03", day:"Friday",    time:"5:00 PM CT",  group:"", team1:"Winner J",              team2:"Runner-up H",           stage:"Round of 32" },
  { date:"2026-07-03", day:"Friday",    time:"8:30 PM CT",  group:"", team1:"Winner K",              team2:"Best 3rd (D/E/I/J/L)", stage:"Round of 32" },
  // Round of 16 (indices 88–95)
  { date:"2026-07-04", day:"Saturday",  time:"12:00 PM CT", group:"", team1:"TBD", team2:"TBD", stage:"Round of 16" },
  { date:"2026-07-04", day:"Saturday",  time:"4:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Round of 16" },
  { date:"2026-07-05", day:"Sunday",    time:"3:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Round of 16" },
  { date:"2026-07-05", day:"Sunday",    time:"7:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Round of 16" },
  { date:"2026-07-06", day:"Monday",    time:"2:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Round of 16" },
  { date:"2026-07-06", day:"Monday",    time:"7:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Round of 16" },
  { date:"2026-07-06", day:"Monday",    time:"11:00 PM CT", group:"", team1:"TBD", team2:"TBD", stage:"Round of 16" },
  { date:"2026-07-07", day:"Tuesday",   time:"3:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Round of 16" },
  // Quarterfinal (indices 96–99)
  { date:"2026-07-09", day:"Thursday",  time:"3:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Quarterfinal" },
  { date:"2026-07-10", day:"Friday",    time:"2:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Quarterfinal" },
  { date:"2026-07-11", day:"Saturday",  time:"4:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Quarterfinal" },
  { date:"2026-07-11", day:"Saturday",  time:"8:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Quarterfinal" },
  // Semifinal (indices 100–101)
  { date:"2026-07-14", day:"Tuesday",   time:"2:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Semifinal" },
  { date:"2026-07-15", day:"Wednesday", time:"2:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Semifinal" },
  // 3rd Place (index 102)
  { date:"2026-07-18", day:"Saturday",  time:"4:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"3rd Place" },
  // Final (index 103)
  { date:"2026-07-19", day:"Sunday",    time:"2:00 PM CT",  group:"", team1:"TBD", team2:"TBD", stage:"Final" },
]

// ── State ─────────────────────────────────────────────────────────────────────

const matches   = ref([...ALL_MATCHES])
const scores    = ref({})
const view      = ref('schedule')
const stageFilter = ref('All')
const groupFilter = ref('All Groups')
const search    = ref('')
const todayOnly = ref(false)
const editingIdx  = ref(null)
const editBuf     = ref({})
const squadCountry = ref(null)
const groupPopup   = ref(null)

const TODAY = new Date().toISOString().slice(0, 10)

// ── API ───────────────────────────────────────────────────────────────────────

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/scores`)
    const data = await res.json()
    const map = {}
    data.forEach(row => { map[row.id] = { score1: row.score1, score2: row.score2 } })
    scores.value = map
  } catch (e) {
    console.error('Could not load scores:', e)
  }
})

// ── Core computeds ────────────────────────────────────────────────────────────

const matchesWithScores = computed(() =>
  matches.value.map((m, i) => ({
    ...m,
    score1: scores.value[i]?.score1 ?? '',
    score2: scores.value[i]?.score2 ?? '',
  }))
)

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
        groups[g][team] = { name:team, P:0, W:0, D:0, L:0, GF:0, GA:0, GD:0, Pts:0 }
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

  // 2. Sort each group; track completion and match counts
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

  // 4. Resolve placeholder team names in knockout matches
  const resolved = rawMatches.map(m => ({ ...m }))
  const assignedThirds = new Set()

  function resolvePlaceholder(ph) {
    const wm = ph.match(/^Winner ([A-L])$/)
    if (wm) {
      const g = `Group ${wm[1]}`
      return complete[g] ? (standings[g]?.[0]?.name ?? null) : null
    }
    const rm = ph.match(/^Runner-up ([A-L])$/)
    if (rm) {
      const g = `Group ${rm[1]}`
      return complete[g] ? (standings[g]?.[1]?.name ?? null) : null
    }
    const bm = ph.match(/^Best 3rd \(([A-L/]+)\)$/)
    if (bm && allGroupsDone) {
      const allowed = bm[1].split('/')
      for (const t of top8) {
        if (allowed.includes(t.group) && !assignedThirds.has(t.group)) {
          assignedThirds.add(t.group)
          return t.name
        }
      }
    }
    return null
  }

  // Resolve R32 placeholders
  for (let i = 72; i <= 87; i++) {
    const t1 = resolvePlaceholder(resolved[i].team1)
    const t2 = resolvePlaceholder(resolved[i].team2)
    if (t1) resolved[i] = { ...resolved[i], team1: t1 }
    if (t2) resolved[i] = { ...resolved[i], team2: t2 }
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
    [88,72,73],[89,74,75],[90,76,77],[91,78,79],
    [92,80,81],[93,82,83],[94,84,85],[95,86,87],
    [96,88,89],[97,90,91],[98,92,93],[99,94,95],
    [100,96,97],[101,98,99],
    [103,100,101],
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

  return { standings, complete, matchCounts, resolvedMatches: resolved }
}

const standingsData = computed(() => buildStandingsData(matchesWithScores.value))

const groupEntries = computed(() =>
  GROUPS.filter(g => g !== 'All Groups')
    .map(g => [g, standingsData.value.standings[g] ?? []])
)

const filtered = computed(() =>
  standingsData.value.resolvedMatches
    .map((m, i) => ({ ...m, _origIdx: i }))
    .filter(m => {
      if (todayOnly.value && m.date !== TODAY) return false
      if (stageFilter.value !== 'All' && m.stage !== stageFilter.value) return false
      if (groupFilter.value !== 'All Groups' && m.group !== groupFilter.value) return false
      if (search.value) {
        const s = search.value.toLowerCase()
        return m.team1.toLowerCase().includes(s) || m.team2.toLowerCase().includes(s) || m.group.toLowerCase().includes(s)
      }
      return true
    })
)

const grouped = computed(() => {
  const map = {}
  for (const m of filtered.value) (map[m.date] ??= []).push(m)
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateLabel(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })
}

function isReal(name) {
  return !['TBD','Winner','Runner','Best'].some(p => name.startsWith(p))
}

function stageColor(stage) {
  return STAGE_COLORS[stage] ?? STAGE_COLORS['Group Stage']
}

function badgeStyle(stage) {
  const c = stageColor(stage)
  return { background: c.badge+'22', color: c.badge, border:`1px solid ${c.badge}44`, borderRadius:'4px', padding:'2px 8px', fontSize:'11px', letterSpacing:'1px' }
}

function hasScore(idx) {
  const s = scores.value[idx]
  return s != null && s.score1 !== '' && s.score2 !== ''
}

function score1Wins(idx) {
  const s = scores.value[idx]
  return hasScore(idx) && Number(s.score1) > Number(s.score2)
}

function score2Wins(idx) {
  const s = scores.value[idx]
  return hasScore(idx) && Number(s.score2) > Number(s.score1)
}

function teamColor(idx, isTeam1) {
  if (hasScore(idx)) {
    const s = scores.value[idx]
    const isDraw = Number(s.score1) === Number(s.score2)
    if (isDraw) return '#94a3b8'
    return (isTeam1 ? score1Wins(idx) : score2Wins(idx)) ? '#f1f5f9' : '#475569'
  }
  return '#f1f5f9'
}

// ── Edit ──────────────────────────────────────────────────────────────────────

function startEdit(i) {
  editingIdx.value = i
  editBuf.value = {
    score1: scores.value[i]?.score1 ?? '',
    score2: scores.value[i]?.score2 ?? '',
  }
}

async function saveEdit(idx) {
  const s1 = String(editBuf.value.score1 ?? '')
  const s2 = String(editBuf.value.score2 ?? '')
  scores.value = { ...scores.value, [idx]: { score1: s1, score2: s2 } }
  try {
    await fetch(`${API_URL}/scores/${idx}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score1: s1, score2: s2 }),
    })
  } catch (e) {
    console.error('Could not save score:', e)
  }
  editingIdx.value = null
}

async function clearScore(idx) {
  scores.value = { ...scores.value, [idx]: { score1: '', score2: '' } }
  try {
    await fetch(`${API_URL}/scores/${idx}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score1: '', score2: '' }),
    })
  } catch (e) {}
  editingIdx.value = null
}

function cancelEdit() {
  editingIdx.value = null
}
</script>
