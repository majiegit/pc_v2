<template>
  <div>
    <!--    <Header :title="title" @clickLeft="clickLeft"></Header>-->
    <div style="width: 100%; height: 100%; overflow-x: auto" v-if="imgPath">
      <img :src="imgPath" style="width: 100%; zoom:1;"/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header/Index'

export default {
  components: {
    Header
  },
  data: function () {
    return {
      title: '员工查询',
      imgPath: ''
    }
  },
  updated () {
  },
  created () {
    // console.log(this.getUrlParams())
    let urlParam = this.getUrlParams()
    console.log(urlParam)
    this.imgPath = require('../../../images/' + urlParam.imgPath + '.png')
    console.log('img', this.imgPath)
  },
  mounted () {
  },
  methods: {
    /**
     * 返回事件
     */
    clickLeft() {
      this.$router.go(-1)
    },
    //获取请求url中的参数
    getUrlParams () {
      //debugger
      var params = null;
      if (!!window.location.hash) {
        if (!!location.hash.split('?')) {
          params = location.hash.split('?')[1];
          // console.log('参数',params);
          if (!!params) {
            params = params.replace(/\=/g, '":"');
            params = params.replace(/\&/g, '","');
            params = '{"' + params + '"}';
            // console.log('键值1',params);
            //alert("params = " + params);
            params = JSON.parse(params);
            // console.log('键值2',params);
          }
        }
      }
      return params;
    }
  },
}
</script>
<style>
.myheader{
  height: .88rem;
  line-height: .88rem;
}
</style>
