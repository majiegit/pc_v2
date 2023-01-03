/**
 * 校验开始时间是否大于结束时间
 * @param begintime 开始时间
 * @param endtime 结束时间
 * @returns {boolean}  大于 true  反之 false
 */
export function beginGtEndTime(begintime, endtime) {
  if (begintime && endtime) {
    let beginDate = new Date(begintime);
    let endDate = new Date(endtime);
    if (beginDate.getTime() > endDate.getTime()) {
      return true
    }
  }
  return false
}

/**
 * 校验开始时间和结束时间是否为同一天
 * @param begintime 开始时间
 * @param endtime 结束时间
 * @returns {boolean}  是 true  反之 false
 */
export function beginEndSameDay(begintime, endtime) {
  if (begintime && endtime) {
    let beginDate = new Date(begintime);
    let endDate = new Date(endtime);
    if (beginDate.getDate() == endDate.getDate()) {
      return true
    }
  }
  return false
}
