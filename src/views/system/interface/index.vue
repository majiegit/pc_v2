<!--
声明： 当前vue文件 为开发接口文件, 包含增删改查
替换步骤：1、接口 -> 模块名
          2、Api -> 模块名  eg: Temp
          3、api -> 模块名  eg: temp
-->

<template>
  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-spin :spinning="loading">
      <!--操作按钮区域-->
      <a-col :span="24">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="4" :sm="24">
                <a-form-item label="所属模块">
                  <a-select v-model="queryParams.moduleName" :options="apiModuleNameList" allowClear
                            placeholder="请选择所属模块"/>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item label="接口路径">
                  <a-input v-model="queryParams.url" placeholder="请输入接口路径"/>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item label="接口名称">
                  <a-input v-model="queryParams.name" placeholder="请输入接口名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item label="是否拦截">
                  <a-select v-model="queryParams.isFilter" :options="apiIsFilterData" allowClear placeholder="请选择是否拦截"/>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-space>
                  <a-button @click="queryApiDataClick" type="primary" icon="search">查询</a-button>
                  <a-button @click="emptyQueryParamClick" icon="redo">重置</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>
      <a-col :span="24">
        <a-space>
          <a-button type="primary" icon="plus" @click="openApiModal">新增接口</a-button>
          <a-button @click="removeBatchApi" type="danger" icon="delete" v-if="selectedDataIds.length > 0">批量删除
          </a-button>
        </a-space>
      </a-col>
      <!--接口列表区域-->

      <a-col span="24">
        <a-table
          align="center"
          row-key="id"
          :columns="apiTableColumns"
          :pagination="page"
          :data-source="apiData"
          :row-selection="{ selectedRowKeys: selectedDataIds, onChange: changeTableSelect }"
          @change="changeTablePage"
        >
            <span slot="isFilter" slot-scope="isFilter">
                <a-tag color="green" v-if="isFilter == 0">否</a-tag>
                <a-tag color="orange" v-if="isFilter == 1">是</a-tag>
            </span>
          <template slot="operation" slot-scope="text,record">
            <a-space>
              <a href="javascript:;" @click="updateApi(record)">编辑</a>
              <a href="javascript:;" style="color: red;">
                <a-popconfirm
                  title="确定要删除此接口吗?"
                  @confirm="() => removeApi(record)"
                >删除
                </a-popconfirm>
              </a>
            </a-space>
          </template>
        </a-table>
      </a-col>

      <!-- 添加、修改窗口-->
      <div>
        <a-modal
          :title="modalTitle"
          :visible="modalVisible"
          :confirm-loading="modalConfirmLoading"
          @ok="saveApiModal"
          @cancel="cancelApiModal"
        >
          <a-form-model :model="apiForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon labelAlign="left"
                        ref="apiFormRef"
                        :rules="apiFormRules">
            <a-form-model-item label="所属模块" prop="moduleName">
              <a-select v-model="apiForm.moduleName" :options="apiModuleNameList" placeholder="请选择所属模块"/>
            </a-form-model-item>
            <a-form-model-item label="名称" prop="name">
              <a-input v-model="apiForm.name" placeholder="请输入接口名称"/>
            </a-form-model-item>
            <a-form-model-item label="路径" prop="url">
              <a-input v-model="apiForm.url" placeholder="请输入接口路径"/>
            </a-form-model-item>
            <a-form-model-item label="是否拦截" prop="isFilter">
              <a-switch v-model="isFilterValue" checked-children="是" un-checked-children="否" default-checked
                        @change="isFilterChange"/>
            </a-form-model-item>
            <a-form-model-item label="权限标识" prop="code" v-if="isFilterValue">
              <a-input v-model="apiForm.code" placeholder="请输入权限标识"/>
            </a-form-model-item>
            <a-form-model-item label="请求类型" prop="type">
              <a-input v-model="apiForm.type" placeholder="请输入请求类型"/>
            </a-form-model-item>
            <a-form-model-item label="接口类" prop="className">
              <a-input v-model="apiForm.className" placeholder="请输入接口类"/>
            </a-form-model-item>
            <a-form-model-item label="方法名" prop="method">
              <a-input v-model="apiForm.method" placeholder="请输入方法名"/>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </div>
    </a-spin>
  </a-row>
</template>

<script>
  import {queryApiPage, deleteApi, deleteApiBatch, saveApi} from '@/api/api'
  import {queryDictItemListByCode} from '@/api/dictItem'
  import {DictCode} from '@/utils/system/dictCode'
  import {DictConstant} from '@/utils/system/dictConstant'
  import {IsNoData} from '@/utils/staticDataUtils'
  import ACol from "ant-design-vue/es/grid/Col";

  export default {
    name: "api",
    components: {ACol},
    data() {
      return {
        // 查询参数
        queryParams: {
          url: '',
          name: '',
          moduleName: undefined,
          isFilter: undefined
        },
        //
        apiIsFilterData: IsNoData,
        // 所属模块集合
        apiModuleNameList: [],
        apiData: [],
        apiTableColumns,
        selectedDataIds: [],
        loading: true,
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
        apiForm: {
          isFilter: 1,
        },
        isFilterValue: true,
        apiFormRules,
        // 弹出框相关参数
        modalTitle: '',
        modalVisible: false,
        modalConfirmLoading: false
      }
    },
    created() {
    },
    mounted() {
      this.getApiData()
      this.getDictItemListByCode()
    },
    methods: {
      /**
       * 清空查询参数
       */
      emptyQueryParamClick() {
        this.queryParams = {}
      },
      /**
       * 查询事件
       */
      queryApiDataClick() {
        console.log(this.queryParams)
        this.page.current = 1
        this.getApiData()
      },

      /**
       * 查询数据字典模块名
       */
      getDictItemListByCode() {
        queryDictItemListByCode(DictCode.api.modules_list, DictConstant.dict_status_enable).then(res => {
          this.apiModuleNameList = res.data
        })
      },

      /**
       * 查询Api数据
       */
      getApiData() {
        this.loading = true
        let param = {
          current: this.page.current,
          size: this.page.pageSize,
          url: this.queryParams.url,
          name: this.queryParams.name,
          moduleName: this.queryParams.moduleName,
          isFilter: this.queryParams.isFilter
        }
        Object.keys(param).forEach(item => {
          if (param[item] === null || param[item] === '' || param[item] === undefined) {
            delete param[item]
          }
        })
        queryApiPage(param).then(res => {
          this.loading = false
          this.apiData = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 取消接口窗口
       */
      cancelApiModal() {
        this.$refs['apiFormRef'].clearValidate()
        this.modalVisible = false
        this.apiForm = {}
      },
      /**
       * 保存接口
       */
      saveApiModal() {
        this.$refs.apiFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            saveApi(this.apiForm).then(res => {
              this.$message.success(res.message)
              this.cancelApiModal()
              this.getApiData()
            })
          }
        })
      },
      /**
       * 打开接口窗口
       */
      openApiModal() {
        this.modalVisible = true
        this.modalTitle = '添加接口'
      },
      /**
       * 修改接口
       */
      updateApi(row) {
        let form = JSON.parse(JSON.stringify(row))
        form.isFilter == 0 ? this.isFilterValue = false : this.isFilterValue = true
        this.modalVisible = true
        this.modalTitle = '修改接口'
        this.apiForm = form
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
        this.getApiData()
      },
      /***
       * 批量删除
       */
      removeBatchApi() {
        deleteApiBatch(this.selectedDataIds).then(res => {
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getApiData()
        })
      },
      /**
       * 删除接口
       */
      removeApi(row) {
        deleteApi(row.id).then(res => {
          this.$message.success(res.message)
          this.getApiData()
        })
      },
      isFilterChange(val) {
        if (val) {
          this.apiForm.isFilter = 1
        } else {
          this.apiForm.isFilter = 0
          this.apiForm.code = ''
        }
      }
    },
  }
  const apiFormRules = {
    name: [{required: true, message: '请输入接口名称', trigger: 'blur'}],
    moduleName: [{required: true, message: '请输入所属模块', trigger: 'blur'}],
    url: [{required: true, message: '请输入接口路径', trigger: 'blur'}],
    code: [{required: false, message: '请输入权限标识', trigger: 'blur'}],
    type: [{required: false, message: '请输入请求类型', trigger: 'blur'}],
    className: [{required: false, message: '请输入接口类名', trigger: 'blur'}],
    method: [{required: false, message: '请输入接口方法名称', trigger: 'blur'}],
  }
  const apiTableColumns = [

    {
      title: '接口名称',
      dataIndex: 'name',
      scopedSlots: {
        customRender: 'name'
      },
      ellipsis: true,
      width: 200
    },
    {
      title: '所属模块',
      dataIndex: 'moduleName',
      scopedSlots: {
        customRender: 'moduleName'
      },
      ellipsis: true
    },
    {
      title: '路径',
      dataIndex: 'url',
      scopedSlots: {
        customRender: 'url'
      },
      ellipsis: true,
      width: 300
    },
    {
      title: '请求类型',
      dataIndex: 'type',
      scopedSlots: {
        customRender: 'type'
      },
      ellipsis: true
    },
    {
      title: '权限标识',
      dataIndex: 'code',
      scopedSlots: {
        customRender: 'code'
      },
      ellipsis: true
    },
    {
      title: '是否拦截',
      dataIndex: 'isFilter',
      scopedSlots: {
        customRender: 'isFilter'
      },
      ellipsis: true
    },
    // {
    //   title: '类名',
    //   dataIndex: 'className',
    //   scopedSlots: {
    //     customRender: 'className'
    //   },
    //   ellipsis: true
    // },
    // {
    //   title: '方法名',
    //   dataIndex: 'method',
    //   scopedSlots: {
    //     customRender: 'method'
    //   },
    //   ellipsis: true
    // },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      scopedSlots: {
        customRender: 'createTime'
      },
      ellipsis: true,
      width: 160
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