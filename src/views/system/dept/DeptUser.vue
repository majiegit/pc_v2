<template>
  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-col :span="24">
      <!--操作按钮区域-->
      <a-space>
        <a-button type="primary" icon="plus" @click="selectPrincipal">分配用户</a-button>
        <a-button type="primary" icon="plus">新增用户</a-button>
        <a-button icon="delete" v-if="userDataSelectIds.length > 0" @click="cancelDeptUserBatch">批量删除</a-button>
      </a-space>
    </a-col>
    <a-col :span="24" style="overflow: auto;">
      <a-table
        bordered
        row-key="id"
        :loading="deptUserLoading"
        :columns="deptUserColumns"
        :row-selection="{ selectedRowKeys: userDataSelectIds, onChange: changeUserDataSelect }"
        :data-source="deptUserData"
      >
        <!--性别-->
        <template slot="sex" slot-scope="sex">
          <a-tag color="orange" v-if="sex == 0">未知</a-tag>
          <a-tag color="orange" v-if="sex == 1">男</a-tag>
          <a-tag color="orange" v-if="sex == 2">女</a-tag>
        </template>
        <template slot="operation" slot-scope="text,record">
          <a-space>
            <a href="javascript:;">编辑</a>
            <a href="javascript:;" @click="openRoleDrawer(record)">授权</a>
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

    <!--分配角色-->
    <a-drawer
      title="分配角色"
      placement="right"
      width="500"
      :visible="deptRoleVisible"
      @close="closeRoleDrawer"
    >
      <a-spin :spinning="deptRoleListLoading">
        <a-row type="flex" :gutter="[24,24]">
          <a-col :span="23" style="height: 800px; overflow-y: auto" class="model_center">
            <a-empty v-if="deptRoleList.length == 0" description="暂无数据"/>
            <div v-else>
              <a-checkbox-group :options="deptRoleList" v-model="userRoleListChecked"/>
            </div>
          </a-col>
        </a-row>
        <a-divider/>
        <a-row type="flex" :gutter="[24,24]" justify="end">
          <a-col span="6">
            <a-button type="primary" @click="saveUserRole" :loading="saveUserRoleButtonLoading">
              保 存
            </a-button>
          </a-col>
        </a-row>
      </a-spin>
    </a-drawer>

    <!--分配用户窗口-->
    <a-modal
      title="分配部门人员"
      width="50%"
      :visible="principalVisible"
      :confirm-loading="okConfirmLoading"
      @ok="okPrincipalModal"
      @cancel="cancelPrincipalModal"
    >
      <select-user :selectedUserIds="selectedUserIds" :show="principalVisible"
                   @select="selectUserIds"></select-user>
    </a-modal>
  </a-row>
</template>
<script>
  import {getDeptRoleList, saveDeptRole, deleteDeptRole} from '@/api/deptRole'
  import {removeRoleUser, saveUserRole} from '@/api/userRole'
  import {queryDeptUserList, deleteDeptUser, saveDeptUser, deleteDeptUserBatch, queryUserRoleList, saveDeptRoleUser} from '@/api/deptUser'
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import AFormItem from "ant-design-vue/es/form/FormItem";
  import SelectUser from '@/views/components/user/SelectUser'
  import PermissionTree from '@/views/components/permission/PermissionTree'

  export default {
    components: {AFormItem, ACol, ARow, SelectUser, PermissionTree},
    props: {
      /**
       * 当前部门ID
       */
      deptIdProp: {
        type: String,
        default: ''
      }

    },
    watch: {
      deptIdProp(val) {
        this.deptId = val
        this.queryDeptUserData(val)
      }
    },
    data() {
      return {
        deptId: this.deptIdProp,
        // 部门用户
        userDataSelectIds: [],
        deptUserLoading: false,
        deptUserData: [],
        deptUserColumns,
        // 部门负责人窗口
        selectedUserIds: [], // 已选择负责人的userId
        principalVisible: false, // 是否显示
        okConfirmLoading: false,
        // 部门角色窗口
        deptRoleVisible: false,
        saveUserRoleButtonLoading: false,
        deptRoleListLoading: false,
        deptRoleList: [],
        deptUser: {},
        userRoleList: [],
        userRoleListChecked: []
      }
    },
    mounted() {
      this.queryDeptUserData(this.deptIdProp)
    },
    created() {
    },
    methods: {
      /**
       * 关闭角色窗口
       */
      closeRoleDrawer() {
        this.deptRoleVisible = false
      },
      /**
       * 打开角色窗口
       */
      openRoleDrawer(row) {
        this.deptUser = row
        this.deptRoleVisible = true
        this.getUserRoleList(row)
      },
      /**
       * 查询用户角色
       */
      getUserRoleList(row) {
        this.deptRoleListLoading = true
        let params = {
          userId: row.userId,
          deptId: this.deptId
        }
        queryUserRoleList(params).then(res => {
          this.userRoleList = res.data
          this.getDeptRoleList(this.deptId)
        }).catch(res => {
          this.deptRoleListLoading = false
        })
      },
      /**
       * 查询部门角色
       */
      getDeptRoleList(deptId) {
        let param = {
          deptId: deptId
        }
        getDeptRoleList(param).then(res => {
          this.deptRoleList = []
          this.userRoleListChecked = []
          for (let i = 0; i < res.data.length; i++) {
            let item = {
              label: res.data[i].roleName,
              value: res.data[i].roleId
            }
            for (let j = 0; j < this.userRoleList.length; j++) {
              if(res.data[i].roleId === this.userRoleList[j].roleId){
                this.userRoleListChecked.push(res.data[i].roleId)
              }
            }
            this.deptRoleList.push(item)
          }
          this.deptRoleListLoading = false
        }).catch(res => {
          this.deptRoleListLoading = false
        })
      },
      /**
       * 保存用户角色
       */
      saveUserRole() {
        let params = {
          userId: this.deptUser.userId,
          deptId: this.deptId,
          roleIds: this.userRoleListChecked
        }
        saveDeptRoleUser(params).then(res => {
          this.$message.success(res.message)
          this.closeRoleDrawer()
        })
      },


      /**
       * 批量取消角色关联用户
       */
      cancelDeptUserBatch() {
        this.deptUserLoading = true
        deleteDeptUserBatch(this.userDataSelectIds).then(res => {
          this.deptUserLoading = false
          this.$message.success(res.message)
          this.userDataSelectIds = []
          this.queryDeptUserData(this.deptId)
        }).catch(res => {
          this.deptUserLoading = false
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
        this.okConfirmLoading = true
        let params = {
          deptId: this.deptId,
          userIds: this.selectedUserIds
        }
        saveDeptUser(params).then(res => {
          this.okConfirmLoading = false
          this.$message.success(res.message)
          this.queryDeptUserData(this.deptId)
          this.cancelPrincipalModal()
        }).catch(res => {
          this.okConfirmLoading = false
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
          this.queryDeptUserData(this.deptId)
        })
      },

    }

  }

  // 部门用户数据列名
  const deptUserColumns = [

    {
      align: 'center',
      title: '账号',
      dataIndex: 'username',
      scopedSlots: {customRender: 'username'}
    },
    {
      align: 'center',
      title: '用户名称',
      dataIndex: 'realname',
      scopedSlots: {customRender: 'realname'}
    },
    {
      align: 'center',
      title: '性别',
      dataIndex: 'sex',
      scopedSlots: {customRender: 'sex'}
    },
    {
      align: 'center',
      title: '电话',
      dataIndex: 'phone',
      scopedSlots: {customRender: 'phone'}
    },
    {
      align: 'center',
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    }
  ]
</script>

<style>
</style>