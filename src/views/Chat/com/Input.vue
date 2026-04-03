<script setup lang="ts">
import {Delete, Notebook, Promotion, FolderChecked} from "@element-plus/icons-vue";
import { ref } from "vue";
import {useAiChatStore, useAgentStore} from "@/stores";
import {ElMessage, ElMessageBox} from "element-plus";

const chatStore = useAiChatStore()
const agentStore = useAgentStore()

const userInput = ref('')

interface Emits {
  (e: 'showVector'): void;
  (e: 'showDocument'): void;
}

const emit = defineEmits<Emits>();


const clearChat = async () => {
  try {
    await ElMessageBox.confirm(
        `确定要清空聊天记录吗？`,
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
    const res = await chatStore.clearMessages(agentStore.usingAgent.id);
    if (res.code === 1) {
      ElMessage.success('清空成功' as any)
    } else {
      ElMessage.error(res.message as any)
    }
  } catch {
    // 用户取消删除，不做任何操作
  }}

const handleSendMessage = async () => {
  if (!userInput.value.trim()) {
    return
  }
  // 除去末尾的回车
  userInput.value = userInput.value.replace(/\n+$/, '')
  if (agentStore.usingAgent.id === undefined) {
    ElMessage.error('请选择一个智能体' as any)
    return
  }
  console.log('发送消息：', userInput.value)
  await chatStore.sendMessage(agentStore.usingAgent.id, userInput.value)
  await chatStore.loadChatHistory()
  await chatStore.getVectors()
  userInput.value = ''
}

const handleShowVector = () => {
  if (agentStore.usingAgent.name == null) {
    ElMessage.error('未选择Ai智能体' as any);
    return;
  }
  emit('showVector');
};

const showDocument = () => {
  emit('showDocument')
}
</script>

<template>
  <div class="chat-input-area">
    <div class="chat-actions">
      <el-button-group>
        <el-tooltip content="查看知识库" placement="top">
          <el-button :icon="Notebook" @click="handleShowVector"
                     :disabled="agentStore.usingAgent.id === undefined"/>
        </el-tooltip>
        <el-tooltip content="查看检索文档" placement="top">
          <el-button :icon="FolderChecked" @click="showDocument"
                     :disabled="agentStore.usingAgent.id === undefined || chatStore.isStreaming"/>
        </el-tooltip>
        <el-tooltip content="清除对话历史" placement="top">
          <el-button :icon="Delete" @click="clearChat"
                     :disabled="agentStore.usingAgent.id === undefined || chatStore.messages.length === 0 || chatStore.isStreaming"/>
        </el-tooltip>

      </el-button-group>
    </div>
    <div class="input-wrapper">
      <el-input
          v-model="userInput"
          type="textarea"
          :rows="3"
          :autosize="{ minRows: 3, maxRows: 6 }"
          placeholder="输入您的问题..."
          @keyup.enter.exact="handleSendMessage"
          :disabled="chatStore.isStreaming"
      />
      <el-button
          class="send-button"
          type="primary"
          :icon="Promotion"
          @click="handleSendMessage"
          :loading="chatStore.isStreaming"
          :disabled="agentStore.usingAgent.id === undefined || !userInput.trim() || chatStore.isStreaming"
      />
    </div>
  </div>
</template>

<style scoped>
.chat-input-area {
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px 20px 20px;
  backdrop-filter: blur(10px);
  position: relative;
}

.chat-actions {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-start;
}

.chat-actions :deep(.el-button-group) {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  overflow: hidden;
}

.chat-actions :deep(.el-button) {
  background: transparent;
  border: 1px solid #e4e7ed;
  color: #606266;
  transition: all 0.2s;
}

.chat-actions :deep(.el-button):hover:not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  transform: translateY(-1px);
}

.chat-actions :deep(.el-button):first-child:hover:not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.chat-actions :deep(.el-button):last-child:hover:not(:disabled) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.chat-actions :deep(.el-button):first-child {
  border-radius: 10px 0 0 10px;
}

.chat-actions :deep(.el-button):last-child {
  border-radius: 0 10px 10px 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.input-wrapper :deep(.el-textarea) {
  flex: 1;
}

.input-wrapper :deep(.el-textarea__inner) {
  border-radius: 20px;
  border: 1.5px solid #e4e7ed;
  padding: 12px 50px 12px 18px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  transition: all 0.3s;
  background: #fafbfc;
  font-family: inherit;
}

.input-wrapper :deep(.el-textarea__inner):hover {
  border-color: #c0c4cc;
  background: white;
}

.input-wrapper :deep(.el-textarea__inner):focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.send-button {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50% !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.send-button:hover:not(:disabled) {
  transform: scale(1.08) rotate(5deg);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.send-button:active:not(:disabled) {
  transform: scale(0.95);
}

.send-button :deep(.el-icon) {
  font-size: 18px;
}

.send-button.is-loading {
  background: linear-gradient(135deg, #a0aec0 0%, #cbd5e0 100%);
  box-shadow: none;
}

/* 当输入框有内容时的样式 */
.input-wrapper :deep(.el-textarea__inner):not(:placeholder-shown) {
  border-color: #667eea;
  background: white;
}

/* 禁用状态样式 */
.send-button:disabled {
  background: linear-gradient(135deg, #cbd5e0 0%, #e2e8f0 100%);
  box-shadow: none;
  transform: none;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-input-area {
    padding: 12px 16px 16px;
  }

  .input-wrapper :deep(.el-textarea__inner) {
    font-size: 13px;
    padding: 10px 46px 10px 14px;
  }

  .send-button {
    width: 32px;
    height: 32px;
    right: 10px;
    bottom: 10px;
  }

  .send-button :deep(.el-icon) {
    font-size: 16px;
  }
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 2px 12px rgba(102, 126, 234, 0.5);
  }
}

.send-button:active:not(:disabled) {
  animation: pulse 0.3s ease;
}

/* 美化滚动条 */
.input-wrapper :deep(.el-textarea__inner)::-webkit-scrollbar {
  width: 4px;
}

.input-wrapper :deep(.el-textarea__inner)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.input-wrapper :deep(.el-textarea__inner)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.input-wrapper :deep(.el-textarea__inner)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>