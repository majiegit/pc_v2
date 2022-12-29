<template>
  <div class="edit">
    
    1111
  </div>
</template>

<script>
import storage from 'store'

// import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
// import ApproveButton from '@/components/Button/ApproveButton'
import { saveLeaveBill, getLeaveBill, queryLeaveType, queryLeaveLength } from '@/api/leave'
import { approveStateName, whetherYN, StartEndDayType, HrkqMinUnit } from '@/utils/ConstantUtils'

export default {
  name: 'leaveApprove',
  // components: {Header, ApproveProcess, ApproveButton},
  data() {
    return {
      formRules,
      currentHeight: '',
      dateType: {
        label: '时间',
        type: 'datetime',
      },
      StartEndDayTypeShow: false, // 是否显示上下午
      StartEndDayType,
      HrkqMinUnit,
      billInfo: {
        pk_psndoc: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
        billmaker: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').user_id : '',
        pk_leave_type: '', // 请假类型PK
        leavetypename: '', // 休假类型名称
        leaveday: '', //请假时长
        minunit: '1',
        begintime: '',
        endtime: '',
        start_day_type: '',
        end_day_type: '',
      },
      leaveTypeList: [], // 休假类型集合
      leaveTypeBalance: '', // 休假类型剩额度
    }
  },
  watch: {},
  mounted() {
    this.queryLeaveType()
    setTimeout(() => {
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h)
      }
    }, 200)
  },
  methods: {
    //查询类型
    queryLeaveType() {
      queryLeaveType().then((res) => {
        this.leaveTypeList = res.data
      })
    },
    //查询单据
    queryBillInfo(pk_h) {
      let params = {
        billid: pk_h,
      }
      getLeaveBill(params).then((res) => {
        this.billInfo = res.data
      })
    },

    selectLeaveType(type) {
      // 改变休假类型 赋值
      this.billInfo.pk_leave_type = type.id
      this.billInfo.leavetypename = type.type_name
      this.billInfo.minunit = type.min_unit
      this.billInfo.endtime = ''
      this.billInfo.begintime = ''
      this.billInfo.leaveday = ''
    },
  },
}
const formRules = {
  leavetype: [
    {
      required: true,
      message: '',
    },
  ],
  begintime: [
    {
      required: true,
      message: '',
    },
  ],
  leaveendtime: [
    {
      required: true,
      message: '',
    },
  ],
  begintime: [
    {
      required: true,
      message: '',
    },
  ],
  leaveenddate: [
    {
      required: true,
      message: '',
    },
  ],
}
</script>

<style lang='less' scoped>
.edit {
  padding: 20px;
  height: 100%;
  background: #fff;
  .edit-body {
    height: 100%;
    padding: 10px 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(167, 167, 167, 0.4);
    overflow-y: scroll;
    .leave_type_button {
      margin: 10px 10px 0;
    }
  }
}
.item_body {
  width: 100%;
  overflow-y: auto;
  &_title {
    font-size: 14px;
    line-height: 14px;
    padding-left: 10px;
    color: #999;
  }
}

.button_bottom {
  position: fixed;
  width: 100%;
  height: 50px;
  padding: 5px 0px;
}

.fileClass {
  color: #2479ed;
  font-size: 14px;
  background: #fff;
  padding: 20px 10px;
}
</style>
