"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  defaultContent,
  type ContentFile,
  type CVData,
  type Language,
  type ThemeSettings,
} from "@/lib/cv";
import type { DeploymentStatus } from "@/lib/vercel";

export type CVDraft = Record<Language, CVData>;

export type ListSection =
  | "skills"
  | "experiences"
  | "education"
  | "certificates"
  | "languages";

type DraftItem = string | Record<string, unknown>;

export type LoadStatus =
  | { kind: "loading" }
  | { kind: "ready"; source: "github" | "bundle" }
  | { kind: "error"; message: string };

export type PublishState =
  | { kind: "idle" }
  | { kind: "saving" }
  | {
      kind: "saved";
      commitSha: string;
      deployment: DeploymentStatus | null;
    }
  | { kind: "conflict"; message: string }
  | { kind: "failed"; message: string };

export interface PublishResult {
  ok: boolean;
  sha?: string;
  commitSha?: string;
  deployment?: DeploymentStatus | null;
  error?: string;
}

export interface DraftContextValue {
  draft: CVDraft;
  theme: ThemeSettings;
  sha: string | null;
  dirty: boolean;
  loadStatus: LoadStatus;
  publishState: PublishState;
  lastSavedAt: string | null;
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
  resetTheme: () => void;
  publish: () => Promise<PublishResult>;
  checkDeployment: () => Promise<void>;
  refresh: () => Promise<void>;
  discardAndReload: () => Promise<void>;
}

const DraftContext = createContext<DraftContextValue | null>(null);

function cloneDefaults(): ContentFile {
  return structuredClone(defaultContent);
}

function cloneContent(content: ContentFile): ContentFile {
  return structuredClone(content);
}

function listOf(section: ListSection, data: CVData): DraftItem[] {
  return data[section] as DraftItem[];
}

export function DraftProvider({ children }: { children: ReactNode }) {
  const [content, initContent] = useState<ContentFile | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>({
    kind: "loading",
  });
  const [publishState, setPublishState] = useState<PublishState>({
    kind: "idle",
  });
  const [lastConfirmed, setLastConfirmed] = useState<ContentFile | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const contentRef = useRef<ContentFile | null>(null);
  const publishingRef = useRef(false);
  const publishNonceRef = useRef<string | null>(null);

  const applyContent = useCallback((next: ContentFile | null) => {
    contentRef.current = next;
    initContent(next);
  }, []);

  const dirty = useMemo(() => {
    if (!content || !lastConfirmed) return false;
    return JSON.stringify(content) !== JSON.stringify(lastConfirmed);
  }, [content, lastConfirmed]);


  const refresh = useCallback(async () => {
    setLoadStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/cv", { cache: "no-store" });
      if (!res.ok) {
        let message = `Gagal memuat konten dari server (HTTP ${res.status}).`;
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
        }
        setLoadStatus({ kind: "error", message });
        return;
      }
      const data = (await res.json()) as {
        ok: boolean;
        content?: ContentFile;
        sha?: string | null;
        source?: "github" | "bundle";
        warning?: string;
      };
      if (!data.content) {
        setLoadStatus({
          kind: "error",
          message: "Server tidak mengembalikan konten CV.",
        });
        return;
      }
      applyContent(cloneContent(data.content));
      setLastConfirmed(cloneContent(data.content));
      setSha(data.sha ?? null);
      setLastSavedAt(new Date().toISOString());
      setLoadStatus({
        kind: "ready",
        source: data.source ?? "github",
      });
      setPublishState({ kind: "idle" });
    } catch {
      setLoadStatus({
        kind: "error",
        message:
          "Tidak dapat menghubungi server. Muat ulang halaman untuk mencoba lagi.",
      });
    }
  }, [applyContent]);

  useEffect(() => {
    void refresh();
  }, [refresh]);


  const mutate = useCallback(
    (fn: (current: ContentFile) => ContentFile) => {
      const current = contentRef.current;
      if (!current) return;
      const next = fn(cloneContent(current));
      (contentRef.current as ContentFile) = next;
      initContent(next);
    },
    []
  );

  const updateLanguage = useCallback(
    (lang: Language, fn: (data: CVData) => CVData) => {
      mutate((current) => ({ ...current, [lang]: fn(current[lang]) }));
    },
    [mutate]
  );


  const publish = useCallback(async (): Promise<PublishResult> => {
    const current = contentRef.current;
    if (!current || publishingRef.current) {
      return { ok: false, error: "Konten belum dimuat." };
    }
    publishingRef.current = true;
    setPublishState({ kind: "saving" });
    try {
      const res = await fetch("/api/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: current, sha }),
        cache: "no-store",
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        sha?: string;
        commitSha?: string;
        deployment?: DeploymentStatus | null;
        conflict?: boolean;
        error?: string;
      };

      if (res.status === 409 || data.conflict) {
        setPublishState({
          kind: "conflict",
          message: data.error ?? "Konten di GitHub sudah berubah.",
        });
        return {
          ok: false,
          error: data.error ?? "Versi konten di GitHub sudah berubah.",
        };
      }
      if (!res.ok || !data.ok) {
        setPublishState({
          kind: "failed",
          message: data.error ?? `Gagal menyimpan (HTTP ${res.status}).`,
        });
        return {
          ok: false,
          error: data.error ?? `Gagal menyimpan (HTTP ${res.status}).`,
        };
      }

      setLastConfirmed(cloneContent(current));
      setSha(data.sha ?? sha);
      setLastSavedAt(new Date().toISOString());
      setPublishState({
        kind: "saved",
        commitSha: data.commitSha ?? data.sha ?? "",
        deployment: data.deployment ?? null,
      });
      return { ok: true, sha: data.sha, commitSha: data.commitSha, deployment: data.deployment };
    } catch {
      setPublishState({
        kind: "failed",
        message: "Gagal menghubungi server. Perubahan belum disimpan.",
      });
      return {
        ok: false,
        error: "Gagal menghubungi server. Perubahan belum disimpan.",
      };
    } finally {
      publishingRef.current = false;
    }
  }, [sha]);


  const checkDeployment = useCallback(async () => {
    if (
      publishState.kind !== "saved" ||
      !publishState.commitSha ||
      publishState.deployment?.state === "READY" ||
      publishState.deployment?.state === "ERROR" ||
      publishState.deployment?.state === "CANCELED"
    ) {
      return;
    }
    try {
      const res = await fetch(
        `/api/cv/deployment?sha=${encodeURIComponent(publishState.commitSha)}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const data = (await res.json()) as {
        ok?: boolean;
        deployment?: DeploymentStatus;
      };
      if (data.deployment) {
        setPublishState((prev) =>
          prev.kind === "saved"
            ? { ...prev, deployment: data.deployment ?? null }
            : prev
        );
      }
    } catch {
    }
  }, [publishState]);

  const startPolling = useCallback(() => {
    const key = `poll-${Date.now()}`;
    publishNonceRef.current = key;
    let attempts = 0;
    const timer = window.setInterval(async () => {
      attempts += 1;
      if (publishNonceRef.current !== key || attempts > 15) {
        window.clearInterval(timer);
        return;
      }
      await checkDeployment();
    }, 8000);
    return () => window.clearInterval(timer);
  }, [checkDeployment]);

  useEffect(() => {
    if (
      publishState.kind === "saved" &&
      publishState.deployment?.configured &&
      publishState.deployment.state !== "READY" &&
      publishState.deployment.state !== "ERROR" &&
      publishState.deployment.state !== "CANCELED"
    ) {
      const cleanup = startPolling();
      return cleanup;
    }
  }, [publishState, startPolling]);


  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);


  const value: DraftContextValue = {
    draft: { id: content?.id ?? cloneDefaults().id, en: content?.en ?? cloneDefaults().en },
    theme: content?.theme ?? cloneDefaults().theme,
    sha,
    dirty,
    loadStatus,
    publishState,
    lastSavedAt,

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
        const list = [...listOf(section, d)];
        list.push(item);
        return { ...d, [section]: list };
      }),

    setListItem: (lang, section, index, item) =>
      updateLanguage(lang, (d) => {
        const list = [...listOf(section, d)];
        const current = list[index];
        list[index] =
          typeof current === "string"
            ? (item as string)
            : ({ ...(current as object), ...(item as object) } as DraftItem);
        return { ...d, [section]: list };
      }),

    removeListItem: (lang, section, index) =>
      updateLanguage(lang, (d) => {
        const list = listOf(section, d).filter((_, i) => i !== index);
        return { ...d, [section]: list };
      }),

    moveItem: (lang, section, index, offset) =>
      updateLanguage(lang, (d) => {
        const list = [...listOf(section, d)];
        const target = index + offset;
        if (target < 0 || target >= list.length) return d;
        const [moved] = list.splice(index, 1);
        list.splice(target, 0, moved);
        return { ...d, [section]: list };
      }),

    setList: (lang, section, items) =>
      updateLanguage(lang, (d) => ({ ...d, [section]: items })),

    setTheme: (patch) => {
      mutate((current) => ({
        ...current,
        theme: { ...current.theme, ...patch },
      }));
    },

    applyPreset: (preset) => {
      mutate((current) => ({
        ...current,
        theme: { ...current.theme, ...preset },
      }));
    },

    resetTheme: () => {
      mutate((current) => ({
        ...current,
        theme: cloneDefaults().theme,
      }));
    },

    publish,
    checkDeployment,
    refresh,
    discardAndReload: refresh,
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
