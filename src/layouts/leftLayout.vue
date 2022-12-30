<template>
  <div class="Menus-body">
    <a-layout>
      <a-layout-header :style="{ width: '100%',background: '#fff',padding: '0px', 'margin-bottom': '10px' }">
        <div class="header_left">
          <img src="../assets/logo.png">
        </div>
      </a-layout-header>
       <a-layout>
          <a-layout-sider class="Menus">
          <div class="photo">
            <div class="photo-item">
              <img :src="userinfo.photo" alt="" />
              <!-- <span class="photo-icon" @click="handleMessageClick">
                <a-icon type="bell" style="font-size: 25px" theme="filled" />
                <span class="count">8</span>
              </span> -->
            </div>
            <div class="photo-text">
              <div>{{userinfo.name}}1111</div>
              <div class="jobname">{{userinfo.deptname}} / {{userinfo.postname}}</div>
              <div class="explain">这是您加入用友集团的第 {{userinfo.joinsysday}} 天</div>
            </div>
          </div>
          <div class="menuData">
            <a-menu
             mode="vertical"
            @click="handleClick"
          >
           <a-sub-menu v-for="(item,index) in menuData"  :key="index">
              <template #icon>
                <AppstoreOutlined />
              </template>
              <template #title>{{item.role.staffRoleName}}</template>
              <a-menu-item  v-for="i in item.menuList"  :key="i.id">{{i.name}}</a-menu-item>
            </a-sub-menu>
           </a-menu>
          </div>
        </a-layout-sider>
          <a-layout-content>
          <router-view/>
          </a-layout-content>
      </a-layout>
      
    </a-layout>
  </div>

</template>
<script>
  import storage from 'store'
  import RightContent from '@/components/GlobalHeader/RightContent'
  import ALayoutSider from "ant-design-vue/es/layout/Sider";
  import { getStaffRoleMenu } from '@/api/home';
  export default {
    name: 'leftLayout',
    components: {ALayoutSider, RightContent},
    data(){
      return{
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
      vertical: 'horizontal',
      selectedKeys: [],
      openKeys: [],
      }
    },
    created() {
     
      let info =storage.get('Hrsh-Pc-UserInfo')
      this.userinfo = {...info}
      this.getMenus()
      console.log( this.userinfo)
      
    },
    methods: {
      // handleClick: MenuProps['onClick'] = menuInfo => {
      // console.log('click ', menuInfo);
      // },
      handleClick (){
      console.log('click ', menuInfo);
      },
      refresh() {
        window.location.reload()
      },
      // 获取权限菜单
      getMenus() {
        let params = {
          userId: this.userinfo.user_id,
          status: 1,
          menuType: 1
        }
        getStaffRoleMenu(params).then(res => {
          console.log(res)
          if(res.code == '200'){
            this.menuData = res.data
          }else{
            this.menuData = []
          }
          
        })
      },
      handleMessageClick(){
        debugger
        this.$router.push('/message')
      }
    }
    
  }
</script>
<style lang="less">
  .header_left {
    width: 15%;
    float: left;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, #28B0FF, #0875FF);
    img {
      width: 70%;
    }
      
  }
   .ant-layout-sider {
    background: #FFF !important;
    }
    .Menus-body{
      height: 100%;
      .ant-layout{
        height: 100%;
      }
    }
    .Menus{
      height: 100%;
      margin-right: 15px;
      .ant-menu-item{
        height: 50px !important;
        line-height: 50px !important;
      }
      .ant-menu-item-selected{
        border-left: 5px solid #2479ED;
        color: #0875FF !important;
      }
      .photo {
        .photo-item {
          padding: 25px 0;
          text-align: center;
          img {
            width: 80px;
            height: 80px;
            border-radius: 100%;
            margin: 0 auto;
          }
          .photo-icon {
            display: inline-block;
            position: relative;
            // padding-left: 10px;
            .count {
              position: absolute;
              font-size: 16px;
              right: 0px;
              color: #fff;
              top: -6px;
              line-height: 1;
              background: #ff4545;
              border-radius: 100%;
              padding: 0 2px 1px 2px;
            }
          }
        }
        .photo-text {
          text-align: center;
          font-size: 16px;
          padding: 0 10px 0;
          div {
            padding-bottom: 10px;
          }
          .jobname{
            font-size: 14px;
          }
          .explain {
            font-size: 12px;
            color: #c0c0c0;
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

</style>
