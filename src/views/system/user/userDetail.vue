<template>
  <a-descriptions>
    <a-descriptions-item :label="column" v-for="(column,index) in userColumns" :key="index">
      {{userDetail[column]}}
    </a-descriptions-item>
  </a-descriptions>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";

  export default {
    name: "userDetail",
    components: {ACol, ARow},
    data(){
      return {
        userColumns,
      }
    },
    props: {
      userDetail: {
        type: Object
      }
    }
  }
  const userColumns = [
    {
      title: '名字',
      dataIndex: 'realname'
    }
  ]
</script>

<style scoped>
  .row {
    min-height: 40px;
  }
</style>