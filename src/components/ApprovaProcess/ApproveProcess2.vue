<!--审核状态-->
<template>
  <div>
    <a-collapse default-active-key="0" v-model="arrowShow">
      <a-collapse-panel header="审批流程" title="审批流程" name="0">
        <a-steps progress-dot :current="active" direction="vertical" active-color="#2479ed">
          <a-step v-for="(item, index) in billInfo.workflownote" :key="index">
            <template #description>
              <!--提交人-->
              <div v-if="index == 0">
                <p>
                  <span>{{ item.sendermanname }}</span>
                  <span>提交</span>
                </p>
                <p>{{ item.senddate }}</p>
              </div>
              <!--审批人-->
              <div v-else>
                <p>
                  <span>{{ item.checkmanname }}</span>
                  <span v-if="item.approveresult == 'Y'">审批通过</span>
                  <span v-if="item.approveresult == 'N'">审批不通过</span>
                </p>
                <p>{{ item.checknote }}</p>
                <p>{{ item.senddate }}</p>
              </div>
            </template>
          </a-step>
        </a-steps>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
export default {
  name: 'ApproveProcess',
  components: {},
  props: {
    workflownote: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      arrowShow: ['0'],
      active: 0,
    }
  },
  watch: {},
  computed: {},
  mounted() {
    console.log(this.workflownote)
    if (this.workflownote) {
      this.active = this.workflownote.length - 1
    }
  },
  methods: {},
}
</script>
<style lang="less" scoped>
.proveCheckOption_body {
  width: 94%;
  margin: 0 3%;
  border-radius: 10px;
  padding-top: 5px;
  background: #fff;
}

.proveCheckOption_title {
  display: flex;
  align-items: center;
  justify-content: start;
  font-size: 14px;
  line-height: 14px;
  color: #999;
}

.backgroundRed {
  background: #2479ed;
}

.backgroundGrey {
  background: rgb(161, 161, 161);
}
</style>
