/**
 * 业主管理 Mock 接口
 */

import type { OwnerMember } from '@/types/property-management'
import { COMMUNITY_OPTIONS } from '../../constants/common'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  generateAddress,
  generateChineseName,
  generatePhoneNumber,
  mockLog,
  randomDelay,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

const OWNER_TYPE_NAME_MAP: Record<string, string> = {
  1001: '业主',
  1002: '家庭成员',
  1003: '租客',
}

const ownerDatabase = {
  owners: [] as OwnerMember[],

  init() {
    if (this.owners.length > 0)
      return

    for (let i = 1; i <= 60; i++) {
      const community = COMMUNITY_OPTIONS[i % COMMUNITY_OPTIONS.length]
      const floorNum = Math.floor(Math.random() * 20) + 1
      const unitNum = Math.floor(Math.random() * 6) + 1
      const roomNum = Math.floor(Math.random() * 20) + 1
      const ownerTypeCd = i % 4 === 0 ? '1003' : (i % 3 === 0 ? '1002' : '1001')

      this.owners.push({
        memberId: `MEM_${i.toString().padStart(4, '0')}`,
        ownerId: `OWN_${Math.ceil(i / 2).toString().padStart(4, '0')}`,
        communityId: String(community.value),
        name: generateChineseName(),
        ownerTypeCd,
        ownerTypeName: OWNER_TYPE_NAME_MAP[ownerTypeCd],
        personRole: i % 4 === 0 ? '2' : '3',
        personType: i % 5 === 0 ? 'C' : 'P',
        roomName: `${floorNum}栋${unitNum}${roomNum.toString().padStart(2, '0')}室`,
        roomId: `ROOM_${i.toString().padStart(4, '0')}`,
        link: generatePhoneNumber(),
        idCard: `44010${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
        address: generateAddress(),
        remark: 'mock 业主数据',
        sex: String(i % 2),
        faceUrl: `https://picsum.photos/seed/owner-${i}/200/200`,
      })
    }
  },

  query(params: {
    page: number
    row: number
    communityId?: string
    name?: string
    link?: string
    roomName?: string
    memberId?: string
  }) {
    let list = [...this.owners]

    if (params.communityId) {
      list = list.filter(item => item.communityId === params.communityId)
    }

    if (params.memberId) {
      list = list.filter(item => item.memberId === params.memberId)
    }

    if (params.name) {
      list = list.filter(item => item.name.includes(params.name as string))
    }

    if (params.link) {
      list = list.filter(item => item.link.includes(params.link as string))
    }

    if (params.roomName) {
      list = list.filter(item => item.roomName.includes(params.roomName as string))
    }

    return createPaginationResponse(list, params.page, params.row)
  },

  save(data: any) {
    const id = `MEM_${(this.owners.length + 1).toString().padStart(4, '0')}`
    const ownerId = `OWN_${(this.owners.length + 1).toString().padStart(4, '0')}`

    const item: OwnerMember = {
      memberId: id,
      ownerId,
      communityId: data.communityId,
      name: data.name,
      ownerTypeCd: data.ownerTypeCd || '1002',
      ownerTypeName: OWNER_TYPE_NAME_MAP[data.ownerTypeCd] || '家庭成员',
      personRole: data.personRole,
      personType: data.personType,
      roomName: data.roomName,
      roomId: data.roomId || id.replace('MEM', 'ROOM'),
      link: data.link,
      idCard: data.idCard,
      address: data.address,
      remark: data.remark,
      sex: data.sex || '0',
      faceUrl: data.ownerPhotoUrl || '',
    }

    this.owners.unshift(item)
    return item
  },

  update(data: any) {
    const index = this.owners.findIndex(item => item.memberId === data.memberId)
    if (index < 0)
      return null

    this.owners[index] = {
      ...this.owners[index],
      ...data,
      ownerTypeName: OWNER_TYPE_NAME_MAP[data.ownerTypeCd] || this.owners[index].ownerTypeName,
      faceUrl: data.ownerPhotoUrl || this.owners[index].faceUrl,
    }
    return this.owners[index]
  },

  remove(memberId: string) {
    const index = this.owners.findIndex(item => item.memberId === memberId)
    if (index < 0)
      return false

    this.owners.splice(index, 1)
    return true
  },
}

ownerDatabase.init()

export default defineUniAppMock([
  {
    url: '/app/owner.queryOwnerAndMembers',
    method: ['GET', 'POST'],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)
      const params = { ...query, ...body }
      mockLog('queryOwnerAndMembers', params)

      const result = ownerDatabase.query({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: params.communityId || 'COMM_001',
        name: params.name,
        link: params.link,
        roomName: params.roomName,
        memberId: params.memberId,
      })

      return successResponse(result, '查询成功')
    },
  },
  {
    url: '/app/owner.saveRoomOwner',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(300, 600)
      const data = body || {}
      mockLog('saveRoomOwner', data)

      if (!data.name || !data.link || !data.communityId) {
        return errorResponse('参数不完整', ResultEnumMap.Error)
      }

      const item = ownerDatabase.save(data)
      return successResponse({ memberId: item.memberId }, '保存成功')
    },
  },
  {
    url: '/app/owner.editOwner',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(300, 600)
      const data = body || {}
      mockLog('editOwner', data)

      if (!data.memberId) {
        return errorResponse('memberId 不能为空', ResultEnumMap.Error)
      }

      const item = ownerDatabase.update(data)
      if (!item) {
        return errorResponse('业主不存在', ResultEnumMap.NotFound)
      }

      return successResponse({ memberId: item.memberId }, '修改成功')
    },
  },
  {
    url: '/app/owner.deleteOwner',
    method: ['POST'],
    body: async ({ body }) => {
      await randomDelay(300, 600)
      const data = body || {}
      mockLog('deleteOwner', data)

      if (!data.memberId) {
        return errorResponse('memberId 不能为空', ResultEnumMap.Error)
      }

      const success = ownerDatabase.remove(data.memberId)
      if (!success) {
        return errorResponse('业主不存在', ResultEnumMap.NotFound)
      }

      return successResponse({ success: true }, '删除成功')
    },
  },
])
