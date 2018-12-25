<template>
  <div v-if="api">
    <div class="white-box-full" v-if="!isFullPage">      
      <h1 v-if="!isFullPage">{{ api.title }}</h1>
      <div class="api-info api-tags">
        <el-tag 
          class="api-tag"
          size="small" 
          type="info"
          v-for="(tag, index) in api.tags"
          :key="'tag' + index">
          {{ tag }}
        </el-tag>
      </div>

      <div class="api-info api-author">
        <font-awesome-icon icon="user" style="color: #77bbff"/>&nbsp;
        <router-link tag="span" :to="/profile/ + api.author">{{ api.author }}</router-link>
      </div>

      <el-button 
        type="primary" 
        style="width: 100%;margin-bottom: 15px" 
        @click="showingDetail = !showingDetail">
          <span class="el-icon-setting"></span>&nbsp;详情
      </el-button>

      <transition name="slide" mode="out-in" type="animation" appear>
        <el-form
          v-if="!isFullPage && showingDetail"
          :model="testApiForm"
          ref="testApiForm" 
          label-width="100px" 
          label-position="left">
          <!-- url -->
          <el-form-item label="URL">
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
          <el-form-item label="接口说明">
            <p class="api-summary">
              &#10;{{ api.summary }}
            </p>  
          </el-form-item>
          <el-form-item> 
            <el-button type="primary" @click="testApi">发送请求</el-button>
            <el-button @click="collectApi" style="color: #909399" v-if="!isCollected">
              <font-awesome-icon icon="star"/>
              收藏 {{ api.stars }}
            </el-button>
            <el-button @click="cancelCollectApi" type="primary" style="color: #fff" v-else>
              <font-awesome-icon icon="star"/>
              已收藏 {{ api.stars }}
            </el-button> 
          </el-form-item>
        </el-form>
      </transition>
    </div>

    <div class="white-box-full">
      <h1>返回结果</h1>
      <!-- <app-tree></app-tree> -->
      <!-- <div v-loading="testLoading">
        <tree-view :data="dataFromApi" :options="{maxDepth: 10}"></tree-view>
      </div> -->

      <div v-loading="testLoading">
        <app-visiable-table :jsonData="dataFromApi" :callType="callType" :viewOptions="api.viewOptions"></app-visiable-table>
      </div> 
      
      <!-- <div v-html="ppTable"></div> -->
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {prettyPrint} from '../../prettyprint.js';
  import VisiableTable from '../VisiableTable.vue';
  export default {
    props: ['apiId'],
    data: function() {
      return {
        api: null,
        testApiForm: null,
        isCollected: false,
        showingDetail: false,
        callType: 'useApi', // 这个状态用来标识是谁调用VisibleTable组件的 
      }
    },
    computed: {
      dataFromApi: function() {
        return this.$store.getters.getDataFromApi;
      },
      testLoading: function() {
        return this.$store.getters.getTestLoading;
      },
      ppTable: function() {
        return prettyPrint(this.dataFromApi, {expanded: true, maxDepth: 10}).innerHTML;
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
      },
      collectApi: function() {
        var username = this.$store.getters.getUserName;
        this.isCollected = true;
        this.api.stars++;
        this.$store.dispatch('collectApi', { apiId: this.apiId, username: username });
      },
      cancelCollectApi: function() {
        var username = this.$store.getters.getUserName;
        this.isCollected = false;
        this.api.stars--;
        this.$store.dispatch('cancelCollectApi', { apiId: this.apiId, username: username });
      }
    },
    created: function() {
      var that = this;
      var reqUrl = this.$store.getters.getReqUrl;
      // 清除一下Vuex中的dataFromApi状态
      this.$store.commit('clearDataFromApi');
      // 获取api
      axios.get(
        reqUrl + '/api/getApiById?apiId=' + that.apiId
      ).then(function(res) {
        // console.log('根据id查询api的结果: ', res.data.data);
        that.api = res.data.data;
        console.log('根据id查询api的结果: ', that.api);
        that.$store.dispatch('storeApiToVuex', res.data.data);
        // 转化params为数组，主要是把default字段变成value
        /*
        [{
          key: item.key,
          value: item.default,
          necessary: item.necessary
        }]
        */
        if (Array.isArray(that.api.params) && that.api.params.length > 0) {
          var trans_params = [];
          for (let item of that.api.params) {
            var newItem = {
              key: item.key,
              value: item.default,
              necessary: item.necessary
            };
            trans_params.push(newItem);
          }
          that.api.params = trans_params;
        }
        // 当用户进入这个页面时，就开始自动发送请求
        that.testApi();  
      }).catch(function(err) {console.log(err)});

      // 发请求获取用户的myStars
      axios.get(
        reqUrl + '/api/getMyStars?username=' + this.$store.getters.getUserName,
        { headers: { 'Authorization': localStorage.getItem('token') } }).
        then(function(res) {
          console.log('我的收藏getMyStars：', res.data.data);
          var resData = res.data.data;
          for (var i=0,len=resData.length;i<len;i++) {
            if (that.apiId == resData[i]._id) {
              that.isCollected = true;
              break;
            }
          }
        }).catch(function(err) {console.log(err)});
    },
    components: {
      AppVisiableTable: VisiableTable
    }
  }
</script>

<style scoped>
  p.api-summary {
    display: block;
    text-indent: 0;
    white-space: pre-wrap;
    line-height:25px;
    -webkit-margin-before: -40px;
    -webkit-margin-after: -20px;
  }

  .api-author {
    cursor: pointer;
    margin-bottom: 15px;
    color: #909399;
  }

  .api-tags {
    margin-bottom: 15px;
  }

  /* .api-tag + .api-tag {
    margin-left: 10px;
  } */
  .api-tag {
    margin-right: 10px;
  }
</style>