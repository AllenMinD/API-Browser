<template>
  <div>
    <el-form label-position="left" label-width="100px" >
      <el-form-item label="接口名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-tag
          :key="tag"
          v-for="tag in form.tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
      <!-- 简介说明 -->
      <el-form-item label="接口说明">
        <el-input type="textarea" :autosize="{ minRows: 4}" v-model="form.summary" ></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-top: 20px;" align="center">
      <el-button @click="next" type="primary">下一步</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        form: {
          name: '',
          tags: [],
          summary: ''
        },
        inputVisible: false,
        inputValue: ''
      };
    },
    computed: {
      active: function() {
        return this.$store.getters.getActive;
      }
    },
    methods: {
      handleClose(tag) {
        this.form.tags.splice(this.form.tags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.form.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },

      next: function() {
        // 保存数据到vuex（publishApi.js）
        this.$store.commit('saveApiBaseInfo', this.form);
        // 跳到下一步
        this.$store.commit('addActive');
      },
    },
    // create: function() {
    //   var api = this.$store.getters.getApi;
    //   this.form.name = api.name;
    //   this.form.tags = api.tags;
    //   this.form.summary = api.summary;
    // }
  };
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }  
</style>