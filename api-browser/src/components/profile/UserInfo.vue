<template>
  <div class="profile-box">
    <!-- 用户名 -->
    <div class="user-info">
      <font-awesome-icon icon="user" size="lg" style="color: #c6e2ff"/>&nbsp;&nbsp;{{ username }}
    </div>
    <!-- 邮箱 -->
    <div class="user-info">
      <font-awesome-icon icon="at" size="lg" style="color: #c6e2ff"/>&nbsp;&nbsp;{{ email }}
    </div>
    <!-- 个人签名 -->
    <div class="user-info">
      <font-awesome-icon icon="bullhorn" size="lg" style="color: #c6e2ff"/>&nbsp;&nbsp;{{ profile }}
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      username: function() {
        return this.$store.getters.getUserName;
      },
      email: function() {
        var data = this.$store.getters.getEmail;
        return data?data:'暂无';
      },
      profile: function() {
        var data = this.$store.getters.getProfile;
        return data?data:'暂无';
      }
    }
  }
</script>

<style scoped>
  .user-info {
    margin-bottom: 15px;
    color: #909399;
  }

  .profile-box {
    border-radius: 10px;
    box-shadow: 0 0 20px #bbb;
    padding: 20px;
  }
</style>