<script setup lang="ts">
import {ref} from "vue";
import {useVectorStore} from "@/stores";
import type {VectorSearchArgs} from "@/types/dto/VectorSearchArgs";
import type {Document} from "@/types/entity/Document";
import { ElMessage } from "element-plus";
import CardList from "@/views/Search/com/CardList.vue";
import Input from "@/views/Search/com/Input.vue";
import MainAsideLayout from "@/components/MainAsideLayout.vue";
import File from "@/components/File.vue";

const vectorStore = useVectorStore();



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

const fileInfo = ref({
  name: "",
  url: "",
  page: 1
})

const showFile = (document: Document) => {
  fileInfo.value.name = document.metadata.name
  fileInfo.value.url = document.metadata.url
  fileInfo.value.page = document.metadata.page
  showRight.value = true
}

const close = () => {
  fileInfo.value = {
    name: "",
    url: "",
    page: 1
  }
  showRight.value = false
}


</script>

<template>
  <MainAsideLayout
      :show-aside="showRight"
      @close="showRight = false"
  >
    <!-- 左侧主页面 -->
    <template #main>
      <div class="main">
        <CardList
            class="card-list"
            :documents="vectorStore.documents"
            @showFile="showFile"
        ></CardList>

        <div  class="input">
          <Input
              @search="search"
          />
        </div>
      </div>
    </template>

    <!-- 右侧页面 -->
    <template #aside>
      <File
          class="file"
          v-model:showRight="showRight"
          :url="fileInfo.url"
          :name="fileInfo.name"
          :page="fileInfo.page"
          @close="close"
      />
    </template>
  </MainAsideLayout>


</template>

<style scoped>
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