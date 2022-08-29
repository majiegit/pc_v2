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
            <a-button type="danger" icon="delete" v-if="checkedDeptIds.length > 0" @click="removeBatchDept">批量删除
            </a-button>
          </a-space>
        </a-col>

        <!--部门列表区域-->
        <a-col :span="24">
          <a-alert :message="'当前选择：' + selectedDeptName" type="info" show-icon/>
          <a-tree
            @select="clickDeptData"
            @check="checkDeptData"
            :checkStrictly="true"
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
        <a-tab-pane key="1" tab="基本信息">
          <a-row type="flex" justify="center">
            <a-col :span="22">
              <a-spin :spinning="deptInfoLoading">
                <a-empty v-if="!editDeptStatus" description="请先选择一个部门"/>
                <a-form-model :model="deptForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon v-else
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
                  <a-form-model-item label="成立日期" prop="foundDate">
                    <a-date-picker @change="changefoundDate" placeholder="请选择成立时间" v-model="deptForm.foundDate"/>
                  </a-form-model-item>
                  <a-form-model-item label="地址" prop="address">
                    <a-input v-model="deptForm.address"/>
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
                      <a-button @click="resetDeptForm" icon="redo">重置</a-button>
                      <a-button type="primary" @click="saveDeptModal" icon="edit" :loading="saveDeptLoading">保存
                      </a-button>
                    </a-space>
                  </a-form-model-item>
                </a-form-model>
              </a-spin>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" tab="部门人员">
          <a-empty v-if="!editDeptStatus" description="请先选择一个部门"/>
          <a-row type="flex" :gutter="[24,24]" v-else>
            <a-col :span="24">
              <!--操作按钮区域-->
              <a-space>
                <a-button type="primary" icon="plus" @click="selectPrincipal">分配用户</a-button>
                <a-button type="primary" icon="plus">新增用户</a-button>
                <a-button icon="delete" v-if="userDataSelectIds.length > 0" @click="cancelDeptUserBatch">批量删除</a-button>
              </a-space>
            </a-col>
            <a-col :span="24">
              <a-table
                bordered
                row-key="id"
                :loading="deptUserLoading"
                :columns="deptUserColumns"
                :row-selection="{ selectedRowKeys: userDataSelectIds, onChange: changeUserDataSelect }"
                :data-source="deptUserData"
              >
                <!--身份-->
                <template slot="userIdentity" slot-scope="userIdentity">
                  <a-tag color="orange" v-if="userIdentity == 1">负责人</a-tag>
                  <a-tag color="orange" v-if="userIdentity == 2">员工</a-tag>
                </template>
                <!--性别-->
                <template slot="sex" slot-scope="sex">
                  <a-tag color="orange" v-if="sex == 0">未知</a-tag>
                  <a-tag color="orange" v-if="sex == 1">男</a-tag>
                  <a-tag color="orange" v-if="sex == 2">女</a-tag>
                </template>
                <template slot="operation" slot-scope="text,record">
                  <a-space>
                    <a href="javascript:;">编辑</a>
                    <a href="javascript:;" style="color: red;">
                      <a-popconfirm
                        title="确定要取消关联吗?"
                        @confirm="() => cancelDeptUser(record)"
                      >删除
                      </a-popconfirm>
                    </a>
                  </a-space>
                </template>
              </a-table>
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
  import {queryDeptTree, getDeptById, deleteDept, deleteDeptBatch, saveDept} from '@/api/dept'
  import {queryDeptUserList, deleteDeptUser, saveDeptUser, deleteDeptUserBatch} from '@/api/deptUser'
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
        // 部门用户
        userDataSelectIds: [],
        deptUserLoading: false,
        deptUserData: [],
        deptUserColumns,
        // 部门编辑状态
        editDeptStatus: false,
        // 当前部门 Id
        selectedDeptId: null,
        selectedDeptName: '',
        defaultActiveKey: '1',
        // 树形
        checkedDeptIds: [], // 选中的树节点
        // 部门负责人窗口
        selectedUserIds: [], // 已选择负责人的userId
        principalVisible: false, // 是否显示
        deptTypeData: [],
        deptData: [],
        deptDataLoading: false, // 部门树区域 Loading
        deptInfoLoading: false, // 部门信息区域 Loading
        deptQueryParam: {},
        // 新增、修改时候Form表单
        deptForm: {
          status: 1
        },
        deptFormRules,
        // 弹出框相关参数
        modalTitle: '',
        modalVisible: false,
        modalConfirmLoading: false, //
        saveDeptLoading: false // 保存按钮Loading
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
       * 批量取消角色关联用户
       */
      cancelDeptUserBatch() {
        this.deptUserLoading = true
        deleteDeptUserBatch(this.userDataSelectIds).then(res => {
          this.deptUserLoading = false
          this.$message.success(res.message)
          this.userDataSelectIds = []
          this.queryDeptUserData(this.selectedDeptId)
        })
      },
      /**
       * 选择用户表格改变事件
       */
      changeUserDataSelect(selectedUserIds) {
        this.userDataSelectIds = selectedUserIds
      },
      /**
       * 分配人员
       */
      selectPrincipal() {
        this.selectedUserIds = []
        for (let i = 0; i < this.deptUserData.length; i++) {
          this.selectedUserIds.push(this.deptUserData[i].userId)
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
      },
      /**
       * 分配确定
       */
      okPrincipalModal() {
        let params = {
          deptId: this.selectedDeptId,
          userIds: this.selectedUserIds
        }
        saveDeptUser(params).then(res => {
          this.$message.success(res.message)
          this.queryDeptUserData(this.selectedDeptId)
        })
        this.cancelPrincipalModal()
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
       * 查询部门人员
       */
      queryDeptUserData(deptId) {
        this.deptUserLoading = true
        queryDeptUserList(deptId).then(res => {
          this.deptUserLoading = false
          this.deptUserData = res.data
        })
      },
      /**
       * 取消部门人员关联
       * */
      cancelDeptUser(row) {
        this.deptUserLoading = true
        deleteDeptUser(row.id).then(res => {
          this.$message.success(res.message)
          this.deptUserLoading = false
          this.queryDeptUserData(this.selectedDeptId)
        })
      },


      /**
       * 页签改变事件
       */
      changeTab(val) {
        this.defaultActiveKey = val
      },
      /**
       * 查询数据点击事件
       */
      queryDeptDataByParam() {
        this.getDeptData()
      },
      /**
       * 重置部门查询条件
       */
      resetDeptQueryParam() {
        this.deptQueryParam = {}
      },
      /**
       * 查询部门数据
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
       * 重置部门表单数据
       */
      resetDeptForm() {
        if (this.selectedDeptId) {
          this.deptFormInit()
          this.deptForm.id = this.selectedDeptId
        } else {
          this.deptFormInit()
        }

      },
      /**
       * 成立时间
       */
      changefoundDate(date, dateString) {
        this.deptForm.foundDate = dateString
      },
      /**
       * 保存部门
       */
      saveDeptModal() {
        console.log(this.deptForm)
        this.$refs['deptFormRef'].validate(valid => {
          if (!valid) {
            return false
          } else {
            this.saveDeptLoading = true
            saveDept(this.deptForm).then(res => {
              this.$message.success(res.message)
              this.saveDeptLoading = false
              this.getDeptData()
            }, error => {
              this.saveDeptLoading = false
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
        this.defaultActiveKey = '1'
        this.editDeptStatus = true
        if (this.selectedDeptId) {
          this.deptForm.pid = this.selectedDeptId
        }
      },
      /**
       * 点击部门
       */
      clickDeptData(deptIds) {
        if (deptIds.length != 0) {
          let id = deptIds[0]
          this.selectedDeptId = id
          this.editDeptStatus = true
          this.deptInfoLoading = true
          getDeptById(id).then(res => {
            this.deptForm = res.data
            this.deptInfoLoading = false
            this.selectedDeptName = res.data.name
          })
          this.queryDeptUserData(id)
        } else {
          this.selectedDeptId = null
          this.editDeptStatus = false
          this.selectedDeptName = ''
          this.deptFormInit()
        }
      },
      /**
       * 选中部门
       */
      checkDeptData(checkedKeys) {
        this.checkedDeptIds = checkedKeys.checked
      },

      /***
       * 批量删除部门
       */
      removeBatchDept() {
        let _this = this
        this.$confirm({
          title: '确认删除',
          content: '确定要删除所选中的部门，以及子部门数据吗?',
          onOk() {
            _this.deleteDept()
          },
          onCancel() {
          },
        });
      },
      deleteDept() {
        this.deptDataLoading = true
        deleteDeptBatch(this.checkedDeptIds).then(res => {
          this.deptDataLoading = false
          this.$message.success(res.message)
          this.checkedDeptIds = []
          this.getDeptData()
        })
      }
    }
  }
  const deptFormRules = {
    name: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
    code: [{required: true, message: '请输入部门编码', trigger: 'blur'}],
    foundDate: [{required: true, message: '请输入部门成立时间', trigger: 'blur'}],
    type: [{required: true, message: '请选择部门类型', trigger: 'blur'}],
    status: [{required: false, message: '请选择部门状态', trigger: 'blur'}]
  }

  // 部门用户数据列名
  const deptUserColumns = [

    {
      title: '账号',
      dataIndex: 'username',
      scopedSlots: {customRender: 'username'}
    },
    {
      title: '用户名称',
      dataIndex: 'realname',
      scopedSlots: {customRender: 'realname'}
    },
    {
      title: '身份',
      dataIndex: 'userIdentity',
      scopedSlots: {customRender: 'userIdentity'}
    },
    {
      title: '性别',
      dataIndex: 'sex',
      scopedSlots: {customRender: 'sex'}
    },
    {
      title: '电话',
      dataIndex: 'phone',
      scopedSlots: {customRender: 'phone'}
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    }
  ]
</script>

<style scoped>
</style>