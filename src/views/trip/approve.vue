<template>
  <div>
    <Header ></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo.pk_psndoc">
         <a-descriptions>
          <a-descriptions-item  label="出差类型：">
          {{billInfo.triptypename}}
          </a-descriptions-item>
          <a-descriptions-item  label="申请人：">
            {{billInfo.psndocname}}
          </a-descriptions-item>
          <a-descriptions-item  label="申请时间：">
           {{billInfo.applydate}}
          </a-descriptions-item>
          <a-descriptions-item  label="出差开始时间：" >
          {{billInfo.tripbegintime}}
          </a-descriptions-item>
          <a-descriptions-item  label="出差结束时间：" >
          {{billInfo.tripendtime}}
          </a-descriptions-item>
          <a-descriptions-item  label="出差时长：" >
          {{billInfo.tripday	+ HrkqMinUnit[billInfo.minunit]}}
          </a-descriptions-item>
          <a-descriptions-item  label="出差费用：" >
          {{billInfo.cost}}
          </a-descriptions-item>
          <a-descriptions-item  label="交接人：" >
           {{billInfo.handover}}
          </a-descriptions-item>
          <a-descriptions-item  label="目的地：" >
          {{billInfo.destination}}
          </a-descriptions-item>
          <a-descriptions-item  label="出差理由：" >
          {{billInfo.remark}}
          </a-descriptions-item>
          <a-descriptions-item  label="是否销差">
           {{whetherYN[billInfo.isrevoked]}}
          </a-descriptions-item>
          <a-descriptions-item label="审批状态：" >
            {{approveStateName[billInfo.approvestatus]}}
          </a-descriptions-item>
         </a-descriptions>
        <p class="fileClass" @click="fileManager">附件管理</p>
        <!--审批流程-->
        <ApproveProcess :workflownote="billInfo.workflownote" v-if="['102','0','1','2','3'].includes(approvestate)"/>
      </div>
      <div v-else>
        <a-empty description="暂无数据"/>
      </div>
    </div>
    <!--  审核按钮  -->
    <ApproveButton :pk_h="pk_h" :approvestate="approvestate" v-if="pk_h && approvestate" />
  </div>
</template>

<script>
  import storage from 'store'
  import Header from '@/components/Header/Index'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import ApproveButton from '@/components/Button/ApproveButton'
  import {getTripBill} from '@/api/trip'
  import {approveStateName, whetherYN, HrkqMinUnit,BillTypeCode} from '@/utils/ConstantUtils'
  export default {
    name: "approve",
    components: {Header, ApproveProcess, ApproveButton},
    data() {
      return {
        whetherYN,
        HrkqMinUnit,
        approveStateName,
        title: '出差申请单',
        check: {
          show: false,
          title: '',
          node: '',
          action: '',
        },
        currentHeight: '',
        billInfo: {},
        approvestate: '',
        pk_h: '',
        billtype: ''
      }
    },
    watch: {},
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 54) + 'px'
      if (this.$route.query.pk_h) {
        this.pk_h = this.$route.query.pk_h
      }
      if (this.$route.query.billtype) {
        this.billtype = this.$route.query.billtype
      }
      this.queryBillInfo(this.$route.query.pk_h)
    },
    methods: {
      /**
       * 附件管理
       */
      fileManager() {
        this.$router.push({name: 'enclosure', query: {filePath: this.pk_h}})
      },
      /**
       * 查询单据
       */
      queryBillInfo(pk_h) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          billid: pk_h
        }
        getTripBill(params).then(res => {
          this.billInfo = res.data
          this.approvestate = res.data.approvestatus
          Toast.clear()
        })
      },
      /**
       * 返回事件
       */
      clickLeft() {
        this.$router.go(-1)
      },

    }
  }
</script>

<style lang='less' scoped>
  .item_body {
    width: 100%;
    overflow-y: auto;

    &_title {
      font-size: 14px;
      line-height: 14px;
      padding-left: 10px;
      color: #999;
    }
  }

  .button_bottom {
    position: fixed;
    width: 100%;
    height: 50px;
    padding: 5px 0px;
  }

  .fileClass {
    color: #2479ed;
    font-size: 14px;
    background: #fff;
    padding: 20px 10px;
  }
</style>
