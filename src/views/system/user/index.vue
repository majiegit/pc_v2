<template>
  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-spin :spinning="loading">
      <!-- 搜索行-->
      <a-col :span="24">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="6" :sm="24">
                <a-form-item label="用户姓名">
                  <a-input v-model="userQueryParam.realName" placeholder="请输入用户姓名"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="用户账号">
                  <a-input v-model="userQueryParam.username" placeholder="请输入用户账号"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-space>
                  <a-button type="primary" @click="getUserPageList" icon="search">查询</a-button>
                  <a-button icon="redo">重置</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>
      <!--操作按钮区域-->
      <a-col :span="24" style="padding: 10px">
        <a-button type="primary" icon="plus" @click="addUserEdit">添加用户</a-button>
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
          <userDetail slot="expandedRowRender" slot-scope="record" style="margin: 0" :userData="record"
                      :userColumns="userColumns"/>
          <!--状态-->
          <template slot="status" slot-scope="status">
            <a-badge status="success" v-if="status == 1" text="正常"/>
            <a-badge status="error" v-if="status == 0" text="冻结"/>
          </template>
          <!--性别-->
          <template slot="sex" slot-scope="sex">
            <span v-if="sex == 1">男</span>
            <span v-else-if="sex == 2">女</span>
            <span v-else>未知</span>
          </template>
          <!--头像-->
          <template slot="avatar" slot-scope="avatar">
            <img :src=" host + avatar" v-if="avatar" style="width: 50px;"/>
          </template>
          <template slot="operation" slot-scope="text,record">
            <a href="javascript:;" class="operation" @click="updateUserEdit(record)">编辑</a>
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

    <!--分配角色权限区域代码-->
    <a-drawer
      :title="editStatus == 'add' ? '添加用户' : '编辑用户'"
      placement="right"
      width="500"
      :visible="userEditVisible"
      @close="closeUserEdit"
    >
      <UserEdit :userIdProp="userId" v-if="editStatus" :operation="editStatus" @saveOk="saveOk"/>
    </a-drawer>
  </a-row>
</template>

<script>
  import ACol from "ant-design-vue/es/grid/Col";
  import UserEdit from '@/views/system/user/UserEdit'
  import UserDetail from '@/views/system/user/UserDetail'
  import {queryUserListPage, queryUserFieldList} from '@/api/user'

  export default {
    name: "user",
    components: {ACol, UserDetail, UserEdit},
    data() {
      return {
        host: window.location.protocol + '//' + window.location.host + '/api/jay-system',
        editStatus: '',
        userId: '',
        userEditVisible: false,
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
       * 保存成功
       */
      saveOk() {
        this.userEditVisible = false
        this.userId = null
        this.editStatus = ''
        this.getUserPageList()
      },
      /**
       * 修改用户
       */
      updateUserEdit(row) {
        this.userEditVisible = true
        this.userId = row.id
        this.editStatus = 'edit'
      },
      /**
       * 添加用户
       */
      addUserEdit() {
        this.userEditVisible = true
        this.userId = null
        this.editStatus = 'add'
      },
      /**
       * 关闭用户编辑窗口
       */
      closeUserEdit() {
        this.userEditVisible = false
      },
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
        this.userQueryParam.current = this.page.current
        this.userQueryParam.size = this.page.pageSize
        queryUserListPage(this.userQueryParam).then(res => {
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
              align: 'center',
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