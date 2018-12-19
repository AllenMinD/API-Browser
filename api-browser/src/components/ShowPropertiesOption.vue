<template>
  <div id="showPropertiesOption">
    <div class="tip">如果‘需要显示字段’为空，即默认显示全部字段</div>
    <el-transfer v-model="currentShowProperties" :data="allProperties" :titles="['全部字段', '需要显示的字段']"></el-transfer>
  </div>
</template>

<script>
  export default {
    props: ['showProperties'],
    data: function() {
      var that = this;
      function getAllProperties() {
        return that.$store.getters.getAllProperties;
      }
      return {
        allProperties: getAllProperties(),
        currentShowProperties: this.showProperties?this.showProperties:[]
      };
    },

    watch: {
      currentShowProperties: function(val) {  // 当showProperties发生变化时，更新vuex
        console.log('currentShowProperties: ', val);
        this.$store.commit('setShowProperties', val);
      }
    }
  }
</script>

<style>
  #showPropertiesOption {
    border-radius: 10px;
    box-shadow: 0 0 20px #DCDFE6;
    padding: 30px 50px;
  }

  .tip {
    font-size: 13px;
    color: #aaa;
    padding-bottom: 10px;
  }
</style>