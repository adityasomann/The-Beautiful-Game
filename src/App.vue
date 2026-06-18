<template>
  <div style="min-height:100vh;background:#060d1c;font-family:Georgia,'Times New Roman',serif;color:#e2e8f0">

    <!-- Group Standings Popup -->
    <div v-if="groupPopup" @click="groupPopup=null"
      style="position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)">
      <div @click.stop style="background:#0a1628;border:1px solid #1e40af55;border-radius:16px;padding:28px;width:100%;max-width:480px;max-height:82vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.7)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
          <div>
            <div style="font-size:11px;letter-spacing:3px;color:#60a5fa;text-transform:uppercase;margin-bottom:4px">Group Standings</div>
            <h2 style="margin:0 0 4px;font-size:24px;color:#f1f5f9;font-family:Georgia,serif">{{ groupPopup }}</h2>
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
      <button @click="view='bracket'"
        :style="{background:'none',border:'none',borderBottom:view==='bracket'?'2px solid #3b82f6':'2px solid transparent',color:view==='bracket'?'#60a5fa':'#475569',padding:'12px 18px',fontSize:'12px',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',fontFamily:'Georgia,serif',transition:'color 0.15s'}">
        Bracket
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
            <div style="background:#1e40af;color:#fff;border-radius:6px;padding:4px 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase">{{ getDay(dayMatches[0].date) }}</div>
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
                    @mouseleave="e=>e.currentTarget.style.opacity='1'">{{ m.group }}</span>
                  <span :style="badgeStyle(m.stage)">{{ m.stage }}</span>
                  <div @click="startEdit(m._origIdx)" title="Edit score"
                    style="color:#334155;font-size:13px;cursor:pointer;padding:2px 6px;border-radius:4px;transition:color 0.15s"
                    @mouseenter="e=>e.currentTarget.style.color='#60a5fa'"
                    @mouseleave="e=>e.currentTarget.style.color='#334155'">✎</div>
                </div>
                <div v-if="m.venue" style="width:100%;padding-top:6px;font-size:11px;color:#475569;letter-spacing:0.3px">
                  📍 {{ m.venue }}
                </div>
              </div>

            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- Bracket view -->
    <template v-else-if="view === 'bracket'">
      <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;padding:24px 0 48px">
        <div style="min-width:1000px;padding:0 20px">
          <!-- Round labels -->
          <div style="display:flex;margin-bottom:16px">
            <div v-for="col in bracketColumns" :key="col.label"
              style="width:200px;text-align:center;font-size:10px;letter-spacing:2px;color:#475569;text-transform:uppercase;flex-shrink:0">
              {{ col.label }}
            </div>
          </div>
          <!-- Bracket body -->
          <div :style="{display:'flex',position:'relative',height:BRACKET_TOTAL+'px'}">
            <div v-for="(col, colIdx) in bracketColumns" :key="col.label"
              style="width:200px;position:relative;flex-shrink:0">
              <div v-for="(m, i) in col.matches" :key="m._origIdx"
                :style="{position:'absolute',top:bracketTop(colIdx,i)+'px',left:'6px',right:'6px',zIndex:editingIdx===m._origIdx?10:1}">

                <!-- Edit mode -->
                <div v-if="editingIdx===m._origIdx"
                  style="background:#0f1e35;border:1px solid #3b82f644;border-left:2px solid #3b82f6;border-radius:6px;padding:8px;font-size:12px">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
                    <span style="color:#94a3b8;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px">{{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}</span>
                    <input v-model="editBuf.score1" type="number" min="0" @keyup.enter="saveEdit(m._origIdx)"
                      style="background:#0d1f38;border:1px solid #3b82f655;color:#e2e8f0;border-radius:4px;padding:3px 0;font-size:15px;font-weight:700;font-family:Georgia,serif;width:34px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                    <span style="color:#94a3b8;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px">{{ COUNTRY_FLAGS[m.team2] ?? '' }} {{ m.team2 }}</span>
                    <input v-model="editBuf.score2" type="number" min="0" @keyup.enter="saveEdit(m._origIdx)"
                      style="background:#0d1f38;border:1px solid #3b82f655;color:#e2e8f0;border-radius:4px;padding:3px 0;font-size:15px;font-weight:700;font-family:Georgia,serif;width:34px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
                  </div>
                  <div style="display:flex;gap:4px">
                    <button @click="cancelEdit" style="flex:1;background:transparent;color:#64748b;border:1px solid #1e3a6e;border-radius:4px;padding:3px 0;font-size:10px;cursor:pointer;font-family:Georgia,serif">Cancel</button>
                    <button v-if="hasScore(m._origIdx)" @click="clearScore(m._origIdx)" style="background:transparent;color:#ef4444;border:1px solid #7f1d1d;border-radius:4px;padding:3px 5px;font-size:10px;cursor:pointer;font-family:Georgia,serif">✕</button>
                    <button @click="saveEdit(m._origIdx)" style="flex:1;background:#1d4ed8;color:#fff;border:none;border-radius:4px;padding:3px 0;font-size:10px;cursor:pointer;font-family:Georgia,serif">Save</button>
                  </div>
                </div>

                <!-- View mode -->
                <div v-else :style="{background:'#0c1a2e',border:`1px solid ${stageColor(m.stage).badge}44`,borderLeft:`2px solid ${stageColor(m.stage).badge}`,borderRadius:'6px',overflow:'hidden',fontSize:'12px'}">
                  <div :style="{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 8px',background:score1Wins(m._origIdx)?'#0d2040':'transparent',borderBottom:'1px solid #0d1f3844'}">
                    <span :style="{color:hasScore(m._origIdx)?(score1Wins(m._origIdx)?'#f1f5f9':'#334155'):'#64748b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'130px',cursor:isReal(m.team1)?'pointer':'default'}"
                      @click="isReal(m.team1)?squadCountry=m.team1:null">
                      {{ COUNTRY_FLAGS[m.team1] ?? '' }} {{ m.team1 }}
                    </span>
                    <span v-if="hasScore(m._origIdx)" :style="{fontSize:'13px',fontWeight:700,color:score1Wins(m._origIdx)?'#f1f5f9':'#475569',flexShrink:0,marginLeft:'4px'}">{{ scores[m._origIdx].score1 }}</span>
                  </div>
                  <div :style="{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 8px',background:score2Wins(m._origIdx)?'#0d2040':'transparent',borderBottom:'1px solid #0d1f3844'}">
                    <span :style="{color:hasScore(m._origIdx)?(score2Wins(m._origIdx)?'#f1f5f9':'#334155'):'#64748b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'130px',cursor:isReal(m.team2)?'pointer':'default'}"
                      @click="isReal(m.team2)?squadCountry=m.team2:null">
                      {{ COUNTRY_FLAGS[m.team2] ?? '' }} {{ m.team2 }}
                    </span>
                    <span v-if="hasScore(m._origIdx)" :style="{fontSize:'13px',fontWeight:700,color:score2Wins(m._origIdx)?'#f1f5f9':'#475569',flexShrink:0,marginLeft:'4px'}">{{ scores[m._origIdx].score2 }}</span>
                  </div>
                  <div style="border-top:1px solid #0d1f3822;padding:3px 8px">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <span style="font-size:9px;color:#334155;letter-spacing:0.3px">{{ m.date }} · {{ m.time }}</span>
                      <div @click="startEdit(m._origIdx)" style="color:#1e3a6e;font-size:11px;cursor:pointer;padding:1px 3px;border-radius:3px;transition:color 0.15s"
                        @mouseenter="e=>e.currentTarget.style.color='#60a5fa'"
                        @mouseleave="e=>e.currentTarget.style.color='#1e3a6e'">✎</div>
                    </div>
                    <div v-if="m.venue" style="font-size:9px;color:#1e3a6e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px">📍 {{ m.venue }}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <!-- 3rd Place -->
          <div style="max-width:400px;margin:36px auto 0;border-top:1px solid #1e3a6e33;padding-top:24px">
            <div style="text-align:center;margin-bottom:10px">
              <div style="font-size:10px;letter-spacing:2px;color:#b45309;text-transform:uppercase">3rd Place</div>
              <div style="font-size:11px;color:#475569;margin-top:3px">{{ bracketThirdPlace.date }} · {{ bracketThirdPlace.time }}</div>
              <div v-if="bracketThirdPlace.venue" style="font-size:11px;color:#334155;margin-top:1px">📍 {{ bracketThirdPlace.venue }}</div>
            </div>

            <!-- 3rd Place edit mode -->
            <div v-if="editingIdx===102"
              style="background:#0f1e35;border:1px solid #3b82f644;border-left:2px solid #3b82f6;border-radius:6px;padding:12px;font-size:13px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <span style="color:#94a3b8;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ COUNTRY_FLAGS[bracketThirdPlace.team1] ?? '' }} {{ bracketThirdPlace.team1 }}</span>
                <input v-model="editBuf.score1" type="number" min="0" @keyup.enter="saveEdit(102)"
                  style="background:#0d1f38;border:1px solid #3b82f655;color:#e2e8f0;border-radius:4px;padding:4px 0;font-size:18px;font-weight:700;font-family:Georgia,serif;width:40px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                <span style="color:#94a3b8;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ COUNTRY_FLAGS[bracketThirdPlace.team2] ?? '' }} {{ bracketThirdPlace.team2 }}</span>
                <input v-model="editBuf.score2" type="number" min="0" @keyup.enter="saveEdit(102)"
                  style="background:#0d1f38;border:1px solid #3b82f655;color:#e2e8f0;border-radius:4px;padding:4px 0;font-size:18px;font-weight:700;font-family:Georgia,serif;width:40px;text-align:center;outline:none;flex-shrink:0;-moz-appearance:textfield"/>
              </div>
              <div style="display:flex;gap:6px;justify-content:flex-end">
                <button @click="cancelEdit" style="background:transparent;color:#64748b;border:1px solid #1e3a6e;border-radius:4px;padding:5px 14px;font-size:11px;cursor:pointer;font-family:Georgia,serif">Cancel</button>
                <button v-if="hasScore(102)" @click="clearScore(102)" style="background:transparent;color:#ef4444;border:1px solid #7f1d1d;border-radius:4px;padding:5px 14px;font-size:11px;cursor:pointer;font-family:Georgia,serif">Delete</button>
                <button @click="saveEdit(102)" style="background:#1d4ed8;color:#fff;border:none;border-radius:4px;padding:5px 14px;font-size:11px;cursor:pointer;font-family:Georgia,serif">Save</button>
              </div>
            </div>

            <!-- 3rd Place view mode -->
            <div v-else style="background:#0c1a2e;border:1px solid #b4530933;border-left:2px solid #b45309;border-radius:6px;overflow:hidden;font-size:13px">
              <div :style="{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 12px',background:score1Wins(102)?'#0d2040':'transparent',borderBottom:'1px solid #0d1f3844'}">
                <span :style="{color:hasScore(102)?(score1Wins(102)?'#f1f5f9':'#475569'):'#94a3b8',cursor:isReal(bracketThirdPlace.team1)?'pointer':'default'}"
                  @click="isReal(bracketThirdPlace.team1)?squadCountry=bracketThirdPlace.team1:null">
                  {{ COUNTRY_FLAGS[bracketThirdPlace.team1] ?? '' }} {{ bracketThirdPlace.team1 }}
                </span>
                <span v-if="hasScore(102)" :style="{fontWeight:700,color:score1Wins(102)?'#f1f5f9':'#64748b'}">{{ scores[102].score1 }}</span>
              </div>
              <div :style="{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 12px',background:score2Wins(102)?'#0d2040':'transparent',borderBottom:'1px solid #0d1f3844'}">
                <span :style="{color:hasScore(102)?(score2Wins(102)?'#f1f5f9':'#475569'):'#94a3b8',cursor:isReal(bracketThirdPlace.team2)?'pointer':'default'}"
                  @click="isReal(bracketThirdPlace.team2)?squadCountry=bracketThirdPlace.team2:null">
                  {{ COUNTRY_FLAGS[bracketThirdPlace.team2] ?? '' }} {{ bracketThirdPlace.team2 }}
                </span>
                <span v-if="hasScore(102)" :style="{fontWeight:700,color:score2Wins(102)?'#f1f5f9':'#64748b'}">{{ scores[102].score2 }}</span>
              </div>
              <div style="display:flex;justify-content:flex-end;padding:3px 8px;border-top:1px solid #0d1f3822">
                <div @click="startEdit(102)" style="color:#1e3a6e;font-size:11px;cursor:pointer;padding:1px 3px;border-radius:3px;transition:color 0.15s"
                  @mouseenter="e=>e.currentTarget.style.color='#60a5fa'"
                  @mouseleave="e=>e.currentTarget.style.color='#1e3a6e'">✎</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Group Standings view -->
    <div v-else-if="view === 'standings'" style="max-width:1200px;margin:0 auto;padding:24px 16px 40px">
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
                :style="{background: idx < 8 ? '#0d1f38' : 'transparent'}">
                <td style="padding:7px 4px 7px 12px;border-bottom:1px solid #0d1f3822">
                  <span :style="{color:idx<8?'#3b82f6':'#1e3a6e',fontSize:'11px',fontWeight:idx<8?700:400}">{{ idx+1 }}</span>
                </td>
                <td style="padding:7px 4px;border-bottom:1px solid #0d1f3822">
                  <div style="display:flex;align-items:center;gap:5px">
                    <span style="font-size:13px">{{ COUNTRY_FLAGS[team.name] ?? '' }}</span>
                    <span :style="{color:idx<8?'#cbd5e1':'#475569'}">{{ team.name }}</span>
                    <!-- cutoff line indicator -->
                    <span v-if="idx===7 && standingsData.thirdsTracker.length>8"
                      style="font-size:9px;letter-spacing:1px;color:#3b82f6;background:#1e40af22;border:1px solid #3b82f655;border-radius:3px;padding:1px 5px;flex-shrink:0">LAST</span>
                  </div>
                </td>
                <td style="text-align:center;padding:7px 4px;border-bottom:1px solid #0d1f3822">
                  <span :style="{fontSize:'10px',color:team.complete?'#22c55e':'#f59e0b'}">{{ team.group.replace('Group ','') }}</span>
                </td>
                <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.P }}</td>
                <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.W }}</td>
                <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.D }}</td>
                <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.L }}</td>
                <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.GF }}</td>
                <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.GA }}</td>
                <td style="text-align:center;color:#64748b;padding:7px 4px;border-bottom:1px solid #0d1f3822">{{ team.GD > 0 ? '+'+team.GD : team.GD }}</td>
                <td style="text-align:center;font-weight:700;padding:7px 4px;border-bottom:1px solid #0d1f3822"
                  :style="{color:idx<8?'#e2e8f0':'#475569'}">{{ team.Pts }}</td>
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

    <div style="text-align:center;padding:24px;color:#1e3a6e;font-size:12px;letter-spacing:2px">FIFA WORLD CUP 2026™ · CANADA · MEXICO · UNITED STATES</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SQUADS } from './data/squads.js'
import { ALL_MATCHES } from './data/matches.js'

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


const STAGE_COLORS = {
  "Group Stage":  { accent:"#1e40af", badge:"#1d4ed8" },
  "Round of 32":  { accent:"#065f46", badge:"#059669" },
  "Round of 16":  { accent:"#6b21a8", badge:"#9333ea" },
  "Quarterfinal": { accent:"#92400e", badge:"#d97706" },
  "Semifinal":    { accent:"#991b1b", badge:"#dc2626" },
  "3rd Place":    { accent:"#78350f", badge:"#b45309" },
  "Final":        { accent:"#854d0e", badge:"#eab308" },
}

const STAGES = ["All","Group Stage"]
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

const BRACKET_SLOT  = 96
const BRACKET_CARD  = 82
const BRACKET_TOTAL = 16 * BRACKET_SLOT

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

  return { standings, complete, matchCounts, resolvedMatches: resolved, thirdsTracker }
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
      if (m.stage !== 'Group Stage') return false
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

const bracketColumns = computed(() => {
  const rm = standingsData.value.resolvedMatches
  return [
    { label: 'Round of 32',  matches: rm.slice(72, 88).map((m, i) => ({ ...m, _origIdx: 72 + i })) },
    { label: 'Round of 16',  matches: rm.slice(88, 96).map((m, i) => ({ ...m, _origIdx: 88 + i })) },
    { label: 'Quarterfinal', matches: rm.slice(96, 100).map((m, i) => ({ ...m, _origIdx: 96 + i })) },
    { label: 'Semifinal',    matches: rm.slice(100, 102).map((m, i) => ({ ...m, _origIdx: 100 + i })) },
    { label: 'Final',        matches: [{ ...rm[103], _origIdx: 103 }] },
  ]
})

const bracketThirdPlace = computed(() => ({ ...standingsData.value.resolvedMatches[102], _origIdx: 102 }))

function bracketTop(roundIdx, matchIdx) {
  const slotSize = BRACKET_SLOT * Math.pow(2, roundIdx)
  return matchIdx * slotSize + slotSize / 2 - BRACKET_CARD / 2
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateLabel(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })
}

function getDay(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday:'long' })
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
