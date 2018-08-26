<template>
  <div>
    <app-search></app-search>

    <div class="el-content">
      <el-row :gutter="20">
        <el-col :span="6"><div class="grid-content"></div></el-col>
        <el-col :span="12"><div class="grid-content">
          <!-- <p v-if="isAuth">当前登录用户：{{ username }}</p> -->
          <span v-if="isSearching">搜索结果：</span>
          <el-button v-if="isSearching" size="mini" @click="backToAllApisList">返回</el-button>
          <ul class="all-apis">
            <li v-for="(api, index) in apiList" :key="index">
              <el-row>
                <el-col :span="20"><div class="grid-content">
                  <div class="api-title">
                    {{ api.title }}
                    &nbsp;<span class="api-method">{{ api.method }}</span>
                  </div>
                  <div class="api-info api-url">
                    <font-awesome-icon icon="link" style="color: #77bbff"/>&nbsp;
                    {{ api.url }}
                  </div>
                  <div class="api-info api-stars">
                    <font-awesome-icon icon="star" style="color: #77bbff"/>&nbsp;
                    {{ api.stars }}
                  </div>
                </div></el-col>
                <el-col :span="4"><div class="grid-content">
                  <router-link :to="'/useapi/' + api._id" tag="span"><el-button type="primary">查看</el-button></router-link>
                </div></el-col>
              </el-row>
            </li>
          </ul>
        </div></el-col>
        <el-col :span="6"><div class="grid-content"></div></el-col>
      </el-row>
    </div>
  </div>  
</template>

<script>
  import axios from 'axios';
  import Search from './Search.vue';
  export default {
    data: function() {
      return {
      };
    },
    computed: {
      // username: function() {
      //   return this.$store.getters.getUserName;
      // },
      // isAuth: function() {
      //   return this.$store.getters.isAuth;
      // },
      isSearching: function() {
        var search = this.$store.getters.getSearchApisList;
        return search.length === 0?false:true;
      },
      apiList: function() {
        var all = this.$store.getters.getAllApisList;
        var search = this.$store.getters.getSearchApisList;
        return search.length !== 0?search:all;
      }
    },
    methods: {
      backToAllApisList: function() {
        this.$store.commit('setSearchApisList', []);
      }
    },
    components: {
      appSearch: Search
    },
    created: function() {
      var that = this;
      axios.get('http://localhost:3000/api/getAllApis')
        .then(function(res) {
          console.log(res);
          // console.log(res.data.data);
          that.$store.commit('setAllApisList', res.data.data);
        }).catch(function(error) {console.log(error)}
      );      
    }
  }  
</script>

<style scoped>
  .all-apis {
    list-style: none; 
    padding-left: 0; 
  }

  .all-apis > li {
    padding: 20px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    border-left: 3px solid #409EFF;
    border-radius: 5px;
    margin: 10px;
    transition: box-shadow .5s
  }

  .all-apis > li:hover {
    box-shadow: 0 10px 14px 0 rgba(0,0,0,.12), 0 0 16px 0 rgba(0,0,0,.04);
  }

  .api-title {
    font-size: 17px;
    margin-bottom: 20px;
  }

  .api-method {
    border-radius: 6px;
    border: 1px solid #77bbff;
    font-size: 12px;
    padding: 0.5px 3px;
    color: #77bbff;
  }

  .api-info {
    margin-bottom: 10px;
    color: #909399;
  }

  .api-url {
    overflow: hidden;  /* 【核心代码】 超出文本不显示 */
    text-overflow: ellipsis;  /* 【核心代码】 超出的区域的问题用省略号显示 */
    white-space: nowrap;  /* 文本不允许换行 */
  }  
</style>