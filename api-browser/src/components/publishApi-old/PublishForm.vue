<template>
  <el-form 
    :model="publishApiForm" 
    ref="publishApiForm" 
    label-width="100px" 
    label-position="left">
    <!-- 标题 -->
    <el-form-item label="标题" prop="formData.title">
      <el-input v-model="publishApiForm.formData.title" type="text"></el-input>
    </el-form-item>
    <!-- 请求URL、请求方法 -->
    <el-form-item label="URL" prop="formData.url">
      <el-input placeholder="http:// or https://" v-model="publishApiForm.formData.url" class="input-with-select">
        <el-select style="width: 100px" v-model="publishApiForm.formData.method" slot="prepend" placeholder="GET">
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
      v-for="(param, index) in publishApiForm.formData.params"
      :key="index">
      <el-input style="width: 40%" placeholder="key" v-model="param.key" :prop="'formData.params[' + index +'].key'">
        <el-select style="width: 80px" v-model="param.necessary" slot="append" placeholder="必填" :prop="'formData.params[' + index +'].necessary'">
          <el-option label="必填" value="必填"></el-option>
          <el-option label="选填" value="选填"></el-option>
        </el-select>
      </el-input>
      <el-input style="width: 40%" placeholder="默认值" v-model="param.default" type="text"></el-input>
      <el-button type="danger" icon="el-icon-close" circle @click="removeParam(param)"></el-button>
      <el-button type="success" icon="el-icon-plus" circle v-if="index == publishApiForm.formData.params.length-1" @click="addParam"></el-button>
    </el-form-item>
    <el-form-item
      :inline="true"
      v-if="publishApiForm.formData.params.length == 0">
      <el-button type="success" icon="el-icon-plus" round @click="addParam">添加参数</el-button>
    </el-form-item>
    <!-- 简介说明 -->
    <el-form-item label="简介说明" size="large" prop="formData.summary">
      <el-input type="textarea" v-model="publishApiForm.formData.summary"></el-input>
    </el-form-item>
    <el-form-item 
      :inline="true" 
      :label="'标签' + index" 
      v-for="(tag, index) in publishApiForm.formData.tags"
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
      <el-button type="danger" icon="el-icon-close" circle v-if="publishApiForm.formData.tags.length > 1" @click="removeTag(tag)"></el-button>
      <el-button type="success" icon="el-icon-plus" circle v-if="index == publishApiForm.formData.tags.length-1" @click="addTag"></el-button>
    </el-form-item>
    <!-- 提交/清空表单-->
    <el-form-item size="large">
      <el-button type="primary" @click="submitForm('publishApiForm')">提交</el-button>
      <el-button type="warning" @click="testApi" :disabled="!isSubmit">测试</el-button>
      <el-button type="success" @click="publishApi" :disabled="!isSubmit">发布</el-button>
      <el-button @click="resetForm('publishApiForm')">重置</el-button>
      <span> （需要提交信息后才能测试和发布）</span>
    </el-form-item>
  </el-form>  
</template>

<script>
  export default {
    data: function() {
      // var that = this;
      // function getProperties() {
      //   return that.$store.getters.getProperties;
      // }

      return {
        isSubmit: false,
        publishApiForm: {
          formData: {
            title: '',
            url: '',
            method: 'GET',
            params: [
              { key: '', necessary: '必填', default: ''}
            ],
            summary: '',
            tags: [
              { tagName: '' }
            ]
          },
        },
        formData: null,
      }
    },

    computed: {

    },

    methods: {
      removeParam: function(param) {
        var index = this.publishApiForm.formData.params.indexOf(param);
        if (index !== -1) {
          this.publishApiForm.formData.params.splice(index, 1);
        }
      },
      addParam: function() {
        this.publishApiForm.formData.params.push({
          key: '',
          necessary: '必填',
          default: ''
        });
      },
      removeTag: function(tag) {
        var index = this.publishApiForm.formData.tags.indexOf(tag);
        if (index !== -1) {
          this.publishApiForm.formData.tags.splice(index, 1);
        }
      },
      addTag: function() {
        this.publishApiForm.formData.tags.push({
          tagName: ''
        });
      },
      submitForm: function(formName) {  // 提交表单到Vuex
        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
        //     alert('submit!');
        //   } else {
        //     console.log('error submit!!');
        //     return false;
        //   }
        // });
        if (this.publishApiForm.formData.url) {
          this.$message({
            message: 'API信息提交成功!现在可以进行测试或直接发布api！',
            type: 'success'
          });
          this.isSubmit = true;
        } else {
          this.$message({
            message: 'api的URL是必须要填的！',
            type: 'warning'
          });
        }
        var params = this.publishApiForm.formData.params;
        var params_object = {};  // { key1: { necessary: true|false, default: 'xxx'} , key2: { necessary: true|false, default: 'xxx'}  } necessary表示必填（true）还是选填（false）；default表示默认值
        for (var i=0,len=params.length;i<len;i++) {
          if (params[i].necessary == '必填') {
            params_object[params[i].key] = {
              necessary: true,
              default: params[i].default
            };
          } else {
            params_object[params[i].key] = {
              necessary: false,
              default: params[i].default
            };
          }
        }
        var tags = this.publishApiForm.formData.tags;
        var tags_array = [];
        for (var i=0,len=tags.length;i<len;i++) {
          if (tags_array.indexOf(tags[i].tagName) === -1) {
            tags_array.push(tags[i].tagName);
          }
        }
        //console.log('转化后的params对象', params_object);
        this.formData = {
          title: this.publishApiForm.formData.title,
          url: this.publishApiForm.formData.url,
          method: this.publishApiForm.formData.method,
          params: params_object,
          summary: this.publishApiForm.formData.summary,
          tags: tags_array
        };
        console.log('提交的表单是：', this.formData);
        this.$store.dispatch('storeApiToVuex', this.formData);
      },
      resetForm: function(formName) {
        this.$refs[formName].resetFields();
        this.publishApiForm.formData.method = "GET";
        this.publishApiForm.formData.params = [{ key: '', necessary: '必填' }];
      },
      testApi: function() {
        this.$store.commit('changeTestState');
      },
      publishApi: function() {  // 通知Vuex把api信息发到后台存到数据库中
        // 加上author字段（作者姓名）
        var userName = this.$store.getters.getUserName;
        this.formData.author = userName;
        this.formData.showProperties = this.$store.getters.getShowProperties;
        this.$store.dispatch('publishApi', this.formData);
        this.$message({
          message: "发布成功",
          type: "success"
        });
        this.resetForm('publishApiForm');
      }
    }
  }
</script>

<style></style>
