<template>
  <a-spin :spinning="loading">
    <a-row class="body">
      <!--操作按钮区域-->
      <a-col :span="24" style="padding: 10px">
        <a-button type="primary" icon="plus">新增模板</a-button>
        <a-button type="primary" icon="plus">批量删除</a-button>
      </a-col>
      <!--用户列表区域-->
      <a-row>
        <a-col span="24">
          <a-table
            row-key="id"
            :columns="tableUserColumns"
            :pagination="page"
            :data-source="userList"
          >
            <userDetail slot="expandedRowRender" slot-scope="record" style="margin: 0" :userDetail="record"
                        :userColumns="userColumns"/>
            <template slot="operation" slot-scope="text,record">
              <a href="javascript:;" class="operation" @click="updateMenuClick(record)">编辑</a>
              <a href="javascript:;" class="operation">
                <a-popconfirm
                  title="确定要删除此用户吗?"
                  @confirm="() => deleteMenuRow(record)"
                >删除
                </a-popconfirm>
              </a>
            </template>
          </a-table>
        </a-col>
      </a-row>
    </a-row>
  </a-spin>
</template>

<script>
  export default {
    name: "temp",
    data() {
      return {
        tempData: [],
        loading: true
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {},
  }
</script>

<style scoped>
  .body {
    background: #fff;
  }
</style>