<template>
  <div>
    <!-- 卡片类型配置 -->
    <el-card class="box-card" style="margin: 20px;" v-if="viewCategory === 'card'">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">修改</el-button>
      </div>
      <!-- <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div> -->
      <div class="editor-form" v-for="(item, index) in editItems" :key="index">
        <el-input v-if="item.status === 'editing'" type="text" size="small" style="width: 20%" placeholder="项名" v-model="item.itemName"></el-input>
        <el-input v-if="item.status === 'editing'" type="text" size="small" style="width: 40%" placeholder="表达式" v-model="item.itemExpression"></el-input>
        <span class="item-name" v-if="item.status === 'ok'">{{ item.itemName }}</span>
        <span class="item-value" v-if="item.status === 'ok'">{{ Array.isArray(item.parseRes)?'该项为数组，循环显示该项':item.parseRes }}</span>
        
        <el-button v-if="item.status === 'ok'" type="primary" size="small" @click="item.status = 'editing'">修改</el-button>
        <el-button v-if="item.status === 'editing'" type="primary" size="small" @click="expandItem(item)">扩展</el-button>
        <el-button v-if="item.status === 'editing'" type="primary" size="small" @click="enterItem(item)">确定</el-button>
        <el-button size="small" @click="removeItem(item)">删除</el-button>
      </div>
      <div class="add-item-button" @click="addItem"><i class="el-icon-plus"></i></div>
    </el-card>

    <!-- 表格类型配置 -->
    <div v-if="viewCategory === 'table'">
      表格类型
    </div>

    <!-- 创建新页面的Dialog（当按扩展时显示） -->
    <el-dialog title="创建新页面" :visible.sync="createNewPageDialog">
      <span slot="footer" class="dialog-footer">
        <el-button @click="createNewPageDialog = false">取 消</el-button>
        <el-button type="primary" @click="createNewPage(currentItem)">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['jsonData', 'viewCategory', 'pageObj'],
  data: function() {
    let pageObj_ = JSON.parse(JSON.stringify(this.pageObj)); // pageObj_是pageObj的拷贝，目的是为了可以watch
    return {
      editItems: [{  // 正在编辑的项
        itemName: '',   // 项名
        itemExpression: '',   // js表达式字符串
        status: 'editing',  // 项状态。editing表示正在编辑；ok表示已确定；err表示表达式解析不正确
        parseRes: null,  // itemExpression经过parseExpMethod()解析后的结果
        children: null // 扩展页面 
      }],

      pageObj_: pageObj_,
      createNewPageDialog: false,
      currentItem: null, // 用来在创建页面时传递当前项
    };
  },

  watch: {
    // pageObj_: {
    //   handler: function(newVal, oldVal) {  // 监听pageObj_，一旦有改变，则马上存到vuex中
    //     alert('pageObj_ has changed');
    //     this.$store.commit('savePageObj', newVal);
    //   },
    //   deep: true  // 由于监听的pageObj_是一个对象，所以需要加上deep才可以监听到对象内部的变化
    // }

  },  

  methods: {
    addItem: function() {  // 添加项目
      // this.showCardEditor = true;
      var newItem = {
        itemName: '',
        itemExpression: '',
        status: 'editing',
        children: null
      };
      this.editItems.push(newItem);
    },

    enterItem: function(item) {  // 确定项目
      item.status = 'ok'; 
      this.parseExpMethod(item);  // 解析表达式
      // 添加到pageObj.props中
      this.pageObj_.props[item.itemName] = item.itemExpression;
      this.$store.commit('savePageObj', this.pageObj_);  // 把pageObj保存到vuex中
      console.log('pageObj_', this.pageObj_);
    },

    removeItem: function(item) {  // 移除项目
      var index = this.editItems.indexOf(item);
      if (index !== -1) {
        this.editItems.splice(index, 1);
        delete this.pageObj_.props[item.itemName];
        this.$store.commit('deletePageObj', this.pageObj_);  // 把pageObj保存到vuex中
        console.log('pageObj_', this.pageObj_);
      }
    },

    expandItem: function(item) {  // 扩展项目，即创建新的页面
      this.createNewPageDialog = true;
      // alert('expand! ready to create a new page');
      this.currentItem = item;
    },

    createNewPage: function(item) {  // 创建新页面
      this.createNewPageDialog = false;
      alert("create new page!");
    }, 

    // 解析js表达式字符串
    parseExpMethod: function(item) {  // expression为需要解析的js表达式
      var that = this;
      var Fn = Function;
      var data = that.jsonData;  // data是调用第三方API接口返回的json数据
      var expression = item.itemExpression;  // 需要解析的js表达式
      item.parseRes = new Fn('data','return data.' + expression)(data);
    },
  }
}
</script>

<style scoped>
  .add-item-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 90%;
    margin: 10px 5%;
    border-radius: 5px;
    border: 1px dashed #c6c6c6;
    transition: all 0.3s ease-in-out;
  }

  .add-item-button:hover {
    background: #F2F6FC;
    cursor: pointer;
  }

  /* 每一项的编辑表单 */
  .editor-form {
    margin: 10px 5%;
  }

  .item-name {
    color: #409EFF;
  }

  .item-name::after {
    content: '';
    margin-right: 20px;
  }

</style>


