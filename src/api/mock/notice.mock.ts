/**
 * 公告模块 Mock 接口
 */

import type { NoticeItem } from '@/types/notice'
import dayjs from 'dayjs'
import {
  defineUniAppMock,
  formatDateTime,
  randomDelay,
  successResponse,
} from './shared/utils'

const noticeDatabase = {
  notices: [] as NoticeItem[],

  init() {
    if (this.notices.length > 0)
      return

    const titles = [
      '关于电梯维护检修的通知',
      '春节期间物业服务安排公告',
      '消防安全巡检工作提醒',
      '地下车库照明升级施工通知',
      '垃圾分类专项整治行动公告',
      '社区便民服务日活动预告',
      '关于供水设施保养的通知',
      '公共区域绿化修剪安排公告',
      '雨季防汛安全提示',
      '社区文明养犬倡议书',
      '物业费缴费提醒公告',
      '夜间噪音治理专项通知',
      '门禁系统升级维护公告',
      '快递驿站服务时间调整通知',
      '小区健身器材检修公告',
    ]

    this.notices = Array.from({ length: 36 }).map((_, index) => {
      const title = titles[index % titles.length]
      const startTime = dayjs().subtract(index, 'day').hour(9).minute(30).second(0)
      return {
        noticeId: `NOTICE_${(index + 1).toString().padStart(4, '0')}`,
        title: `${title}${index < 8 ? '（重要）' : ''}`,
        context: `
          <p>尊敬的业主您好：</p>
          <p>现发布 <strong>${title}</strong>，请各位业主知悉并配合相关工作安排。</p>
          <p>如有疑问，请联系物业服务中心：0755-12345678。</p>
          <p>感谢您的理解与支持。</p>
        `,
        startTime: formatDateTime(startTime),
        timeStr: startTime.format('YYYY-MM-DD HH:mm'),
        noticeTypeCd: '1001',
        communityId: 'COMM_001',
      }
    })
  },
}

noticeDatabase.init()

export default defineUniAppMock([
  {
    url: '/app/notice.listNotices',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      const params = { ...query, ...body }
      const page = Number(params.page) || 1
      const row = Number(params.row) || 10

      let filtered = [...noticeDatabase.notices]

      if (params.communityId) {
        filtered = filtered.filter(item => item.communityId === String(params.communityId))
      }
      if (params.noticeTypeCd) {
        filtered = filtered.filter(item => item.noticeTypeCd === String(params.noticeTypeCd))
      }
      if (params.noticeId) {
        filtered = filtered.filter(item => item.noticeId === String(params.noticeId))
      }
      if (params.titleLike) {
        const keyword = String(params.titleLike).trim()
        filtered = filtered.filter(item => item.title.includes(keyword))
      }

      const start = (page - 1) * row
      const notices = filtered.slice(start, start + row)

      return successResponse({
        notices,
        total: filtered.length,
        page,
        row,
      }, '查询成功')
    },
  },
])
