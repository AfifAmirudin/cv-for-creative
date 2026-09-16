import type { Language } from "./cv";

export type {
  CVContact,
  CVData,
  ContentFile,
  Language,
  TextureKey,
  ThemeSettings,
} from "./cv";

export interface UIStrings {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  certificates: string;
  languages: string;
  downloadPdf: string;
  langLabel: string;
}

export interface ThemePreset {
  key: string;
  label: string;
  accent: string;
  accentSecondary: string;
  paper: string;
  ink: string;
}

export const themePresets: ThemePreset[] = [
  {
    key: "violet",
    label: "Violet Haze",
    accent: "#7c5cff",
    accentSecondary: "#00c2a8",
    paper: "#faf9ff",
    ink: "#221b3d",
  },
  {
    key: "coral",
    label: "Coral Bloom",
    accent: "#ff5c7a",
    accentSecondary: "#ffb74d",
    paper: "#fff8f2",
    ink: "#241a17",
  },
  {
    key: "ocean",
    label: "Ocean Dusk",
    accent: "#2f80ed",
    accentSecondary: "#6fcf97",
    paper: "#f2f7f9",
    ink: "#12202b",
  },
  {
    key: "neon",
    label: "Neon Garden",
    accent: "#a8e625",
    accentSecondary: "#9b5cff",
    paper: "#f8fbf1",
    ink: "#161b0a",
  },
  {
    key: "clay",
    label: "Clay Sun",
    accent: "#e4572e",
    accentSecondary: "#f2a541",
    paper: "#fdf6ee",
    ink: "#2b1d16",
  },
];

export const textureLabels: Record<import("./cv").TextureKey, string> = {
  none: "Polos",
  grain: "Butiran",
  dots: "Titik",
  lines: "Garis",
  grid: "Grid",
};

export const ui: Record<Language, UIStrings> = {
  id: {
    summary: "Ringkasan",
    experience: "Pengalaman Kerja",
    education: "Pendidikan",
    skills: "Keahlian",
    certificates: "Sertifikasi",
    languages: "Bahasa",
    downloadPdf: "Unduh PDF",
    langLabel: "Pilih bahasa",
  },
  en: {
    summary: "Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    certificates: "Certifications",
    languages: "Languages",
    downloadPdf: "Download PDF",
    langLabel: "Select language",
  },
};