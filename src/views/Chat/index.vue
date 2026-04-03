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
            v-model:showRight="showRight"
            :url="fileInfo.url"
            :name="fileInfo.name"
            :page="fileInfo.page"
            @close="closeR"
        />
      </template>
    </MainAsideLayout>
  </div>
</template>

<script setup lang="ts">
import VectorCardList from "@/views/Chat/com/VectorCardList.vue";
import VectorTopBar from "@/views/Chat/com/VectorTopBar.vue";
import {ref} from "vue";
import MainAsideLayout from "@/components/MainAsideLayout.vue";
import Input from "./com/Input.vue";
import Chat from "./com/Chat.vue";
import File from "@/components/File.vue";
import type {Knowledge} from "@/types/entity/Knowledge";
import type {Document} from "@/types/entity/Document";
import CardList from "@/views/Search/com/CardList.vue";
import {useAiChatStore} from "@/stores";

const chatStore = useAiChatStore()

const showLeft = ref<boolean>(false)
const showRight = ref<boolean>(false)
const leftNav = ref<'Vector' | 'Document' | 'Close'>('Close')

const fileInfo = ref({
  name: "",
  url: "",
  page: 1
})


const showFile = (doc: Knowledge) => {
  fileInfo.value.name = doc.name
  fileInfo.value.url = doc.path
  fileInfo.value.page = 0
  showRight.value = true
}

const showDoc = (doc: Document) => {
  fileInfo.value.name = doc.metadata.name
  fileInfo.value.url = doc.metadata.url
  fileInfo.value.page = doc.metadata.page
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
  fileInfo.value = {
    name: "",
    url: "",
    page: 1
  }
  showRight.value = false
}

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