/**
 * 我的模块 Mock 接口
 */

import type {
  AttendanceDayRecord,
  CommunityInfo,
  ProfileInfo,
} from '@/types/profile'
import dayjs from 'dayjs'
import {
  defineUniAppMock,
  errorResponse,
  randomDelay,
  successResponse,
} from './shared/utils'

const profileDatabase = {
  profile: {
    userId: 'STAFF_001',
    userName: '王小明',
    storeId: 'STORE_001',
    storeName: '阳光物业服务中心',
    avatar: 'https://picsum.photos/seed/profile-avatar/240/240',
    currentCommunityId: 'COMM_001',
    currentCommunityName: '阳光花园',
    version: 'V1.6',
  } as ProfileInfo,
  communities: [
    { communityId: 'COMM_001', name: '阳光花园', address: '福田区幸福路 88 号' },
    { communityId: 'COMM_002', name: '海棠湾小区', address: '南山区海棠街 66 号' },
    { communityId: 'COMM_003', name: '青云里', address: '龙岗区青云大道 18 号' },
    { communityId: 'COMM_004', name: '锦绣雅苑', address: '宝安区锦绣路 108 号' },
    { communityId: 'COMM_005', name: '和谐家园', address: '龙华区和平路 38 号' },
  ] as CommunityInfo[],
}

function createAttendanceRecords(month: string): AttendanceDayRecord[] {
  const start = dayjs(`${month}-01`)
  const days = start.daysInMonth()
  const records: AttendanceDayRecord[] = []

  for (let day = 1; day <= days; day++) {
    const date = start.date(day)
    const week = date.day()
    if (week === 0 || week === 6)
      continue

    const workStart = date.hour(8).minute(57 + (day % 3)).second(0).valueOf()
    const workEnd = date.hour(18).minute(2 + (day % 4)).second(0).valueOf()

    records.push({
      taskDay: day,
      attendanceClassesTaskDetails: [
        {
          specCd: '1001',
          checkTime: workStart,
          state: '1200',
          stateName: '正常',
        },
        {
          specCd: '2002',
          checkTime: workEnd,
          state: '1200',
          stateName: '正常',
        },
      ],
    })
  }

  return records
}

export default defineUniAppMock([
  {
    url: '/app/profile.getUserProfile',
    method: ['GET', 'POST'],
    body: async () => {
      await randomDelay(120, 300)
      return successResponse(profileDatabase.profile, '查询成功')
    },
  },
  {
    url: '/app/profile.listCommunities',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(180, 360)
      const params = { ...query, ...body }
      const keyword = String(params.keyword || '').trim()
      const list = keyword
        ? profileDatabase.communities.filter(item => item.name.includes(keyword))
        : profileDatabase.communities
      return successResponse(list, '查询成功')
    },
  },
  {
    url: '/app/profile.changeCommunity',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(120, 280)
      const communityId = String(body?.communityId || '')
      const target = profileDatabase.communities.find(item => item.communityId === communityId)
      if (!target) {
        return errorResponse('目标小区不存在')
      }
      profileDatabase.profile.currentCommunityId = target.communityId
      profileDatabase.profile.currentCommunityName = target.name
      return successResponse({ success: true }, '切换成功')
    },
  },
  {
    url: '/app/profile.changePassword',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(180, 320)
      if (!body?.oldPwd || !body?.newPwd) {
        return errorResponse('参数不完整')
      }
      return successResponse({ success: true }, '修改成功')
    },
  },
  {
    url: '/app/profile.listAttendanceRecords',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(180, 360)
      const params = { ...query, ...body }
      const month = String(params.month || dayjs().format('YYYY-MM'))
      return successResponse(createAttendanceRecords(month), '查询成功')
    },
  },
])
