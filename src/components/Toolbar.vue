<script setup lang="ts">
import {
  Play,
  Minimize2,
  Copy,
  Download,
  Upload,
  Undo2,
  Redo2,
  Search,
  Settings,
  Trash2,
  FileJson,
  Table,
  GitBranch,
  Type
} from 'lucide-vue-next';
import { ref } from 'vue';

const props = defineProps<{
  viewMode: 'editor' | 'table' | 'tree' | 'type';
  canUndo: boolean;
  canRedo: boolean;
  isValid: boolean;
}>();

const emit = defineEmits<{
  'format': [];
  'minify': [];
  'copy': [];
  'download': [];
  'upload': [file: File];
  'undo': [];
  'redo': [];
  'search': [];
  'settings': [];
  'clear': [];
  'viewModeChange': [mode: 'editor' | 'table' | 'tree' | 'type'];
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const copySuccess = ref(false);

const viewTabs = [
  { key: 'editor', label: '编辑器', icon: FileJson },
  { key: 'table', label: '表格', icon: Table },
  { key: 'tree', label: '树形', icon: GitBranch },
  { key: 'type', label: '类型', icon: Type },
] as const;

function handleUploadClick() {
  fileInputRef.value?.click();
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    emit('upload', file);
  }
  input.value = '';
}

function handleCopy() {
  emit('copy');
  copySuccess.value = true;
  setTimeout(() => {
    copySuccess.value = false;
  }, 2000);
}
</script>

<template>
  <div class="toolbar flex items-center justify-between border-b border-gray-200 bg-white px-2 py-1.5">
    <div class="flex items-center gap-1">
      <div class="flex items-center rounded-md bg-gray-100 p-0.5">
        <button
          v-for="tab in viewTabs"
          :key="tab.key"
          @click="emit('viewModeChange', tab.key)"
          :class="[
            'flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors',
            viewMode === tab.key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          <component :is="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
        </button>
      </div>

      <div class="mx-2 h-5 w-px bg-gray-200"></div>

      <button
        @click="emit('format')"
        :disabled="!isValid"
        class="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        title="格式化"
      >
        <Play class="h-4 w-4" />
      </button>

      <button
        @click="emit('minify')"
        :disabled="!isValid"
        class="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        title="压缩"
      >
        <Minimize2 class="h-4 w-4" />
      </button>

      <div class="mx-1 h-5 w-px bg-gray-200"></div>

      <button
        @click="handleCopy"
        class="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
        :title="copySuccess ? '已复制' : '复制'"
      >
        <Copy v-if="!copySuccess" class="h-4 w-4" />
        <svg v-else class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <button
        @click="emit('download')"
        :disabled="!isValid"
        class="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        title="下载"
      >
        <Download class="h-4 w-4" />
      </button>

      <button
        @click="handleUploadClick"
        class="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
        title="上传"
      >
        <Upload class="h-4 w-4" />
      </button>
      <input
        ref="fileInputRef"
        type="file"
        accept=".json,.txt"
        class="hidden"
        @change="handleFileChange"
      />

      <div class="mx-1 h-5 w-px bg-gray-200"></div>

      <button
        @click="emit('undo')"
        :disabled="!canUndo"
        class="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        title="撤销"
      >
        <Undo2 class="h-4 w-4" />
      </button>

      <button
        @click="emit('redo')"
        :disabled="!canRedo"
        class="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        title="重做"
      >
        <Redo2 class="h-4 w-4" />
      </button>

      <div class="mx-1 h-5 w-px bg-gray-200"></div>

      <button
        @click="emit('search')"
        class="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
        title="搜索"
      >
        <Search class="h-4 w-4" />
      </button>

      <button
        @click="emit('clear')"
        class="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
        title="清空"
      >
        <Trash2 class="h-4 w-4" />
      </button>
    </div>

    <div class="flex items-center gap-1">
      <button
        @click="emit('settings')"
        class="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
        title="设置"
      >
        <Settings class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
