<template>
  <div>
    <Header ></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo.pk_psndoc">
        
         <a-descriptions>
          <a-descriptions-item label="休假类型">
            {{ billInfo.leavetypename }}
          </a-descriptions-item>
          <a-descriptions-item label="申请人">
            {{ billInfo.psndocname }}
          </a-descriptions-item>
          <a-descriptions-item label="审批状态">
            {{ approveStateName[billInfo.approvestatus] }}
          </a-descriptions-item>
        </a-descriptions>
        <p class="item_body_title">请假信息</p>
        <a-descriptions>
          <a-descriptions-item :label="'请假开始' + (billInfo.minunit == '2' ? '日期' : '时间')">
            {{ billInfo.minunit == '2' ? billInfo.leavebegintime.substring(0, 10) : billInfo.leavebegintime }}
          </a-descriptions-item>
          <a-descriptions-item :label="'请假结束' + (billInfo.minunit == '2' ? '日期' : '时间')">
            {{ billInfo.minunit == '2' ? billInfo.leaveendtime.substring(0, 10) : billInfo.leaveendtime }}
          </a-descriptions-item>
          <a-descriptions-item v-if="billInfo.leave_start_day_type" label="开始时间">
            {{ StartEndDayType[billInfo.leave_start_day_type] }}
          </a-descriptions-item>
          <a-descriptions-item v-if="billInfo.leave_end_day_type" label="结束时间">
            {{ StartEndDayType[billInfo.leave_end_day_type] }}
          </a-descriptions-item>
          <a-descriptions-item label="请假时长">
            {{ billInfo.leaveday + HrkqMinUnit[billInfo.minunit] }}
          </a-descriptions-item>
          <a-descriptions-item label="休假说明">
            {{ billInfo.leaveremark }}
          </a-descriptions-item>
        </a-descriptions>
        <p class="item_body_title">销假信息</p>
        <a-descriptions>
          <a-descriptions-item :label="'实际开始' + (billInfo.minunit == '2' ? '日期' : '时间')">
            {{ billInfo.minunit == '2' ? billInfo.leaveoffbegintime.substring(0, 10) : billInfo.leaveoffbegintime }}
          </a-descriptions-item>
          <a-descriptions-item :label="'实际结束' + (billInfo.minunit == '2' ? '日期' : '时间')">
            {{ billInfo.minunit == '2' ? billInfo.leaveoffendtime.substring(0, 10) : billInfo.leaveoffendtime }}
          </a-descriptions-item>
          <a-descriptions-item v-if="billInfo.leaveoff_start_day_type" label="实际开始时间">
            {{ StartEndDayType[billInfo.leaveoff_start_day_type] }}
          </a-descriptions-item>
          <a-descriptions-item v-if="billInfo.leaveoff_end_day_type" label="实际结束时间">
            {{ StartEndDayType[billInfo.leaveoff_end_day_type] }}
          </a-descriptions-item>
          <a-descriptions-item label="实际休假时长">
            {{ billInfo.leaveoffday + HrkqMinUnit[billInfo.minunit] }}
          </a-descriptions-item>
          <a-descriptions-item label="销假原因">
            {{ LeaveOffReason[billInfo.dr_flag] }}
          </a-descriptions-item>
          <a-descriptions-item label="销假说明">
            {{ billInfo.leaveoffremark }}
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

    <!-- 按钮区域-->
    <ApproveButton :pk_h="pk_h" :approvestate="approvestate" v-if="pk_h && approvestate" />
  </div>
</template>

<script>
  import storage from 'store'
  import Header from '@/components/Header/Index'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import ApproveButton from '@/components/Button/ApproveButton'
  import {getLeaveoffBill,submitLeaveoffBill, recoverLeaveoffBill,deleteLeaveoffBill} from '@/api/leaveoff'
  import {approveStateName, whetherYN, StartEndDayType, HrkqMinUnit,LeaveOffReason} from '@/utils/ConstantUtils'
  import {BillTypeCode} from '@/utils/ConstantUtils'
  export default {
    name: "approve",
    components: {Header, ApproveProcess, ApproveButton,Header},
    data() {
      return {
        approveStateName,
        whetherYN,
        StartEndDayType,
        HrkqMinUnit,
        LeaveOffReason,
        title: '销假审批单',
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
        billtype: BillTypeCode.leaveOff.billtypecode
      }
    },
    watch: {},
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
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
        this.$router.push({name: 'enclosure', query: {filePath: this.pk_h, disabled: disabled}})
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
        getLeaveoffBill(params).then(res => {
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
      /**
       * 审核确认
       */
      checkConfirm() {
        Toast.loading({
          message: '审批中...',
          duration: 0
        })
      },

      /**
       * 单据审核
       */
      checkBill(type) {
        this.check.show = true
        if (type == 'Y') {
          // 审核通过
          this.check.action = 'Y'
          this.check.title = '审核通过'
        } else if (type == 'N') {
          // 审核不通过
          this.check.action = 'N'
          this.check.title = '审核不通过'
        } else if (type == 'R') {
          // 驳回
          this.check.action = 'R'
          this.check.title = '驳回'
        }
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
