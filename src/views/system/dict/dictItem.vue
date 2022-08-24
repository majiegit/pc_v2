<template>
  <div class="item_body">
    <div>
      <a-space>
        <a-input v-model="dictItemQuery.name" placeholder="请输入名称"/>
        <a-select v-model="dictItemQuery.status" placeholder="请选择状态" style="min-width: 150px;" :options="dictItemStatusData"/>
        <a-button type="primary" icon="search" @click="searchDictItemData">搜 索</a-button>
        <a-button type="primary" @click="resetDictItemQuery">重 置</a-button>
        <a-button type="primary" @click="addDictItem">新 增</a-button>
      </a-space>
    </div>
    <div style="margin-top: 10px;">
      <a-table
        align="center"
        row-key="id"
        :columns="dictItemTableColumns"
        :loading="dictItemTableLoading"
        :data-source="dictItemData"
      >
              <span slot="status" slot-scope="status">
                  <a-tag color="green" v-if="status == dictConstant.dict_status_enable">启用</a-tag>
                  <a-tag color="orange" v-if="status == dictConstant.dict_status_disabled">禁用</a-tag>
              </span>
        <template slot="operation" slot-scope="text,record">
          <a-space>
            <!-- 树形结构才有添加-->
            <a href="javascript:;" v-if="dict.dictType == dictConstant.dict_type_tree"
               @click="addDictItem(record)">添加</a>
            <a href="javascript:;" @click="updateDictItem(record)">编辑</a>
            <a href="javascript:;"  style="color: red;">
              <a-popconfirm
                title="确认删除此数据吗?"
                @confirm="() => removeDictItem(record)"
              >删除
              </a-popconfirm>
            </a>
          </a-space>
        </template>
      </a-table>
    </div>
    <div>
      <a-modal
        :title="dictItemModelTitle"
        :visible="dictItemVisible"
        :confirm-loading="modalConfirmLoading"
        @ok="saveDictItemModal"
        @cancel="cancelDictItemModal"
      >
        <a-form-model :model="dictItemForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" colon
                      ref="dictItemFormRef"
                      labelAlign="right"
                      :rules="dictItemFormRules">
          <a-form-model-item label="名称" prop="title">
            <a-input v-model="dictItemForm.title" placeholder="请输入名称"/>
          </a-form-model-item>
          <a-form-model-item label="数据值" prop="value">
            <a-input v-model="dictItemForm.value" placeholder="请输入数据值"/>
          </a-form-model-item>
          <a-form-model-item label="父级" prop="dictItemPid" v-if="dict.dictType == dictConstant.dict_type_tree">
            <a-tree-select
              v-model="dictItemForm.dictItemPid"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择上级"
              tree-default-expand-all
              :replaceFields="replaceFields"
              :tree-data="dictItemData"/>
          </a-form-model-item>
          <a-form-model-item label="描述" prop="description">
            <a-textarea v-model="dictItemForm.description" placeholder="请输入描述"/>
          </a-form-model-item>
          <a-form-model-item label="排序值" prop="sortOrder">
            <a-input v-model="dictItemForm.sortOrder" type="number" placeholder="请输入排序值"/>
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status">
            <a-switch :checked="dictItemStatus"
                      @change="changeDictItemStatus"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
  import {queryDictItemList, deleteDictItem, saveDictItem, queryDictItemListByName} from '@/api/dictItem'
  import {DictConstant} from '@/utils/system/dictConstant'
  import Option from "ant-design-vue/es/vc-mentions/src/Option";

  export default {
    name: "dictItem",
    components: {Option},
    data() {
      return {
        replaceFields: {
          children: 'children',
          title: 'title',
          key: 'id',
          value: 'id'
        },
        dictConstant: DictConstant,
        // 编辑数据字典窗口
        dictItemStatus: true,
        dictItemModelTitle: '',
        dictItemVisible: false,
        modalConfirmLoading: false,
        dictItemForm: {
          title: '',
          value: '',
          status: 1,
          dictItemPid: null
        },
        dictItemFormRules,
        // 数据字典列表
        dictItemTableColumns,
        dictItemData: [],
        dictItemTableLoading: false,
        dictItemQuery: {},
        dictItemStatusData: [
          {
            value: DictConstant.dict_status_enable,
            title: '启用'
          },
          {
            value: DictConstant.dict_status_disabled,
            title: '禁用'
          }
        ]
      }
    },
    props: {
      // 字典
      dict: {
        type: Object,
        default: null
      }
    },
    created() {
      this.queryDictItemData(this.dict.id, null)
    },
    watch: {
      dict(val) {
        if (val) {
          this.queryDictItemData(val.id, null)
          this.dictItemQuery = {}
        }
      }
    },
    methods: {
      /**
       * 搜索
       **/
      searchDictItemData() {
        console.log(this.dictItemQuery.status)
        if (this.dictItemQuery.status != undefined || this.dictItemQuery.name != undefined) {
          this.dictItemTableLoading = true
          queryDictItemListByName(this.dict.id, this.dictItemQuery.status, this.dictItemQuery.name).then(res => {
            this.dictItemTableLoading = false
            this.dictItemData = res.data
          })
        } else {
          this.queryDictItemData(this.dict.id, null)
        }
      },
      /**
       * 重置查询条件
       **/
      resetDictItemQuery() {
        this.dictItemQuery = {}
      },
      /**
       * 字典添加
       */
      addDictItem(row) {
        this.dictItemVisible = true
        this.dictItemForm.dictId = this.dict.id
        this.dictItemStatus = true
        // 字典树形数据添加处理
        if (this.dict.dictType == DictConstant.dict_type_tree) {
          this.dictItemForm.dictItemPid = null
          if (row) {
            this.dictItemForm.dictItemPid = row.id
          }
        }
        console.log(row)
        console.log(this.dictItemForm)
      },
      /**
       * 字典状态改变事件
       */
      changeDictItemStatus(val) {
        this.dictItemStatus = val
        val ? this.dictItemForm.status = DictConstant.dict_status_enable : this.dictItemForm.status = DictConstant.dict_status_disabled
      },
      /**
       * 添加数据字典值
       */
      saveDictItemModal() {
        // 校验表单
        this.$refs.dictItemFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            this.modalConfirmLoading = true
            saveDictItem(this.dictItemForm).then(res => {
              this.modalConfirmLoading = false
              this.$message.success(res.message)
              this.cancelDictItemModal()
              this.queryDictItemData(this.dict.id, null)
            })
          }
        })
      },
      /**
       * 取消数据字典值
       * */
      cancelDictItemModal() {
        this.dictItemVisible = false
        this.dictItemForm = {
          title: '',
          value: '',
          status: 1,
          dictItemPid: null
        }
        this.$refs['dictItemFormRef'].clearValidate()
      },
      /**
       * 数据字典明细单条数据删除
       */
      updateDictItem(row) {
        this.dictItemModelTitle = '编辑'
        this.dictItemVisible = true
        this.dictItemForm = JSON.parse(JSON.stringify(row))
        this.dictItemForm.status == DictConstant.dict_status_enable ? this.dictItemStatus = true : this.dictItemStatus = false
      },
      /**
       * 数据字典明细单条数据删除
       */
      removeDictItem(row) {
        deleteDictItem(row.id).then(res => {
          this.$message.success(res.message)
          this.queryDictItemData(this.dict.id, null)
        })
      },
      /**
       * 查询字典数据明细集合
       * */
      queryDictItemData(id, status) {
        this.dictItemTableLoading = true
        queryDictItemList(id, status).then(res => {
          this.dictItemTableLoading = false
          this.dictItemData = res.data
        })
      },
    }
  }

  const dictItemFormRules = {
    dictItemPid: [{required: false, message: '请选择父级', trigger: 'blur'}],
    title: [{required: true, message: '请输入名称', whitespace: true, trigger: 'blur'}],
    value: [{required: true, message: '请输入数据值', whitespace: true, trigger: 'blur'}]
  }

  const dictItemTableColumns = [
    {
      title: '名称',
      dataIndex: 'title',
      scopedSlots: {customRender: 'title'}
    },
    {
      title: '数据值',
      dataIndex: 'value',
      scopedSlots: {customRender: 'value'}
    },
    {
      title: '状态',
      dataIndex: 'status',
      scopedSlots: {customRender: 'status'}
    },
    {
      title: '描述',
      dataIndex: 'description',
      scopedSlots: {customRender: 'description'}
    },
    {
      title: '排序值',
      dataIndex: 'sortOrder',
      scopedSlots: {customRender: 'sortOrder'}
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'}
    }
  ]
</script>

<style scoped>

  .item_body {
    padding: 10px;
    border: 1px solid #e8e8e8;
  }
</style>