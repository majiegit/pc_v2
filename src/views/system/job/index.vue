<!--
声明： 当前vue文件 为开发职务文件, 包含增删改查
替换步骤：1、职务 -> 模块名
          2、Job -> 模块名  eg: Temp
          3、job -> 模块名  eg: temp
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
                <a-form-item label="职务名称">
                  <a-input v-model="jobQueryParam.jobName" placeholder="请输入职务名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="职务编码">
                  <a-input v-model="jobQueryParam.jobCode" placeholder="请输入职务编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-space>
                  <a-button type="primary" @click="queryJobDataByParam" icon="search">查询</a-button>
                  <a-button @click="resetJobQueryParam">重置</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>

      <!--操作按钮区域-->
      <a-col :span="24">
        <a-space>
          <a-button type="primary" icon="plus" @click="openJobModal">新增职务</a-button>
          <a-button @click="removeBatchJob" type="danger" icon="delete" v-if="selectedDataIds.length > 0">批量删除
          </a-button>
        </a-space>
      </a-col>


      <!--职务列表区域-->
      <a-col span="24">
        <a-table
          align="center"
          row-key="jobId"
          :columns="jobTableColumns"
          :pagination="page"
          :data-source="jobData"
          :row-selection="{ selectedRowKeys: selectedDataIds, onChange: changeTableSelect }"
          @change="changeTablePage"
        >
          <template slot="operation" slot-scope="text,record">
            <a-space>
              <a href="javascript:;" @click="updateJob(record)">编辑</a>
              <a href="javascript:;" style="color: red;">
                <a-popconfirm
                  title="确定要删除此职务吗?"
                  @confirm="() => removeJob(record)"
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
        @ok="saveJobModal"
        @cancel="cancelJobModal"
      >
        <a-form-model :model="jobForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon labelAlign="left"
                      ref="jobFormRef"
                      :rules="jobFormRules">
          <a-form-model-item label="职务名称" prop="jobName">
            <a-input v-model="jobForm.jobName"/>
          </a-form-model-item>
          <a-form-model-item label="职务编码" prop="jobCode">
            <a-input v-model="jobForm.jobCode"/>
          </a-form-model-item>
          <a-form-model-item label="职级" prop="jobLevelId">
            <a-select v-model="jobForm.jobLevelId" placeholder="请选择职级">
              <a-select-option v-for="(item,index) in jobLevelData" :key="index" :value="item.jobLevelId">
                {{item.jobLevelName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-spin>
  </a-row>
</template>

<script>
  import {queryJobPage, queryJobFieldList, deleteJob, deleteJobBatch, saveJob} from '@/api/job'
  import {queryJobLevelList} from '@/api/jobLevel'

  export default {
    name: "job",
    data() {
      return {
        jobLevelData: [],
        jobData: [],
        selectedDataIds: [],
        loading: true,
        jobQueryParam: {},
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
        jobForm: {},
        jobTableColumns,
        jobColumns: [],
        jobFormRules,
        // 弹出框相关参数
        modalTitle: '',
        modalVisible: false,
        modalConfirmLoading: false
      }
    },
    created() {
    },
    mounted() {
      this.getJobData()
      this.getJobLevelData()
    },
    methods: {
      /**
       * 查询职级数据
       */
      getJobLevelData(){
        queryJobLevelList().then( res => {
          this.jobLevelData = res.data
        })
      },
      /**
       * 查询数据点击事件
       */
      queryJobDataByParam() {
        console.log(this.jobQueryParam)
        this.getJobData()
      },
      /**
       * 重置查询条件
       */
      resetJobQueryParam() {
        this.jobQueryParam = {}
      },
      /**
       * 查询职务数据
       */
      getJobData() {
        this.loading = true
        let param = {
          current: this.page.current,
          size: this.page.pageSize,
          groupId: this.jobGroupId,
          jobName: this.jobQueryParam.jobName,
          jobCode: this.jobQueryParam.jobCode,
        }
        Object.keys(param).forEach(item => {
          if (param[item] === null || param[item] === '' || param[item] === undefined) {
            delete param[item]
          }
        })
        queryJobPage(param).then(res => {
          this.loading = false
          this.jobData = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 取消职务窗口
       */
      cancelJobModal() {
        this.modalVisible = false
        this.$refs['jobFormRef'].clearValidate()
        this.jobForm = {}
      },
      /**
       * 保存职务
       */
      saveJobModal() {
        console.log(this.jobForm)
        this.$refs.jobFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            this.modalConfirmLoading = true
            saveJob(this.jobForm).then(res => {
              this.modalConfirmLoading = false
              this.$message.success(res.message)
              this.cancelJobModal()
              this.getJobData()
            },error => {
              this.modalConfirmLoading = false
            })
          }
        })
      },
      /**
       * 打开职务窗口
       */
      openJobModal() {
        this.modalVisible = true
        this.modalTitle = '添加职务'
      },
      /**
       * 修改职务
       */
      updateJob(row) {
        let form = JSON.parse(JSON.stringify(row))
        this.modalVisible = true
        this.modalTitle = '修改职务'
        this.jobForm = form
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
        this.getJobData()
      },
      /***
       * 批量删除
       */
      removeBatchJob() {
        this.loading = true
        deleteJobBatch(this.selectedDataIds).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getJobData()
        })
      },
      /**
       * 删除职务
       */
      removeJob(row) {
        this.loading = true
        deleteJob(row.jobId).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getJobData()
        })
      },
      // /**
      //  * 查询用户显示字段
      //  */
      // getJobFieldList() {
      //   queryJobFieldList().then(res => {
      //     this.jobColumns = res.data
      //     this.getTableJobColumns(res.data)
      //     this.getJobData()
      //   })
      // },
      // /**
      //  * 处理表格显示字段
      //  */
      // getTableJobColumns(data) {
      //   let arr = []
      //   data.forEach(field => {
      //     var obj = {
      //       title: field.name,
      //       dataIndex: field.field,
      //       scopedSlots: {
      //         customRender: field.field
      //       },
      //       ellipsis: true
      //     }
      //     arr.push(obj)
      //   })
      //   // 添加操作列
      //   let operation = {
      //     title: '操作',
      //     dataIndex: 'operation',
      //     scopedSlots: {customRender: 'operation'},
      //   }
      //   arr.push(operation)
      //   this.jobTableColumns = arr
      // }
    }
  }
  const jobFormRules = {
    jobName: [{required: true, message: '请输入职务名称', trigger: 'blur'}],
    jobCode: [{required: true, message: '请输入职务编码', trigger: 'blur'}]
  }

  const jobTableColumns = [

    {
      title: '职务名称',
      dataIndex: 'jobName',
      scopedSlots: {
        customRender: 'jobName'
      },
      ellipsis: true
    },
    {
      title: '职务编码',
      dataIndex: 'jobCode',
      scopedSlots: {
        customRender: 'jobCode'
      },
      ellipsis: true
    },
    {
      title: '职级',
      dataIndex: 'jobLevelName',
      scopedSlots: {
        customRender: 'jobLevelName'
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
  .body {
    width: 100%;
    padding: 20px 10px 50px 10px;
    background: #fff;
  }

  .header {
    padding-bottom: 20px;
  }
</style>