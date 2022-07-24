<template>
  <a-spin :spinning="loading">
    <div class="body">
      <a-row type="flex">
        <!-- 数据字典分组-->
        <a-col span="5">
          <a-row class="row_div">
            <a-col span="24">
              <a-input-search placeholder="输入数据字典分组名" @search="searchDictGroup"/>
            </a-col>
          </a-row>
          <a-row class="row_div">
            <a-col span="24">
              <a-card title="字典分组">
                <a-button type="primary" slot="extra" icon="plus" @click="addDictGroup"/>
                <div class="dict_group_body">
                  <p v-for="(item,index) in dictGroupData" :key="index">{{ item.dictGroupName }}</p>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-col>
        <a-col span="18" offset="1">
          <!--操作按钮区域-->
          <a-row>
            <a-col :span="24" class="header">
              <a-space>
                <a-button type="primary" icon="plus" @click="openDictModal">新增数据字典</a-button>
                <a-button @click="removeBatchDict" type="danger" icon="delete" v-if="selectedDataIds.length > 0">批量删除
                </a-button>
              </a-space>
            </a-col>
          </a-row>
          <!--数据字典列表区域-->
          <a-row>
            <a-col span="24">
              <a-table
                align="center"
                row-key="id"
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
                  <a href="javascript:;" class="operation" @click="updateDict(record)">编辑</a>
                  <a href="javascript:;" class="operation" @click="updateDict(record)">字典配置</a>
                  <a href="javascript:;" class="operation" style="color: red;">
                    <a-popconfirm
                      title="确定要删除此数据字典吗?"
                      @confirm="() => removeDict(record)"
                    >删除
                    </a-popconfirm>
                  </a>
                </template>
              </a-table>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <!-- 添加、修改数据字典窗口-->
    <div>
      <a-modal
        :title="modalTitle"
        :visible="modalVisible"
        :confirm-loading="modalConfirmLoading"
        @ok="saveDictModal"
        @cancel="cancelDictModal"
      >
        <a-form-model :model="dictForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon labelAlign="right"
                      :rules="dictFormRules">
          <a-form-model-item label="字典名称" prop="dictName">
            <a-input v-model="dictForm.dictName"/>
          </a-form-model-item>
          <a-form-model-item label="字典编码" prop="dictCode">
            <a-input v-model="dictForm.dictCode"/>
          </a-form-model-item>
          <a-form-model-item label="字典描述" prop="description">
            <a-textarea v-model="dictForm.description"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 添加、修改 数据字典分组窗口-->
      <a-modal
        :title="dictGroupModelTitle"
        :visible="dictGroupVisible"
        :confirm-loading="modalConfirmLoading"
        @ok="saveDictGroupModal"
        @cancel="cancelDictGroupModal"
      >
        <a-form-model :model="dictGroupForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon labelAlign="right"
                      :rules="dictGroupFormRules">
          <a-form-model-item label="字典分组名称" prop="dictGroupName">
            <a-input v-model="dictGroupForm.dictGroupName"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </a-spin>
</template>

<script>
  import {queryDictPage, deleteDict, deleteDictBatch, queryFieldList, saveDict} from '@/api/dict'
  import {queryDictGroupList} from '@/api/dictGroup'
  import ACol from "ant-design-vue/es/grid/Col";

  export default {
    name: "dict",
    components: {ACol},
    data() {
      return {
        // 字典分组数据
        dictGroupForm: {
          dictGroupName: ''
        },
        dictGroupFormRules,
        dictGroupModelTitle: '添加数据字典分组',
        dictGroupVisible: false,
        dictGroupData: [],
        // 字典数据
        dictData: [],
        dictColumns: [],
        dictTableColumns: [],
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
        dictForm: {},
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
      this.getFieldList()
      this.getDictGroupList()
    },
    methods: {
      /**
       * 取消数据字典窗口
       */
      cancelDictGroupModal() {
        this.dictGroupVisible = false
        this.dictGroupForm = {}
      },
      /**
       * 保存数据字典
       */
      saveDictGroupModal() {
        saveDict(this.dictGroupForm).then(res => {
          this.$message.success(res.message)
          this.cancelDictGroupModal()
          this.getDictGroupList()
        })
      },
      /**
       * 新增数据字典分组
       */
      addDictGroup(){
        this.dictGroupVisible = true
        this.dictGroupForm = {
          groupName: ''
        }
      },
      /**
       * 搜索数据字典分组
       */
      searchDictGroup(val) {
        console.log(val)
      },
      /**
       * 查询数数据字典分组数据
       *
       */
      getDictGroupList() {
        queryDictGroupList().then(res => {
          this.dictGroupData = res.data
          console.log(res)
        })
      },
      /**
       * 查询用户显示字段
       */
      getFieldList() {
        queryFieldList().then(res => {
          this.dictColumns = res.data
          this.getDictData()
        })
      },
      /**
       * 查询数据
       */
      getDictData() {
        this.loading = true
        queryDictPage(this.page.current, this.page.pageSize).then(res => {
          this.getTableColumns()
          this.loading = false
          this.dictData = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 取消数据字典窗口
       */
      cancelDictModal() {
        this.modalVisible = false
        this.dictForm = {}
      },
      /**
       * 保存数据字典
       */
      saveDictModal() {
        saveDict(this.dictForm).then(res => {
          this.$message.success(res.message)
          this.cancelDictModal()
          this.getDictData()
        })
      },
      /**
       * 打开数据字典窗口
       */
      openDictModal() {
        this.modalVisible = true
        this.modalTitle = '添加数据字典'
      },
      /**
       * 修改数据字典
       */
      updateDict(row) {
        let form = JSON.parse(JSON.stringify(row))
        this.modalVisible = true
        this.modalTitle = '修改数据字典'
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
        deleteDictBatch(this.selectedDataIds).then(res => {
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getDictData()
        })
      },
      /**
       * 删除数据字典
       */
      removeDict(row) {
        deleteDict(row.id).then(res => {
          this.$message.success(res.message)
          this.getDictData()
        })
      },

      /**
       * 处理表格显示字段
       */
      getTableColumns() {
        // 排除显示字段
        let columnsFilters = ['id', 'dictGroupId', 'createUser', 'updateUser', 'updateTime']
        let arr = []
        this.dictColumns.forEach(field => {
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
        this.dictTableColumns = arr
      }
    },
  }
  const dictFormRules = {
    dictName: [{required: true, message: '请输入数据字典名称', trigger: 'blur'}],
    dictCode: [{required: true, message: '请输入数据字典编码', trigger: 'blur'}]
  }
  const dictGroupFormRules = {
    dictGroupName: [{required: true, message: '请输入数据字典分组名称', trigger: 'blur'}]
  }
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

  .operation {
    margin-left: 5px;
  }

  .row_div {
    padding-bottom: 5px;
  }

  .dict_group_body {
    max-height: 560px;
    overflow-y: auto;
  }
</style>