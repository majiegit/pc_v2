<template>
  <div style="height: 100%">
    <Header></Header>
    <div class="salary" :style="{ height: currentHeight }">
      <div class="salary-body" v-if="salaryData.length != 0">
        <div class="selsecData">
          <span>薪资期间</span>
          <a-month-picker
            v-model="beginDate"
            :disabled-date="disabledStartDate"
            :default-value="moment('2015-06', 'YYYY-MM')"
            format="YYYY-MM"
            placeholder="开始日期"
            @openChange="handleStartOpenChange"
            @change="Startchange"
          />
          ~
          <a-month-picker
            v-model="endDate"
            :disabled-date="disabledEndDate"
            :default-value="moment('2015-07', 'YYYY-MM')"
            format="YYYY-MM"
            placeholder="结束日期"
            :open="endOpen"
            @change="Endchange"
            @openChange="handleEndOpenChange"
          />
          <a-button type="primary" @click="querySalaryData"> 查询 </a-button>
        </div>
        <div class="salary_total gutter-example">
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="22">
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="6" v-for="(item, index) in summarizing" :key="index">
                  <div :class="item.color" class="salary_total_item">
                    <div>{{ item.title }}</div>
                    <div class="right">
                      {{ (salaryData && salaryData.summarySalary && salaryData.summarySalary[item.field]) || 0 }}
                    </div>
                  </div>
                </a-col>
              </a-row>
            </a-col>
            <a-col class="gutter-row more-col" :span="2">
              <div class="more" @click="more = true">更多</div>
            </a-col>
          </a-row>
        </div>
        <div class="salary_username">
          <span class="name">{{ userinfo.name }}</span>
          <span class="orgname">{{ userinfo.orgname }}</span>
        </div>
        <div class="salary_List gutter-example">
          <a-row :gutter="16">
            <a-col
              class="gutter-row"
              :span="6"
              v-for="(list, index) in salaryData.salaryList"
              :key="index"
              @click="getsalaryitem(list)"
            >
              <a-row type="flex">
                <div class="flex paySlipVOs">
                  <span>{{ list.cyear }}年{{ list.cperiod }}月</span>
                  <span class="right">{{ list.name }}</span>
                </div>
                <a-col :span="24" class="paySlipVOs" v-for="(item, index2) in summarizing" :key="index2">
                  <span>{{ item.title }}:</span>
                  <span class="right">{{ list[item.field] }}</span>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </div>
      <a-modal
        :title="title"
        :width="500"
        :visible="visible"
        :confirm-loading="confirmLoading"
        :closable="setIconvisible"
        @cancel="clickCloseIcon()"
      >
        <div class="verify" v-show="checkPwdShow">
          <a-form :form="form1" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit1">
            <a-form-item label="薪资密码">
              <a-input
                placeholder="请输入薪资密码"
                type="password"
                v-model="password"
                v-decorator="[
                  'password',
                  {
                    rules: [{ required: true, message: '请输入薪资密码' }],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
              <a-button type="primary" class="btn" html-type="submit"> 验证 </a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="submit" v-show="updatePwdShow">
          <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit">
            <a-form-item label="旧密码">
              <a-input
                placeholder="请输入旧密码"
                type="password"
                v-model="oldPassword"
                v-decorator="[
                  'oldPassword',
                  {
                    rules: [{ required: true, message: '请输入旧密码' }],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item label="新密码">
              <a-input
                placeholder="请输入新密码"
                type="password"
                v-model="newPassword"
                v-decorator="[
                  'newPassword',
                  {
                    rules: [{ required: true, message: '请输入新密码' }],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item label="确认密码">
              <a-input
                placeholder="请确认密码"
                type="password"
                v-model="confirmPassword"
                v-decorator="[
                  'confirmPassword',
                  {
                    rules: [{ required: true, message: '请确认密码' }],
                  },
                ]"
              />
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
              <a-button type="primary" class="btn" html-type="submit"> 确认 </a-button>
            </a-form-item>
          </a-form>
        </div>

        <template slot="footer" class="footer">
          <a-row type="flex">
            <a-col :span="12"> 首次使用请先重置密码 </a-col>
            <a-col :span="12" class="moreEvent2">
              <span @click="resetPwd">重置密码</span>
              <span @click="updateShow">修改密码</span>
            </a-col>
          </a-row>
        </template>
      </a-modal>
      <a-modal
        title="问题"
        :width="500"
        :visible="question"
        :confirm-loading="confirmLoading"
        :closable="false"
        @cancel="question = false"
        @ok="onSubmit"
      >
        <a-textarea
          v-model="problem"
          style="height: 130px"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入所在问题"
          show-word-limit
        />
      </a-modal>
      <a-drawer
        :title="modeltitle"
        width="600px"
        :maskClosable="true"
        :visible="drawer_show"
        @close="drawer_show = false"
      >
        <a-row :gutter="24" v-for="(item, index) in paySlipVOs" :key="index" class="drawer-data">
          <a-col :span="12">
            {{ item.name }}
          </a-col>
          <a-col :span="12">
            {{ item.value }}
          </a-col>
        </a-row>
        <div class="footer-but" v-if="salaryConfirmList && salaryConfirmList.length == 0">
          <a-button type="primary" size="large" @click="question = true">有问题</a-button>
          <a-button type="primary" size="large" ghost @click="submitOk">没问题</a-button>
        </div>
      </a-drawer>
      <a-modal title="更多合计" :width="500" :visible="more" :confirm-loading="confirmLoading" @cancel="more = false">
        <a-row :gutter="24" v-for="(item, index) in summarySalaryItems" :key="index" class="more-model">
          <a-col :span="12">
            {{ item.name }}
          </a-col>
          <a-col :span="12">
            {{ item.value }}
          </a-col>
        </a-row>
        <template slot="footer">
          <a></a>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import storage from 'store'
import Header from '@/components/Header/Index'
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import {
  querySalaryData,
  enablePwd,
  updatePwd,
  restPwd,
  checkPwd,
  salaryConfirmSave,
  salaryConfirmList,
} from '@/api/salary'

export default {
  name: 'salary',
  components: { Header },
  data() {
    return {
      loading: true,
      visible: true,
      question: false,
      setIconvisible: false,
      more: false,
      title: '薪资密码验证',
      modeltitle: '',
      drawer_show: false,
      confirmLoading: false,
      checkPwdShow: true,
      updatePwdShow: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      form1: this.$form.createForm(this, { name: 'coordinated1' }),
      password: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      salaryData: [],
      beginDate: '',
      endDate: '',
      mode2: ['month', 'month'],
      value: [],
      summarizing: [
        {
          title: '应发汇总',
          field: 'f_1',
          color: 'yellow',
        },
        {
          title: '实发汇总',
          field: 'f_3',
          color: 'blove',
        },
        {
          title: '扣税汇总',
          field: 'f_5',
          color: 'yellow',
        },
        {
          title: '扣款汇总',
          field: 'f_2',
          color: 'blove',
        },
      ],
      salaryData: [],
      beginDate: null,
      endDate: null,
      endOpen: false,
      userInfoPkPsndoc: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
      userinfo: storage.get('Hrsh-Pc-UserInfo'),
      checkPwdShow: true, // 验证密码
      enableSalaryPwd: true, // 是否需要薪资密码验证
      problem: '',
      summarySalaryItems: [], //合计项
      salaryDetail: [],
      paySlipVOs: [],
      userInfo: storage.get('Hrsh-Pc-UserInfo'),
      result: '有问题',
      salaryConfirmList: [],
      currentHeight: '',
    }
  },
  computed: {},
  created() {
    this.currentHeight = document.documentElement.clientHeight - 74 + 'px'
    //this.querySalaryData()
  },

  mounted() {
    // 判断是否启用薪资密码验证
    this.queryEnablePwd()
    // 初始化查询日期
    this.initYearMonth()
  },
  methods: {
    moment,
    disabledStartDate(startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    //开始日期格式化
    Startchange(e) {
      this.beginDate = this.moment(e._d).format('YYYY-MM')
    },
    //结束日期格式化
    Endchange(e) {
      this.endDate = this.moment(e._d).format('YYYY-MM')
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },

    // 修改密码
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            pk_psndoc: this.userInfoPkPsndoc,
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          }
          updatePwd(params).then((res) => {
            if (res.code == '200') {
              this.$message.success(res.message)
              this.clickCloseIcon()
            }
          })
        }
      })
    },
    //验证密码
    handleSubmit1(e) {
      e.preventDefault()
      this.form1.validateFields((err, values) => {
        if (!err) {
          let params = {
            password: this.password,
          }
          checkPwd(params).then((res) => {
            if (res.code == '200') {
              this.$message.success(res.message)
              this.visible = false
              this.querySalaryData()
            }
          })
        }
      })
    },

    // 重置密码
    resetPwd() {
      let params = {
        pk_psndoc: this.userInfoPkPsndoc,
      }
      let _this = this
      this.$confirm({
        title: '重置密码',
        content: (h) => <div>确定要重置密码吗?</div>,
        onOk() {
          restPwd(params).then((res) => {
            if (res.code == '200') {
              _this.$message.success(res.message)
              _this.clickCloseIcon()
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        },
        class: 'test',
      })
    },

    queryEnablePwd() {
      enablePwd().then((res) => {
        this.enableSalaryPwd = res.data
        if (!this.enableSalaryPwd) {
          this.querySalaryData()
        }
      })
    },
    // 查询薪资数据
    querySalaryData() {
      let params = {
        beginDate: this.beginDate && this.beginDate.replace('-', ''),
        endDate: this.endDate && this.endDate.replace('-', ''),
      }
      querySalaryData(params).then((res) => {
        this.salaryData = (res && res.data) || []
        this.summarySalaryItems = this.salaryData.summarySalaryItems
      })
    },
    getsalaryitem(item) {
      this.modeltitle = `${item.cyear}年${item.cperiod}月 - ${item.name}`;
      this.salaryDetail = item
      this.paySlipVOs = (this.salaryDetail && this.salaryDetail.salaryListItem && this.salaryDetail.salaryListItem.paySlipVOs) || []
      this.drawer_show = true
      this.querySalaryConfirmList()
    },
    // 初始化开始结束日期
    initYearMonth() {
      var endyear = new Date().getFullYear()
      var endmonth = new Date().getMonth() + 1
      var startyear = endyear
      var startmonth = endmonth
      if (endmonth == 1) {
        startyear = endyear - 1
        startmonth = 12
      } else {
        startmonth = endmonth - 1
      }
      if (startmonth < 10) {
        startmonth = '0' + startmonth
      }
      if (endmonth < 10) {
        endmonth = '0' + endmonth
      }
      this.beginDate = startyear + '-' + startmonth
      this.endDate = endyear + '-' + endmonth
    },
    //修改密码按钮
    updateShow() {
      this.checkPwdShow = false
      this.updatePwdShow = true
      this.setIconvisible = true
    },
    // 修改密码关闭按钮
    clickCloseIcon() {
      this.checkPwdShow = true
      this.updatePwdShow = false
      this.setIconvisible = false
      this.password = ''
      this.oldPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },
    //没有问题
    submitOk() {
      this.onSubmit()
    },
    //有问题提交
    onSubmit() {
      let salaryListItem = this.salaryDetail.salaryListItem
      let params = {
        pk_wa_data: salaryListItem.pk_wa_data,
        orgname: this.userInfo.orgname,
        cperiod: salaryListItem.cperiod,
        cyear: salaryListItem.cyear,
        waclassname: salaryListItem.waClassName,
        psncode: this.userInfo.code,
        psnname: this.userInfo.name,
        deptname: this.userInfo.deptname,
        result: this.result,
        memo: this.problem,
      }
      salaryConfirmSave(params).then((res) => {
        this.question = false
        this.querySalaryConfirmList()
      })
    },
    querySalaryConfirmList() {
      let pk_wa_data =(this.salaryDetail && this.salaryDetail.salaryListItem && this.salaryDetail.salaryListItem.pk_wa_data) || ''
      let params = {
        pk_wa_data: pk_wa_data,
      }
      salaryConfirmList(params).then((res) => {
        this.salaryConfirmList = res.data
      })
    },
  },
}
</script>

<style lang="less" scoped>
.salary {
  padding: 0 20px 20px;
  height: 100%;
  .salary-body {
    height: 100%;
    padding: 10px 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(167, 167, 167, 0.4);
    overflow-y: scroll;
    .selsecData {
      padding: 20px 0;
      .ant-calendar-picker {
        margin: 0 25px;
      }
      .ant-btn {
        border-radius: 5px;
      }
    }
    .salary_total {
      color: #fff;
      font-size: 16px;
      .salary_total_item {
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(167, 167, 167, 0.4);
        padding: 35px 10px 35px;
        .right {
          margin-top: 40px;
          text-align: right;
        }
      }
      .yellow {
        background: linear-gradient(to right, #fa864b, #fbde5a);
      }
      .blove {
        background: linear-gradient(to right, #32b3f7, #3c63f8);
        color: #fff;
      }
      .more-col {
        margin: 0 auto;
        .more {
          background: #2171f2;
          writing-mode: tb-rl;
          height: 157px;
          justify-content: center;
          display: flex;
          padding: 0 10px;
          margin-left: 15px;
        }
      }
    }
    .salary_username {
      padding: 10px 20px;
      .name {
        color: #000;
        font-size: 18px;
      }
      .orgname {
        padding-left: 15px;
        color: #6c6c6c;
        font-size: 14px;
      }
    }
    .salary_List {
      color: #000;
      .ant-row-flex {
        background: #fff;
        box-shadow: 0px 4px 29px 3px rgb(167, 167, 167, 01);
        border-radius: 10px;
        padding-bottom: 20px;
        margin-bottom: 20px;
      }
      .paySlipVOs {
        padding: 5px 20px;
        span {
          width: 50%;
          display: inline-block;
        }
        .right {
          text-align: right;
        }
      }
      .flex {
        background: #2479ed;
        color: #fff;
        font-size: 16px;
        padding: 20px;
        border-radius: 10px 10px 0 0;
        width: 100%;
      }
    }
  }
}
</style>
<style lang="less" >
.salary {
  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-close {
    display: none;
  }
  .ant-modal-title {
    text-align: center;
  }
}
.moreEvent2 {
  color: #0a79ff;
  cursor: pointer;
  span {
    margin-right: 15px;
  }
}
.verify,
.submit {
  .ant-form-item-children {
    width: 100%;
  }
  .ant-btn {
    width: 100%;
  }
}
.more-model {
  padding: 10px 0;
  border-bottom: 1px dashed #999;
  font-size: 16px;
  margin: 0;
}
.drawer-data {
  padding: 10px 0;
  border-bottom: 1px dashed #999;
  font-size: 14px;
  margin: 0;
}
.ant-drawer {
  .footer-but {
    text-align: center;
    padding-top: 50px;
    .ant-btn {
      width: 200px;
      margin-right: 15px;
    }
  }
}
</style>