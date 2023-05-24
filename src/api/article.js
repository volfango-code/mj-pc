import request from '@/utils/request'

// 获取面经列表
export const getArticles = (params) => {
  return request({
    url: '/h5/interview/query',
    params
  })
}

// 添加面经
export const createArticle = (data) => {
  return request({
    url: '/admin/interview/create',
    method: 'POST',
    data
  })
}

// 删除面经
export const deleteArticle = id => {
  return request({
    url: '/admin/interview/remove',
    method: 'DELETE',
    data: {
      id
    }
  })
}

// 获取面经详情
export const articleDetail = id => {
  return request({
    url: '/admin/interview/show',
    params: {
      id
    }
  })
}

// 修改面经
export const updateArticle = data => {
  return request({
    url: '/admin/interview/update',
    method: 'PUT',
    data
  })
}
