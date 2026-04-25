<template>
  <div class="main">
    <MainAsideLayout
        :show-left-aside="showLeft"
        :show-right-aside="showRight"
    >
      <template #left>
        <div v-if="leftNav === 'Vector'">
          <VectorTopBar
              class="vector-bar"
          ></VectorTopBar>
          <VectorCardList
              class="vector-list"
              @showFile="showFile"
          ></VectorCardList>
        </div>
        <div v-else-if="leftNav === 'Document'">
          <CardList
              class="card-list"
              :documents="chatStore.searchingVectors"
              @showFile="showDoc"
          ></CardList>
        </div>

      </template>

      <template #main>
        <Chat
            class="chat"
        ></Chat>
        <Input
            class="input"
            @showDocument="showDocument"
            @showVector="showVector"
        ></Input>
      </template>

      <template #right>
        <File
            class="file"
            :url="fileInfo.url"
            :name="fileInfo.name"
            :page="Number(fileInfo.page)"
            :bbox="fileInfo.bbox"
            @close="closeR"
        />
      </template>
    </MainAsideLayout>
  </div>
</template>

<script setup lang="ts">
import VectorCardList from "@/views/Chat/com/VectorCardList.vue";
import VectorTopBar from "@/views/Chat/com/VectorTopBar.vue";
import {onMounted, ref} from "vue";
import MainAsideLayout from "@/components/MainAsideLayout.vue";
import Input from "./com/Input.vue";
import Chat from "./com/Chat.vue";
import File from "@/components/File.vue";
import type {Knowledge} from "@/types/entity/Knowledge";
import type {Document} from "@/types/entity/Document";
import CardList from "@/views/Search/com/CardList.vue";
import {useAiChatStore, useAgentStore} from "@/stores";

const chatStore = useAiChatStore()
const agentStore = useAgentStore()

const showLeft = ref<boolean>(false)
const showRight = ref<boolean>(false)
const leftNav = ref<'Vector' | 'Document' | 'Close'>('Close')

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



const showFile = (doc: Knowledge) => {
  fileInfo.value.name = doc.name
  fileInfo.value.url = doc.path
  fileInfo.value.page = 0
  fileInfo.value.bbox = []
  showRight.value = true
}

const showDoc = (doc: Document) => {
  fileInfo.value.name = doc.metadata.name
  fileInfo.value.url = doc.metadata.url
  fileInfo.value.page = doc.metadata.page
  fileInfo.value.bbox = JSON.parse(doc.metadata.bbox)

  showRight.value = true
}

const showVector = () => {
  if (showLeft.value && leftNav.value === 'Vector') {
    showLeft.value = false
    closeL()
  } else {
    showLeft.value = true
    leftNav.value = 'Vector'
  }

}

const showDocument = () => {
  if (showLeft.value && leftNav.value === 'Document') {
    showLeft.value = false
    closeL()
  } else {
    showLeft.value = true
    leftNav.value = 'Document'
  }
}

const closeL = () => {
  leftNav.value = 'Close'
}


const closeR = () => {
  showRight.value = false
}



const openPdf = async (id: string) => {
  const res = await chatStore.getDocById(id)
  showDoc( res.data[0])
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('document-id-link')) {
      const id = target.dataset["id"] || ''
      openPdf(id)
    }
  })
}

onMounted( async () => {
  // 读取agent
  const  s = localStorage.getItem('medrec_agent')
  if (s) {
    agentStore.usingAgent = JSON.parse(s)
  }
  await chatStore.loadChatHistory()

})

</script>

<style scoped>
.main {
  height: 100%;
  width: 100%;
}
.vector-list {
  height: 90%;
}

.vector-bar {
  height: 10%;
}

.chat {
  height: 80%;
}

.input {
  height: 20%;
}

</style>