import request from '@/utils/request'

/**
 * 查询附件列表
 * @param parameter
 */
export function getFileList(params) {
  return request({
    url: "/hrsh/filemanager/getFileList",
    method: 'post',
    params: params
  })
}

/**
 * 删除附件
 * @param parameter
 */
export function deleteFile(data) {
  return request({
    url: "/hrsh/filemanager/delete",
    method: 'post',
    data: data
  })
}

/**
 * 上传附件
 * @param parameter
 */
export function uploadFile(data) {
  return request({
    url: "/hrsh/filemanager/upload",
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
