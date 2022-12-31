<template>
  <a-layout class="logolayout">
    <a-layout-header :style="{ width: '100%', background: '#fff', padding: '0px', 'margin-bottom': '10px' }">
      <div class="header_left_min" @click="goback">
         <div class="header_left_login">
            <img src="../../assets/logo.png" />
         </div>
        
      </div>
      <!-- <span class="header_speech">“{{ timeFix }}，每天好心情”</span> -->
      <div class="header-photo">
        <img :src="userinfo.photo" alt="" />
        <span style="margin-right: 24px" @click="handleMessageClick">
          <a-badge :count="count">
            <a-avatar style="font-size: 25px; backgroundcolor: #fff; color: #333" theme="filled" icon="bell"/>
          </a-badge>
        </span>
        <span class="logout-text" @click="logout">退出登录</span>
      </div>
    </a-layout-header>
  </a-layout>
</template>
<script>
import storage from 'store'
import RightContent from '@/components/GlobalHeader/RightContent'
import ALayoutSider from 'ant-design-vue/es/layout/Sider'
import { getMessageCount } from '@/api/home'
import { timeFix } from '@/utils/util'
export default {
  name: 'BasicLayout',
  components: { ALayoutSider, RightContent },
  data() {
    return {
      userinfo: storage.get('Hrsh-Pc-UserInfo'),
      timeFix: '',
      count: 0,
    }
  },
  created() {
    this.timeFix = timeFix()
    this.getMessage()
    console.log('timeFix', timeFix())
  },
  methods: {
    refresh() {
      window.location.reload()
    },
    goback() {
      this.$router.push('/dashboard/index')
    },
    handleMessageClick() {
      this.$router.push('/message')
    },
    logout() {
      //localStorage.clear();
      storage.remove('Hrsh-Pc-Access-Auth')
      storage.remove('Hrsh-Pc-Refresh-Auth')
      storage.remove('Hrsh-Pc-UserInfo')
      window.location.reload()
      this.$router.push("/login")
     
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
          console.log('count', this.count)
        } else {
          this.count = 0
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.header_left_min {
  width: 16.66666667%;
  height: 100%;
  padding-right: 29px;
  display: inline-block;
  .header_left_login{
      background: linear-gradient(90deg, #28b0ff, #0875ff);
    }
 

  
  img {
    width: 70%;
  }
}
.header_speech {
  color: #3d3d3d;
  padding-left: 20px;
}
.header-photo {
  float: right;
  padding-right: 50px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 1px solid #f00;
    margin-right: 30px;
  }
  .photo-icon {
    display: inline-block;
    position: relative;
    .count {
      position: absolute;
      font-size: 10px;
      right: -10px;
      color: #fff;
      top: 10px;
      line-height: 1;
      background: #ff4545;
      border-radius: 100%;
      padding: 2px 3px;
    }
  }
  .logout-text {
    cursor: pointer;
    color: #0875ff;
  }
}
</style>
