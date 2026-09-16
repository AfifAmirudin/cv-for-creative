"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";
import { useDraft } from "@/components/DraftProvider";
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

export default function DashboardPage() {
  const [lang, setLang] = useState<Language>("id");
  const [active, setActive] = useState<Tab>("profile");
  const { theme, resetAll } = useDraft();

  const handleResetAll = () => {
    if (
      window.confirm(
        "Kembalikan semua isi CV DAN tema ke pengaturan bawaan?"
      )
    ) {
      resetAll();
    }
  };

  return (
    <div className="min-h-screen bg-[#f2effa] font-sans">
      <header className="border-b border-[#e3def0] bg-white">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-[#221b3d] sm:text-2xl">
              Dashboard CV Kreatif
            </h1>
            <p className="mt-0.5 text-[13px] text-[#9892a8]">
              Klik &quot;Edit&quot; untuk mengubah data, lalu &quot;Simpan&quot;
              sebagai konfirmasi — tersimpan di server &amp; browser.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageToggle
              language={lang}
              onChange={setLang}
              label="Pilih bahasa yang akan diedit"
            />
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e3def0] bg-white px-4 text-[13px] font-medium text-[#221b3d] transition hover:border-[#7c5cff] hover:text-[#6d4fc4]"
            >
              Lihat CV
            </Link>
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex h-9 items-center rounded-full border border-[#f3d9d4] px-4 text-[13px] font-medium text-[#c0392b] transition hover:bg-[#fdecea]"
            >
              Reset Semua
            </button>
          </div>
        </div>
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
            ? "Ubah tema di sini — pratinjau dan CV utama ikut berubah seketika."
            : `Sedang mengedit konten bahasa ${LANG_NAME[lang]}. Buka halaman utama di menu “Lihat CV” untuk melihat hasilnya.`}
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