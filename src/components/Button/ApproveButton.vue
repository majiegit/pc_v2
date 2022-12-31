<template>
  <div>
    <!-- 按钮区域-->
    <a-row  :gutter="24">
      <a-col :span="11">
        <a-button round block type="info" @click="checkBill('Y')" :disabled="!['2','3'].includes(approvestate)">批 准</a-button>
      </a-col>
      <a-col :span="11">
        <a-button round block type="info" @click="reject" :disabled="!['2','3'].includes(approvestate)">驳 回</a-button>
      </a-col>
    </a-row>
<!--  驳回选择  -->
    <!-- <van-action-sheet
      title="请选择驳回方式"
      v-model="show"
      :actions="approveMenu"
      @select="choosereject"
      close-on-click-action
    /> -->
    <!--审批弹框-->
    <a-dialog v-model="check.show" title="审批意见" show-cancel-button @confirm="checkConfirm">
      <a-input v-model="check.node" label="" placeholder="请输入审批意见"/ >
    </a-dialog>
  </div>
</template>

<script>
import storage from 'store'
export default {
  name: "ApproveButton",
  props: {
    pk_h: {
      type: String,
      default: ''
    },
    approvestate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      check: {
        show: false,
        title: '',
        node: '',
        action: '',
      },
      show: false,
      approveMenu: [
        { name: '制单人', value: 1 },
        { name: '上一级', value: 2 },
      ]
    }
  },
  created(){
    if (!['2','3'].includes(this.approvestate)) {
      console.log('class1')
      return 'class1'
    } else  {}
    return 'class2'
  },
  methods: {
    choosereject(action) {
      console.log(action)
    },
    /**
     *
     */
    reject () {
      this.show = true
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
    /**
     * 审核确认
     */
    checkConfirm() {
      this.$message.success('审批中...')
    }
  }
}
</script>
<style scoped>
.button_bottom {
  width: 100%;
  height: 44px;
  padding: 5px 0px;
}
</style>

<style >
.button_bottom .van-col .van-dropdown-menu .van-dropdown-menu__bar{
  border-radius: 25px;
  background: #1989fa;
}
.button_bottom .van-col .van-dropdown-menu .van-dropdown-menu__bar .van-dropdown-menu__item .van-dropdown-menu__title .van-ellipsis {
  color: #fff;
}
</style>


