<!--审核状态-->
<template>
  <div>
    <div class="proveCheckOption_title">
      <p style="width: 90%; float: left; padding-left: 10px;">审批流程</p>
      <p style="width: 10%; float: left;" @click="arrowShowClick">
        <van-icon name="arrow-down" v-if="arrowShow"/>
        <van-icon name="arrow-up" v-else/>
      </p>
    </div>
    <div class="proveCheckOption_body" v-if="arrowShow">
      <div style="width: 100%; height: 100px;" v-for=" (item ,index) in workflownote" :key="index">
        <div style="width: 15%; height: 100%; float: left; position: relative;">
          <div style=" width: 20px;height: 20px; border-radius: 50%; position: relative; margin: 0 auto;
          background: #fff; border: 2px solid #2479ED;"
               :class="'backgroundRed'">
            <div style=" width: 10px;height: 10px;border-radius: 50%; position: relative; margin: 5px auto;"
                 :class="'backgroundRed'">
            </div>
          </div>
          <div style="width: 7%; height:80px;  margin: 0 auto;"
               :class="'backgroundRed'"
               v-if="index != workflownote.length-1"></div>
        </div>
        <div style="width: 80%; height: 100%; float: left; cursor: pointer; font-size: 15px;">
          <p style="color:#000;position: relative;">
            <span style="color: #000; font-weight: bold; font-size: 15px;">{{item.checkmanname}}</span>
            <span style="color: #999999; position: absolute; right: 0px; font-size: 13px;" v-if="item.dealdate"> 时间：{{item.dealdate}}</span>
          </p>
          <p style="color:#999; font-size: 13px;">
            <span>{{item.approveresult}}</span>
            <span style="margin-left: 5px;">{{item.checknote}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ApproveProcess',
    components: {},
    props: {
      workflownote: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        arrowShow: true,
      }
    },
    watch: {},
    computed: {},
    mounted() {
      console.log(this.workflownote)
    },
    methods: {
      arrowShowClick() {
        if (this.arrowShow) {
          this.arrowShow = false
        } else {
          this.arrowShow = true
        }
      },
    }
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
    background: #2479ED;
  }

  .backgroundGrey {
    background: rgb(161, 161, 161);
  }
</style>
