<template>
  <div class="edit">
    <div class="edit-body">
      <!--请假类别-->
      <div class="leave_type">
        <a-button
          class="leave_type_button"
          v-for="type in leaveTypeList"
          :type="billInfo.pk_leave_type === type.id ? 'primary' : 'default'"
          :key="type.id"
          @click="selectLeaveType(type)"
        >
          {{ type.type_name }}
        </a-button>
      </div>
      <!--请假表单-->
      <a-form-model
        ref="billForm"
        :form="form"
        :model="billInfo"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        :rules="formRules"
        class="leaveForm"
      >
        <!--请假开始时间   时间一组-->
        <div>
          <a-form-model-item :label="'开始' + dateType.label" prop="begintime" :rules="{ required: true, message: '请选择开始' + dateType.label, trigger: 'change'}">
            <a-date-picker
              :format="format"
              :placeholder="'请选择开始' + dateType.label"
              show-time
              required
              v-model="billInfo.begintime"
              @change="selectDate(billInfo.begintime, 'begintime', '请选择开始' + dateType.label, dateType.type)"
            />
           </a-form-model-item>
          <a-form-model-item :label="'结束' + dateType.label" prop="endtime" :rules="{ required: true, message: '请选择结束' + dateType.label, trigger: 'change'}">
            <a-date-picker
              :format="format"
              show-time
              :required="true"
              :placeholder="'请选择结束' + dateType.label"
              @change="selectDate(billInfo.endtime, 'endtime', '请选择结束' + dateType.label, dateType.type)"
            />
          </a-form-model-item>
        </div>

        <!--上下午标识-->
        <div v-if="StartEndDayTypeShow">
          <a-form-model-item label="开始时间" :prop ='StartEndDayTypeList[billInfo.start_day_type]'  :rules="{ required: true, message: '请选择开始时间', trigger: 'change'}">
            <a-select
              v-model="billInfo.start_day_type"
              :options="StartEndDayTypeList"
              placeholder="请选择开始时间"
              @change="selectStartDayType(billInfo.start_day_type, '开始时间', 'start_day_type')"
             
            >
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="结束时间" :prop ='StartEndDayTypeList[billInfo.end_day_type]'  :rules="{ required: true, message: '请选择结束时间', trigger: 'change'}">
            <a-select
              v-model="billInfo.start_day_type"
              :options="StartEndDayTypeList"
              placeholder="请选择结束时间"
              @change="selectStartDayType(billInfo.end_day_type, '结束时间', 'end_day_type')"
              
            >
            </a-select>
          </a-form-model-item>
        </div>

        <!--请假说明-->
        <a-form-model-item label="请输入请假说明">
          <a-textarea
            v-model="billInfo.leaveremark"
            style="height: 130px"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入请假说明"
            show-word-limit
          />
        </a-form-model-item>

        <!--请假时长-->
        <a-form-model-item label="请假时长">
          <a-input v-model="billInfo.leaveday + HrkqMinUnit[billInfo.minunit]" disabled />
        </a-form-model-item>
        <!--剩余额度-->
        <a-form-model-item :label="billInfo.leavetypename + '剩余额度'">
          <a-input v-model="leaveTypeBalance + HrkqMinUnit[billInfo.minunit]" disabled />
        </a-form-model-item>
        <!--保存单据-->
        <SaveButton @save="saveBillInfo"></SaveButton>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import storage from 'store'
import moment from 'moment'
import SaveButton from '@/components/Button/SaveButton'
import { getItem } from '@/utils/DataUtils'
import { saveLeaveBill, getLeaveBill, queryLeaveType, queryLeaveLength } from '@/api/leave'
import { approveStateName, StartEndDayTypeList, whetherYN, StartEndDayType, HrkqMinUnit } from '@/utils/ConstantUtils'
 import {beginGtEndTime, beginEndSameDay} from '@/utils/DateTimeUtils'
export default {
  name: 'leaveEdit',
  components: { SaveButton },
  data() {
    return {
      formRules,
      currentHeight: '',
      dateType: {
        label: '时间',
        type: 'datetime',
      },
      form: this.$form.createForm(this, { name: 'coordinated' }),
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
      StartEndDayTypeList: StartEndDayTypeList, // 休假类型剩额度
      format:'YYYY-MM-DD',
    }
  },
  watch: {
    // 监听休假类型
    'billInfo.pk_leave_type'(val) {
      // 处理显示字段
      let leaveType = getItem(this.leaveTypeList, 'id', val)
      if (leaveType) {
        if (leaveType.min_unit == '2') {
          this.dateType.label = '日期'
          this.dateType.type = 'date'
          this.format = 'YYYY-MM-DD'
         } else if (leaveType.min_unit == '1') {
          this.dateType.label = '时间'
          this.dateType.type = 'datetime'
          this.format = 'YYYY-MM-DD HH:mm:ss'
        }
        if (leaveType.min_time == '1' && leaveType.min_unit == '2') {
          this.StartEndDayTypeShow = true
        } else {
          this.StartEndDayTypeShow = false
        }
      }
    },
  },
  mounted() {
    this.queryLeaveType()
    setTimeout(() => {
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h)
      }
    }, 200)
  },
  methods: {
    moment,
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
      this.billInfo.leaveremark = ''
    },
    // 校验是否选择休假类型
    checkLeaveType() {
      let select = false
      if (this.billInfo.pk_leave_type) {
        select = true
      }
      return select
    },
    // 选择请假时间
    selectDate(value, field, title, type) {
      if (!this.checkLeaveType()) {
        this.$message.error('请先选择休假类型')
        return
      }
      let layout 
      if(type =='datetime'){
        layout ='YYYY-MM-DD HH:mm:ss'
      }else{
        layout ='YYYY-MM-DD'
      }
      let selector = {
        title: title,
        field: field,
        value: this.moment(value._d).format('YYYY-MM-DD'),
        type: type,
      }
      this.$set(this.billInfo, selector.field, selector.value)
      console.log(selector)
    },
    selectStartDayType(value, title, filed) {
      debugger
      if (!this.billInfo.begintime) {
        this.$message.error('请先选择开始日期')
        return
      }
      if (!this.billInfo.endtime) {
        this.$message.error('请先选择结束日期')
        return
      }
      let selector = {
        data: StartEndDayTypeList,
        title: title,
        field: filed,
        text: 'text',
        key: 'value',
        value: value,
      }
      this.$set(this.billInfo,selector.field, selector.value)
      this.selectMorningAfter()
    },
     /**
       * 上下午时间选择确认之后
       */
      selectMorningAfter() {
        // 显示上下午
        if (this.StartEndDayTypeShow) {
          // 上下午时 需设置开始日期和结束日期 加时间
          if (this.billInfo.start_day_type == '1') {
            this.billInfo.begintime = this.billInfo.begintime.substring(0, 10) + ' 08:00:00'
          }
          if (this.billInfo.start_day_type == '2') {
            this.billInfo.begintime = this.billInfo.begintime.substring(0, 10) + ' 20:00:00'
          }
          // 上下午时 需设置开始日期和结束日期 加时间
          if (this.billInfo.end_day_type == '1') {
            this.billInfo.endtime = this.billInfo.endtime.substring(0, 10) + ' 08:00:00'
          }
          if (this.billInfo.end_day_type == '2') {
            this.billInfo.endtime = this.billInfo.endtime.substring(0, 10) + ' 20:00:00'
          }
        } else {
          // 不显示上下午
          if(this.dateType.type == 'date'){
            if(this.billInfo.begintime){
              this.billInfo.begintime = this.billInfo.begintime.substring(0, 10) + ' 00:00:00'
            }
            if(this.billInfo.endtime){
              this.billInfo.endtime = this.billInfo.endtime.substring(0, 10) + ' 00:00:00'
            }
          }
        }
        this.afterEdit()
      },
        afterEdit() {
        // 校验开始时间是否 > 结束时间
        if (this.billInfo.begintime && this.billInfo.endtime) {
          // 校验开始时间是否 > 结束时间
          let isGt = beginGtEndTime(this.billInfo.begintime, this.billInfo.endtime)
          if (isGt) {
            Toast("开始时间不能大于结束时间")
            this.billInfo.endtime = ''
            return
          }
          // 判断表单是否显示上下午
          if (this.StartEndDayTypeShow) {
            // 有  判断开始时间日期上下午有一个为空 不执行计算时长
            if (!this.billInfo.begintime || !this.billInfo.endtime || !this.billInfo.start_day_type || !this.billInfo.end_day_type) {
              return
            }
          }
          this.getLeaveLength()
        }
      },
      /**
       * 计算请假时长
       */
      getLeaveLength() {
        let params = {
          begintime: this.billInfo.begintime,
          endtime: this.billInfo.endtime,
          pk_leave_type: this.billInfo.pk_leave_type,
          minunit: this.billInfo.minunit
        }
        Toast.loading({
          message: '计算请假时长中...',
          duration: 0
        })
        queryLeaveLength(params).then(res => {
          Toast.clear()
          this.billInfo.leaveday = res.data
        })
      },

    saveBillInfo() {
      if (!this.checkLeaveType()) {
        this.$message.error('请先选择休假类型')
        return
      }
      console.log(this.billInfo)
      this.$refs.billForm.validateField(Object.keys(this.formRules)).then(() => {
        // 校验保存数据
        if (this.billInfo.leaveday == '0' || this.billInfo.leaveday == '') {
          this.$message.error('请假时长不能为0')
          return
        }
        saveLeaveBill(this.billInfo).then((res) => {
          this.$router.push({ name: 'leaveDetail', query: { pk_h: res.data.pk_leave } })
        })
      })
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
