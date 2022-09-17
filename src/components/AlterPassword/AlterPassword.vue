<!--密码修改-->
<template>
  <!--修改密码-->
  <a-modal v-model="visible" :title="$t('account.settings.alter.password')" @ok="handleSubmit" @cancel="close">
    <a-row>
      <a-col :md="24" :sm="24">
        <a-form :form="alterPasswordForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
          <a-form-item :label="$t('account.settings.alter.oldPassword')">
            <a-input
              v-decorator="['oldPassword', { rules: [{ required: true, validator: oldPasswordCheck, trigger: 'blur'}]}]"
            />
          </a-form-item>
          <a-form-item :label="$t('account.settings.alter.newPassword')">
            <a-input
              v-decorator="['newPassword', { rules: [{ required: true, validator: newPasswordCheck, trigger: 'blur'}]}]"
            />
          </a-form-item>
          <a-form-item :label="$t('account.settings.alter.confirmPassword')">
            <a-input
              v-decorator="['confirmPassword', { rules: [{ required: true, validator: confirmPasswordCheck, trigger: 'blur'}]}]"
            />
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
  import {updatePassword} from '@/api/user'

  export default {
    name: "AlterPassword",
    data() {
      return {
        alterPasswordForm: this.$form.createForm(this, {name: 'coordinated'}),
        visible: false
      }
    },
    methods: {
      /**
       * 关闭
       */
      close() {
        this.visible = false
        this.alterPasswordForm.resetFields()
      },
      /**
       * 打开
       */
      open() {
        this.visible = true
      },
      /**
       * 确定
       */
      handleSubmit(e) {
        e.preventDefault()
        this.alterPasswordForm.validateFields((err, values) => {
          if (!err) {
            updatePassword(values).then(res => {
              this.$message.success(res.message)
              this.close()
            }).catch(res => {
            }).finally(res => {
            })
          }
        });
      },
      /**
       * 密码自定义
       * @param rule
       * @param value
       * @param callback
       */
      oldPasswordCheck(rule, value, callback) {
        if (!value) {
          callback(new Error('请输入原密码'))
        }
        var password = /^[A-Za-z0-9]+$/
        if (value && !password.test(value)) {
          callback(new Error('请输入英文或数字'))
        } else {
          callback()
        }
      },
      /**
       *  确认密码校验
       * @param rule
       * @param value
       * @param callback
       */
      confirmPasswordCheck(rule, value, callback) {
        if (!value) {
          callback(new Error('请再次输入密码'))
        }
        var password = /^[A-Za-z0-9]+$/
        if (value && !password.test(value)) {
          callback(new Error('请输入英文或数字'))
        }
        if (value && value !== this.alterPasswordForm.getFieldValue('newPassword')) {
          callback('两次密码输入不一致!')
        }
        else {
          callback()
        }
      },
      /**
       * 新密码校验
       * @param rule
       * @param value
       * @param callback
       */
      newPasswordCheck(rule, value, callback) {
        if (!value) {
          callback(new Error('请输入新密码'))
        }
        var password = /^[A-Za-z0-9]+$/
        if (value && !password.test(value)) {
          callback(new Error('请输入英文或数字'))
        } else {
          callback()
        }
      },
    }
  }
</script>

<style scoped>

</style>