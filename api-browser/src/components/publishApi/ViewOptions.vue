<template>
  <div class="container">
    <div class="header">
      <div class="col col-1">键名</div>
      <div class="col col-2">注释</div>
      <div class="col col-3">是否显示对应键值对</div>
    </div>
    <div class="all-properties">
      <el-form :model="jsonDataOptions" label-position="left" label-width="120px">
        <el-form-item
          :label="item"
          v-for="(value, item, index) in jsonDataOptions"
          :key="index"
        >
          <el-input
            style="width: 40%; margin-right: 10%"
            :placeholder="'键名的中文注释（选填，默认为：' + item + '）'"
            v-model="value.cnName"
          ></el-input>
          <el-radio style="width: 10%" v-model="value.isShow" label="true">显示</el-radio>
          <el-radio style="width: 10%" v-model="value.isShow" label="false">不显示</el-radio>
        </el-form-item>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <div style="margin-top: 20px;" align="center">
      <el-button @click="previous" type="default">上一步</el-button>
      <el-button @click="publish" type="primary">发布API</el-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  data: function() {
    return {
      allProperties: [], // json对象中所有键名的集合
      allPropertiesTrans: [], // json对象中所有键名的集合, allPropertiesTrans为真正要传到vuex的数组
      jsonDataOptions: {} // json数据的设置对象，用来设置json数据的键名的中文名和是否显示该键值对
    };
  },
  computed: {
    // jsonData: function() {
    //   var jsonData_temp = this.$store.getters.getDataFromApi;
    //   return jsonData_temp;
    // }
  },
  watch: {},
  created: function() {
    var jsonData = this.$store.getters.getDataFromApi;
    this.getAllProperties(jsonData); // 递归获取数据的所有字段
    console.log("这个对象的属性有：", this.allProperties);
    this.$store.commit("setAllProperties", this.allPropertiesTrans);

    // 初始化视图配置对象: jsonDataOptions
    for (let item of this.allProperties) {
      let newOptionItem = {
        originKey: item,  // 原来的键名
        cnName: item, // 默认为英文键名
        isShow: "true" // 默认全部键值对都显示
      };
      // this.jsonDataOptions[item] = newOptionItem;
      Vue.set(this.jsonDataOptions, item, newOptionItem);  // 给对象this.jsonDataOptions新增item属性，并把newOptionItem赋值给这个新属性
    }
    console.log("jsonDataOptions", this.jsonDataOptions);
  },
  methods: {
    previous: function() {
      // 回到上一步
      this.$store.commit("subActive");
    },

    publish: function() {
      // 保存数据到vuex（publishApi.js）
      // this.$store.commit('saveViewOptions', this.form);
      console.log("生成配置对象：", this.jsonDataOptions);
      alert("发布！");
    },

    /*
     * 获取json对象中的全部键名
     */
    getAllProperties: function(data) {
      var type = "";
      var obj;
      if (Array.isArray(data)) {
        type = "array";
        obj = [];
      } else if (typeof data === "object") {
        type = "object";
        obj = {};
      } else {
        // 递归边界
        return;
      }

      if (type === "array") {
        for (var i = 0; i < data.length; i++) {
          this.getAllProperties(data[i]);
        }
      } else if (type === "object") {
        for (var key in data) {
          if (this.allProperties.indexOf(key) === -1) {
            this.allProperties.push(key);
            var newProp = {
              key: key,
              label: key,
              disabled: false
            };
            this.allPropertiesTrans.push(newProp); // this.allPropertiesTrans为真正要传到vuex的数组
            this.getAllProperties(data[key]);
          }
        }
      } else {
        return;
      }
    }
  }
};
</script>

<style scoped>
.header {
  padding-bottom: 20px;
}

.header .col {
  display: inline-block;
  color: #409eff;
}

.header .col-1 {
  width: 120px;
}

.header .col-2 {
  width: 44%;
}
</style>