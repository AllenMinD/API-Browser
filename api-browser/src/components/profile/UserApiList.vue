<template>
  <div>
    <!-- api列表 -->
    <el-tabs type="border-card">
      <el-tab-pane label="我的API">
        <p v-if='myApis.length==0'>暂无发布api</p>
        <app-api-list :apis="myApis"></app-api-list>
      </el-tab-pane>
      <el-tab-pane label="收藏夹">
        <p v-if='myStars.length==0'>暂无收藏api</p>
        <app-api-list :apis="myStars"></app-api-list>  
      </el-tab-pane>
    </el-tabs>    
  </div>
</template>

<script>
  import axios from 'axios';
  import apiList from '../ApiList.vue';
  import router from "../../router";
  export default {
    data: function() {
      return {
        myApis: [],
        myStars: []
      }
    },
    components: {
      appApiList: apiList
    },
    created: function() {
      var that = this;
      var reqUrl = this.$store.getters.getReqUrl;
      axios.get(
          reqUrl + '/api/getMyApi?username=' + that.$store.getters.getUserName,
          { headers: {
            'Authorization': localStorage.getItem('token')
            }
          }
        ).then(function(res) {
          console.log(res);
          // console.log(res.data.data);
          that.myApis = res.data.data;
          that.myApis.canSet = true; // 可以修改api（显示“修改按钮”）
        }).catch(function(err) {
          console.log(err)
          that.$message({
            message: "哎呀，token失效了，请重新登录",
            type: "error"
          });
          that.$store.commit('clearAuth');
          router.replace('/signin');
        }
      );

      axios.get(
           reqUrl + '/api/getMyStars?username=' + that.$store.getters.getUserName,
          { headers: {
            'Authorization': localStorage.getItem('token')
            }
          }
        ).then(function(res) {
          console.log(res);
          // console.log(res.data.data);
          that.myStars = res.data.data;
        }).catch(function(err) {
          console.log(err)
          that.$message({
            message: "哎呀，token失效了，请重新登录",
            type: "error"
          });
          that.$store.commit('clearAuth');
          router.replace('/signin');
        }
      );

    }
  }
</script>

<style scoped>

</style>