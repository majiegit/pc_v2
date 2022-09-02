<template>
  <a-row type="flex">
    <a-col :span="24">
      <a-spin :spinning="deptInfoLoading">
        <a-list size="small" bordered :data-source="deptInfoKeys">
          <a-list-item slot="renderItem" slot-scope="item, index" style="padding: 0px;">
            <a-col :span="6" style="background: #fafafa; padding: 8px;">
              {{item.title}}
            </a-col>
            <a-col :span="17" offset="1">
              <span v-if="item.key == 'type'"></span>
              <span v-else>{{dept[item.key]}}</span>
            </a-col>
          </a-list-item>
        </a-list>
      </a-spin>
    </a-col>
  </a-row>
</template>

<script>
  import {getDeptById} from '@/api/dept'

  export default {
    name: "DeptInfo",
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
        this.getDeptInfo(val)
      }
    },
    mounted() {
      this.getDeptInfo(this.deptIdProp)
    },
    methods: {
      getDeptInfo(deptId) {
        this.deptInfoLoading = true
        getDeptById(deptId).then(res => {
          this.dept = res.data
          this.deptInfoLoading = false
        }).catch(res => {
          this.deptInfoLoading = false
        })
      }
    },
    data() {
      return {
        deptInfoLoading: false,
        deptId: this.deptIdProp,
        dept: {},
        deptInfoKeys
      }
    }
  }
  const deptInfoKeys = [
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
  ]
</script>

<style scoped>

</style>