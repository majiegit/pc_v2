<template>
  <div class="edit">
    <!--销差记录-->
    <div v-if="waitTripShow">
      <tripRecord @getDetail="getTripBill"></tripRecord>
    </div>
    <!--销差详情-->
    <div v-else>
      <div class="edit_body">
        <p class="item_body_title">出差信息</p>
        <a-descriptions>
          <a-descriptions-item label="出差类型">
            {{ billInfo.triptypename }}
          </a-descriptions-item>
          <a-descriptions-item label="申请人">
            {{ billInfo.psndocname }}
          </a-descriptions-item>
          <a-descriptions-item  label="出差开始时间">
            {{ billInfo.tripbegintime }}
          </a-descriptions-item>
          <a-descriptions-item  label="出差结束时间">
            {{ billInfo.tripendtime}}
          </a-descriptions-item>
          <a-descriptions-item label="出差时长">
            {{billInfo.tripday + HrkqMinUnit[billInfo.minunit] }}
          </a-descriptions-item>
          <a-descriptions-item label="出差理由">
            {{ billInfo.remark }}
          </a-descriptions-item>
          <a-descriptions-item label="出差目的地">
            {{ billInfo.otapplylength }}
          </a-descriptions-item>
          <a-descriptions-item label="出差费用">
            {{ billInfo.cost }}
          </a-descriptions-item>
        </a-descriptions>
        <!--销差信息-->
        <p class="item_body_title">销差信息</p>
        <a-form  :form="form" input-align="right" colon ref="billForm" label-width="150px" :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }">
         <a-form-item label="销假原因"  name="dr_flag">
            <a-select
             :value="billInfo.dr_flag"
            placeholder="请选择销假原因"
            v-decorator="[
               'billInfo.dr_flag',
                {
                  rules: [{ required: true }],
                },
              ]"
              @change="selectClick(TripOffReasonList,'请选择销差原因','dr_flag', billInfo.dr_flag)"
              >
              <a-select-option :value="item.value" v-for="(item, index) in TripOffReasonList" :key="index">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!--销差时间开始时间   时间一组-->
          
          <a-form-item label="实际开始时间" name="tripoffbegintime">
            <a-date-picker
              format="YYYY-MM-DD"
               placeholder="'请选择实际开始时间'"
              @change="selectDate(billInfo.tripoffbegintime,'tripoffbegintime','实际开始时间','datetime')"
              v-decorator="[
                'billInfo.tripoffbegintime',
                {
                  rules: [{ required: true, message: '请选择实际开始时间'}],
                },
              ]"
            />
          </a-form-item>
          
          <a-form-item  label="实际结束时间" name="tripoffendtime">
            <a-date-picker
              format="YYYY-MM-DD"
              placeholder="'请选择实际结束时间"
              @change="selectDate(billInfo.tripoffendtime, 'tripoffendtime','请选择实际结束时间','datetime')"
              v-decorator="[
                'billInfo.tripoffendtime',
                {
                  rules: [{ required: true}],
                },
              ]"
            />
          </a-form-item>

          <!--销差理由-->
          <a-form-item label="销差理由">
          <a-textarea
            v-model="billInfo.tripoffremark"
            style="height: 130px"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入销差理由"
            show-word-limit
          />
        </a-form-item>

          <!--销差实际时长-->
          <a-form-item label="销差实际时长">
            <a-input v-model="billInfo.tripoffday + HrkqMinUnit[billInfo.minunit]" disabled />
          </a-form-item>
        </a-form>
        
      </div>
      <!--保存按钮-->
      <SaveButton @save="saveBillInfo"></SaveButton>
    </div>
  </div>
</template>

<script>
  import storage from 'store'
  import moment from 'moment'
  import tripRecord from "./compoents/tripRecord";
  import SaveButton from "@/components/Button/SaveButton";
  import {getTripoffBill, queryTripoffLength, saveTripoffBill} from '@/api/tripoff'
   import {
    approveStateName,
    whetherYN,
    StartEndDayType,
    StartEndDayTypeList,
    HrkqMinUnit,
    TripOffReasonList,
    TripOffReason
  } from '@/utils/ConstantUtils'
 // import {beginGtEndTime, beginEndSameDay} from '@/utils/DateTimeUtils'
  import {BillTypeCode} from '@/utils/ConstantUtils'
   export default {
    name: "tripoffEdit", 
    components: { tripRecord, SaveButton},
    data() {
      return {
        approveStateName,
        whetherYN,
        StartEndDayType,
        StartEndDayTypeList,
        HrkqMinUnit,
        TripOffReasonList,
        TripOffReason,
        formRules,
        waitTripShow: false, // 销差记录显示
         userInfoPkPsndoc : storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
        userInfoUserId: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').user_id : '',
        billInfo: {
          pk_psndoc: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
          billmaker: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').user_id : '',
          dr_flag: '0',
          minunit: '1',
          tripoffday: ''
        },
        form: this.$form.createForm(this, { name: 'coordinated' }),
      }
    },
    mounted() {
      
      // 有销差单Pk直接查销差单
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h)
      } else {
        // 新增销差单则选择出差记录
        this.waitTripShow = true
      }
    },
    created() {
    },
    watch: {},
    methods: {
      moment,
      /**
       * 销差原因上下午确认回调
       * @param selector
       * @param item
       */
      selectOk(selector, item) {
        this.$set(this.billInfo, selector.field, item.value)
      },
      /**
       *  选择销差原因
       */
      selectClick(data, title, field, value) {
        let selector = {
          data: data,
          title: title,
          field: field,
          text: 'text',
          key: 'value',
          value: value
        }
        // this.$refs.selector.openSelect(selector)
        this.$set(this.billInfo,selector.field, selector.value)
      },
      /**
       * 表单编辑后事件
       */
      afterEdit() {
        // 校验开始时间是否 > 结束时间
        // if (this.billInfo.tripoffbegintime && this.billInfo.tripoffendtime) {
        //   // 校验开始时间是否 > 结束时间
        //   let isGt = beginGtEndTime(this.billInfo.tripoffbegintime, this.billInfo.tripoffendtime)
        //   if (isGt) {
        //     Toast("实际开始时间不能大于实际结束时间")
        //     this.billInfo.tripoffendtime = ''
        //     return
        //   }
        //   this.getTripOffLength()
        // }
      },
      /**
       * 计算销差时长
       */
      getTripOffLength() {
        let params = {
          tripoffbegintime: this.billInfo.tripoffbegintime,
          tripoffendtime: this.billInfo.tripoffendtime,
          triptypeid: this.billInfo.triptypeid,
          minunit: this.billInfo.minunit
        }
         queryTripoffLength(params).then(res => {
          
          this.billInfo.tripoffday = res.data
        })
      },
      /**
       * 出差记录选择回调
       * @param data
       * @param Bool
       */
      getTripBill(trip) {
        this.billInfo.mainid = trip.pk_trip
        this.billInfo.tripendtime = trip.tripendtime
        this.billInfo.tripbegintime = trip.tripbegintime
        this.billInfo.tripday = trip.tripday
        this.billInfo.minunit = trip.minunit
        this.billInfo.triptypeid = trip.triptypeid
        this.billInfo.triptypename = trip.triptypename
        this.billInfo.psndocname = trip.psndocname
        this.billInfo.tripremark = trip.remark
        this.billInfo.tripremark = trip.destination
        this.billInfo.cost = trip.cost
        this.billInfo.handover = trip.handover
        this.waitTripShow = false
        this.title = '销差申请'
      },
      /**
       * 查询单据
       */
      queryBillInfo(pk_h) {
        let params = {
          billid: pk_h
        }
        getTripoffBill(params).then(res => {
          this.billInfo = res.data
          
        })
      },
      /**
       * 选择出差时间
       */
      selectDate(value, field, title, type) {
        let selector = {
          title: title,
          field: field,
          value: value,
          type: type
        }
       // this.$refs.selectorDate.openSelect(selector)
        this.$set(this.billInfo,selector.field, selector.value)
      },
      /**
       * 时间选择器确认回调
       * @param selector
       * @param item
       */
      dateOk(selector) {
        this.$set(this.billInfo, selector.field, selector.value)
        this.afterEdit()
      },
      // 保存
      saveBillInfo() {
        console.log(this.billInfo)
        this.form.validateFields(Object.keys(formRules)).then(() => {
          // 调用接口
          saveTripoffBill(this.billInfo).then(res => {
            this.$router.push({name: 'tripoffDetail', query: {pk_h: res.data.pk_tripoff}})
          })
        })
      },
      // 初始化数据
      init() {
        this.billInfo = {
          billmaker: userInfoUserId,
          pk_psndoc: userInfoPkPsndoc,
          dr_flag: '0',
          minunit: '1',
          tripoffday: ''
        }
        this.title = '出差记录选择'
      },
    }
  }
  // 表单校验规则
  const formRules = {
    dr_flag: [{
      required: true,
      message: ''
    }],
    tripoffbegintime: [{
      required: true,
      message: ''
    }],
    tripoffendtime: [{
      required: true,
      message: ''
    }],
    tripoff_start_day_type: [{
      required: true,
      message: ''
    }],
    tripoff_end_day_type: [{
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
