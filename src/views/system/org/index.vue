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
                  <a-input v-model="orgQueryParam.name" placeholder="请输入组织名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="组织编码">
                  <a-input v-model="orgQueryParam.code" placeholder="请输入组织编码"/>
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
        </a-space>
      </a-col>


      <!--组织列表区域-->
      <a-col span="24">
        <a-table
          :key="orgData.length"
          align="center"
          row-key="id"
          :columns="orgTableColumns"
          :defaultExpandAllRows="true"
          :pagination="page"
          :data-source="orgData"
          @change="changeTablePage"
        >
          <span slot="status" slot-scope="status">
             <a-badge status="success" v-if="status == 1" text="启用"/>
             <a-badge status="error" v-if="status == 2" text="停用"/>
          </span>
          <template slot="operation" slot-scope="text,record">
            <a-space>
              <a href="javascript:;" @click="addOrgClick(record)">添加</a>
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
          <a-form-model-item label="上级组织" prop="pid">
            <a-tree-select
              v-model="orgForm.pid"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
              placeholder="请选择上级组织"
              tree-default-expand-all
              :replaceFields="{children: 'children', title: 'name', key: 'id', value: 'id'}"
              :tree-data="orgData"/>
          </a-form-model-item>
          <a-form-model-item label="组织名称" prop="name">
            <a-input v-model="orgForm.name"/>
          </a-form-model-item>
          <a-form-model-item label="组织编码" prop="code">
            <a-input v-model="orgForm.code"/>
          </a-form-model-item>
          <a-form-model-item label="组织地址" prop="address">
            <a-input v-model="orgForm.address"/>
          </a-form-model-item>
          <a-form-model-item label="负责人" prop="principal">
            <a-input v-model="orgForm.principal"/>
          </a-form-model-item>
          <a-form-model-item label="电话" prop="tel">
            <a-input v-model="orgForm.tel"/>
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status">
            <a-radio-group v-model="orgForm.status" defaultValue="1">
              <a-radio :value="1">启用</a-radio>
              <a-radio :value="2">停用</a-radio>
            </a-radio-group>
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
        orgTableColumns,
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
      this.getOrgData()
    },
    methods: {
      addOrgClick(row){
        this.orgForm.pid = row.id
        this.modalVisible = true
      },
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
          name: this.orgQueryParam.name,
          code: this.orgQueryParam.code,
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
            }, error => {
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
       * 分页改变事件
       */
      changeTablePage(val) {
        this.page.current = val.current
        this.page.pageSize = val.pageSize
        this.getOrgData()
      },
      /**
       * 删除组织
       */
      removeOrg(row) {
        this.loading = true
        deleteOrg(row.id).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getOrgData()
        })
      },
      // /**
      //  * 查询用户显示字段
      //  */
      // getOrgFieldList() {
      //   queryOrgFieldList().then(res => {
      //     this.orgColumns = res.data
      //     this.getTableOrgColumns(res.data)
      //     this.getOrgData()
      //   })
      // },
      // /**
      //  * 处理表格显示字段
      //  */
      // getTableOrgColumns(data) {
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
      //   this.orgTableColumns = arr
      // }
    }
  }

  const orgFormRules = {
    name: [{required: true, message: '请输入组织名称', trigger: 'blur'}],
    code: [{required: true, message: '请输入组织编码', trigger: 'blur'}],
    tel: [{required: true, message: '请输入组织联系电话', trigger: 'blur'}],
    status: [{required: true, message: '请选择组织状态', trigger: 'blur'}],
    address: [{required: true, message: '请输入组织地址', trigger: 'blur'}]
  }

  const orgTableColumns = [

    {
      title: '组织名称',
      dataIndex: 'name',
      scopedSlots: {
        customRender: 'name'
      },
      ellipsis: true
    },
    {
      title: '组织编码',
      dataIndex: 'code',
      scopedSlots: {
        customRender: 'code'
      },
      ellipsis: true
    },
    {
      title: '负责人',
      dataIndex: 'principal',
      scopedSlots: {
        customRender: 'principal'
      },
      ellipsis: true
    },
    {
      title: '联系电话',
      dataIndex: 'tel',
      scopedSlots: {
        customRender: 'tel'
      },
      ellipsis: true
    },
    {
      title: '组织地址',
      dataIndex: 'address',
      scopedSlots: {
        customRender: 'address'
      },
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      scopedSlots: {
        customRender: 'status'
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