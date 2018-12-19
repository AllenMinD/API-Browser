<template>
  <div>
    <div>视图配置</div>

    <!-- 返回数据 -->
    <div class="testResult">
      <h3>返回结果：</h3>
      <tree-view :data="jsonData" :options="{maxDepth: 10}"></tree-view>
      <!-- <h3>输入JS表达式，返回JSON数据中相应字段值：</h3>
      <el-input style="width: 40%" placeholder="表达式（root不用写）" v-model="expression" type="text"></el-input>
      <el-button type="primary" @click="parseExpMethod(expression)">获取表达式的值</el-button>
      <div>{{ parseExpression }}</div> -->
    </div>

    <!-- 视图配置主要内容 -->
    <div class="view-option">
      <!-- 头部：页面基本信息、选择视图类型 -->
      <div class="header-menu">
        <div class="left">
          <div class="page-name">首页</div>         
        </div>
        <div class="right">
          <el-select size="small" style="width: 80px;"  v-model="viewCategory" placeholder="请选择">
            <el-option
              v-for="item in viewCategories"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="warning" plain size="small" @click="dialogTableVisible = true">预览</el-button>
        </div>
      </div>

      <!-- 页面内容配置 -->
      <div class="option-content">
        <app-page-editor :jsonData="jsonData" :viewCategory="viewCategory" :pageObj="pageObj"></app-page-editor>
      </div>

    </div>

    <!-- 底部按钮 -->
    <div style="margin-top: 20px;" align="center">
      <el-button @click="previous" type="default">上一步</el-button>
      <el-button @click="publish" type="primary">发布API</el-button>
    </div>

    <!-- 预览弹框 -->
    <el-dialog title="预览页面" :visible.sync="dialogTableVisible">
      <!-- 这里是一个显示页面的组件，PageShow.vue -->
      <app-page-viewer :jsonData="jsonData" v-if='dialogTableVisible'></app-page-viewer>
    </el-dialog>    

  </div>
</template>

<script>
  import PageEditor from './viewOptionsComponents/PageEditor.vue';
  import PageViewer from './viewOptionsComponents/PageViewer.vue';

  export default {
    data: function() {
      return {
        expression: '', 
        parseExpression: '',
        // showCardEditor: false,
        viewCategory: 'card',  // 页面的类型：卡片(card)、表格(table)
        viewCategories: [{
          label: '卡片',
          value: 'card'
        }, {
          label: '表格',
          value: 'table'
        }],
        pageObj: {  // 页面对象（最终提交到数据库的对象）：存放每个页面的信息
          layer: 1,
          view: 'card',
          props: {}
        },
        dialogTableVisible: false,  // 预览模态框控制开关
        currentLayer: 1, // 当前显示的页面
      };
    },
    computed: {
      jsonData: function() {
        return this.$store.getters.getDataFromApi;
      }
    },
    watch: {
      viewCategory: function(val) {
        this.pageObj.view = val;
      }
    },
    methods: {
      previous: function() {
        // 回到上一步
        this.$store.commit('subActive');
      },

      publish: function() {
        // 保存数据到vuex（publishApi.js）
        // this.$store.commit('saveViewOptions', this.form);
        alert('发布！');
      }
    },

    components: {
      AppPageEditor: PageEditor,
      AppPageViewer: PageViewer
    }
  };
</script>

<style scoped>
.testResult {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  background-color: #e4e7ed;
}

.view-option {
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  background: #fff;
  width: 100%;
  min-height: 200px;
  margin-top: 15px;
  /* padding: 15px; */
}

.option-content {
  margin: 15px;
}

.header-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
  padding: 15px;
}

.header-menu .page-name {
  margin-right: 20px;
  display: inline;
}
</style>