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
      return {
        isSubmit: false,
        publishApiForm: {
          formData: {
            title: '',
            url: '',
            method: 'GET',
            params: [
              { key: '', necessary: '必填'}
            ],
            summary: ''
          },
        },
        formData: null
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
          necessary: '必填'
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
          alert('API信息提交成功!现在可以进行测试或直接发布api！');
          this.isSubmit = true;
        } else {
          alert('api的URL是必须要填的！');
        }
        var params = this.publishApiForm.formData.params;
        var params_object = {};  // { key1: true|false, key2: true|false } true表示必填，否者是选填
        for (var i=0,len=params.length;i<len;i++) {
          if (params[i].necessary == '必填') {
            params_object[params[i].key] = true;
          } else {
            params_object[params[i].key] = false;
          }
        }
        //console.log('转化后的params对象', params_object);
        this.formData = {
          title: this.publishApiForm.formData.title,
          url: this.publishApiForm.formData.url,
          method: this.publishApiForm.formData.method,
          params: params_object,
          summary: this.publishApiForm.formData.summary,
          // tags: this.publishApiForm.formData.tags
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
        this.$store.dispatch('publishApi', this.formData);
        alert('发布成功');
        this.resetForm('publishApiForm');
      }
    }
  }
</script>

<style></style>
