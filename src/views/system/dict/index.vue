<template>
  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-spin :spinning="loading">
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
                <a-empty v-if="dictGroupData.length < 1"/>
                <a-row v-for="(item,index) in dictGroupData" :key="index" class="dict_group_body_item">
                  <a-col span="20" @click="dictGroupClick(item)" style="overflow:scroll;word-wrap:break-word;">
                    <span :style="{'color': item.status ? '#1989fa': ''}">{{ item.dictGroupName }}</span>
                  </a-col>
                  <a-col span="2">
                    <a href="javascript:;">
                      <a-icon type="edit"
                              @click="editDictGroup(item)"/>
                    </a>
                  </a-col>
                  <a-col span="2">
                    <a-popconfirm title="是否确认删除此分组" @confirm="deleteDictGroup(item)">
                      <a href="javascript:;">
                        <a-icon type="delete"/>
                      </a>
                    </a-popconfirm>
                  </a-col>
                </a-row>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
      <a-col span="18" offset="1">
        <!--操作按钮区域-->
        <a-row type="flex" :gutter="[24,24]">
          <a-col :span="24">
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="48">
                  <a-col :md="6" :sm="24">
                    <a-form-item label="字典名称">
                      <a-input v-model="dictQueryParam.dictName" placeholder="请输入字典名称"/>
                    </a-form-item>
                  </a-col>
                  <a-col :md="6" :sm="24">
                    <a-form-item label="字典编码">
                      <a-input v-model="dictQueryParam.dictCode" placeholder="请输入字典编码"/>
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
          <a-col :span="24">
            <a-space>
              <a-button type="primary" icon="plus" @click="openDictModal">新增数据字典</a-button>
              <a-button @click="removeBatchDict" type="danger" icon="delete" v-if="selectedDataIds.length > 0">批量删除
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <!--数据字典列表区域-->
        <a-row type="flex" :gutter="[24,24]">
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
                    <a-tag color="orange" v-if="dictType == dictConstant.dict_type_array ">数组</a-tag>
                    <a-tag color="green" v-if="dictType == dictConstant.dict_type_tree">树形</a-tag>
                </span>
              <span slot="dictGroupName" slot-scope="dictGroupName">
                    <a-tag color="green" v-if="dictGroupName">{{dictGroupName}}</a-tag>
                </span>
              <template slot="operation" slot-scope="text,record">
                <a-space>
                  <a href="javascript:;" @click="updateDict(record)">编辑</a>
                  <a href="javascript:;" @click="configDict(record)">字典配置</a>
                  <a href="javascript:;"  style="color: red;">
                    <a-popconfirm
                      title="确认删除此数据字典吗?"
                      @confirm="() => removeDict(record)"
                    >删除
                    </a-popconfirm>
                  </a>
                </a-space>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-col>


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
                        ref="dictFormRef"
                        :rules="dictFormRules">
            <a-form-model-item label="字典名称" prop="dictName">
              <a-input v-model="dictForm.dictName" placeholder="请输入字典名称"/>
            </a-form-model-item>
            <a-form-model-item label="字典编码" prop="dictCode">
              <a-input v-model="dictForm.dictCode" placeholder="请输入字典编码" :disabled="dictForm.id ? true : false"/>
            </a-form-model-item>
            <a-form-model-item label="字典类型" prop="dictType">
              <a-select v-model="dictForm.dictType" :options="dictTypeData" placeholder="请选择字典类型"/>
            </a-form-model-item>
            <a-form-model-item label="字典分组" prop="dictGroupId">
              <a-select v-model="dictForm.dictGroupId" placeholder="请选择字典分组">
                <a-select-option v-for="(item,index) in dictGroupData" :key="index" :value="item.id">
                  {{item.dictGroupName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="字典描述" prop="description">
              <a-textarea v-model="dictForm.description" placeholder="请输入字典描述"/>
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
          <a-form-model :model="dictGroupForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" colon
                        ref="dictFormGroupRef"
                        labelAlign="right"
                        :rules="dictGroupFormRules">
            <a-form-model-item label="字典分组名称" prop="dictGroupName">
              <a-input v-model="dictGroupForm.dictGroupName" placeholder="请输入字典描述"/>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </div>
      <!--数据字典明细配置窗口-->
      <div>
        <a-drawer
          title="字典列表"
          placement="right"
          width="750"
          :visible="dictItemVisible"
          @close="dictItemClose"
        >
          <DictItem :dict="dictEdit"></DictItem>
        </a-drawer>
      </div>
    </a-spin>
  </a-row>
</template>

<script>
  import {queryDictPage, deleteDict, deleteDictBatch, saveDict} from '@/api/dict'
  import {queryDictGroupList, saveDictGroup, deleteDictGroup, queryDictGroupListByGroupName} from '@/api/dictGroup'
  import {DictConstant} from '@/utils/system/dictConstant'
  import DictItem from './dictItem'
  import ACol from "ant-design-vue/es/grid/Col";
  import AFormModelItem from "ant-design-vue/es/form-model/FormItem";

  export default {
    name: "dict",
    components: {AFormModelItem, ACol, DictItem},
    data() {
      return {
        dictConstant: DictConstant,
        // 字典明细
        dictItemVisible: false,
        dictEdit: {},
        // 字典类型
        dictTypeData: [
          {
            value: DictConstant.dict_type_array,
            title: '数组'
          },
          {
            value: DictConstant.dict_type_tree,
            title: '树形'
          }
        ],
        // 字典分组数据
        dictGroupId: '',
        dictGroupForm: {
          dictGroupName: ''
        },
        dictGroupFormRules,
        dictGroupModelTitle: '添加数据字典分组',
        dictGroupVisible: false,
        dictGroupData: [],
        // 字典数据
        dictData: [],
        dictQueryParam: {},
        dictTableColumns,
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
        dictForm: {
          dictType: DictConstant.dict_type_array,
        },
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
      this.getDictGroupList()
      this.getDictData()
    },
    methods: {
      /**
       * 查询数据点击事件
       */
      queryDictDataByParam(){
        console.log(this.dictQueryParam)
        this.getDictData()
      },
      /**
       * 重置查询条件
       */
      resetDictQueryParam(){
        this.dictQueryParam = {}
      },
      /**
       * 数据字典明细窗口关闭方法
       **/
      dictItemClose() {
        this.dictItemVisible = false
      },
      /**
       * 数据字典明细配置
       */
      configDict(item) {
        this.dictItemVisible = true
        this.dictEdit = JSON.parse(JSON.stringify(item))
      },
      /**
       * 取消数据字典分组窗口
       */
      cancelDictGroupModal() {
        this.dictGroupVisible = false
        this.$refs['dictFormGroupRef'].clearValidate()
        this.dictGroupForm = {
          dictGroupName: ''
        }
      },
      /**
       * 保存数据字典分组
       */
      saveDictGroupModal() {
        this.$refs.dictFormGroupRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            this.modalConfirmLoading = true
            saveDictGroup(this.dictGroupForm).then(res => {
              this.modalConfirmLoading = false
              this.$message.success(res.message)
              this.cancelDictGroupModal()
              this.getDictGroupList()
            })
          }
        })
      },
      /**
       * 点击数据字典分组事件
       */
      dictGroupClick(item) {
        this.dictGroupData.forEach(row => {
          this.$set(row, 'status', false)
        })
        item.status = true
        this.dictGroupId = item.id
        this.dictForm.dictGroupId = item.id
        this.getDictData()
      },
      /**
       * 修改数据字典分组
       */
      editDictGroup(item) {
        this.dictGroupVisible = true
        this.dictGroupForm = JSON.parse(JSON.stringify(item))
      },
      /**
       * 删除数据字典分组
       * */
      deleteDictGroup(item) {
        deleteDictGroup(item.id).then(res => {
          this.$message.success(res.message)
          this.dictGroupId = null
          this.dictForm.dictGroupId = null
          this.getDictGroupList()
          this.getDictData()
        })
      },
      /**
       * 新增数据字典分组窗口
       */
      addDictGroup() {
        this.dictGroupVisible = true
        this.dictGroupForm = {
          groupName: ''
        }
      },
      /**
       * 搜索数据字典分组
       */
      searchDictGroup(val) {
        queryDictGroupListByGroupName(val).then(res => {
          this.dictGroupData = res.data
        })
      },
      /**
       * 查询数数据字典分组数据
       *
       */
      getDictGroupList() {
        queryDictGroupList().then(res => {
          this.dictGroupData = res.data
        })
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
       * 取消数据字典窗口
       */
      cancelDictModal() {
        this.modalVisible = false
        this.$refs['dictFormRef'].clearValidate()
        this.dictForm = {
          dictType: 0,
          dictGroupId: this.dictGroupId
        }
      },
      /**
       * 保存数据字典
       */
      saveDictModal() {
        console.log(this.dictForm)
        // 校验表单
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
            })
          }
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
        this.loading = true
        deleteDictBatch(this.selectedDataIds).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getDictData()
        })
      },
      /**
       * 删除数据字典
       */
      removeDict(row) {
        this.loading = true
        deleteDict(row.id).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getDictData()
        })
      }
    },
  }

  const dictFormRules = {
    dictGroupId: [{required: false, message: '请选择数据字典分组', trigger: 'blur'}],
    dictType: [{required: true, message: '请选择数据字典类型', trigger: 'blur'}],
    dictName: [{required: true, message: '请输入数据字典名称', whitespace: true, trigger: 'blur'}],
    dictCode: [{required: true, message: '请输入数据字典编码', whitespace: true, trigger: 'blur'}]
  }
  const dictGroupFormRules = {
    dictGroupName: [{required: true, message: '请输入数据字典分组名称', whitespace: true, trigger: 'blur'}]
  }
  const dictTableColumns = [

    {
      title: '字典名称',
      dataIndex: 'dictName',
      scopedSlots: {
        customRender: 'dictName'
      },
      ellipsis: true
    },
    {
      title: '字典编码',
      dataIndex: 'dictCode',
      scopedSlots: {
        customRender: 'dictCode'
      },
      ellipsis: true
    },
    {
      title: '字典描述',
      dataIndex: 'description',
      scopedSlots: {
        customRender: 'description'
      },
      ellipsis: true
    },
    {
      title: '字典分组',
      dataIndex: 'dictGroupName',
      scopedSlots: {
        customRender: 'dictGroupName'
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

  .row_div {
    padding-bottom: 5px;
  }

  .dict_group_body {
    max-height: 565px;
    overflow-y: auto;
  }

  .dict_group_body_item {
    border-bottom: 1px solid #e8e8e8;
    line-height: 40px;
    cursor: pointer;
  }

</style>