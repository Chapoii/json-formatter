<script setup lang="ts">
import JsonEditor from './JsonEditor.vue';
import TableView from './TableView.vue';
import TreeView from './TreeView.vue';
import TypeView from './TypeView.vue';

defineProps<{
  viewMode: 'editor' | 'table' | 'tree' | 'type';
  data: any;
  formattedJson: string;
  fontSize?: number;
  theme?: 'light' | 'dark';
}>();
</script>

<template>
  <div class="json-viewer h-full w-full overflow-hidden">
    <div v-show="viewMode === 'editor'" class="h-full">
      <JsonEditor
        :model-value="formattedJson"
        :font-size="fontSize"
        :theme="theme"
        :readonly="true"
        :show-line-numbers="true"
      />
    </div>
    <div v-show="viewMode === 'table'" class="h-full">
      <TableView :data="data" :font-size="fontSize" />
    </div>
    <div v-show="viewMode === 'tree'" class="h-full">
      <TreeView :data="data" :font-size="fontSize" />
    </div>
    <div v-show="viewMode === 'type'" class="h-full">
      <TypeView :data="data" :font-size="fontSize" />
    </div>
  </div>
</template>
