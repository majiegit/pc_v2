<template>
  <div>
    <Header ></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo.pk_psndoc">
         <a-descriptions>
          <a-descriptions-item label="出差类型：">
            {{ billInfo.triptypename }}
          </a-descriptions-item>
          <a-descriptions-item label="申请人：">
            {{ billInfo.psndocname }}
          </a-descriptions-item>
          <a-descriptions-item label="申请时间：">
            {{ billInfo.applydate }}
          </a-descriptions-item>
          <a-descriptions-item label="出差开始时间：">
            {{ billInfo.tripbegintime }}
          </a-descriptions-item>
          <a-descriptions-item label="出差结束时间：">
            {{ billInfo.tripendtime }}
          </a-descriptions-item>
            <a-descriptions-item label="出差费用：">
            {{ billInfo.cost }}
          </a-descriptions-item>
          
          <a-descriptions-item label="出差时长：">
            {{ billInfo.tripday	+ HrkqMinUnit[billInfo.minunit] }}
          </a-descriptions-item>

            <a-descriptions-item label="交接人：">
            {{ billInfo.handover }}
          </a-descriptions-item>
          <a-descriptions-item label="目的地：">
            {{ billInfo.destination }}
          </a-descriptions-item>
          <a-descriptions-item label="出差理由：">
            {{ billInfo.remark }}
          </a-descriptions-item>
            <a-descriptions-item label="是否销差">
            {{ billInfo.triptypename }}
          </a-descriptions-item>
          <a-descriptions-item label="申请人：">
            {{ whetherYN[billInfo.isrevoked] }}
          </a-descriptions-item>
          <a-descriptions-item label="审批状态：">
            {{ approveStateName[billInfo.approvestatus] }}
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
  import storage from 'store'
  import Header from '@/components/Header/Index'
  import ApplyButton from '@/components/Button/ApplyButton'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import {getTripBill, submitTripBill, recoverTripBill, deleteTripBill} from '@/api/trip'
  import {approveStateName, whetherYN, HrkqMinUnit,BillTypeCode} from '@/utils/ConstantUtils'

  export default {
    name: "edit",
    components: {Header, ApproveProcess, ApplyButton},
    data() {
      return {
        whetherYN,
        HrkqMinUnit,
        approveStateName,
        title: '出差申请单',
        currentHeight: '',
        rightIcon: '',
        billInfo: {},
        approvestate: '',
        pk_h: '',
        billtype: BillTypeCode.trip.billtypecode
      }
    },
    watch: {
      approvestate(val) {
        // 只有自由态可删除
        if (val == '-1') {
          this.rightIcon = 'delete-o'
        }else {
          this.rightIcon = ''
        }
      }
    },
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
      /**
       * 删除单据
       */
      deleteBill() {
        if (this.approvestate == '-1') {
          let params = {
            billid: this.pk_h
          }
          this.$confirm({
          title: '删除单据',
          content: (h) => <div>是否确定删除单据?</div>,
          onOk() {
            deleteTripBill(params).then((res) => {
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
      /**
       * 收回单据
       */
      rollbackBill() {
         let _this = this
         this.$confirm({
        title: '收回单据',
        content: (h) => <div>是否确定收回单据?</div>,
        onOk() {
          let params = {
            pk_h: _this.pk_h,
          }
          recoverTripBill(params).then((res) => {
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
          submitTripBill(params).then((res) => {
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
      }
    }
  }
</script>

<style lang='less' scoped>
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
