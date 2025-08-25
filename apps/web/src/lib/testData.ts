import type Block from "@/lib/Editor/Block";

export type BlocksFile = {
  title?: string;
  blocks: Block[];
};

export const TEST_FILES = [
  { path: "/src/test-data/blocks-sample-1.json", name: "blocks-sample-1.json" },
  { path: "/src/test-data/blocks-sample-2.json", name: "blocks-sample-2.json" },
  { path: "/src/test-data/note-1.json", name: "note-1.json" },
  { path: "/src/test-data/note-2.json", name: "note-2.json" },
];

// Debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 600) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

const memory = new Map<string, string>();

function storageKey(path: string) {
  return `testfile:${path}`;
}

export async function listTestFiles() {
  return TEST_FILES;
}

export async function loadBlocksFile(path: string): Promise<BlocksFile> {
  // prefer local override
  const override = localStorage.getItem(storageKey(path)) ?? memory.get(path);
  const text = override ?? (await (await fetch(path)).text());
  return JSON.parse(text) as BlocksFile;
}

export const saveBlocksFileDebounced = debounce(
  (path: string, data: BlocksFile) => {
    const text = JSON.stringify(data, null, 2);
    memory.set(path, text);
    try {
      localStorage.setItem(storageKey(path), text);
    } catch {}
    console.log("[debounced save blocks]", path, data);

    // Try to persist to disk during dev via Vite middleware; ignore errors in prod
    fetch("/__dev/save-json", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path, text }),
    }).catch(() => {});
  },
  500,
);

export function getBlocksOverrideText(path: string): string | null {
  return localStorage.getItem(storageKey(path)) ?? memory.get(path) ?? null;
}

export function clearBlocksOverride(path: string) {
  memory.delete(path);
  try {
    localStorage.removeItem(storageKey(path));
  } catch {}
}

export function downloadBlocksJson(filename: string, data: BlocksFile) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
