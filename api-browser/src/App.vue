<template>

  <el-container>
    <el-header height="65px">
      <app-header></app-header>
    </el-header>

    <el-main>
      <transition name="slide" mode="out-in" type="animation" appear>
        <router-view name="Home"></router-view>
      </transition>

      <div class="el-content">
        <el-row :gutter="0">
          <el-col :span="6"><div class="grid-content"></div></el-col>
          <el-col :span="12"><div class="grid-content">
            <transition name="slide" mode="out-in" type="animation" appear>
              <router-view></router-view>
            </transition>
          </div></el-col>
          <el-col :span="6"><div class="grid-content"></div></el-col>
        </el-row>
      </div>
    </el-main>
    <br><br>
    <el-footer height='80px'>
      <div class="footer">
        Copyright 2018 Allenmind. All Rights Reserved
      </div>
    </el-footer>
  </el-container>

</template>

<script>
  import Header from './components/Header.vue';
  import Search from './components/Search.vue';

  export default {
    components: {
      appHeader: Header,
      appSearch: Search
    },
    created: function() {
      this.$store.dispatch('tryAutoLogIn');
    }
  }
</script>

<style>
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif';
  }

  h1 {
    font-weight: normal;
    color: #409eff;
  }

  .el-container,
  .el-main,
  .el-header,
  .el-footer {
    padding: 0;
  }
  
  html {
    height: 100%;
  }

  body {
    height: 100%;
  }

  .el-container {
    min-height: 100%;
  }

  .el-main {
    min-height: 100%;
  }

  .el-content {
    margin: 0 10px;
  }

  .white-box {
    border-radius: 7px;
    box-shadow: 0 0 20px #999;
    padding: 30px 40px;
    width: 55%;
    margin: 0 auto 50px auto;
  }  

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

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

  .footer {
    text-align: center;
    color: #fff;
    /* background: #409EFF; */
    background: #474747;
    height: 80px;
    line-height: 80px;
  }
</style>
