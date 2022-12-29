<template>
  <div>
    <!-- 按钮区域-->
    <!--自由态-->
    <a-row class="button_bottom" v-if="['-1'].includes(approvestate)">
      <a-col span="24">
        <a-button round block type="primary" @click="submitBill">提 交</a-button>
        <a-button round block type="primary" @click="editBill">编 辑</a-button>
      </a-col>
    </a-row>

    <!--提交态-->
    <a-row class="button_bottom" v-if="['3'].includes(approvestate)">
      <a-col span="23">
        <a-button round block type="primary" @click="rollbackBill">收 回</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { BillTypeMap } from '@/utils/ConstantUtils'

export default {
  name: 'ApplyButton',
  props: {
    pk_h: {
      type: String,
      default: '',
    },
    approvestate: {
      type: String,
      default: '',
    },
    billtype: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      BillTypeMap: BillTypeMap,
      check: {
        show: false,
        title: '',
        node: '',
        action: '',
      },
    }
  },
  created() {
    console.log(this.pk_h)
    console.log(this.approvestate)
    console.log(this.billtype)
  },
  methods: {
    /**
     * 编辑单据
     */
    editBill() {
      let routerPath = BillTypeMap[this.billtype].routerEditPath
      this.$router.push({ name: routerPath, query: { pk_h: this.pk_h } })
    },

    /**
     * 提交单据
     */
    submitBill() {
      this.$emit('submit')
    },
    /**
     * 收回单据
     */
    rollbackBill() {
      this.$emit('rollback')
    },
  },
}
</script>

<style scoped  lang="less">
.button_bottom {
  width: 100%;
  height: 50px;
  padding: 5px 0px;
  text-align: center;
  .ant-btn {
    width: 200px;
    margin-right: 15px;
    text-align: center;
    height: 40px;
    border-radius: 8px;
  }
}
</style>
