<!--
声明： 当前vue文件 为开发岗位文件, 包含增删改查
替换步骤：1、岗位 -> 模块名
          2、Post -> 模块名  eg: Temp
          3、post -> 模块名  eg: temp
-->

<template>
  <a-row type="flex" :gutter="[24,24]" style="background: #fff;">
    <a-spin :spinning="loading">
      <!-- 搜索行-->
      <a-col :span="24">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="6" :sm="24">
                <a-form-item label="岗位名称">
                  <a-input v-model="postQueryParam.postName" placeholder="请输入岗位名称"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="岗位编码">
                  <a-input v-model="postQueryParam.postCode" placeholder="请输入岗位编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-space>
                  <a-button type="primary" @click="queryPostDataByParam" icon="search">查询</a-button>
                  <a-button @click="resetPostQueryParam">重置</a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>

      <!--操作按钮区域-->
      <a-col :span="24">
        <a-space>
          <a-button type="primary" icon="plus" @click="openPostModal">新增岗位</a-button>
          <a-button @click="removeBatchPost" type="danger" icon="delete" v-if="selectedDataIds.length > 0">批量删除</a-button>
        </a-space>
      </a-col>


      <!--岗位列表区域-->
      <a-col span="24">
        <a-table
          align="center"
          row-key="postId"
          :columns="postTableColumns"
          :pagination="page"
          :data-source="postData"
          :row-selection="{ selectedRowKeys: selectedDataIds, onChange: changeTableSelect }"
          @change="changeTablePage"
        >
            <span slot="postType" slot-scope="postType">
                <a-tag color="orange" v-if="postType == 0">数组</a-tag>
                <a-tag color="green" v-if="postType == 1">树形</a-tag>
            </span>
          <template slot="operation" slot-scope="text,record">
            <a-space>
              <a href="javascript:;" @click="updatePost(record)">编辑</a>
              <a href="javascript:;" style="color: red;">
                <a-popconfirm
                  title="确定要删除此岗位吗?"
                  @confirm="() => removePost(record)"
                >删除
                </a-popconfirm>
              </a>
            </a-space>
          </template>
        </a-table>
      </a-col>

      <!-- 添加、修改窗口-->
      <a-modal
        :title="modalTitle"
        :visible="modalVisible"
        :confirm-loading="modalConfirmLoading"
        @ok="savePostModal"
        @cancel="cancelPostModal"
      >
        <a-form-model :model="postForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" colon labelAlign="left"
                      ref="postFormRef"
                      :rules="postFormRules">
          <a-form-model-item label="岗位名称" prop="postName">
            <a-input v-model="postForm.postName"/>
          </a-form-model-item>
          <a-form-model-item label="岗位编码" prop="postCode">
            <a-input v-model="postForm.postCode"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-spin>
  </a-row>
</template>

<script>
  import {queryPostPage, queryPostFieldList, deletePost, deletePostBatch, savePost} from '@/api/post'

  export default {
    name: "post",
    data() {
      return {
        postData: [],
        selectedDataIds: [],
        loading: true,
        postQueryParam: {},
        // 分页对象
        page: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          showQuickJumper: true,
          total: 0,
          pages: 0,
          hideOnSinglePage: true
        },
        // 新增、修改时候Form表单
        postForm: {},
        postTableColumns,
        postColumns: [],
        postFormRules,
        // 弹出框相关参数
        modalTitle: '',
        modalVisible: false,
        modalConfirmLoading: false
      }
    },
    created() {
    },
    mounted() {
      this.getPostData()
    },
    methods: {
      /**
       * 查询数据点击事件
       */
      queryPostDataByParam() {
        console.log(this.postQueryParam)
        this.getPostData()
      },
      /**
       * 重置查询条件
       */
      resetPostQueryParam() {
        this.postQueryParam = {}
      },
      /**
       * 查询数据
       */
      getPostData() {
        this.loading = true
        let param = {
          current: this.page.current,
          size: this.page.pageSize,
          postName: this.postQueryParam.postName,
          postCode: this.postQueryParam.postCode,
        }
        Object.keys(param).forEach(item => {
          if (param[item] === null || param[item] === '' || param[item] === undefined) {
            delete param[item]
          }
        })
        queryPostPage(param).then(res => {
          this.loading = false
          this.postData = res.data.records  // 用户数据
          this.page.current = res.data.current
          this.page.pageSize = res.data.size
          this.page.total = res.data.total
          this.page.pages = res.data.pages
        })
      },
      /**
       * 取消岗位窗口
       */
      cancelPostModal() {
        this.modalVisible = false
        this.$refs['postFormRef'].clearValidate()
        this.postForm = {}
      },
      /**
       * 保存岗位
       */
      savePostModal() {
        console.log(this.postForm)
        this.$refs.postFormRef.validate(valid => {
          if (!valid) {
            return false
          } else {
            this.modalConfirmLoading = true
            savePost(this.postForm).then(res => {
              this.modalConfirmLoading = false
              this.$message.success(res.message)
              this.cancelPostModal()
              this.getPostData()
            },error => {
                this.modalConfirmLoading = false
              }
            )
          }
        })
      },
      /**
       * 打开岗位窗口
       */
      openPostModal() {
        this.modalVisible = true
        this.modalTitle = '添加岗位'
      },
      /**
       * 修改岗位
       */
      updatePost(row) {
        let form = JSON.parse(JSON.stringify(row))
        this.modalVisible = true
        this.modalTitle = '修改岗位'
        this.postForm = form
      },
      /**
       * 表格选择事件
       */
      changeTableSelect(selectedDataIds) {
        console.log('selectedRowKeys changed: ', selectedDataIds)
        this.selectedDataIds = selectedDataIds
      },
      /**
       * 分页改变事件
       */
      changeTablePage(val) {
        this.page.current = val.current
        this.page.pageSize = val.pageSize
        this.getPostData()
      },
      /***
       * 批量删除
       */
      removeBatchPost() {
        this.loading = true
        deletePostBatch(this.selectedDataIds).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.selectedDataIds = []
          this.getPostData()
        })
      },
      /**
       * 删除岗位
       */
      removePost(row) {
        this.loading = true
        deletePost(row.postId).then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getPostData()
        })
      },
      // /**
      //  * 查询用户显示字段
      //  */
      // getPostFieldList() {
      //   queryPostFieldList().then(res => {
      //     this.postColumns = res.data
      //     this.getTablePostColumns(res.data)
      //     this.getPostData()
      //   })
      // },
      // /**
      //  * 处理表格显示字段
      //  */
      // getTablePostColumns(data) {
      //   let arr = []
      //   data.forEach(field => {
      //     var obj = {
      //       title: field.name,
      //       dataIndex: field.field,
      //       scopedSlots: {
      //         customRender: field.field
      //       },
      //       ellipsis: true
      //     }
      //     arr.push(obj)
      //   })
      //   // 添加操作列
      //   let operation = {
      //     title: '操作',
      //     dataIndex: 'operation',
      //     scopedSlots: {customRender: 'operation'},
      //   }
      //   arr.push(operation)
      //   this.postTableColumns = arr
      // }
    }
  }
  const postFormRules = {
    postName: [{required: true, message: '请输入岗位名称', trigger: 'blur'}],
    postCode: [{required: true, message: '请输入岗位编码', trigger: 'blur'}]
  }

  const postTableColumns = [

    {
      title: '岗位名称',
      dataIndex: 'postName',
      scopedSlots: {
        customRender: 'postName'
      },
      ellipsis: true
    },
    {
      title: '岗位编码',
      dataIndex: 'postCode',
      scopedSlots: {
        customRender: 'postCode'
      },
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      scopedSlots: {
        customRender: 'createTime'
      },
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'}
    }
  ]
</script>

<style scoped>
  .body {
    width: 100%;
    padding: 20px 10px 50px 10px;
    background: #fff;
  }

  .header {
    padding-bottom: 20px;
  }
</style>