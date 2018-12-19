<template>
  <div id="search">
    <el-row>
      <el-col :span="8"><div class="grid-content"></div></el-col>
      <el-col :span="8"><div class="grid-content">
        <div id="searchTitle">发现不一样的API体验！</div>
        <el-input placeholder="搜索API" v-model="keyword" size="large">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div></el-col>
      <el-col :span="8"><div class="grid-content"></div></el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    data: function() {
      return {
        keyword: ''
      }
    },
    methods: {
      search: function() {
        var that = this;
        var reqUrl = this.$store.getters.getReqUrl;
        if (this.keyword) {
          axios.get(reqUrl + '/api/search?keyword=' + this.keyword)
          .then(function(res) {
            console.log('搜索API返回的结果', res);
            that.$store.commit('setSearchApisList', res.data.data);
          }).catch(function(err) { console.log(err); });

          this.keyword = '';
        }
      }
    }
  }
</script>

<style scoped>
  #search {
    height: 450px;
    background: #8dc5ff url('../assets/bg.jpeg') no-repeat;
    background-size: cover;
    background-position: center;
    /* background-repeat: no-repeat; */
    /* background-size: 100% 350px; */
    /* background: linear-gradient(to bottom, #409EFF , #fff); */
  }

  #searchTitle {
    color: #fff;
    font-size: 40px;
    margin: 60px auto 20px auto;
  }
</style>