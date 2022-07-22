<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'

export default {
  data () {
    return {
    }
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>
<style>
  /* 整个滚动条 */
  ::-webkit-scrollbar {
    /* 对应纵向滚动条的宽度 */
    width: 8px;
    /* 对应横向滚动条的宽度 */
    height: 8px;
  }

  /* 滚动条上的滚动滑块 */
  ::-webkit-scrollbar-thumb {
    background-color: #D9D9D9;
    border-radius: 32px;
  }
  ::-webkit-scrollbar-thumb:hover{
    background-color: #747474;
  }
  /*!* 滚动条轨道 *!*/
  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 32px;
  }
</style>