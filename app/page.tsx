"use client";

import { useEffect, useRef, useState } from "react";
import CVContent from "@/components/CVContent";
import LanguageToggle from "@/components/LanguageToggle";
import PrintButton from "@/components/PrintButton";
import { useDraft } from "@/components/DraftProvider";
import { ui, type Language } from "@/lib/translations";

export default function Home() {
  const [language, setLanguage] = useState<Language>("id");
  const contentRef = useRef<HTMLDivElement>(null);
  const { draft, theme } = useDraft();

  const data = draft[language];
  const strings = ui[language];

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "id";
  }, [language]);

  return (
    <div className="min-h-screen bg-[#efecea] font-sans">
      <header className="sticky top-0 z-20 border-b border-[#e2dad4] bg-[#efecea]/85 backdrop-blur no-print">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-3">
          <p className="font-display text-[15px] font-bold tracking-tight text-[#221b3d]">
            {data.name}
          </p>
          <div className="flex items-center gap-4">
            <LanguageToggle
              language={language}
              onChange={setLanguage}
              label={strings.langLabel}
            />
            <PrintButton
              contentRef={contentRef}
              documentTitle={`Creative CV - ${data.name}`}
              label={strings.downloadPdf}
              accent={theme.accent}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <div className="overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(60,40,120,0.18)] ring-1 ring-black/5">
          <CVContent ref={contentRef} data={data} ui={strings} theme={theme} />
        </div>
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 pb-10 text-center no-print">
        <p className="text-[13px] text-[#a49d96]">
          © {new Date().getFullYear()} {data.name}
        </p>
      </footer>
    </div>
  );
}