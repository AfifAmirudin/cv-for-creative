import type { Language } from "@/lib/translations";

interface LanguageToggleProps {
  language: Language;
  onChange: (language: Language) => void;
  label: string;
}

export default function LanguageToggle({
  language,
  onChange,
  label,
}: LanguageToggleProps) {
  const isEnglish = language === "en";

  return (
    <div className="flex items-center gap-3">
      <span id="lang-label" className="sr-only">
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`text-[13px] font-medium ${
          isEnglish ? "text-[#8a8a9a]" : "text-[#221b3d]"
        }`}
      >
        ID
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isEnglish}
        aria-labelledby="lang-label"
        onClick={() => onChange(isEnglish ? "id" : "en")}
        className="relative inline-flex h-8 w-16 items-center rounded-full border border-[#ddd6ef] bg-[#f1edfb] px-1 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c5cff]"
      >
        <span
          aria-hidden="true"
          className={`inline-block h-6 w-6 rounded-full bg-[#5220e0] shadow-sm transition-transform duration-300 ${
            isEnglish ? "translate-x-8" : "translate-x-0"
          }`}
        />
      </button>
      <span
        aria-hidden="true"
        className={`text-[13px] font-medium ${
          isEnglish ? "text-[#221b3d]" : "text-[#8a8a9a]"
        }`}
      >
        EN
      </span>
    </div>
  );
}