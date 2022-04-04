import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'http://localhost:9090/user/list',
    method: 'post',
    data
  })
}
