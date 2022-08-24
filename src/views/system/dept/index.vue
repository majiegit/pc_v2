<!--
声明： 当前vue文件 为开发部门文件, 包含增删改查
替换步骤：1、部门 -> 模块名
          2、Dept -> 模块名  eg: Temp
          3、dept -> 模块名  eg: temp
-->

<template>
  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-spin :spinning="loading">
      <!-- 搜索行-->
      <a-col :span="24">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="6" :sm="24">
                <a-form-item label="部门名称">
                  <a-input v-model="deptQueryParam.deptName" placeholder="请输入部门名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="部门编码">
                  <a-input v-model="deptQueryParam.deptCode" placeholder="请输入部门编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-space>
                  <a-button type="primary" @click="queryDeptDataByParam" icon="search">查询</a-button>
                  <a-button @click="resetDeptQueryParam">重置</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>

      <!--操作按钮区域-->
      <a-col :span="24">
        <a-space>
          <a-button type="primary" icon="plus" @click="openDeptModal">新增部门</a-button>
          <a-button @click="removeBatchDept" type="danger" icon="delete" v-if="selectedDataIds.length > 0">批量删除
          </a-button>
        </a-space>
      </a-col>


      <!--部门列表区域-->
      <a-col span="24">
        <a-table
          align="center"
          row-key="deptId"
          :columns="deptTableColumns"
          :pagination="page"
          :data-source="deptData"
          :row-selection="{ selectedRowKeys: selectedDataIds, onChange: changeTableSelect }"
          @change="changeTablePage"
        >
            <span slot="deptType" slot-scope="deptType">
                <a-tag color="orange" v-if="deptType == 0">数组</a-tag>
                <a-tag color="green" v-if="deptType == 1">树形</a-tag>
            </span>
          <template slot="operation" slot-scope="text,record">
            <a-space>
              <a href="javascript:;" @click="updateDept(record)">编辑</a>
              <a href="javascript:;" style="color: red;">
                <a-popconfirm
                  title="确定要删除此部门吗?"
                  @confirm="() => removeDept(record)"
                >删除
                </a-popconfirm>
              </a>
            </a-space>
          </template>
        </a-table>
      </a-col>

      <!-- 添加、修改窗口-->
      <a-modal
        :title="modalTitle"
        :visible="modalVisible"
        :confirm-loading="modalConfirmLoading"
        @ok="saveDeptModal"
        @cancel="cancelDeptModal"
      >
        <a-form-model :model="deptForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon labelAlign="left"
                      ref="deptFormRef"
                      :rules="deptFormRules">
          <a-form-model-item label="部门名称" prop="deptName">
            <a-input v-model="deptForm.deptName"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-spin>
  </a-row>
</template>

<script>
  import {queryDeptPage, queryDeptFieldList, deleteDept, deleteDeptBatch, saveDept} from '@/api/dept'

  export default {
    name: "dept",
    data() {
      return {
        deptData: [],
        selectedDataIds: [],
        loading: true,
        deptQueryParam: {},
        // 分页对象
        page: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          showQuickJumper: true,
          total: 0,
          pages: 0,
          hideOnSinglePage: true
        },
        // 新增、修改时候Form表单
        deptForm: {},
        deptTableColumns:[],
        deptColumns: [],
        deptFormRules,
        // 弹出框相关参数
        modalTitle: '',
        modalVisible: false,
        modalConfirmLoading: false
      }
    },
    created() {
    },
    mounted() {
      this.getDeptFieldList()
    },
    methods: {
      /**
       * 查询数据点击事件
       */
      queryDeptDataByParam() {
        console.log(this.deptQueryParam)
        this.getDeptData()
      },
      /**
       * 重置查询条件
       */
      resetDeptQueryParam() {
        this.deptQueryParam = {}
      },
      /**
       * 查询数据
       */
      getDeptData() {
        this.loading = true
        let param = {
          current: this.page.current,
          size: this.page.pageSize,
          groupId: this.deptGroupId,
          deptName: this.deptQueryParam.deptName,
          deptCode: this.deptQueryParam.deptCode,
        }
        Object.keys(param).forEach(item => {
          if (param[item] === null || param[item] === '' || param[item] === undefined) {
            delete param[item]
          }
        })
        queryDeptPage(param).then(res => {
          this.loading = false
          this.deptData = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 取消部门窗口
       */
      cancelDeptModal() {
        this.modalVisible = false
        this.$refs['deptFormRef'].clearValidate()
        this.deptForm = {}
      },
      /**
       * 保存部门
       */
      saveDeptModal() {
        console.log(this.deptForm)
        this.$refs.deptFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            this.modalConfirmLoading = true
            saveDept(this.deptForm).then(res => {
              this.modalConfirmLoading = false
              this.$message.success(res.message)
              this.cancelDeptModal()
              this.getDeptData()
            },error => {
              this.modalConfirmLoading = false
            })
          }
        })
      },
      /**
       * 打开部门窗口
       */
      openDeptModal() {
        this.modalVisible = true
        this.modalTitle = '添加部门'
      },
      /**
       * 修改部门
       */
      updateDept(row) {
        let form = JSON.parse(JSON.stringify(row))
        this.modalVisible = true
        this.modalTitle = '修改部门'
        this.deptForm = form
      },
      /**
       * 表格选择事件
       */
      changeTableSelect(selectedDataIds) {
        console.log('selectedRowKeys changed: ', selectedDataIds)
        this.selectedDataIds = selectedDataIds
      },
      /**
       * 分页改变事件
       */
      changeTablePage(val) {
        this.page.current = val.current
        this.page.pageSize = val.pageSize
        this.getDeptData()
      },
      /***
       * 批量删除
       */
      removeBatchDept() {
        this.loading = true
        deleteDeptBatch(this.selectedDataIds).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getDeptData()
        })
      },
      /**
       * 删除部门
       */
      removeDept(row) {
        this.loading = true
        deleteDept(row.deptId).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getDeptData()
        })
      },
      /**
       * 查询用户显示字段
       */
      getDeptFieldList() {
        queryDeptFieldList().then(res => {
          this.deptColumns = res.data
          this.getTableDeptColumns(res.data)
          this.getDeptData()
        })
      },
      /**
       * 处理表格显示字段
       */
      getTableDeptColumns(data) {
        let arr = []
        data.forEach(field => {
          var obj = {
            title: field.name,
            dataIndex: field.field,
            scopedSlots: {
              customRender: field.field
            },
            ellipsis: true
          }
          arr.push(obj)
        })
        // 添加操作列
        let operation = {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {customRender: 'operation'},
        }
        arr.push(operation)
        this.deptTableColumns = arr
      }
    }
  }
  const deptFormRules = {
    deptName: [{required: true, message: '请输入部门名称', trigger: 'blur'}]
  }

  // const deptTableColumns = [
  //
  //   {
  //     title: '字典名称',
  //     dataIndex: 'deptName',
  //     scopedSlots: {
  //       customRender: 'deptName'
  //     },
  //     ellipsis: true
  //   },
  //   {
  //     title: '字典编码',
  //     dataIndex: 'deptCode',
  //     scopedSlots: {
  //       customRender: 'deptCode'
  //     },
  //     ellipsis: true
  //   },
  //   {
  //     title: '字典描述',
  //     dataIndex: 'description',
  //     scopedSlots: {
  //       customRender: 'description'
  //     },
  //     ellipsis: true
  //   },
  //   {
  //     title: '字典分组',
  //     dataIndex: 'deptGroupName',
  //     scopedSlots: {
  //       customRender: 'deptGroupName'
  //     },
  //     ellipsis: true
  //   },
  //   {
  //     title: '创建时间',
  //     dataIndex: 'createTime',
  //     scopedSlots: {
  //       customRender: 'createTime'
  //     },
  //     ellipsis: true
  //   },
  //   {
  //     title: '操作',
  //     dataIndex: 'operation',
  //     scopedSlots: {customRender: 'operation'}
  //   }
  // ]
</script>

<style scoped>
</style>