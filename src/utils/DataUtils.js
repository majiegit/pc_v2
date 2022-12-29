/**
 * 获取数组 对象中符合某个字段值等于预置值
 * @param list   数组
 * @param filed  字段
 * @param value  预置值
 * @returns {*} 对应的 Obejct
 */
export function getItem(list, filed, value) {
  let item = null
  for (let i = 0; i < list.length; i++) {
   if(list[i][filed] === value){
     item = list[i]
   }
  }
  return item
}
