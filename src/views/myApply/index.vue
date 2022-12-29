<template>
  <div class="myapply">
    <div class="myapply-body">
      <a-select  @change="selectData" v-model="billtype" class="select">
        <a-select-option   v-for="(billtype,index) in billTypeList"  :value="billtype.billtype" :key="index">{{billtype.billtypename}}</a-select-option>
      </a-select>
      <a-table  :pagination = "false"  bordered :data-source="ApplyList" :columns="columns">
        <template slot="operation" slot-scope="text, record">
          <a href="javascript:;" @click="examine(record)">查看</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import storage from 'store'
import { getMyApplication } from '@/api/my-apply'
import {BillTypeList,myapplycolumns,approveStateName} from '@/utils/util'
import {BillTypeMap} from '@/utils/ConstantUtils'
export default {
  name: 'myapply',
  components: {},
  data() {
    return {
      loading: true,
      userInfoPkPsndoc : (storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : ''),
      ApplyList:[],
      ApplyListAll:[],
      billTypeList: BillTypeList,
      billTypeModel: '',
      columns:myapplycolumns,
      approveStateName:approveStateName,
      billtype:'',
    }
  },
  computed: {},
  watch: {
      billtype(val) {
        console.log(val)
        if (this.billtype == '') {
          this.ApplyList = this.ApplyListAll
        } else {
          this.ApplyList = this.ApplyListAll.filter(apply => this.billtype === apply.billtype)
        }
      }
    },
  created() {
    this.queryMyApplication();
  },
  mounted() {},
  methods: {
      // 查询我的申请
      queryMyApplication() {
        let params = {
          pk_psndoc: this.userInfoPkPsndoc
        }
        getMyApplication(params).then(res => {
          if(res && res.data.length > 0){
            res.data.forEach(item => {
              item.approveStateName = this.approveStateName[item.approvestatus]
            });
          }
          
          this.ApplyList = res.data
          this.ApplyListAll = res.data
          
        })
      },
      //筛选
      selectData(type){
        this.billtype = type
      },
      // 查看详情
      examine(item){
         console.log(item)
         this.$router.push({
          name: BillTypeMap[item.billtype].routerDetailPath,
          query: {
            pk_h: item.pk_h,
            billtype: item.billtype
          }
        })
      },
  },
}
</script>

<style lang="less" scoped>
.myapply {
  padding:  20px;
  height: 100%;
  background: #fff;
  .myapply-body {
    height: 100%;
    padding: 10px 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(167, 167, 167, 0.4);
    overflow-y: scroll;
    .select{
      width: 200px;
      margin: 20px  0;
    }
  }
}
</style>
<style lang="less" >
.myapply{
  .myapply-body{
   
  }
}
</style>