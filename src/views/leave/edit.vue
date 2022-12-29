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
      <a-form
        ref="billForm"
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        class="leaveForm"
        @submit="saveBillInfo"
      >
        <!--请假开始时间   时间一组-->
        <div>
          <a-form-item :label="'开始' + dateType.label" name="begintime">
            <a-date-picker
              format="YYYY-MM-DD"
               show-time
              :placeholder="'请选择开始' + dateType.label"
              @change="selectDate(billInfo.begintime, 'begintime', '请选择开始' + dateType.label, dateType.type)"
              v-decorator="[
                'billInfo.begintime',
                {
                  rules: [{ required: true, message: '开始' + dateType.label }],
                },
              ]"
            />
          </a-form-item>
          <a-form-item :label="'结束' + dateType.label" name="endtime">
            <a-date-picker
              format="YYYY-MM-DD"
              :placeholder="'请选择结束' + dateType.label"
              @change="selectDate(billInfo.endtime, 'endtime', '请选择结束' + dateType.label, dateType.type)"
              v-decorator="[
                'billInfo.endtime',
                {
                  rules: [{ required: true, message: '结束' + dateType.label }],
                },
              ]"
            />
          </a-form-item>
        </div>

        <!--上下午标识-->
        <div v-if="StartEndDayTypeShow">
          <a-form-item label="开始时间">
            <a-select
              v-decorator="[
                StartEndDayType[billInfo.start_day_type],
                {
                  rules: [{ required: true }],
                },
              ]"
              placeholder="请选择开始时间"
              @change="selectStartDayType(billInfo.start_day_type, '开始时间', 'start_day_type')"
            >
              <a-select-option :value="item.value" v-for="(item, index) in StartEndDayTypeList" :key="index">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="结束时间">
            <a-select
              v-decorator="[
                StartEndDayType[billInfo.end_day_type],
                {
                  rules: [{ required: true }],
                },
              ]"
              placeholder="请选择结束时间"
              @change="selectStartDayType(billInfo.end_day_type, '结束时间', 'end_day_type')"
            >
              <a-select-option :value="item.value" v-for="(item, index) in StartEndDayTypeList" :key="index">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <!--请假说明-->
        <a-form-item label="请输入请假说明">
          <a-textarea
            v-model="billInfo.leaveremark"
            style="height: 130px"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入请假说明"
            show-word-limit
          />
        </a-form-item>

        <!--请假时长-->
        <a-form-item label="请假时长">
          <a-input v-model="billInfo.leaveday + HrkqMinUnit[billInfo.minunit]" disabled />
        </a-form-item>
        <!--剩余额度-->
        <a-form-item :label="billInfo.leavetypename + '剩余额度'">
          <a-input v-model="leaveTypeBalance + HrkqMinUnit[billInfo.minunit]" disabled />
        </a-form-item>
        <!--保存单据-->
        <SaveButton @save="saveBillInfo"></SaveButton>
      </a-form>
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
        } else if (leaveType.min_unit == '1') {
          this.dateType.label = '时间'
          this.dateType.type = 'datetime'
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
    },

    saveBillInfo() {
      if (!this.checkLeaveType()) {
        this.$message.error('请先选择休假类型')
        return
      }
      console.log(this.billInfo)
      this.form.validateFields(Object.keys(this.formRules)).then(() => {
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
