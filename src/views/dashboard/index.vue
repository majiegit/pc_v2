<template>
  <div class="home">
    <Header ></Header>
    <a-row :gutter="16" :style="{'height': currentHeight}">
      <a-col class="gutter-row home-left" :span="4" >
        <div class="Menus">
          <div class="photo">
            <div class="photo-item">
              <div class="image">
                <img :src="userinfo.photo" alt="" />
              </div>
              
              <!-- <span class="photo-icon" @click="handleMessageClick">
                <a-icon type="bell" style="font-size: 25px" theme="filled" />
                <span class="count">{{count}}</span>
              </span> -->
              <span style="margin-right:24px"  @click="handleMessageClick">
                <a-badge :count="count"><a-avatar style="font-size: 25px;backgroundColor: #fff;color: #333;" theme="filled" icon="bell"/></a-badge>
              </span>
            </div>
            <div class="photo-text">
              <div>{{ userinfo.name }}</div>
              <div class="jobname">{{ userinfo.deptname }} / {{ userinfo.postname }}</div>
              <div class="explain">这是您加入用友集团的第 <span style="color:#0875ff">{{ userinfo.joinsysday }}</span> 天</div>
            </div>
          </div>
          <div class="menuData">
            <a-menu mode="vertical" :default-selected-keys="selectedKeys" >
             <a-menu-item  v-for="(item,index) in menuData"  :key="item.role.staff_role_id"  @click="handleClick(item)">
               <div v-html="item.role.icon" class="menuIcon" ></div>
              
              {{item.role.staff_role_name}}
            </a-menu-item>
           </a-menu>
            <div  class="logout-text">
              <span  @click="logout"> <a-icon type="left-circle" theme="filled" /> 退出登录</span>
            </div>
          </div>
        </div>
      </a-col>
      <a-col class="gutter-row home-right" :span="20">
        <div class="home-row" :gutter="16">
          <div class="home-col col-2" :span="8">
            <div class="col-title">
              <span class="greet">欢迎进入</span>
              <img :src="imgTitle" alt="" />
            </div>
          </div>
          <div class="home-col col-1" :span="8"  v-for="(item,index) in selectData"  :key="index" >
            <div class="col-item" @click='routerpush(item.pc_path)'>
              <div class="menuListItem" >
                <div v-html="item.icon" class="menuIcon"  v-bind:style="{ background: item.icon_color }"></div>
              </div>
              <div class="text">{{item.name}}</div>
            </div>
          </div>
           <!-- <div class="home-col col-1" @click="showModal">
            <div class="col-item col-add">
              <a-icon type="plus" style="font-size: 50px" />
              <div class="text">添加</div>
            </div>
          </div> -->
        </div>
      </a-col>
    </a-row>
    <a-modal
      title="添加标题"
      :width="1000"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="model">
        <div class="model-item">
          <h3>已添加</h3>
          <div>
            <a-row :gutter="8">
              <a-col :span="3" class="checkbox-item">
                <a-checkbox value="A">
                  <div class="model-select">
                    <img :src="imgCs" alt="" class="img" />
                    <div class="text">个人中心</div>
                  </div>
                </a-checkbox>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="model-item">
          <h3>未添加</h3>
          <div>
            <a-checkbox-group @change="onChange" style="width: 100%">
              <a-row>
                <a-col :span="3" class="checkbox-item">
                  <a-checkbox value="A">
                    <div class="model-select">
                      <img :src="imgCs" alt="" class="img" />
                      <div class="text">个人中心</div>
                    </div>
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import storage from 'store'
import Header from '@/components/Header/Index'
import RightContent from '@/components/GlobalHeader/RightContent'
import ALayoutSider from 'ant-design-vue/es/layout/Sider'
import notification from 'ant-design-vue/es/notification'
import { getStaffRoleMenu,getMessageCount } from '@/api/home'
import request from '@/utils/request'
import Item from '@/components/AvatarList/Item'
export default {
  name: 'dashboard',
  components: { ALayoutSider, RightContent,Header },
  data() {
    return {
      loading: true,
      userinfo:{
        deptname: "",
        joinsysdate: "",
        joinsysday: "",
        joinworkdate: "",
        mobile: "",
        name: "",
        orgname: "",
        photo: "",
        pk_org: "",
        pk_psndoc: "",
        postname: "",
        sex: "",
      },
      menuData: [],
      selectData:[],
      vertical: 'horizontal',
      selectedKeys: ['1579627330062413826'],
      openKeys: [],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1,
      },
      imgExample: require('../../../src/assets/example.png'),
      imgTitle: require('../../../src/assets/title.png'),
      imgTitle2: require('../../../src/assets/title.png'),
      imgCs: require('../../../src/assets/cs.png'),
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      count:'0',
      currentHeight:''
    }
  },
  computed: {},
  created() {
    let info =storage.get('Hrsh-Pc-UserInfo')
    this.currentHeight = (document.documentElement.clientHeight -74) + 'px'
    this.userinfo = {...info}
    this.getMenus()
    this.getMessage()
      
  },
  methods: {
    handleClick (item){
      this.selectData= []
      this.selectData = (item.menuList) || []
    },
    // 获取权限菜单
    getMenus() {
      let params = {
        userId: this.userinfo.user_id,
        status: 1,
        menu_type: 0,
      }
      getStaffRoleMenu(params).then((res) => {
        if (res.code == '200') {
          this.selectedKeys = []
          this.menuData = res.data
          this.selectData = (res.data && res.data[0]&& res.data[0].menuList) || []
          let staffRoleId = (res.data && res.data[0]&& res.data[0].role && res.data[0].role.staff_role_id) || ''
          this.selectedKeys.push(staffRoleId)
          console.log(this.selectedKeys)
         } else {
          this.menuData = []
          this.selectData = []
        }
      })
    },
    //获取未读消息个数
    getMessage() {
      let params = {
        userId: this.userinfo.user_id,
      }
      getMessageCount(params).then((res) => {
        console.log(res)
        if (res.code == '200') {
         this.count = res.data
        } else {
          this.count = '0'
        }
      })
    },
    handleMessageClick() {
       this.$router.push('/message')
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel(e) {
     
      this.visible = false
    },
    onChange(checkedValues) {
      console.log('checked = ', checkedValues)
    },
    routerpush(router) {
      this.$router.push(`/${router}`)
    },
    //退出登录
     logout() {
      //localStorage.clear();
      storage.remove('Hrsh-Pc-Access-Auth')
      storage.remove('Hrsh-Pc-Refresh-Auth')
      storage.remove('Hrsh-Pc-UserInfo')
      window.location.reload()
      this.$router.push("/login")
     
    },
  },
}
</script>

<style lang="less" scoped>

.home {
  background: #fff;
  height: 100%;
  overflow-x: hidden;
  .ant-row{
    height: 100%;
  }
  .home-right {
    padding: 20px 20px;
    height: 100%;
    background: #fff;
    box-shadow: 0px 0px 32px 0px rgb(56 ,63 ,98 , 0.2);
    border-radius: 16px;
    .home-col {
      display: inline-block;
      margin-bottom: 20px;
      padding-left: 8px;
      padding-right: 8px;
      .menuListItem{
        .menuIcon{
          border-radius: 100%;
          width: 80px;
          height: 80px;
          text-align: center;
          margin: 0 auto;
          position: relative;
          .icon{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      } 
    }
    .col-title {
      .greet {
        color: #5a66fe;
        display: block;
        font-size: 35px;
        font-weight: 600;
        border-left: 5px solid #5a66fe;
        line-height: 1;
        padding: 0 0 0 15px;
        margin-bottom: 20px;
      }
      img {
        width: 250px;
      }
    }
    .col-2 {
      width: 40%;
    }
    .col-1 {
      width: 20%;
      text-align: center;

      .col-item {
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(167, 167, 167, 0.4);
        padding: 35px 0 35px;
       
        .text {
          font-size: 20px;
          padding-top: 15px;
          font-weight: 400;
          // color: #fff;
        }
      }
      .col-add {
        background: linear-gradient(180deg, #30c5fc, #5a66fe);
        color: #fff;
      }
    }
  }
  .home-left{
    height: 100%;
    background: #f0f2f5;    
  }
}
</style>
<style  lang="less" >
.Menus {
  height: 100%;
  margin-right: 15px;
  border-right: 1px solid #e8e8e8;
  background: #fff;
  position: relative;
  .logout-text{
    position: absolute;
    bottom: 20px;
    text-align: center;
    width: 100%;
    cursor: pointer;
    font-size: 15px;
    color: #0875ff;
    
  }
  .ant-menu-item {
    height: 70px !important;
    line-height: 70px !important;
    font-size: 16px;
    text-align: center;
    padding: 0 !important;
  }
  .ant-menu-item-selected {
    border-left: 5px solid #2479ed;
    color: #0875ff !important;
  }
  .photo {
    .photo-item {
      padding: 25px 0;
      text-align: center;
      .image{
          width: 90px;
          height: 90px;
          border-radius: 100%;
         // margin: 0 auto;
         border: 5px solid #D3E4FB;;
         display: inline-block;
      }
      img {
        width: 80px;
        height: 80px;
        border-radius: 100%;
        // margin: 0 auto;
      }
      .photo-icon {
        display: inline-block;
        position: relative;
        .count {
          position: absolute;
          font-size: 16px;
          right: -10px;
          color: #fff;
          top: -6px;
          line-height: 1;
          background: #ff4545;
          border-radius: 100%;
          padding: 2px 3px;
        }
      }
    }
    .photo-text {
      text-align: center;
      font-size: 16px;
      padding: 0 10px 0;
      color: #333;
      font-weight: 500;
      div {
        padding-bottom: 10px;
      }
      .jobname {
        font-size: 14px;
      }
      .explain {
        font-size: 12px;
        color: #333;
        border-top: 1px solid #c0c0c0;
        padding-top: 5px;
      }
    }
  }
  .gutter-row {
    height: 100%;
    padding: 0 !important;
    .ant-menu {
      height: 100%;
    }
  }
}
.model {
  .model-item {
    .checkbox-item {
      text-align: center;
      .ant-checkbox-wrapper {
        position: relative;
      }
      .ant-checkbox-inner {
        position: absolute !important;
        left: 25px !important;
        top: 15px !important;
        width: 22px !important;
        height: 22px !important;
        border-radius: 100%;
      }
      .ant-checkbox-inner::after {
        left: 29% !important;
        top: 47%;
      }
      .ant-checkbox-checked::after {
        left: 25px;
        border: none !important;
      }
    }
    .model-select {
      img {
        width: 80px;
      }
      .text {
        font-weight: 600;
        padding-top: 5px;
        color: #fff;
      }
    }
  }
}
.menuIcon svg {
  width: 50px;
  height: 50px;
}  
.home-col {
  .menuListItem{
    .menuIcon{
      border-radius: 100%;
      width: 80px;
      height: 80px;
      text-align: center;
      margin: 0 auto;
      position: relative;
      .icon{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  } 
}     
</style>
