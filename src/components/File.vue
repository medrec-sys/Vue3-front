<template>
  <div class="pdf-viewer">
    <!-- PDF 标题栏 - 固定在顶部 -->
    <div class="top-bar">
      <div class="bar-left">
        <el-button
            type="primary"
            @click="close"
            :icon="Close"
            round
            size="small"
            class="action-btn"
        />
        <el-button
            round
            type="primary"
            size="small"
            :icon="Download"
            @click="downloadPdf"
            class="action-btn"
        />
        <el-button
            round
            type="primary"
            size="small"
            :icon="Refresh"
            @click="refreshPdf"
            :loading="isRefreshing"
            class="action-btn"
        />
      </div>
      <div class="bar-center">
        <span class="pdf-name" :title="name">{{ name }}</span>
      </div>
      <div class="bar-right">
        <span class="page-info">第 {{ currentPage }} / {{ totalPages || '?' }} 页</span>
      </div>
    </div>

    <!-- PDF 渲染区域 - 虚拟滚动懒加载 -->
    <div class="pdf-container" ref="containerRef">
      <div
          v-if="loading"
          class="loading-container"
      >
        <div class="loading-content">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>正在加载PDF文档...</span>
        </div>
      </div>
      <div
          v-else
          v-for="num in pageNumbers"
          :key="num"
          class="pdf-page"
          :data-page="num"
      >
        <div v-if="visiblePages.has(num) || preloadPages.has(num)" class="pdf-viewer-wrapper" :ref="el => setPageWrapperRef(el, num)">
          <VuePdfEmbed
              :page="num"
              annotation-layer
              text-layer
              :scale="scale"
              :source="doc"
              @rendered="() => onPageRendered(num)"
          />
          <!-- 高亮区域叠加层 -->
          <div
              v-if="shouldShowHighlight(num)"
              class="highlight-overlay"
              :style="getHighlightStyle(num)"
          ></div>
        </div>
        <div v-else class="placeholder">
          <div class="placeholder-content">
            <el-icon><DocumentChecked /></el-icon>
            <span class="page-number">第 {{ num }} 页</span>
            <span class="loading-hint">滚动到此处自动加载</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Close, Download, DocumentChecked, Loading, Refresh } from "@element-plus/icons-vue";
import VuePdfEmbed, { useVuePdfEmbed } from 'vue-pdf-embed'
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import {FileUtils} from "@/utils/filrUtil";

const props = defineProps<{
  url: string
  name: string
  page?: number
  bbox?: number[] // [x, y, width, height] 或 [left, top, right, bottom] 取决于PDF坐标系统
}>()

interface Emits {
  (e: 'close'): void;
  (e: 'update:url', url: string): void;
  (e: 'update:name', name: string): void;
}

const emit = defineEmits<Emits>()

// PDF 相关状态
const totalPages = ref(0)
const currentPage = ref(props.page || 1)
const scale = ref(1.2)
const containerRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const isRefreshing = ref(false)

// 可视区域和预加载页码管理
const visiblePages = ref<Set<number>>(new Set())
const preloadPages = ref<Set<number>>(new Set())
const preloadCount = 1 // 前后预加载页数（共3页）

// 当前PDF源
const currentUrl = ref(props.url)
const currentName = ref(props.name)

// 存储每一页的wrapper元素引用
const pageWrappers = ref<Map<number, HTMLElement>>(new Map())
// 存储每一页的canvas元素引用（用于获取实际尺寸）
const pageCanvases = ref<Map<number, HTMLElement>>(new Map())
// 标记页面是否已渲染完成
const pageRendered = ref<Set<number>>(new Set())

// 使用 vue-pdf-embed 核心
const { doc } = useVuePdfEmbed({
  source: currentUrl,
})

// 动态生成页码数组
const pageNumbers = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

let observer: IntersectionObserver | null = null

// 判断是否应该显示高亮框
const shouldShowHighlight = (pageNum: number): boolean => {
  return props.bbox &&
      props.bbox.length >= 4 &&
      props.page === pageNum &&
      pageRendered.value.has(pageNum)
}

// 设置页面wrapper的引用
const setPageWrapperRef = (el: any, pageNum: number) => {
  if (el) {
    pageWrappers.value.set(pageNum, el)
  }
}

// 页面渲染完成后的回调
const onPageRendered = (pageNum: number) => {
  pageRendered.value.add(pageNum)

  // 如果当前页面需要显示高亮，等待下一帧确保DOM已更新
  if (props.page === pageNum && props.bbox) {
    nextTick(() => {
      // 强制重新计算高亮位置（确保wrapper尺寸已确定）
      updateHighlightPosition(pageNum)
    })
  }
}

// 获取高亮区域的样式
const getHighlightStyle = (pageNum: number) => {
  if (!props.bbox || props.bbox.length < 4) return {}

  const wrapper = pageWrappers.value.get(pageNum)
  if (!wrapper) return {}

  // bbox格式：[left, top, right, bottom] 千分数坐标（0-1000）
  // left: 左边距千分数，top: 上边距千分数，right: 右边距千分数，bottom: 下边距千分数
  const [left, top, right, bottom] = props.bbox

  // 转换为百分比坐标（0-100）
  const leftPercent = (left / 1000) * 100
  const topPercent = (top / 1000) * 100
  const widthPercent = ((right - left) / 1000) * 100
  const heightPercent = ((bottom - top) / 1000) * 100

  return {
    position: 'absolute',
    left: `${leftPercent}%`,
    top: `${topPercent}%`,
    width: `${widthPercent}%`,
    height: `${heightPercent}%`,
    border: '3px solid #ff0000',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    pointerEvents: 'none',
    zIndex: 10,
    boxSizing: 'border-box',
    borderRadius: '2px'
  }
}

// 更新高亮位置（当窗口大小改变或滚动时需要重新计算）
const updateHighlightPosition = (pageNum: number) => {
  if (props.page === pageNum && props.bbox) {
    // 强制更新高亮样式
    const style = getHighlightStyle(pageNum)
    // 触发重新渲染
    nextTick()
  }
}

// 监听滚动和窗口大小变化，更新高亮位置
const handleScrollOrResize = () => {
  if (props.page && props.bbox && pageRendered.value.has(props.page)) {
    updateHighlightPosition(props.page)
  }
}

// 重置所有状态
const resetPdfState = () => {
  // 重置页码相关状态
  totalPages.value = 0
  currentPage.value = 1
  visiblePages.value.clear()
  preloadPages.value.clear()
  pageRendered.value.clear()
  pageWrappers.value.clear()
  pageCanvases.value.clear()

  // 断开旧的观察器
  if (observer) {
    observer.disconnect()
    observer = null
  }

  // 滚动到顶部
  if (containerRef.value) {
    containerRef.value.scrollTop = 0
  }
}

// 刷新PDF文件
const refreshPdf = async () => {
  if (isRefreshing.value) return;

  isRefreshing.value = true;

  try {
    // 保存当前页码
    const savedPage = currentPage.value;

    // 重置所有状态
    resetPdfState();

    // 添加短暂延迟确保重置完成
    await nextTick();

    // 重新加载PDF - 通过重新设置URL来触发重新加载
    const originalUrl = currentUrl.value;
    const originalName = currentName.value;

    // 临时清空URL然后重新设置，强制重新加载
    currentUrl.value = '';
    await nextTick();

    // 恢复URL，触发重新加载
    currentUrl.value = originalUrl;
    currentName.value = originalName;

    // 触发更新事件
    emit('update:url', originalUrl);
    emit('update:name', originalName);

    // 如果有保存的页码，在PDF加载完成后滚动到该页
    if (savedPage > 0) {
      // 使用watch监听totalPages，当PDF加载完成后滚动
      const stopWatch = watch(totalPages, (newTotal) => {
        if (newTotal > 0 && savedPage <= newTotal) {
          nextTick(() => {
            scrollToPage(savedPage);
            stopWatch(); // 停止监听
          });
        }
      });
    }

    console.log('PDF刷新完成');
  } catch (error) {
    console.error('刷新PDF失败:', error);
  } finally {
    isRefreshing.value = false;
  }
}

// 切换PDF文件
const switchPdf = (newUrl: string, newName: string) => {
  if (newUrl === currentUrl.value && newName === currentName.value) {
    return // 相同文件，无需切换
  }

  loading.value = true
  resetPdfState()

  // 更新当前文件
  currentUrl.value = newUrl
  currentName.value = newName

  // 触发更新事件
  emit('update:url', newUrl)
  emit('update:name', newName)
}

// 监听外部props变化，实现动态切换
watch(() => props.url, (newUrl, oldUrl) => {
  if (newUrl !== oldUrl && newUrl !== currentUrl.value) {
    switchPdf(newUrl, props.name)
  }
})

watch(() => props.name, (newName) => {
  if (newName !== currentName.value) {
    currentName.value = newName
  }
})

const downloadPdf = () => {
  FileUtils.downloadFile(currentName.value, currentUrl.value)
};

// 设置交叉观察器
const setupObserver = () => {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const pageNum = Number(entry.target.dataset.page)
          if (!isNaN(pageNum)) {
            if (entry.isIntersecting) {
              // 更新当前页
              currentPage.value = pageNum
              // 添加到可见集合
              visiblePages.value.add(pageNum)

              // 预加载周边页面
              const toPreload: number[] = []
              for (let i = -preloadCount; i <= preloadCount; i++) {
                const preloadNum = pageNum + i
                if (preloadNum >= 1 && preloadNum <= totalPages.value) {
                  toPreload.push(preloadNum)
                }
              }
              toPreload.forEach(p => preloadPages.value.add(p))
            }
          }
        })
      },
      {
        root: containerRef.value,
        rootMargin: '150px',
        threshold: 0.1
      }
  )

  // 观察所有页面
  const pages = document.querySelectorAll('.pdf-page')
  pages.forEach(el => {
    observer?.observe(el)
  })
}

// 监听PDF加载完成
watch(doc, (pdf) => {
  if (pdf && pdf.numPages) {
    totalPages.value = pdf.numPages
    console.log('PDF加载完成，总页数:', totalPages.value)
    loading.value = false

    // 初始化可见页面（默认加载前3页）
    for (let i = 1; i <= Math.min(3, totalPages.value); i++) {
      visiblePages.value.add(i)
    }

    // 预加载后续页面
    for (let i = 1; i <= preloadCount + 1; i++) {
      if (i <= totalPages.value) preloadPages.value.add(i)
    }

    nextTick(() => {
      setupObserver()

      // 如果有指定的页码，滚动到该页
      if (props.page && props.page > 0) {
        scrollToPage(props.page)
      }
    })
  }
}, { immediate: true })

// 监听pageNumbers变化，重新设置观察器
watch(pageNumbers, () => {
  if (totalPages.value > 0) {
    nextTick(() => {
      setupObserver()
    })
  }
})

// 滚动到指定页码
const scrollToPage = (pageNum: number) => {
  const pageElement = document.querySelector(`.pdf-page[data-page='${pageNum}']`)
  if (pageElement && containerRef.value) {
    pageElement.scrollIntoView({ behavior: 'auto', block: 'start' })

    // 滚动后更新高亮位置
    nextTick(() => {
      if (props.page === pageNum && props.bbox) {
        updateHighlightPosition(pageNum)
      }
    })
  }
}

// 监听初始页码
watch(() => props.page, (newPage) => {
  if (newPage && totalPages.value > 0) {
    nextTick(() => {
      scrollToPage(newPage)
    })
  }
})

onMounted(() => {
  if (totalPages.value > 0) {
    setupObserver()
  }

  // 添加窗口大小变化监听
  window.addEventListener('resize', handleScrollOrResize)
  // 添加滚动监听
  containerRef.value?.addEventListener('scroll', handleScrollOrResize)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', handleScrollOrResize)
  containerRef.value?.removeEventListener('scroll', handleScrollOrResize)
})

const close = () => {
  emit('close')
}

// 暴露方法给父组件使用
defineExpose({
  switchPdf,
  resetPdfState,
  scrollToPage,
  refreshPdf
})

</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.pdf-viewer:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: rgba(102, 126, 234, 0.2);
}

/* 加载容器样式 */
.loading-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.loading-content {
  text-align: center;
  color: #667eea;
}

.loading-content .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: rotating 2s linear infinite;
}

.loading-content span {
  font-size: 14px;
  color: #64748b;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 顶部标题栏 - 固定在顶部 */
.top-bar {
  padding: 14px 18px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* 左侧按钮区域 */
.bar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* 中间文件名区域 */
.bar-center {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
}

/* 右侧页码区域 */
.bar-right {
  flex-shrink: 0;
}

.page-info {
  font-size: 13px;
  font-weight: 500;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

/* 优化按钮样式 */
.action-btn {
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-weight: 500;
  height: 30px;
  width: 35px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
}

.action-btn:active {
  transform: translateY(0);
}

/* 文件名样式 */
.pdf-name {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.3px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
  display: inline-block;
  padding: 4px 0;
  transition: color 0.2s ease;
}

.pdf-viewer:hover .pdf-name {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* PDF 容器 - 滚动区域 */
.pdf-container {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #eef2f6 0%, #f5f7fa 100%);
  overflow-y: auto;
}

/* 每一页的容器 */
.pdf-page {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  min-height: auto;
}

.pdf-viewer-wrapper {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pdf-viewer-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
}

/* 高亮覆盖层样式 */
.highlight-overlay {
  position: absolute;
  border: 3px solid #ff0000;
  background-color: rgba(255, 0, 0, 0.1);
  pointer-events: none;
  z-index: 10;
  box-sizing: border-box;
  border-radius: 4px;
  animation: highlight-pulse 1.5s ease-in-out;
}

@keyframes highlight-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}

/* 占位符样式 */
.placeholder {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  min-height: 400px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e1;
  transition: all 0.2s ease;
}

.placeholder:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
}

.placeholder-content {
  text-align: center;
  color: #94a3b8;
}

.placeholder-content .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
  color: #cbd5e1;
}

.page-number {
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin: 8px 0;
  color: #64748b;
}

.loading-hint {
  font-size: 12px;
  color: #94a3b8;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .pdf-viewer {
    border-radius: 14px;
  }

  .top-bar {
    padding: 12px 14px;
    gap: 12px;
  }

  .pdf-name {
    font-size: 14px;
    max-width: 180px;
  }

  .page-info {
    font-size: 11px;
    padding: 3px 10px;
  }

  .action-btn {
    padding: 8px;
    min-width: 32px;
  }

  .pdf-container {
    padding: 12px;
  }

  .placeholder {
    min-height: 300px;
  }
}

@media (max-width: 480px) {
  .top-bar {
    padding: 10px 12px;
    gap: 10px;
  }

  .pdf-name {
    font-size: 13px;
    max-width: 140px;
  }

  .page-info {
    font-size: 10px;
    padding: 2px 8px;
  }

  .action-btn {
    padding: 6px;
    min-width: 28px;
  }

  .placeholder {
    min-height: 250px;
  }

  .placeholder-content .el-icon {
    font-size: 36px;
  }

  .page-number {
    font-size: 14px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .pdf-viewer {
    background: linear-gradient(135deg, #1e293b 0%, #172033 100%);
    border-color: rgba(102, 126, 234, 0.15);
  }

  .pdf-viewer:hover {
    background: linear-gradient(135deg, #2d3a4e 0%, #1e2a3a 100%);
    border-color: rgba(102, 126, 234, 0.3);
  }

  .top-bar {
    background: transparent;
    border-bottom-color: rgba(255, 255, 255, 0.05);
  }

  .pdf-name {
    color: #e5e7eb;
  }

  .page-info {
    background: rgba(102, 126, 234, 0.2);
    color: #a5b4fc;
  }

  .pdf-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }

  .placeholder {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-color: #334155;
  }

  .placeholder:hover {
    border-color: #667eea;
  }

  .placeholder-content {
    color: #64748b;
  }

  .page-number {
    color: #94a3b8;
  }
}

* {
  box-sizing: border-box;
}
</style>