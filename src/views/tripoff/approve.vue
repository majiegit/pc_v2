<template>
  <div>
    <Header ></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo.pk_psndoc">
        <p class="item_body_title">出差信息</p>
        <a-descriptions>
          <a-descriptions-item label="出差类型：" >
           {{billInfo.triptypename}}
          </a-descriptions-item>
          <a-descriptions-item label="申请人：" >
          {{billInfo.psndocname}}
          </a-descriptions-item>
          <a-descriptions-item label="申请时间：">
          {{billInfo.applydate}}
          </a-descriptions-item>
          <a-descriptions-item label="开始时间：">
          {{billInfo.tripoffbegintime}}
          </a-descriptions-item>
          <a-descriptions-item label="结束时间：" >
          {{billInfo.tripendtime}}
          </a-descriptions-item>
          <a-descriptions-item label="出差时长：" >
          {{billInfo.tripday + HrkqMinUnit[billInfo.minunit]}}
          </a-descriptions-item>
          <a-descriptions-item label="出差目的地：">
          {{billInfo.otapplylength}}
          </a-descriptions-item>
          <a-descriptions-item label="出差费用：">
          {{billInfo.cost}}
          </a-descriptions-item>
          <a-descriptions-item label="销差原因：">
          {{billInfo.remark}}
          </a-descriptions-item>
          <a-descriptions-item label="审批状态：" >
          {{approveStateName[billInfo.approvestatus]}}
          </a-descriptions-item>
        </a-descriptions>
        <p class="item_body_title">销差信息</p>
        <a-descriptions>
        <a-descriptions-item label="销差理由：" >
        {{billInfo.tripoffremark}}
        </a-descriptions-item>
        <a-descriptions-item label="实际开始时间：">
        {{billInfo.tripoffbegintime}}
        </a-descriptions-item>
        <a-descriptions-item label="实际结束时间：">
        {{billInfo.tripoffendtime}}
        </a-descriptions-item>
        <a-descriptions-item label="实际出差时长：" >
        {{billInfo.tripoffday + HrkqMinUnit[billInfo.minunit]}}
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
    
  
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import ApproveButton from '@/components/Button/ApproveButton'
  // import {getOvertimeBill, deleteOvertimeBill} from '@/api/overtime'

  export default {
    name: "tripoffApprove",
    components: {ApproveProcess, ApproveButton},
    data() {
      return {
        title: '销差申请单',
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
        // 如果等于 1  附件禁止操作
        let disabled = 1
        if (['3', '-1'].includes(this.approvestate)) {
          // 提交 自由态 附件可操作
          disabled = 0
        }
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
          billid: pk_h,
          billtype: billtype
        }
        getBillInfo(params).then(res => {
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
