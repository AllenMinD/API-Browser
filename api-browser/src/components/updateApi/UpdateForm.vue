<template>
  <el-form :model="formData" ref="formData" label-width="100px" label-position="left">
    
    <!-- 标题 -->
    <el-form-item label="标题">
      <el-input v-model="formData.title" type="text"></el-input>
    </el-form-item>
    
    <!-- 请求URL、请求方法 -->
    <el-form-item label="URL">
      <el-input placeholder="http:// or https://" v-model="formData.url" class="input-with-select">
        <el-select style="width: 100px" v-model="formData.method" slot="prepend" placeholder="GET">
          <el-option label="GET" value="GET"></el-option>
          <el-option label="POST" value="POST"></el-option>
          <el-option label="PUT" value="PUT"></el-option>
          <el-option label="PATCH" value="PATCH"></el-option>
          <el-option label="DELETE" value="DELETE"></el-option>
        </el-select>
        <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
      </el-input>
    </el-form-item>
    
    <!-- 参数 -->
    <el-form-item
      :inline="true"
      :label="'参数 ' + index"
      v-for="(param, index) in formData.params"
      :key="index"
    >
      <el-input style="width: 40%" placeholder="key" v-model="param.key">
        <el-select style="width: 80px" v-model="param.necessary" slot="append">
          <el-option label="必填" value="必填"></el-option>
          <el-option label="选填" value="选填"></el-option>
        </el-select>
      </el-input>
      <el-input style="width: 40%" placeholder="默认值" v-model="param.value" type="text"></el-input>
      <el-button type="danger" icon="el-icon-close" circle @click="removeParam(param)"></el-button>
      <el-button
        type="success"
        icon="el-icon-plus"
        circle
        v-if="Array.isArray(formData.params) && index == formData.params.length-1"
        @click="addParam"
      ></el-button>
    </el-form-item>
    <el-form-item
      :inline="true"
      v-if="Array.isArray(formData.params) && formData.params.length == 0"
    >
      <el-button type="success" icon="el-icon-plus" round @click="addParam">添加参数</el-button>
    </el-form-item>
    
    <!-- 简介说明 -->
    <el-form-item label="简介说明" size="large">
      <el-input type="textarea" v-model="formData.summary" :autosize="{ minRows: 6 }"></el-input>
    </el-form-item>
    
    <!-- 标签（新） -->
    <el-form-item label="标签">
      <el-tag
        class="el-tag"
        :key="tag + index"
        v-for="(tag, index) in formData.tags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >{{tag}}</el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      ></el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </el-form-item>
    <!-- 标签（旧） -->
    <!-- <el-form-item 
      :inline="true" 
      :label="'标签' + index" 
      v-for="(tag, index) in formData.tags"
      :key="'tag' + index"
      size="large">
      <el-select style="width: 150px" v-model="tag.tagName" placeholder="请选择">
        <el-option label="请选择" value=""></el-option>
        <el-option label="新闻资讯" value="新闻资讯"></el-option>
        <el-option label="教育培训" value="教育培训"></el-option>
        <el-option label="实时监控" value="实时监控"></el-option>
        <el-option label="电商购物" value="电商购物"></el-option>
        <el-option label="游戏" value="游戏"></el-option>
        <el-option label="工具" value="工具"></el-option>
        <el-option label="书影音" value="书影音"></el-option>
        <el-option label="体育" value="体育"></el-option>
        <el-option label="交通" value="交通"></el-option>
        <el-option label="旅游" value="旅游"></el-option>
        <el-option label="理财" value="理财"></el-option>
        <el-option label="其他" value="其他"></el-option>
      </el-select>
      <el-button type="danger" icon="el-icon-close" circle v-if="formData.tags.length > 1" @click="removeTag(tag)"></el-button>
      <el-button type="success" icon="el-icon-plus" circle v-if="index == formData.tags.length-1" @click="addTag"></el-button>
    </el-form-item>-->

    <br>

    <div class="header">
      <div class="col col-1">键名</div>
      <div class="col col-2">注释</div>
      <div class="col col-3">是否显示对应键值对</div>
    </div>

    <!-- 视图设置 -->
    <el-form-item :label="item" label-width="20%" v-for="(value, item, index) in formData.viewOptions" :key="item + index">
      <el-input
        style="width: 50%; margin-right: 10%"
        :placeholder="'键名的中文注释（选填，默认为：' + item + '）'"
        v-model="value.cnName"
      ></el-input>
      <el-radio style="width: 10%" v-model="value.isShow" label="true">显示</el-radio>
      <el-radio style="width: 10%" v-model="value.isShow" label="false">不显示</el-radio>
    </el-form-item>

    <!-- 提交/清空表单-->
    <el-form-item size="large">
      <el-button type="warning" @click="submitForm">提交</el-button>
      <!-- <el-button type="warning" @click="testApi" :disabled="!isSubmit">测试</el-button> -->
      <el-button type="success" @click="updateApi" :disabled="!isSubmit">更新</el-button>
      <!-- <el-button @click="resetForm('updateApiForm')">重置</el-button> -->
      <el-button type="danger" @click="deleteApi">删除API</el-button>
      <div>（需要提交信息后才能更新）</div>
    </el-form-item>
  </el-form>
</template>

<script>
import router from "../../router";

export default {
  props: ["passApi"],
  data: function() {
    console.log("passApi: ", this.passApi);
    return {
      isSubmit: false,
      formData: {
        title: this.passApi.title,
        url: this.passApi.url,
        method: this.passApi.method,
        params: this.passApi.params || [],
        summary: this.passApi.summary,
        tags: this.passApi.tags,
        viewOptions: this.passApi.viewOptions
      },
      submitFormData: null,
      inputVisible: false,
      inputValue: ""
    };
  },

  computed: {},

  methods: {
    removeParam: function(param) {
      var index = this.formData.params.indexOf(param);
      if (index !== -1) {
        this.formData.params.splice(index, 1);
      }
    },
    addParam: function() {
      this.formData.params.push({
        key: "",
        necessary: "必填",
        value: ""
      });
    },
    // removeTag: function(tag) {
    //   var index = this.formData.tags.indexOf(tag);
    //   if (index !== -1) {
    //     this.formData.tags.splice(index, 1);
    //   }
    // },
    // addTag: function() {
    //   this.formData.tags.push({
    //     tagName: ''
    //   });
    // },
    handleClose(tag) {
      this.formData.tags.splice(this.formData.tags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue && this.formData.tags.indexOf(inputValue) == -1) {
        this.formData.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    submitForm: function() {
      // 提交表单到Vuex
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     alert('submit!');
      //   } else {
      //     console.log('error submit!!');
      //     return false;
      //   }
      // });
      if (this.formData.url) {
        this.$message({
          message: "API信息提交成功!现在可以更新api！",
          type: "success"
        });
        this.isSubmit = true;
      } else {
        this.$message({
          message: "api的URL是必须要填的！",
          type: "warning"
        });
      }
      // var params = this.formData.params;
      // var params_object = {};  // { key1: { necessary: true|false, default: 'xxx'} , key2: { necessary: true|false, default: 'xxx'}  } necessary表示必填（true）还是选填（false）；default表示默认值
      // for (var i=0,len=params.length;i<len;i++) {
      //   if (params[i].necessary == '必填') {
      //     params_object[params[i].key] = {
      //       necessary: true,
      //       default: params[i].default
      //     };
      //   } else {
      //     params_object[params[i].key] = {
      //       necessary: false,
      //       default: params[i].default
      //     };
      //   }
      // }
      // var tags = this.formData.tags;
      // var tags_array = [];
      // for (var i=0,len=tags.length;i<len;i++) {
      //   if (tags_array.indexOf(tags[i].tagName) === -1) {
      //     tags_array.push(tags[i].tagName);
      //   }
      // }
      //console.log('转化后的params对象', params_object);

      // 转化params为数组，主要是把value字段变成default
      /*
        [{
          key: item.key,
          default: item.value,
          necessary: item.necessary
        }]
        */

      var trans_params = [];
      if (
        Array.isArray(this.formData.params) &&
        this.formData.params.length > 0
      ) {
        for (let item of this.formData.params) {
          var newItem = {
            key: item.key,
            default: item.value,
            necessary: item.necessary
          };
          trans_params.push(newItem);
        }
      }

      this.submitFormData = {
        title: this.formData.title,
        url: this.formData.url,
        method: this.formData.method,
        // params: params_object,
        params: trans_params,
        summary: this.formData.summary,
        // tags: tags_array,
        tags: this.formData.tags,
        id: this.passApi._id,
        viewOptions: this.formData.viewOptions
      };
      console.log("提交的表单是：", this.submitFormData);
      this.$store.dispatch("storeApiToVuex", this.submitFormData);
    },
    // resetForm: function(formName) {
    //   this.$refs[formName].resetFields();
    //   this.formData.method = "GET";
    //   this.formData.params = [{ key: '', necessary: '必填' }];
    // },
    // testApi: function() {
    //   this.$store.commit('changeTestState');
    // },
    updateApi: function() {
      // 通知Vuex把api信息发到后台存到数据库中
      var that = this;
      this.formData.showProperties = this.$store.getters.getShowProperties;
      this.$store.dispatch("updateApi", this.submitFormData);
      this.$message({
        message: "更新api成功",
        type: "success"
      });
      router.replace("/useapi/" + that.passApi._id);
    },
    deleteApi: function() {
      var that = this;
      this.$confirm("此操作将永久删除该API, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("deleteApi", { apiId: this.passApi._id });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          router.replace("/user/" + that.passApi.author);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped>
.el-tag {
  margin-right: 10px;
}

/* .el-tag:nth-child(1) {
  margin-right: 10px;
}

.el-tag + .el-tag {
  margin-right: 10px;
} */
.button-new-tag {
  /* margin-left: 10px; */
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  /* margin-left: 10px; */
  width: 90px;
  vertical-align: bottom;
}

.header {
  padding-bottom: 20px;
}

.header .col {
  display: inline-block;
  color: #409eff;
}

.header .col-1 {
  width: 20%;
}

.header .col-2 {
  width: 48%;
}

</style>
