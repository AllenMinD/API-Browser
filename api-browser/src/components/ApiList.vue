<template>
  <ul class="apis-list">
    <li v-for="(api, index) in apis" :key="index">
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
          <div class="api-info api-author">
            <font-awesome-icon icon="user" style="color: #77bbff"/>&nbsp;
            <router-link tag="span" :to="/profile/ + api.author">{{ api.author }}</router-link>
          </div>
          <div class="api-info api-stars">
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
        </div></el-col>
        <el-col :span="4"><div class="grid-content">
          <router-link :to="'/useapi/' + api._id" tag="span"><el-button type="primary">查看</el-button></router-link>
          <router-link :to="'/updateapi/' + api._id" tag="span" v-if="apis.canSet === true"><el-button>修改</el-button></router-link>
        </div></el-col>
      </el-row>
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['apis']
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

  .api-author {
    cursor: pointer;
  }

  .api-url {
    overflow: hidden;  /* 【核心代码】 超出文本不显示 */
    text-overflow: ellipsis;  /* 【核心代码】 超出的区域的问题用省略号显示 */
    white-space: nowrap;  /* 文本不允许换行 */
  }

  .api-tag + .api-tag {
    margin-left: 10px;
  }
</style>