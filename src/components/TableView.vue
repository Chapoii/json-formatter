<script setup lang="ts">
import { computed } from 'vue';
import { getJsonType } from '../utils/json';

const props = defineProps<{
  data: any;
  fontSize?: number;
}>();

const arrayData = computed(() => {
  if (Array.isArray(props.data)) {
    return props.data;
  }
  if (props.data && typeof props.data === 'object') {
    return [props.data];
  }
  return [];
});

const columns = computed(() => {
  if (arrayData.value.length === 0) return [];
  
  const allKeys = new Set<string>();
  arrayData.value.forEach(item => {
    if (item && typeof item === 'object') {
      Object.keys(item).forEach(key => allKeys.add(key));
    }
  });
  return Array.from(allKeys);
});

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    string: 'text-green-600',
    number: 'text-blue-600',
    boolean: 'text-orange-600',
    null: 'text-gray-500',
    object: 'text-purple-600',
    array: 'text-purple-600',
  };
  return colors[type] || 'text-gray-700';
}

function formatCell(value: any): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
</script>

<template>
  <div class="table-view h-full w-full overflow-auto bg-white" :style="{ fontSize: `${fontSize || 14}px` }">
    <table v-if="arrayData.length > 0" class="w-full border-collapse text-left">
      <thead class="sticky top-0 z-10 bg-gray-50">
        <tr>
          <th class="border-b border-gray-200 px-4 py-2 font-medium text-gray-700 w-12">#</th>
          <th
            v-for="col in columns"
            :key="col"
            class="border-b border-gray-200 px-4 py-2 font-medium text-gray-700"
          >
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in arrayData" :key="index" class="hover:bg-gray-50">
          <td class="border-b border-gray-100 px-4 py-2 text-gray-500">{{ index + 1 }}</td>
          <td
            v-for="col in columns"
            :key="col"
            class="border-b border-gray-100 px-4 py-2"
          >
            <span :class="getTypeColor(getJsonType(row?.[col]))">
              {{ formatCell(row?.[col]) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="flex h-full items-center justify-center text-gray-400">
      暂无数据或数据不是数组/对象格式
    </div>
  </div>
</template>

<style scoped>
.table-view {
  font-family: Menlo, Monaco, "Courier New", monospace;
}
</style>
