<template>
  <el-dialog
      :append-to-body="true"
      v-model="dialogVisible"
      :title="isAddOrUpdate ? '添加Agent' : 'Agent详情'"
      width="580px"
      class="agent-dialog"
      @close="handleClose"
  >
    <el-form
        ref="formRef"
        :model="localAgentData"
        :rules="formRules"
        label-width="110px"
        label-position="left"
        class="agent-form"
    >
      <el-form-item label="名称" prop="name">
        <el-input
            v-model="localAgentData.name"
            placeholder="请输入名称"
            clearable
            size="large"
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
            v-model="localAgentData.description"
            placeholder="请输入描述"
            type="textarea"
            :rows="2"
            clearable
            resize="none"
        />
      </el-form-item>

      <el-form-item label="系统提示词" prop="prompt">
        <el-input
            v-model="localAgentData.prompt"
            placeholder="请输入系统提示词"
            type="textarea"
            :rows="3"
            clearable
            resize="none"
        />
      </el-form-item>

      <el-form-item label="温度参数" prop="temperature">
        <div class="param-control">

          <el-slider
              v-model="localAgentData.temperature"
              :min="0"
              :max="1"
              :step="0.1"
              :precision="2"
              :show-tooltip="true"
              class="param-slider"
          />
        </div>
        <div class="form-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>范围：0-1，控制输出随机性 | 当前值：{{ localAgentData.temperature }}</span>
        </div>
      </el-form-item>

      <el-form-item label="最大消息数" prop="maxMessage">
        <div class="param-control">

          <el-slider
              v-model="localAgentData.maxMessage"
              :min="0"
              :max="100"
              :step="1"
              :show-tooltip="true"
              class="param-slider"
          />
        </div>
        <div class="form-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>范围：0-100，保留的对话历史消息数量 | 当前值：{{ localAgentData.maxMessage }}</span>
        </div>
      </el-form-item>

      <el-form-item label="TopK参数" prop="topK">
        <div class="param-control">

          <el-slider
              v-model="localAgentData.topK"
              :min="0"
              :max="100"
              :step="1"
              :show-tooltip="true"
              class="param-slider"
          />
        </div>
        <div class="form-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>范围：0-100，检索返回的文档数量 | 当前值：{{ localAgentData.topK }}</span>
        </div>
      </el-form-item>

      <el-form-item label="相似度阈值" prop="similarity">
        <div class="param-control">

          <el-slider
              v-model="localAgentData.similarity"
              :min="0"
              :max="1"
              :step="0.05"
              :precision="2"
              :show-tooltip="true"
              class="param-slider"
          />
        </div>
        <div class="form-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>范围：0-1，相似度过滤阈值 | 当前值：{{ localAgentData.similarity }}</span>
        </div>
      </el-form-item>

      <el-form-item label="创建时间" v-if="!isAddOrUpdate && localAgentData.createTime">
        <el-date-picker
            v-model="localAgentData.createTime"
            type="datetime"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            disabled
            style="width: 100%"
            size="large"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false" size="large">取消</el-button>
        <el-button type="primary" @click="handleSubmit" size="large">
          <el-icon><Check /></el-icon>
          <span>确认</span>
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {nextTick, reactive, ref, watch } from 'vue'
import {ElMessage, type FormInstance, type FormRules} from "element-plus"
import {InfoFilled, Check} from '@element-plus/icons-vue'
import {useAgentStore} from "@/stores"
import type {Agent} from "@/types/entity/Agent"

const agentStore = useAgentStore()

// 接收父组件传入的数据
const props = defineProps<{
  modelValue: boolean
  data: Agent
  isAddOrUpdate: boolean
}>()

// 发出事件给父组件
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const localAgentData = ref<Agent>({
  temperature: 0.8,
  maxMessage: 10,
  topK: 5,
  similarity: 0.8
} as Agent)

// 表单引用
const formRef = ref<FormInstance>()

// 弹窗显示状态
const dialogVisible = ref(false)

// 表单校验规则（保持不变）
const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' },
    { min: 1, max: 50, message: '名称长度1-50位', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '描述不能为空', trigger: 'blur' },
    { min: 1, max: 200, message: '描述长度1-200位', trigger: 'blur' }
  ],
  prompt: [
    { required: true, message: '提示词不能为空', trigger: 'blur' },
    { min: 1, max: 1000, message: '提示词长度1-1000位', trigger: 'blur' }
  ],
  temperature: [
    { required: true, message: '温度不能为空', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === undefined || value === null) {
          callback(new Error('温度不能为空'))
        } else if (value < 0 || value > 1) {
          callback(new Error('温度范围0-1'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  maxMessage: [
    { required: true, message: '最大历史消息数不能为空', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === undefined || value === null) {
          callback(new Error('最大历史消息数不能为空'))
        } else if (!Number.isInteger(value)) {
          callback(new Error('最大历史消息数必须为整数'))
        } else if (value < 0 || value > 100) {
          callback(new Error('最大历史消息数范围0-100'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  topK: [
    { required: true, message: '检索返回的文档数不能为空', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === undefined || value === null) {
          callback(new Error('检索返回的文档数不能为空'))
        } else if (!Number.isInteger(value)) {
          callback(new Error('检索返回的文档数必须为整数'))
        } else if (value < 0 || value > 100) {
          callback(new Error('检索返回的文档数范围0-100'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  similarity: [
    { required: true, message: '相似度不能为空', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === undefined || value === null) {
          callback(new Error('相似度不能为空'))
        } else if (value < 0 || value > 1) {
          callback(new Error('相似度范围0-1'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 监听 props.modelValue 的变化
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
}, { immediate: true })

// 监听 props.data 的变化
watch(() => props.data, (newData) => {
  if (newData && !props.isAddOrUpdate) {
    localAgentData.value = { ...newData }
  }
}, { immediate: true, deep: true })

// 监听 dialogVisible 的变化
watch(dialogVisible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  nextTick(() => {
    formRef.value?.clearValidate()
    formRef.value?.resetFields()
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (props.isAddOrUpdate) {
      await add()
    } else {
      await update()
    }

    dialogVisible.value = false
    await agentStore.fetchAgentPage()
  } catch (error) {
    ElMessage.warning('请填写完整信息' as any)
  }
}

const add = async () => {
  const res = await agentStore.createAgent(localAgentData.value)
  if (res.code === 1) {
    ElMessage.success('添加成功' as any)
  } else {
    ElMessage.error(res.message as any)
  }
}

const update = async () => {
  const res = await agentStore.updateAgent(localAgentData.value)
  if (res.code === 1) {
    ElMessage.success('更新成功' as any)
  } else {
    ElMessage.error(res.message as any)
  }
}
</script>

<style scoped lang="scss">


.agent-dialog {
  :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  :deep(.el-dialog__header) {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    .el-dialog__title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }

    .el-dialog__headerbtn {
      top: 20px;

      .el-dialog__close {
        color: white;
        font-size: 18px;

        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  :deep(.el-dialog__body) {
    padding: 24px;
    max-height: 60vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;

      &:hover {
        background: #a8a8a8;
      }
    }
  }

  :deep(.el-dialog__footer) {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
    background-color: #fafafa;
  }
}

.agent-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;

    .el-form-item__label {
      font-weight: 500;
      color: #2c3e50;
      font-size: 14px;
    }
  }

  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner) {
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #667eea;
      box-shadow: 0 0 0 1px rgba(102, 126, 234, 0.2);
    }

    &.is-focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
  }

  :deep(.el-input-number) {
    width: 100%;

    .el-input-number__decrease,
    .el-input-number__increase {
      background: #f5f5f5;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: #667eea;
        color: white;
      }
    }
  }
}

.param-control {
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;

  .param-input {
    width: 140px;
    flex-shrink: 0;
  }

  .param-slider {
    flex: 1;

    :deep(.el-slider__runway) {
      height: 4px;
      border-radius: 2px;

      .el-slider__bar {
        background: linear-gradient(90deg, #667eea, #764ba2);
        height: 4px;
      }

      .el-slider__button {
        width: 16px;
        height: 16px;
        border: 2px solid #667eea;
        background-color: white;
        transition: transform 0.2s ease;

        &:hover {
          transform: scale(1.2);
        }
      }
    }

    .el-slider__stop {
      background-color: #e4e7ed;
    }
  }
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 8px;
  padding: 6px 10px;
  background-color: #f5f7fa;
  border-radius: 6px;

  .el-icon {
    font-size: 14px;
    color: #667eea;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  :deep(.el-button) {
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 500;
    transition: all 0.3s ease;

    &.el-button--primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
    }

    .el-icon {
      margin-right: 6px;
    }
  }
}
</style>