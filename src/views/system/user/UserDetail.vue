<template>
  <a-descriptions>
    <a-descriptions-item :label="column.name" v-for="(column,index) in columns" :key="index">
      <span v-if="column.field === 'avatar'">
        <img :src=" host + user[column.field]" v-if="user[column.field]" style="width: 50px;"/>
      </span>
      <span v-else>
        {{user[column.field]}}
      </span>
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
      userData: {
        default: () => {
          return {}
        },
        type: Object
      },
      userColumns: {
        default: () => {
          return []
        },
        type: Array
      }
    },
    data() {
      return {
        host: window.location.protocol + '//' + window.location.host + '/api/jay-system',
        user: this.userData,
        columns: this.userColumns
      }
    }
  }
</script>

<style scoped>
  .row {
    min-height: 40px;
  }
</style>