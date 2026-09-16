export type Language = "id" | "en";

export interface CVContact {
  email: string;
  phone: string;
  location: string;
  website: string;
}

export interface CVData {
  name: string;
  headline: string;
  contact: CVContact;
  summary: string;
  skills: string[];
  experiences: {
    role: string;
    company: string;
    location: string;
    period: string;
    points: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    note: string;
  }[];
  certificates: {
    title: string;
    issuer: string;
    year: string;
  }[];
  languages: {
    name: string;
    level: string;
  }[];
}

export type TextureKey = "none" | "grain" | "dots" | "lines" | "grid";

export interface ThemeSettings {
  accent: string;
  accentSecondary: string;
  paper: string;
  ink: string;
  texture: TextureKey;
}

export interface ContentFile {
  id: CVData;
  en: CVData;
  theme: ThemeSettings;
}

import defaultContentRaw from "../data/cv.json";

export const defaultContent = defaultContentRaw as ContentFile;

export interface ValidationResult {
  ok: boolean;
  data?: ContentFile;
  error?: string;
}

const LIMITS = {
  name: 200,
  headline: 300,
  contact: 500,
  summary: 8000,
  line: 1000,
  listItemsPerSection: 200,
};

const TEXTURES: readonly string[] = ["none", "grain", "dots", "lines", "grid"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown, maxLength: number): value is string[] {
  if (!Array.isArray(value) || value.length > maxLength) return false;
  return value.every((item) => typeof item === "string");
}

function cleanString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length > max) return null;
  return trimmed;
}

function isValidEmail(value: string): boolean {
  if (value.length > LIMITS.contact) return false;
  const email = value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  return email.length <= LIMITS.contact;
}

function isValidWebsite(value: string): boolean {
  if (value.length > LIMITS.contact) return false;
  const host = value.trim();
  if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?(\/.*)?$/i.test(host)) return false;
  try {
    const parsed = new URL(`https://${host}`);
    return parsed.hostname.length > 0 && parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

function parseCVData(raw: unknown): CVData | null {
  if (!isRecord(raw)) return null;

  const name = cleanString(raw.name, LIMITS.name);
  const headline = cleanString(raw.headline, LIMITS.headline);
  const summary = cleanString(raw.summary, LIMITS.summary);
  if (name === null || headline === null || summary === null) return null;

  const contact = isRecord(raw.contact) ? raw.contact : null;
  if (!contact) return null;
  const email = cleanString(contact.email, LIMITS.contact);
  const phone = cleanString(contact.phone, LIMITS.contact);
  const location = cleanString(contact.location, LIMITS.contact);
  const website = cleanString(contact.website, LIMITS.contact);
  if (email === null || phone === null || location === null || website === null) {
    return null;
  }
  if (!isValidEmail(email)) return null;
  if (!isValidWebsite(website)) return null;

  const skills = isStringArray(raw.skills, LIMITS.listItemsPerSection)
    ? raw.skills
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .slice(0, 200)
    : null;
  if (!skills) return null;

  const experiences = Array.isArray(raw.experiences)
    ? raw.experiences.slice(0, 200)
    : null;
  if (!experiences) return null;
  const parsedExperiences: CVData["experiences"] = [];
  for (const exp of experiences) {
    if (!isRecord(exp)) return null;
    const role = cleanString(exp.role, LIMITS.line);
    const company = cleanString(exp.company, LIMITS.line);
    const location2 = cleanString(exp.location, LIMITS.line);
    const period = cleanString(exp.period, LIMITS.line);
    if (role === null || company === null || location2 === null || period === null) {
      return null;
    }
    const points = isStringArray(exp.points, 100)
      ? exp.points
          .map((p) => p.trim())
          .filter((p) => p.length > 0)
          .slice(0, 100)
      : null;
    if (!points) return null;
    parsedExperiences.push({ role, company, location: location2, period, points });
  }

  const education = Array.isArray(raw.education)
    ? raw.education.slice(0, 200)
    : null;
  if (!education) return null;
  const parsedEducation: CVData["education"] = [];
  for (const edu of education) {
    if (!isRecord(edu)) return null;
    const degree = cleanString(edu.degree, LIMITS.line);
    const institution = cleanString(edu.institution, LIMITS.line);
    const period = cleanString(edu.period, LIMITS.line);
    const note = cleanString(edu.note, LIMITS.line);
    if (degree === null || institution === null || period === null || note === null) {
      return null;
    }
    parsedEducation.push({ degree, institution, period, note });
  }

  const certificates = Array.isArray(raw.certificates)
    ? raw.certificates.slice(0, 200)
    : null;
  if (!certificates) return null;
  const parsedCertificates: CVData["certificates"] = [];
  for (const cert of certificates) {
    if (!isRecord(cert)) return null;
    const title = cleanString(cert.title, LIMITS.line);
    const issuer = cleanString(cert.issuer, LIMITS.line);
    const year = cleanString(cert.year, LIMITS.line);
    if (title === null || issuer === null || year === null) return null;
    parsedCertificates.push({ title, issuer, year });
  }

  const languages = Array.isArray(raw.languages)
    ? raw.languages.slice(0, 100)
    : null;
  if (!languages) return null;
  const parsedLanguages: CVData["languages"] = [];
  for (const ln of languages) {
    if (!isRecord(ln)) return null;
    const name2 = cleanString(ln.name, LIMITS.line);
    const level = cleanString(ln.level, LIMITS.line);
    if (name2 === null || level === null) return null;
    parsedLanguages.push({ name: name2, level });
  }

  return {
    name,
    headline,
    contact: { email, phone, location, website },
    summary,
    skills,
    experiences: parsedExperiences,
    education: parsedEducation,
    certificates: parsedCertificates,
    languages: parsedLanguages,
  };
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function parseTheme(raw: unknown): ThemeSettings | null {
  if (!isRecord(raw)) return null;
  const { accent, accentSecondary, paper, ink, texture } = raw;
  const isValidColor = (v: unknown): v is string =>
    typeof v === "string" && HEX_COLOR.test(v.trim());
  if (
    !isValidColor(accent) ||
    !isValidColor(accentSecondary) ||
    !isValidColor(paper) ||
    !isValidColor(ink)
  ) {
    return null;
  }
  const textureKey = typeof texture === "string" ? texture.trim() : "";
  if (!TEXTURES.includes(textureKey)) return null;
  return {
    accent: accent.trim(),
    accentSecondary: accentSecondary.trim(),
    paper: paper.trim(),
    ink: ink.trim(),
    texture: textureKey as TextureKey,
  };
}

export function parseContentFile(raw: unknown): ValidationResult {
  if (!isRecord(raw)) {
    return { ok: false, error: "Payload harus berupa objek." };
  }
  const id = parseCVData(raw.id);
  if (!id) {
    return { ok: false, error: "Konten bahasa Indonesia tidak valid." };
  }
  const en = parseCVData(raw.en);
  if (!en) {
    return { ok: false, error: "Konten bahasa Inggris tidak valid." };
  }
  const theme = parseTheme(raw.theme);
  if (!theme) {
    return { ok: false, error: "Pengaturan tema tidak valid." };
  }
  return { ok: true, data: { id, en, theme } };
}