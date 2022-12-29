export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

export const informationIconList = {
  bd_psndoc:'contacts',//人员基本信息
  bd_psndocbg:'#2475F1',
  hi_psnjob:'file-text',//工作记录
  hi_psnjobbg:'#FACB02',
  hi_psndoc_parttime:'file-text',//兼职记录
  hi_psndoc_parttimebg:'#FF8735',
  hi_psndoc_trial:'project',//试用情况
  hi_psndoc_trialbg:'#2475F1',
  hi_psndoc_psnchg:'profile',//"流动情况"
  hi_psndoc_psnchgbg:'#FACB02',
  hi_psndoc_work:'snippets',//"履历记录"
  hi_psndoc_workbg:'#FF8735',
  hi_psndoc_edu:'read',//"学历信息"
  hi_psndoc_edubg:'#2475F1',
  hi_psndoc_family:'solution',//"家庭信息"
  hi_psndoc_familybg:'#FACB02',
  hi_psndoc_ctrt:'audit',// "合同信息"
  hi_psndoc_ctrtbg:'#FF8735',
  hi_psndoc_ass:'file-protect',// "员工考核信息"
  hi_psndoc_assbg:'#2475F1',
  hi_psndoc_train:'wallet',//"人员教育培训"
  hi_psndoc_trainbg:'#FACB02',
  hi_psndoc_cert:'idcard',//"身份证件"
  hi_psndoc_certbg:'#FF8735',//"身份证件"
  hi_psndoc_linkman:'user-add',//"紧急联系人"
  hi_psndoc_linkmanbg:'#2475F1',
  hi_psndoc_title:'funnel-plot' ,//"职称信息"
  hi_psndoc_titlebg:'#FACB02',
  hi_psndoc_nationduty:'diff',//"职业资格"
  hi_psndoc_nationdutybg:'#FF8735',
  hi_psndoc_langability:'radar-chart',// "语言能力"
  hi_psndoc_langabilitybg:'#2475F1',
  hi_psndoc_enc:'snippets',//"奖励情况"
  hi_psndoc_encbg:'#FACB02',
  hi_psndoc_pun:'form',//"惩罚信息"
  hi_psndoc_punbg:'#FF8735',
  hi_psndoc_partylog:'edit',//"参加党派记录"
  hi_psndoc_partylogbg:'#2475F1',
  hi_psndoc_abroad:'rocket' ,//"出国境情况"
  hi_psndoc_abroadbg:'#FACB02',
  hi_psndoc_retire:'user-delete',//"离退待遇"
  hi_psndoc_retirebg:'#FF8735',
  hi_psndoc_speitem:'codepen-circle',//"专业技术(项目)工作"
  hi_psndoc_speitembg:'#2475F1' ,
  hi_psndoc_wainfo:'strikethrough',//"薪资信息"
  hi_psndoc_wainfobg:'#FACB02',
  hi_psndoc_qulify:'save',//"企业内部任职资格"
  hi_psndoc_qulifybg:'#FF8735',
  
}
// 我的申请 审批中心使用
export const BillTypeList = [
  {
    billtypename: '全部',
    billtype: '',
  },
  {
    billtypename: '请假单',
    billtype: '6QQJ'
  },
  {
    billtypename: '销假单',
    billtype: '6QXJ',
  },
  {
    billtypename: '加班单',
    billtype: '6QJB',
  },
  {
    billtypename: '出差单',
    billtype: '6QCC',
  },
  {
    billtypename: '销差单',
    billtype: '6QXC',
  },

]
//我的申请，表格的头部
export const myapplycolumns =[
  {
    title: '单据编号',
    dataIndex: 'pk_h',
    scopedSlots: { customRender: 'pk_h' },
  },
  {
    title: '单据类别',
    dataIndex: 'billtypename',
    
  },
  {
    title: '流程类型',
    dataIndex: 'typename',
    
  },
  {
    title: '提交日期',
    dataIndex: 'applydate',
    
  },
  // {
  //   title: '类型',
  //   dataIndex: 'name',
    
  // },
  {
    title: '单据状态',
    dataIndex: 'approveStateName',
    
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
]
export const approveStateName = {
  '0': '审批未通过',
  '1': '审批通过',
  '2': '审批进行中',
  '3': '提交',
  '-1': '自由'
}
/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}
export function scorePassword (pass) {
  let score = 0
  if (!pass) {
    return score
  }
  // award every unique letter until 5 repetitions
  const letters = {}
  for (let i = 0; i < pass.length; i++) {
      letters[pass[i]] = (letters[pass[i]] || 0) + 1
      score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (var check in variations) {
      variationCount += (variations[check] === true) ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return parseInt(score)
}
