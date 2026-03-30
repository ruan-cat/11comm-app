import type { Staff, StaffListResponse, StaffQueryParams } from '../../../src/types/staff.ts'
import { STAFF_ORGANIZATION_OPTIONS, STAFF_POSITION_OPTIONS } from '../../../src/constants/staff.ts'
import { generateChineseName, generatePhoneNumber } from '../../shared/runtime/common-utils.ts'

export interface StaffModuleRepository {
  addStaff: (staff: Omit<Staff, 'id'>) => Staff
  getAllOrganizations: () => string[]
  getOnlineStaffs: () => Staff[]
  getStaffById: (staffId: string) => Staff | undefined
  getStaffsByDepartment: (orgName: string) => Staff[]
  queryStaffInfos: (params: StaffQueryParams) => StaffListResponse
  searchStaffs: (keyword: string) => Staff[]
  updateStaffOnlineStatus: (staffId: string, isOnline: boolean) => Staff | null
}

/** 创建 `staff` 模块的 mock 内存仓库。 */
export function createStaffMockRepository(): StaffModuleRepository {
  const staffs = Array.from({ length: 50 }, (_, index) => createMockStaff((index + 1).toString().padStart(3, '0')))

  return {
    addStaff(staff) {
      const newStaff: Staff = {
        ...staff,
        id: `STAFF_${Date.now()}`,
      }

      staffs.unshift(newStaff)
      return newStaff
    },
    getAllOrganizations() {
      return Array.from(new Set(staffs.map(staff => staff.orgName))).sort()
    },
    getOnlineStaffs() {
      return staffs.filter(staff => staff.isOnline)
    },
    getStaffById(staffId) {
      return staffs.find(staff => staff.id === staffId)
    },
    getStaffsByDepartment(orgName) {
      return staffs.filter(staff => staff.orgName === orgName)
    },
    queryStaffInfos(params) {
      let filteredStaffs = [...staffs]

      if (params.name?.trim()) {
        const keyword = params.name.toLowerCase()
        filteredStaffs = filteredStaffs.filter(staff =>
          staff.name.toLowerCase().includes(keyword)
          || staff.position?.toLowerCase().includes(keyword)
          || staff.orgName.toLowerCase().includes(keyword))
      }

      if (params.orgName?.trim()) {
        filteredStaffs = filteredStaffs.filter(staff => staff.orgName === params.orgName)
      }

      if (params.initials?.trim()) {
        filteredStaffs = filteredStaffs.filter(staff => staff.initials === params.initials)
      }

      filteredStaffs.sort((left, right) => `${left.initials}`.localeCompare(`${right.initials}`))

      const page = params.page || 1
      const row = params.row || 1000
      const startIndex = (page - 1) * row
      const endIndex = startIndex + row

      return {
        staffs: filteredStaffs.slice(startIndex, endIndex),
        total: filteredStaffs.length,
        page,
        row,
      }
    },
    searchStaffs(keyword) {
      if (!keyword?.trim()) {
        return []
      }

      const lowerKeyword = keyword.toLowerCase()
      return staffs.filter(staff =>
        staff.name.toLowerCase().includes(lowerKeyword)
        || staff.tel.includes(keyword)
        || staff.position?.toLowerCase().includes(lowerKeyword)
        || staff.orgName.toLowerCase().includes(lowerKeyword)
        || staff.email?.toLowerCase().includes(lowerKeyword))
    },
    updateStaffOnlineStatus(staffId, isOnline) {
      const staff = this.getStaffById(staffId)
      if (!staff) {
        return null
      }

      staff.isOnline = isOnline
      return staff
    },
  }
}

/** 导出默认 staff mock 仓库实例。 */
export const staffMockRepository = createStaffMockRepository()

function createMockStaff(id: string): Staff {
  const name = generateChineseName()
  const positionItem = STAFF_POSITION_OPTIONS[Math.floor(Math.random() * STAFF_POSITION_OPTIONS.length)]
  const organizationItem = STAFF_ORGANIZATION_OPTIONS[Math.floor(Math.random() * STAFF_ORGANIZATION_OPTIONS.length)]

  return {
    id: `STAFF_${id}`,
    name,
    tel: generatePhoneNumber(),
    orgName: String(organizationItem.value),
    initials: getInitials(name),
    position: String(positionItem.value),
    email: `staff${id}@property.com`,
    avatar: `https://picsum.photos/100/100?random=${id}`,
    isOnline: Math.random() > 0.3,
  }
}

function getInitials(name: string): string {
  const firstChar = name.charAt(0)
  const initialMap: Record<string, string> = {
    张: 'Z',
    王: 'W',
    李: 'L',
    赵: 'Z',
    刘: 'L',
    陈: 'C',
    杨: 'Y',
    黄: 'H',
    周: 'Z',
    吴: 'W',
    徐: 'X',
    孙: 'S',
    胡: 'H',
    朱: 'Z',
    高: 'G',
    林: 'L',
    何: 'H',
    郭: 'G',
    马: 'M',
    罗: 'L',
  }

  return initialMap[firstChar] || firstChar.toUpperCase()
}
