import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'http://localhost:9090/log/list',
    method: 'post',
    data
  })
}

export function sendFl(data) {
  return request({
    url: 'http://localhost:9090/log/addOrder',
    method: 'post',
    data
  })
}
