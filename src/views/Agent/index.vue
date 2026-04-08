<script setup lang="ts">
import {useAgentStore} from '@/stores'
import {onMounted, ref} from 'vue'
import Pagination from "@/components/Pagination.vue";
import TopBar from "@/views/Agent/com/TopBar.vue";
import CardList from "@/views/Agent/com/CardList.vue";
import Dialog from "@/views/Agent/com/Dialog.vue";
import type {Agent} from "@/types/entity/Agent";

const agentStore = useAgentStore()

onMounted(() => {
      agentStore.fetchAgentPage()
    }
)

const dialogVisible = ref(false)
const dialogAgent = ref<Agent>({} as  Agent)
const isAddOrUpdate = ref(true)

const changePage = (page: number, size: number) => {
  agentStore.pageQuery.pageNum = page
  agentStore.pageQuery.pageSize = size
  agentStore.fetchAgentPage()
}

const alert = (agent: Agent) => {
  dialogVisible.value =  true
  dialogAgent.value = agent
  isAddOrUpdate.value = false
}

const add = () => {
  dialogVisible.value = true
  dialogAgent.value = {} as Agent
  isAddOrUpdate.value = true
}

</script>

<template>
  <div class="main">
    <Dialog
        class="agent-dialog"
        v-model:modelValue="dialogVisible"
        v-model:data="dialogAgent"
        :isAddOrUpdate="isAddOrUpdate"
    />
    <TopBar
      @add="add"
    ></TopBar>
    <CardList
        class="card-list"
        :agents="agentStore.agents"
        @alert="alert"
    ></CardList>
    <Pagination class="pagination"
                v-model:current="agentStore.pageQuery.pageNum"
                v-model:page-size="agentStore.pageQuery.pageSize"
                :total="agentStore.total"
                @change="changePage"
    />
  </div>
</template>

<style scoped>



.main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}


.card-list {
  flex: 1;
}

.pagination {
  width: 100%;
  height: 10%;
}
</style>