<template>
  <a-row type="flex" :gutter="[24,24]">
    <a-col :span="24" :style="{ height: bodyHeight, 'overflow-y': 'auto'}" class="model_center">
      <a-spin :spinning="userInfoLoading">
        <a-form-model :model="userForm.user" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon
                      labelAlign="right"
                      ref="userFormRef"
                      :rules="userFormRules">
          <a-form-model-item label="用户姓名" prop="realname">
            <a-input v-model="userForm.user.realname" placeholder="请输入用户姓名"/>
          </a-form-model-item>
          <a-form-model-item label="用户账号" prop="username">
            <a-input v-model="userForm.user.username" :disabled="operation === 'edit'" :maxLength="20" placeholder="请输入用户账号"/>
          </a-form-model-item>
          <a-form-model-item label="密码" prop="password" v-if="operation === 'add'">
            <a-input-password v-model="userForm.user.password" :maxLength="20" placeholder="请输入用户密码"/>
          </a-form-model-item>
          <a-form-model-item label="确认密码" prop="okPassword" v-if="operation === 'add'"
                             :rules="{required: true, validator: okPasswordCheck, trigger: 'blur'}">
            <a-input-password v-model="userForm.user.okPassword" :maxLength="20" placeholder="请再次输入用户密码"/>
          </a-form-model-item>
          <a-form-model-item label="头像" prop="avatar">
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :before-upload="beforeUpload"
              @change="avatarChange"
            >
              <img style="width: 100%" v-if="avatarImg" :src="avatarImg" alt="avatar"/>
              <div v-else>
                <a-icon type="plus"/>
                <div class="ant-upload-text">
                  上传头像
                </div>
              </div>
            </a-upload>
          </a-form-model-item>
          <a-form-model-item label="工号" prop="workNo">
            <a-input v-model="userForm.user.workNo" placeholder="请输入工号" :maxLength="20"/>
          </a-form-model-item>
          <a-form-model-item label="手机号" prop="phone">
            <a-input v-model="userForm.user.phone" type="number"  placeholder="请输入手机号"/>
          </a-form-model-item>
          <a-form-model-item label="邮箱" prop="email">
            <a-input v-model="userForm.user.email" placeholder="请输入邮箱"/>
          </a-form-model-item>
          <a-form-model-item label="性别" prop="sex">
            <a-select v-model="userForm.user.sex" :options="sexOptions" allowClear placeholder="请选择性别">
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="生日" prop="birthday">
            <a-date-picker @change="birthdayChange" placeholder="请选择出生日期" allowClear
                           :value="userForm.user.birthday ? moment(userForm.user.birthday, 'YYYY-MM-DD') : userForm.user.birthday"/>
          </a-form-model-item>
          <a-form-model-item label="岗位" prop="postId">
            <a-select v-model="userForm.postIds" allowClear mode="multiple"  placeholder="请选择岗位">
              <a-select-option v-for="(item,index) in postList" :key="index" :value="item.postId">
                {{item.postName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="职务" prop="jobId">
            <a-select v-model="userForm.jobIds" allowClear mode="multiple"  placeholder="请选择职务">
              <a-select-option v-for="(item,index) in jobList" :key="index" :value="item.jobId">
                {{item.jobName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="职级" prop="rankId">
            <a-select v-model="userForm.rankIds" allowClear mode="multiple" placeholder="请选择职级">
              <a-select-option v-for="(item,index) in rankList" :key="index" :value="item.rankId">
                {{item.rankName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="角色" prop="roleId">
            <a-select v-model="userForm.roleIds" allowClear mode="multiple" placeholder="请选择角色">
              <a-icon slot="suffixIcon" type="smile"/>
              <a-select-option v-for="(item,index) in roleList" :key="index" :value="item.roleId">
                {{item.roleName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status">
            <a-radio-group v-model="userForm.user.status" :options="normalFrozenOptions"/>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-col>
    <a-divider/>
    <a-col span="6">
      <a-space>
        <a-button @click="cancelSaveUser" v-if="showCancelButton">
          取 消
        </a-button>
        <a-button type="primary" @click="saveUser" :loading="saveButtonLoading">
          保 存
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import AFormModelItem from "ant-design-vue/es/form-model/FormItem";
  import AFormItem from "ant-design-vue/es/form/FormItem";
  import {queryPostList} from '@/api/post'
  import {queryJobList} from '@/api/job'
  import {queryRankList} from '@/api/rank'
  import {getRoleList} from '@/api/role'
  import {addUserData, updateUserData, getUserById, uploadAvatar} from '@/api/user'
  import {RoleType} from '@/utils/system/roleConstant'
  import {normalFrozenOptions} from '@/utils/staticDataUtils'
  //设置中文
  import moment from 'moment';
  import 'moment/locale/zh-cn'

  moment.locale('zh-cn');
  export default {
    name: "UserEdit",
    components: {AFormItem, AFormModelItem, ACol, ARow},
    data() {
      return {
        postList: [],
        jobList: [],
        rankList: [],
        roleList: [],
        avatarImg: null,
        avatarImgFile: null,
        bodyHeight: '780px',
        userInfoLoading: false,
        userId: this.userIdProp,
        userForm: {
          user: {
            status: 1
          }
        },
        saveButtonLoading: false,
        userFormRules,
        sexOptions,
        normalFrozenOptions,
        moment
      }
    },
    watch: {
      userIdProp(val) {
        if (val) {
          this.userId = val
          this.queryUserData(val)
        } else {
          this.resetUserForm()
        }
      }
    },
    props: {

      showCancelButton: {
        default: false,
        type: Boolean
      },
      operation: {
        default: 'add',
        type: String
      },
      userIdProp: {
        default: '',
        type: String
      }
    },
    mounted() {
      if (this.userIdProp) {
        this.queryUserData(this.userIdProp)
      } else {
        this.resetUserForm()
      }
      this.queryRankData()
      this.queryJobData()
      this.queryPostData()
      this.queryRoleData()
    },
    methods: {
      /**
       * 重置操作
       */
      resetUserForm() {
        this.userForm = {
          user: {
            status: 1,
            birthday: ''
          }
        }
        this.avatarImg = null
      },
      /**
       * 查询岗位数据
       */
      queryPostData() {
        let params = {
          status: 1
        }
        queryPostList(params).then(res => {
          this.postList = res.data
        })
      },
      /**
       * 查询职务数据
       */
      queryJobData() {
        queryJobList().then(res => {
          this.jobList = res.data
        })
      },
      /**
       * 查询职级数据
       */
      queryRankData() {
        let params = {
          status: 1
        }
        queryRankList(params).then(res => {
          this.rankList = res.data
        })
      },
      /**
       * 查询角色数据
       */
      queryRoleData() {
        // let params = {
        //   roleType: RoleType.ORDINARY_ROLE
        // }
        getRoleList().then(res => {
          this.roleList = res.data
        })
      },

      /**
       * 头像改变事件
       */
      avatarChange(info) {
        // Get this url from response in real world.
        this.getBase64(info.file, avatarImg => {
          this.avatarImg = avatarImg
        })
        this.avatarImgFile = info.file
      },
      getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      },
      beforeUpload(file) {
        return false
      },
      /**
       * 选择生日方法
       * @param date
       * @param dateString
       */
      birthdayChange(date, dateString) {
        this.userForm.user.birthday = dateString
      },
      /**
       * 查询用户数据
       */
      queryUserData(userId) {
        this.userInfoLoading = true
        getUserById(userId).then(res => {
          this.userInfoLoading = false
          this.userForm = res.data
          if (res.data.user.avatar) {
            this.avatarImg = window.location.protocol + '//' + window.location.host + '/api/jay-system' + res.data.user.avatar
          }
        })
      },
      saveOk() {
        this.$emit("saveOk")
      },
      /**
       * 保存用户
       */
      saveUser() {
        this.$refs.userFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            if (this.operation == 'add') {
              this.addUser()
            } else {
              this.updateUser()
            }
          }
        })
      },
      /**
       * 新增用户
       */
      addUser() {
        console.log(this.userForm)
        this.saveButtonLoading = true
        addUserData(this.userForm).then(res => {
          this.$message.success(res.message)
          this.saveButtonLoading = false
          this.avatarImgUpload(res.data.id)
          this.saveOk()
        }).catch(res => {
          this.saveButtonLoading = false
        })
      },
      /**
       * 修改用户
       */
      updateUser() {
        console.log(this.userForm)
        this.saveButtonLoading = true
        updateUserData(this.userForm).then(res => {
          this.$message.success(res.message)
          this.saveButtonLoading = false
          this.avatarImgUpload(this.userId)
          this.saveOk()
        }).catch(res => {
          this.saveButtonLoading = false
        })
      },
      /**
       * 取消按钮
       */
      cancelSaveUser() {
        this.$emit("cancel")
      },
      /**
       * 上传头像
       */
      avatarImgUpload(userId) {
        if (this.avatarImgFile) {
          let params = new FormData();
          params.append("userId", userId)
          params.append("avatar", this.avatarImgFile)
          uploadAvatar(params).then(res => {
          })
        }
      },
      // 确认密码输入俩次密码是否一致
      okPasswordCheck(rule, value, callback) {
        if (!value) {
          callback('请再次输入确认密码')
        }
        if (!this.userForm.user.password) {
          callback('请先输入用户密码')
        }
        let password = /^[A-Za-z0-9]+$/
        if (value && !password.test(value)) {
          callback(new Error('请输入英文或数字'))
        }
        if (value && value !== this.userForm.user.password) {
          callback('两次密码输入不一致!')
        } else {
          callback()
        }
      },
    }
  }
  // 性别选项
  const sexOptions = [
    {
      value: 1,
      label: '男'
    },
    {
      value: 2,
      label: '女'
    },
    {
      value: 0,
      label: '未知'
    }
  ]
  const userFormRules = {
    realname: [
      {
        required: true,
        message: '请输入用户姓名',
        trigger: 'blur'
      }
    ],
    username: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入用户账号'))
          }
          var username = /^[A-Za-z0-9]+$/
          if (value && !username.test(value)) {
            callback(new Error('请输入英文或数字'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    password: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if(!value){
            callback(new Error('请输入用户密码'))
          }
          var password = /^[A-Za-z0-9]+$/
          if (value && !password.test(value)) {
            callback(new Error('请输入英文或数字'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    workNo: [
      {
        required: false,
        validator: (rule, value, callback) => {
          var password = /^[A-Za-z0-9]+$/
          if (value && !password.test(value)) {
            callback(new Error('请输入英文或数字'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    phone: [
      {
        required: false,
        validator: (rule, value, callback) => {
          var phone = /0?(13|14|15|17|18)[0-9]{9}/
          if (value && !phone.test(value)) {
            callback(new Error('手机号格式不正确'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    email: [
      {
        required: false,
        validator: (rule, value, callback) => {
          var email = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
          if (value && !email.test(value)) {
            callback(new Error('邮箱格式不正确'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      },
    ],
    type: [{required: true, message: '请选择用户类型', trigger: 'blur'}],
    status: [{required: false, message: '请选择用户状态', trigger: 'blur'}]
  }
</script>

<style scoped>
  .row {
    min-height: 40px;
  }
</style>