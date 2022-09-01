<template>
  <a-spin :spinning="loading">
    <a-row type="flex" :gutter="[24,24]">
      <a-col :span="23" :style="{ height: treeHeight, 'overflow-y': 'auto'}" class="model_center">
        <a-empty v-if="treeData.length == 0" description="暂无数据"/>
        <a-tree
          v-else
          checkable
          :checkedKeys="treeCheckKeys"
          :checkStrictly="treeCheckStrictly"
          :expandedKeys="treeExpandedKeys"
          :replaceFields="replaceFields"
          :tree-data="treeData"
          @expand="expandTreeData"
          @check="checkTreeData"
        />
        <!--@check="onCheckKeys"-->
      </a-col>
    </a-row>
    <a-divider/>
    <a-row type="flex" :gutter="[24,24]">
      <a-col span="18">
        <a-dropdown placement="topCenter">
          <a-button>树 操 作
            <a-icon type="up"/>
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item @click="selectAll">全部勾选</a-menu-item>
            <a-menu-item @click="cancelSelectAll">取消全选</a-menu-item>
            <a-menu-item @click="openAll">展开所有</a-menu-item>
            <a-menu-item @click="cancelOpenAll">合并所有</a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-col>
      <a-col span="6">
        <a-space>
          <a-button @click="cancelSavePermission" v-if="showCancelButton">
            取 消
          </a-button>
          <a-button type="primary" @click="savePermission" :loading="saveButtonLoading">
            保 存
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-spin>
</template>

<script>
  import ACol from "ant-design-vue/es/grid/Col";

  export default {
    name: "PermissionTree",
    components: {ACol},
    props: {
      /**
       * 树内容高度
       */
      treeHeight: {
        type: String,
        default: '100%'
      },
      /**
       * 展开节点keys
       */
      expandedKeys: {
        type: Array,
        default: () => {
          return []
        }
      },
      /**
       * 勾选中的keys
       */
      checkKeys: {
        type: Array,
        default: () => {
          return []
        }
      },
      /**
       * 树字段
       */
      replaceFields: {
        type: Object,
        default: () => {
          return {
            children: 'children',
            title: 'title',
            key: 'id'
          }
        }
      },
      /**
       * 加载
       */
      loading: {
        type: Boolean,
        default: false
      },
      /**
       * 树数据
       */
      treeData: {
        type: Array,
        default: []
      },
      /**
       * 保存按钮loading
       */
      saveLoading: {
        type: Boolean,
        default: false
      },
      /**
       * 是否显示取消按钮
       */
      showCancelButton: {
        type: Boolean,
        default: false
      },
      /**
       * 父子关联
       */
      checkStrictly: {
        type: Boolean,
        default: true
      },
      /**
       * 是否默认全部展开
       */
      isExpandedAll: {
        type: Boolean,
        default: true
      },

    },
    data() {
      return {
        treeCheckStrictly: this.checkStrictly,
        treeCheckKeys: this.checkKeys,
        treeExpandedKeys: this.expandedKeys,
        treeLoading: this.loading,
        saveButtonLoading: this.saveLoading
      }
    },
    watch:{
      saveLoading(val){
        this.saveButtonLoading = val
      },
      loading(val){
        this.treeLoading = val
      },
      checkKeys(val){
        this.treeCheckKeys = val
      }
    },
    mounted() {
      /**
       * 初次判断树是否展示，合并
       */
      if(this.isExpandedAll){
        this.openAll()
      }else {
        this.cancelOpenAll()
      }
    },
    methods: {
      /**
       * 保存事件
       */
      savePermission() {
        this.$emit('save', this.treeCheckKeys)
      },
      /**
       * 取消事件
       */
      cancelSavePermission() {
        this.$emit('cancel')
      },
      // 勾选数据
      checkTreeData(checkedKeys) {
        this.treeCheckKeys = checkedKeys.checked
      },
      // 展开收起数据
      expandTreeData(checkedKeys) {
        this.treeExpandedKeys = checkedKeys
      },

      // 树操作 勾选全部
      selectAll() {
        this.treeCheckKeys = []
        let list = this.getListByTree(this.treeData)
        console.log(1, list)
        for (let i = 0; i < list.length; i++) {
          this.treeCheckKeys.push(list[i].id)
        }
      },
      // 树操作 取消全选
      cancelSelectAll() {
        this.treeCheckKeys = []
      },

      // 树操作 展开树
      openAll() {
        this.treeExpandedKeys = []
        let list = this.getListByTree(this.treeData)
        for (let i = 0; i < list.length; i++) {
          this.treeExpandedKeys.push(list[i].id)
        }
      },
      // 树操作 合并树
      cancelOpenAll() {
        this.treeExpandedKeys = []
      },
      // 获取树形数组数据
      getListByTree(data) {
        let list = []
        this.treeToList(data, list)
        return list
      },
      // 树形递归数组
      treeToList(treeData, arr) {
        for (var i = 0; i < treeData.length; i++) {
          let item = JSON.parse(JSON.stringify(treeData[i]))
          delete item.children
          arr.push(item)
          if (treeData[i].children) {
            this.treeToList(treeData[i].children, arr)
          }
        }

      },
    },
  }
</script>

<style scoped>
  .model_center {
    overflow-y: auto;
    padding: 10px 0px;
    background: #fff;
  }

</style>