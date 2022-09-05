<template>
  <a-row type="flex">
    <a-col :span="24">
      <PermissionTree :treeData="permissionTreeData" :treeHeight="'600px'" :checkKeys="deptPermissionIds"
                      :loading="deptPermissionLoading"
                      :saveLoading="savePermissionLoading" @save="okDeptPermission"/>
    </a-col>
  </a-row>

</template>

<script>
  import ACol from "ant-design-vue/es/grid/Col";
  import PermissionTree from '@/views/components/permission/PermissionTree'
  import {permissionTree} from '@/api/permission'
  import {saveDeptPermission, queryDeptPermissionIds} from '@/api/deptPermission'

  export default {
    name: "DeptPermission",
    components: {ACol, PermissionTree},
    props:{
      /**
       * 当前部门ID
       */
      deptIdProp: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        // 部门权限
        deptPermissionIds: [],
        permissionTreeData: [],
        deptPermissionLoading: false,
        savePermissionLoading: false,
        deptId: this.deptIdProp
      }
    },
    watch: {
      deptIdProp(val) {
        this.deptId = val
        this.getDeptPermissionIds(val)
        this.getPermissionTree()
      }
    },
    mounted() {
      this.getDeptPermissionIds(this.deptIdProp)
      this.getPermissionTree()
    },
    methods: {
      /**
       * 保存部门权限
       */
      okDeptPermission(permissionIds) {
        let params = {
          deptId: this.deptId,
        }
        if (permissionIds) {
          params.permissionIds = permissionIds
        }
        this.savePermissionLoading = true
        saveDeptPermission(params).then(res => {
          this.$message.success(res.message)
          this.savePermissionLoading = false
          this.getDeptPermissionIds(this.deptId)
        })
      },
      /**
       * 查询部门权限Id 集合
       */
      getDeptPermissionIds(deptId) {
        this.deptPermissionLoading = true
        queryDeptPermissionIds(deptId).then(res => {
          this.deptPermissionIds = res.data
          this.deptPermissionLoading = false
        })
      },
      /**
       * 查询所有权限
       */
      getPermissionTree() {
        permissionTree().then(res => {
          this.permissionTreeData = res.data
        })
      }
    }
  }
</script>

<style scoped>
</style>