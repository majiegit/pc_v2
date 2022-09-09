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
          <DeptForm :deptIdProp="selectedDeptId" v-if="deptEditStatus" ref="deptForm" @saveDeptSuccess="saveDeptSuccess"/>
          <a-empty description="请先选择一个部门" v-else/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="部门权限">
          <DeptPermission :deptIdProp="selectedDeptId" v-if="selectedDeptId"/>
          <a-empty description="请先选择一个部门"  v-else/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="部门角色">
          <DeptRole :deptIdProp="selectedDeptId"  v-if="selectedDeptId"/>
          <a-empty description="请先选择一个部门"  v-else/>
        </a-tab-pane>
        <a-tab-pane key="4" tab="部门人员">
          <DeptUser :deptIdProp="selectedDeptId"  v-if="selectedDeptId"/>
          <a-empty description="请先选择一个部门" v-else/>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<script>
  import {queryDeptTree, getDeptById, deleteDept, deleteDeptBatch} from '@/api/dept'
  import {queryDeptUserList, deleteDeptUser, saveDeptUser, deleteDeptUserBatch} from '@/api/deptUser'
  import ACol from "ant-design-vue/es/grid/Col";
  import ARow from "ant-design-vue/es/grid/Row";
  import DeptRole from "@/views/system/dept/DeptRole"
  import DeptUser from "@/views/system/dept/DeptUser"
  import DeptForm from "@/views/system/dept/DeptForm"
  import DeptPermission from "@/views/system/dept/DeptPermission"

  export default {
    name: "dept",
    components: {ARow, ACol, DeptRole, DeptUser, DeptForm, DeptPermission},
    data() {
      return {
        // 当前部门 Id
        deptEditStatus: false,
        selectedDeptId: null,
        selectedDeptName: '',
        defaultActiveKey: '1',
        // 树形
        checkedDeptIds: [], // 选中的树节点
        deptData: [],
        deptDataLoading: false, // 部门树区域 Loading
        deptQueryParam: {}
      }
    },
    created() {
    },
    mounted() {
      this.getDeptData()
    },
    methods: {

      // /**
      //  * 批量取消角色关联用户
      //  */
      // cancelDeptUserBatch() {
      //   this.deptUserLoading = true
      //   deleteDeptUserBatch(this.userDataSelectIds).then(res => {
      //     this.deptUserLoading = false
      //     this.$message.success(res.message)
      //     this.userDataSelectIds = []
      //     this.queryDeptUserData(this.selectedDeptId)
      //   })
      // },
      // /**
      //  * 选择用户表格改变事件
      //  */
      // changeUserDataSelect(selectedUserIds) {
      //   this.userDataSelectIds = selectedUserIds
      // },
      // /**
      //  * 分配人员
      //  */
      // selectPrincipal() {
      //   this.selectedUserIds = []
      //   for (let i = 0; i < this.deptUserData.length; i++) {
      //     this.selectedUserIds.push(this.deptUserData[i].userId)
      //   }
      //   this.principalVisible = true
      // },
      // /**
      //  * 取消分配部门负责人窗口
      //  */
      // cancelPrincipalModal() {
      //   this.principalVisible = false
      // },
      //
      // /**
      //  * 选中部门负责人用户Ids
      //  */
      // selectUserIds(userIds) {
      //   this.selectedUserIds = userIds
      // },
      // /**
      //  * 分配确定
      //  */
      // okPrincipalModal() {
      //   let params = {
      //     deptId: this.selectedDeptId,
      //     userIds: this.selectedUserIds
      //   }
      //   saveDeptUser(params).then(res => {
      //     this.$message.success(res.message)
      //     this.queryDeptUserData(this.selectedDeptId)
      //   })
      //   this.cancelPrincipalModal()
      // },
      //
      //
      //
      // /**
      //  * 查询部门人员
      //  */
      // queryDeptUserData(deptId) {
      //   this.deptUserLoading = true
      //   queryDeptUserList(deptId).then(res => {
      //     this.deptUserLoading = false
      //     this.deptUserData = res.data
      //   })
      // },
      // /**
      //  * 取消部门人员关联
      //  * */
      // cancelDeptUser(row) {
      //   this.deptUserLoading = true
      //   deleteDeptUser(row.id).then(res => {
      //     this.$message.success(res.message)
      //     this.deptUserLoading = false
      //     this.queryDeptUserData(this.selectedDeptId)
      //   })
      // },


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
       * 保存成功
       */
      saveDeptSuccess(){
        this.getDeptData()
      },
      /**
       * 添加部门
       */
      addDeptForm() {
        this.defaultActiveKey = '1'
        this.deptEditStatus = true
        let _this = this
        let time = 500
        if(this.selectedDeptId){
          time = 0
        }
        setTimeout(function () {
          _this.addDept()
        },time)
      },
      addDept(){
        this.$refs.deptForm.addDeptForm()
      },
      /**
       * 点击部门
       */
      clickDeptData(deptIds,e) {
        if (deptIds.length != 0) {
          let id = deptIds[0]
          this.deptEditStatus = true
          this.selectedDeptId = id
          this.selectedDeptName = e.node.title
        } else {
          this.selectedDeptId = null
          this.deptEditStatus = false
          this.selectedDeptName = ''
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