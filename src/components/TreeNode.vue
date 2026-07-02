<script setup lang="ts">
import { ref } from 'vue';
import { ChevronRight, ChevronDown } from 'lucide-vue-next';
import { getJsonType, escapeHtml } from '../utils/json';

const props = defineProps<{
  data: any;
  keyName?: string;
  isLast?: boolean;
  level?: number;
  fontSize?: number;
}>();

const expanded = ref(true);

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

function formatValue(value: any): string {
  const type = getJsonType(value);
  if (type === 'string') {
    return `"${escapeHtml(value)}"`;
  }
  if (type === 'null') {
    return 'null';
  }
  return String(value);
}

function isExpandable(value: any): boolean {
  return value !== null && typeof value === 'object';
}

function getEntries(value: any): [string, any][] {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index), item]);
  }
  return Object.entries(value);
}

function getBrackets(value: any): [string, string] {
  if (Array.isArray(value)) {
    return ['[', ']'];
  }
  return ['{', '}'];
}
</script>

<template>
  <div class="tree-node" :style="{ fontSize: `${fontSize || 14}px` }">
    <div class="flex items-start">
      <span
        v-if="isExpandable(data)"
        class="cursor-pointer select-none p-0.5 -ml-1 hover:bg-gray-100 rounded"
        @click="expanded = !expanded"
      >
        <ChevronDown v-if="expanded" class="h-3 w-3 text-gray-500" />
        <ChevronRight v-else class="h-3 w-3 text-gray-500" />
      </span>
      <span v-else class="inline-block w-4"></span>

      <div class="flex-1">
        <span v-if="keyName !== undefined" class="json-key">"{{ keyName }}"</span>
        <span v-if="keyName !== undefined" class="text-gray-500">: </span>

        <template v-if="isExpandable(data)">
          <span class="text-gray-500">{{ getBrackets(data)[0] }}</span>
          <span v-if="!expanded" class="text-gray-400 text-xs">
            {{ Array.isArray(data) ? data.length + ' items' : Object.keys(data).length + ' keys' }}
          </span>
          <span v-if="!expanded" class="text-gray-500">{{ getBrackets(data)[1] }}</span>
        </template>

        <template v-else>
          <span :class="getTypeColor(getJsonType(data))">{{ formatValue(data) }}</span>
          <span v-if="!isLast" class="text-gray-500">,</span>
        </template>
      </div>
    </div>

    <div v-if="isExpandable(data) && expanded" class="ml-4 border-l border-gray-200 pl-2">
      <TreeNode
        v-for="([k, v], index) in getEntries(data)"
        :key="k"
        :data="v"
        :key-name="k"
        :is-last="index === getEntries(data).length - 1"
        :level="(level || 0) + 1"
        :font-size="fontSize"
      />
    </div>

    <div v-if="isExpandable(data) && expanded" class="ml-0">
      <span class="text-gray-500">{{ getBrackets(data)[1] }}</span>
      <span v-if="!isLast" class="text-gray-500">,</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TreeNode'
});
</script>

<style scoped>
.json-key {
  color: #9333ea;
}
.tree-node {
  font-family: Menlo, Monaco, "Courier New", monospace;
  line-height: 1.6;
}
</style>
