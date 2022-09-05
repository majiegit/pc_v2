<template>

  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-col :md="8" :sm="24">
      <!--加载中-->
      <a-spin :spinning="deptDataLoading">
        <!--部门列表区域-->
        <a-empty v-if="deptData.length == 0" description="暂无部门"/>
        <a-col :span="24">
          <a-tree
            @select="clickDeptData"
            showLine
            :autoExpandParent="true"
            :checkStrictly="true"
            :replaceFields="{title: 'name',key: 'id', children: 'children' }"
            :tree-data="deptData"
          />
        </a-col>
      </a-spin>
    </a-col>
    <a-col :md="16" :sm="24">
      <a-tabs :activeKey="defaultActiveKey" @change="changeTab">
        <a-tab-pane key="1" tab="基本信息">
          <DeptInfo :deptIdProp="selectedDeptId"  v-if="selectedDeptId"/>
          <a-empty description="请先选择一个部门" v-else/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="部门角色">
          <DeptRole :deptIdProp="selectedDeptId"  v-if="selectedDeptId"/>
          <a-empty description="请先选择一个部门" v-else/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="部门人员">
          <DeptUser :deptIdProp="selectedDeptId"  v-if="selectedDeptId"/>
          <a-empty description="请先选择一个部门" v-else/>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<script>
  import {queryMyDeptTree, getDeptById, deleteDept, deleteDeptBatch, saveDept} from '@/api/dept'
  import {queryDeptUserList, deleteDeptUser, saveDeptUser, deleteDeptUserBatch} from '@/api/deptUser'
  import {queryDictItemListByCode} from '@/api/dictItem'
  import {DictCode} from '@/utils/system/dictCode'
  import {DictConstant} from '@/utils/system/dictConstant'
  import ACol from "ant-design-vue/es/grid/Col";
  import SelectUser from '@/views/components/user/SelectUser'
  import ARow from "ant-design-vue/es/grid/Row";
  import DeptRole from "@/views/system/dept/DeptRole"
  import DeptUser from "@/views/system/dept/DeptUser"
  import DeptInfo from "@/views/system/dept/DeptInfo"

  export default {
    name: "dept",
    components: {ARow, ACol, SelectUser, DeptRole, DeptUser,DeptInfo},
    data() {
      return {
        // 当前部门 Id
        selectedDeptId: null,
        selectedDeptName: '',
        defaultActiveKey: '1',
        deptData: [],
        deptDataLoading: false // 部门树区域 Loading
      }
    },
    created() {
    },
    mounted() {
      this.getDeptData()
    },
    methods: {
      /**
       * 页签改变事件
       */
      changeTab(val) {
        this.defaultActiveKey = val
      },
      /**
       * 查询部门数据
       */
      getDeptData() {
        this.deptDataLoading = true
        let userId = this.$store.getters.userInfo.id
        queryMyDeptTree(userId).then(res => {
          this.deptDataLoading = false
          this.deptData = res.data  // 部门数据
        })
      },

      /**
       * 点击部门
       */
      clickDeptData(deptIds) {
        if (deptIds.length != 0) {
          let id = deptIds[0]
          this.selectedDeptId = id
        } else {
          this.selectedDeptId = null
          this.selectedDeptName = ''
        }
      }
    }
  }
</script>

<style scoped>
</style>