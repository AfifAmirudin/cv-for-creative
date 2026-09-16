"use client";

import type { RefObject } from "react";
import { useReactToPrint } from "react-to-print";

interface PrintButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
  documentTitle: string;
  label: string;
  accent?: string;
}

export default function PrintButton({
  contentRef,
  documentTitle,
  label,
  accent,
}: PrintButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,
    pageStyle: "@page { size: A4; margin: 14mm; }",
  });

  const style = accent
    ? ({ backgroundColor: accent } as React.CSSProperties)
    : undefined;

  return (
    <button
      type="button"
      onClick={() => handlePrint()}
      className="inline-flex h-9 items-center gap-2 rounded-full px-5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c5cff]"
      style={
        style ??
        {
          backgroundColor: "#221b3d",
        }
      }
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      {label}
    </button>
  );
}