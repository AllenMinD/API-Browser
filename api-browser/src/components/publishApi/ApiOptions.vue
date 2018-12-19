<template>
  <div>
    <el-form label-position="left" label-width="100px">
      <el-form-item label="URL">
        <el-input type="text" v-model="form.url"></el-input>
      </el-form-item>

      <el-form-item label="Method">
        <el-select v-model="form.method" placeholder="请选择" style="width: 20%">
          <el-option
            v-for="item in method_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :inline="true" 
        :label="'参数 ' + index"
        v-for="(param, index) in form.params"
        :key="index">
          <el-input style="width: 40%" placeholder="key" v-model="param.key" >
            <el-select style="width: 80px" v-model="param.necessary" slot="append" placeholder="必填">
              <el-option label="必填" value="必填"></el-option>
              <el-option label="选填" value="选填"></el-option>
            </el-select>
          </el-input>
          <el-input style="width: 40%" placeholder="默认值" v-model="param.default" type="text"></el-input>
          <el-button type="danger" icon="el-icon-close" circle @click="removeParam(param)"></el-button>
          <el-button type="success" icon="el-icon-plus" circle v-if="index == form.params.length-1" @click="addParam"></el-button>
      </el-form-item>
      <el-form-item
        label="参数"
        :inline="true"
        v-if="form.params.length == 0">
        <el-button type="success" icon="el-icon-plus" round @click="addParam">添加参数</el-button>
      </el-form-item>
    </el-form>

    <div style="margin-top: 20px" align="center">
      <el-button style="width: 40%" @click="testApi" type="primary" plain>测试接口</el-button>
    </div>

    <div class="testResult">
      <div v-loading="testLoading">
        <!-- <el-button v-if="testData !== null" type="success" plain size="small" @click="showModel = true">查看返回的数据</el-button> -->
        
        <div>
          <h3>返回结果：</h3>
          <tree-view :data="testData" :options="{maxDepth: 10}"></tree-view>

          <h3>输入JS表达式，返回JSON数据中相应字段值：</h3>
          <el-input style="width: 40%" placeholder="表达式（root不用写）" v-model="expression" type="text"></el-input>
          <el-button type="primary" @click="parseExpMethod">获取表达式的值</el-button>
          <div>{{ parseExpression }}</div>
        </div>
      </div>
    </div>

    <!-- 显示保存后的json数据的dialog -->
    <el-dialog title="返回的JSON数据" :visible.sync="showModel">
      <tree-view :data="testData" :options="{maxDepth: 10}"></tree-view>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModel = false">取 消</el-button>
        <el-button type="primary" @click="showModel = false">确 定</el-button>
      </div>
    </el-dialog>

    <div style="margin-top: 20px;" align="center">
      <el-button @click="previous" type="default">上一步</el-button>
      <el-button @click="next" type="primary">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      form: {
        url: "https://conference.infoaas.com/conference/conference/advanced/fuzzysearch.do",
        method: "GET",
        // header: '',
        // params: [{ key: "", necessary: "必填", default: "" }]
        params: [
          { key: "keyword", necessary: "必填", default: "ccf" },
          { key: "offset", necessary: "必填", default: "1" },
          { key: "number", necessary: "必填", default: "6" }
        ]
      },
      method_options: [
        { value: "GET", label: "GET" },
        { value: "POST", label: "POST" },
        { value: "PUT", label: "PUT" },
        { value: "DELETE", label: "DELETE" }
      ],
      showModel: false,
      expression: '',
      parseExpression: ''
    };
  },
  computed: {
    testData: function() {
      return this.$store.getters.getDataFromApi;
    },

    testLoading: function() {
        return this.$store.getters.getTestLoading;
    },

  },
  watch: {
    testData: function(val) {

    }
  },
  methods: {
    parseExpMethod: function() {
      var that = this;
      var Fn = Function;
      var data = that.testData;
      this.parseExpression = new Fn('data','return data.' + that.expression)(data);
    },

    removeParam: function(param) {
      var index = this.form.params.indexOf(param);
      if (index !== -1) {
        this.form.params.splice(index, 1);
      }
    },

    addParam: function() {
      this.form.params.push({
        key: "",
        necessary: "必填",
        default: ""
      });
    },

    previous: function() {
      // 回到上一步
      this.$store.commit("subActive");
    },

    next: function() {
      // 保存数据到vuex（publishApi.js）
      this.$store.commit("saveApiOptions", this.form);
      // 跳到下一步
      this.$store.commit("addActive");
    },

    testApi: function() {
      // 把api的信息发给api-browser的后端
      this.$store.dispatch("testApi", this.form);
      this.$store.commit("setTestLoadingTrue");
      var that = this;
      setTimeout(function() {
        // 10秒后，取消加载动画
        that.$store.commit("setTestLoadingFalse");
      }, 1000 * 10);
    } 
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
</style>