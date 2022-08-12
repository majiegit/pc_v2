<template>
  <a-spin :spinning="loading">
    <div style="background: #fff;">
      <!--操作按钮区域-->
      <a-col :span="24" style="padding: 10px">
        <a-button type="primary" icon="plus">添加用户</a-button>
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
            <userDetail slot="expandedRowRender" slot-scope="record" style="margin: 0" :userDetail="record"/>
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
    </div>
  </a-spin>
</template>

<script>
  import ACol from "ant-design-vue/es/grid/Col";
  import userDetail from './userDetail'
  import {queryUserListPage} from '@/api/user'

  export default {
    name: "user",
    components: {ACol, userDetail},
    data() {
      return {
        tableUserColumns,
        loading: true,
        userList: [],
        // 分页对象
        page: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '30', '50', '100'],
          showQuickJumper: true,
          total: 0,
          pages: 0,
          hideOnSinglePage: true
        }
      }
    },
    created() {
    },
    mounted() {
      this.getUserPageList()
    },
    methods: {
      /**
       * 查询用户列表
       */
      getUserPageList() {
        queryUserListPage(this.page.current, this.page.pageSize).then(res => {
          this.loading = false
          this.userList = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      }
    }
  }


  const tableUserColumns = [
    {
      title: '账号',
      dataIndex: 'username',
      scopedSlots: {
        customRender: 'username'
      },
      ellipsis: true
    },
    {
      title: '姓名',
      dataIndex: 'realname',
      scopedSlots: {
        customRender: 'realname'
      },
      ellipsis: true
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      scopedSlots: {
        customRender: 'avatar'
      },
      ellipsis: true
    },
    {
      title: '性别',
      dataIndex: 'sex',
      scopedSlots: {
        customRender: 'sex'
      },
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      scopedSlots: {
        customRender: 'status'
      },
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'}
    }
  ]
</script>

<style scoped>
  .operation {
    margin-left: 5px;
  }
</style>