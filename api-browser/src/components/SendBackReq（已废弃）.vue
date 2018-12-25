<template>
  <!-- 把修改后的json数据发回后台 -->
 <div id="sendReqForm">
    <div>（发送请求前记得要按“保存”按钮）</div>
    <br>
    <el-form
    :model="sendBackForm" 
    label-width="100px" 
    label-position="left">
      <!-- token -->
      <el-form-item label="Token">
        <el-input type="text" v-model="sendBackForm.token" size="small"></el-input>
      </el-form-item>
      <!-- url -->
      <el-form-item label="URL">
        <el-input type="text" v-model="sendBackForm.url" size="small">
          <template slot="prepend">POST</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendReq">发送请求</el-button>
        <el-popover
          placement="right-start"
          title="说明"
          width="200"
          trigger="hover"
          content="Token由发布者自行指定。在服务器收到请求后时，需要检查Token正确，才接收修改后的JSON数据进行下一步的处理。">
          <i slot="reference" class="el-icon-question" style="color: #409EFF; font-size: 1.5em;" ></i>
        </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';

  export default {
    props: ['sendBackData'],
    data: function() {
      return {
        sendBackForm: {
          url: '',
          token: ''
        }
      };
    },
    methods: {
      sendReq: function() {
        if (!this.sendBackData) {
          this.$message({
            message: '先保存数据再发送请求',
            type: 'warning'
          });
        } else if (this.sendBackForm.token === '') {
          this.$message({
            message: '请填入Token',
            type: 'warning'
          });
        } else if (this.sendBackForm.url === '') {
          this.$message({
            message: '请填入URL',
            type: 'warning'
          });
        } else {
          var params = {};  // 发回后台的数据
          var that = this;
          params.token = this.sendBackForm.token;
          params.url = that.sendBackForm.url;
          params.method = 'POST';
          params.data = this.sendBackData;
          // 发送请求
          // 把修改后的JSON数据发给api-browser的后端，然后再由服务器转发请求到另一台服务器
          this.$store.dispatch('sendBackData', params);
        }
      }
    }
  }
</script>

<style scoped>
  #sendReqForm {
    border-radius: 10px;
    box-shadow: 0 0 20px #DCDFE6;
    padding: 30px 50px;
  }
</style>