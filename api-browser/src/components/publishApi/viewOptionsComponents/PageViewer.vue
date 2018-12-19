<template>
  <div>
    <!-- 卡片视图 -->
    <div class="card-view" v-if="pageObj.view === 'card'"> 
      <el-card class="box-card" style="margin: 20px;" v-for="(i, index1) in loopShowArray" :key="index1">
        <div slot="header" class="clearfix">
          <span>卡片名称</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        
        <div v-for="(expression, key, index2) in pageObj.props" :key="index2">
          <span class="item-name">{{ key }}</span>
          <span class="item-value">{{ parseExpMethod(expression, index1) }}</span>
        </div>
      </el-card>
    </div>
    
    <!-- 表格视图 -->
    <div class="table-view" v-if="pageObj.view === 'table'">
      表格视图
    </div>
  </div>
</template>

<script>
export default {
  props: ['jsonData'],
  data: function() {
    return {
      pageObj: null,  // 页面配置对象
      isLoopShow: false,  // 这个变量用来表示“是否循环渲染卡片”，当表达式中出现数组的形式的时候，就会变为true
      loopShowArray: [],  // 需要循环渲染的数组
      dialogTableVisible_: false
    };
  },
  
  methods: {
    // 解析js表达式字符串
    parseExpMethod: function(expression, index) {  // expression为需要解析的js表达式
      var that = this;
      var Fn = Function;
      var data = that.jsonData;  // data是调用第三方API接口返回的json数据
      if (expression.indexOf('[') !== -1) { // 若是数组表达式，则要进行进一步处理
        expression = expression.replace(/\[[0-9]\]/g, '[' + index + ']');
        // console.log('修改后的expression', expression);
      }
      return new Fn('data','return data.' + expression)(data);
    }
  },

  created: function() {
    // 从vuex中获取pageObj
    this.pageObj = this.$store.getters.getPageObj;
    console.log('viewer视图中的pageObj', this.pageObj);
    console.log('viewer视图中的jsonData', this.jsonData);
    // 判断是否要循环渲染卡片（就是看pageOjb中的表达式是否有中括号）
    var props = this.pageObj.props;
    for (let key in props) {
      if (props[key].indexOf('[') !== -1) {  // 有中括号，说明有数组，需要循环渲染卡片
        this.isLoopShow = true; 
        // 解析这个和数组有关的表达式，并结合jsonData获得的数组的长度
        var arrayExpression = props[key].slice(0, props[key].indexOf('['));
        var Fn = Function;
        var data = this.jsonData;  // data是调用第三方API接口返回的json数据
        this.loopShowArray = new Fn('data','return data.' + arrayExpression)(data);
        // console.log('loopShowArray ', this.loopShowArray);
        // console.log('arrayExpression', arrayExpression);
        break;
      } else {
        this.isLoopShow = false;
      }
    }
  }
}
</script>

<style scoped>
  .item-name {
    color: #409EFF;
  }

  .item-name::after {
    content: '';
    margin-right: 20px;
  }
</style>


