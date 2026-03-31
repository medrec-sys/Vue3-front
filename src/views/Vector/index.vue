<script setup lang="ts">
import {useVectorStore} from '@/stores'
import {onMounted, ref} from 'vue'
import CardList from "@/views/Vector/com/CardList.vue";
import Pagination from "@/components/Pagination.vue";
import TopBar from "@/views/Vector/com/TopBar.vue";
import Dialog from "@/views/Vector/com/Dialog.vue";
import type {Vector} from "@/types/entity/Vector";

const vectorStore = useVectorStore()

onMounted(() => {
      vectorStore.fetchVectorPage()
    }
)

const dialogVisible = ref(false)
const dialogVector = ref<Vector>({} as  Vector)
const isAddOrUpdate = ref(true)

const changePage = (page: number, size: number) => {
  vectorStore.pageQuery.pageNum = page
  vectorStore.pageQuery.pageSize = size
  vectorStore.fetchVectorPage()
}

const alert = (vector: Vector) => {
  dialogVisible.value =  true
  dialogVector.value = vector
  isAddOrUpdate.value = false
}

const add = () => {
  dialogVisible.value = true
  dialogVector.value = {} as Vector
  isAddOrUpdate.value = true
}

</script>

<template>
  <div class="main">
    <Dialog
        v-model:modelValue="dialogVisible"
        v-model:data="dialogVector"
        :isAddOrUpdate="isAddOrUpdate"
    />
    <TopBar
      @add="add"
    ></TopBar>
    <CardList
        class="card-list"
        :vectors="vectorStore.vectors"
        @alert="alert"
    ></CardList>
    <Pagination class="pagination"
                v-model:current="vectorStore.pageQuery.pageNum"
                v-model:page-size="vectorStore.pageQuery.pageSize"
                :total="vectorStore.total"
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