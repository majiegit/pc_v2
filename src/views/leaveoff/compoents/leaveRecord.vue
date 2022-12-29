<template>
  <div class="leaveoff_top">
    <div v-if="leaveList.length == 0">
      <a-empty description="暂无待销假数据" />
    </div>
    <div>
      <a-collapse v-model="activeKey" default-active-key="0" expand-icon-position="right" :ghost='false'>
        <a-collapse-panel  v-for="(item, index) in leaveList" :key="index.toString()">
          <template #header>
            <div style="color: #2479ed">
              {{ item.applydate }} &nbsp; {{ item.leavetypename }}
            </div>
          </template>
          <div @click="toDetail(item)">
            <a-descriptions>
              <a-descriptions-item :label="'开始' + (item.minunit == '2' ? '日期' : '时间')">
                {{ item.minunit == '2' ? item.begintime.substring(0, 10) : item.begintime }}
              </a-descriptions-item>
              <a-descriptions-item :label="'结束' + (item.minunit == '2' ? '日期' : '时间')">
                {{ item.minunit == '2' ? item.endtime.substring(0, 10) : item.endtime }}
              </a-descriptions-item>
              <a-descriptions-item v-if="item.start_day_type" label="开始时间">
                {{ StartEndDayType[item.start_day_type] }}
              </a-descriptions-item>
              <a-descriptions-item v-if="item.end_day_type" label="结束时间">
                {{ StartEndDayType[item.end_day_type] }}
              </a-descriptions-item>
              <a-descriptions-item label="请假时长">
                {{ item.leaveday + HrkqMinUnit[item.minunit] }}
              </a-descriptions-item>
              <a-descriptions-item label="休假说明">
                {{ item.leaveremark }}
              </a-descriptions-item>
            </a-descriptions>
           </div>
        </a-collapse-panel>
      </a-collapse>
      
     
    </div>
  </div>
</template>

<script>
import storage from 'store'
import { queryLeaveIsRevoked } from '@/api/leaveoff'
import { StartEndDayType, HrkqMinUnit } from '@/utils/ConstantUtils'
export default {
  data() {
    return {
      StartEndDayType,
      HrkqMinUnit,
       leaveList: [],
      activeKey: [],
      userInfoPkPsndoc: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
    }
  },
  mounted() {},
  created() {
    this.queryLeaveIsRevoked()
  },
  watch: {
    
  },
  methods: {
    // 查询待销假请假记录
    queryLeaveIsRevoked() {
      let params = {
        pk_psndoc: this.userInfoPkPsndoc,
      }
      queryLeaveIsRevoked(params).then((res) => {
        this.leaveList = res.data
        if(this.leaveList && this.leaveList.length>0){
          this.leaveList.forEach((item,index) =>{
            this.activeKey.push(index)
          })
          
        }
        
      })
    },
    // @param detail
    toDetail(item) {
      this.$emit('getDetail', item)
    },
  },
}
</script>

<style lang='less'>

</style>
