<template>
  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-spin :spinning="loading">
      <!-- 搜索行-->
      <a-col :span="24">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="6" :sm="24">
                <a-form-item label="用户名称">
                  <a-input v-model="userQueryParam.dictName" placeholder="请输入用户名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="用户编码">
                  <a-input v-model="userQueryParam.roleCode" placeholder="请输入用户编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-space>
                  <a-button type="primary" @click="getUserPageList" icon="search" >查询</a-button>
                  <a-button icon="redo">重置</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>
      <!--操作按钮区域-->
      <a-col :span="24" style="padding: 10px">
        <a-button type="primary" icon="plus">添加用户</a-button>
      </a-col>

      <!--用户列表区域-->
      <a-col span="24">
        <a-table
          row-key="id"
          :columns="tableUserColumns"
          :pagination="page"
          :data-source="userList"
          @change="changeTablePage"
        >
          <userDetail slot="expandedRowRender" slot-scope="record" style="margin: 0" :userDetail="record" :userColumns="userColumns"/>
          <template slot="operation" slot-scope="text,record">
            <a href="javascript:;" class="operation" @click="updateMenuClick(record)">编辑</a>
            <a href="javascript:;" class="operation" style="color: red;">
              <a-popconfirm
                title="确定要删除此用户吗?"
                @confirm="() => deleteMenuRow(record)"
              >删除
              </a-popconfirm>
            </a>
          </template>
        </a-table>
      </a-col>
    </a-spin>
  </a-row>
</template>

<script>
  import ACol from "ant-design-vue/es/grid/Col";
  import userDetail from './userDetail'
  import {queryUserListPage, queryUserFieldList} from '@/api/user'

  export default {
    name: "user",
    components: {ACol, userDetail},
    data() {
      return {
        userQueryParam: {},
        userColumns: [],
        tableUserColumns: [],
        loading: true,
        userList: [],
        // 分页对象
        page: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '30', '50', '100'],
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,
          pages: 0,
          hideOnSinglePage: true
        }
      }
    },
    created() {
    },
    mounted() {
      this.getUserFieldList()
    },
    methods: {
      /**
       * 分页改变事件
       */
      changeTablePage(val) {
        this.page.current = val.current
        this.page.pageSize = val.pageSize
        this.getUserPageList()
      },
      /**
       * 查询用户显示字段
       */
      getUserFieldList() {
        queryUserFieldList().then(res => {
          this.userColumns = res.data
          this.getTableUserColumns()
          this.getUserPageList()
        })
      },
      /**
       * 查询用户列表
       */
      getUserPageList() {
        this.loading = true
        queryUserListPage(this.page.current, this.page.pageSize).then(res => {
          this.loading = false
          this.userList = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 处理表格显示字段
       */
      getTableUserColumns() {
        // 排除显示字段
        let userColumnsFilters = ['id', 'password', 'relTenantIds', 'userIdentity', 'thirdId', 'thirdType', 'telephone', 'createUser', 'createTime', 'updateUser', 'updateTime']
        let arr = []
        this.userColumns.forEach(field => {
          if (!userColumnsFilters.includes(field.field)) {
            var obj = {
              title: field.name,
              dataIndex: field.field,
              scopedSlots: {
                customRender: field.field
              },
              ellipsis: true
            }
            arr.push(obj)
          }
        })
        // 添加操作列
        let operation = {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {customRender: 'operation'},
        }
        arr.push(operation)
        this.tableUserColumns = arr
      }
    }
  }
</script>

<style scoped>
  .operation {
    margin-left: 5px;
  }
</style>