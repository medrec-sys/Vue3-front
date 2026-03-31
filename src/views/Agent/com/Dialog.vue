<template>
  <el-dialog
      v-model="dialogVisible"
      :title="isAddOrUpdate ? '添加向量库' : '向量库详情'"
      width="500px"
      @close="handleClose"
  >
    <el-form
        label-width="100px"
        label-position="left"
        border
        style="--el-form-border-color: var(--el-border-color-light);"
    >
      <el-form-item label="名称">
        <el-input v-model="localVectorData.name" placeholder="请输入名称" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="localVectorData.description" placeholder="暂无描述" />
      </el-form-item>

      <el-form-item label="系统提示词">
        <el-input v-model="localVectorData.prompt" placeholder="请输入系统提示词" />
      </el-form-item>
      <el-form-item label="温度参数">
        <el-input v-model="localVectorData.temperature" placeholder="请输入温度参数" />
      </el-form-item>
      <el-form-item label="最大消息数">
        <el-input v-model="localVectorData.maxMessage" placeholder="请输入最大消息数" />
      </el-form-item>
      <el-form-item label="TopK参数">
        <el-input v-model="localVectorData.topK" placeholder="请输入TopK参数" />
      </el-form-item>
      <el-form-item label="相似度阈值">
        <el-input v-model="localVectorData.similarity" placeholder="请输入相似度阈值" />
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
            v-model="localVectorData.createTime"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleSubmit">确认</el-button>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {ElMessage} from "element-plus";
import {useAgentStore} from "@/stores";
import type {Agent} from "@/types/entity/Agent";

const agentStore = useAgentStore()

// 接收父组件传入的数据
const props = defineProps<{
  modelValue: boolean  // 控制弹窗显示/隐藏
  data: Agent         // 向量数据
  isAddOrUpdate: boolean
}>()

// 发出事件给父组件
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 本地数据副本（避免直接修改 props）
const localVectorData = ref<Agent>({} as Agent)

// 弹窗显示状态（双向绑定用）
const dialogVisible = ref(false)

// 监听 props.modelValue 的变化，同步到 dialogVisible
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
}, { immediate: true })

// 监听 props.data 的变化，同步到本地数据
watch(() => props.data, (newData) => {
  if (newData) {
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
}

const handleSubmit = () => {
  if (props.isAddOrUpdate) {
    add()
  } else {
    update()
  }
  dialogVisible.value = false
  agentStore.fetchAgentPage()
}

const add = async () => {
  const res = await agentStore.createAgent(localVectorData.value)
  if (res.code === 1) {
    ElMessage.success('添加成功' as any)
  } else {
    ElMessage.error(res.message as any)
  }
}

const update = async () => {
  const res = await agentStore.updateAgent(localVectorData.value)
  if (res.code === 1) {
    ElMessage.success('更新成功' as any)
  } else {
    ElMessage.error(res.message as any)
  }
}
</script>