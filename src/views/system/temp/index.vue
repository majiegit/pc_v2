<!--
声明： 当前vue文件 为开发模板文件, 包含增删改查
替换步骤：1、模板 -> 模块名
          2、Dict -> 模块名  eg: Temp
          3、dict -> 模块名  eg: temp
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
                <a-form-item label="模板名称">
                  <a-input v-model="dictQueryParam.dictName" placeholder="请输入模板名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="模板编码">
                  <a-input v-model="dictQueryParam.dictCode" placeholder="请输入模板编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-space>
                  <a-button type="primary" @click="queryDictDataByParam" icon="search">查询</a-button>
                  <a-button @click="resetDictQueryParam">重置</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>

      <!--操作按钮区域-->
      <a-col :span="24">
        <a-space>
          <a-button type="primary" icon="plus" @click="openDictModal">添加模板</a-button>
          <a-button @click="removeBatchDict" type="danger" icon="delete" v-if="selectedDataIds.length > 0">批量删除
          </a-button>
        </a-space>
      </a-col>


      <!--模板列表区域-->
      <a-col span="24">
        <a-table
          :key="dictData.length"
          align="center"
          row-key="dictId"
          :columns="dictTableColumns"
          :pagination="page"
          :data-source="dictData"
          :row-selection="{ selectedRowKeys: selectedDataIds, onChange: changeTableSelect }"
          @change="changeTablePage"
        >
            <span slot="dictType" slot-scope="dictType">
                <a-tag color="orange" v-if="dictType == 0">数组</a-tag>
                <a-tag color="green" v-if="dictType == 1">树形</a-tag>
            </span>
          <template slot="operation" slot-scope="text,record">
            <a-space>
              <a href="javascript:;" @click="updateDict(record)">编辑</a>
              <a href="javascript:;" style="color: red;">
                <a-popconfirm
                  title="确定要删除此模板吗?"
                  @confirm="() => removeDict(record)"
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
        @ok="saveDictModal"
        @cancel="cancelDictModal"
      >
        <a-form-model :model="dictForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon labelAlign="left"
                      ref="dictFormRef"
                      :rules="dictFormRules">
          <a-form-model-item label="模板名称" prop="dictName">
            <a-input v-model="dictForm.dictName"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-spin>
  </a-row>
</template>

<script>
  import {queryDictPage, queryDictFieldList, deleteDict, deleteDictBatch, saveDict} from '@/api/temp'

  export default {
    name: "dict",
    data() {
      return {
        dictData: [],
        selectedDataIds: [],
        loading: true,
        dictQueryParam: {},
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
        // 添加、修改时候Form表单
        dictForm: {},
        dictTableColumns:[],
        dictColumns: [],
        dictFormRules,
        // 弹出框相关参数
        modalTitle: '',
        modalVisible: false,
        modalConfirmLoading: false
      }
    },
    created() {
    },
    mounted() {
      this.getDictFieldList()
    },
    methods: {
      /**
       * 查询数据点击事件
       */
      queryDictDataByParam() {
        console.log(this.dictQueryParam)
        this.getDictData()
      },
      /**
       * 重置查询条件
       */
      resetDictQueryParam() {
        this.dictQueryParam = {}
      },
      /**
       * 查询数据
       */
      getDictData() {
        this.loading = true
        let param = {
          current: this.page.current,
          size: this.page.pageSize,
          groupId: this.dictGroupId,
          dictName: this.dictQueryParam.dictName,
          dictCode: this.dictQueryParam.dictCode,
        }
        Object.keys(param).forEach(item => {
          if (param[item] === null || param[item] === '' || param[item] === undefined) {
            delete param[item]
          }
        })
        queryDictPage(param).then(res => {
          this.loading = false
          this.dictData = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 取消模板窗口
       */
      cancelDictModal() {
        this.modalVisible = false
        this.$refs['dictFormRef'].clearValidate()
        this.dictForm = {}
      },
      /**
       * 保存模板
       */
      saveDictModal() {
        console.log(this.dictForm)
        this.$refs.dictFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            this.modalConfirmLoading = true
            saveDict(this.dictForm).then(res => {
              this.modalConfirmLoading = false
              this.$message.success(res.message)
              this.cancelDictModal()
              this.getDictData()
            },error => {
              this.modalConfirmLoading = false
            })
          }
        })
      },
      /**
       * 打开模板窗口
       */
      openDictModal() {
        this.modalVisible = true
        this.modalTitle = '添加模板'
      },
      /**
       * 修改模板
       */
      updateDict(row) {
        let form = JSON.parse(JSON.stringify(row))
        this.modalVisible = true
        this.modalTitle = '修改模板'
        this.dictForm = form
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
        this.getDictData()
      },
      /***
       * 批量删除
       */
      removeBatchDict() {
        this.loading = true
        deleteDictBatch(this.selectedDataIds).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getDictData()
        })
      },
      /**
       * 删除模板
       */
      removeDict(row) {
        this.loading = true
        deleteDict(row.dictId).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getDictData()
        })
      },
      /**
       * 查询用户显示字段
       */
      getDictFieldList() {
        queryDictFieldList().then(res => {
          this.dictColumns = res.data
          this.getTableDictColumns(res.data)
          this.getDictData()
        })
      },
      /**
       * 处理表格显示字段
       */
      getTableDictColumns(data) {
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
        this.dictTableColumns = arr
      }
    }
  }
  const dictFormRules = {
    dictName: [{required: true, message: '请输入模板名称', trigger: 'blur'}]
  }

  // const dictTableColumns = [
  //
  //   {
  //     title: '字典名称',
  //     dataIndex: 'dictName',
  //     scopedSlots: {
  //       customRender: 'dictName'
  //     },
  //     ellipsis: true
  //   },
  //   {
  //     title: '字典编码',
  //     dataIndex: 'dictCode',
  //     scopedSlots: {
  //       customRender: 'dictCode'
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
  //     dataIndex: 'dictGroupName',
  //     scopedSlots: {
  //       customRender: 'dictGroupName'
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