<template>
  <div>
    <!-- 按钮区域-->
    <a-row type="flex" justify="space-around" class="button_bottom">
      <a-col :wrapper-col="{ span: 12 }" :label-col="{ span: 5 }">
        <a-button round block type="primary" html-type="submit" @click="saveBillInfo">保 存</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'SaveButton',
  data() {
    return {}
  },
  created() {},
  methods: {
    // 保存单据
    saveBillInfo() {
      this.$emit('save')
    },
  },
}
</script>

<style scoped lang="less">
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
