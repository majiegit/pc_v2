<template>
  <div>
    <a-layout>
      <a-layout-header :style="{ width: '100%',background: '#fff',padding: '0px', 'margin-bottom': '10px' }">
        <div class="header_left">
          <img src="../assets/logo.png">
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


</style>
