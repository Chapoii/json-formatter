import { ref, computed } from 'vue';
import { parseJson, formatJson, minifyJson, countJsonStats } from '../utils/json';

const sampleData = [
  {
    "ExchanRmbAmt": "10001.73",
    "Ccy": "USD",
    "AssetTp": "01",
    "AssetTotalAmt": "10001.73",
    "ExchanRmbAmtRate": 0.0026
  },
  {
    "ExchanRmbAmt": "3647164.97",
    "Ccy": "CNY",
    "AssetTp": "01",
    "AssetTotalAmt": "3647164.97",
    "ExchanRmbAmtRate": 0.9612
  },
  {
    "ExchanRmbAmt": "124317.24",
    "Ccy": "CNY",
    "AssetTp": "00",
    "AssetTotalAmt": "124317.24",
    "ExchanRmbAmtRate": 0.0328
  }
];

const inputJson = ref<string>(JSON.stringify(sampleData, null, 2));
const viewMode = ref<'editor' | 'table' | 'tree' | 'type'>('editor');
const history = ref<string[]>([inputJson.value]);
const historyIndex = ref<number>(0);

export function useJson() {
  const parseResult = computed(() => parseJson(inputJson.value));
  
  const isValid = computed(() => parseResult.value.success);
  const error = computed(() => parseResult.value.error);
  const parsedData = computed(() => parseResult.value.data);
  
  const formattedJson = computed(() => {
    if (!isValid.value) return '';
    return formatJson(parsedData.value, 2);
  });

  const stats = computed(() => {
    if (!isValid.value || parsedData.value === null) {
      return { keys: 0, values: 0, depth: 0, lines: 0, chars: inputJson.value.length };
    }
    const jsonStats = countJsonStats(parsedData.value);
    return {
      ...jsonStats,
      lines: inputJson.value.split('\n').length,
      chars: inputJson.value.length
    };
  });

  const updateInput = (value: string, recordHistory: boolean = true) => {
    inputJson.value = value;
    if (recordHistory) {
      if (historyIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, historyIndex.value + 1);
      }
      history.value.push(value);
      historyIndex.value = history.value.length - 1;
      if (history.value.length > 50) {
        history.value.shift();
        historyIndex.value--;
      }
    }
  };

  const format = (indentSize: number = 2) => {
    if (!isValid.value) return;
    const formatted = formatJson(parsedData.value, indentSize);
    updateInput(formatted);
  };

  const minify = () => {
    const minified = minifyJson(inputJson.value);
    updateInput(minified);
  };

  const undo = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      inputJson.value = history.value[historyIndex.value];
    }
  };

  const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++;
      inputJson.value = history.value[historyIndex.value];
    }
  };

  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);

  const copyToClipboard = async (text?: string) => {
    const content = text || formattedJson.value;
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch {
      return false;
    }
  };

  const downloadJson = (filename: string = 'data.json') => {
    const content = formattedJson.value || inputJson.value;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        updateInput(content);
        resolve(content);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const clear = () => {
    updateInput('');
  };

  const setViewMode = (mode: 'editor' | 'table' | 'tree' | 'type') => {
    viewMode.value = mode;
  };

  return {
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
  };
}
