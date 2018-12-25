<template>
  <div>
    <app-search></app-search>

    <div class="el-content">
      <el-row :gutter="0">
        <el-col :span="3"><div class="grid-content"></div></el-col>
        <el-col :span="18"><div class="grid-content">
          <!-- <p v-if="isAuth">当前登录用户：{{ username }}</p> -->
          <!-- <app-api-list :apis="apiList"></app-api-list> -->
          <div class="white-box-full api-list-panel">
            <div class="tag-tabs-menu" v-if="!isSearching">
              <ul class="tag-tabs">
                <li 
                  :style="{ marginLeft: marginLeftData }"
                  :class="{ 'active': allTag.isActive }" 
                  @click="switchTag('全部', $event)">
                  全部
                </li>
                <li 
                  v-for="(tag, index) in tags" 
                  :key="index" 
                  :class="{ active: tag.isActive }" 
                  @click="switchTag(tag, $event)">
                  {{ tag.tagName }}
                </li>
              </ul>
              <div class="arrow-btn">
                <i class="el-icon-arrow-left" @click="leftMove($event)"></i>
                <i class="el-icon-arrow-right" @click="rightMove($event)"></i>
              </div>
            </div>
            <div v-if="isSearching" class="search-back-btn">
              <span>搜索结果：</span>
              <el-button size="mini" @click="backToAllApisList">返回</el-button>
            </div>
            <div class="api-list-content">
              <app-api-list-square :apis="apiList"></app-api-list-square>
            </div>
          </div>
        </div></el-col>
        <el-col :span="3"><div class="grid-content"></div></el-col>
      </el-row>
    </div>
  </div>  
</template>

<script>
  import axios from 'axios';
  import Search from './Search.vue';
  import ApiList from './ApiList.vue';
  import ApiListSquare from './ApiListSquare.vue';

  export default {
    data: function() {
      return {
        marginLeftData: '0px',
        isAll: true,
        allTag: { tagName: "全部", isActive: true },
        tags: [
          // { tagName: "新闻资讯", isActive: false },
          // { tagName: "教育培训", isActive: false },
          // { tagName: "实时监控", isActive: false },
          // { tagName: "电商购物", isActive: false },
          // { tagName: "游戏", isActive: false },
          // { tagName: "工具", isActive: false },
          // { tagName: "书影音", isActive: false },
          // { tagName: "体育", isActive: false },
          // { tagName: "交通", isActive: false },
          // { tagName: "旅游", isActive: false },
          // { tagName: "理财", isActive: false },
          // { tagName: "其他", isActive: false }
        ],
        lastActive: null,
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
        var show = null;
        if (this.isAll === true) {
          var all = this.$store.getters.getAllApisList;
          show = all;
        } else {
          var tag = this.$store.getters.getTagApisList;
          show = tag;
        }
        var search = this.$store.getters.getSearchApisList;  
        return search.length !== 0?search:show;
      }
    },
    methods: {
      backToAllApisList: function() {
        this.$store.commit('setSearchApisList', []);
      },
      leftMove: function(event) {
        var num = this.marginLeftData.slice(0, this.marginLeftData.indexOf('px'));
        if ((parseInt(num) + 60) < 0) {
          this.marginLeftData = (parseInt(num) + 60) + 'px';
        } else {
          this.marginLeftData = 0 + 'px';
        }
      },
      rightMove: function(event) {
        console.log(event.target.parentNode.previousSibling.previousSibling.offsetWidth); // ul.tag-tabs的宽度
        // console.log(event.target.parentNode.previousSibling.previousSibling.childNodes);
        // 统计目前显示的所有标签加起来的宽度
        let liNodes = event.target.parentNode.previousSibling.previousSibling.childNodes;
        let liNodes_width = 0;
        for (let i = 0, len = liNodes.length; i < len; i++) {
          if (liNodes[i].nodeType === 3) {
            continue;
          } else {
            liNodes_width += liNodes[i].offsetWidth;
          }
        }
        console.log('所有tags的宽度', liNodes_width);

        var num = this.marginLeftData.slice(0, this.marginLeftData.indexOf('px'));
        var scrollMargin = (this.tags.length + 1) * 88 - event.target.parentNode.previousSibling.previousSibling.offsetWidth;
        if (liNodes_width > event.target.parentNode.previousSibling.previousSibling.offsetWidth) {  // 当所有标签的宽度加起来大于ul的宽度的时候，才进行滚动
          if ((parseInt(num) - 60) > -scrollMargin) {
            this.marginLeftData = (parseInt(num) - 60) + 'px';
          } else {
            this.marginLeftData = -scrollMargin + 'px';
          }
        }
      },
      switchTag: function(tag, event) {
        // console.log(event.target.innerHTML.trim());
        var tagKeyword = event.target.innerHTML.trim();
        if (tagKeyword !== '全部') {
          this.isAll = false;
          this.lastActive.isActive = false;
          this.lastActive = tag;
          tag.isActive = true;
          var reqUrl = this.$store.getters.getReqUrl;
          var that = this;
          // 根据标签获取Api
          axios.get(reqUrl + '/api/getApiByTag?tag=' + tagKeyword)
              .then(function(res) {
                // console.log(res.data.data); // 标签为【tag】的api
                that.$store.commit('setTagApisList', res.data.data);
              }).catch(function(err) {console.log(err)});
        } else {
          this.isAll = true;
          this.lastActive.isActive = false;
          this.lastActive = this.allTag;
          this.allTag.isActive = true;
        }
      }
    },
    components: {
      appSearch: Search,
      appApiList: ApiList,
      appApiListSquare: ApiListSquare
    },
    created: function() {
      var that = this;
      var reqUrl = this.$store.getters.getReqUrl;
      // 获取全部Api
      axios.get(reqUrl + '/api/getAllApis')
        .then(function(res) {
          console.log(res);
          // console.log(res.data.data);
          that.$store.commit('setAllApisList', res.data.data);
        }).catch(function(error) {console.log(error)}
      );

      // 获取热门标签
      axios.get(reqUrl + '/api/getTopTags').then(function(res) {
        console.log('获取热门标签结果：', res.data.data);
        if (Array.isArray(res.data.data)) {
          let tags_temp = [];
          for (let item of res.data.data) {
            let newItem = {
              tagName: item,
              isActive: false
            }
            tags_temp.push(newItem);
          }
          that.tags = tags_temp;
        }
      }).catch(function(err) {
        console.log(err);
      });

      this.lastActive = this.allTag;   
    }
  }  
</script>

<style scoped>
  .api-list-panel {
    margin-top: -60px;
    padding: 0;
  }

  .tag-tabs-menu {
    height: 59px;
    border-bottom: 1px solid #eee;
  }

  .tag-tabs {
    width: 90%;
    height: 100%;
    list-style: none;
    padding: 0;
    margin: 0 20px;
    display: inline-block;
    overflow: hidden;
  }

  .tag-tabs > li:nth-child(1) {
    transition: margin-left .3s;
  }

  .arrow-btn {
    height: 100%;
    margin: 0;
    padding-top: 20px;
    padding-bottom: 20px;
    display: inline-block;
    overflow: hidden;
  } 

  .arrow-btn i {
    display: inline-block;
  }

  .arrow-btn i:hover {
    cursor: pointer;
  }

  .tag-tabs li {
    display: inline-block;
/*     padding-top: 20px;
    padding-bottom: 20px; */
    padding: 20px 20px 15px 20px;
    transition: background-color .5s, border-bottom .5s;
  }

  .tag-tabs li:hover {
    cursor: pointer;
    background-color: #ecf5ff;
  }

/*   .tag-tabs li + li {
    padding-left: 40px;
  } */

  .api-list-content {
    padding: 20px 40px 30px 40px;
  }
  
  .search-back-btn {
    padding-top: 30px;
    padding-left: 70px;
  }

  .active {
    border-bottom: 3px solid #409eff;
  }

</style>