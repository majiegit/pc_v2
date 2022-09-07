<!--
声明： 当前vue文件 为开发职级文件, 包含增删改查
替换步骤：1、职级 -> 模块名
          2、Rank -> 模块名  eg: Temp
          3、rank -> 模块名  eg: temp
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
                  <a-input v-model="rankQueryParam.rankName" placeholder="请输入职级名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="职级编码">
                  <a-input v-model="rankQueryParam.rankCode" placeholder="请输入职级编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-space>
                  <a-button type="primary" @click="queryRankDataByParam" icon="search">查询</a-button>
                  <a-button @click="resetRankQueryParam">重置</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>

      <!--操作按钮区域-->
      <a-col :span="24">
        <a-space>
          <a-button type="primary" icon="plus" @click="openRankModal">新增职级</a-button>
          <a-button @click="removeBatchRank" type="danger" icon="delete" v-if="selectedDataIds.length > 0">批量删除
          </a-button>
        </a-space>
      </a-col>


      <!--职级列表区域-->
      <a-col span="24">
        <a-table
          align="center"
          row-key="rankId"
          :columns="rankTableColumns"
          :pagination="page"
          :data-source="rankData"
          :row-selection="{ selectedRowKeys: selectedDataIds, onChange: changeTableSelect }"
          @change="changeTablePage"
        >
          <!--状态-->
          <template slot="status" slot-scope="status">
            <a-badge status="success" v-if="status == 1" text="启用"/>
            <a-badge status="error" v-if="status == 0" text="禁用"/>
          </template>
          <!--操作-->
          <template slot="operation" slot-scope="text,record">
            <a-space>
              <a href="javascript:;" @click="updateRank(record)">编辑</a>
              <a href="javascript:;" style="color: red;">
                <a-popconfirm
                  title="确定要删除此职级吗?"
                  @confirm="() => removeRank(record)"
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
        @ok="saveRankModal"
        @cancel="cancelRankModal"
      >
        <a-form-model :model="rankForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon labelAlign="right"
                      ref="rankFormRef"
                      :rules="rankFormRules">
          <a-form-model-item label="职级名称" prop="rankName">
            <a-input v-model="rankForm.rankName"/>
          </a-form-model-item>
          <a-form-model-item label="职级编码" prop="rankCode">
            <a-input v-model="rankForm.rankCode"/>
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status">
            <a-radio-group v-model="rankForm.status" :options="EnableDisableOptions"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-spin>
  </a-row>
</template>

<script>
  import {queryRankPage, queryRankFieldList, deleteRank, deleteRankBatch, saveRank} from '@/api/rank'
  import {EnableDisableOptions} from '@/utils/staticDataUtils'

  export default {
    name: "rank",
    data() {
      return {
        rankData: [],
        selectedDataIds: [],
        loading: true,
        rankQueryParam: {},
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
        rankForm: {
          status: 1,
        },
        rankTableColumns,
        rankColumns: [],
        rankFormRules,
        EnableDisableOptions,
        // 弹出框相关参数
        modalTitle: '',
        modalVisible: false,
        modalConfirmLoading: false
      }
    },
    created() {
    },
    mounted() {
      this.getRankData()
    },
    methods: {
      /**
       * 查询数据点击事件
       */
      queryRankDataByParam() {
        console.log(this.rankQueryParam)
        this.getRankData()
      },
      /**
       * 重置查询条件
       */
      resetRankQueryParam() {
        this.rankQueryParam = {}
      },
      /**
       * 查询数据
       */
      getRankData() {
        this.loading = true
        let param = {
          current: this.page.current,
          size: this.page.pageSize,
          rankName: this.rankQueryParam.rankName,
          rankCode: this.rankQueryParam.rankCode,
        }
        Object.keys(param).forEach(item => {
          if (param[item] === null || param[item] === '' || param[item] === undefined) {
            delete param[item]
          }
        })
        queryRankPage(param).then(res => {
          this.loading = false
          this.rankData = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 取消职级窗口
       */
      cancelRankModal() {
        this.modalVisible = false
        this.$refs['rankFormRef'].clearValidate()
        this.rankForm = {
          status: 1
        }
      },
      /**
       * 保存职级
       */
      saveRankModal() {
        console.log(this.rankForm)
        this.$refs.rankFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            this.modalConfirmLoading = true
            saveRank(this.rankForm).then(res => {
              this.modalConfirmLoading = false
              this.$message.success(res.message)
              this.cancelRankModal()
              this.getRankData()
            }).catch(res => {
              this.modalConfirmLoading = false
            })
          }
        })
      },
      /**
       * 打开职级窗口
       */
      openRankModal() {
        this.modalVisible = true
        this.modalTitle = '添加职级'
      },
      /**
       * 修改职级
       */
      updateRank(row) {
        let form = JSON.parse(JSON.stringify(row))
        this.modalVisible = true
        this.modalTitle = '修改职级'
        this.rankForm = form
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
        this.getRankData()
      },
      /***
       * 批量删除
       */
      removeBatchRank() {
        this.loading = true
        deleteRankBatch(this.selectedDataIds).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getRankData()
        })
      },
      /**
       * 删除职级
       */
      removeRank(row) {
        this.loading = true
        deleteRank(row.rankId).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getRankData()
        })
      }
    }
  }
  const rankFormRules = {
    rankName: [{required: true, message: '请输入职级名称', trigger: 'blur'}],
    rankCode: [{required: true, message: '请输入职级编码', trigger: 'blur'}]
  }

  const rankTableColumns = [

    {
      title: '职级名称',
      dataIndex: 'rankName',
      align: 'center',
      scopedSlots: {
        customRender: 'rankName'
      },
      ellipsis: true
    },
    {
      title: '职级编码',
      dataIndex: 'rankCode',
      align: 'center',
      scopedSlots: {
        customRender: 'rankCode'
      },
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      scopedSlots: {
        customRender: 'status'
      },
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      scopedSlots: {
        customRender: 'createTime'
      },
      ellipsis: true
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      scopedSlots: {
        customRender: 'updateTime'
      },
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      scopedSlots: {customRender: 'operation'}
    }
  ]
</script>

<style scoped>
</style>