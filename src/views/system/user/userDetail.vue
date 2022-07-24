<template>
  <a-descriptions>
    <a-descriptions-item :label="column.name" v-for="(column,index) in userColumns" :key="index">
      {{userDetail[column.field]}}
    </a-descriptions-item>
  </a-descriptions>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";

  export default {
    name: "userDetail",
    components: {ACol, ARow},
    props: {
      userDetail: {
        type: Object
      },
      userColumns: {
        default: [],
        type: Array
      }
    }
  }
</script>

<style scoped>
  .row {
    min-height: 40px;
  }
</style>