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
                  <a-input v-model="deptRoleQueryParam.roleName" placeholder="请输入角色名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="10" :sm="24">
                <a-form-item label="角色编码">
                  <a-input v-model="deptRoleQueryParam.roleCode" placeholder="请输入角色编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-space>
                  <a-button type="primary" @click="queryDeptRole" icon="search">查询</a-button>
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
            :data-source="deptRoleList"
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
                  <a class="operation" @click="showPermission(record)">分配权限</a>
                  <a :disabled="editingKey !== ''" class="operation" @click="edit(record.id)">编辑</a>
                  <a class="operation" style="color: red;">
                    <a-popconfirm :disabled="editingKey !== ''" title="是否删除此角色?" @confirm="remove(record)">
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
                      :checkKeys="allocation.deptRolePermissionIds"
                      :loading="allocation.deptRolePermissionLoading"
                      :saveLoading="savePermissionLoading" @save="savePermission"/>
    </a-drawer>
  </a-row>
</template>
<script>
  import {getDeptRoleList, saveDeptRole, deleteDeptRole} from '@/api/deptRole'
  import {queryDeptPermissionTree} from '@/api/deptPermission'
  import {rolePermissionListByRoleId, saveRolePermission} from '@/api/rolePermission'
  import {queryRoleUser, removeRoleUser, saveUserRole} from '@/api/userRole'
  import {queryDictItemListByCode} from '@/api/dictItem'
  import {DictCode} from '@/utils/system/dictCode'
  import {DictConstant} from '@/utils/system/dictConstant'
  import {RoleType} from '@/utils/system/roleConstant'
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
    watch:{
      deptIdProp(val){
        this.deptId = val
        this.getDeptRoleList(val)
      }
    },
    data() {
      return {
        deptId: this.deptIdProp,
        savePermissionLoading: false,
        deptRole: {},
        // 分配权限
        allocation: {
          deptRolePermissionIds: [],
          deptRole: {},
          deptRolePermissionLoading: true,
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
        deptRoleList: [],
        deptRoleQueryParam: {
          roleName: '',
          roleCode: ''
        },
        deptRoleListBackUp: [],
        loading: false,
      }
    },
    mounted() {
      this.getDeptRoleList(this.deptIdProp)
      this.getDeptPermissionTree(this.deptIdProp)
    },
    created() {
    },
    methods: {
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
        saveRolePermission(this.allocation.deptRole.roleId, permissionIds).then(res => {
          this.savePermissionLoading = false
          this.$message.success(res.message)
          this.cancelSavePermission()
        }).catch(res => {
          this.savePermissionLoading = false
        })
      },
      // 点击分配权限
      showPermission(row) {
        this.allocation.deptRole = row
        this.allocation.visible = true
        this.getRolePermissionListByRoleId(row.roleId)
        this.getDeptPermissionTree(this.deptId)
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
        this.allocation.deptRolePermissionLoading = true
        rolePermissionListByRoleId(roleId).then(res => {
          this.allocation.deptRolePermissionIds = this.getPermissionIds(res.data)
          this.allocation.deptRolePermissionLoading = false
        }).catch(res => {
          this.allocation.deptRolePermissionLoading = false
        })
      },
      /**
       * 查询当前部门所有权限
       */
      getDeptPermissionTree(deptId) {
        queryDeptPermissionTree(deptId).then(res => {
          this.allocation.permissionData = res.data
        })
      },
      /**
       * 编辑角色
       */
      edit(id) {
        const newData = [...this.deptRoleList]
        const target = newData.find(item => id === item.id)
        this.editingKey = id
        if (target) {
          target.editable = true
          this.deptRoleList = newData
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
        this.loading = true
        saveDeptRole(row).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getDeptRoleList(this.deptId)
          this.editingKey = ''
        }).catch(res => {
          this.loading = false
        })

      },
      cancel(id) {
        if (id != '') {
          const newData = [...this.deptRoleList];
          const target = newData.find(item => id === item.id);
          if (target) {
            Object.assign(target, this.deptRoleListBackUp.find(item => id === item.id));
            delete target.editable;
            this.deptRoleList = newData;
          }
        } else {
          this.deptRoleList.splice(0, 1)
        }
        this.editingKey = '';
      },
      /**
       * 删除角色
       */
      remove(row) {
        this.loading = true
        let id = row.id
        deleteDeptRole(row.deptId, row.roleId).then(res => {
          this.$message.success(res.message)
          const index = this.deptRoleList.findIndex(item => id == item.id)
          this.deptRoleList.splice(index, 1)
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
      },
      /**
       * 新增角色
       */
      addRole() {
        const deptRole = {
          id: '',
          deptId: this.deptId,
          roleId: '',
          roleName: '',
          roleType: RoleType.DEPT_ROLE,
          roleCode: '',
          description: '',
          editable: true
        }
        this.deptRoleList.unshift(deptRole)
        this.editingKey = 'add'
      },
      /**
       * 查询角色事件
       */
      queryDeptRole(){
        this.getDeptRoleList(this.deptId)
      },
      /**
       * 查询部门角色
       */
      getDeptRoleList(deptId) {
        this.loading = true
        this.deptRoleQueryParam.deptId = deptId
        getDeptRoleList(this.deptRoleQueryParam).then(res => {
          this.deptRoleList = res.data
          this.deptRoleListBackUp = JSON.parse(JSON.stringify(res.data))
          this.loading = false
        }).catch(res => {
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

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: '25%',
      scopedSlots: {customRender: 'roleName'}
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      width: '25%',
      scopedSlots: {customRender: 'roleCode'}
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: '25%',
      scopedSlots: {customRender: 'description'}
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '25%',
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