<template>
  <div>
    <h1 v-if="!isFullPage">发布API</h1>
    <app-publish-form v-if="!isFullPage"></app-publish-form>
    
    <hr v-if="!isFullPage">

    <transition name="slide" mode="out-in" type="animation">
      <app-test-api-result></app-test-api-result>
    </transition>
  </div>
</template>

<script>
  import PublishForm from './PublishForm.vue';
  import TestApiResult from '../TestApiResult.vue';

  export default {
    components: {
      appPublishForm: PublishForm,
      appTestApiResult: TestApiResult
    },
    computed: {
      isFullPage: function() {
        return this.$store.getters.getIsFullPage;
      }
    },
    created: function() {
      // 重置Vuex中的isTesting的状态
      this.$store.commit('resetTestState');
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