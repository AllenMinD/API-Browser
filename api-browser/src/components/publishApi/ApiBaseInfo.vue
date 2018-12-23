<template>
  <div>
    <el-form label-position="left" label-width="100px">
      <el-form-item label="接口名称">
        <el-input v-model="form.title" placeholder="接口标题（必填）"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-tag
          :key="tag"
          v-for="tag in form.tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top: 20px;" align="center">
      <el-button @click="next" type="primary">下一步</el-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  data: function() {
    return {
      form: {
        title: "",
        tags: [],
      },
      inputVisible: false,
      inputValue: ""
    };
  },
  created: function() {
    // 初始化，从Vuex中获取api的title和tags
    let getApiBaseInfo = this.$store.getters.getApiBaseInfo;
    this.form.title = getApiBaseInfo.title;
    Vue.set(this.form, 'tags',  getApiBaseInfo.tags);
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
      this.inputValue = "";
    },

    next: function() {
      if (!this.form.title && this.form.tags.length === 0) {
        this.$message.error("请填入接口名称和API标签");
        return;
      } else if (!this.form.title) {
        this.$message.error("请填入接口名称");
        return;
      } else if (this.form.tags.length === 0) {
        this.$message.error("请填入API标签");
        return;
      } else {
        // 保存数据到vuex（publishApi.js）
        this.$store.commit("saveApiBaseInfo", this.form);
        // 跳到下一步
        this.$store.commit("addActive");
      }
    }
  }
  // create: function() {
  //   var api = this.$store.getters.getApi;
  //   this.form.title = api.title;
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