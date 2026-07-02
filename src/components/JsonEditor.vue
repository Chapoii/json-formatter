<script setup lang="ts">
import { ref, onMounted, watch, shallowRef } from 'vue';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';

const props = defineProps<{
  modelValue: string;
  fontSize?: number;
  theme?: 'light' | 'dark';
  readonly?: boolean;
  showLineNumbers?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string];
}>();

const editorRef = ref<HTMLDivElement | null>(null);
const view = shallowRef<EditorView | null>(null);

const updateListener = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    const value = update.state.doc.toString();
    emit('update:modelValue', value);
    emit('change', value);
  }
});

const baseTheme = EditorView.baseTheme({
  '&': {
    height: '100%',
    fontSize: `${props.fontSize || 14}px`,
  },
  '.cm-scroller': {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    overflow: 'auto',
  },
  '.cm-content': {
    padding: '8px 0',
  },
  '.cm-gutters': {
    borderRight: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px',
    minWidth: '40px',
    textAlign: 'right',
    color: '#9ca3af',
  },
});

function createEditor() {
  if (!editorRef.value) return;

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      lineNumbers(),
      history(),
      json(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      highlightSelectionMatches(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
      ]),
      baseTheme,
      updateListener,
      EditorView.editable.of(!props.readonly),
      ...(props.theme === 'dark' ? [oneDark] : []),
    ],
  });

  view.value = new EditorView({
    state,
    parent: editorRef.value,
  });
}

function updateContent(value: string) {
  if (!view.value) return;
  const currentValue = view.value.state.doc.toString();
  if (currentValue !== value) {
    view.value.dispatch({
      changes: {
        from: 0,
        to: view.value.state.doc.length,
        insert: value,
      },
    });
  }
}

watch(() => props.modelValue, (newValue) => {
  updateContent(newValue);
});

watch(() => props.fontSize, (newSize) => {
  if (!view.value) return;
  view.value.dom.style.fontSize = `${newSize || 14}px`;
});

watch(() => props.theme, () => {
  if (view.value) {
    view.value.destroy();
    view.value = null;
    createEditor();
  }
});

onMounted(() => {
  createEditor();
});
</script>

<template>
  <div ref="editorRef" class="json-editor h-full w-full overflow-hidden"></div>
</template>

<style scoped>
.json-editor :deep(.cm-editor) {
  height: 100%;
}
</style>
