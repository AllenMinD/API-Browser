<template>
  <div>
    <ul class="my-menu">
      <router-link tag="li" :to="{ name: 'Home' }" class="my-menu-logo" exact>API Browser</router-link>
      <!-- <router-link tag="li" to="/" class="my-menu-item" active-class="active" exact>主页</router-link> -->
      <router-link v-if="!isAuth" tag="li" to="/signup" class="my-menu-item menu-right" active-class="active">注册</router-link>
      <router-link v-if="!isAuth" tag="li" to="/signin" class="my-menu-item menu-right" active-class="active">登录</router-link>
      <li 
        class="my-menu-item menu-right" 
        v-if="isAuth" 
        @click="logOut">
        登出
      </li>
      <router-link tag="li" :to="'/profile/' + username" class="my-menu-item menu-right" v-if="isAuth" active-class="active">{{ username }}</router-link>
      <router-link v-if="isAuth" tag="li" to="/publish" class="my-menu-item menu-right" active-class="active">发布API</router-link>
    </ul>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
      };
    },
    computed: {
      username: function() {
        return this.$store.getters.getUserName;
      },
      isAuth: function() {
        return this.$store.getters.isAuth;
      }
    },
    methods: {
      logOut: function() {
        this.$store.dispatch('logOut');
      }
    }
  };
</script>

<style scoped>
  @font-face {
    /* font-properties */
    font-family: 'Mahalo';
    src: url('../assets/Mahalo.otf');
    font-weight: normal;    
    font-style: normal; 
  }

  .my-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    background-color: #409eff;
    /* border-bottom: 1px solid #e6e6e6; */
    border-bottom: 1px solid #fff;
  }

  .my-menu-logo,
  .my-menu-item-extra {
    font-size: 14px;
    /* color: #909399; */
    color: #fff;
    display: inline-block;
    padding: 0 20px;
    margin: 0;
    height: 65px;
    line-height: 65px;
    transition: color .3s;
  }

  .my-menu-item-extra {
    font-family: 'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif';
  }

  .my-menu-item-extra:hover {
    cursor: pointer;
    color: #303133;
  }

  .my-menu-logo {
    color: #fff;
    font-size: 1.6em;
    font-family: 'Mahalo';
  }

  .my-menu-logo:hover {
    cursor: pointer;
    color: #8dc5ff;
  }

  .my-menu-item {
    font-family: 'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif';
    font-size: 14px;
    /* color: #909399; */
    color: #DCDFE6;
    display: inline-block;
    padding: 0 20px;
    margin: 0;
    height: 60px;
    line-height: 60px;
    /* border-bottom: 2px solid #fff; */
    border-bottom: 2px solid #409eff;
    transition: border-color .3s, color .3s;
  }

  .my-menu-item:hover {
    cursor: pointer;
    /* color: #303133; */
    color: #fff;
    /* border-bottom: 2px solid #409eff; */
    border-bottom: 2px solid #fff;
  }

  .menu-right {
    float: right;
    /* margin-top: 3px; */
  }

  .active {
    cursor: pointer;
    /* color: #303133; */
    color: #fff;
    /* border-bottom: 2px solid #409eff; */
    border-bottom: 2px solid #fff;
  }
</style>