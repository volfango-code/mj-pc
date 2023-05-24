import request from '@/utils/request'

// 登录
export const loginAPI = data => {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

// 获取管理员信息
export const userInfo = () => {
  return request({
    url: '/auth/currentUser'
  })
}

// 获取折线图数据
export const getLineData = () => {
  return request({
    url: '/analysis/DailyVisitTrend'
  })
}
