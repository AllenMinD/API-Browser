<template>
  <div>
    <h1 v-if="!isFullPage">修改API</h1>
    <app-update-form v-if="api && !isFullPage" :passApi="api"></app-update-form>

    <hr v-if="!isFullPage">

    <transition name="slide" mode="out-in" type="animation">
      <app-test-api-result></app-test-api-result>
    </transition>
  </div>
</template>

<script>
  import axios from 'axios';
  import UpdateForm from './UpdateForm.vue';
  import TestApiResult from '../TestApiResult.vue';

  export default {
    props: ['apiId'],
    data: function() {
      return {
        api: null
      }
    },
    created: function() {
      var that = this;
      // 重置Vuex中的isTesting的状态
      this.$store.commit('resetTestState');
      // 获取api
      axios.get(
        'http://localhost:3000/api/getApiById?apiId=' + that.apiId
      ).then(function(res) {
        console.log('根据id查询api的结果：', res);
        that.api = res.data.data;
        // 转化params为数组，并且变为这样的形式 
        // [{key1: '', value1: '', necessary: true } , {key2: '', value2: '', necessary: true }]
        var trans_params = [];
        for (var key in that.api.params) {
          var newItem = {
            key: key,
            value: '',
            necessary: that.api.params[key]?'必填':'选填'
          };
          trans_params.push(newItem);
        }
        that.api.params = trans_params;
        that.$store.dispatch('storeApiToVuex', that.api);
      }).catch(function(error) {console.log(error)});      
    },
    computed: {
      isFullPage: function() {
        return this.$store.getters.getIsFullPage;
      }
    },
    components: {
      appUpdateForm: UpdateForm,
      appTestApiResult: TestApiResult
    }
  }
</script>

<style scoped>
  .slide-enter,
  .slide-leave-to {
    opacity: 0;
  }

  .slide-enter-active {
    animation: slide-in .3s ease-out forwards;
    transition: opacity .3s;
  }

  .slide-leave-active {
    animation: slide-out .3s ease-out forwards;
    transition: opacity .3s;
  }

  @keyframes slide-in {
    from {
      transform: translateY(-30px);
    }
    to {
      transform:  translateY(0px);
    }
  }

  @keyframes slide-out {
    from {
      transform: translateY(0);
    }
    to {
      transform:  translateY(-30px);
    }
  }  
</style>