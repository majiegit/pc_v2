<template>
  <div>
    <a-input-group>
      <a-row type="flex" align="middle" style="padding-bottom: 20px;">
        <a-col :span="24">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                  <a-form-item label="姓名">
                    <a-input v-model="allocated.queryParam.realName" placeholder="请输入姓名"/>
                  </a-form-item>
                </a-col>
                <a-col :md="5" :sm="24">
                  <a-space>
                    <a-button type="primary" icon="search" @click="queryAllocatedUserData">查询</a-button>
                    <a-button @click="resetQueryParam" icon="redo">重置</a-button>
                  </a-space>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-col>
      </a-row>
    </a-input-group>
    <a-row>
      <a-col span="24">
        <a-table
          :scroll="{ y: 330 }"
          align="center"
          row-key="id"
          :pagination="allocated.page"
          :columns="allocated.tableColumns"
          :loading="allocated.tableLoading"
          :row-selection="{ selectedRowKeys: selectedUserIds, onChange: changeUserTableSelect }"
          @change="changeUserTablePage"
          :data-source="allocated.userList"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import {queryUserListPage} from '@/api/user'

  export default {
    name: "SelectUser",
    props: {
      selectedUserIds: {
        // 已选择用户ID 数据
        type: Array,
        default: []
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // selectedData: [],
        // 待分配定义数据
        allocated: {
          queryParam: { //查询参数
            username: '' // 用户账号
          },
          tableLoading: false,
          tableColumns: allocatedUserDataTableColumns,
          userList: [],// 待分配用户数据
          page: { // 分页对象
            current: 1,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
            total: 0,
            pages: 0,
            hideOnSinglePage: true
          }
        },
      }
    },
    watch: {
      // 组件显示
      show(val) {
        if (val) {
          // 组件显示
          this.getUserPageList() // 查询用户数据
        } else {
          // 组件关闭
          this.resetQueryParam() // 重置查询参数
        }
      }
    },
    mounted(){
      if(this.show){
        this.getUserPageList() // 查询用户数据
      }
    },
    methods: {
      /**
       * 重置待选用户查询参数
       */
      resetQueryParam() {
        this.allocated.queryParam = {}
      },
      /**
       * 待选用户查询事件
       */
      queryAllocatedUserData() {
        console.log(this.allocated.queryParam)
        this.getUserPageList()
      },
      /**
       * 表格选择事件
       */
      changeUserTableSelect(selectedUserIds) {
        this.$emit('select',selectedUserIds)
      },
      /**
       * 分页改变事件
       */
      changeUserTablePage(val) {
        this.allocated.page.current = val.current
        this.allocated.page.pageSize = val.pageSize
        this.getUserPageList()
      },
      /**
       * 查询用户列表
       */
      getUserPageList() {
        this.allocated.tableLoading = true
        let param = {
          current: this.allocated.page.current,
          size: this.allocated.page.pageSize
        }
        if (this.allocated.queryParam.realName) {
          param.realName = this.allocated.queryParam.realName
        }
        queryUserListPage(param).then(res => {
          this.allocated.tableLoading = false
          this.allocated.userList = res.data.records  // 用户数据
          this.allocated.page.current = res.data.current
          this.allocated.page.pageSize = res.data.size
          this.allocated.page.total = res.data.total
          this.allocated.page.pages = res.data.pages
        })
      },
    }
  }

  // 待分配用户数据列
  const allocatedUserDataTableColumns = [
    {
      title: '账号',
      dataIndex: 'username',
      scopedSlots: {customRender: 'username'}
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      scopedSlots: {customRender: 'realName'}
    },
    {
      title: '性别',
      dataIndex: 'sex',
      scopedSlots: {customRender: 'sex'}
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      scopedSlots: {customRender: 'realName'}
    }
  ]
</script>

<style scoped>

</style>