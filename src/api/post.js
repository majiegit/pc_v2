import request from '@/utils/request'
import {System_Path} from '@/utils/modulePath'

/**
 * 查询岗位字段
 */
export function queryPostFieldList(params) {
  return request({
    url: System_Path + "/post/getPostFieldList",
    method: 'post',
    params: params
  })
}


/**
 * 查询岗位列表 - 分页
 */
export function queryPostPage(params) {
  return request({
    url: System_Path + "/post/page",
    method: 'post',
    params: params
  })
}


/**
 * 查询岗位列表
 */
export function queryPostList() {
  return request({
    url: System_Path + "/post/list",
    method: 'post'
  })
}

/**
 * 保存岗位
 */
export function savePost(data) {
  return request({
    url: System_Path + "/post/save",
    data: data,
    method: 'post'
  })
}

/**
 * 删除岗位
 */
export function deletePost(id) {
  return request({
    url: System_Path + "/post/deleteById",
    params: { postId: id },
    method: 'post'
  })
}

/**
 * 批量删除岗位
 */
export function deletePostBatch(ids) {
  return request({
    url: System_Path + "/post/deleteByIds",
    data: ids,
    method: 'post'
  })
}