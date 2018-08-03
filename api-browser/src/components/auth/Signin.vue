<template>
  <div>
    <div class="white-box">
      <div class="header">登录</div>
      <div class="sub-header">SIGN IN</div>
      
      <el-form label-position="left" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="name">
          <el-input type="text" v-model="ruleForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          name: '',
          pass: ''
        },
        rules: {
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            var formData = {
              name: this.ruleForm.name,
              password: this.ruleForm.pass
            };
            this.$store.dispatch('signin', formData);
            this.$refs[formName].resetFields();
          } else {
            console.log('error submit!!');
            this.$refs[formName].resetFields();
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
  .white-box {
    margin-top: 50px;
  }

  .header {
    text-align: center;
    font-size: 20px;
  }

  .header:before {
    content: '—— ';
    color: #ccc;
  }

  .header:after {
    content: ' ——';
    color: #ccc;
  }

  .sub-header {
    text-align: center;
    font-size: 13px;
    color: #ccc;
    margin-bottom: 20px;
  }
</style>