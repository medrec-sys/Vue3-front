<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useVectorStore, useKnowledgeStore} from "@/stores";
import type {VectorSearchArgs} from "@/types/dto/VectorSearchArgs";
import type {Document} from "@/types/entity/Document";
import { ElMessage } from "element-plus";
import CardList from "@/views/Search/com/CardList.vue";
import Input from "@/views/Search/com/Input.vue";
import MainAsideLayout from "@/components/MainAsideLayout.vue";
import File from "@/components/File.vue";
import KnowledgeList from "@/views/Search/com/KnowledgeList.vue";
import KnowledgeTopBar from "@/views/Search/com/KnowledgeTopBar.vue";
import type {Knowledge} from "@/types/entity/Knowledge";

const vectorStore = useVectorStore();
const knowledgeStore = useKnowledgeStore();



const search = async (args: VectorSearchArgs) => {
  ElMessage.info("正在查询..."  as any)
  const res = await vectorStore.search( args)
  if (res.code === 1) {
    vectorStore.documents = res.data
    ElMessage.success('检索成功' as any)
  } else {
    ElMessage.error(res.message as any)
  }
}

const showRight = ref(false);
const showLeft = ref(false);

interface FileInfo {
  name: string
  url: string
  page: number
  bbox: number[]
}

const fileInfo = ref<FileInfo>({
  name: "",
  url: "",
  page: 1,
  bbox: []
})

const showFile = (document: Document) => {
  fileInfo.value.name = document.metadata.name
  fileInfo.value.url = document.metadata.url
  fileInfo.value.page = document.metadata.page
  fileInfo.value.bbox =  JSON.parse(document.metadata.bbox)
  console.log(fileInfo)

  showRight.value = true
}

const showDoc = (doc: Knowledge) => {
  fileInfo.value.name = doc.name
  fileInfo.value.url = doc.path
  fileInfo.value.page = 0
  fileInfo.value.bbox = []
  showRight.value = true
}

const showKnowledge = () => {
  showLeft.value = !showLeft.value
}

const closeR = () => {
  showRight.value = false
}

// 加载知识库列表
const loadKnowledgeList = async () => {
  if (!vectorStore.searchingVector?.id) {
    return
  }

  knowledgeStore.pageQuery.query.vectorId = vectorStore.searchingVector.id
  await knowledgeStore.fetchKnowledgePage()
}


onMounted( async () => {
  // 读取vector
  const  s = localStorage.getItem('medrec_vector')
  if (s) {
    vectorStore.searchingVector = JSON.parse(s)
  }
  await loadKnowledgeList()

})
</script>

<template>
  <MainAsideLayout
      :show-right-aside="showRight"
      :show-left-aside="showLeft"
      @close="showRight = false"
  >
    <!-- 主页面 -->
    <template #main>
      <div class="main">
        <CardList
            class="card-list"
            :documents="vectorStore.documents"
            @showFile="showFile"
        ></CardList>

        <div  class="input">
          <Input
              @showKnowledge="showKnowledge"
              @search="search"
          />
        </div>
      </div>
    </template>

    <!-- 左侧页面 -->
    <template #left>
      <KnowledgeTopBar
        class="knowledge-bar"
      ></KnowledgeTopBar>
      <KnowledgeList
        class="knowledge-list"
        @showFile="showDoc"
      ></KnowledgeList>
    </template>

    <!-- 右侧页面 -->
    <template #right>
      <File
          class="file"
          :url=fileInfo.url
          :name=fileInfo.name
          :page="Number(fileInfo.page)"
          :bbox="fileInfo.bbox"
          @close="closeR"
      />
    </template>
  </MainAsideLayout>


</template>

<style scoped>
.knowledge-bar {
  height: 10%;
  width: 100%;
}

.knowledge-list {
  height: 90%;
  width: 100%;
}

.main {
  margin: auto;
  height: 100%;
  width: 100%;
}

.card-list {
  height: 80%;
}

.input {
  margin: 10px;
  box-sizing: border-box;
  height: 20%;
}

.file {
  height: 100%;
}

</style>