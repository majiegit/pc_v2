<template>
  <div>
    <a-layout>
      <a-layout-header :style="{ width: '100%',background: '#fff',padding: '0px', 'margin-bottom': '10px' }">
        <div class="header_left">
          <img src="../assets/logo.png">
        </div>
        <div class="header_center">
          <div>
            <a-tooltip title="刷新页面">
              <a-icon type="reload" style="font-size: 18px;cursor: pointer;" @click="refresh"/>
            </a-tooltip>
          </div>
        </div>
        <div class="header_right">
          <RightContent></RightContent>
        </div>
      </a-layout-header>
      <a-layout-content>
        <router-view/>
      </a-layout-content>
    </a-layout>
  </div>

</template>
<script>
  import RightContent from '@/components/GlobalHeader/RightContent'
  import ALayoutSider from "ant-design-vue/es/layout/Sider";

  export default {
    name: 'BasicLayout',
    components: {ALayoutSider, RightContent},
    methods: {
      refresh() {
        window.location.reload()
      }
    }
  }
</script>
<style lang="less">
  .header_left {
    width: 15%;
    float: left;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, #28B0FF, #0875FF);
    img {
      width: 70%;
    }
  }

  .header_center {
    width: 55%;
    padding-left: 1%;
    float: left;
    height: 100%;
    /*background: linear-gradient(90deg, #28B0FF, #0875FF);*/
  }

  .header_right {
    width: 30%;
    float: left;
    height: 100%;
    /*background: linear-gradient(90deg, #28B0FF, #0875FF);*/
  }
</style>
