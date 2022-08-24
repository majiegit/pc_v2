<!--
声明： 当前vue文件 为开发组织文件, 包含增删改查
替换步骤：1、组织 -> 模块名
          2、Org -> 模块名  eg: Temp
          3、org -> 模块名  eg: temp
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
                <a-form-item label="组织名称">
                  <a-input v-model="orgQueryParam.orgName" placeholder="请输入组织名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="组织编码">
                  <a-input v-model="orgQueryParam.orgCode" placeholder="请输入组织编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-space>
                  <a-button type="primary" @click="queryOrgDataByParam" icon="search">查询</a-button>
                  <a-button @click="resetOrgQueryParam">重置</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>

      <!--操作按钮区域-->
      <a-col :span="24">
        <a-space>
          <a-button type="primary" icon="plus" @click="openOrgModal">新增组织</a-button>
          <a-button @click="removeBatchOrg" type="danger" icon="delete" v-if="selectedDataIds.length > 0">批量删除
          </a-button>
        </a-space>
      </a-col>


      <!--组织列表区域-->
      <a-col span="24">
        <a-table
          align="center"
          row-key="orgId"
          :columns="orgTableColumns"
          :pagination="page"
          :data-source="orgData"
          :row-selection="{ selectedRowKeys: selectedDataIds, onChange: changeTableSelect }"
          @change="changeTablePage"
        >
            <span slot="orgType" slot-scope="orgType">
                <a-tag color="orange" v-if="orgType == 0">数组</a-tag>
                <a-tag color="green" v-if="orgType == 1">树形</a-tag>
            </span>
          <template slot="operation" slot-scope="text,record">
            <a-space>
              <a href="javascript:;" @click="updateOrg(record)">编辑</a>
              <a href="javascript:;" style="color: red;">
                <a-popconfirm
                  title="确定要删除此组织吗?"
                  @confirm="() => removeOrg(record)"
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
        @ok="saveOrgModal"
        @cancel="cancelOrgModal"
      >
        <a-form-model :model="orgForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon labelAlign="left"
                      ref="orgFormRef"
                      :rules="orgFormRules">
          <a-form-model-item label="组织名称" prop="orgName">
            <a-input v-model="orgForm.orgName"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-spin>
  </a-row>
</template>

<script>
  import {queryOrgPage, queryOrgFieldList, deleteOrg, deleteOrgBatch, saveOrg} from '@/api/org'

  export default {
    name: "org",
    data() {
      return {
        orgData: [],
        selectedDataIds: [],
        loading: true,
        orgQueryParam: {},
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
        orgForm: {},
        orgTableColumns:[],
        orgColumns: [],
        orgFormRules,
        // 弹出框相关参数
        modalTitle: '',
        modalVisible: false,
        modalConfirmLoading: false
      }
    },
    created() {
    },
    mounted() {
      this.getOrgFieldList()
    },
    methods: {
      /**
       * 查询数据点击事件
       */
      queryOrgDataByParam() {
        console.log(this.orgQueryParam)
        this.getOrgData()
      },
      /**
       * 重置查询条件
       */
      resetOrgQueryParam() {
        this.orgQueryParam = {}
      },
      /**
       * 查询数据
       */
      getOrgData() {
        this.loading = true
        let param = {
          current: this.page.current,
          size: this.page.pageSize,
          groupId: this.orgGroupId,
          orgName: this.orgQueryParam.orgName,
          orgCode: this.orgQueryParam.orgCode,
        }
        Object.keys(param).forEach(item => {
          if (param[item] === null || param[item] === '' || param[item] === undefined) {
            delete param[item]
          }
        })
        queryOrgPage(param).then(res => {
          this.loading = false
          this.orgData = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 取消组织窗口
       */
      cancelOrgModal() {
        this.modalVisible = false
        this.$refs['orgFormRef'].clearValidate()
        this.orgForm = {}
      },
      /**
       * 保存组织
       */
      saveOrgModal() {
        console.log(this.orgForm)
        this.$refs.orgFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            this.modalConfirmLoading = true
            saveOrg(this.orgForm).then(res => {
              this.modalConfirmLoading = false
              this.$message.success(res.message)
              this.cancelOrgModal()
              this.getOrgData()
            },error => {
              this.modalConfirmLoading = false
            })
          }
        })
      },
      /**
       * 打开组织窗口
       */
      openOrgModal() {
        this.modalVisible = true
        this.modalTitle = '添加组织'
      },
      /**
       * 修改组织
       */
      updateOrg(row) {
        let form = JSON.parse(JSON.stringify(row))
        this.modalVisible = true
        this.modalTitle = '修改组织'
        this.orgForm = form
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
        this.getOrgData()
      },
      /***
       * 批量删除
       */
      removeBatchOrg() {
        this.loading = true
        deleteOrgBatch(this.selectedDataIds).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getOrgData()
        })
      },
      /**
       * 删除组织
       */
      removeOrg(row) {
        this.loading = true
        deleteOrg(row.orgId).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getOrgData()
        })
      },
      /**
       * 查询用户显示字段
       */
      getOrgFieldList() {
        queryOrgFieldList().then(res => {
          this.orgColumns = res.data
          this.getTableOrgColumns(res.data)
          this.getOrgData()
        })
      },
      /**
       * 处理表格显示字段
       */
      getTableOrgColumns(data) {
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
        this.orgTableColumns = arr
      }
    }
  }
  const orgFormRules = {
    orgName: [{required: true, message: '请输入组织名称', trigger: 'blur'}]
  }

  // const orgTableColumns = [
  //
  //   {
  //     title: '字典名称',
  //     dataIndex: 'orgName',
  //     scopedSlots: {
  //       customRender: 'orgName'
  //     },
  //     ellipsis: true
  //   },
  //   {
  //     title: '字典编码',
  //     dataIndex: 'orgCode',
  //     scopedSlots: {
  //       customRender: 'orgCode'
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
  //     dataIndex: 'orgGroupName',
  //     scopedSlots: {
  //       customRender: 'orgGroupName'
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