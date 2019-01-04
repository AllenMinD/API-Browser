<template>
  <!-- 首页中的全部api列表 -->
  <div class="api-list-square">
    <div 
      class="api-item"
      v-for="(api, index) in apis"
      :key="index">
        <div class="api-title">
          {{ api.title }}
        </div>
        <div class="api-summary">
          {{ api.summary }}
        </div>

        <div class="bottom-part">
        <div class="api-info api-info-inline api-method">{{ api.method }}</div>
          <div class="api-info api-info-inline api-author">
            <font-awesome-icon icon="user" style="color: #77bbff"/>&nbsp;
            <router-link tag="span" :to="/profile/ + api.author">{{ api.author }}</router-link>
          </div>
          <div class="api-info api-info-inline api-stars">
            <font-awesome-icon icon="star" style="color: #77bbff"/>&nbsp;
            {{ api.stars }}
          </div>
          <div class="api-info api-tags">
            <el-tag 
              class="api-tag"
              size="small" 
              type="info"
              v-for="(tag, index) in api.tags"
              :key="'tag' + index">
              {{ tag }}
            </el-tag>
          </div>

          <router-link :to="'/useapi/' + api._id" tag="div" align="center"><el-button type="primary" size="small">View All</el-button></router-link>
        </div>
        
    </div>
  </div>
</template>

<script>
  export default {
    props: ['apis'],
    data: function() {
      return {
      }
    }
  }
</script>

<style scoped>
  .api-list-square {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .api-item {
    border-radius: 5px;
    border: 1px solid #DCDFE6;
    padding: 20px;
    margin: 10px;
    width: 30%;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    transition: box-shadow .5s;
    border-top: 3px solid #409eff;
  }

  .api-item:hover {
    box-shadow: 0 10px 14px 0 rgba(0,0,0,.12), 0 0 16px 0 rgba(0,0,0,.04);
  }

  .api-title {
    font-size: 15px;
    margin-bottom: 20px;
    text-align: center;

    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .api-summary {
    color: #909399;
    line-height: 1.5em;
    font-size: 13px;
    margin-bottom: 20px;
    min-height: 80px;

    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  .api-info {
    font-size: 13px;
    margin-bottom: 10px;
    color: #909399;
  }

  .api-info-inline {
    display: inline-block;
  }

  .api-info-inline + .api-info-inline {
    margin-left: 15px;
  }

  .api-method {
    border-radius: 6px;
    border: 1px solid #77bbff;
    font-size: 12px;
    padding: 0.5px 3px;
    color: #77bbff;
  }

  .api-author {
    cursor: pointer;
  }

  .api-stars {

  }

  .api-tags {
    min-height: 24px;
  }

  .api-tag + .api-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .api-tag:nth-child(1) {
    margin-right: 10px;
    margin-bottom: 10px;
  }

</style>