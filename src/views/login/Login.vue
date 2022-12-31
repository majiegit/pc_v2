<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <!-- <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="usercode" :tab="$t('user.login.tab-login-credentials')"> -->
          <!--账号密码登录-->
          <div class="user-tabs-nav-scroll">
             <div class="user-text">账号密码登录</div>
          </div>
          <a-form-item class="user-form-item">
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.usercode.placeholder')"
              v-decorator="[
                'usercode',
                {rules: [{ required: true, message: $t('user.usercode.required') }, { validator: handleUsername }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item class="user-form-item">
            <a-input-password
              size="large"
              :placeholder="$t('user.login.password.placeholder')"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
        <!-- </a-tab-pane>
      </a-tabs> -->
      <a-form-item  class="footer-btn">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >{{ $t('user.login.login') }}
        </a-button>
      </a-form-item>
        <div class="user-login-other">
        <a-divider>
          <span style="font-size: 14px; color: #909399;">第三方登录方式</span>
        </a-divider>
        <div class="user-lodingtype">
          <a >
          <img src="~@/assets/wechat.png" alt="">
          </a>
          <a >
            <img src="~@/assets/alipay.png" alt="">
          </a>
        </div>
        
        <!-- <a>
          <a-icon class="item-icon" type="wechat"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="qq"></a-icon>
        </a>
        <a>
          <a-icon class="item-icon" type="qrcode"></a-icon>
        </a> -->
      </div>
    </a-form>
    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script>
  import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
  import {mapActions} from 'vuex'
  import {timeFix} from '@/utils/util'
  import { getVerificationCode } from '@/api/login'
  export default {
    components: {
      TwoStepCaptcha
    },
    data() {
      return {
        verificationCodeImg: '',
        customActiveKey: 'usercode',
        loginBtn: false,
        // login type: 0 email, 1 usercode, 2 telephone
        loginType: 0,
        isLoginError: false,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        form: this.$form.createForm(this),
        state: {
          time: 60,
          loginBtn: false,
          // login type: 0 email, 1 usercode, 2 telephone
          loginType: 0,
          smsSendBtn: false
        }
      }
    },
    created() {
      // this.refreshCode()
    },
    methods: {
      // 获取图文验证码
      refreshCode(){
        getVerificationCode().then(res => {
           this.verificationCodeImg = res.data
        })
      },
      ...mapActions(['Login', 'Logout']),
      handleUsername(rule, value, callback) {
        const {state} = this
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        if (regex.test(value)) {
          state.loginType = 0
        } else {
          state.loginType = 1
        }
        callback()
      },
      handleTabClick(key) {
        this.customActiveKey = key
        // this.form.resetFields()
      },
      handleSubmit(e) {
        e.preventDefault()
        const {
          form: {validateFields},
          state,
          customActiveKey,
          Login
        } = this

        state.loginBtn = true

        const validateFieldsKey = customActiveKey === 'usercode' ? ['usercode', 'password'] : ['mobile', 'captcha']

        validateFields(validateFieldsKey, {force: true}, (err, values) => {
          if (!err) {
            const loginParams = {...values}
            Login(loginParams)
              .then((res) => this.loginSuccess(res))
              .catch(err => this.requestFailed(err))
              .finally(() => {
                state.loginBtn = false
              })
          } else {
            setTimeout(() => {
              state.loginBtn = false
            }, 600)
          }
        })
      },
      getCaptcha(e) {
      },
      stepCaptchaSuccess() {
        this.loginSuccess()
      },
      stepCaptchaCancel() {
        this.Logout().then(() => {
          this.loginBtn = false
          this.stepCaptchaVisible = false
        })
      },
      loginSuccess(res) {
        this.$router.push({name: 'dashboard'})
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        }, 1000)
        this.isLoginError = false
      },
      requestFailed(err) {
        this.isLoginError = true
        // this.$notification['error']({
        //   message: '错误',
        //   description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        //   duration: 4
        // })
      }
    }
  }
</script>

<style lang="less" scoped>
#formLogin{
  background:#fff;
 
}
  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: center;
      margin-top: 50px;
      line-height: 22px;
      .user-lodingtype{
        padding: 50px 0;
        img{
          margin-right: 10px;
        }

      
      }
      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }
</style>
<style lang="less" >
  #formLogin{
 .user-tabs-nav-scroll{
    background: #fff url(~@/assets/qrcode.png) no-repeat 40%;
    background-position: right top;
    background-size: 20%;
    margin-bottom: 50px;
    font-size: 16px;
    .user-text{
      margin: 0 40px;
      padding: 20px;
      color: #02318E;
      border-bottom: 1px solid #02318E;
     }
  }
  .user-form-item{
    padding-left: 40px;
    padding-right: 40px;
  }
  .ant-tabs-content {
    padding: 0 20px;
  }
  .footer-btn{
    padding: 20px 40px;
  }
  
}
</style>
