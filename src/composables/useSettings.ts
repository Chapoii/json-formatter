import { ref, watch } from 'vue';

export interface JsonSettings {
  indentSize: number;
  fontSize: number;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

const STORAGE_KEY = 'json-formatter-settings';

const defaultSettings: JsonSettings = {
  indentSize: 2,
  fontSize: 14,
  theme: 'light',
  language: 'zh'
};

function loadSettings(): JsonSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return { ...defaultSettings };
}

const settings = ref<JsonSettings>(loadSettings());

watch(settings, (newSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
}, { deep: true });

export function useSettings() {
  const updateSettings = (partial: Partial<JsonSettings>) => {
    settings.value = { ...settings.value, ...partial };
  };

  const resetSettings = () => {
    settings.value = { ...defaultSettings };
  };

  return {
    settings,
    updateSettings,
    resetSettings
  };
}
