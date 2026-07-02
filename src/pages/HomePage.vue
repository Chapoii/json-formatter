<script setup lang="ts">
import { ref } from 'vue';
import Toolbar from '../components/Toolbar.vue';
import JsonEditor from '../components/JsonEditor.vue';
import JsonViewer from '../components/JsonViewer.vue';
import StatusBar from '../components/StatusBar.vue';
import { useJson } from '../composables/useJson';
import { useSettings } from '../composables/useSettings';

const {
  inputJson,
  viewMode,
  isValid,
  error,
  parsedData,
  formattedJson,
  stats,
  canUndo,
  canRedo,
  updateInput,
  format,
  minify,
  undo,
  redo,
  copyToClipboard,
  downloadJson,
  loadFromFile,
  clear,
  setViewMode
} = useJson();

const { settings, updateSettings } = useSettings();

const leftWidth = ref(50);
const isDragging = ref(false);

function handleEditorChange(value: string) {
  updateInput(value, false);
}

function handleFormat() {
  format(settings.value.indentSize);
}

function handleMinify() {
  minify();
}

async function handleCopy() {
  await copyToClipboard();
}

function handleDownload() {
  downloadJson();
}

async function handleUpload(file: File) {
  await loadFromFile(file);
}

function handleUndo() {
  undo();
}

function handleRedo() {
  redo();
}

function handleSearch() {
  // 搜索功能由 CodeMirror 内置支持（Ctrl+F）
  alert('使用 Ctrl+F (Mac: Cmd+F) 在编辑器中搜索');
}

function handleSettings() {
  alert('设置功能开发中...');
}

function handleClear() {
  clear();
}

function handleViewModeChange(mode: 'editor' | 'table' | 'tree' | 'type') {
  setViewMode(mode);
}

function handleIndentSizeChange(size: number) {
  updateSettings({ indentSize: size });
  if (isValid.value) {
    format(size);
  }
}

function handleFontSizeChange(size: number) {
  updateSettings({ fontSize: size });
}

function handleLanguageChange(lang: 'zh' | 'en') {
  updateSettings({ language: lang });
}

function startDrag(e: MouseEvent) {
  isDragging.value = true;
  e.preventDefault();
  
  const startX = e.clientX;
  const startWidth = leftWidth.value;
  const containerWidth = (e.currentTarget as HTMLElement).parentElement?.offsetWidth || window.innerWidth;
  
  function onMouseMove(ev: MouseEvent) {
    const delta = ev.clientX - startX;
    const newWidth = (startWidth + (delta / containerWidth) * 100);
    leftWidth.value = Math.max(20, Math.min(80, newWidth));
  }
  
  function onMouseUp() {
    isDragging.value = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}
</script>

<template>
  <div class="home-page flex h-screen flex-col bg-gray-100">
    <Toolbar
      :view-mode="viewMode"
      :can-undo="canUndo"
      :can-redo="canRedo"
      :is-valid="isValid"
      @format="handleFormat"
      @minify="handleMinify"
      @copy="handleCopy"
      @download="handleDownload"
      @upload="handleUpload"
      @undo="handleUndo"
      @redo="handleRedo"
      @search="handleSearch"
      @settings="handleSettings"
      @clear="handleClear"
      @view-mode-change="handleViewModeChange"
    />

    <div class="flex flex-1 overflow-hidden relative">
      <div
        class="border-r border-gray-200 bg-white"
        :style="{ width: `${leftWidth}%` }"
      >
        <div class="flex h-full flex-col">
          <div class="border-b border-gray-100 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50">
            输入
            <span v-if="error" class="ml-2 text-xs text-red-500">{{ error }}</span>
          </div>
          <div class="flex-1 overflow-hidden">
            <JsonEditor
              :model-value="inputJson"
              :font-size="settings.fontSize"
              :theme="settings.theme"
              @change="handleEditorChange"
            />
          </div>
        </div>
      </div>

      <div
        class="resizer w-1 cursor-col-resize bg-gray-200 hover:bg-blue-400 transition-colors flex-shrink-0"
        :class="{ 'bg-blue-500': isDragging }"
        @mousedown="startDrag"
      ></div>

      <div class="flex-1 bg-white overflow-hidden">
        <div class="flex h-full flex-col">
          <div class="border-b border-gray-100 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50">
            输出
            <span v-if="isValid" class="ml-2 text-xs text-green-600">✓ 有效 JSON</span>
            <span v-else class="ml-2 text-xs text-red-500">✗ 无效 JSON</span>
          </div>
          <div class="flex-1 overflow-hidden">
            <JsonViewer
              :view-mode="viewMode"
              :data="parsedData"
              :formatted-json="formattedJson"
              :font-size="settings.fontSize"
              :theme="settings.theme"
            />
          </div>
        </div>
      </div>
    </div>

    <StatusBar
      :lines="stats.lines"
      :chars="stats.chars"
      :keys="stats.keys"
      :depth="stats.depth"
      :indent-size="settings.indentSize"
      :font-size="settings.fontSize"
      :is-valid="isValid"
      :language="settings.language"
      @indent-size-change="handleIndentSizeChange"
      @font-size-change="handleFontSizeChange"
      @language-change="handleLanguageChange"
    />
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
