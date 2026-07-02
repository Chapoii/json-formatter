<script setup lang="ts">
import { Settings, Globe } from 'lucide-vue-next';

defineProps<{
  lines: number;
  chars: number;
  keys: number;
  depth: number;
  indentSize: number;
  fontSize: number;
  isValid: boolean;
  language: 'zh' | 'en';
}>();

const emit = defineEmits<{
  'indentSizeChange': [size: number];
  'fontSizeChange': [size: number];
  'languageChange': [lang: 'zh' | 'en'];
}>();
</script>

<template>
  <div class="statusbar flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-1 text-xs text-gray-500">
    <div class="flex items-center gap-4">
      <span v-if="isValid" class="text-green-600">
        <span class="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
        有效 JSON
      </span>
      <span v-else class="text-red-600">
        <span class="inline-block h-2 w-2 rounded-full bg-red-500 mr-1"></span>
        无效 JSON
      </span>
      <span>行: {{ lines }}</span>
      <span>字符: {{ chars }}</span>
      <span v-if="isValid">键: {{ keys }}</span>
      <span v-if="isValid">深度: {{ depth }}</span>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-1">
        <Globe class="h-3.5 w-3.5" />
        <select
          :value="language"
          @change="emit('languageChange', ($event.target as HTMLSelectElement).value as 'zh' | 'en')"
          class="border-0 bg-transparent text-xs text-gray-500 focus:outline-none cursor-pointer"
        >
          <option value="zh">简体中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <div class="flex items-center gap-1">
        <span>{{ fontSize }} px</span>
        <input
          type="range"
          :value="fontSize"
          @input="emit('fontSizeChange', Number(($event.target as HTMLInputElement).value))"
          min="10"
          max="24"
          class="w-16 h-1 accent-blue-500"
        />
      </div>

      <div class="flex items-center gap-1">
        <span>{{ indentSize }} 空格</span>
        <select
          :value="indentSize"
          @change="emit('indentSizeChange', Number(($event.target as HTMLSelectElement).value))"
          class="border-0 bg-transparent text-xs text-gray-500 focus:outline-none cursor-pointer"
        >
          <option :value="2">2</option>
          <option :value="4">4</option>
          <option :value="8">Tab</option>
        </select>
      </div>

      <Settings class="h-3.5 w-3.5" />
    </div>
  </div>
</template>
