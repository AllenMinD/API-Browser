<template>
  <div>
    <app-user-info></app-user-info>
    <br>
    <app-user-api-list></app-user-api-list>
  </div>
</template>

<script>
  import UserInfo from './UserInfo.vue';
  import UserApiList from './UserApiList.vue';

  export default {
    components: {
      appUserInfo: UserInfo,
      appUserApiList: UserApiList
    }
  }
</script>

<style></style>