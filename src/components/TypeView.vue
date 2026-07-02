<script setup lang="ts">
import { computed } from 'vue';
import { getJsonType } from '../utils/json';

const props = defineProps<{
  data: any;
  fontSize?: number;
}>();

interface TypeItem {
  path: string;
  type: string;
  value: string;
}

function getTypeItems(obj: any, prefix: string = ''): TypeItem[] {
  const items: TypeItem[] = [];
  
  if (obj === null || obj === undefined) {
    return [{ path: prefix || '(root)', type: 'null', value: 'null' }];
  }
  
  if (typeof obj !== 'object') {
    return [{ path: prefix || '(root)', type: getJsonType(obj), value: String(obj) }];
  }
  
  if (Array.isArray(obj)) {
    items.push({ path: prefix || '(root)', type: `array[${obj.length}]`, value: '' });
    obj.forEach((item, index) => {
      const newPrefix = prefix ? `${prefix}[${index}]` : `[${index}]`;
      if (item !== null && typeof item === 'object') {
        items.push(...getTypeItems(item, newPrefix));
      } else {
        items.push({ path: newPrefix, type: getJsonType(item), value: formatValue(item) });
      }
    });
  } else {
    items.push({ path: prefix || '(root)', type: `object{${Object.keys(obj).length}}`, value: '' });
    Object.entries(obj).forEach(([key, value]) => {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      if (value !== null && typeof value === 'object') {
        items.push(...getTypeItems(value, newPrefix));
      } else {
        items.push({ path: newPrefix, type: getJsonType(value), value: formatValue(value) });
      }
    });
  }
  
  return items;
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    string: 'bg-green-100 text-green-700',
    number: 'bg-blue-100 text-blue-700',
    boolean: 'bg-orange-100 text-orange-700',
    null: 'bg-gray-100 text-gray-700',
  };
  if (type.startsWith('object')) return 'bg-purple-100 text-purple-700';
  if (type.startsWith('array')) return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-700';
}

const typeItems = computed(() => getTypeItems(props.data));
</script>

<template>
  <div class="type-view h-full w-full overflow-auto bg-white" :style="{ fontSize: `${fontSize || 14}px` }">
    <table v-if="typeItems.length > 0" class="w-full border-collapse text-left">
      <thead class="sticky top-0 z-10 bg-gray-50">
        <tr>
          <th class="border-b border-gray-200 px-4 py-2 font-medium text-gray-700 w-1/2">路径</th>
          <th class="border-b border-gray-200 px-4 py-2 font-medium text-gray-700 w-24">类型</th>
          <th class="border-b border-gray-200 px-4 py-2 font-medium text-gray-700">值</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in typeItems" :key="index" class="hover:bg-gray-50">
          <td class="border-b border-gray-100 px-4 py-2 font-mono text-gray-700">{{ item.path }}</td>
          <td class="border-b border-gray-100 px-4 py-2">
            <span :class="['inline-block rounded px-2 py-0.5 text-xs font-medium', getTypeColor(item.type)]">
              {{ item.type }}
            </span>
          </td>
          <td class="border-b border-gray-100 px-4 py-2 font-mono text-gray-600 truncate max-w-xs" :title="item.value">
            {{ item.value }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="flex h-full items-center justify-center text-gray-400">
      暂无数据
    </div>
  </div>
</template>

<style scoped>
.type-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
