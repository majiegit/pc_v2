<template>
  <div>
    <Header ></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <a-form input-align="right" ref="billForm" colon :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }">
        <!--   出差类型     -->
        <a-form-item label="出差类型" name="triptypeid">
            <a-select
              :value="billInfo.dr_flag"
              :rules="formRules.triptypeid"
              placeholder="请选择出差类型"
              v-decorator="[
                'billInfo.dr_flag',
                {
                  rules: [{ required: true }],
                },
              ]"
              @change="selectClick(tripTypeList, '请选择出差类型', 'name', 'id', billInfo.triptypeid)"
            >
              <a-select-option :value="item.value" v-for="(item, index) in tripTypeList" :key="index">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="开始时间" name="tripbegintime">
            <a-date-picker
              format="YYYY-MM-DD"
              placeholder="'请选择开始时间'"
              @change="selectDate(billInfo.tripbegintime, 'tripbegintime', '开始时间', 'datetime')"
              v-decorator="[
                'billInfo.tripbegintime',
                {
                  rules: [{ required: true, message: '请选开始时间' }],
                },
              ]"
            />
          </a-form-item>

          <a-form-item label="结束时间" name="tripbegintime">
            <a-date-picker
              format="YYYY-MM-DD"
              placeholder="'请选择结束时间"
              @change="selectDate(billInfo.tripendtime, 'tripendtime', '请选择结束时间', 'datetime')"
              v-decorator="[
                'billInfo.tripendtime',
                {
                  rules: [{ required: true }],
                },
              ]"
            />
          </a-form-item>
        

         <a-form-item label="出差费用">
            <a-input v-model="billInfo.cost"  type="number"
          placeholder="请输入出差费用" />
          </a-form-item>
        <a-form-item label="交接人">
            <a-input v-model="billInfo.handover" 
          placeholder="请输入交接人" />
          </a-form-item>

        <a-form-item label="目的地">
            <a-input v-model="billInfo.destination"  :rules="formRules.destination"
          placeholder="请输入出差目的地" />
          </a-form-item>

       <a-form-item label="出差理由">
            <a-textarea
              v-model="billInfo.remark"
              style="height: 130px"
              autosize
              type="textarea"
              maxlength="50"
              placeholder="请输入销差理由"
              show-word-limit
            />
          </a-form-item>

          <a-form-item label="出差时长">
            <a-input :value="billInfo.tripday + HrkqMinUnit[billInfo.minunit]" disabled />
          </a-form-item>
        
      </a-form>
    </div>
    <!--保存按钮-->
    <SaveButton @save="saveBillInfo"/>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  // import Select from '@/components/Selector/Select'
  // import SelectDate from '@/components/Selector/SelectDate'
  import SaveButton from '@/components/Button/SaveButton'
  import {beginGtEndTime} from '@/utils/DateTimeUtils'
  import {saveTripBill, getTripBill, queryTripType, queryTripLength} from '@/api/trip'
  import {HrkqMinUnit} from '@/utils/ConstantUtils'
  export default {
    data() {
      return {
        HrkqMinUnit,
        formRules,
        tripTypeList: [],
        currentHeight: '',
        userInfoPkPsndoc: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
        userInfoUserId: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').user_id : '',
        billInfo: {
          pk_psndoc: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
          billmaker: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').user_id : '',
          triptypeid: '',
          triptypename: '',
          minunit: '2',
          tripday: ''
        },
      }
    },
    components: {Header, Select, SelectDate, SaveButton},
    created() {
    },
    watch: {
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 54) + 'px'
      // 判断是修改还是新增
      this.queryTripType()
      setTimeout(() => {
        if (this.$route.query.pk_h) {
          this.queryBillInfo(this.$route.query.pk_h)
        }
      }, 200)
    },
    methods: {
      /**
       * 查询出差类型
       */
      queryTripType() {
        queryTripType().then(res => {
          this.tripTypeList = res.data
        })
      },
      /**
       * 查询单据
       */
      queryBillInfo(pk_h) {
       let params = {
          billid: pk_h
        }
        getTripBill(params).then(res => {
          this.billInfo = res.data
        })
      },
      /**
       *  下来框选择事件
       */
      selectData(data, title, field, text, key, value) {
        let selector = {
          data: data,
          title: title,
          field: field,
          text: text,
          key: key,
          value: value
        }
        this.$refs.selector.openSelect(selector)
      },
      /**
       * 选择器确认回调
       * @param selector
       * @param item
       */
      selectOk(selector, item) {
        console.log(selector, item)
        this.$set(this.billInfo, selector.field, item[selector.key])
        // 出差类型
        if(selector.field == 'triptypeid'){
          this.$set(this.billInfo,'triptypename', item.name)
          this.$set(this.billInfo,'minunit', item.unit)
        }
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
      /**
       * 选择时间
       */
      selectDate(value, field, title, type) {
        if(!this.billInfo.triptypeid){
          this.$message.error("请先选择出差类型")
          return
        }
        let selector = {
          title: title,
          field: field,
          value: value,
          type: type
        }
        this.$refs.selectorDate.openSelect(selector)
      },
      /**
       * 表单编辑后事件
       */
      afterEdit() {
        // 校验开始时间是否 > 结束时间
        if (this.billInfo.tripbegintime && this.billInfo.tripendtime) {
          // 校验开始时间是否 > 结束时间
          let isGt = beginGtEndTime(this.billInfo.tripbegintime, this.billInfo.tripendtime)
          if (isGt) {
            this.$message.error("开始时间不能大于结束时间")
            this.billInfo.tripendtime = ''
            return
          }
          this.getTripLength()
        }
      },
      /**
       * 计算出差时长
       */
      getTripLength() {
        let params = {
          tripbegintime: this.billInfo.tripbegintime,
          tripendtime: this.billInfo.tripendtime,
          triptypeid: this.billInfo.triptypeid,
          minunit: this.billInfo.minunit
        }
        queryTripLength(params).then(res => {
          this.billInfo.tripday = res.data
        })
      },
      /**
       * 保存单据
       */
      saveBillInfo() {
        this.$refs.billForm.validate(Object.keys(this.formRules)).then(() => {
           saveTripBill(this.billInfo).then(res => {
           this.$router.push({name: 'tripDetail', query: {pk_h: res.data.pk_trip}})
          })
        })
      },
    }
  }
  // 表单校验规则
  const formRules = {
    triptypeid: [{
      required: true,
      message: ''
    }],
    tripbegintime: [{
      required: true,
      message: ''
    }],
    tripendtime: [{
      required: true,
      message: ''
    }],
    destination: [{
      required: true,
      message: ''
    }]
  }
</script>

<style lang='less' scoped>
</style>
