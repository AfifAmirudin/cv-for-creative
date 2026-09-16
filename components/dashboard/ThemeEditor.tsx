"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  textureLabels,
  themePresets,
  type TextureKey,
} from "@/lib/translations";
import { useDraft } from "@/components/DraftProvider";
import { Card, Field, TextInput } from "@/components/dashboard/controls";

const TEXTURES: TextureKey[] = ["none", "grain", "dots", "lines", "grid"];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded-md border border-[#e3def0] bg-white p-0.5"
        />
        <TextInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-[13px]"
          spellCheck={false}
        />
      </div>
    </Field>
  );
}

function TextureThumb({
  texture,
  active,
  accent,
  onClick,
}: {
  texture: TextureKey;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-center gap-1.5 ${active ? "" : "opacity-80"}`}
    >
      <span
        data-texture={texture}
        className="cv-paper relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-black/10 shadow-sm"
        style={{ "--accent": accent, backgroundColor: "#ffffff" } as CSSProperties}
      >
        <span
          aria-hidden="true"
          className="relative z-10 h-3 w-3 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </span>
      <span
        className={`text-[11px] font-medium ${
          active ? "text-[#6d4fc4]" : "text-[#9892a8]"
        }`}
      >
        {textureLabels[texture]}
      </span>
    </button>
  );
}

export default function ThemeEditor() {
  const { theme, setTheme, applyPreset, resetTheme, saveChanges } = useDraft();
  const timer = useRef<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const queueSave = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setSaving(true);
      const ok = await saveChanges();
      setSaving(false);
      if (ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
      }
    }, 600);
  };

  const changeTheme = (patch: Partial<typeof theme>) => {
    setTheme(patch);
    queueSave();
  };

  const choosePreset = (p: (typeof themePresets)[number]) => {
    applyPreset({
      accent: p.accent,
      accentSecondary: p.accentSecondary,
      paper: p.paper,
      ink: p.ink,
    });
    queueSave();
  };

  const chooseTexture = (texture: TextureKey) => {
    changeTheme({ texture });
  };

  const previewStyle = {
    "--accent": theme.accent,
    "--accent-2": theme.accentSecondary,
    "--paper": theme.paper,
    "--ink": theme.ink,
  } as CSSProperties;

  return (
    <div className="space-y-4">
      <Card
        title="Pratinjau langsung"
        subtitle="Kertas CV akan tampak seperti di bawah ini."
      >
        <div className="max-w-sm">
          <div
            data-texture={theme.texture}
            style={previewStyle}
            className="cv-paper relative overflow-hidden rounded-2xl border border-black/10 p-5 shadow-sm"
          >
            <div
              aria-hidden="true"
              className="cv-float absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-xl"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <p
              className="relative z-10 font-display text-sm font-bold"
              style={{ color: "var(--ink)" }}
            >
              Karina Anggraini
            </p>
            <p
              className="relative z-10 mt-1 text-[11px] font-medium"
              style={{ color: "var(--accent)" }}
            >
              Content Creator · Visual Designer
            </p>
            <div className="relative z-10 mt-3 flex gap-1.5">
              <span
                className="rounded-md px-2 py-1 text-[10px] font-medium text-white"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Kreatif
              </span>
              <span
                className="rounded-md border px-2 py-1 text-[10px] font-medium"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--ink)",
                }}
              >
                Profesional
              </span>
              <span
                className="rounded-md px-2 py-1 text-[10px] font-medium"
                style={{
                  backgroundColor: "var(--accent-2)",
                  color: "#ffffff",
                }}
              >
                Aestetik
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Preset warna"
        subtitle="Pilih satu sentuhan warna siap pakai."
      >
        <div className="flex flex-wrap gap-4">
          {themePresets.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => choosePreset(p)}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className="h-10 w-10 rounded-full shadow-inner ring-2 ring-black/5 transition hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${p.accent}, ${p.accentSecondary})`,
                }}
              />
              <span className="text-[11px] font-medium text-[#6b6678]">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Warna kustom" subtitle="Atur warna secara bebas.">
        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            label="Warna aksen utama"
            value={theme.accent}
            onChange={(v) => changeTheme({ accent: v })}
          />
          <ColorField
            label="Warna aksen kedua"
            value={theme.accentSecondary}
            onChange={(v) => changeTheme({ accentSecondary: v })}
          />
          <ColorField
            label="Warna kertas CV"
            value={theme.paper}
            onChange={(v) => changeTheme({ paper: v })}
          />
          <ColorField
            label="Warna teks"
            value={theme.ink}
            onChange={(v) => changeTheme({ ink: v })}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            resetTheme();
            queueSave();
          }}
          className="mt-5 rounded-full border border-[#f3d9d4] px-4 py-2 text-[13px] font-medium text-[#c0392b] transition hover:bg-[#fdecea]"
        >
          Kembalikan tema bawaan
        </button>
      </Card>

      <Card
        title="Tekstur kertas"
        subtitle="Tambahkan tekstur pada latar CV. Warna titik/garis mengikuti aksen utama."
      >
        <div className="flex flex-wrap gap-4">
          {TEXTURES.map((t) => (
            <TextureThumb
              key={t}
              texture={t}
              active={theme.texture === t}
              accent={theme.accent}
              onClick={() => chooseTexture(t)}
            />
          ))}
        </div>
      </Card>

      <p className="text-center text-[12px] text-[#9892a8]">
        {saving
          ? "Menyimpan ke server…"
          : saved
            ? "Tersimpan di server ✓"
            : "Perubahan tema otomatis disimpan ke server dan browser."}
      </p>
    </div>
  );
}