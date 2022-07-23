<template>
  <a-spin :spinning="loading">
    <a-row class="body">
      <!--操作按钮区域-->
      <a-col :span="24" class="header">
        <a-space>
          <a-button type="primary" icon="plus">新增模板</a-button>
          <a-button type="danger" icon="delete">批量删除</a-button>
        </a-space>
      </a-col>
      <!--用户列表区域-->
      <a-row>
        <a-col span="24">
          <a-table
            row-key="id"
            :columns="tempTableColumns"
            :pagination="page"
            :data-source="userList"
          >
            <template slot="operation" slot-scope="text,record">
              <a href="javascript:;" class="operation" @click="updateTemp(record)">编辑</a>
              <a href="javascript:;" class="operation">
                <a-popconfirm
                  title="确定要删除此模板吗?"
                  @confirm="() => removeTemp(record)"
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
  import {queryDictPage, deleteDict,queryFieldList} from '@/api/dict'
  export default {
    name: "temp",
    data() {
      return {
        tempData: [],
        tempColumns:[],
        tempTableColumns:[],
        loading: true,
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
    },
    methods: {
      /**
       * 查询用户显示字段
       */
      getFieldList() {
        queryFieldList([]).then(res => {
          this.tempColumns = res.data
          this.getUserList()
        })
      },
      /**
       * 查询数据
       */
      getTempData(){
        queryDictPage(this.page.current, this.page.pageSize).then(res => {
          this.getTableColumns()
          this.loading = false
          this.tempData = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 删除模板
       */
      deleteTemp(){

      },

      /**
       * 处理表格显示字段
       */
      getTableColumns() {
        // 排除显示字段
        let columnsFilters = ['id', 'createUser', 'createTime', 'updateUser', 'updateTime']
        let arr = []
        this.tempColumns.forEach(field => {
          if (!columnsFilters.includes(field.field)) {
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
        this.tempTableColumns = arr
      }
    },
  }
</script>

<style scoped>
  .body {
    padding: 20px 10px 50px 10px;
    background: #fff;
  }

  .header {
    padding-bottom: 20px;
  }
</style>