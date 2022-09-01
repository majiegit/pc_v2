<template>
  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-col :span="24">
      <a-spin :spinning="loading">
        <!--操作按钮区域-->
        <a-col :span="24">
          <a-form layout="inline">
            <a-row type="flex" align="middle">
              <a-col :md="10" :sm="24">
                <a-form-item label="角色名称">
                  <a-input v-model="roleQueryParam.roleName" placeholder="请输入角色名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="10" :sm="24">
                <a-form-item label="角色编码">
                  <a-input v-model="roleQueryParam.roleCode" placeholder="请输入角色编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-space>
                  <a-button type="primary" @click="getRoleList" icon="search">查询</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col :span="24">
          <a-space>
            <a-button type="primary" icon="plus" @click="addRole()" :disabled="editingKey !==''">角色新增</a-button>
          </a-space>
        </a-col>
        <!-- table 区域-->
        <a-col :span="24">
          <a-table
            bordered
            row-key="id"
            :columns="columns"
            :data-source="roleList"
            :row-selection="rowSelection"
          >
            <template
              v-for="col in ['roleName', 'roleCode', 'description']"
              :slot="col"
              slot-scope="text, record, index"
            >
              <div :key="col">
                <a-form-model-item :rules="roleRules" v-if="record.editable">
                  <a-input
                    style="margin: -5px 0"
                    v-model="record[col]"
                    :prop="col"
                  />
                </a-form-model-item>
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
            <template slot="operation" slot-scope="text, record, index">
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => save(record)">保存</a>
                  <a-popconfirm title="是否取消编辑?" @confirm="() => cancel(record.id)">
                    <a class="operation" style="color: red;">取消</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a class="operation" @click="showPopupUser(record)">用户</a>
                  <a class="operation" @click="showPermission(record)">分配权限</a>
                  <a :disabled="editingKey !== ''" class="operation" @click="edit(record.id)">编辑</a>
                  <a class="operation" style="color: red;">
                    <a-popconfirm :disabled="editingKey !== ''" title="是否删除此角色?" @confirm="remove(record.id)">
                      删除
                    </a-popconfirm>
                  </a>
                </span>
              </div>
            </template>
          </a-table>
        </a-col>
      </a-spin>
    </a-col>

    <!--分配角色权限区域代码-->
    <a-drawer
      title="分配权限"
      placement="right"
      width="500"
      :visible="allocation.visible"
      @close="cancelSavePermission"
    >
      <PermissionTree :treeData="allocation.permissionData" :treeHeight="'800px'"
                      :checkKeys="allocation.rolePermissionIds"
                      :loading="allocation.rolePermissionLoading"
                      :saveLoading="savePermissionLoading" @save="savePermission"/>
    </a-drawer>
  </a-row>
</template>
<script>
  import {getRoleList, saveRole, deleteRole} from '@/api/role'
  import {permissionTree} from '@/api/permission'
  import {rolePermissionListByRoleId, saveRolePermission} from '@/api/rolePermission'
  import {queryRoleUser, removeRoleUser, saveUserRole} from '@/api/userRole'
  import {queryDictItemListByCode} from '@/api/dictItem'
  import {DictCode} from '@/utils/system/dictCode'
  import {DictConstant} from '@/utils/system/dictConstant'
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import AFormItem from "ant-design-vue/es/form/FormItem";
  import SelectUser from '@/views/components/user/SelectUser'
  import PermissionTree from '@/views/components/permission/PermissionTree'

  export default {
    components: {AFormItem, ACol, ARow, SelectUser, PermissionTree},
    data() {
      return {
        savePermissionLoading: false,
        distributionUserVisible: false,
        modalConfirmLoading: false,
        // 用户分配
        selectedUserIds: [],
        userPopupShow: false,
        role: {},
        userQueryParam: {
          realname: ''
        },
        userStatusData: [], // 用户状态
        userData: [],
        userDataSelectUserIds: [], // 选择用户id
        userDataLoading: false,
        userColumns,
        // 分配权限
        allocation: {
          rolePermissionIds: [],
          role: {},
          rolePermissionLoading: true,
          permissionData: [],
          visible: false
        },
        // 角色
        roleRules: {
          roleName: [{required: true, message: 'Please input Activity name', trigger: 'blur'}],
          roleCode: [{required: true, message: 'Please input Activity name', trigger: 'blur'}],
          description: [{required: true, message: 'Please input Activity name', trigger: 'blur'}]
        },
        columns,
        rowSelection,
        editingKey: '',
        roleList: [],
        roleQueryParam: {
          roleType: '',
          roleName: '',
          roleCode: ''
        },
        roleListBackUp: [],
        loading: false,
      }
    },
    created() {
      this.getRoleList()
      this.getPermissionTree()
      this.queryUserStatus()
    },
    methods: {
      /**
       * 分配用户事件
       */
      distributionUserClick() {
        this.selectedUserIds = []
        for (let i = 0; i < this.userData.length; i++) {
          this.selectedUserIds.push(this.userData[i].id)
        }
        this.distributionUserVisible = true
      },
      /**
       * 取消分配用户分组窗口
       */
      cancelDistributionUserModal() {
        this.distributionUserVisible = false
      },

      /**
       * 选中的用户Id
       */
      selectUserIds(userIds) {
        this.selectedUserIds = userIds
      },
      /**
       * 保存分配用户
       */
      saveDistributionUserModal() {
        saveUserRole(this.role.id, this.selectedUserIds).then(res => {
          this.distributionUserVisible = false
          this.$message.success(res.message)
          this.queryUserList(this.role.id)
        })
      },
      /**
       * 批量取消角色关联用户
       */
      cancelRoleUserBatch() {
        removeRoleUser(this.role.id, this.userDataSelectUserIds).then(res => {
          this.$message.success(res.message)
          this.queryUserList(this.role.id)
          this.userDataSelectUserIds = []
        })
      },
      /**
       * 选择用户表格改变事件
       */
      changeUserDataSelect(selectedUserIds) {
        this.userDataSelectUserIds = selectedUserIds
        console.log(this.userDataSelectUserIds)
      },
      /**
       * 取消用户角色关联
       */
      cancelRoleUser(row) {
        const userIds = []
        userIds.push(row.id);
        removeRoleUser(this.role.id, userIds).then(res => {
          this.$message.success(res.message)
          this.queryUserList(this.role.id)
        })
      },
      /**
       * 获取用户状态名称
       * */
      getStatusName(status) {
        var arr = this.userStatusData.filter(item => item.value == status)
        console.log()
        if (arr.length == 0) {
          return ''
        } else {
          return arr[0].title
        }
      },
      /**
       *  查询用户状态
       */
      queryUserStatus() {
        this.userDataLoading = true
        queryDictItemListByCode(DictCode.user.user_status, DictConstant.dict_status_enable).then(res => {
          this.userStatusData = res.data
        })
      },
      /**
       * 查询角色用户事件
       */
      queryRoleUserClick() {
        this.queryUserList(this.role.id)
      },

      /**
       *  查询角色关联用户
       */
      queryUserList(roleId) {
        this.userDataLoading = true
        let param = {
          roleId: roleId
        }
        if (this.userQueryParam.realname) {
          param.realname = this.userQueryParam.realname
        }
        queryRoleUser(param).then(res => {
          this.userData = res.data
          this.userDataLoading = false
        })
      },
      /**
       * 用户操作
       */
      // 打开用户窗口
      showPopupUser(role) {
        this.userPopupShow = true
        this.role = role
        this.queryUserList(role.id)
      },
      // 关闭用户窗口
      closeUserPopup() {
        this.userPopupShow = false
      },
      /**
       * 分配权限
       */
      // 取消分配权限
      cancelSavePermission() {
        this.allocation.visible = false
      },
      // 保存分配权限
      savePermission(permissionIds) {
        console.log(permissionIds)
        this.savePermissionLoading = true
        saveRolePermission(this.allocation.role.id, permissionIds).then(res => {
          this.savePermissionLoading = false
          this.$message.success(res.message)
          this.cancelSavePermission()
        }).catch(res => {
          this.savePermissionLoading = false
        })
      },
      // 点击分配权限
      showPermission(row) {
        this.allocation.role = row
        this.allocation.visible = true
        this.getRolePermissionListByRoleId(row.id)
      },
      getPermissionIds(data) {
        let arr = []
        data.forEach(item => {
          arr.push(item.id)
        })
        return arr
      },
      /**
       * 查询当前角色权限
       */
      getRolePermissionListByRoleId(roleId) {
        this.allocation.rolePermissionLoading = true
        rolePermissionListByRoleId(roleId).then(res => {
          this.allocation.rolePermissionIds = this.getPermissionIds(res.data)
          this.allocation.rolePermissionLoading = false
        })
      },
      /**
       * 查询所有权限
       */
      getPermissionTree() {
        permissionTree().then(res => {
          this.allocation.permissionData = res.data
        })
      },
      /**
       * 编辑角色
       */
      edit(id) {
        const newData = [...this.roleList]
        const target = newData.find(item => id === item.id)
        this.editingKey = id
        if (target) {
          target.editable = true
          this.roleList = newData
        }
      },
      /**
       * 保存角色
       */
      save(row) {
        if (row.roleName.trim() === '') {
          this.$message.error('请输入角色名称')
          return
        }
        if (row.roleCode.trim() === '') {
          this.$message.error('请输入角色编码')
          return
        }
        saveRole(row).then(res => {
          this.$message.success(res.message)
          this.getRoleList()
          this.editingKey = ''
        })
        // const id = row.id
        // if (id != '') {
        //   const newData = [...this.roleList]
        //   const newCacheData = [...this.roleListBackUp]
        //   const target = newData.find(item => id === item.id)
        //   const targetCache = newCacheData.find(item => id === item.id)
        //   if (target && targetCache) {
        //     delete target.editable
        //     this.roleList = newData
        //     Object.assign(targetCache, target)
        //     this.roleListBackUp = JSON.parse(JSON.stringify(newData))
        //   }
        // } else {
        //   this.getRoleList()
        // }

      },
      cancel(id) {
        if (id != '') {
          const newData = [...this.roleList];
          const target = newData.find(item => id === item.id);
          if (target) {
            Object.assign(target, this.roleListBackUp.find(item => id === item.id));
            delete target.editable;
            this.roleList = newData;
          }
        } else {
          this.roleList.splice(0, 1)
        }
        this.editingKey = '';
      },
      /**
       * 删除角色
       */
      remove(id) {
        deleteRole(id).then(res => {
          this.$message.success(res.message)
          const index = this.roleList.findIndex(item => id == item.id)
          this.roleList.splice(index, 1)
        }).catch(err => {
        })
      },
      /**
       * 新增角色
       */
      addRole() {
        const role = {
          id: '',
          roleName: '',
          roleCode: '',
          description: '',
          editable: true
        }
        this.roleList.unshift(role)
        this.editingKey = 'add'
      },
      /**
       * 查询角色
       */
      getRoleList() {
        this.loading = true
        getRoleList(this.roleQueryParam).then(res => {
          this.roleList = res.data
          this.roleListBackUp = JSON.parse(JSON.stringify(res.data))
          this.loading = false
        })
      }
    }

  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    }
  }

  // 待分配用户数据列
  const allocatedUserDataTableColumns = [
    {
      title: '账号',
      dataIndex: 'username',
      scopedSlots: {customRender: 'username'}
    },
    {
      title: '姓名',
      dataIndex: 'realname',
      scopedSlots: {customRender: 'realname'}
    },
    {
      title: '性别',
      dataIndex: 'sex',
      scopedSlots: {customRender: 'sex'}
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      scopedSlots: {customRender: 'realname'}
    }
  ]

  // 已分配用户数据列名
  const userColumns = [

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
      title: '状态',
      dataIndex: 'status',
      scopedSlots: {customRender: 'status'}
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    }
  ]

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      scopedSlots: {customRender: 'roleName'}
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      scopedSlots: {customRender: 'roleCode'}
    },
    {
      title: '描述',
      dataIndex: 'description',
      scopedSlots: {customRender: 'description'}
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      scopedSlots: {customRender: 'createTime'}
    },
    // {
    //   title: '创建人',
    //   dataIndex: 'createUser',
    //   scopedSlots: {customRender: 'createUser'},
    // },
    // {
    //   title: '更新时间',
    //   dataIndex: 'updateTime',
    //   scopedSlots: {customRender: 'updateTime'},
    // },
    // {
    //   title: '更新人',
    //   dataIndex: 'updateUser',
    //   scopedSlots: {customRender: 'updateUser'},
    // },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]

</script>

<style>
  .operation {
    margin-left: 5px
  }

  .model_foot {
    width: 100%;
    borderTop: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    textAlign: right;
    zIndex: 1
  }

  .model_center {
    overflow-y: auto;
    width: 100%;
    padding: 10px 0px;
    height: 810px;
    background: #fff;
  }
</style>