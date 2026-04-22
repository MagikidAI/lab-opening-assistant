<template>
  <div class="grid-bg"></div>
  <AppHeader @exportPDF="handleExportPDF" />
  <main class="max-w-[1600px] mx-auto px-8 py-8">
    <RouterView />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLabStore } from '@/stores/lab.js'
import { useI18n } from '@/composables/useI18n.js'
import AppHeader from '@/components/layout/AppHeader.vue'

const store = useLabStore()
const { currentLang } = useI18n()

onMounted(() => {
  document.documentElement.lang = currentLang.value
  store.loadData()
  if (!localStorage.getItem('magikidLabAssistant')) {
    if (confirm('是否加载 Las Vegas Lab 预设数据？')) {
      store.loadPreset()
    }
  }
})

async function handleExportPDF() {
  // Load html2pdf dynamically
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
  document.head.appendChild(script)
  script.onload = () => {
    generatePDF()
  }
  if (window.html2pdf) {
    generatePDF()
  }
}

function generatePDF() {
  const s = store
  const isEN = false
  function sec(color, title, body) {
    return `<div style="margin-bottom:25px;"><h2 style="color:#333;font-size:16px;border-left:4px solid ${color};padding-left:10px;">${title}</h2>${body}</div>`
  }
  function table(thead, rows) {
    return `<table style="width:100%;margin-top:10px;border-collapse:collapse;"><thead><tr style="background:#f5f5f5;">${thead}</tr></thead><tbody>${rows}</tbody></table>`
  }
  function th(t) { return `<th style="padding:10px;border:1px solid #ddd;text-align:left;">${t}</th>` }
  function td(t, extra) { return `<td style="padding:10px;border:1px solid #ddd;${extra || ''}">${t}</td>` }

  let html = ''
  html += `<div style="text-align:center;margin-bottom:30px;border-bottom:3px solid #d4a853;padding-bottom:20px;">
    <h1 style="color:#d4a853;font-size:28px;margin:0;">${s.lab.name || 'MAGIKID Lab'}</h1>
    <p style="color:#666;font-size:14px;margin-top:5px;">开业计划</p>
  </div>`

  if (s.lab.openingDate) {
    const rows = `<tr>${td('开业日期','font-weight:bold;width:30%;')}${td(s.lab.openingDate)}</tr>
    <tr>${td('地址','font-weight:bold;')}${td(s.lab.address||'-')}</tr>
    <tr>${td('电话','font-weight:bold;')}${td(s.lab.phone||'-')}</tr>`
    html += sec('#d4a853','基本信息',`<table style="width:100%;margin-top:10px;border-collapse:collapse;">${rows}</table>`)
  }

  if (s.hosts?.length) {
    let body = ''
    s.hosts.forEach(h => {
      body += `<div style="background:#f9f9f9;padding:12px;border-radius:6px;margin-top:10px;"><strong>${h.name}</strong>`
      if (h.background) body += `<p style="margin:8px 0 0;font-size:13px;color:#666;">${h.background}</p>`
      body += '</div>'
    })
    html += sec('#4ecdc4','Lab 主理人', body)
  }

  if (s.timeline?.length) {
    const thead = th('时间') + th('活动') + th('详情')
    const rows = s.timeline.map(item => `<tr>
      <td style="padding:10px;border:1px solid #ddd;font-weight:bold;color:#d4a853;width:15%;">${item.time||'-'}</td>
      <td style="padding:10px;border:1px solid #ddd;">${item.title}</td>
      <td style="padding:10px;border:1px solid #ddd;font-size:13px;color:#666;">${(item.detail||'').replace(/\n/g,'<br>')}</td>
    </tr>`).join('')
    html += sec('#d4a853','活动流程',table(thead, rows))
  }

  if (s.guests?.length) {
    const thead = th('姓名') + th('身份') + th('邮箱')
    const rows = s.guests.map(g => `<tr>${td(g.name)}${td(g.title||'-')}<td style="padding:10px;border:1px solid #ddd;word-break:break-all;">${g.email||'-'}</td></tr>`).join('')
    html += sec('#4ecdc4',`嘉宾名单 (${s.guests.length}人)`,table(thead, rows))
  }

  if (s.budget?.length) {
    const total = s.totalBudgetAmount
    const thead = th('类别') + th('预算') + th('备注')
    const catMap = { travel:'差旅费',food:'食品',printing:'印刷',souvenirs:'纪念品',rental:'场地',marketing:'营销',other:'其他' }
    const rows = s.budget.map(b => `<tr>${td(catMap[b.category]||b.category)}${td('$'+(b.amount||0).toLocaleString(),'color:#d4a853;font-weight:bold;')}${td(b.note||'-')}</tr>`).join('')
    html += sec('#d4a853',`活动预算 (总计: $${total.toLocaleString()})`,table(thead, rows))
  }

  if (s.checklist?.length) {
    const items = s.checklistItems || ['确认场地布置','邀请嘉宾名单确认','活动流程彩排','设备调试（机器人、展示项目）','餐饮预订确认','物料印刷完成','奖品准备','社交媒体预告发布','人员分工确认','应急预案准备','网站设计完成','课程发布','夏令营发布 & 完赛队召集发布','微信群建立','线上宣讲会预热']
    const progress = s.checklistProgress
    let body = `<div style="margin-top:10px;background:#f5f5f5;border-radius:6px;overflow:hidden;height:12px;"><div style="height:100%;background:#4ecdc4;width:${progress}%;"></div></div>`
    body += `<p style="margin-top:5px;font-size:12px;color:#666;">${s.checklist.filter(Boolean).length}/${s.checklist.length} 完成</p><ul style="margin-top:10px;">`
    items.forEach((item, i) => {
      body += `<li style="padding:6px 0;font-size:13px;${s.checklist[i]?'color:#aaa;text-decoration:line-through;':'color:#333;'}">${s.checklist[i]?'✅':'⬜'} ${item}</li>`
    })
    body += '</ul>'
    html += sec('#6c757d','开业准备清单',body)
  }

  const element = document.createElement('div')
  element.style.cssText = 'font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 800px;'
  element.innerHTML = html

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `${s.lab.name || 'lab-opening'}-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }
  window.html2pdf().from(element).set(opt).save()
}
</script>
