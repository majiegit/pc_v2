<template>
  <div class="detail">
    <div class="detail-body">
      <div style="text-align:right"> 
        <a-button  type="primary" @click="deleteBill" v-if="approvestate == '-1'">删除</a-button>
      </div>
      <div v-if="billInfo.pk_psndoc">
        <a-descriptions>
          <a-descriptions-item label="休假类型">
            {{ billInfo.leavetypename }}
          </a-descriptions-item>
          <a-descriptions-item label="申请人">
            {{ billInfo.psndocname }}
          </a-descriptions-item>
          <a-descriptions-item label="申请时间">
            {{ billInfo.applydate }}
          </a-descriptions-item>
          <a-descriptions-item :label="'开始' + (billInfo.minunit == '2' ? '日期' : '时间')">
            {{ billInfo.minunit == '2' ? billInfo.begintime.substring(0, 10) : billInfo.begintime }}
          </a-descriptions-item>
          <a-descriptions-item :label="'结束' + (billInfo.minunit == '2' ? '日期' : '时间')">
            {{ billInfo.minunit == '2' ? billInfo.endtime.substring(0, 10) : billInfo.endtime }}
          </a-descriptions-item>
          <a-descriptions-item v-if="billInfo.start_day_type" label="开始时间">
            {{ StartEndDayType[billInfo.start_day_type] }}
          </a-descriptions-item>
          <a-descriptions-item v-if="billInfo.end_day_type" label="结束时间">
            {{ StartEndDayType[billInfo.end_day_type] }}
          </a-descriptions-item>

          <a-descriptions-item label="请假时长">
            {{ billInfo.leaveday + HrkqMinUnit[billInfo.minunit] }}
          </a-descriptions-item>
          <a-descriptions-item label="休假说明">
            {{ billInfo.leaveremark }}
          </a-descriptions-item>
          <a-descriptions-item label="是否销假">
            {{ whetherYN[billInfo.isrevoked] }}
          </a-descriptions-item>
          <a-descriptions-item label="审批状态">
            {{ approveStateName[billInfo.approvestatus] }}
          </a-descriptions-item>
        </a-descriptions>

        <p class="fileClass" @click="fileManager">附件管理</p>
        <!--审批流程-->
        <ApproveProcess
          :workflownote="billInfo.workflownote"
          v-if="['102', '0', '1', '2', '3'].includes(approvestate)"
        />
      </div>
      <!--单据操作按钮-->
      <ApplyButton
        :pk_h="pk_h"
        :billtype="billtype"
        :approvestate="approvestate"
        v-if="pk_h && approvestate"
        @submit="submitBill"
        @rollback="rollbackBill"
      />
    </div>
  </div>
</template>

<script>
import storage from 'store'
import { getLeaveBill, submitLeaveBill, recoverLeaveBill, deleteLeaveBill } from '@/api/leave'
import { approveStateName, whetherYN, StartEndDayType, HrkqMinUnit, BillTypeCode } from '@/utils/ConstantUtils'
import ApplyButton from '@/components/Button/ApplyButton'
import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
export default {
  name: 'leaveDetail',
  components: { ApplyButton, ApproveProcess },
  data() {
    return {
      HrkqMinUnit,
      StartEndDayType, // 上下午
      whetherYN, // 是否YN
      approveStateName, // 审批状态
      title: '请假申请',
      currentHeight: '',
      rightIcon: '',
      billInfo: {},
      approvestate: '',
      pk_h: '',
      billtype: BillTypeCode.leave.billtypecode,
    }
  },
  watch: {
    approvestate(val) {
      // 只有自由态可删除
      if (val == '-1') {
        this.rightIcon = 'delete-o'
      } else {
        this.rightIcon = ''
      }
    },
  },
  mounted() {
    this.currentHeight = document.documentElement.clientHeight - 46 - 60 + 'px'
    if (this.$route.query.pk_h) {
      this.pk_h = this.$route.query.pk_h
    }
    if (this.$route.query.billtype) {
      this.billtype = this.$route.query.billtype
    }
    this.queryBillInfo(this.$route.query.pk_h)
  },
  methods: {
    // 附件管理

    fileManager() {
      // 如果等于 1  附件禁止操作
      let disabled = 1
      if (['-1'].includes(this.approvestate)) {
        // 提交 自由态 附件可操作
        disabled = 0
      }
      this.$router.push({ name: 'enclosure', query: { filePath: this.pk_h, disabled: disabled } })
    },
    // 删除单据
    deleteBill() {
      let _this = this
      if (this.approvestate == '-1') {
        let params = {
          billid: this.pk_h,
        }
        this.$confirm({
          title: '删除单据',
          content: (h) => <div>是否确定删除单据?</div>,
          onOk() {
            deleteLeaveBill(params).then((res) => {
              this.$message.success(res.message)
              setTimeout(() => {
                _this.$router.replace('myApply')
              }, 500)
            })
          },
          onCancel() {
            console.log('Cancel')
          },
        })
      }
    },
    // 收回单据

    rollbackBill() {
      let _this = this
      this.$confirm({
        title: '收回单据',
        content: (h) => <div>是否确定收回单据?</div>,
        onOk() {
          let params = {
            pk_h: _this.pk_h,
          }
          recoverLeaveBill(params).then((res) => {
            _this.$message.success(res.message)
            _this.queryBillInfo(_this.pk_h)
          })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    // 提交单据

    submitBill() {
      let _this = this
      this.$confirm({
        title: '提交单据',
        content: (h) => <div>是否确定提交单据?</div>,
        onOk() {
          let params = {
            pk_h: _this.pk_h,
          }
          submitLeaveBill(params).then((res) => {
            _this.$message.success(res.message)
            _this.queryBillInfo(_this.pk_h)
          })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    //查询单据

    queryBillInfo(pk_h) {
      let params = {
        billid: pk_h,
      }
      getLeaveBill(params).then((res) => {
        this.billInfo = res.data
        let list = [
          {
            approveresult: null,
            approvestatus: '0',
            checkman: '1001A9100000000007PX',
            checkmanname: '马杰',
            checknote: null,
            dealdate: null,
            senddate: '2022-11-27 17:36:39',
            senderman: '1001A9100000000007PX',
            sendermanname: '马杰',
          },
          {
            approveresult: null,
            approvestatus: '1',
            checkman: '1001A9100000000007PX',
            checkmanname: '李四',
            checknote: null,
            dealdate: null,
            senddate: '2022-11-27 17:36:39',
            senderman: '1001A9100000000007PX',
            sendermanname: '李四',
          },
        ]
        this.billInfo.workflownote = list
        console.log(this.billInfo)
        this.approvestate = res.data.approvestatus
      })
    },
  },
}
</script>

<style lang='less' scoped>
.detail {
  padding: 20px;
  height: 100%;
  background: #fff;
  .detail-body {
    height: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(167, 167, 167, 0.4);
    overflow-y: scroll;
    .leave_type_button {
      margin: 10px 10px 0;
    }
  }
}
.item_body {
  width: 100%;
  overflow-y: auto;
}

.fileClass {
  color: #2479ed;
  font-size: 14px;
  background: #fff;
  padding: 20px 10px;
}
</style>
