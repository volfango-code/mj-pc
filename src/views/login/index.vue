<template>
  <div class="login-page">
     <el-card class="box-card">
      <template #header>面经后台管理</template>
      <el-form autocomplete="off" label-width="60px" :model="user" :rules="rules" ref="form">
        <el-form-item label="账 号" prop="username">
          <el-input placeholder="输入用户名" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密 码" prop="password">
          <el-input type="password" placeholder="输入用户密码" v-model="user.password"></el-input>
        </el-form-item>
        <el-form class="tc">
          <el-button type="primary" @click="onSubmit">登 录</el-button>
          <el-button @click="$refs.form.resetFields()">重 置</el-button>
        </el-form>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { loginAPI } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const res = await loginAPI(this.user)
            // 登录成功，设置token
            // localStorage.setItem('mj-pc-token', res.data.token)
            this.$store.commit('user/updateToken', res.data.token)
            this.$message.success('登录成功')
            this.$router.push('/dashboard')
          } catch (e) {
            console.log(e)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background: url('@/assets/login-bg.svg') no-repeat center;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .el-card {
    width: 420px;
    ::v-deep .el-card__header {
      height: 80px;
      background: rgba(114, 124, 245, 1);
      text-align: center;
      line-height: 40px;
      color: #fff;
      font-size: 18px;
    }
  }
  .el-form {
    padding: 0 20px;
  }
  .tc {
    text-align: center;
  }
}

</style>
