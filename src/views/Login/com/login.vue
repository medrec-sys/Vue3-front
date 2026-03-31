<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {useLoginStore} from "@/stores";
import Square from './square.vue'
import {animate} from "animejs";
import {ElMessage, ElNotification} from 'element-plus'
import type {FormInstance, FormRules} from 'element-plus'
import {
  User,
  Avatar,
  Lock
} from '@element-plus/icons-vue'

const router = useRouter()

const loginStore = useLoginStore()

const isLogin = ref(true)
const beginChange = ref(false)

// 表单引用
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

// 表单规则
const loginRules = reactive<FormRules>({
  // account: [
  //   {required: true, message: '请输入账号', trigger: 'blur'},
  //   {min: 4, max: 16, message: '长度在4到16个字符', trigger: 'blur'}
  // ],
  // password: [
  //   {required: true, message: '请输入密码', trigger: 'blur'},
  //   {min: 5, max: 20, message: '长度在5到20个字符', trigger: 'blur'}
  // ]
})

const registerRules = reactive<FormRules>({
  // account: [
  //   {required: true, message: '请输入账号', trigger: 'blur'},
  //   {min: 4, max: 16, message: '长度在4到16个字符', trigger: 'blur'}
  // ],
  // username: [
  //   {required: true, message: '请输入用户名', trigger: 'blur'},
  //   {min: 2, max: 16, message: '长度在2到16个字符', trigger: 'blur'}
  // ],
  // password: [
  //   {required: true, message: '请输入密码', trigger: 'blur'},
  //   {min: 5, max: 20, message: '长度在5到20个字符', trigger: 'blur'},
  //   {pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: '必须包含字母和数字', trigger: 'blur'}
  // ],
  password2: [
    {required: true, message: '请再次输入密码', trigger: 'blur'},
    {validator: validatePassword2, trigger: 'blur'}
  ]
})

// 验证两次密码是否一致
function validatePassword2(rule: any, value: string, callback: any) {
  if (rule === null) {
    return
  }
  if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const initAnimation = () => {
  animate(".container", {
    y: {from: 100},
    scale: {from: 0},
    autoplay: true,
    duration: 3000,
    easing: "easeInOutSine",
    onComplete: () => {
      initMouseAnimation()
    }
  });

  const initMouseAnimation = () => {
    const elements = document.querySelectorAll('.container');

    elements.forEach(element => {
      element.addEventListener('mousemove', () => {
        animate('.container', {
          y: -5,
          boxShadow: '0 35px 55px rgba(0, 0, 0, 0.2)',
          duration: 900,
        })
      })
      element.addEventListener('mouseleave', () => {
        animate('.container', {
          y: 0,
          boxShadow: '0 15px 25px rgba(0, 0, 0, 0.2)',
          duration: 900,
        })
      })
    })
  }
}

let loginForm = reactive({
  account: '',
  password: ''
})

let registerForm = reactive({
  account: '',
  username: '',
  password: '',
  password2: ''
})

const isSubmitting = ref(false)

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate()
  isSubmitting.value = true

  const res = await loginStore.login(loginForm.account, loginForm.password)

  if (res.code == 1) {
    ElNotification({
      title: '登录成功' as any,
      message: '欢迎回来！' as any,
      type: 'success' as any,
    })
    await router.push('/home')
  } else {
    ElMessage.error(res.message as any)
  }
  isSubmitting.value = false
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  try {
    await registerFormRef.value.validate()
    isSubmitting.value = true
    const res = await loginStore.register(registerForm.account, registerForm.username, registerForm.password)
    if (res.code === -1) {
      return
    }

    ElNotification({
      title: '注册成功'  as any,
      message: '请使用新账号登录'  as any,
      type: 'success'  as any,
    })
    goToOther(false) // 注册成功后自动切换到登录界面
  } catch (error) {
    ElMessage.error('注册失败，请检查输入信息'  as any)
  } finally {
    isSubmitting.value = false
  }
}

// const handleForgetPassword = () => {
//   ElMessage.info('忘记密码功能暂未实现')
// }

const goToOther = (isL: boolean) => {
  beginChange.value = !beginChange.value

  animate(isL ? '.login' : '.register', {
    y: 100,
    scale: 0,
    duration: 1000,
    easing: 'easeInOutSine',
    onComplete: () => {
      isLogin.value = !isL
      showOtherAnimation()
      clearForm()
    }
  })

  const showOtherAnimation = () => {
    animate(!isL ? '.login' : '.register', {
      y: {from: 100, to: 0},
      scale: {from: 0, to: 1},
      duration: 1000,
      easing: 'easeInOutSine',
    })
  };

  const clearForm = () => {
    Object.assign(loginForm, {
      account: '',
      password: ''
    });

    Object.assign(registerForm, {
      account: '',
      username: '',
      password: '',
      password2: ''
    });
  };
};

onMounted(() => {
  initAnimation()
});
</script>

<template>
  <div class="box">
    <Square :is-login="beginChange"></Square>

    <div v-show="isLogin" class="container login">
      <div class="form">
        <h2>登录 界面</h2>
        <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            @submit.prevent="handleLogin"
        >
          <el-form-item prop="account">
            <el-input
                v-model="loginForm.account"
                placeholder="账号"
                clearable
            >
              <template #prefix>
                <el-icon>
                  <user/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                show-password
                clearable
            >
              <template #prefix>
                <el-icon>
                  <lock/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
                type="primary"
                native-type="submit"
                :loading="isSubmitting"
                class="submit-btn"
            >
              登录
            </el-button>
          </el-form-item>

          <!--          <p class="forget">-->
          <!--            忘记密码 ? <a href="#" @click.prevent="handleForgetPassword">点击找回密码</a>-->
          <!--          </p>-->
          <p class="forget">
            没有账号 ? <a href="#" @click.prevent="goToOther(true)">注册</a>
          </p>
        </el-form>
      </div>
    </div>

    <div v-show="!isLogin" class="container register">
      <div class="form">
        <h2>注册 界面</h2>
        <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            @submit.prevent="handleRegister"
        >
          <el-form-item prop="account">
            <el-input
                v-model="registerForm.account"
                placeholder="账号"
                clearable
            >
              <template #prefix>
                <el-icon>
                  <user/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="username">
            <el-input
                v-model="registerForm.username"
                placeholder="用户名"
                clearable
            >
              <template #prefix>
                <el-icon>
                  <avatar/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="密码"
                show-password
                clearable
            >
              <template #prefix>
                <el-icon>
                  <lock/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password2">
            <el-input
                v-model="registerForm.password2"
                type="password"
                placeholder="确认密码"
                show-password
                clearable
            >
              <template #prefix>
                <el-icon>
                  <lock/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
                type="primary"
                native-type="submit"
                :loading="isSubmitting"
                class="submit-btn"
            >
              注册
            </el-button>
          </el-form-item>

          <p class="forget">
            已有账号 ? <a href="#" @click.prevent="goToOther(false)">登录</a>
          </p>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  position: relative;
  z-index: 1;
}

.container {
  position: relative;
  width: 400px;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.form {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 40px;
}

.form h2 {
  position: relative;
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 40px;
}

.form h2::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 80px;
  height: 4px;
  background: #fff;
  transition: all 0.3s ease;
}

.form:hover h2::before {
  width: 120px;
}

:deep(.el-form-item) {
  margin-bottom: 25px;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
  border-radius: 35px !important;
  padding: 2px 15px !important;
}

:deep(.el-input__inner) {
  color: #fff !important;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.8) !important;
}

:deep(.el-input__prefix) {
  color: rgba(255, 255, 255, 0.8) !important;
  margin-right: 8px;
}

.submit-btn {
  width: 100%;
  border-radius: 35px !important;
  background: #fff !important;
  color: #666 !important;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none !important;
}

.submit-btn:hover {
  background: #f1f1f1 !important;
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.1);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.forget {
  margin-top: 5px;
  color: #fff;
  text-align: center;
}

.forget a {
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.forget a:hover {
  text-decoration: underline;
  color: #f1f1f1;
}
</style>
