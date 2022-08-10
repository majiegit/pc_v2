<template>
  <a-row :gutter="[24,24]" style="background: #fff;">
    <a-col :span="userPopupShow ? 12 : 24">
      <!--操作按钮区域-->
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
          :loading="loading"
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
            <a class="operation">取消</a>
          </a-popconfirm>
        </span>
              <span v-else>
          <a class="operation" @click="showPopupUser(record)">用户</a>
          <a class="operation" @click="showPermission(record)">分配权限</a>
          <a :disabled="editingKey !== ''" class="operation" @click="edit(record.id)">编辑</a>
          <a-popconfirm :disabled="editingKey !== ''" title="是否删除此角色?" @confirm="remove(record.id)">
            <a class="operation">删除</a>
          </a-popconfirm>
        </span>
            </div>
          </template>
        </a-table>
      </a-col>
    </a-col>


    <!-- 用户数据操作面板-->
    <a-col :span="userPopupShow ? 12 : 0">
      <!--用户操作-->
      <a-col span="23">
        <!--操作按钮区域-->
        <a-space>
          <a-button type="primary" icon="plus">分配用户</a-button>
          <a-button icon="delete">取消关联</a-button>
        </a-space>
      </a-col>
      <a-col span="1">
        <a-icon type="close" @click="closeUserPopup"/>
      </a-col>
      <!--用户数据-->
      <a-col span="24">
        <a-table
          bordered
          row-key="id"
          :loading="userDataLoading"
          :columns="userColumns"
          :row-selection="rowSelection"
          :data-source="userData"
        >
          <template slot="status" slot-scope="status">
            <a-tag color="orange">{{getStatusName(status)}}</a-tag>
          </template>
          <template slot="operation" slot-scope="text,record">
            <a-space>
              <a href="javascript:;">编辑</a>
              <a href="javascript:;" style="color: red;">
                <a-popconfirm
                  title="确定要删除此模板吗?"
                  @confirm="() => cancelRoleUser(record)"
                >取消关联
                </a-popconfirm>
              </a>
            </a-space>
          </template>
        </a-table>
      </a-col>
    </a-col>


    <!--分配角色权限区域代码-->
    <a-drawer
      title="分配权限"
      placement="right"
      width="500"
      :visible="allocation.visible"
      @close="cancelSavePermission"
    >
      <a-spin :spinning="!allocation.permissionShow">
        <div class="model_center">
          <a-tree v-if="allocation.permissionShow"
                  checkable
                  :checkStrictly="allocation.checkStrictly"
                  :defaultCheckedKeys="allocation.selectPermission"
                  :defaultExpandAll="allocation.defaultExpandAll"
                  :replaceFields="allocation.replaceFields"
                  :tree-data="allocation.permissionData"
                  @check="onSelectPermission"
          />
        </div>
        <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
          <a-row>
            <a-col span="14" pull="9">
              <a-dropdown placement="topCenter">
                <a-button>树 操 作
                  <a-icon type="up"/>
                </a-button>
                <a-menu slot="overlay">
                  <a-menu-item @click="selectAll">全部勾选</a-menu-item>
                  <a-menu-item @click="cancelSelectAll">取消全选</a-menu-item>
                  <a-menu-item @click="openAll">展开所有</a-menu-item>
                  <a-menu-item @click="cancelOpenAll">合并所有</a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-col>
            <a-col span="5">
              <a-button @click="cancelSavePermission">
                取 消
              </a-button>
            </a-col>
            <a-col span="5">
              <a-button type="primary" @click="savePermission">
                保 存
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-spin>
    </a-drawer>
  </a-row>
</template>
<script>
  import {getRoleList, saveRole, deleteRole} from '@/api/role'
  import {permissionTree} from '@/api/permission'
  import {rolePermissionListByRoleId, saveRolePermission} from '@/api/rolePermission'
  import {queryRoleUser, removeRoleUser} from '@/api/roleUser'
  import {queryDictItemListByCode} from '@/api/dictItem'
  import {DictCode} from '@/utils/system/dictCode'
  import {DictConstant} from '@/utils/system/dictConstant'
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";

  export default {
    components: {ACol, ARow},
    data() {
      return {
        // 用户分配
        userPopupShow: false,
        role: {},
        userStatusData: [], // 用户状态
        userData: [],
        userDataLoading: false,
        userColumns,
        // 分配权限
        allocation: {
          checkStrictly: true,
          defaultExpandAll: true,
          selectPermission: [],
          role: {},
          permissionShow: false,
          permissionData: [],
          visible: false,
          replaceFields: {children: 'children', title: 'title', key: 'id'},
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
      getStatusName(status){
        console.log(status)
        var arr = this.userStatusData.filter(item => item.value == status)
        console.log()
        if(arr.length == 0){
          return ''
        }else {
          return arr[0].title
        }
      },
      /**
       *  查询用户状态
       */
      queryUserStatus() {
        this.userDataLoading = true
        queryDictItemListByCode(DictCode.user_status, DictConstant.dict_status_enable).then(res => {
          this.userStatusData = res.data
        })
      },
      /**
       *  查询角色关联用户
       */
      queryUserList(roleId) {
        this.userDataLoading = true
        queryRoleUser(roleId).then(res => {
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


      // 树操作 勾选全部
      selectAll() {
        this.allocation.selectPermission = ['1']
      },
      // 树操作 取消全选
      cancelSelectAll() {
        this.allocation.selectPermission = []
      },

      // 树操作 展开树
      openAll() {
        this.allocation.defaultExpandAll = true
      },
      // 树操作 合并树
      cancelOpenAll() {
        this.allocation.defaultExpandAll = false
      },

      // 选择权限
      onSelectPermission(selectedKeys, info) {
        console.log(selectedKeys)
        // console.log(info)
        // this.allocation.selectPermission = [...selectedKeys, ...info.halfCheckedKeys]
        this.allocation.selectPermission = selectedKeys.checked
      },
      // 取消分配权限
      cancelSavePermission() {
        this.allocation.visible = false
        this.allocation.permissionShow = false
      },
      // 保存分配权限
      savePermission() {
        console.log(this.allocation.selectPermission)
        saveRolePermission(this.allocation.role.id, this.allocation.selectPermission).then(res => {
          this.$message.success(res.message)
          this.cancelSavePermission()
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
        rolePermissionListByRoleId(roleId).then(res => {
          this.allocation.selectPermission = this.getPermissionIds(res.data)
          this.allocation.permissionShow = true
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
        getRoleList().then(res => {
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
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows)
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows)
    },
  }
  // 用户数据列名
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

  .model_center {
    overflow-y: auto;
    width: 100%;
    height: 850px;
    background: #fff;
  }
</style>