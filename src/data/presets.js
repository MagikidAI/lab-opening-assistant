export const MAGIKID_PROGRAMS = [
  { id: 'robotics', name: '机器人小班课', desc: 'VEX IQ / VEX GO / Robotis', icon: '🤖' },
  { id: 'ai-camp', name: 'AI机器人夏令营', desc: 'Summer Camp', icon: '☀️' },
  { id: 'vex-iq', name: 'VEX IQ 比赛训练', desc: '小学组竞赛培训', icon: '🏆' },
  { id: 'nasa', name: 'NASA比赛筹备', desc: 'NASA Space Apps Challenge', icon: '🚀' },
  { id: 'stanford', name: '斯坦福比赛筹备', desc: 'Stanford & IOAI', icon: '🎓' },
  { id: 'vex-ai', name: 'VEX AI比赛训练', desc: '中学组竞赛培训', icon: '🧠' },
  { id: 'ioai', name: '奥林匹克AI课程', desc: 'IOAI 美国国家队培训', icon: '🥇' },
  { id: 'private', name: '私教课', desc: '1对1个性化教学', icon: '👨‍🏫' },
  { id: 'birthday', name: '生日派对', desc: '机器人主题派对', icon: '🎂' },
  { id: 'adult', name: '成年人课程', desc: '成人STEM教育', icon: '💼' },
  { id: 'senior', name: 'Senior课程', desc: '银发族科技课程', icon: '👴' },
]

export const LAS_VEGAS_DATA = {
  lab: {
    name: 'MAGIKID Las Vegas Lab',
    openingDate: '2026-05-16',
    address: 'Las Vegas, NV',
    phone: ''
  },
  hosts: [
    {
      name: 'Bruce（Las Vegas 知名人士）',
      background: '前美国商务部重要领导之一，负责美国和中国商务关系合作，引进WeChat进入美国，协调最早的美国商务团访问中国。退休后在Las Vegas创办10年历史的East-West School，常年举办本地国际象棋大赛和中文考试等，当地口碑极佳。',
      email: ''
    },
    {
      name: 'Susan（East-West School 校长 / 知名教育家）',
      background: '知名教育家、媒体主播，East-West School联合创始人，10年办学经验，常年举办本地国际象棋大赛和中文考试。',
      email: ''
    }
  ],
  timeline: [
    { time: '11:00', title: '🎓 East-West School 学期末颁奖典礼', detail: '【主持人】Matt - MAGIKID课程总监\n\n【典礼内容】\n- 学期末优秀学生表彰\n- 学生才艺展示\n- 年度颁奖环节' },
    { time: '11:30', title: '🎉 MAGIKID Las Vegas Lab 开业典礼', detail: '【主持人】Matt\n\n【剪彩仪式 & 发言嘉宾】\n1. Susan - East-West School 校长（主办方）\n2. Bruce - Las Vegas知名人士（主办方）\n3. 市长 - Las Vegas市政代表\n4. 两党议员 - 政商名流代表\n5. Angell - MAGIKID创始人' },
    { time: '12:00', title: '🎓 斯坦福博士后演讲', detail: '主题：Can Life Engineering?\n斯坦福博士后分享AI与生命的未来\n时长：30分钟' },
    { time: '12:30', title: '🍽️ 自助午餐', detail: '午餐交流时间\n嘉宾、家长、MAGIKID团队互动环节' },
    { time: '13:00', title: '🤖 展示项目', detail: '【展示项目】\n1. 机器手动作捕捉\n2. 世界冠军机器人\n3. 自动发牌机\n时长：30分钟' },
    { time: '13:30', title: '🎮 互动体验项目', detail: '【互动体验 - 3个项目轮流】\n1. 机器人拔河比赛\n2. 足球世界杯机器人守门员\n3. AI自主开发体验\n时长：30分钟' },
    { time: '14:00', title: '🏆 NASA分享', detail: 'NASA Space Apps Challenge 全球奖获奖者分享\n- TOP 80 教育模式\n- 全球赛经验分享\n时长：30分钟' },
    { time: '14:30', title: '🎁 抽奖 · 结束 & 客户沟通', detail: '【抽奖环节】\n【客户深度沟通 & 课程咨询】' }
  ],
  guests: [
    { name: 'Las Vegas 市长', title: '市政代表', email: '', bio: 'Las Vegas当地政府代表', type: 'vip' },
    { name: '两党议员', title: '政商名流代表', email: '', bio: '当地政界名流', type: 'vip' },
    { name: 'Matt', title: 'MAGIKID课程总监 / 主持人', email: '', bio: '华盛顿大学毕业，美国最早的STEM教育专业本科生，10年MAGIKID工作经验', type: 'speaker' },
    { name: 'Angell', title: 'MAGIKID创始人', email: '', bio: 'MAGIKID AI教育体系创始人，IOAI美国国家队培训负责人', type: 'speaker' },
    { name: 'Bruce', title: 'Las Vegas知名人士 / 主办方主理人', email: '', bio: '前美国商务部重要领导，引进WeChat进入美国，East-West School联合创始人', type: 'vip' },
    { name: 'Susan', title: 'East-West School 校长 / 主办方主理人', email: '', bio: '知名教育家、媒体主播，10年办学经验', type: 'vip' },
    { name: '斯坦福博士后', title: '演讲嘉宾', email: '', bio: '演讲主题：Can Life Engineering?', type: 'speaker' },
    { name: 'NASA获奖者', title: '分享嘉宾', email: '', bio: 'NASA Space Apps Challenge 全球奖获奖者', type: 'speaker' }
  ],
  projects: [
    { name: '🤖 机器手动作捕捉', type: 'demo', lead: '', duration: 30 },
    { name: '🏆 世界冠军机器人展示', type: 'demo', lead: '', duration: 30 },
    { name: '🎰 自动发牌机', type: 'demo', lead: '', duration: 30 },
    { name: '💪 机器人拔河比赛', type: 'interactive', lead: '', duration: 30 },
    { name: '⚽ 足球世界杯机器人守门员', type: 'competition', lead: '', duration: 30 },
    { name: '🧠 AI自主开发体验', type: 'ai', lead: '', duration: 30 }
  ],
  prizes: [
    { name: '🎖️ 投票最佳体验分享奖一等奖：免费夏令营一天 + MAGIKID T恤', type: 'competition', level: 'first', quantity: 1 },
    { name: '🎖️ 投票最佳体验分享奖二等奖：免费夏令营一天', type: 'competition', level: 'second', quantity: 2 },
    { name: '🎟️ 抽奖：免费体验课一次', type: 'raffle', level: 'participation', quantity: 20 },
    { name: '🎟️ 抽奖：免费夏令营一天', type: 'raffle', level: 'second', quantity: 5 },
    { name: '🎟️ 抽奖：免费生日派对一次', type: 'raffle', level: 'first', quantity: 3 },
    { name: '🎁 大奖：免费夏令营一周', type: 'raffle', level: 'grand', quantity: 1 }
  ],
  budget: [
    { category: 'travel', amount: 3000, note: '团队差旅费（机票、酒店）', spent: 0 },
    { category: 'food', amount: 2500, note: '自助午餐（50人）', spent: 0 },
    { category: 'printing', amount: 800, note: '海报、易拉宝、宣传册印刷', spent: 0 },
    { category: 'souvenirs', amount: 1000, note: 'MAGIKID T恤、纪念品、奖品', spent: 0 }
  ],
  promoProjects: ['robotics', 'ai-camp', 'vex-iq', 'nasa', 'stanford', 'vex-ai', 'ioai', 'private', 'birthday', 'adult', 'senior'],
  ageGroups: [],
  leads: [
    { name: 'Matt', role: '总负责人 / 主持人' },
    { name: 'TBD', role: 'Project 负责人 1' },
    { name: 'TBD', role: 'Project 负责人 2' },
    { name: 'TBD', role: 'Project 负责人 3' },
    { name: 'TBD', role: 'Project 负责人 4' }
  ],
  reception: [
    { name: 'TBD', role: '客户沟通接待 1' },
    { name: 'TBD', role: '客户沟通接待 2' }
  ],
  vips: [
    { name: '市长（Las Vegas市政代表）', handler: 'Bruce & Susan' },
    { name: '两党议员（政商名流）', handler: 'Bruce & Susan' }
  ],
  raffleHosts: [
    { name: 'Bruce', title: '主办方主理人' },
    { name: 'Susan', title: '主办方主理人' },
    { name: 'Angell', title: 'MAGIKID创始人' }
  ],
  goals: {
    camp: 30,
    vexElementary: '1个',
    vexMiddle: '1个',
    other: '收集潜在客户信息50+，社交媒体互动100+，当日课程报名20% OFF'
  }
}

export const MAGIKID_ACHIEVEMENTS = {
  vrc: {
    title: '🤖 VEX Robotics Championship',
    years: ['2022-2023: 54国3200+队', '2023-2024: 76国2400+队', '2024-2025: 持续参赛'],
    stats: [
      '小学组世界冠军 & 亚军',
      '初中组第3名',
      '32队晋级决赛',
      '8队世界Top 10 Robot Skills',
      '11个Judges Awards'
    ]
  },
  nasa: {
    title: '🚀 NASA Space Apps Challenge',
    years: ['2024-2025: 全球TOP 80', '2024: Deep Space全球提名', 'Solar Eye最佳人气奖'],
    stats: [
      '6队AI组晋级世界赛',
      'BEHAVIOR赛题Top 4 & Top 8',
      'Amaze Award得主',
      'TOP 80 Education Model Recognition'
    ]
  },
  ioai: {
    title: '🎓 IOAI (国际AI奥林匹克)',
    years: ['2024: 美国国家队培训', '2025: 持续突破'],
    stats: [
      'IOAI美国国家队培训基地',
      'Stanford Top 18',
      'Caltech创新奖',
      '多支队伍晋级IOAI世界赛'
    ]
  }
}
