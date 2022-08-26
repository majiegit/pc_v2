<template>

  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-col :md="12" :sm="24">
      <!--加载中-->
      <a-spin :spinning="deptDataLoading">
        <!--操作按钮区域-->
        <a-col :span="24" style="padding-top: 0px;">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="部门名称">
                    <a-input v-model="deptQueryParam.name" placeholder="请输入部门名称"/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="部门编码">
                    <a-input v-model="deptQueryParam.code" placeholder="请输入部门编码"/>
                  </a-form-item>
                </a-col>
                <a-col :md="5" :sm="24">
                  <a-space>
                    <a-button type="primary" @click="queryDeptDataByParam" icon="search">查询</a-button>
                    <a-button @click="resetDeptQueryParam" icon="redo">重置</a-button>
                  </a-space>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-col>
        <!--操作按钮区域-->
        <a-col :span="24">
          <a-space>
            <a-button type="primary" icon="plus" @click="addDeptForm">添加部门</a-button>
            <a-button type="danger" icon="delete" v-if="checkedDeptIds.length > 0">批量删除</a-button>
          </a-space>
        </a-col>
        <!--分割线-->
        <a-divider/>
        <!--部门列表区域-->
        <a-col :span="24">
          <a-tree
            @select="clickDeptData"
            v-model="checkedDeptIds"
            checkable
            :replaceFields="{title: 'name',key: 'id', children: 'children' }"
            :tree-data="deptData"
          />
          <a-divider/>
          <a-dropdown placement="topCenter">
            <a-button>树 操 作
              <a-icon type="up"/>
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item>全部勾选</a-menu-item>
              <a-menu-item>取消全选</a-menu-item>
              <a-menu-item>展开所有</a-menu-item>
              <a-menu-item>合并所有</a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-col>
      </a-spin>
    </a-col>
    <a-col :md="12" :sm="24">
      <a-tabs :activeKey="defaultActiveKey" @change="changeTab">
        <a-tab-pane :key="tab.key" :tab="tab.title" v-for="tab in tabList">
          <a-row type="flex" justify="center">
            <a-col :span="22">
              <a-form-model :model="deptForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon
                            labelAlign="left"
                            ref="deptFormRef"
                            :rules="deptFormRules">
                <a-form-model-item label="上级部门" prop="pid">
                  <a-tree-select
                    v-model="deptForm.pid"
                    show-search
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
                    placeholder="请选择上级部门"
                    tree-default-expand-all
                    :replaceFields="{children: 'children', title: 'name', key: 'id', value: 'id'}"
                    :tree-data="deptData"/>
                </a-form-model-item>
                <a-form-model-item label="部门名称" prop="name">
                  <a-input v-model="deptForm.name"/>
                </a-form-model-item>
                <a-form-model-item label="部门编码" prop="code">
                  <a-input v-model="deptForm.code"/>
                </a-form-model-item>
                <a-form-model-item label="部门类型" prop="type">
                  <a-select v-model="deptForm.type" :options="deptTypeData" placeholder="请选择部门类型"/>
                </a-form-model-item>
                <a-form-model-item label="地址" prop="address">
                  <a-input v-model="deptForm.address"/>
                </a-form-model-item>
                <a-form-model-item label="负责人" prop="principal">
                  <a-row type="flex" justify="space-around" align="middle">
                    <a-col span="18">
                      <a-select mode="tags" placeholder="请选择负责人" :default-value="principalData"/>
                    </a-col>
                    <a-col span="6" align="end">
                      <a-button type="primary" @click="selectPrincipal(deptForm.principal)">选择</a-button>
                    </a-col>
                  </a-row>
                </a-form-model-item>
                <a-form-model-item label="电话" prop="tel">
                  <a-input v-model="deptForm.tel"/>
                </a-form-model-item>
                <a-form-model-item label="排序" prop="orderNo">
                  <a-input type="number" v-model="deptForm.orderNo"/>
                </a-form-model-item>
                <a-form-model-item label="状态" prop="status">
                  <a-radio-group v-model="deptForm.status" defaultValue="1">
                    <a-radio :value="1">启用</a-radio>
                    <a-radio :value="2">停用</a-radio>
                  </a-radio-group>
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 5 }">
                  <a-space>
                    <a-button @click="resetDeptQueryParam" icon="redo">重置</a-button>
                    <a-button type="primary" @click="saveDeptModal" icon="edit">保存</a-button>
                  </a-space>
                </a-form-model-item>
              </a-form-model>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-col>
    <!--分配用户窗口-->
    <a-modal
      title="分配部门负责人"
      width="50%"
      :visible="principalVisible"
      :confirm-loading="modalConfirmLoading"
      @ok="okPrincipalModal"
      @cancel="cancelPrincipalModal"
    >
      <select-user :selectedUserIds="selectedUserIds" :show="principalVisible"
                   @select="selectUserIds"></select-user>
    </a-modal>
  </a-row>
</template>

<script>
  import {queryDeptTree, queryDeptFieldList, deleteDept, deleteDeptBatch, saveDept} from '@/api/dept'
  import {queryDictItemListByCode} from '@/api/dictItem'
  import {DictCode} from '@/utils/system/dictCode'
  import {DictConstant} from '@/utils/system/dictConstant'
  import ACol from "ant-design-vue/es/grid/Col";
  import SelectUser from '@/views/components/user/SelectUser'
  import ARow from "ant-design-vue/es/grid/Row";

  export default {
    name: "dept",
    components: {ARow, ACol, SelectUser},
    data() {
      return {
        defaultActiveKey: '1',
        tabList,
        // 树形
        checkedDeptIds: [], // 选中的树节点
        // 部门负责人窗口
        selectedUserIds: [], // 已选择负责人的userId
        principalVisible: false, // 是否显示
        principalData: [],
        deptTypeData: [],
        deptData: [],
        deptDataLoading: true, // 部门数据区域 login
        deptQueryParam: {},
        // 新增、修改时候Form表单
        deptForm: {
          status: 1
        },
        deptTableColumns,
        deptFormRules,
        // 弹出框相关参数
        modalTitle: '',
        modalVisible: false,
        modalConfirmLoading: false
      }
    },
    created() {
    },
    mounted() {
      this.getDeptData()
      this.getDeptTypeData()
    },
    methods: {

      /**
       * 选择部门负责人
       */
      selectPrincipal(userIds) {
        this.selectedUserIds = []
        console.log(userIds)
        if (userIds) {
          let userIdData = userIds.split(',')
          for (let i = 0; i < userIdData.length; i++) {
            this.selectedUserIds.push(userIdData[i].id)
          }
        }
        this.principalVisible = true
      },
      /**
       * 取消分配部门负责人窗口
       */
      cancelPrincipalModal() {
        this.principalVisible = false
      },

      /**
       * 选中部门负责人用户Ids
       */
      selectUserIds(userIds) {
        this.selectedUserIds = userIds
        console.log(this.selectedUserIds)
      },
      /**
       * 确定部门负责人
       */
      okPrincipalModal() {
        let userStr = ''
        for (let i = 0; i < this.selectedUserIds.length; i++) {
          userStr += this.selectedUserIds[i]
          if (i != this.selectedUserIds.length - 1) {
            userStr += ','
          }
        }
        this.deptForm.principal = userStr
        console.log(this.deptForm.principal)
        this.cancelPrincipalModal()
      },
      /**
       * 获取部门名称
       */
      getDeptTypeName(type) {
        for (var i = 0; i < this.deptTypeData.length; i++) {
          if (type == this.deptTypeData[i].value) {
            return this.deptTypeData[i].title
          }
        }
      },
      /**
       * 查询部门类型 => 数据字典
       */
      getDeptTypeData() {
        queryDictItemListByCode(DictCode.dept.deptType, DictConstant.dict_status_enable).then(res => {
          this.deptTypeData = res.data
        })
      },
      /**
       * 页签改变事件
       */
      changeTab(val){
        this.defaultActiveKey = val
      },
      /**
       * 查询数据点击事件
       */
      queryDeptDataByParam() {
        this.getDeptData()
      },
      /**
       * 重置查询条件
       */
      resetDeptQueryParam() {
        this.deptQueryParam = {}
      },
      /**
       * 查询数据
       */
      getDeptData() {
        this.deptDataLoading = true
        let param = {
          name: this.deptQueryParam.name,
          code: this.deptQueryParam.code,
        }
        queryDeptTree(param).then(res => {
          this.deptDataLoading = false
          this.deptData = res.data  // 用户数据
        })
      },
      /**
       * 取消部门窗口
       */
      cancelDeptModal() {
        this.modalVisible = false
        this.$refs['deptFormRef'].clearValidate()
        this.deptForm = {
          status: 1
        }
        this.principalData = []
      },
      /**
       * 保存部门
       */
      saveDeptModal() {
        console.log(this.deptForm)
        this.$refs.deptFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            this.modalConfirmLoading = true
            saveDept(this.deptForm).then(res => {
              this.modalConfirmLoading = false
              this.$message.success(res.message)
              this.cancelDeptModal()
              this.getDeptData()
            }, error => {
              this.modalConfirmLoading = false
            })
          }
        })
      },
      /**
       * 部门数据表单 初始化
       */
      deptFormInit() {
        this.deptForm = {
          status: 1
        }
      },
      /**
       * 添加部门
       */
      addDeptForm() {
        this.deptFormInit()
        this.defaultActiveKey = 1
      },
      /**
       * 选中部门
       */
      clickDeptData(deptIds) {
        let id = deptIds[0]
        let dept = this.deptData.filter(dept => dept.id == id)[0]
        this.deptForm = dept
      },
      /**
       * 表格选择事件
       */
      changeTableSelect(selectedDataIds) {
        console.log('selectedRowKeys changed: ', selectedDataIds)
        this.selectedDataIds = selectedDataIds
      },
      /***
       * 批量删除
       */
      removeBatchDept() {
        this.loading = true
        deleteDeptBatch(this.selectedDataIds).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getDeptData()
        })
      },
      /**
       * 删除部门
       */
      removeDept(row) {
        this.loading = true
        deleteDept(row.deptId).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getDeptData()
        })
      },
      // /**
      //  * 查询用户显示字段
      //  */
      // getDeptFieldList() {
      //   queryDeptFieldList().then(res => {
      //     this.deptColumns = res.data
      //     this.getTableDeptColumns(res.data)
      //     this.getDeptData()
      //   })
      // },
      // /**
      //  * 处理表格显示字段
      //  */
      // getTableDeptColumns(data) {
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
      //   this.deptTableColumns = arr
      // }
    }
  }
  const deptFormRules = {
    name: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
    code: [{required: true, message: '请输入部门编码', trigger: 'blur'}],
    foundTime: [{required: true, message: '请输入部门成立时间', trigger: 'blur'}],
    type: [{required: true, message: '请选择部门类型', trigger: 'blur'}],
    status: [{required: false, message: '请选择部门状态', trigger: 'blur'}]
  }

  const deptTableColumns = [

    {
      title: '部门名称',
      dataIndex: 'name',
      scopedSlots: {
        customRender: 'name'
      },
      ellipsis: true
    },
    {
      title: '部门编码',
      dataIndex: 'code',
      scopedSlots: {
        customRender: 'code'
      },
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      scopedSlots: {
        customRender: 'type'
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
      title: '排序',
      dataIndex: 'orderNo',
      scopedSlots: {
        customRender: 'orderNo'
      },
      ellipsis: true
    },
    // {
    //   title: '成立时间',
    //   dataIndex: 'foundTime',
    //   scopedSlots: {
    //     customRender: 'foundTime'
    //   },
    //   ellipsis: true
    // },


    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'}
    }
  ]

  // 页签
  const tabList = [
    {
      key: '1',
      title: '基本信息'
    },
    {
      key: '2',
      title: '权限信息'
    }
  ]
</script>

<style scoped>
</style>