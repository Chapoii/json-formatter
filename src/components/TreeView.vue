<script setup lang="ts">
import TreeNode from './TreeNode.vue';

defineProps<{
  data: any;
  fontSize?: number;
}>();
</script>

<template>
  <div class="tree-view h-full w-full overflow-auto p-4 bg-white">
    <TreeNode v-if="data !== null && data !== undefined" :data="data" :is-last="true" :font-size="fontSize" />
    <div v-else class="text-gray-400 text-sm">暂无数据</div>
  </div>
</template>

<style scoped>
.tree-view {
  font-family: Menlo, Monaco, "Courier New", monospace;
}
</style>
