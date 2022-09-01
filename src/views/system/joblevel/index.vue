<!--
声明： 当前vue文件 为开发职级文件, 包含增删改查
替换步骤：1、职级 -> 模块名
          2、JobLevel -> 模块名  eg: Temp
          3、jobLevel -> 模块名  eg: temp
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
                <a-form-item label="职级名称">
                  <a-input v-model="jobLevelQueryParam.jobLevelName" placeholder="请输入职级名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="职级编码">
                  <a-input v-model="jobLevelQueryParam.jobLevelCode" placeholder="请输入职级编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-space>
                  <a-button type="primary" @click="queryJobLevelDataByParam" icon="search">查询</a-button>
                  <a-button @click="resetJobLevelQueryParam">重置</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>

      <!--操作按钮区域-->
      <a-col :span="24">
        <a-space>
          <a-button type="primary" icon="plus" @click="openJobLevelModal">新增职级</a-button>
          <a-button @click="removeBatchJobLevel" type="danger" icon="delete" v-if="selectedDataIds.length > 0">批量删除
          </a-button>
        </a-space>
      </a-col>


      <!--职级列表区域-->
      <a-col span="24">
        <a-table
          align="center"
          row-key="jobLevelId"
          :columns="jobLevelTableColumns"
          :pagination="page"
          :data-source="jobLevelData"
          :row-selection="{ selectedRowKeys: selectedDataIds, onChange: changeTableSelect }"
          @change="changeTablePage"
        >
          <template slot="operation" slot-scope="text,record">
            <a-space>
              <a href="javascript:;" @click="updateJobLevel(record)">编辑</a>
              <a href="javascript:;" style="color: red;">
                <a-popconfirm
                  title="确定要删除此职级吗?"
                  @confirm="() => removeJobLevel(record)"
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
        @ok="saveJobLevelModal"
        @cancel="cancelJobLevelModal"
      >
        <a-form-model :model="jobLevelForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon labelAlign="left"
                      ref="jobLevelFormRef"
                      :rules="jobLevelFormRules">
          <a-form-model-item label="职级名称" prop="jobLevelName">
            <a-input v-model="jobLevelForm.jobLevelName"/>
          </a-form-model-item>
          <a-form-model-item label="职级编码" prop="jobLevelCode">
            <a-input v-model="jobLevelForm.jobLevelCode"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-spin>
  </a-row>
</template>

<script>
  import {queryJobLevelPage, queryJobLevelFieldList, deleteJobLevel, deleteJobLevelBatch, saveJobLevel} from '@/api/jobLevel'

  export default {
    name: "jobLevel",
    data() {
      return {
        jobLevelData: [],
        selectedDataIds: [],
        loading: true,
        jobLevelQueryParam: {},
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
        jobLevelForm: {},
        jobLevelTableColumns,
        jobLevelColumns: [],
        jobLevelFormRules,
        // 弹出框相关参数
        modalTitle: '',
        modalVisible: false,
        modalConfirmLoading: false
      }
    },
    created() {
    },
    mounted() {
      this.getJobLevelData()
    },
    methods: {
      /**
       * 查询数据点击事件
       */
      queryJobLevelDataByParam() {
        console.log(this.jobLevelQueryParam)
        this.getJobLevelData()
      },
      /**
       * 重置查询条件
       */
      resetJobLevelQueryParam() {
        this.jobLevelQueryParam = {}
      },
      /**
       * 查询数据
       */
      getJobLevelData() {
        this.loading = true
        let param = {
          current: this.page.current,
          size: this.page.pageSize,
          groupId: this.jobLevelGroupId,
          jobLevelName: this.jobLevelQueryParam.jobLevelName,
          jobLevelCode: this.jobLevelQueryParam.jobLevelCode,
        }
        Object.keys(param).forEach(item => {
          if (param[item] === null || param[item] === '' || param[item] === undefined) {
            delete param[item]
          }
        })
        queryJobLevelPage(param).then(res => {
          this.loading = false
          this.jobLevelData = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 取消职级窗口
       */
      cancelJobLevelModal() {
        this.modalVisible = false
        this.$refs['jobLevelFormRef'].clearValidate()
        this.jobLevelForm = {}
      },
      /**
       * 保存职级
       */
      saveJobLevelModal() {
        console.log(this.jobLevelForm)
        this.$refs.jobLevelFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            this.modalConfirmLoading = true
            saveJobLevel(this.jobLevelForm).then(res => {
              this.modalConfirmLoading = false
              this.$message.success(res.message)
              this.cancelJobLevelModal()
              this.getJobLevelData()
            }).catch(res => {
              this.modalConfirmLoading = false
            })
          }
        })
      },
      /**
       * 打开职级窗口
       */
      openJobLevelModal() {
        this.modalVisible = true
        this.modalTitle = '添加职级'
      },
      /**
       * 修改职级
       */
      updateJobLevel(row) {
        let form = JSON.parse(JSON.stringify(row))
        this.modalVisible = true
        this.modalTitle = '修改职级'
        this.jobLevelForm = form
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
        this.getJobLevelData()
      },
      /***
       * 批量删除
       */
      removeBatchJobLevel() {
        this.loading = true
        deleteJobLevelBatch(this.selectedDataIds).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getJobLevelData()
        })
      },
      /**
       * 删除职级
       */
      removeJobLevel(row) {
        this.loading = true
        deleteJobLevel(row.jobLevelId).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getJobLevelData()
        })
      }
    }
  }
  const jobLevelFormRules = {
    jobLevelName: [{required: true, message: '请输入职级名称', trigger: 'blur'}],
    jobLevelCode: [{required: true, message: '请输入职级编码', trigger: 'blur'}]
  }

  const jobLevelTableColumns = [

    {
      title: '职级名称',
      dataIndex: 'jobLevelName',
      scopedSlots: {
        customRender: 'jobLevelName'
      },
      ellipsis: true
    },
    {
      title: '职级编码',
      dataIndex: 'jobLevelCode',
      scopedSlots: {
        customRender: 'jobLevelCode'
      },
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      scopedSlots: {
        customRender: 'createTime'
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
</style>