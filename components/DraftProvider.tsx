"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  cvData,
  defaultTheme,
  type CVData,
  type Language,
  type ThemeSettings,
} from "@/lib/translations";

export type CVDraft = Record<Language, CVData>;

export type ListSection =
  | "skills"
  | "experiences"
  | "education"
  | "certificates"
  | "languages";

type DraftItem = string | Record<string, unknown>;

interface StoredData {
  id: CVData;
  en: CVData;
  theme: ThemeSettings;
}

const STORAGE_KEY = "cv-kreatif-v1";

let cache: StoredData | null = null;
const listeners = new Set<() => void>();

function defaults(): StoredData {
  return {
    id: { ...cvData.id },
    en: { ...cvData.en },
    theme: { ...defaultTheme },
  };
}

function loadStored(): StoredData | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id || !parsed.en) return null;
    return {
      id: { ...defaults().id, ...parsed.id },
      en: { ...defaults().en, ...parsed.en },
      theme: { ...defaults().theme, ...(parsed.theme ?? {}) },
    };
  } catch {
    return null;
  }
}

function getSnapshot(): StoredData {
  if (!cache) {
    cache = loadStored() ?? defaults();
  }
  return cache;
}

function getServerSnapshot(): StoredData {
  return defaults();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function commit(next: StoredData) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage may be unavailable; in-memory value still applies
  }
  listeners.forEach((cb) => cb());
}

async function saveToServer() {
  try {
    const res = await fetch("/api/cv", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getSnapshot()),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface DraftContextValue {
  draft: CVDraft;
  theme: ThemeSettings;
  setProfileField: (
    lang: Language,
    field: "name" | "headline",
    value: string
  ) => void;
  setContactField: (
    lang: Language,
    field: keyof CVData["contact"],
    value: string
  ) => void;
  setSummary: (lang: Language, value: string) => void;
  addListItem: (lang: Language, section: ListSection, item: DraftItem) => void;
  setListItem: (
    lang: Language,
    section: ListSection,
    index: number,
    item: DraftItem
  ) => void;
  removeListItem: (lang: Language, section: ListSection, index: number) => void;
  moveItem: (
    lang: Language,
    section: ListSection,
    index: number,
    offset: -1 | 1
  ) => void;
  setList: (lang: Language, section: ListSection, items: DraftItem[]) => void;
  setTheme: (patch: Partial<ThemeSettings>) => void;
  applyPreset: (preset: Omit<ThemeSettings, "texture">) => void;
  resetAll: () => void;
  resetTheme: () => void;
  saveChanges: () => Promise<boolean>;
}

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cv");
        const server = await res.json();
        if (!cancelled && server?.id && server?.en) {
          commit({
            id: { ...defaults().id, ...server.id },
            en: { ...defaults().en, ...server.en },
            theme: { ...defaults().theme, ...(server.theme ?? {}) },
          });
        }
      } catch {
        // keep local cache on failure
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateLanguage = useCallback(
    (lang: Language, fn: (data: CVData) => CVData) => {
      const current = getSnapshot();
      commit({
        ...current,
        [lang]: fn(current[lang]),
      });
    },
    []
  );

  const setTheme = useCallback((patch: Partial<ThemeSettings>) => {
    const current = getSnapshot();
    commit({ ...current, theme: { ...current.theme, ...patch } });
  }, []);

  const saveChanges = useCallback(() => saveToServer(), []);

  const value: DraftContextValue = {
    draft: { id: stored.id, en: stored.en },
    theme: stored.theme,

    setProfileField: (lang, field, text) =>
      updateLanguage(lang, (d) => ({ ...d, [field]: text })),

    setContactField: (lang, field, text) =>
      updateLanguage(lang, (d) => ({
        ...d,
        contact: { ...d.contact, [field]: text },
      })),

    setSummary: (lang, text) =>
      updateLanguage(lang, (d) => ({ ...d, summary: text })),

    addListItem: (lang, section, item) =>
      updateLanguage(lang, (d) => {
        const list = [...(d[section] as DraftItem[])];
        list.push(item);
        return { ...d, [section]: list };
      }),

    setListItem: (lang, section, index, item) =>
      updateLanguage(lang, (d) => {
        const list = [...(d[section] as DraftItem[])];
        const current = list[index];
        list[index] =
          typeof current === "string"
            ? (item as string)
            : ({ ...(current as object), ...(item as object) } as DraftItem);
        return { ...d, [section]: list };
      }),

    removeListItem: (lang, section, index) =>
      updateLanguage(lang, (d) => {
        const list = (d[section] as DraftItem[]).filter(
          (_, i) => i !== index
        );
        return { ...d, [section]: list };
      }),

    moveItem: (lang, section, index, offset) =>
      updateLanguage(lang, (d) => {
        const list = [...(d[section] as DraftItem[])];
        const target = index + offset;
        if (target < 0 || target >= list.length) return d;
        const [moved] = list.splice(index, 1);
        list.splice(target, 0, moved);
        return { ...d, [section]: list };
      }),

    setList: (lang, section, items) =>
      updateLanguage(lang, (d) => ({ ...d, [section]: items })),

    setTheme,

    applyPreset: (preset) => {
      const current = getSnapshot();
      commit({ ...current, theme: { ...current.theme, ...preset } });
    },

    resetAll: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      commit(defaults());
      void saveToServer();
    },

    resetTheme: () => {
      setTheme(defaultTheme);
      void saveToServer();
    },

    saveChanges,
  };

  return (
    <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
  );
}

export function useDraft(): DraftContextValue {
  const ctx = useContext(DraftContext);
  if (!ctx) {
    throw new Error("useDraft must be used within DraftProvider");
  }
  return ctx;
}