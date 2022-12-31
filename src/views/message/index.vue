<template>
  <div class="message">
    <div class="message-body">
      <div class="title">
         <a-icon type="message" theme="filled" :style="{ fontSize: '16px', color: '#08c' }"  /> 消息中心
      </div>
      <div class="title-but">
        <label>消息类别</label>
        <span  v-for="(item,index) in titltList" :key="index" type="primary" @click="filterData(item,index)" :class="{active: number ===index}">{{item.name}}</span>
      </div>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="消息NC">
          <a-list item-layout="horizontal" :data-source="noticeMessageList">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta :description="item.content" @click="noticeitem(item)">
                <a slot="title" href="javascript:void(0)" >{{ item.subject }}
                 <span class="time">{{ item.sendtime }}</span>
                </a>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-tab-pane>
        <a-tab-pane key="2" tab="工作任务">
          <a-list item-layout="horizontal" :data-source="approveMessageList">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta :description="item.content" >
                <a slot="title" href="javascript:void(0)">{{ item.subject }} 
                <span class="time">{{ item.sendtime }}</span></a>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import storage from 'store'
import Header from '@/components/Header/Index'
import notification from 'ant-design-vue/es/notification'
import { queryNoticeMessageList,queryApproveMessageList } from '@/api/message'

export default {
  name: 'message',
  components: { Header },
  data() {
    return {
      loading: true,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1,
      },
      titltList:[],
      noticeIsreadList: [
          {
            name: '全部',
            isread: ''
          },
          {
            name: '已读',
            isread: 'Y'
          },
          {
            name: '未读',
            isread: 'N'
          }
        ],
        approveIsreadList: [
          {
            name: '全部',
            isread: ''
          },
          {
            name: '已审批',
            isread: 'Y'
          },
          {
            name: '未审批',
            isread: 'N'
          }
        ],
      
      isread:'',
      active:'2',
       pageSize: 20,
      current: 4,
      noticeMessageList: [],
      noticeMessageListBak: [],
      approveMessageList: [],
      approveMessageListBak: [],
      userinfo:storage.get('Hrsh-Pc-UserInfo'),
      tabKey:'1',
      number:0,
    }
  },
  computed: {},
  created() {
    this.titltList = this.noticeIsreadList
    this.getNoticeMessageList()
    this.getApproveMessageList()
  },
  methods: {
      
      // 获取消息
      getNoticeMessageList() {
        let params = {
          userId: this.userinfo.user_id,
        }
        queryNoticeMessageList(params).then(res => {
          if(res.code == '200'){
            this.noticeMessageList = res.data
            this.noticeMessageListBak = res.data
          }else{
            this.noticeMessageList = []
            this.noticeMessageListBak = []
          }
          
        })
      },
      //获取工作任务
      getApproveMessageList() {
        let params = {
          userId: this.userinfo.user_id,
        }
        queryApproveMessageList(params).then(res => {
          if(res.code == '200'){
            this.approveMessageList = res.data
           this. approveMessageListBak= res.data
          }else{
            this.approveMessageList = []
            this. approveMessageListBak= []
          }
          
        })
      },
      //筛选数据
      filterData(item,index){
        this.number = index
        this.isread = item.isread
        if(this.tabKey =='1'){
          if(this.isread!==''){
            this.noticeMessageList =  this.noticeMessageListBak.filter(i => i.isread === this.isread)
          }else{
            this.noticeMessageList =  this.noticeMessageListBak
          }
        }else{
          if(this.isread!==''){
            this.approveMessageList =  this.approveMessageListBak.filter(i => i.isread === this.isread)
          }else{
            this.approveMessageList =  this.approveMessageListBak
          }
        }
      },
      //点击消息项
      noticeitem(item){

      },
      //切换tab
      callback(e){
        this.tabKey = e;
        this.number = 0;
        this.isread ='';
        if(this.tabKey=='1'){
          this.titltList = this.noticeIsreadList
        }else{
          this.titltList = this.approveIsreadList
        }
      }
  },
}
</script>

<style lang="less" scoped>
.message {
  padding: 0 20px 20px;
  height: 100%;
  .message-body {
    height: 100%;
    padding: 10px 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(167, 167, 167, 0.4);
     overflow-y: scroll;
    .title-but{
        text-align: right;
        display: block;
        label{
          margin-right: 10px;
        }
       span{
        color:#fff;
        background: #999999;
        padding: 5px 10px;
        margin-right: 10px;
        cursor: pointer;
      }
      .active{
        background: #2479ED;
      }
    }
  }
}
</style>
<style lang="less" >
.message {
  .time{
    float:right;
    margin-right:15px
  }
}
 
</style>