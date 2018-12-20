<template>
  <div id="publishAPI" class="white-box-full">
    <h1>配置API</h1>
    <el-steps :active="active" space="100%" finish-status="success" align-center>
      <el-step title="API基本信息"></el-step>
      <el-step title="API参数配置"></el-step>
      <el-step title="视图配置"></el-step>
    </el-steps>
    
    <div style="margin-top: 20px;">
      <transition name="flip" mode="out-in">
        <keep-alive>
          <component :is="view"></component>
        </keep-alive>
      </transition>
    </div>

<!--     <div style="margin-top: 20px;" align="center" v-else>
      <el-button @click="publish" type="primary">发布API</el-button>
    </div> -->
  </div>
</template>

<script>
  import ApiBaseInfo from './ApiBaseInfo.vue';
  import ApiOptions from './ApiOptions.vue';
  import ViewOptions from './ViewOptions.vue';

  export default {
    data: function() {
      return {
        
      };
    },
    computed: {
      view: function() {
        if (this.active === 0) {
          return 'app-api-base-info';
        } else if (this.active === 1) {
          return 'app-api-options';
        } else {
          return 'app-view-options';
        }
      },
      active: function() {
        return this.$store.getters.getActive;
      }
    },
    methods: {

    },
    components: {
      AppApiBaseInfo: ApiBaseInfo,
      AppApiOptions: ApiOptions,
      AppViewOptions: ViewOptions
    },
    create: function() {
      this.$store.commit('resetActive');
    }
  };
</script>

<style scoped>
  #publishAPI {
    margin-top: 20px;
  }

  .flip-enter-active {
    animation: flip-in .3s ease-out forwards;
  }
  .flip-leave-active {
    animation: flip-out .3s ease-out forwards;
  }

  @keyframes flip-out {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(90deg);
    }
  }
  @keyframes flip-in {
    from {
      transform: rotateY(90deg);
    }
    to {
      transform: rotateY(0deg);
    }
  }  
</style>