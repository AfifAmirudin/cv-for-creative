"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import LanguageToggle from "@/components/LanguageToggle";
import {
  DraftProvider,
  useDraft,
  type LoadStatus,
  type PublishState,
} from "@/components/DraftProvider";
import {
  CertificatesEditor,
  EducationEditor,
  ExperienceEditor,
  LanguagesEditor,
  ProfileEditor,
  SkillsEditor,
  SummaryEditor,
} from "@/components/dashboard/editors";
import ThemeEditor from "@/components/dashboard/ThemeEditor";
import type { Language } from "@/lib/translations";

type Tab =
  | "profile"
  | "summary"
  | "skills"
  | "experience"
  | "education"
  | "certificates"
  | "languages"
  | "theme";

const TABS: { key: Tab; label: string }[] = [
  { key: "profile", label: "Profil" },
  { key: "summary", label: "Ringkasan" },
  { key: "skills", label: "Keahlian" },
  { key: "experience", label: "Pengalaman" },
  { key: "education", label: "Pendidikan" },
  { key: "certificates", label: "Sertifikasi" },
  { key: "languages", label: "Bahasa" },
  { key: "theme", label: "Tema & Desain" },
];

const LANG_NAME: Record<Language, string> = {
  id: "Indonesia",
  en: "Inggris",
};

function deploymentText(state: PublishState, dirty: boolean) {
  if (state.kind === "saving") {
    return {
      tone: "busy",
      text: "Menyimpan & memublikasikan ke GitHub…",
    };
  }
  if (state.kind === "saved") {
    const d = state.deployment;
    if (d && d.state === "READY") {
      return {
        tone: "ok",
        text: "Tersimpan ke GitHub ✓ — deployment Vercel selesai. CV publik sudah diperbarui.",
      };
    }
    if (d && (d.state === "ERROR" || d.state === "CANCELED")) {
      return {
        tone: "warn",
        text: `Tersimpan ke GitHub ✓ — deployment Vercel ${d.state === "ERROR" ? "gagal" : "dibatalkan"}. Periksa log deployment di Vercel.`,
      };
    }
    if (d) {
      return {
        tone: "warn",
        text:
          d.state === null
            ? "Tersimpan ke GitHub ✓ — deployment Vercel belum terlihat. Publikasi belum diverifikasi."
            : `Tersimpan ke GitHub ✓ — deployment Vercel sedang ${d.state.toLowerCase()}.`,
      };
    }
    return {
      tone: "warn",
      text: "Tersimpan ke GitHub ✓ — publikasi belum diverifikasi (verifikasi deployment tidak dikonfigurasi).",
    };
  }
  if (state.kind === "conflict") {
    return {
      tone: "error",
      text: "Konflik versi: konten di GitHub sudah diubah perangkat lain sejak dibuka. Muat versi terbaru untuk melanjutkan.",
    };
  }
  if (state.kind === "failed") {
    return { tone: "error", text: state.message };
  }
  if (dirty) {
    return {
      tone: "dirty",
      text: "Ada perubahan yang belum dipublikasikan ke GitHub.",
    };
  }
  return {
    tone: "idle",
    text: "Semua perubahan sudah dipublikasikan.",
  };
}

function PublishBar() {
  const { dirty, publishState, publish, checkDeployment, discardAndReload } =
    useDraft();
  const info = deploymentText(publishState, dirty);

  const tones: Record<string, string> = {
    ok: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warn: "border-amber-200 bg-amber-50 text-amber-800",
    error: "border-red-200 bg-red-50 text-red-800",
    dirty: "border-amber-200 bg-amber-50 text-amber-900",
    busy: "border-[#7c5cff]/30 bg-[#f2effa] text-[#5b4aa0]",
    idle: "border-[#e3def0] bg-white text-[#6b6678]",
  };

  const saving = publishState.kind === "saving";

  return (
    <div
      className={`flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${publishState.kind === "idle" ? "border-[#e3def0]" : "border-transparent"}`}
    >
      <div
        className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-[13px] leading-relaxed ${tones[info.tone]}`}
      >
        {info.tone === "busy" && (
          <span
            aria-hidden="true"
            className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-[#7c5cff] border-t-transparent"
          />
        )}
        {info.tone === "ok" && (
          <span aria-hidden="true" className="mt-0.5 shrink-0 leading-none text-emerald-600">
            ✓
          </span>
        )}
        <span>{info.text}</span>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {publishState.kind === "saved" && publishState.deployment && (
          <button
            type="button"
            onClick={() => void checkDeployment()}
            className="inline-flex h-9 items-center rounded-lg border border-[#e3def0] px-4 text-[13px] font-medium text-[#6d4fc4] transition hover:border-[#7c5cff]"
          >
            Periksa status
          </button>
        )}
        {publishState.kind === "conflict" && (
          <button
            type="button"
            onClick={() => void discardAndReload()}
            className="inline-flex h-9 items-center rounded-lg border border-red-200 px-4 text-[13px] font-medium text-[#c0392b] transition hover:bg-red-50"
          >
            Muat versi terbaru
          </button>
        )}
        {publishState.kind === "failed" && (
          <button
            type="button"
            disabled={saving}
            onClick={() => void publish()}
            className="inline-flex h-9 items-center rounded-lg border border-[#e3def0] px-4 text-[13px] font-medium text-[#6d4fc4] transition hover:border-[#7c5cff]"
          >
            Coba lagi
          </button>
        )}
        <button
          type="button"
          disabled={saving || !dirty}
          onClick={() => void publish()}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#7c5cff] px-6 text-[14px] font-semibold text-white shadow-sm transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
        >
          {saving ? (
            <>
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"
              />
              Menyimpan…
            </>
          ) : (
            <>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Simpan & Publikasikan
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2effa] px-4 font-sans">
      <div className="flex flex-col items-center gap-3 text-[#6b6678]">
        <span
          aria-hidden="true"
          className="h-6 w-6 animate-spin rounded-full border-2 border-[#7c5cff] border-t-transparent"
        />
        <p className="text-[13px]">Memuat konten terbaru dari GitHub…</p>
      </div>
    </div>
  );
}

function LoadErrorView({
  loadStatus,
  onRetry,
}: {
  loadStatus: Extract<LoadStatus, { kind: "error" }>;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2effa] px-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-[#f3d9d4] bg-white p-8 shadow-sm">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-[#c0392b]">
          Gagal Memuat
        </p>
        <h1 className="mt-2 font-display text-xl font-bold text-[#221b3d]">
          Data tidak dapat dimuat dari server
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6b6678]">
          {loadStatus.message} Periksa konfigurasi GitHub (GH_PAT, GH_REPO_OWNER,
          GH_REPO_NAME, GH_BRANCH) atau koneksi jaringan.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-[#221b3d] px-5 text-[13px] font-semibold text-white transition hover:opacity-90"
        >
          Muat ulang
        </button>
      </div>
    </div>
  );
}

function DashboardShell() {
  const [lang, setLang] = useState<Language>("id");
  const [active, setActive] = useState<Tab>("profile");
  const { theme, dirty, loadStatus, refresh } = useDraft();

  const confirmLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      dirty &&
      !window.confirm(
        "Ada perubahan yang belum dipublikasikan. Yakin ingin meninggalkan dashboard?"
      )
    ) {
      e.preventDefault();
    }
  };

  const confirmRefresh = () => {
    if (
      dirty &&
      !window.confirm(
        "Muat ulang akan membuang perubahan yang belum dipublikasikan. Lanjutkan?"
      )
    ) {
      return;
    }
    void refresh();
  };

  if (loadStatus.kind === "loading") return <LoadingView />;
  if (loadStatus.kind === "error")
    return <LoadErrorView loadStatus={loadStatus} onRetry={confirmRefresh} />;

  return (
    <div className="flex min-h-screen flex-col bg-[#f2effa] font-sans">
      <header className="border-b border-[#e3def0] bg-white">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-[#221b3d] sm:text-2xl">
              Dashboard CV Kreatif
            </h1>
            <p className="mt-0.5 text-[13px] text-[#9892a8]">
              Ubah data lewat &quot;Edit&quot;, lalu tekan &quot;Simpan &amp;
              Publikasikan&quot; untuk mengirim perubahan ke GitHub dan
              memicu deployment baru.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageToggle
              language={lang}
              onChange={setLang}
              label="Pilih bahasa yang akan diedit"
            />
            <button
              type="button"
              onClick={confirmRefresh}
              className="inline-flex h-9 items-center rounded-full border border-[#e3def0] bg-white px-4 text-[13px] font-medium text-[#6b6678] transition hover:border-[#7c5cff] hover:text-[#6d4fc4]"
            >
              Muat ulang
            </button>
            <Link
              href="/"
              onClick={confirmLeave}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e3def0] bg-white px-4 text-[13px] font-medium text-[#221b3d] transition hover:border-[#7c5cff] hover:text-[#6d4fc4]"
            >
              Lihat CV
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/dashboard" })}
              className="inline-flex h-9 items-center rounded-full border border-[#e3def0] bg-white px-4 text-[13px] font-medium text-[#6b6678] transition hover:border-[#f3d9d4] hover:text-[#c0392b]"
            >
              Keluar
            </button>
          </div>
        </div>
        <PublishBar />
      </header>

      <nav className="sticky top-0 z-10 border-b border-[#e3def0] bg-[#f2effa]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl gap-2 overflow-x-auto px-4 py-2.5">
          {TABS.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium transition ${
                  isActive
                    ? "bg-[#7c5cff] text-white shadow-sm"
                    : "bg-white text-[#6b6678] hover:text-[#221b3d]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-4xl px-4 py-6">
        <p className="mb-5 rounded-lg px-3 py-2.5 text-[13px] text-[#6d4fc4] ring-1 ring-[#7c5cff]/25 sm:px-4">
          {active === "theme"
            ? "Ubah tema di sini — pratinjau ikut berubah seketika. Publikasikan lewat tombol di atas."
            : `Sedang mengedit konten bahasa ${LANG_NAME[lang]}. Perubahan tampil setelah “Simpan & Publikasikan”.`}
        </p>

        {active === "profile" && <ProfileEditor lang={lang} />}
        {active === "summary" && <SummaryEditor lang={lang} />}
        {active === "skills" && <SkillsEditor lang={lang} />}
        {active === "experience" && <ExperienceEditor lang={lang} />}
        {active === "education" && <EducationEditor lang={lang} />}
        {active === "certificates" && <CertificatesEditor lang={lang} />}
        {active === "languages" && <LanguagesEditor lang={lang} />}
        {active === "theme" && <ThemeEditor />}
        <p className="mt-6 text-center text-[12px] text-[#9892a8]">
          Aksen aktif:{" "}
          <span
            className="inline-block h-3 w-3 rounded-full align-middle"
            style={{ backgroundColor: theme.accent }}
          />{" "}
          {theme.accent}
        </p>
      </main>
    </div>
  );
}

export default function DashboardApp() {
  return (
    <DraftProvider>
      <DashboardShell />
    </DraftProvider>
  );
}