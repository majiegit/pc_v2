<template>
  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <iframe :src="path" style="width: 100%; height: 900px;"></iframe>
  </a-row>
</template>

<script>
  import ACol from "ant-design-vue/es/grid/Col";

  export default {
    name: 'Analysis',
    components: {
      ACol
    },
    data() {
      return {
        path: ''
      }
    },
    computed: {},
    created() {
      console.log(this.$route)
      this.path = this.$route.name
    }
  }
</script>