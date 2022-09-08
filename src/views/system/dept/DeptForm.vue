<template>
  <a-row type="flex" justify="center">
    <a-col :span="22">
      <a-spin :spinning="deptInfoLoading">
        <a-form-model :model="deptForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon
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
            <a-date-picker @change="changefoundDate" placeholder="请选择成立时间" :value="deptForm.foundDate ? moment(deptForm.foundDate, 'YYYY-MM-DD') : deptForm.foundDate"/>
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
</template>

<script>
  import {getDeptById, saveDept} from '@/api/dept'
  import {queryDictItemListByCode} from '@/api/dictItem'
  import {DictCode} from '@/utils/system/dictCode'
  import {DictConstant} from '@/utils/system/dictConstant'
  //设置中文
  import moment from 'moment';
  import 'moment/locale/zh-cn'
  moment.locale('zh-cn');
  export default {
    name: "DeptInfo",
    props: {
      /**
       * 当前部门ID
       */
      deptIdProp: {
        type: String,
        default: ''
      },
      deptDataProp: {
        type: Array,
        default: () => {
          return []
        }
      }

    },
    data() {
      return {
        saveDeptLoading: false, // 保存按钮Loading
        deptInfoLoading: false,
        deptId: this.deptIdProp,
        deptData: this.deptDataProp, // 所有部门数据
        deptForm: {
          status: 1
        },
        deptFormRules,
        deptTypeData: [],    // 部门类型
        moment
      }
    },
    watch: {
      deptIdProp(val) {
        this.deptId = val
        this.getDeptInfo(val)
        this.getDeptTypeData()
      }
    },
    mounted() {
      if (this.deptIdProp) {
        this.getDeptInfo(this.deptIdProp)
      }
      this.getDeptTypeData()
    },
    methods: {
      /**
       * 查询部门类型 => 数据字典
       */
      getDeptTypeData() {
        queryDictItemListByCode(DictCode.dept.deptType, DictConstant.dict_status_enable).then(res => {
          this.deptTypeData = res.data
        })
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
              this.$emit("saveDeptSuccess")
            }).catch(res => {
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
       * 成立时间
       */
      changefoundDate(date, dateString) {
        this.deptForm.foundDate = dateString
      },
      /**
       * 添加部门数据
       */
      addDeptForm() {
        this.deptFormInit()
        if (this.deptId) {
          this.deptForm.pid = this.deptId
        }
      },
      /**
       * 重置部门表单数据
       */
      resetDeptForm() {
        this.deptFormInit()
        if (this.deptId) {
          this.deptForm.id = this.deptId
        }
      },
      /**
       * 查询部门数据
       */
      getDeptInfo(deptId) {
        this.deptInfoLoading = true
        getDeptById(deptId).then(res => {
          this.deptForm = res.data
          this.deptInfoLoading = false
        }).catch(res => {
          this.deptInfoLoading = false
        })
      }
    },
  }

  const deptFormRules = {
    name: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
    code: [{required: true, message: '请输入部门编码', trigger: 'blur'}],
    foundDate: [{required: true, message: '请输入部门成立时间', trigger: 'blur'}],
    type: [{required: true, message: '请选择部门类型', trigger: 'blur'}],
    status: [{required: false, message: '请选择部门状态', trigger: 'blur'}]
  }
</script>

<style scoped>

</style>