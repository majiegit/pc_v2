<template>
  <a-row>
    <a-col span="6" v-for="(column,index) in userColumns" :key="index" class="row">
       {{column.name}}： {{userDetail[column.field]}}
    </a-col>
  </a-row>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  export default {
    name: "userDetail",
    components: {ACol, ARow},
    props:{
      userDetail:{
        type: Object
      },
      userColumns:{
        default: [],
        type: Array
      }
    },
    mounted(){

    },
    methods:{

    }
  }
</script>

<style scoped>
.row{
  min-height: 40px;
}
</style>