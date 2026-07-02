export interface JsonParseResult {
  success: boolean;
  data: any;
  error: string | null;
}

export function parseJson(text: string): JsonParseResult {
  if (!text.trim()) {
    return { success: true, data: null, error: null };
  }
  try {
    const data = JSON.parse(text);
    return { success: true, data, error: null };
  } catch (e: any) {
    return { success: false, data: null, error: e.message };
  }
}

export function formatJson(data: any, indentSize: number = 2): string {
  if (data === null || data === undefined) return '';
  try {
    return JSON.stringify(data, null, indentSize);
  } catch {
    return '';
  }
}

export function minifyJson(text: string): string {
  const result = parseJson(text);
  if (!result.success) return text;
  try {
    return JSON.stringify(result.data);
  } catch {
    return text;
  }
}

export function getJsonType(value: any): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

export function countJsonStats(data: any): { keys: number; values: number; depth: number } {
  let keys = 0;
  let values = 0;
  let maxDepth = 0;

  function traverse(obj: any, depth: number) {
    if (depth > maxDepth) maxDepth = depth;
    if (obj === null || typeof obj !== 'object') {
      values++;
      return;
    }
    if (Array.isArray(obj)) {
      values++;
      obj.forEach(item => traverse(item, depth + 1));
    } else {
      const keysList = Object.keys(obj);
      keys += keysList.length;
      keysList.forEach(key => {
        traverse(obj[key], depth + 1);
      });
    }
  }

  traverse(data, 0);
  return { keys, values, depth: maxDepth };
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function highlightJson(json: string): string {
  const result = parseJson(json);
  if (!result.success) {
    return escapeHtml(json);
  }
  
  let formatted = formatJson(result.data, 2);
  
  const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
  
  return formatted.replace(regex, (match) => {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'json-key';
      } else {
        cls = 'json-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return `<span class="${cls}">${match}</span>`;
  });
}
