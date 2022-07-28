<template>
  <a-row style="background: #fff;">

    <!--操作按钮区域-->
    <a-col :span="24" style="padding: 10px;">
      <a-space>
        <a-button type="primary" icon="plus" @click="addMenu()">新增</a-button>
        <a-button icon="delete">批量删除</a-button>
        <a-button @click="openAllMenu">展开全部</a-button>
        <a-button @click="foldAllMenu">折叠全部</a-button>
      </a-space>
    </a-col>
    <!-- table 区域-->
    <a-col :span="24">
      <a-table
        row-key="id"
        :loading="loading"
        :columns="columns"
        :data-source="menuList"
        :expandRowByClick="expandRowByClick"
        :expandedRowKeys="expandedRowKeys"
        :row-selection="rowSelection"
      >
        <span slot="hidden" slot-scope="hidden">
          <a-tag :color="hidden ? 'orange' : 'green'">{{hidden ? '隐藏' : '可见'}}</a-tag>
        </span>
        <span slot="menuType" slot-scope="menuType">
          <a-tag :color="menuType == 2 ? 'orange' : 'green'">{{menuType == 2 ? '按钮' : '菜单'}}</a-tag>
        </span>
        <template slot="action" slot-scope="text,record">
          <a href="javascript:;" class="operation"  @click="addMenuClick(record)">添加</a>
          <a href="javascript:;" class="operation" @click="updateMenuClick(record)">编辑</a>
          <a href="javascript:;" class="operation">
            <a-popconfirm
              title="确定要删除此菜单吗?"
              @confirm="() => deleteMenuRow(record)"
            >删除
            </a-popconfirm>
          </a>
        </template>
      </a-table>
    </a-col>
    <!-- 新增、修改菜单 窗口区域-->
    <a-col :span="24">
      <a-modal v-model="editVisible" title="编辑菜单" width="800px" @ok="saveMenu" @cancel="cancelMenu">

        <a-row>
          <a-form-model :model="menuForm" colon :labelCol="{span: 7}" :wrapperCol="{span: 17}" :rules="menuRules"
                        ref="menuFormRef">
            <a-col :span="12">
              <a-form-model-item label="菜单类型">
                <a-radio-group v-model="menuForm.menuType" :options="menuTypeOptions" @change="changeMenuType"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="菜单标题" prop="title">
                <a-input v-model="menuForm.title" placeholder="请输入菜单标题"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="menuForm.menuType != 0 ">
              <a-form-model-item label="上级菜单" prop="pid">
                <!-- 菜单类型为子菜单类型时 禁用父级菜单-->
                <a-tree-select
                  v-model="menuForm.pid"
                  show-search
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
                  placeholder="请选择上级菜单"
                  tree-default-expand-all
                  :replaceFields="replaceFields"
                  :tree-data="menuList"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="menuForm.menuType == 0 ">
              <a-form-model-item label="重定向地址" prop="redirect">
                <a-input v-model="menuForm.redirect" placeholder="请输入重定向地址"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="menuForm.menuType != 2 ">
              <!--菜单类型为按钮类型禁用-->
              <a-form-model-item label="打开方式" prop="openMode">
                <a-radio-group v-model="menuForm.openMode"
                               :options="openModeOptions"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="menuForm.menuType != 2 ">
              <!--菜单类型为按钮类型禁用-->
              <a-form-model-item label="菜单图标" prop="icon">
                <a-popover title="菜单图标" placement="bottomLeft" trigger="click" v-model="menuIconVisable">
                  <template slot="content">
                    <div style="width: 600px; background: #fff; overflow: auto;">
                      <icon-selector @change="handleIconChange"/>
                    </div>
                  </template>
                  <a-input v-model="menuForm.icon" placeholder="请选择菜单图标">
                    <a-icon slot="prefix" :type="menuForm.icon ? menuForm.icon  : ' '"/>
                    <a-icon slot="addonAfter" type="setting"/>
                  </a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="menuForm.menuType != 2 ">
              <a-form-model-item label="是否路由" prop="isRoute">
                <a-switch default-checked checkedChildren="是" unCheckedChildren="否" v-model="menuForm.isRoute"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="menuForm.menuType != 2 ">
              <a-form-model-item label="菜单路径" prop="path">
                <a-input v-model="menuForm.path" placeholder="请输入菜单路径"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="menuForm.menuType != 2 ">
              <a-form-model-item label="是否隐藏" prop="hidden">
                <a-switch default-checked checkedChildren="是" unCheckedChildren="否" v-model="menuForm.hidden"/>
              </a-form-model-item>
            </a-col>

            <a-col :span="12" v-if="menuForm.menuType == 2 ">
              <a-form-model-item label="是否禁用" prop="isDisable">
                <a-switch default-checked checkedChildren="是" unCheckedChildren="否" v-model="menuForm.isDisable"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="menuForm.menuType != 2">
              <a-form-model-item label="菜单组件" prop="component">
                <a-input v-model="menuForm.component" placeholder="请输入菜单组件"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="menuForm.menuType == 2">
              <a-form-model-item label="权限标识" prop="permissionCode">
                <a-input v-model="menuForm.permissionCode" placeholder="请输入权限标识"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="菜单排序" prop="sortNo">
                <a-input v-model="menuForm.sortNo" type="number" placeholder="请输入排序号"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="菜单描述" prop="description">
                <a-textarea v-model="menuForm.description" placeholder="请输入菜单描述"
                            :auto-size="{ minRows: 2, maxRows: 4 } " :maxlength='20'/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="menuForm.menuType != 2 && menuForm.isRoute ">
              <a-form-model-item label="路由名称" prop="name">
                <a-input v-model="menuForm.name" placeholder="请输入路由名称"/>
              </a-form-model-item>
            </a-col>
          </a-form-model>
        </a-row>
      </a-modal>
    </a-col>
  </a-row>
</template>
<script>
  import {permissionTree, deletePermission, permissionSave} from '@/api/permission'
  import {TreeSelect} from "ant-design-vue";
  import {MenuConstant} from '@/utils/system/menuConstant'
  import IconSelector from '@/components/IconSelector'
  // import ACol from "ant-design-vue/es/grid/Col";

  export default {
    components: {
      [TreeSelect.name]: TreeSelect,
      IconSelector
    },
    data() {
      return {
        menuIconVisable: false,
        menuRules,
        replaceFields: {
          children: 'children',
          title: 'title',
          key: 'id',
          value: 'id'
        },
        openModeOptions: [
          {label: '内部', value: MenuConstant.open_mode_inner},
          {label: '外部', value: MenuConstant.open_mode_out}
        ],
        menuTypeOptions: [
          {label: '一级菜单', value: MenuConstant.menu_type_parent},
          {label: '子菜单', value: MenuConstant.menu_type_child},
          {label: '按钮', value: MenuConstant.menu_type_button}
        ],
        menuForm: {
          component: "",
          description: "",
          hidden: false,
          icon: "",
          isDisable: false,
          isRoute: true,
          menuType: 0,
          name: "",
          openMode: 0,
          path: "",
          permissionCode: "",
          permissionType: "0",
          pid: "0",
          redirect: '',
          sortNo: 0
        },
        editVisible: false,
        columns,
        rowSelection,
        menuList: [],
        expandRowByClick: true,
        loading: false,
        expandedRowKeys: []
      }
    },
    created() {
      this.getPermissionTree()
    },
    methods: {
      /**
       * 折叠全部
       * */
      foldAllMenu(){
        this.expandedRowKeys = []
      },
      /**
       * 展开全部
       * */
      openAllMenu(){
        let arr = []
        this.menuList.forEach(item =>{
          arr.push(item.id)
        })
        this.expandedRowKeys = arr
      },
      /**
       *初始化菜单表单
       */
      initMenuForm() {
        this.menuForm = {
          component: "",
          description: "",
          hidden: false,
          icon: "",
          isDisable: false,
          isRoute: true,
          menuType: 0,
          name: "",
          openMode: 0,
          path: "",
          permissionCode: "",
          permissionType: "0",
          pid: "0",
          redirect: '',
          sortNo: 0
        }
      },
      /**
       * 删除菜单
       */
      deleteMenuRow(row) {
        console.log()
        let ids = []
        ids.push(row.id)
        deletePermission(ids).then(res => {
          this.$message.success(res.message);
          this.getPermissionTree()
        })
      },
      /**
       * 选择菜单图标
       */
      handleIconChange(icon) {
        this.menuForm.icon = icon
        this.menuIconVisable = false
      },
      /**
       *   保存菜单取消事件
       */
      cancelMenu() {
        // 隐藏弹窗
        this.editVisible = false
        // 重置表单
        this.initMenuForm()
        // 清楚验证
        this.$refs['menuFormRef'].clearValidate()
      },
      /**
       *  保存菜单
       */
      saveMenu() {
        // 校验表单
        this.$refs.menuFormRef.validate(valid => {
          if (!valid) {
            return false;
          } else {
            console.log(this.menuForm)
            permissionSave(this.menuForm).then(res => {
              this.$message.success(res.message)
              this.cancelMenu()
              this.getPermissionTree()
            })
          }
        })
      },
      /**
       * 菜单类型为按钮重置
       */
      resetMenuFormByButton() {
        this.menuForm.pid = this.menuForm.pid != 0 ? this.menuForm.pid : ''
        this.menuForm.redirect = ''
        this.menuForm.openMode = MenuConstant.open_mode_inner
        this.menuForm.icon = ''
        this.menuForm.path = ''
        this.menuForm.hidden = false
        this.menuForm.component = ''
      },
      /**
       * 菜单类型为子菜单重置
       */
      resetMenuFormByChild() {
        this.menuForm.pid = this.menuForm.pid != 0 ? this.menuForm.pid : ''
        this.menuForm.redirect = ''
        this.menuForm.permissionCode = ''
        this.menuForm.isDisable = false
      },
      /**
       * 菜单类型为一级菜单重置
       */
      resetMenuFormByParent() {
        this.menuForm.pid = 0
        this.menuForm.permissionCode = ''
        this.menuForm.isDisable = false
      },
      /**
       * 菜单类型改变事件
       */
      changeMenuType() {
        // 清除验证消息
        this.$refs['menuFormRef'].clearValidate()
        if (this.menuForm.menuType == MenuConstant.menu_type_parent) {
          // 如果菜单类型为 父菜单 禁用
          this.resetMenuFormByParent()
        } else if (this.menuForm.menuType == MenuConstant.menu_type_child) {
          // 如果菜单类型为 子菜单 禁用
          this.resetMenuFormByChild()
        } else if (this.menuForm.menuType == MenuConstant.menu_type_button) {
          // 如果菜单类型为 按钮 禁用
          this.resetMenuFormByButton()
        }
      },
      /**
       * 新增菜单
       */
      addMenu() {
        this.editVisible = true
      },
      /**
       * 添加菜单
       */
      addMenuClick(row){
        this.menuForm.pid = row.id
        this.menuForm.menuType = MenuConstant.menu_type_child
        this.editVisible = true
      },
      /**
       * 修改菜单
       */
      updateMenuClick(row) {
        delete row.children
        this.menuForm = JSON.parse(JSON.stringify(row))
        this.editVisible = true
        console.log(row)
      },
      /**
       * 查询菜单
       */
      getPermissionTree() {
        this.loading = true
        permissionTree().then(res => {
          this.menuList = res.data
          this.loading = false
        })
      }
    }

  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  const menuRules = {
    title: [{required: true, message: '请输入菜单标题', trigger: 'blur'}],
    pid: [{required: true, message: '请选择上级标题', trigger: 'blur'}],
    permissionCode: [{required: true, message: '请输入权限标识', trigger: 'blur'}],
    icon: [{required: true, message: '请选择菜单图标', trigger: 'blur'}],
    path: [{required: true, message: '请输入路径', trigger: 'blur'}],
    // component: [{required: true, message: '请输入菜单组件', trigger: 'blur'}],
    name: [{required: true, message: '请输入路由名称', trigger: 'blur'}],
    sortNo: [{required: false, message: '请输入菜单排序号', trigger: 'blur'}],
    hidden: [{required: false, message: '请选择是否隐藏', trigger: 'blur'}]

  }

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
    },
    {
      title: '路径',
      dataIndex: 'path',
    },
    {
      title: '组件',
      dataIndex: 'component',
    },
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: '权限',
      dataIndex: 'permissionCode',
    },
    {
      title: '类型',
      dataIndex: 'menuType',
      scopedSlots: {customRender: 'menuType'},
    },
    {
      title: '可见',
      dataIndex: 'hidden',
      scopedSlots: {customRender: 'hidden'},
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: {customRender: 'action'},
    },
  ];

</script>

<style>
  .operation {
    margin-left: 5px;
  }
</style>