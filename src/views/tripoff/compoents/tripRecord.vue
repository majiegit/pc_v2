<template>
  <div class="tripoff_top">
    <div v-if="tripList.length == 0">
      <a-empty description="暂无待销差数据"/>
    </div>
    <a-collapse v-model="activeKey" default-active-key="0" expand-icon-position="right" :ghost='false'>
        <a-collapse-panel  v-for="(item, index) in tripList" :key="index.toString()">
          <template #header>
            <div style="color: #2479ed">
              {{ item.applydate }} &nbsp; {{ item.leavetypename }}
            </div>
          </template>
          <div @click="toDetail(item)">
            <a-descriptions>
              <a-descriptions-item label="开始时间">
                {{ item.tripbegintime }}
              </a-descriptions-item>
              <a-descriptions-item label="结束时间">
                {{ item.tripendtime}}
              </a-descriptions-item>
             
              <a-descriptions-item label="出差时长">
                {{item.tripday + HrkqMinUnit[item.minunit] }}
              </a-descriptions-item>
              <a-descriptions-item label="出差说明">
                {{ item.remark }}
              </a-descriptions-item>
            </a-descriptions>
           </div>
        </a-collapse-panel>
      </a-collapse>
  </div>
</template>

<script>
import storage from 'store'
  import {queryTripIsRevoked} from '@/api/tripoff'
  import {StartEndDayType, HrkqMinUnit} from '@/utils/ConstantUtils'

  export default {
    data() {
      return {
        StartEndDayType,
        HrkqMinUnit,
        activeNames: [],
        tripList: [],
        activeKey: [],
        userInfoPkPsndoc: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
      }
    },
    mounted() {
    },
    created() {
      this.queryTripIsRevoked()
    },
    watch: {
      
    },
    methods: {
      //查询待销差出差记录
       
      queryTripIsRevoked() {
        let params = {
          pk_psndoc: this.userInfoPkPsndoc
        }
        queryTripIsRevoked(params).then(res => {
          this.tripList = res.data
          if(this.tripList && this.tripList.length>0){
          this.tripList.forEach((item,index) =>{
            this.activeKey.push(index)
          })
         }
        })
      },
      // 将数据传给父组件
       
      toDetail(item) {
        this.$emit('getDetail', item)
      }
    }
  }
</script>

<style lang='less'>

</style>
