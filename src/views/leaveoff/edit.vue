<template>
  <div class="edit">
    <div class="edit_body" >
     <!--销假记录-->
    <div v-if="waitLeaveShow">
      <leaveRecord @getDetail="getLeaveBill"></leaveRecord>
    </div>
    
    <!--销假详情-->
    <div v-else>
        <p class="item_body_title">请假信息</p>
         <a-descriptions>
          <a-descriptions-item :label="'请假开始' + (billInfo.minunit == '2' ? '日期' : '时间')">
            {{ billInfo.minunit == '2' ? billInfo.leavebegintime.substring(0, 10) : billInfo.leavebegintime }}
          </a-descriptions-item>
          <a-descriptions-item :label="'请假结束' + (billInfo.minunit == '2' ? '日期' : '时间')">
            {{ billInfo.minunit == '2' ? billInfo.leaveendtime.substring(0, 10) : billInfo.leaveendtime }}
          </a-descriptions-item>
          <a-descriptions-item v-if="billInfo.leave_start_day_type" label="开始时间">
            {{ StartEndDayType[billInfo.leave_start_day_type] }}
          </a-descriptions-item>
          <a-descriptions-item v-if="billInfo.leave_end_day_type" label="结束时间">
            {{ StartEndDayType[billInfo.leave_end_day_type] }}
          </a-descriptions-item>
          <a-descriptions-item label="请假时长">
            {{ billInfo.leaveday + HrkqMinUnit[billInfo.minunit] }}
          </a-descriptions-item>
          <a-descriptions-item label="休假说明">
            {{ billInfo.leaveremark }}
          </a-descriptions-item>
        </a-descriptions>
       
        <p class="item_body_title">销假信息</p>
        <a-form  :form="form" input-align="right" colon ref="billForm" label-width="150px" :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        class="leaveForm"
         >

         <a-form-item label="销假原因"  name="dr_flag">
            <a-select
             :value="billInfo.dr_flag"
            placeholder="请选择销假原因"
            v-decorator="[
                LeaveOffReason[billInfo.dr_flag],
                {
                  rules: [{ required: true }],
                },
              ]"
              @change="selectClick(LeaveOffReasonList,'销假原因','dr_flag', billInfo.dr_flag)"
              >
              <a-select-option :value="item.value" v-for="(item, index) in LeaveOffReasonList" :key="index">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          
          
          
          <!--销差开始时间   时间一组-->
        <div>
          <a-form-item :label="'实际开始' + dateType.label" name="leaveoffbegintime">
            <a-date-picker
             
              format="YYYY-MM-DD"
              :placeholder="'请选择实际开始' + dateType.label"
              @change="selectDate(billInfo.leaveoffbegintime,'leaveoffbegintime','请选择实际开始'+ dateType.label, dateType.type)"
              v-decorator="[
                'billInfo.leaveoffbegintime',
                {
                  rules: [{ required: true, message: '请选择实际开始' + dateType.label }],
                },
              ]"
            />
          </a-form-item>
        
          <a-form-item :label="'实际结束' + dateType.label" name="leaveoffendtime">
            <a-date-picker
              format="YYYY-MM-DD"
              name="leaveoffendtime"
            
              :placeholder="'请选择实际结束' + dateType.label"
              @change="selectDate(billInfo.leaveoffendtime, 'leaveoffendtime', '请选择结束' + dateType.label, dateType.type)"
              v-decorator="[
                'billInfo.leaveoffendtime',
                {
                  rules: [{ required: true}],
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
        <div v-if="billInfo.leave_start_day_type">
          <a-form-item label="实际开始时间" name="leaveoff_start_day_type">
            <a-select
             name="leaveoff_start_day_type"
              :rules="formRules.leaveoff_start_day_type"
              :value="StartEndDayType[billInfo.leaveoff_start_day_type]"
              v-decorator="[
                StartEndDayType[billInfo.leaveoff_start_day_type],
                {
                  rules: [{ required: true }],
                },
              ]"
              placeholder="请选择实际开始时间"
              @click="selectClick(StartEndDayTypeList, '实际开始时间', 'leaveoff_start_day_type',billInfo.leaveoff_start_day_type)"
            >
              <a-select-option :value="item.value" v-for="(item, index) in StartEndDayTypeList" :key="index">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="实际结束时间" v-if="billInfo.leave_end_day_type"  name="leaveoff_end_day_type">
            <a-select
            name="leaveoff_end_day_type"
            :rules="formRules.leaveoff_end_day_type"
            :value="StartEndDayType[billInfo.leaveoff_end_day_type]"
              v-decorator="[
                StartEndDayType[billInfo.leaveoff_end_day_type],
                {
                  rules: [{ required: true }],
                },
              ]"
              placeholder="请选择实际结束时间"
              @click="selectClick(StartEndDayTypeList, '实际结束时间', 'leaveoff_end_day_type',billInfo.leaveoff_end_day_type)"
            >
              <a-select-option :value="item.value" v-for="(item, index) in StartEndDayTypeList" :key="index">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
         <!--销假说明-->
        <a-form-item label="销假说明">
          <a-textarea
            v-model="billInfo.leaveoffremark"
            style="height: 130px"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入销假说明"
            show-word-limit
          />
        </a-form-item>
        <a-form-item label="销假实际时长">
           <a-input v-model="billInfo.leaveoffday + HrkqMinUnit[billInfo.minunit]" disabled />
        </a-form-item>
          
        </a-form>
        <SaveButton @save="saveBillInfo"></SaveButton>
      </div>
      
      
    </div>
    
  </div>
</template>

<script>
  import storage from 'store'
  import moment from 'moment'
  import SaveButton from "@/components/Button/SaveButton";
  import leaveRecord from "./compoents/leaveRecord";
  import {getLeaveoffBill, queryLeaveoffLength, saveLeaveoffBill,queryLeaveIsRevoked} from '@/api/leaveoff'
  import {
    approveStateName,
    whetherYN,
    StartEndDayType,
    StartEndDayTypeList,
    HrkqMinUnit,
    LeaveOffReasonList,
    LeaveOffReason
  } from '@/utils/ConstantUtils'
  
  import {BillTypeCode} from '@/utils/ConstantUtils'


  export default {
    name: 'leaveoffEdit',
    components: {SaveButton,leaveRecord},
    data() {
      return {
        form: this.$form.createForm(this, { name: 'coordinated' }),
        approveStateName,
        whetherYN,
        StartEndDayType,
        StartEndDayTypeList,
        HrkqMinUnit,
        LeaveOffReasonList,
        LeaveOffReason,
        formRules,
        title: '请假记录选择',
        waitLeaveShow: false, // 销假记录显示
        dateType: {
          label: '时间',
          type: 'datetime'
        },
        leaveList: [],
        activeKey:['0'],
        userInfoPkPsndoc : storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
        userInfoUserId: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').user_id : '',
        billInfo: {
          pk_psndoc: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
          billmaker: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').user_id : '',
          dr_flag: '0',
          minunit: '1',
          leaveoffday: '',
          leaveoffbegintime: '',
          leaveoffendtime: '',
           endtime: '',
          leave_start_day_type: '',
          leave_end_day_type: '',
        }
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      // 有销假单Pk直接查销假单
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h)
      } else {
        // 新增销假单则选择请假记录
        this.waitLeaveShow = true
      }
    },
    created() {
       
    },
    watch: {
      // 监听最小单位 决定显示日期还是时间
      'billInfo.minunit'(val) {
        if (val == '2') {
          this.dateType.label = '日期'
          this.dateType.type = 'date'
        } else if (val == '1') {
          this.dateType.label = '时间'
          this.dateType.type = 'datetime'
        }
      }
    },
    methods: {
     
     moment,
      // 上下午时间选择确认之后
       
      selectMorningAfter() {
        debugger
        // 是否显示上下午
        if (this.billInfo.leave_start_day_type && this.billInfo.leave_end_day_type) {
          // 上下午时 需设置开始日期和结束日期 加时间
          if (this.billInfo.leaveoff_start_day_type == '1') {
            this.billInfo.leaveoffbegintime = this.billInfo.leaveoffbegintime.substring(0, 10) + ' 08:00:00'
          }
          if (this.billInfo.leaveoff_start_day_type == '2') {
            this.billInfo.leaveoffbegintime = this.billInfo.leaveoffbegintime.substring(0, 10) + ' 20:00:00'
          }
          // 上下午时 需设置开始日期和结束日期 加时间
          if (this.billInfo.leaveoff_end_day_type == '1') {
            this.billInfo.leaveoffendtime = this.billInfo.leaveoffendtime.substring(0, 10) + ' 08:00:00'
          }
          if (this.billInfo.leaveoff_end_day_type == '2') {
            this.billInfo.leaveoffendtime = this.billInfo.leaveoffendtime.substring(0, 10) + ' 20:00:00'
          }
        } else {
          // 不显示上下午
          if (this.dateType.type == 'date') {
            if (this.billInfo.leaveoffbegintime) {
              this.billInfo.leaveoffbegintime = this.billInfo.leaveoffbegintime.substring(0, 10) + ' 00:00:00'
            }
            if (this.billInfo.leaveoffendtime) {
              this.billInfo.leaveoffendtime = this.billInfo.leaveoffendtime.substring(0, 10) + ' 00:00:00'
            }
          }
        }
        this.afterEdit()
      },
      /**
       * 表单编辑后事件
       */
      afterEdit() {
        debugger
        // 校验开始时间是否 > 结束时间
        if (this.billInfo.leaveoffbegintime && this.billInfo.leaveoffendtime) {
          // 校验开始时间是否 > 结束时间
          let isGt = beginGtEndTime(this.billInfo.leaveoffbegintime, this.billInfo.leaveoffendtime)
          if (isGt) {
            this.$message.error("实际开始时间不能大于实际结束时间")
            this.billInfo.leaveoffendtime = ''
            return
          }
          // 判断表单是否显示上下午
          if (this.billInfo.leave_start_day_type && this.billInfo.leave_end_day_type) {
            // 有  判断开始时间日期上下午有一个为空 则不执行计算时长
            if (!this.billInfo.leaveoffbegintime || !this.billInfo.leaveoffendtime || !this.billInfo.leaveoff_start_day_type || !this.billInfo.leaveoff_end_day_type) {
              return
            }
          }
          this.getLeaveOffLength()
        }
      },
      /**
       * 计算销假时长
       */
      getLeaveOffLength() {
        debugger
        let params = {
          leaveoffbegintime: this.billInfo.leaveoffbegintime,
          leaveoffendtime: this.billInfo.leaveoffendtime,
          pk_leave_type: this.billInfo.pk_leave_type,
          minunit: this.billInfo.minunit
        }
        queryLeaveoffLength(params).then(res => {
           this.billInfo.leaveoffday = res.data
        })
      },
      // 开始/结束时间日期显示值
      getShowDateTimeValue(field) {
        let value = ''
        if (this.billInfo[field]) {
          if (this.dateType.type == 'datetime') {
            // 时间类型
            value = this.billInfo[field]
          } else if (this.dateType.type == 'date') {
            // 日期类型
            value = this.billInfo[field].substring(0, 10)
          }
        }
        return value
      },
      /**
       * 销假原因上下午确认回调
       * @param selector
       * @param item
       */
      selectOk(selector, item) {
        console.log(selector)
        console.log(item)
        this.$set(this.billInfo, selector.field, item.value)
        this.selectMorningAfter()
      },
      // 选择销假原因/ 上下午
      
      selectClick(data, title, field, value) {
        let selector = {
          data: data,
          title: title,
          field: field,
          text: 'text',
          key: 'value',
          value: value
        }
        this.$set(this.billInfo,selector.field, selector.value)
        this.selectMorningAfter()
      },
      /**
       * 请假记录选择回调
       * @param data
       * @param Bool
       */
      getLeaveBill(leave) {
        
        this.billInfo.mainid = leave.pk_leave
        this.billInfo.leaveendtime = leave.endtime
        this.billInfo.leavebegintime = leave.begintime
        this.billInfo.leaveday = leave.leaveday
        this.billInfo.leave_start_day_type = leave.start_day_type
        this.billInfo.leave_end_day_type = leave.end_day_type
        this.billInfo.minunit = leave.minunit
        this.billInfo.pk_leave_type = leave.pk_leave_type
        this.billInfo.leavetypename = leave.leavetypename
        this.billInfo.psndocname = leave.psndocname
        this.billInfo.leaveremark = leave.leaveremark
        this.waitLeaveShow = false
        this.title = '销假申请'
      },
      /**
       * 查询单据
       */
      queryBillInfo(pk_h) {
        let params = {
          billid: pk_h
        }
        getLeaveoffBill(params).then(res => {
          this.billInfo = res.data
         
        })
      },
      //选择请假时间
      
      selectDate(value, field, title, type) {
        debugger
        let selector = {
          title: title,
          field: field,
          value: value,
          type: type
        }
        this.$set(this.billInfo,selector.field, selector.value)
        this.selectMorningAfter()
      },
      
      // 保存
      saveBillInfo() {
        console.log(this.billInfo)
        this.form.validateFields(Object.keys(formRules)).then(() => {
          // 调用接口
          saveLeaveoffBill(this.billInfo).then(res => {
           this.$router.push({name: 'leaveoffDetail', query: {pk_h: res.data.pk_leaveoff}})
          })
        })
      },
      // 初始化数据
      init() {
        this.billInfo = {
          billmaker: this.userInfoUserId,
          pk_psndoc: this.userInfoPkPsndoc,
          dr_flag: '0',
          minunit: '1',
          leaveoffday: ''
        }
        this.title = '请假记录选择'
      },
      
    }
  }
  // 表单校验规则
  const formRules = {
    dr_flag: [{
      required: true,
      message: ''
    }],
    leaveoffbegintime: [{
      required: true,
      message: ''
    }],
    leaveoffendtime: [{
      required: true,
      message: ''
    }],
    leaveoff_start_day_type: [{
      required: true,
      message: ''
    }],
    leaveoff_end_day_type: [{
      required: true,
      message: ''
    }],
  }
</script>

<style lang='less'>
  // 所有考勤统一样式
.edit {
  padding: 20px;
  height: 100%;
  background: #fff;
  .edit-body{
    height: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(167, 167, 167, 0.4);
    overflow-y: scroll;
    
   
  }
  .item_body_title {
      font-size: 16px;
      line-height: 14px;
      padding: 5px;
      color: #999;
      border-left: 3px solid #2b80ff;
    }
}

</style>
