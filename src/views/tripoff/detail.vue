<template>
  <div  class="detail">
    
    <div class="detail-body" >
      <div style="text-align:right"> 
        <a-button  type="primary" @click="deleteBill"  v-if="approvestate == '-1'">删除</a-button>
      </div>
      <div v-if="billInfo.pk_psndoc">
        <p class="item_body_title">出差信息</p>
       
        <a-descriptions>
          <a-descriptions-item  label="出差类型：">
            {{ billInfo.triptypename }}
          </a-descriptions-item>
          <a-descriptions-item label="申请人：">
            {{billInfo.psndocname}}
          </a-descriptions-item>
          <a-descriptions-item label="审批状态">
            {{ approveStateName[billInfo.approvestatus] }}
          </a-descriptions-item>
        </a-descriptions>
         <a-descriptions>
          <a-descriptions-item  label="出差开始时间：">
            {{ billInfo.tripoffbegintime }}
          </a-descriptions-item>
          <a-descriptions-item label="出差结束时间：">
            {{billInfo.tripendtime}}
          </a-descriptions-item>
          <a-descriptions-item label="出差时长：">
            {{ billInfo.tripday + HrkqMinUnit[billInfo.minunit] }}
          </a-descriptions-item>
           <a-descriptions-item  label="出差目的地：">
            {{ billInfo.otapplylength }}
          </a-descriptions-item>
          <a-descriptions-item label="出差费用：">
            {{billInfo.cost}}
          </a-descriptions-item>
          <a-descriptions-item label="出差理由：">
            {{ billInfo.remark }}
          </a-descriptions-item>
        </a-descriptions>
        <p class="item_body_title">销假信息</p>
        <a-descriptions>
          <a-descriptions-item  label="销差原因：">
            {{TripOffReason[billInfo.dr_flag] }}
          </a-descriptions-item>
          <a-descriptions-item label="实际开始时间：">
            {{billInfo.tripoffbegintime}}
          </a-descriptions-item>
          <a-descriptions-item label="实际结束时间：">
            {{ billInfo.tripoffendtime }}
          </a-descriptions-item>
           <a-descriptions-item  label="实际出差时长：">
            {{billInfo.tripoffday + HrkqMinUnit[billInfo.minunit]}}
          </a-descriptions-item>
          <a-descriptions-item label="销差理由：">
            {{billInfo.tripoffremark}}
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
    <!--单据操作按钮-->
    <ApplyButton :pk_h="pk_h" :billtype="billtype" :approvestate="approvestate" v-if="pk_h && approvestate"
                 @submit="submitBill" @rollback="rollbackBill"/>
  </div>
</template>

<script>
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import ApplyButton from '@/components/Button/ApplyButton'
  import {getTripoffBill,submitTripoffBill, recoverTripoffBill,deleteTripoffBill} from '@/api/tripoff'
  import {approveStateName, HrkqMinUnit, TripOffReason,BillTypeCode} from '@/utils/ConstantUtils'

  export default {
    name: "tripoffDetail",
    components: {Header, ApproveProcess, ApplyButton},
    data() {
      return {
        HrkqMinUnit,
        TripOffReason,
        approveStateName,
        title: '销差申请',
        
        rightIcon: '',
        billInfo: {},
        approvestate: '',
        pk_h: '',
        billtype: BillTypeCode.tripOff.billtypecode
      }
    },
    watch: {
      approvestate(val) {
        // 只有自由态可删除
        if (val == '-1') {
          this.rightIcon = 'delete-o'
        }
      }
    },
    mounted() {
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
       * 返回事件
       */
      clickLeft() {
        this.$router.go(-1)
      },
      /**
       * 附件管理
       */
      fileManager() {
        // 如果等于 1  附件禁止操作
        let disabled = 1
        if (['-1'].includes(this.approvestate)) {
          // 提交 自由态 附件可操作
          disabled = 0
        }
        this.$router.push({name: 'enclosure', query: {filePath: this.pk_h, disabled: disabled}})
      },
      // 删除单据
      
      deleteBill() {
        let _this = this
        if (this.approvestate == '-1') {
          let params = {
            billid: this.pk_h
          }
          this.$confirm({
          title: '删除单据',
          content: (h) => <div>是否确定删除单据?</div>,
          onOk() {
            deleteTripoffBill(params).then((res) => {
              this.$message.success(res.message)
              setTimeout(() => {
                this.$router.replace("myApply")
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
          recoverTripoffBill(params).then((res) => {
            _this.$message.success(res.message)
            _this.queryBillInfo(_this.pk_h)
          })
        },
        onCancel() {
          console.log('Cancel')
        },
      })

      },
      /**
       * 提交单据
       */
      submitBill() {
        let _this = this
      this.$confirm({
        title: '提交单据',
        content: (h) => <div>是否确定提交单据?</div>,
        onOk() {
          let params = {
            pk_h: _this.pk_h,
          }
          submitTripoffBill(params).then((res) => {
            _this.$message.success(res.message)
            _this.queryBillInfo(_this.pk_h)
          })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
      
      },
      // 查询单据
       queryBillInfo(pk_h) {
        let params = {
          billid: pk_h
        }
        getTripoffBill(params).then(res => {
          this.billInfo = res.data
          this.approvestate = res.data.approvestatus
         })
      }
    }
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
    .item_body_title {
      font-size: 16px;
      line-height: 14px;
      padding: 5px;
      color: #999;
      border-left: 3px solid #2b80ff;
    }
    .ant-descriptions-view {
      padding: 20px 10px;
    }
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
