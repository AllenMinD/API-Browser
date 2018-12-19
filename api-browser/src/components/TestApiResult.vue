<template>
  <div v-if="isTest" class="white-box-full">
    <h1 v-if="!isFullPage">测试API</h1>
    <p v-if="!api.url">（测试前需先提交最新的API信息）</p>
    <div>{{api}}</div>

    <el-form
      v-if="api.url && !isFullPage"
      :model="testApiForm" 
      ref="testApiForm" 
      label-width="100px" 
      label-position="left">
      <!-- 标题 -->
      <el-form-item label="标题" size="small">
        <el-input type="text" v-model="api.title" disabled></el-input>
      </el-form-item>
      <!-- url -->
      <el-form-item label="URL" size="small">
        <el-input type="text" v-model="api.url" disabled>
          <template slot="prepend">{{ api.method }}</template>
        </el-input>
      </el-form-item>
      <!-- 参数 -->
      <el-form-item 
        :inline="true" 
        :label="'参数' + ' (' + param.necessary + ')'"
        v-for="(param, index) in api.params"
        :key="index">
        <el-input style="width: 40%" placeholder="value" v-model="param.value">
          <template slot="prepend">{{ param.key }}</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="testApi">发送请求</el-button>
      </el-form-item>
    </el-form>

    <div>
      <h1>返回结果</h1>
      <!-- <app-tree></app-tree> -->
      <!-- <div v-loading="testLoading">
        <tree-view :data="dataFromApi" :options="{maxDepth: 10}"></tree-view>
      </div> -->
      <div v-loading="testLoading">
        <app-visiable-table :jsonData="dataFromApi" :callType="callType"></app-visiable-table>
      </div> 

    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import VisiableTable from './VisiableTable.vue';

  export default {
    data: function() {
      return {
        testApiForm: null,
        callType: 'testApi'
      }
    },
    computed: {
      isTest: function() {
        return this.$store.getters.isTest;
      },
      api: function() {
        // 从Vuex拿过来的Api，里面的params是一个对象，是这种形式 { key1: true|false, key2: true|false } 
        var getApi = this.$store.getters.getApi;  
        // 转化params为数组，并且变为这样的形式 
        // [{key1: '', value1: '', necessary: true } , {key2: '', value2: '', necessary: true }]
        var trans_params = [];
        for (var key in getApi.params) {
          var newItem = {
            key: key,
            value: getApi.params[key].default,
            necessary: getApi.params[key].necessary === 'true'?'必填':'选填'
          };
          trans_params.push(newItem);
        }
        getApi.params = trans_params;
        console.log('getApi', getApi);
        return getApi;
      },
      dataFromApi: function() {
        return this.$store.getters.getDataFromApi;
      },
      testLoading: function() {
        return this.$store.getters.getTestLoading;
      },
      isFullPage: function() {
        return this.$store.getters.getIsFullPage;
      }
    },
    methods: {
      testApi: function() {
        // 把api的信息发给api-browser的后端
        this.$store.dispatch('testApi', this.api);
        this.$store.commit('setTestLoadingTrue');
        var that = this;
        setTimeout(function() {  // 10秒后，取消加载动画
          that.$store.commit('setTestLoadingFalse');
        }, 1000 * 10);
        // 测试
        // this.$store.dispatch('sendApiInfoToBackend', {
        //   url: 'https://conference.infoaas.com/conference/conference/advanced/fuzzysearch.do',
        //   params: [
        //     {key: 'keyword', value: '2018', necessary: '必填'},
        //     {key: 'offset', value: '1', necessary: '必填'},
        //     {key: 'number', value: '5', necessary: '必填'},
        //   ]
        // });
      },
    },
    components: {
      AppVisiableTable: VisiableTable
    }
  }
</script>

