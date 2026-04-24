<template>
  <div class="grid-bg"></div>
  <AppHeader @exportPDF="handleExportPDF" />
  <main class="max-w-[1600px] mx-auto px-8 py-8">
    <RouterView />
  </main>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'
import { getMagikidPrograms } from '@/data/presets.js'
import AppHeader from '@/components/layout/AppHeader.vue'

const store = useLabStore()
const { currentLang } = useI18n()
const route = useRoute()

function getLabId() {
  // Support both ?labid=xxx and hash-based #/?labid=xxx
  let labId = route.query.labid
  if (!labId) {
    const hashQuery = window.location.hash.split('?')[1]
    if (hashQuery) labId = new URLSearchParams(hashQuery).get('labid')
  }
  return labId || null
}

async function loadLab(labId) {
  if (labId) {
    await store.initFromLabAPI(labId)
  } else {
    store.resetToEmpty()
  }
}

onMounted(async () => {
  document.documentElement.lang = currentLang.value
  await loadLab(getLabId())
})

// 监听 URL query 变化，支持手动修改 labid 后按 Enter 立即生效
watch(() => route.query.labid, (newLabId) => {
  loadLab(newLabId || null)
})

function handleExportPDF() {
  generatePDF()
}

function generatePDF() {
  const s = store
  const isEN = currentLang.value === 'en'

  function sec(color, title, body) {
    return `<div style="margin-bottom:25px;"><h2 style="color:#333;font-size:16px;border-left:4px solid ${color};padding-left:10px;">${title}</h2>${body}</div>`
  }
  function table(thead, rows) {
    return `<table style="width:100%;margin-top:10px;border-collapse:collapse;"><thead><tr style="background:#f5f5f5;">${thead}</tr></thead><tbody>${rows}</tbody></table>`
  }
  function th(t) { return `<th style="padding:10px;border:1px solid #ddd;text-align:left;">${t}</th>` }
  function td(t, extra) { return `<td style="padding:10px;border:1px solid #ddd;${extra || ''}">${t}</td>` }

  let html = ''

  // Header
  html += `<div style="text-align:center;margin-bottom:30px;border-bottom:3px solid #d4a853;padding-bottom:20px;">
    <h1 style="color:#d4a853;font-size:28px;margin:0;">${s.lab.name || 'MAGIKID Lab'}</h1>
    <p style="color:#666;font-size:14px;margin-top:5px;">${isEN ? 'Opening Plan' : '开业计划'}</p>
  </div>`

  // Basic Info
  if (s.lab.name || s.lab.openingDate || s.lab.address || s.lab.phone) {
    const rows = `<tr>${td(isEN?'Opening Date':'开业日期','font-weight:bold;width:30%;')}${td(s.lab.openingDate||'-')}</tr>
    <tr>${td(isEN?'Address':'地址','font-weight:bold;')}${td(s.lab.address||'-')}</tr>
    <tr>${td(isEN?'Phone':'电话','font-weight:bold;')}${td(s.lab.phone||'-')}</tr>`
    html += sec('#d4a853', isEN?'Basic Information':'基本信息', `<table style="width:100%;margin-top:10px;border-collapse:collapse;">${rows}</table>`)
  }

  // Hosts
  if (s.hosts?.length) {
    let body = ''
    s.hosts.forEach(h => {
      body += `<div style="background:#f9f9f9;padding:12px;border-radius:6px;margin-top:10px;"><strong>${h.name}</strong>`
      if (h.background) body += `<p style="margin:8px 0 0;font-size:13px;color:#666;">${h.background}</p>`
      if (h.email) body += `<p style="margin:5px 0 0;font-size:12px;color:#999;">${h.email}</p>`
      body += '</div>'
    })
    html += sec('#4ecdc4', isEN?'Lab Hosts':'Lab 主理人', body)
  }

  // Timeline
  if (s.timeline?.length) {
    const thead = th(isEN?'Time':'时间') + th(isEN?'Activity':'活动') + th(isEN?'Details':'详情')
    const rows = s.timeline.map(item => `<tr>
      <td style="padding:10px;border:1px solid #ddd;font-weight:bold;color:#d4a853;width:15%;">${item.time||'-'}</td>
      <td style="padding:10px;border:1px solid #ddd;">${item.title}</td>
      <td style="padding:10px;border:1px solid #ddd;font-size:13px;color:#666;">${(item.detail||'').replace(/\n/g,'<br>')}</td>
    </tr>`).join('')
    html += sec('#d4a853', isEN?'Activity Flow':'活动流程', table(thead, rows))
  }

  // Guests
  if (s.guests?.length) {
    const thead = th(isEN?'Name':'姓名') + th(isEN?'Title':'身份') + th(isEN?'Email':'邮箱')
    const rows = s.guests.map(g => `<tr>
      ${td(g.name)}${td(g.title||'-')}<td style="padding:10px;border:1px solid #ddd;word-break:break-all;">${g.email||'-'}</td>
    </tr>`).join('')
    const title = (isEN?'Guest List':'嘉宾名单') + ` (${s.guests.length} ${isEN?'people':'人'})`
    html += sec('#4ecdc4', title, table(thead, rows))
  }

  // Projects
  if (s.projects?.length) {
    let body = '<div style="margin-top:10px;">'
    s.projects.forEach(p => {
      body += `<div style="background:#f9f9f9;padding:10px 15px;border-radius:6px;border-left:3px solid #4ecdc4;margin-bottom:8px;">`
      body += `<strong>${p.name}</strong>`
      if (p.lead) body += `<span style="font-size:12px;color:#666;margin-left:8px;">&#128100; ${p.lead}</span>`
      if (p.duration) body += `<span style="font-size:12px;color:#666;margin-left:8px;">&#9201; ${p.duration}${isEN?' min':'分钟'}</span>`
      body += '</div>'
    })
    body += '</div>'
    html += sec('#d4a853', isEN?'Interactive Projects':'互动体验项目', body)
  }

  // Prizes
  if (s.prizes?.length) {
    const lv = {grand:isEN?'Grand Prize':'大奖',first:isEN?'1st Prize':'一等奖',second:isEN?'2nd Prize':'二等奖',third:isEN?'3rd Prize':'三等奖',participation:isEN?'Participation':'参与奖'}
    const rows = s.prizes.map(p => `<tr>
      <td style="padding:8px;border:1px solid #ddd;">${p.name}</td>
      <td style="padding:8px;border:1px solid #ddd;width:100px;text-align:center;">${lv[p.level]||''}</td>
      <td style="padding:8px;border:1px solid #ddd;width:60px;text-align:center;">x${p.quantity||1}</td>
    </tr>`).join('')
    html += sec('#4ecdc4', isEN?'Prizes & Rewards':'奖品设置', `<table style="width:100%;margin-top:10px;border-collapse:collapse;"><tbody>${rows}</tbody></table>`)
  }

  // Budget
  if (s.budget?.length) {
    const cl = {travel:isEN?'Travel':'差旅费',food:isEN?'Food':'食品',printing:isEN?'Printing':'印刷宣传品',souvenirs:isEN?'Souvenirs':'纪念品',rental:isEN?'Venue/Equipment':'场地设备',marketing:isEN?'Marketing':'市场营销',other:isEN?'Other':'其他'}
    const thead = th(isEN?'Category':'类别') +
      `<th style="padding:10px;border:1px solid #ddd;text-align:right;">${isEN?'Amount':'预算'}</th>` +
      `<th style="padding:10px;border:1px solid #ddd;text-align:right;">${isEN?'Spent':'实际'}</th>` +
      th(isEN?'Note':'备注')
    let tAmt = 0, tSpent = 0
    const rows = s.budget.map(b => {
      tAmt += (b.amount||0); tSpent += (b.spent||0)
      return `<tr>
        <td style="padding:10px;border:1px solid #ddd;">${cl[b.category]||b.category}</td>
        <td style="padding:10px;border:1px solid #ddd;text-align:right;">$${(b.amount||0).toLocaleString()}</td>
        <td style="padding:10px;border:1px solid #ddd;text-align:right;">$${(b.spent||0).toLocaleString()}</td>
        <td style="padding:10px;border:1px solid #ddd;font-size:12px;color:#666;">${b.note||'-'}</td>
      </tr>`
    }).join('')
    const totalRow = `<tr style="background:#fff9e6;font-weight:bold;">
      <td style="padding:10px;border:1px solid #ddd;">${isEN?'Total':'总计'}</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:right;color:#d4a853;">$${tAmt.toLocaleString()}</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:right;color:#d4a853;">$${tSpent.toLocaleString()}</td>
      <td style="padding:10px;border:1px solid #ddd;"></td>
    </tr>`
    html += sec('#d4a853', isEN?'Budget':'活动预算', table(thead, rows + totalRow))
  }

  // Goals
  if (s.goals && (s.goals.camp || s.goals.vexElementary || s.goals.vexMiddle || s.goals.other)) {
    const g = s.goals
    let body = '<ul style="margin-top:10px;padding-left:20px;">'
    if (g.camp) body += `<li style="margin-bottom:5px;">${isEN?'CAMP Sales Target':'CAMP 销售目标'}: ${g.camp} ${isEN?'people/day':'人/天'}</li>`
    if (g.vexElementary) body += `<li style="margin-bottom:5px;">${isEN?'VEX IQ Elementary Team':'VEX IQ 小学赛队'}: ${g.vexElementary}</li>`
    if (g.vexMiddle) body += `<li style="margin-bottom:5px;">${isEN?'VEX IQ Middle Team':'VEX IQ 中学赛队'}: ${g.vexMiddle}</li>`
    if (g.other) body += `<li style="margin-bottom:5px;">${isEN?'Other':'其他'}: ${g.other}</li>`
    body += '</ul>'
    html += sec('#4ecdc4', isEN?'Goals':'活动目标', body)
  }

  // Promo Projects
  if (s.promoProjects?.length) {
    let body = '<div style="margin-top:10px;line-height:2;">'
    s.promoProjects.forEach(pid => {
      const prog = getMagikidPrograms().find(p => p.id === pid)
      if (prog) body += `<span style="background:#f0f9ff;border:1px solid #4ecdc4;border-radius:4px;padding:4px 10px;font-size:13px;margin:2px;display:inline-block;">${prog.icon} ${prog.name}</span>`
    })
    body += '</div>'
    html += sec('#d4a853', isEN?'Promotional Programs':'推广项目', body)
  }

  // Age Structure
  if (s.ageStructure) {
    const a36 = s.ageStructure.age36 || {}
    const a714 = s.ageStructure.age714 || {}
    const a15 = s.ageStructure.age15 || {}
    const totalAge = (a36.count||0) + (a714.count||0) + (a15.count||0)
    const thead = th(isEN?'Age Group':'年龄段') +
      `<th style="padding:10px;border:1px solid #ddd;text-align:center;">${isEN?'Count':'人数'}</th>` +
      `<th style="padding:10px;border:1px solid #ddd;text-align:center;">${isEN?'Percentage':'占比'}</th>`
    const rows = `
      <tr><td style="padding:10px;border:1px solid #ddd;">${isEN?'Ages 3-6':'3-6岁'}</td><td style="padding:10px;border:1px solid #ddd;text-align:center;">${a36.count||0} ${isEN?'ppl':'人'}</td><td style="padding:10px;border:1px solid #ddd;text-align:center;">${a36.percent||0}%</td></tr>
      <tr><td style="padding:10px;border:1px solid #ddd;">${isEN?'Ages 7-14':'7-14岁'}</td><td style="padding:10px;border:1px solid #ddd;text-align:center;">${a714.count||0} ${isEN?'ppl':'人'}</td><td style="padding:10px;border:1px solid #ddd;text-align:center;">${a714.percent||0}%</td></tr>
      <tr><td style="padding:10px;border:1px solid #ddd;">${isEN?'Ages 15+':'15岁以上'}</td><td style="padding:10px;border:1px solid #ddd;text-align:center;">${a15.count||0} ${isEN?'ppl':'人'}</td><td style="padding:10px;border:1px solid #ddd;text-align:center;">${a15.percent||0}%</td></tr>
      <tr style="background:#fff9e6;font-weight:bold;"><td style="padding:10px;border:1px solid #ddd;">${isEN?'Total':'总计'}</td><td style="padding:10px;border:1px solid #ddd;text-align:center;color:#d4a853;">${totalAge} ${isEN?'ppl':'人'}</td><td style="padding:10px;border:1px solid #ddd;"></td></tr>`
    html += sec('#4ecdc4', isEN?'Age Coverage':'学生年龄结构', table(thead, rows))
  }

  // Staff Arrangement (consolidated: chiefLead, host, leads, reception, vips, raffleHosts)
  const hasStaff = (s.staff && (s.staff.chiefLead || s.staff.host)) || s.leads?.length || s.reception?.length || s.vips?.length || s.raffleHosts?.length
  if (hasStaff) {
    let rows = ''
    if (s.staff?.chiefLead) rows += `<tr><td style="padding:8px;border:1px solid #ddd;width:30%;font-weight:bold;">${isEN?'Chief Lead':'总负责人'}</td><td style="padding:8px;border:1px solid #ddd;">${s.staff.chiefLead}</td></tr>`
    if (s.staff?.host) rows += `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">${isEN?'Host/MC':'主持人'}</td><td style="padding:8px;border:1px solid #ddd;">${s.staff.host}</td></tr>`
    if (s.leads?.length) rows += `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;vertical-align:top;">${isEN?'Project Leads':'项目负责人'}</td><td style="padding:8px;border:1px solid #ddd;">${s.leads.map(l => l.name + (l.role ? ` (${l.role})` : '')).join('<br>')}</td></tr>`
    if (s.reception?.length) rows += `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;vertical-align:top;">${isEN?'Reception':'客户接待'}</td><td style="padding:8px;border:1px solid #ddd;">${s.reception.map(r => r.name + (r.role ? ` (${r.role})` : '')).join('<br>')}</td></tr>`
    if (s.vips?.length) rows += `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;vertical-align:top;">${isEN?'VIP Reception':'VIP接待'}</td><td style="padding:8px;border:1px solid #ddd;">${s.vips.map(v => v.name + (v.handler ? ` → ${v.handler}` : '')).join('<br>')}</td></tr>`
    if (s.raffleHosts?.length) rows += `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;vertical-align:top;">${isEN?'Raffle Hosts':'抽奖嘉宾'}</td><td style="padding:8px;border:1px solid #ddd;">${s.raffleHosts.map(r => r.name + (r.title ? ` (${r.title})` : '')).join('<br>')}</td></tr>`
    html += sec('#d4a853', isEN?'Staff Arrangement':'人员安排', `<table style="width:100%;margin-top:10px;border-collapse:collapse;">${rows}</table>`)
  }

  // Materials
  const hasMaterials = s.posters?.length || s.videos?.length || s.banners?.length
  if (hasMaterials) {
    let rows = ''
    if (s.posters?.length) rows += `<tr><td style="padding:8px;border:1px solid #ddd;width:25%;font-weight:bold;vertical-align:top;">${isEN?'Posters':'电子海报'}</td><td style="padding:8px;border:1px solid #ddd;">${s.posters.map(p => p.name).join('<br>')}</td></tr>`
    if (s.videos?.length) rows += `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;vertical-align:top;">${isEN?'Videos':'宣传视频'}</td><td style="padding:8px;border:1px solid #ddd;">${s.videos.map(v => v.name).join('<br>')}</td></tr>`
    if (s.banners?.length) rows += `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;vertical-align:top;">${isEN?'Banners':'易拉宝'}</td><td style="padding:8px;border:1px solid #ddd;">${s.banners.map(b => b.name + (b.location ? ` - ${b.location}` : '')).join('<br>')}</td></tr>`
    html += sec('#4ecdc4', isEN?'Materials':'物料管理', `<table style="width:100%;margin-top:10px;border-collapse:collapse;">${rows}</table>`)
  }

  // Social Media
  const hasSocial = (s.social && (s.social.instagram || s.social.facebook || s.social.youtube || s.social.xiaohongshu)) || s.socialPosts?.length
  if (hasSocial) {
    let body = ''
    if (s.social) {
      let arows = ''
      if (s.social.instagram) arows += `<tr><td style="padding:8px;border:1px solid #ddd;width:25%;font-weight:bold;">Instagram</td><td style="padding:8px;border:1px solid #ddd;">${s.social.instagram}</td></tr>`
      if (s.social.facebook) arows += `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Facebook</td><td style="padding:8px;border:1px solid #ddd;">${s.social.facebook}</td></tr>`
      if (s.social.youtube) arows += `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">YouTube</td><td style="padding:8px;border:1px solid #ddd;">${s.social.youtube}</td></tr>`
      if (s.social.xiaohongshu) arows += `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">${isEN?'Xiaohongshu':'小红书'}</td><td style="padding:8px;border:1px solid #ddd;">${s.social.xiaohongshu}</td></tr>`
      if (arows) body += `<table style="width:100%;margin-top:10px;border-collapse:collapse;">${arows}</table>`
    }
    if (s.socialPosts?.length) {
      const phead = `<th style="padding:8px;border:1px solid #ddd;text-align:left;width:20%;">${isEN?'Date':'日期'}</th><th style="padding:8px;border:1px solid #ddd;text-align:left;width:20%;">${isEN?'Platform':'平台'}</th><th style="padding:8px;border:1px solid #ddd;text-align:left;">${isEN?'Content':'内容'}</th>`
      const prows = s.socialPosts.map(p => `<tr><td style="padding:8px;border:1px solid #ddd;">${p.date||'-'}</td><td style="padding:8px;border:1px solid #ddd;">${p.platform||'-'}</td><td style="padding:8px;border:1px solid #ddd;font-size:13px;">${p.content||'-'}</td></tr>`).join('')
      body += `<table style="width:100%;margin-top:10px;border-collapse:collapse;"><thead><tr style="background:#f5f5f5;">${phead}</tr></thead><tbody>${prows}</tbody></table>`
    }
    html += sec('#d4a853', isEN?'Social Media':'Social Media 安排', body)
  }

  // Checklist
  if (s.checklist?.length) {
    const DEFAULT_ITEMS = ['确认场地布置','邀请嘉宾名单确认','活动流程彩排','设备调试（机器人、展示项目）','餐饮预订确认','物料印刷完成','奖品准备','社交媒体预告发布','人员分工确认','应急预案准备','网站设计完成','课程发布','夏令营发布 & 完赛队召集发布','微信群建立','线上宣讲会预热']
    const items = s.checklistItems || DEFAULT_ITEMS
    const checkedCount = s.checklist.filter(Boolean).length
    const chead = `<th style="padding:8px;border:1px solid #ddd;width:40px;text-align:center;">${isEN?'Done':'完成'}</th><th style="padding:8px;border:1px solid #ddd;text-align:left;">${isEN?'Task':'任务'}</th><th style="padding:8px;border:1px solid #ddd;text-align:left;width:120px;">${isEN?'Owner':'负责人'}</th>`
    const crows = items.map((item, i) => {
      const checked = !!(s.checklist[i])
      const owner = (s.checklistOwners && s.checklistOwners[i]) || ''
      const bg = checked ? 'background:#f0fff4;' : ''
      const strike = checked ? 'text-decoration:line-through;color:#999;' : ''
      const icon = checked ? '&#10003;' : '&#9633;'
      const iconColor = checked ? '#16a34a' : '#999'
      return `<tr style="${bg}"><td style="padding:8px;border:1px solid #ddd;text-align:center;color:${iconColor};">${icon}</td><td style="padding:8px;border:1px solid #ddd;${strike}">${item}</td><td style="padding:8px;border:1px solid #ddd;font-size:13px;color:#666;">${owner||'-'}</td></tr>`
    }).join('')
    const title = `${isEN?'Opening Checklist':'开业准备清单'} (${checkedCount}/${items.length} ${isEN?'completed':'完成'})`
    html += sec('#4ecdc4', title, `<table style="width:100%;margin-top:10px;border-collapse:collapse;"><thead><tr style="background:#f5f5f5;">${chead}</tr></thead><tbody>${crows}</tbody></table>`)
  }

  // Footer
  html += `<div style="margin-top:40px;padding-top:20px;border-top:1px solid #ddd;text-align:center;color:#999;font-size:12px;">
    <p>${isEN?'Generated by MAGIKID Lab Opening Assistant':'由 MAGIKID Lab 开业助手 生成'}</p>
    <p>${new Date().toLocaleDateString(isEN?'en-US':'zh-CN')}</p>
  </div>`

  // Print via new window (avoids html2canvas interference from browser extensions)
  const filename = `MAGIKID-${s.lab.name||'Lab'}-${isEN?'Opening-Plan':'开业计划'}-${new Date().toISOString().split('T')[0]}`
  const printWin = window.open('', '_blank', 'width=900,height=700')
  printWin.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename}</title><style>
    body{font-family:"Helvetica Neue",Arial,"Microsoft YaHei",sans-serif;color:#333;margin:0;padding:0;}
    @media print{@page{margin:15mm;size:A4;}body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
  </style></head><body>`)
  printWin.document.write(html)
  printWin.document.write('</body></html>')
  printWin.document.close()
  printWin.focus()
  setTimeout(() => { printWin.print() }, 800)
}
</script>
