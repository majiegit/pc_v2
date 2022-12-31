<template>
  <div class="personal">
    <Header ></Header>
    <div class="personal-body">
      <a-row :gutter="16">
        <a-col class="gutter-row personal-left" :span="4">
          <a-anchor :affix="false">
            <a-anchor-link v-for="(item, index) in templateData" :href="`#${item.infoset_code}`" :key="index">
              <template #title>
                <a-icon
                  class="icon_list"
                  :style="{ color: informationIconList[`${item.table_code}bg`] }"
                  :type="informationIconList[item.table_code]"
                />
                {{ item.name }}
              </template>
            </a-anchor-link>
          </a-anchor>
        </a-col>

        <a-col class="gutter-row personal-right" :style="{'height': currentHeight}" :span="20">
          <div class="personal-row" :gutter="16">
            <a-row class="info-data">
              <a-col :span="24" class="upload">
                <span @click="uploadUrl">
                  <a-icon type="link" />
                  附件管理
                </span>
              </a-col>
              <a-col :span="12" style="text-align: right">
                <a-avatar :src="userinfo.photo" class="info-photo" />
              </a-col>
              <a-col :span="12" style="padding-left: 20px; color: #333">
                <div style="padding: 20px 0 10px; font-size: 16px">姓名：{{ userinfo.name }}</div>
                <div style="font-size: 14px">部门：{{ userinfo.deptname }}</div>
                <span v-if="isedit_show == 'Y'"   @click="edit('bd_psndoc')">
                 <a-icon
                  slot="extra"
                  style="font-size: 20px; color:#1989fa;padding-top: 5px;"
                  type="edit"
                />
                </span>
                
                
              </a-col>
            </a-row>
            <a-collapse v-model="activeKey" default-active-key="0" :expand-icon-position="expandIconPosition">
              <a-collapse-panel
                v-for="(temp, tempIndex) in templateData"
                :key="tempIndex.toString()"
                :id="temp.infoset_code"
              >
                <template slot="header">
                  {{ temp.name }}
                  <a-tag
                    plain
                    type="primary"
                    v-if="infoData.aprlist && infoData.aprlist[temp.table_code]"
                    style="margin-left: 5px"
                    >信息待审批
                  </a-tag>
                </template>

                <div
                  v-for="(info, infoIndex) in infoData[temp.table_code]"
                  :key="infoIndex"
                  v-if="infoData[temp.table_code]"
                >
                  <a-row type="flex">
                    <a-col
                      :span="8"
                      class="personal-item"
                      v-for="(field, fieldIndex) in temp.tablefield"
                      v-if="field.showlistflag == 'Y'"
                      :key="fieldIndex"
                    >
                      {{ field.name }} :
                      <span class="value">{{ getFieldValue(field, info) }}</span>
                    </a-col>
                  </a-row>
                  <a-divider v-if="infoIndex != infoData[temp.table_code].length - 1" />
                </div>
                <a-icon
                  slot="extra"
                  style="font-size: 18px;color:#1989fa;"
                  type="edit"
                  v-if="temp.caneditflag == 'Y'"
                  @click="edit(temp.name, temp)"
                />
                
              </a-collapse-panel>
            </a-collapse>
          </div>
        </a-col>
      </a-row>
    </div>

    <a-drawer title="人员基本信息" :size="size" width="736px" :visible="infobody" @close="close(1)">
      <template #extra>
        <a-button style="margin-right: 8px" @click="infobody = false">Cancel</a-button>
        <a-button type="primary" @click="infobody = false">Submit</a-button>
      </template>
      <div class="information">
        <!--主内容区域-->
        <div style="overflow-y: auto">
          <a-form-model
            colon
            label-width="100"
            input-align="right"
            ref="formData_info"
            :model="infoDataForm_info"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <!-- {{infoDataForm_info}} -->
            <a-row :gutter="24">
              <a-col
                :span="12"
                v-for="(field, fieldIndex) in fieldDataEdit_info"
                :key="fieldIndex"
                v-if="[0, 100, 1, 2, 20, 3, 8, 6, 5, 9, 4].includes(field.datatype)"
              >
              <!-- {{infoDataForm_info}}{{field.code}}{{infoDataForm_info[field.code]}} -->
                <!-- 文本类型   0-->
                <a-form-model-item
                  :label="field.name"
                  :prop="field.code"
                  :rules="getFieldRules(field)"
                  :required="getFieldRequired(field)"
                  v-if="[0, 100].includes(field.datatype)"
                >
                  <a-input
                    v-model="infoDataForm_info[field.code]"
                    :rules="getFieldRules(field)"
                    :maxLength="field.maxlength"
                    :disabled="getFieldDisabled(field)"
                    :placeholder="getFieldPlaceholder(field)"
                  />
                </a-form-model-item>
                <!-- 1 and  数量类型 2-->
                <a-form-model-item
                  :label="field.name"
                  :prop="field.code"
                  :rules="getFieldRules(field)"
                  :required="getFieldRequired(field)"
                  v-if="[1, 2].includes(field.datatype)"
                >
                  <a-input
                    v-model="infoDataForm_info[field.code]"
                    :rules="getFieldRules(field)"
                    :placeholder="getFieldPlaceholder(field)"
                    :disabled="getFieldDisabled(field)"
                    type="number"
                    :maxLength="field.maxlength"
                  />
                </a-form-model-item>

                <!--日期类型  3 || 20-->
                <a-form-model-item
                  :label="field.name"
                  :prop="field.code"
                  :rules="getFieldRules(field)"
                  :required="getFieldRequired(field)"
                  v-if="[20, 3, 8].includes(field.datatype)"
                >
                  <a-date-picker
                    :format="field.datatype == 8 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
                    v-model="infoDataForm_info[field.code]"
                    :placeholder="getFieldPlaceholder(field)"
                    @change="getDate($event, field)"
                    :rules="getFieldRules(field)"
                    :disabled="getFieldDisabled(field)"
                  />
                </a-form-model-item>
                <!--下拉类型  6 -->
                <a-form-model-item
                  :label="field.name"
                  :prop="field.code"
                  :rules="getFieldRules(field)"
                  :required="getFieldRequired(field)"
                  v-if="[6].includes(field.datatype)"
                >
                  <a-select
                    show-search
                    v-model="infoDataForm_info[field.code + '_name']"
                    :placeholder="getFieldPlaceholder(field)"
                    :options="options"
                    :filter-option="filterOption"
                    @change="getSelectDatelist"
                    @mouseenter="getSelectDate(field)"
                    :disabled="getFieldDisabled(field)"
                  ></a-select>
                </a-form-model-item>
                <!-- 参数类型  5-->
                <a-form-model-item
                  :label="field.name"
                  :prop="field.code"
                  :rules="getFieldRules(field)"
                  :required="getFieldRequired(field)"
                   v-if="field.datatype == 5"
                >
                  <a-input
                    :rules="getFieldRules(field)"
                    v-model="infoDataForm_info[field.code + '_name']"
                    :placeholder="getFieldPlaceholder(field)"
                    @click="getReference(field)"
                    :disabled="getFieldDisabled(field)"
                    readOnly
                  >
                    <a-icon slot="suffix" type="right" style="color: rgba(0, 0, 0, 0.45)" />
                  </a-input>
                </a-form-model-item>
                <!--大文本类型 9-->
                <a-form-model-item
                  :label="field.name"
                  :prop="field.code"
                  :rules="getFieldRules(field)"
                  :required="getFieldRequired(field)"
                  v-if="field.datatype == 9"
                >
                  <a-input
                    v-model="infoDataForm_info[field.code]"
                    type="textarea"
                    :rules="getFieldRules(field)"
                    :maxlength="field.maxlength"
                    :disabled="getFieldDisabled(field)"
                    :placeholder="getFieldPlaceholder(field)"
                  />
                </a-form-model-item>
                <!-- 是否开关 -->
                <a-form-model-item
                  v-if="field.datatype == 4"
                  :required="getFieldRequired(field)"
                  :name="field.code"
                  :label="field.name"
                  :rules="getFieldRules(field)"
                >
                  <a-switch
                    :checked="infoDataForm_info[field.code] == 'Y' ? true : false"
                    :rules="getFieldRules(field)"
                    active-value="Y"
                    inactive-value="N"
                    :disabled="getFieldDisabled(field)"
                    @click="getswitch($event, field)"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <div ref="footer" class="footer">
          <a-button type="primary" block v-if="!isCheck" @click="submitData">提 交</a-button>
          <a-button type="primary" block v-else @click="rollbackData">撤 回</a-button>
        </div>
      </div>
    </a-drawer>
    <a-drawer :title="rightbody_title" :size="size" width="736px" :visible="rightbody" @close="close(2)">
      <template #extra>
        <a-button style="margin-right: 8px" @click="rightbody = false">Cancel</a-button>
        <a-button type="primary" @click="rightbody = false">Submit</a-button>
      </template>
      <div class="info_class"></div>
      <a-row
        :gutter="24"
        v-for="(info, infoIndex) in infoDataForm_info_min"
        v-if="info.optype !== 'del'"
        :key="infoIndex"
        style="border-bottom: 1px solid #eee; margin-bottom: 20px"
      >
        <a-col :span="24" style="padding-bottom: 10px; text-align: right">
          <a-button type="primary" ghost @click="delSubsetData(infoIndex, info)">删除</a-button>
        </a-col>
        <a-col :span="24">
          <a-form-model
            labelAlign="left"
            colon
            label-width="100"
            input-align="right"
            ref="formData"
            :model="infoDataForm_info_min[infoIndex]"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-col :span="12" v-for="(field, fieldIndex) in fieldDataEdit_info" :key="fieldIndex">
              <!-- 文本类型   0-->
              <!-- {{info}}{{field.code}}{{info[field.code]}} -->
              <a-form-model-item
                :label="field.name"
                :prop="field.code"
                :rules="getFieldRules(field)"
                v-if="[0, 100].includes(field.datatype)"
              >
                <a-input
                  v-model="infoDataForm_info_min[infoIndex][field.code]"
                  :maxLength="field.maxlength"
                  :placeholder="getFieldPlaceholder(field)"
                  :disabled="getFieldDisabled(field)"
                />
              </a-form-model-item>
              <!-- 1 and  数量类型 2-->
              <a-form-model-item
                :label="field.name"
                :prop="field.code"
                :rules="getFieldRules(field)"
                :required="getFieldRequired(field)"
                v-if="[1, 2].includes(field.datatype)"
              >
                <a-input
                  v-model="infoDataForm_info_min[infoIndex][field.code]"
                  :rules="getFieldRules(field)"
                  :placeholder="getFieldPlaceholder(field)"
                  :disabled="getFieldDisabled(field)"
                  type="number"
                  :maxLength="field.maxlength"
                />
              </a-form-model-item>

              <!--日期类型  3 || 20-->
              <a-form-model-item
                :label="field.name"
                :prop="field.code"
                :rules="getFieldRules(field)"
                :required="getFieldRequired(field)"
                v-if="[20, 3, 8].includes(field.datatype)"
              >
                <a-date-picker
                  :format="field.datatype == 8 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
                  v-model="infoDataForm_info_min[infoIndex][field.code]"
                  :placeholder="getFieldPlaceholder(field)"
                  @change="getDate($event, field, infoIndex)"
                  :rules="getFieldRules(field)"
                  :disabled="getFieldDisabled(field)"
                />
              </a-form-model-item>
              <!--下拉类型  6 -->
              <a-form-model-item
                :label="field.name"
                :prop="field.code"
                :rules="getFieldRules(field)"
                :required="getFieldRequired(field)"
                v-if="[6].includes(field.datatype)"
              >
                <a-select
                  show-search
                  v-model="infoDataForm_info_min[infoIndex][field.code + '_name']"
                  :placeholder="getFieldPlaceholder(field)"
                  :options="options"
                  :filter-option="filterOption"
                  @change="getSelectDatelist($event, field, infoIndex)"
                  @mouseenter="getSelectDate(field, infoIndex)"
                  :disabled="getFieldDisabled(field)"
                ></a-select>
              </a-form-model-item>
              <!-- 参数类型  5-->
              <a-form-model-item
                :label="field.name"
                :prop="field.code"
                :rules="getFieldRules(field)"
                :required="getFieldRequired(field)"
                :placeholder="getFieldPlaceholder(field)"
                v-if="field.datatype == 5"
              >
                <a-input
                  v-model="infoDataForm_info_min[infoIndex][field.code + '_name']"
                  :placeholder="getFieldPlaceholder(field)"
                  @click="getReference(field, infoIndex)"
                  :disabled="getFieldDisabled(field)"
                  readOnly
                >
                  <a-icon slot="suffix" type="right" style="color: rgba(0, 0, 0, 0.45)" />
                </a-input>
              </a-form-model-item>
              <!--大文本类型 9-->
              <a-form-model-item
                :label="field.name"
                :prop="field.code"
                :required="getFieldRequired(field)"
                v-if="field.datatype == 9"
              >
                <a-input
                  v-model="infoDataForm_info_min[infoIndex][field.code]"
                  type="textarea"
                  :maxLength="field.maxlength"
                  :placeholder="getFieldPlaceholder(field)"
                  :disabled="getFieldDisabled(field)"
                />
              </a-form-model-item>
              <!-- 是否开关 -->
              <a-form-model-item
                v-if="field.datatype == 4"
                :required="getFieldRequired(field)"
                :label="field.name"
                :prop="field.code"
                :rules="getFieldRules(field)"
              >
                <a-switch
                  :checked="infoDataForm_info_min[infoIndex][field.code] == 'Y' ? true : false"
                  active-value="Y"
                  inactive-value="N"
                  :disabled="getFieldDisabled(field)"
                  @click="getswitch($event, field, infoIndex)"
                />
              </a-form-model-item>
            </a-col>
          </a-form-model>
        </a-col>
      </a-row>
      <div class="footer-but">
        <a-button type="primary" size="large" v-if="!isCheck" ghost @click="addSubsetData()" >新增{{ rightbody_title }}</a-button>
        <a-button type="primary" size="large" block v-if="!isCheck && (infoDataForm_info_min && infoDataForm_info_min.length > 0)" @click="submitData_min()">提 交</a-button>
        <a-button type="primary" size="large" block v-else @click="rollbackData">撤 回</a-button>
      </div>
    </a-drawer>
    <a-modal
      title="参照选择"
      :visible="refer_show"
      :confirm-loading="confirmLoading"
      :maskClosable="true"
      width="600px"
      @cancel="refer_show = false"
    >
      <a-tree
        @select="selectOk"
        style="width: 100%; height: 400px; overflow: scroll"
        :dropdown-style="{ maxHeight: '100px', overflow: 'auto' }"
        :tree-data="selectorParam.data"
        placeholder="Please select"
        tree-default-expand-all
      >
      </a-tree>
      <template slot="footer">
        <a></a>
      </template>
    </a-modal>
  </div>
</template>

<script>
import storage from 'store'
import Header from '@/components/Header/Index'
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { queryPsndocTemp, getSubInfoVO, queryReferencePsn, saveSubInfo, revokeLisn } from '@/api/psndoc'
import { informationIconList } from '@/utils/util'
import { forEach } from 'store/storages/all'
import Item from '@/components/AvatarList/Item'
export default {
  name: 'personal',
  components: {Header},
  data() {
    return {
      isedit_show:'',
      options: [],
      confirmLoading: false,
      rightbody: false,
      infobody: false,
      refer_show: false,
      size: 'large',
      rightbody_title: '修改',
      loading: true,
      userInfoPkPsndoc: storage.get('Hrsh-Pc-UserInfo') ? storage.get('Hrsh-Pc-UserInfo').pk_psndoc : '',
      userinfo: storage.get('Hrsh-Pc-UserInfo'),
      templateData: '', //模板
      infoData: '', //数据
      activeKey: ['0'],
      expandIconPosition: 'right',
      informationIconList: informationIconList,
      contacts: 'contacts',
      //基础信息
      type_info: '',
      infoDataForm_info: {},
      infoDataForm_info_min: [],
      isCheck: false,
      fieldData_info: [],
      fieldDataEdit_info: [],
      tempData_info: {},
      infoData_info: {},
      infoIndex_info: 0,
      backData_info: {}, // 传过来的备份数据
      loadingButton: false,
      selectorParam: {}, //参照内容
      getSelectList: [], //下拉框参照数据
      right_text: '', // 删除按钮为空
      isShowAddButton: false, // 新增按钮不显示
      infoIndex: null,
      form: this.$form.createForm(this),
      form1: this.$form.createForm(this),
      backData: {}, // 传过来的备份数据
      info_min: {},
      infoDataForm_model:{},
      currentHeight: '',
      //基础信息
    }
  },
  computed: {},
  created() {
    this.getdata()
    this.currentHeight = (document.documentElement.clientHeight - 80) + 'px'
    console.log( this.currentHeight,'px')
    console.log(this.informationIconList)
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    moment,
    // 获取字段值
    getFieldValue(field, info) {
      //console.log(field, info)
      let datatype = field.datatype
      let value = ''
      switch (datatype) {
        // 字符
        case 0:
          value = info[field.code]
          break
        // 整数
        case 1:
          value = info[field.code]
          break
        // 数量
        case 2:
          value = info[field.code]
          break
        // 日期
        case 3:
          value = info[field.code]
          break
        // 逻辑
        case 4:
          value = info[field.code] == 'Y' ? '是' : info[field.code] == 'N' ? '否' : ''
          break
        // 参照
        case 5:
          value = info[field.code + '_name']
          break
        // 下拉
        case 6:
          value = info[field.code + '_name']
          break
        // 时间
        case 8:
          value = info[field.code]
          break
        // 大文本
        case 9:
          value = info[field.code]
          break
        // 图片
        case 10:
          value = info[field.code]
          break
        // 邮件地址
        case 14:
          value = info[field.code]
          break
        // 时间戳
        case 15:
          value = info[field.code]
          break
        // 自定义项
        case 16:
          value = info[field.code]
          break
        // 多语言
        case 17:
          value = info[field.code]
          break
        // 金额
        case 18:
          value = info[field.code]
          break
        // 日期
        case 20:
          value = info[field.code]
          break
        // 日期公式
        case 100:
          value = info[field.code]
          break
        // 开始日期
        case 101:
          value = info[field.code]
          break
        // 结束日期
        case 102:
          value = info[field.code]
          break
      }
      return value
    },
    //修改数据
    edit(title, temp) {
      let tablefieldlist = {}
      let _this = this
      if (title == 'bd_psndoc') {
        this.infobody = true
        this.templateData.forEach((Item) => {
          if (Item.table_code == 'bd_psndoc') {
            tablefieldlist = Item
          }
        })
        // 显示字段
        let fieldData = tablefieldlist.tablefield.filter((item) => item.showlistflag == 'Y')
        // 是否需要审核
        this.isCheck = false
        if (this.infoData.aprlist && this.infoData.aprlist['bd_psndoc']) {
          this.isCheck = true
        }
        this.infoIndex = null
        this.tempData_info = tablefieldlist // 模板数据
        this.fieldData_info = fieldData // 显示字段数据

        this.infoData_info = this.infoData['bd_psndoc']
        this.infoIndex_info = 0
        let fieldEditData = []
        fieldEditData = this.tempData_info.tablefield
        this.fieldDataEdit_info = fieldEditData.filter((item) => item.showflag == 'Y') // 可见可编辑字段,也就是表单显示字段
        // 赋值
        this.$set(this.infoData_info[this.infoIndex_info], 'table_code', this.tempData_info.table_code)
        this.$set(this.infoData_info[this.infoIndex_info], 'optype', 'edit')
        this.$set(
          this.infoData_info[this.infoIndex_info],
          'pkfilecode',
          this.infoData_info[this.infoIndex_info].pk_psndoc
        )
        this.infoDataForm_info = JSON.parse(JSON.stringify(this.infoData_info[this.infoIndex_info]))
        this.infoDataForm_model = JSON.parse(JSON.stringify(this.infoData_info[this.infoIndex_info]))
        this.backData_info.infoDataForm = JSON.parse(JSON.stringify(this.infoDataForm_info))
      } else {
        // 显示字段
        let fieldData_min = temp.tablefield.filter((item) => item.showlistflag == 'Y')
        // 是否需要审核
        this.isCheck = false
        if (this.infoData.aprlist && this.infoData.aprlist[temp.table_code]) {
          this.isCheck = true
        }
        this.rightbody_title = title
        this.rightbody = true
        this.tempData_info = temp // 模板数据
        this.infoData_info = this.infoData[temp.table_code] // 显示字段数据
        this.fieldData_info = fieldData_min
        let fieldEditData = []
        fieldEditData = this.tempData_info.tablefield
        let table_code = this.tempData_info.table_code
        this.infoDataForm_info_min = []
        let info = JSON.parse(JSON.stringify(this.infoData_info))
        if (info && info.length > 0) {
          info.forEach((item, index) => {
            item.table_code = table_code
            item.optype = 'edit'
            item.pkfilecode = this.infoData_info[index].pk_psndoc
            this.infoDataForm_info_min.push(item)
          })
        }
        this.backData_info.infoDataForm = JSON.parse(JSON.stringify(this.infoDataForm_info_min))
        this.backData_info.infoDataForm = JSON.parse(JSON.stringify(this.infoDataForm_info))
        this.fieldDataEdit_info = fieldData_min // 可见可编辑字段,也就是表单显示字段
        if (this.isCheck) {
          // 待审核数据
          this.right_text = '' // 删除按钮为空
          this.isShowAddButton = false // 新增按钮不显示
        }
      }
    },
    //获取数据
    getdata() {
      let param = {
        pk_psndoc: this.userInfoPkPsndoc,
      }
      // 查询个人信息数据
      getSubInfoVO(param).then((res) => {
        if (res.code == '200') {
          this.infoData = res.data
          this.$forceUpdate()
        } else {
          this.infoData = ''
          this.$forceUpdate()
        }
      })
      // 查询模板
      queryPsndocTemp(param).then((res) => {
        if (res.code == '200') {
          this.templateData = res.data
          this.templateData.forEach(item=>{
            if(item.table_code=="bd_psndoc"){
              this.isedit_show = item.caneditflag
            }
          })
          this.$forceUpdate()
        } else {
          this.templateData = []
          this.$forceUpdate()
        }
      })
    },
    uploadUrl() {
      this.$router.push({
        name: 'accessory',
        query: {
          filePath: this.userInfoPkPsndoc,
          disabled: 0,
        },
      })
    },
    // <！--个人信息修改方法-->
    closablerefer() {
      this.refer_show = false
    },
    // 获取字段规则
    getFieldRules(field) {
      let required = this.getFieldRequired(field)
      let message = this.getFieldPlaceholder(field)
      let rules = [{ required: required, message: message, trigger: 'blur' }]
      return rules
    },
    // 获取字段是否必填
    getFieldRequired(field) {
      let required = false
      if (field.mustflag === 'Y') {
        // 必填属性
        required = true
      }
      return required
    },
    // 获取字段说明
    getFieldPlaceholder(field) {
      let message = ''
      if ([0, 1, 2, 9, 4, 14, 18].includes(field.datatype)) {
        message = '请填写' + field.name
      } else if ([5, 3, 20, 101, 102, 6, 8].includes(field.datatype)) {
        message = '请选择' + field.name
      }
      return message
    },
    // 参照类型处理
    getReference(field, infoIndex) {
      if (this.isCheck) {
        return
      }
      //请求参数
      var param = {
        dataType: field.datatype,
        pk_refinfo: field.pk_refinfo,
        refModel: field.refmodel,
      }
      let selectorParam = {
        field: field,
        infoDataForm_info: this.infoDataForm_info,
      }
      queryReferencePsn(param).then((res) => {
        selectorParam.data = res.data.body
        selectorParam.datatype = res.data.datatype
        this.selectorParam = selectorParam
        this.refer_show = true
        this.infoIndex = infoIndex
        let arr = []
        if (selectorParam.datatype == 'tree') {
          this.selectorParam.data = this.listToTree(selectorParam.data)
        }
      })
    },
    listToTree(data) {
      let arr = JSON.parse(JSON.stringify(data))
      const listChildren = (obj, filter) => {
        ;[arr, obj.children] = arr.reduce(
          (res, val) => {
            if (filter(val)) res[1].push(val)
            else res[0].push(val)
            return res
          },
          [[], []]
        )
        obj.children.forEach((val) => {
          if (arr.length) listChildren(val, (obj) => obj.pid === val.tid)
        })
      }
      const tree = {}
      listChildren(tree, (val) => arr.findIndex((i) => i.tid === val.pid) === -1) // 找出父元素
      return tree.children
    },
    //下拉参照
    getSelectDate(field, infoIndex) {
      if (this.isCheck) {
        return
      }
      let selectorParam = {
        field: field,
        value: this.infoDataForm_info[field.code],
        text: 'title',
        key: 'value',
      }
      //请求参数
      var param = {
        dataType: field.datatype,
        pk_refinfo: field.pk_refinfo,
        refModel: field.refmodel,
      }
      queryReferencePsn(param).then((res) => {
        selectorParam.data = res.data.body
        selectorParam.datatype = res.data.datatype
        this.selectorParam = selectorParam
        this.infoIndex = infoIndex
        this.options = res.data.body
      })
    },
    // 下拉类型处理
    getSelectDatelist(e, item) {
      let list = item.data.props
      if (this.infoIndex !== '' && this.infoIndex !== null && this.infoIndex !== undefined) {
        this.$set(this.infoDataForm_info_min[this.infoIndex], this.selectorParam.field.code, list.value)
        this.$set(this.infoDataForm_info_min[this.infoIndex], this.selectorParam.field.code + '_name', list.title)
      } else {
        this.$set(this.infoDataForm_info, this.selectorParam.field.code, list.value)
        this.$set(this.infoDataForm_info, this.selectorParam.field.code + '_name', list.title)
      }
    },
    // 参照类型字段选择成功,回调事件
    selectOk(event, node) {
      let title = node.node.title
      let value = node.node.value
      this.infoIndex
      if (this.infoIndex !== '' && this.infoIndex !== null && this.infoIndex !== undefined) {
        this.$set(this.infoDataForm_info_min[this.infoIndex], this.selectorParam.field.code, value)
        this.$set(this.infoDataForm_info_min[this.infoIndex], this.selectorParam.field.code + '_name', title)
      } else {
        this.$set(this.infoDataForm_info, this.selectorParam.field.code, value)
        this.$set(this.infoDataForm_info, this.selectorParam.field.code + '_name', title)
      }
      this.refer_show = false
    },
    getDate(event, field, infoIndex) {
      debugger
      let layout, date
      layout = field.datatype == 8 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
      if (event) {
        date = this.moment(event._d).format(layout)
      } else {
        date = ''
      }
      if (this.isCheck) {
        return
      }
      if (infoIndex !== '' && infoIndex !== null && infoIndex !== undefined) {
        this.$set(this.infoDataForm_info_min[infoIndex], field.code, date)
      } else {
        this.$set(this.infoDataForm_info, field.code, date)
      }
    },
    //switch 切换选中的值
    getswitch(event, field, infoIndex) {
      let state
      if (event) {
        state = 'Y'
      } else {
        state = 'N'
      }
      if (infoIndex !== '' && infoIndex !== null && infoIndex !== undefined) {
        this.$set(this.info, field.code, state)
      } else {
        this.$set(this.infoDataForm_info, field.code, state)
      }
    },
    // 获取字段是否禁用
    getFieldDisabled(field) {
      let disabled = false
      if (field.caneditflag === 'N') {
        // 必填属性
        disabled = true
      }
      if (this.isCheck) {
        disabled = true
      }

      return disabled
    },
    //删除子集
    delSubsetData(index, info) {
      if (info.optype == 'add') {
        this.infoDataForm_info_min.splice(index, 1)
      } else {
        this.$set(this.infoDataForm_info_min[index], 'optype', 'del')
      }
      this.$forceUpdate()
    },
    //新增子集数据
    addSubsetData() {
      if (this.infoDataForm_info_min.length < 10) {
        let table_code = this.tempData_info.table_code
        let pkfilecode = '' // this.infoData_info['0'].pk_psndoc
        let list = {
          table_code: table_code,
          optype: 'add',
          pkfilecode: pkfilecode,
        }
        this.infoDataForm_info_min.push(list)
      }
    },
    // 提交
    submitData() {
      // 校验必填数据
      let _this = this
      let fieldNames = this.getFieldRequiredAll(this.fieldDataEdit_info)
      const infoDataForm = this.infoDataForm_info
      const infoDataFormBack = this.backData_info.infoDataForm
      const keys = Object.keys(infoDataForm)
      const data = keys.filter((key) => infoDataForm[key] !== infoDataFormBack[key])
       // 校验表单
      let isvalidate = false 
       this.$refs.formData_info.validate((valid,data) => {
          console.log(valid,data)
          if (!valid) {
           isvalidate  = false
           
          } else {
            isvalidate  = true
          }
        })
        if(isvalidate){
           if (data.length == 0) {
            this.$message.warning("没有修改过的数据")
            return
          }else{
            let str = this.judgmentReview(data, this.fieldData_info)
            if (str !== '') {
              console.log(this)
              _this.$confirm({
                title: '以下信息需要审核通过才能生效',
                content: str,
                onOk() {
                  _this.checkSubmit()
                },
                onCancel() {
                  console.log('Cancel')
                },
              })
            } else {
              _this.$confirm({
                title: '是否确认提交',
                content: str,
                onOk() {
                   _this.checkSubmit()
                },
                onCancel() {
                  console.log('Cancel')
                },
              })
            }
          }
        }
    },
    // 提交保存
    checkSubmit() {
      this.loadingButton = true
      let params = {
        data: this.infoDataForm_info,
      }
      saveSubInfo(params)
        .then((res) => {
          //this.loadingButton = false
          this.$message.success('提交成功')
          setTimeout((res) => {
            this.rightbody_title = false
            this.infobody = false
          }, 500)
        })
        .catch((res) => {
          //this.loadingButton = false
          this.$message.error(res.message)
        })
    },
    // 提交
    submitData_min(e) {
      //console.log(this.info)
      console.log(this.infoDataForm_info_min)
      let _this = this
      // 校验表单
      let isvalidate = false 
       for (let i = 0; i < this.infoDataForm_info_min.length; i++) {
          this.$refs.formData[i].validate((valid,data) => {
          console.log(valid,data)
          if (!valid) {
            isvalidate = false

            return false
           
          } else {
             isvalidate = true
              return true
          }
        })
        if(!isvalidate){
          break
        }
        }
        if(isvalidate){
          let data = this.infoDataForm_info_min.filter((item) => item.optype)
          this.loadingButton = true
          let params = {
            data: data,
          }
          saveSubInfo(params)
            .then((res) => {
              _this.loadingButton = false
              _this.$message.success('提交成功')
              setTimeout((res) => {
                _this.rightbody = false
                _this.infobody = false
                _this.getdata()
              }, 500)
            })
            .catch((res) => {
              this.loadingButton = false
              this.$message.error(res.message)
            })
        }
       },
    // 撤回
    rollbackData() {
      let _this = this
      let params = {
        tableCode: this.tempData_info.table_code,
      }
      revokeLisn(params).then((res) => {
        this.loadingButton = false
        this.$message.success('撤回成功')
        setTimeout((res) => {
             _this.rightbody = false
            _this.infobody = false
            _this.getdata()
        }, 500)
      })
    },
    // 判断需要审核的字段信息
    judgmentReview(templateData, formData) {
      let str = ''
      templateData.forEach((key) => {
        formData.forEach((item) => {
          if (key === item.code) {
            if (item.checkflag === 'Y') {
              str += item.name + ','
            }
          }
        })
      })
      if (str !== '') {
        str = str.substring(0, str.length - 1)
      }
      return str
    },
    // 获取所有必填字段
    getFieldRequiredAll(data) {
      let fields,
        fieldsName = []
      fields = data.filter((field) => field.mustflag === 'Y')
      fields.forEach((item) => {
        fieldsName.push(item.name)
      })
      return fieldsName
    },
    close(item) {
      this.rightbody = false
      if (item == '1') {
        this.infobody = false
        this.infoDataForm_info = this.backData_info && this.backData_info.infoDataForm
      } else {
        this.rightbody = false
        this.infoDataForm_info_min = this.backData_info && this.backData_info.infoDataForm
      }
    },
  },
}
</script>

<style lang="less" scoped>
.personal {
  .personal-body {
    .personal-item {
      color: #333;
      margin-bottom: 15px;
      .value {
        padding-left: 10px;
      }
    }
    .personal-right {
      padding-right: 23px;
      overflow-y: scroll;
      .personal-row{
        padding: 0 30px 30px;
        background: #fff;
      }
      .info-data {
        padding: 20px 0;
        width: 100%;
        background: #fff;
        .upload {
          color: #333;
          font-size: 16px;
          text-align: right;
          padding: 5px 20px;
          cursor: pointer;
        }
      }
      .info-photo {
        width: 100px;
        height: 100px;
        line-height: 100px;
      }
    }
  }
}
</style>
<style lang="less">
.personal {
  .ant-collapse-header {
    box-shadow: 0px 2px 16px 0px rgb(167, 167, 167, 0.2);
    border-radius: 16px;
    background: #fff;
    margin-bottom: 15px;
  }
  .ant-collapse-content {
    border-top: none;
  }
  .ant-collapse > .ant-collapse-item {
    border-bottom: none;
  }
  .ant-anchor-link {
    padding: 10px 0 10px 16px;
  }
  .ant-collapse-content > .ant-collapse-content-box {
    min-height: 100px;
  }
  .ant-row {
    margin: 0;
  }
  .icon_list {
    font-size: 20px;
    margin-right: 10px;
  }
  .ant-collapse {
    border: none;
  }
  .ant-collapse-item:first-child {
    .ant-collapse-header {
      display: none;
    }
  }
  .ant-collapse-content > .ant-collapse-content-box {
    padding: 16px 30px;
  }
  .ant-anchor-link {
    font-size: 16px;
    color: #333;
  }
}
.information {
  .ant-row {
    margin: 0 !important;
    .ant-col {
      padding-bottom: 5px;
    }
  }
}
.footer-but {
  text-align: center;
  padding: 20px;
  .ant-btn {
    width: 200px;
    margin-right: 15px;
  }
}
.footer {
  text-align: center;
  padding: 20px;
  .ant-btn {
    width: 200px;
    margin-right: 15px;
  }
}
.ant-collapse > .ant-collapse-item:last-child, .ant-collapse > .ant-collapse-item:last-child > .ant-collapse-header{
  border-radius: 16px;
}
</style>