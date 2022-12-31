<template>
  <div>
  <Header ></Header>
  <div class="myapply" :style="{'height': currentHeight}">
    <div class="myapply-body">
      <div class="checkStatus">
      <a-tabs :activeKey="approveStatus" @change="handleTabClick" color="#2479ED" title-active-color="#2479ED" title-inactive-color="#000" line-width="100px">
        <a-tab-pane key="N" tab="待办"  :title-style="{'font-size': '16px','font-weight': 'bolder'}" style="background: #fff;">
        </a-tab-pane>
        <a-tab-pane key="Y" tab="已办"  :title-style="{'font-size': '16px','font-weight': 'bolder'}">
        </a-tab-pane>
      </a-tabs>
    </div>
      <a-select  @change="selectData" v-model="billtype" class="select">
        <a-select-option   v-for="(billtype,index) in billTypeList"  :value="billtype.billtype" :key="index">{{billtype.billtypename}}</a-select-option>
      </a-select>
    <!-- <a-table  :pagination = "false"  bordered :data-source="ApplyList" :columns="columns">
      <template slot="operation" slot-scope="text, record">
        <a href="javascript:;" @click="examine()">查看</a>
      </template>
    </a-table> -->
    <div class="item" v-for="(item, index) in ApplyList" :key="index"
           :style="index == 0 ? 'margin-top: 0px' : 'margin-top: 20px'">
        <div class="item_left" :style="{background: approveStatus == 'N' ?  '#2479ED': '#3FC691'}"></div>
        <div class="item_right" @click="toApply(item)">
          <a-row type="flex" style="height: 30px; padding-top: 10px;" justify="center">
            <a-col :span="14">
                  <span>{{item.billtypename}}
                  <span v-if="item.tbmtype_name">-</span>
                    {{item.tbmtype_name}}
                  </span>
            </a-col>
            <a-col :span="9">
              <span style="float: right;">{{item.sendtime}}</span>
            </a-col>
          </a-row>
          <a-row type="flex" style="height: 30px; " justify="center">
            <a-col :span="23">
              <span>{{item.subject}}</span>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import storage from 'store'
import Header from '@/components/Header/Index'
import {getMyApprove} from '@/api/approveCenter'
import {BillTypeList} from '@/utils/util'
import {approveStateName, approveStateColorList,BillTypeMap} from '@/utils/ConstantUtils'

export default {
  name: 'approveCenter',
  components: {Header},
  data() {
    return {
      approveStatus: 'N',
      loading: true,
      userInfoPkPsndoc : (storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : ''),
      userInfoUserId :storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').user_id : '',
      ApplyList:[],
      ApplyListAll:[],
      billTypeList: BillTypeList,
      billtype:'',
      approveStateName: approveStateName,
      approveStateColorList: approveStateColorList,
      currentHeight:'',
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
    this.currentHeight = (document.documentElement.clientHeight -74) + 'px'
    this.queryMyApprove();
  },
  mounted() {},
  methods: {
      // 查询审批中心
      queryMyApprove() {
        let params = {
          userId: this.userInfoUserId,
          isread: this.approveStatus
        }
        getMyApprove(params).then(res => {
          this.ApplyListAll = res.data
          this.ApplyList = res.data
         })
      },
      //筛选
      selectData(type){
        this.billtype = type
      },
      // 查看详情
      examine(){

      },
      // 跳转单据
      toApply(item) {
        this.$router.push({
          name: BillTypeMap[item.billtype].routerApprovePath,
          query: {
            pk_h: item.billid,
            billtype: item.billtype
          }
        })
      },
      handleTabClick(key){
        this.approveStatus = key;
         this.billtype='',
        this.queryMyApprove()
      }
   
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
    .item {
    margin-top: 20px;
    width: 100%;
    height: 80px;
    background: #FFFFFF;
    box-shadow: 7px 5px 15px 0px rgba(36, 121, 237, 0.2);
    border-radius: 8px;
    &_left {
      width: 1%;
      height: 100%;
      float: left;
      background: #2479ED;
      border-bottom-left-radius: 8px;
      border-top-left-radius: 8px;
    }
    &_right {
      width: 99%;
      height: 100%;
      float: left;
      background: #fff;
      border-bottom-right-radius: 8px;
      border-top-right-radius: 8px;
      span {
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
      }
    }
  }
    // .item{
    //   border: 1px solid #ccc;
    //   box-shadow: 7px 5px 15px 0px rgb(36 121 237 / 20%);
    //   border-radius: 8px;
    // }
    // .item_left{
    //   width: 10px;
    //   height: 100%;
    //   float: left;
    //   background: #2479ED;
    //   border-bottom-left-radius: 8px;
    //   border-top-left-radius: 8px;
    // }
  }
}
</style>
<style lang="less" >
.myapply{
  .myapply-body{
   
  }
}
</style>