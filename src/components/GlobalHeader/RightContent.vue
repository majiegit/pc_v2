<template>
  <div :class="wrpCls">
    <a-tooltip placement="bottom">
      <template slot="title">
        <span>{{fullscreen.title}}</span>
      </template>
      <a-icon :type="fullscreen.icon" style="margin-right: 10px; cursor: pointer;" @click="requestFullscreen"/>
    </a-tooltip>
    <select-lang :class="prefixCls"/>
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls"/>
  </div>
</template>

<script>
  import AvatarDropdown from './AvatarDropdown'
  import SelectLang from '@/components/SelectLang'

  export default {
    name: 'RightContent',
    components: {
      AvatarDropdown,
      SelectLang
    },
    props: {
      prefixCls: {
        type: String,
        default: 'ant-pro-global-header-index-action'
      },
      isMobile: {
        type: Boolean,
        default: () => false
      },
      topMenu: {
        type: Boolean,
        required: true
      },
      theme: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        showMenu: true,
        currentUser: {},
        fullscreen: {
          title: '全屏',
          icon: 'fullscreen',
          is: true
        }
      }
    },
    computed: {
      wrpCls() {
        return {
          'ant-pro-global-header-index-right': true,
          [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
        }
      }
    },
    mounted() {
      setTimeout(() => {
        this.currentUser = {
          name: this.$store.getters.userInfo.realname
        }
      }, 1500)
    },
    methods: {
      requestFullscreen() {
        const docElm = document.documentElement
        if (this.fullscreen.is) {
          if (docElm.requestFullscreen) {
            docElm.requestFullscreen()
          } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen()
          } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen()
          } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen()
          }
          this.fullscreen.is = false
          this.fullscreen.icon = 'fullscreen-exit'
          this.fullscreen.title = '关闭'
        }else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          }
          this.fullscreen.is = true
          this.fullscreen.icon = 'fullscreen'
          this.fullscreen.title = '全屏'
        }
      }
    }
  }
</script>
