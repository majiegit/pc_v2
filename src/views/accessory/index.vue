<template>
  <div class="accessory">
    <Header ></Header>
    <div class="accessory-body">
      <div>
        <a-upload
          list-type="picture"
          :file-list="fileList"
           class="upload-list-inline"
          :disabled="disabled"
          name="fileName"
          :download="handleDownload"
          :remove="handleFileRemove"
          :customRequest="uploadFile"
          :showUploadList="{
            showRemoveIcon: true,
            showDownloadIcon: true,
          }"
        >
          <a-button style="  float: right "> <a-icon type="upload" /> 上传附件 </a-button>
        </a-upload>
      </div>
    </div>
  </div>
</template>

<script>
import storage from 'store'
import Header from '@/components/Header/Index'
import { getFileList, deleteFile, uploadFile } from '@/api/filemanager'
import Item from '@/components/AvatarList/Item'

export default {
  name: 'message',
  components: {Header},
  data() {
    return {
      loading: true,
      previewVisible: false,
      filePath: '',
      disabled: false,
      fileList: [],
    }
  },
  computed: {},
  created() {
    this.filePath = this.$route.query.filePath
    if (this.$route.query.disabled == 1) {
      this.disabled = true
    } else {
      this.disabled = false
    }
    this.queryFileList()
  },
  mounted() {},
  methods: {
    //下载附件
    handleDownload(file) {
      window.location.href = file.downloadUrl
    },
    // 上传附件
    uploadFile(file) {
     let params = new FormData()
      params.append('filePath', this.filePath)
      params.append('fileName', file.file.name)
      params.append('file', file.file)
      uploadFile(params).then((res) => {
        this.$message.success(res.message)
        this.queryFileList()
        
      })
    },
    // 获取附件列表
    queryFileList() {
      this.fileList = []
      let params = {
        filePath: this.filePath,
      }
      getFileList(params).then((res) => {
        console.log(res.code)
        if (res && res.code == '200') {
          // this.fileList = []
          if (res.data.length > 0) {
            res.data.forEach((Item, index) => {
              Item.name = Item.fileName
              Item.uid = index
              Item.status = 'done'
              Item.url = Item.viewUrl
              Item.thumbUrl =Item.downloadUrl
              this.fileList.push(Item)
              
            })
          }
        }
      })
    },
    //删除附件事件
    handleFileRemove(file, index) {
      
      let _this = this
      this.$confirm({
        title: '删除附件',
        content: (h) => <div>确认要删除该附件吗?</div>,
        onOk() {
          let params = []
          params.push(file.nodePath)
          deleteFile(params).then((res) => {
              const index = _this.fileList.indexOf(file);
              const newFileList = _this.fileList.slice();
              newFileList.splice(index, 1);
              _this.fileList = newFileList;

            //this.fileList.splice(index, 1)
            _this.$message.success(res.message)
          })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.accessory {
  padding:  20px;
  height: 100%;
  background: #fff;
  .accessory-body {
    height: 100%;
    padding: 10px 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(167, 167, 167, 0.4);
    overflow-y: scroll;
    
  }
}
</style>
<style lang="less" >
.accessory{
  .accessory-body{
    .ant-btn{
      float: right !important;
    }
    .ant-upload-list-item-card-actions.picture {
      font-size: 20px;
      a{
        margin-right: 20px;
      }
    }
    .ant-upload.ant-upload-select {
        display: block;
        height: 50px;
    }
  }
}
</style>