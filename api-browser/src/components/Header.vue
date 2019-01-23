<template>
  <div>
    <ul class="my-menu">
      <router-link tag="li" :to="{ name: 'Home' }" class="my-menu-logo" exact>
        <img src="../assets/logo2.png" class="logo-img" alt="logo">
        API Browser
      </router-link>
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
    font-family: 'Lato';
    src: url('../assets/Lato-Regular.ttf');
    font-weight: normal;    
    font-style: normal; 
  }

  .my-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    background-color: #fff;
    /* background: transparent; */
    /* border-bottom: 1px solid #e6e6e6; */
    border-bottom: 1px solid #F2F6FC;
    box-shadow: 0 5px 8px #F2F6FC;
  }

  .my-menu-logo,
  .my-menu-item-extra {
    font-size: 14px;
    /* color: #909399; */
    color: #409eff;
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
    display: inline-flex;
    align-items: center;
    color: #409eff;
    font-size: 1.6em;
    font-family: 'Lato';
  }

  .my-menu-logo:hover {
    cursor: pointer;
    color: #8dc5ff;
  }

  .my-menu-logo .logo-img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  .my-menu-item {
    font-family: 'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif';
    font-size: 14px;
    /* color: #909399; */
    color: #909399;
    display: inline-block;
    padding: 0 20px;
    margin: 0;
    height: 66px;
    line-height: 66px;
    /* border-bottom: 2px solid #fff; */
    /* border-bottom: 2px solid #409eff; */
    transition: border-color .3s, color .3s;
  }

  .my-menu-item:hover {
    cursor: pointer;
    /* color: #303133; */
    color: #409eff;
    /* border-bottom: 2px solid #409eff; */
    /* border-bottom: 2px solid #409eff; */
  }

  .menu-right {
    float: right;
    /* margin-top: 3px; */
  }

  .active {
    cursor: pointer;
    /* color: #303133; */
    color: #409eff;
    /* border-bottom: 2px solid #409eff; */
    /* border-bottom: 2px solid #409eff; */
  }
</style>