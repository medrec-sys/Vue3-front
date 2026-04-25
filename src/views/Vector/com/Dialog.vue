<template>
  <el-dialog
      :append-to-body="true"
      v-model="dialogVisible"
      :title="isAddOrUpdate ? '添加向量库' : '向量库详情'"
      width="580px"
      class="vector-dialog"
      @close="handleClose"
  >
    <el-form
        ref="formRef"
        :model="localVectorData"
        :rules="formRules"
        label-width="100px"
        label-position="left"
        class="vector-form"
    >
      <el-form-item label="名称" prop="name">
        <el-input
            v-model="localVectorData.name"
            placeholder="请输入名称"
            clearable
            size="large"
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
            v-model="localVectorData.description"
            placeholder="请输入描述"
            type="textarea"
            :rows="2"
            clearable
            resize="none"
        />
      </el-form-item>

      <el-form-item label="维度" prop="dim">
        <div class="param-control">
          <el-slider
              v-model="localVectorData.dim"
              :min="512"
              :max="2048"
              :step="1"
              :show-tooltip="true"
              class="param-slider"
              :disabled="!isAddOrUpdate"
          />
        </div>
        <div class="form-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>范围：512-2048，向量维度大小 | 当前值：{{ localVectorData.dim }}</span>
          <span v-if="!isAddOrUpdate" style="color: #e6a23c; margin-left: 8px;">（创建后不可修改）</span>
        </div>
      </el-form-item>

      <el-form-item label="创建时间" v-if="!isAddOrUpdate && localVectorData.createTime">
        <el-date-picker
            v-model="localVectorData.createTime"
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
import { nextTick, reactive, ref, watch } from 'vue'
import type { Vector } from "@/types/entity/Vector"
import { ElMessage, type FormInstance, type FormRules } from "element-plus"
import { InfoFilled, Check } from '@element-plus/icons-vue'
import { useVectorStore } from "@/stores"

const vectorStore = useVectorStore()

// 接收父组件传入的数据
const props = defineProps<{
  modelValue: boolean
  data: Vector
  isAddOrUpdate: boolean
}>()

// 发出事件给父组件
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 本地数据副本
const localVectorData = ref<Vector>({
  dim: 1024
} as  Vector)

// 表单引用
const formRef = ref<FormInstance>()

// 弹窗显示状态
const dialogVisible = ref(false)

// 表单校验规则
const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' },
    { min: 1, max: 50, message: '名称长度1-50位', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '描述不能为空', trigger: 'blur' },
    { min: 1, max: 200, message: '描述长度1-200位', trigger: 'blur' }
  ],
  dim: [
    { required: true, message: '维度不能为空', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === undefined || value === null) {
          callback(new Error('维度不能为空'))
        } else if (!Number.isInteger(value)) {
          callback(new Error('维度必须为整数'))
        } else if (value < 512 || value > 2048) {
          callback(new Error('维度范围512-2048'))
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
  if (!newVal) {
    nextTick(() => {
      formRef.value?.clearValidate()
      formRef.value?.resetFields()
    })
  }
}, { immediate: true })

// 监听 props.data 的变化，同步到本地数据
watch(() => props.data, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    localVectorData.value = { ...newData }
  }
}, { immediate: true, deep: true })

// 监听 dialogVisible 的变化，同步到父组件
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
    await vectorStore.fetchVectorPage()
  } catch (error) {
    ElMessage.warning('请填写完整信息' as any)
  }
}

const add = async () => {
  // 移除不需要前端传递的字段
  const { id, indexName, prefix, createBy, createTime, ...submitData } = localVectorData.value
  const res = await vectorStore.createVector(submitData as Vector)
  if (res.code === 1) {
    ElMessage.success('添加成功' as any)
  } else {
    ElMessage.error(res.message || '添加失败' as any)
  }
}

const update = async () => {
  // 移除不需要更新的字段
  const { indexName, prefix, createBy, ...updateData } = localVectorData.value
  const res = await vectorStore.updateVector(updateData as Vector)
  if (res.code === 1) {
    ElMessage.success('更新成功' as any)
  } else {
    ElMessage.error(res.message || '更新失败' as any)
  }
}
</script>

<style scoped lang="scss">
.vector-dialog {
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

.vector-form {
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
}

.param-control {
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;

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