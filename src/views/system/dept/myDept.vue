<template>

  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-col :md="12" :sm="24">
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
    <a-col :md="12" :sm="24">
      <a-tabs :activeKey="defaultActiveKey" @change="changeTab">
        <a-tab-pane key="1" tab="基本信息">
          <a-row type="flex" >
            <a-col :span="24">
              <a-spin :spinning="deptInfoLoading">
                <a-empty v-if="!editDeptStatus" description="请先选择一个部门"/>
                <a-list size="small" bordered :data-source="deptInfoKeys" v-else>
                  <a-list-item slot="renderItem" slot-scope="item, index" style="padding: 0px;">
                    <a-col :span="6" style="background: #fafafa; padding: 8px;">
                      {{item.title}}
                    </a-col>
                    <a-col :span="17" offset="1">
                      <span v-if="item.key == 'type'"></span>
                      <span v-else>{{deptForm[item.key]}}</span>
                    </a-col>
                  </a-list-item>
                </a-list>
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
            <a-col :span="24" style="overflow: auto;">
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
        <a-tab-pane key="3" tab="部门角色">
          <a-empty v-if="!editDeptStatus" description="请先选择一个部门"/>
          <DeptRole/>
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
  import {queryMyDeptTree, getDeptById, deleteDept, deleteDeptBatch, saveDept} from '@/api/dept'
  import {queryDeptUserList, deleteDeptUser, saveDeptUser, deleteDeptUserBatch} from '@/api/deptUser'
  import {queryDictItemListByCode} from '@/api/dictItem'
  import {DictCode} from '@/utils/system/dictCode'
  import {DictConstant} from '@/utils/system/dictConstant'
  import ACol from "ant-design-vue/es/grid/Col";
  import SelectUser from '@/views/components/user/SelectUser'
  import ARow from "ant-design-vue/es/grid/Row";
  import DeptRole from "@/views/system/dept/DeptRole"

  export default {
    name: "dept",
    components: {ARow, ACol, SelectUser, DeptRole},
    data() {
      return {
        deptInfoKeys: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '编码',
            key: 'code'
          },
          {
            title: '类型',
            key: 'type'
          },
          {
            title: '排序',
            key: 'orderNo'
          },
          {
            title: '地址',
            key: 'address'
          },
          {
            title: '手机号',
            key: 'tel'
          },
          {
            title: '备注',
            key: 'remark'
          },
        ],
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
       * 部门数据表单 初始化
       */
      deptFormInit() {
        this.deptForm = {
          status: 1
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