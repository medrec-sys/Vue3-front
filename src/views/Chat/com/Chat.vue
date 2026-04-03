<script setup lang="ts">
import {useAiChatStore} from "@/stores";
import {Delete, ChatDotRound, UserFilled, WarningFilled, Loading, ChatLineSquare} from "@element-plus/icons-vue";
import {markDownIt} from "@/utils/tools";
import {ElMessage, ElMessageBox} from "element-plus";
import {onMounted} from "vue";

const chatStore = useAiChatStore()


// 格式化时间
const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString()
}

// 角色名称映射
const getRoleName = (type: string) => {
  const map: Record<string, string> = {
    'USER': '用户',
    'ASSISTANT': 'AI助手',
    'SYSTEM': '系统'
  }
  return map[type] || type
}


const handleDeleteMessage = async (messageId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条消息吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await chatStore.deleteChat(messageId)
    if (res.code !== 1) {
      ElMessage.error(res.message as any)
      return
    }
    ElMessage.success('消息删除成功' as any)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除消息失败' as any)
    }
  }
}

onMounted(async () => {
  await chatStore.loadChatHistory()
})

</script>

<template>
  <div ref="messagesContainer" class="chat-messages">
    <!-- 空状态 -->
    <div v-if="chatStore.messages.length === 0 && !chatStore.isStreaming" class="empty-state">
      <div class="empty-state-content">
        <div class="empty-state-icon">
          <el-icon :size="80">
            <ChatLineSquare />
          </el-icon>
        </div>
        <h3 class="empty-state-title">开始新的对话</h3>
        <p class="empty-state-description">
          在下方输入框中输入您的问题，AI 助手将为您提供智能回复
        </p>
      </div>
    </div>

    <!-- 消息列表 -->
    <template v-else>
      <div v-for="message in chatStore.messages" :key="message.id" class="message-item" :class="message.type">
        <div class="message-avatar">
          <el-avatar v-if="message.type === 'USER'" :icon="UserFilled"/>
          <el-avatar v-else-if="message.type === 'ASSISTANT'" :icon="ChatDotRound"/>
          <el-avatar v-else :icon="WarningFilled"/>
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-role">{{ getRoleName(message.type) }}</span>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            <el-tooltip
                content="删除"
                placement="top"
                :show-after="300"
                effect="dark"
            >
              <el-button
                  v-if="message.type !== 'SYSTEM'"
                  size="small"
                  style="border: none !important;"
                  :icon="Delete"
                  @click.stop="handleDeleteMessage(message.id)"
                  :disabled="chatStore.loading"

                  circle
              />
            </el-tooltip>
          </div>
          <div class="message-text" v-html=" markDownIt.render(message.content)"></div>
        </div>
      </div>
    </template>

    <!-- 加载状态 -->
    <div v-if="chatStore.isStreaming" class="loading-indicator">
      <el-icon class="is-loading">
        <Loading/>
      </el-icon>
      <span>AI 正在思考...</span>
    </div>
  </div>
</template>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  scroll-behavior: smooth;
}

/* 自定义滚动条 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  transition: background 0.3s;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 空状态样式 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  height: 100%;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state-content {
  text-align: center;
  max-width: 500px;
  padding: 40px 20px;
}

.empty-state-icon {
  margin-bottom: 24px;
  color: #cbd5e1;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-state-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-state-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 32px;
}

.suggestion-item .el-icon {
  font-size: 16px;
  color: #667eea;
}

/* 消息项 */
.message-item {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 头像样式 */
.message-avatar {
  flex-shrink: 0;
}

.message-avatar :deep(.el-avatar) {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.message-avatar :deep(.el-avatar):hover {
  transform: scale(1.05);
}

/* 用户头像特殊样式 */
.message-item.USER .message-avatar :deep(.el-avatar) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* 系统消息头像样式 */
.message-item.SYSTEM .message-avatar :deep(.el-avatar) {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

/* 消息内容 */
.message-content {
  flex: 1;
  max-width: 70%;
  min-width: 200px;
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  padding: 0 4px;
}

.message-role {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.message-time {
  font-size: 11px;
  color: #95a5a6;
  font-family: monospace;
}

/* 删除按钮 */
.message-header :deep(.el-button) {
  margin-left: auto;
  opacity: 0;
  transition: all 0.2s;
  background: transparent;
  color: #95a5a6;
}

.message-content:hover .message-header :deep(.el-button) {
  opacity: 1;
}

.message-header :deep(.el-button):hover {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  transform: scale(1.1);
}

/* 消息文本 */
.message-text {
  background: white;
  padding: 14px 18px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #2c3e50;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.message-text:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

/* 用户消息样式 */
.message-item.USER {
  flex-direction: row-reverse;
}

.message-item.USER .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-item.USER .message-header {
  flex-direction: row-reverse;
}

.message-item.USER .message-role {
  color: #f5576c;
}

.message-item.USER .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

/* AI助手消息样式 */
.message-item.ASSISTANT .message-text {
  background: white;
  border-bottom-left-radius: 4px;
}

.message-item.ASSISTANT .message-role {
  color: #667eea;
}

/* 系统消息样式 */
.message-item.SYSTEM .message-text {
  background: #fef3c7;
  color: #92400e;
  border-left: 3px solid #f59e0b;
  font-size: 13px;
}

.message-item.SYSTEM .message-role {
  color: #f59e0b;
}

/* Markdown 样式优化 */
.message-text :deep(p) {
  margin: 0 0 8px 0;
}

.message-text :deep(p:last-child) {
  margin-bottom: 0;
}

.message-text :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.message-text :deep(pre) {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.message-text :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.message-text :deep(blockquote) {
  border-left: 3px solid #667eea;
  padding-left: 12px;
  margin: 8px 0;
  color: #666;
}

.message-text :deep(a) {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.message-text :deep(a):hover {
  border-bottom-color: #667eea;
}

.message-text :deep(ul),
.message-text :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.message-text :deep(li) {
  margin: 4px 0;
}

.message-text :deep(h1),
.message-text :deep(h2),
.message-text :deep(h3) {
  margin: 12px 0 8px 0;
}

.message-text :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.message-text :deep(th),
.message-text :deep(td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.message-text :deep(th) {
  background: #f5f5f5;
}

/* 加载指示器 */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border-radius: 20px;
  width: fit-content;
  margin-top: 16px;
  color: #667eea;
  font-size: 13px;
  animation: pulse 1.5s ease-in-out infinite;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.loading-indicator :deep(.el-icon) {
  font-size: 18px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-messages {
    padding: 12px;
  }

  .message-content {
    max-width: 85%;
  }

  .message-text {
    padding: 10px 14px;
    font-size: 13px;
  }

  .message-avatar :deep(.el-avatar) {
    width: 36px;
    height: 36px;
  }

  .empty-state {
    min-height: 400px;
  }

  .empty-state-title {
    font-size: 20px;
  }
}
</style>