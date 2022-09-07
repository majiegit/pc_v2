<template>
  <a-row type="flex" :gutter="[24,24]">
    <a-col :span="24" :style="{ height: bodyHeight, 'overflow-y': 'auto'}" class="model_center">
      <a-spin :spinning="userInfoLoading">
        <a-form-model :model="userForm.user" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon
                      labelAlign="right"
                      ref="userForm"
                      :rules="userFormRules">
          <a-form-model-item label="用户账号" prop="username">
            <a-input v-model="userForm.user.username"/>
          </a-form-model-item>
          <a-form-model-item label="密码" prop="password" v-if="operation == 'add'">
            <a-input-password v-model="userForm.user.password"/>
          </a-form-model-item>
          <a-form-model-item label="确认密码" prop="okPassword" v-if="operation == 'add'">
            <a-input-password v-model="userForm.user.okPassword"/>
          </a-form-model-item>
          <a-form-model-item label="用户姓名" prop="realname">
            <a-input v-model="userForm.user.realname"/>
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
            <a-input v-model="userForm.user.workNo"/>
          </a-form-model-item>
          <a-form-model-item label="性别" prop="sex">
            <a-select v-model="userForm.user.sex" :options="sexOptions" allowClear>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="生日" prop="birthday">
            <a-date-picker @change="birthdayChange" placeholder="请选择出生日期" allowClear
                           :value="userForm.user.birthday ? moment(userForm.user.birthday, 'YYYY-MM-DD') : userForm.user.birthday"/>
          </a-form-model-item>
          <a-form-model-item label="手机号" prop="phone">
            <a-input v-model="userForm.user.phone" type="number"/>
          </a-form-model-item>
          <a-form-model-item label="邮箱" prop="email">
            <a-input v-model="userForm.user.email"/>
          </a-form-model-item>
          <a-form-model-item label="状态" prop="status">
            <a-radio-group v-model="userForm.user.status" :options="normalFrozenOptions"/>
          </a-form-model-item>
          <a-form-model-item label="岗位" prop="postId">
            <a-select v-model="userForm.postIds" allowClear mode="multiple">
              <a-icon slot="suffixIcon" type="smile"/>
              <a-select-option v-for="(item,index) in postList" :key="index" :value="item.postId">
                {{item.postName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="职务" prop="jobId">
            <a-select v-model="userForm.jobIds" allowClear mode="multiple">
              <a-select-option v-for="(item,index) in jobList" :key="index" :value="item.jobId">
                {{item.jobName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="职级" prop="rankId">
            <a-select v-model="userForm.rankIds" allowClear mode="multiple">
              <a-select-option v-for="(item,index) in rankList" :key="index" :value="item.rankId">
                {{item.rankName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="角色" prop="roleId">
            <a-select v-model="userForm.roleIds" allowClear mode="multiple">
              <a-select-option v-for="(item,index) in roleList" :key="index" :value="item.roleId">
                {{item.roleName}}
              </a-select-option>
            </a-select>
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
        if (this.operation == 'add') {
          this.addUser()
        } else {
          this.updateUser()
        }
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
    realname: [{required: true, message: '请输入用户姓名', trigger: 'blur'}],
    username: [{required: true, message: '请输入用户账号', trigger: 'blur'}],
    password: [{required: true, message: '请输入用户密码', trigger: 'blur'}],
    okPassword: [
      {required: true, message: '请输入确认密码', trigger: 'blur'},
      // {required: true, message: '俩次密码输入不一致', validator: () => {}}
    ],
    code: [{required: true, message: '请输入用户编码', trigger: 'blur'}],
    phone: [{required: false, message: '手机号码格式错误', max: 11}],
    type: [{required: true, message: '请选择用户类型', trigger: 'blur'}],
    status: [{required: false, message: '请选择用户状态', trigger: 'blur'}]
  }
</script>

<style scoped>
  .row {
    min-height: 40px;
  }
</style>