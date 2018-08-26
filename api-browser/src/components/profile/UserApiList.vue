<template>
  <div>
    <!-- api列表 -->
    <el-tabs type="border-card">
      <el-tab-pane label="我的API">
        <p v-if='myApis.length==0'>暂无发布api</p>
        <ul class="apis-list">
          <li v-for="(api, index) in myApis" :key="index">
            <el-row>
              <el-col :span="17"><div class="grid-content">
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
              <el-col :span="7"><div class="grid-content">
                <router-link :to="'/useapi/' + api._id" tag="span"><el-button type="primary">查看</el-button></router-link>
                <router-link :to="'/updateapi/' + api._id" tag="span"><el-button>修改</el-button></router-link>
              </div></el-col>
            </el-row>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="收藏夹">
        <p v-if='myStars.length==0'>暂无收藏api</p>
        <ul class="apis-list">
          <li v-for="(api, index) in myStars" :key="index">
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
      </el-tab-pane>
    </el-tabs>    
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    data: function() {
      return {
        myApis: [],
        myStars: []
      }
    },
    created: function() {
      var that = this;
      axios.get(
          'http://localhost:3000/api/getMyApi?username=' + that.$store.getters.getUserName,
          { headers: {
            'Authorization': localStorage.getItem('token')
            }
          }
        ).then(function(res) {
          console.log(res);
          // console.log(res.data.data);
          that.myApis = res.data.data;
        }).catch(function(error) {console.log(error)}
      );

      axios.get(
          'http://localhost:3000/api/getMyStars?username=' + that.$store.getters.getUserName,
          { headers: {
            'Authorization': localStorage.getItem('token')
            }
          }
        ).then(function(res) {
          console.log(res);
          // console.log(res.data.data);
          that.myStars = res.data.data;
        }).catch(function(error) {console.log(error)}
      );

    }
  }
</script>

<style scoped>
  .apis-list {
    list-style: none; 
    padding-left: 0; 
  }

  .apis-list > li {
    padding: 20px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    border-left: 3px solid #409EFF;
    border-radius: 5px;
    margin: 10px;
    transition: box-shadow .5s
  }

  .apis-list > li:hover {
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