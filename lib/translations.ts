export type Language = "id" | "en";

export interface CVData {
  name: string;
  headline: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    website: string;
  };
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

export type TextureKey = "none" | "grain" | "dots" | "lines" | "grid";

export interface ThemeSettings {
  accent: string;
  accentSecondary: string;
  paper: string;
  ink: string;
  texture: TextureKey;
}

export const cvData: Record<Language, CVData> = {
  id: {
    name: "Karina Anggraini",
    headline: "Kreator Konten · Desainer Visual · Video Editor",
    contact: {
      email: "karina@kreatif.id",
      phone: "+62 811-2233-4455",
      location: "Bandung, Indonesia",
      website: "karinakreatif.id",
    },
    summary:
      "Kreator konten dan desainer visual dengan 5+ tahun pengalaman memproduksi konten digital yang estetis dan berdampak untuk brand serta channel media sosial. Menggabungkan kepekaan desain, penceritaan visual, dan penguasaan perangkat editing untuk menghasilkan karya yang konsisten, profesional, dan mudah dipahami audiens.",
    skills: [
      "Adobe Photoshop",
      "Illustrator",
      "Premiere Pro",
      "After Effects",
      "Figma",
      "Canva",
      "DaVinci Resolve",
      "CapCut",
      "Motion Graphics",
      "Copywriting",
      "Storytelling",
      "Strategi Media Sosial",
    ],
    experiences: [
      {
        role: "Kreator Konten Senior",
        company: "Studio Kreatif Nusantara",
        location: "Bandung, Indonesia",
        period: "2022 – Sekarang",
        points: [
          "Memproduksi 40+ konten (reels, desain feed, video pendek) per bulan untuk portofolio 8 brand, meningkatkan rata-rata engagement hingga 3,2×.",
          "Memimpin perancangan visual dan tone komunikasi, menjaga identitas brand agar konsisten di semua kanal.",
          "Berkolaborasi dengan tim klien untuk menyusun kalender konten dan strategi kampanye bulanan.",
        ],
      },
      {
        role: "Graphic Designer & Video Editor",
        company: "Agensi Visual Kita",
        location: "Jakarta, Indonesia",
        period: "2019 – 2022",
        points: [
          "Merancang materi visual kampanye (poster, iklan digital, motion) untuk 20+ klien lintas industri.",
          "Menyunting 120+ video promosi dengan alur cerita yang jelas, meningkatkan durasi menonton rata-rata 45%.",
          "Membangun library template aset yang mempercepat produksi hingga 30%.",
        ],
      },
      {
        role: "Freelance Desainer & Editor",
        company: "Mandiri",
        location: "Bandung, Indonesia",
        period: "2017 – 2019",
        points: [
          "Mengerjakan proyek desain logo, packaging, dan editing video untuk UMKM serta personal brand.",
          "Mengelola komunikasi klien dari brief awal hingga final deliverable sesuai tenggat.",
        ],
      },
    ],
    education: [
      {
        degree: "S.Ds., Desain Komunikasi Visual",
        institution: "Institut Seni Indonesia",
        period: "2013 – 2017",
        note: "IPK 3.80 / 4.00",
      },
    ],
    certificates: [
      {
        title: "Meta Certified Digital Marketing Associate",
        issuer: "Meta",
        year: "2024",
      },
      {
        title: "Google UX Design Professional",
        issuer: "Google",
        year: "2023",
      },
      {
        title: "Adobe Certified Professional – Premiere Pro",
        issuer: "Adobe",
        year: "2022",
      },
    ],
    languages: [
      { name: "Bahasa Indonesia", level: "Penutur asli" },
      { name: "Inggris", level: "Mahir (profesional)" },
    ],
  },
  en: {
    name: "Karina Anggraini",
    headline: "Content Creator · Visual Designer · Video Editor",
    contact: {
      email: "karina@kreatif.id",
      phone: "+62 811-2233-4455",
      location: "Bandung, Indonesia",
      website: "karinakreatif.id",
    },
    summary:
      "Content creator and visual designer with 5+ years producing aesthetic, high-impact digital content for brands and social channels. Combining design sensibility, visual storytelling, and strong editing skills to deliver consistent, professional work that resonates with audiences.",
    skills: [
      "Adobe Photoshop",
      "Illustrator",
      "Premiere Pro",
      "After Effects",
      "Figma",
      "Canva",
      "DaVinci Resolve",
      "CapCut",
      "Motion Graphics",
      "Copywriting",
      "Storytelling",
      "Social Media Strategy",
    ],
    experiences: [
      {
        role: "Senior Content Creator",
        company: "Nusantara Creative Studio",
        location: "Bandung, Indonesia",
        period: "2022 – Present",
        points: [
          "Produced 40+ assets (reels, feed design, short videos) monthly across 8 brand portfolios, raising average engagement by 3.2×.",
          "Led visual direction and tone of voice, keeping brand identity consistent across all channels.",
          "Collaborated with client teams on monthly content calendars and campaign strategy.",
        ],
      },
      {
        role: "Graphic Designer & Video Editor",
        company: "Our Visual Agency",
        location: "Jakarta, Indonesia",
        period: "2019 – 2022",
        points: [
          "Designed campaign visuals (posters, digital ads, motion graphics) for 20+ clients across industries.",
          "Edited 120+ promo videos with clear narrative structure, increasing average watch time by 45%.",
          "Built a reusable asset template library that sped up production by 30%.",
        ],
      },
      {
        role: "Freelance Designer & Editor",
        company: "Self-employed",
        location: "Bandung, Indonesia",
        period: "2017 – 2019",
        points: [
          "Delivered logo, packaging, and video editing projects for SMBs and personal brands.",
          "Managed client communication from brief to final deliverables, always on deadline.",
        ],
      },
    ],
    education: [
      {
        degree: "B.Arts, Visual Communication Design",
        institution: "Indonesian Institute of the Arts",
        period: "2013 – 2017",
        note: "GPA 3.80 / 4.00",
      },
    ],
    certificates: [
      {
        title: "Meta Certified Digital Marketing Associate",
        issuer: "Meta",
        year: "2024",
      },
      {
        title: "Google UX Design Professional",
        issuer: "Google",
        year: "2023",
      },
      {
        title: "Adobe Certified Professional – Premiere Pro",
        issuer: "Adobe",
        year: "2022",
      },
    ],
    languages: [
      { name: "Indonesian", level: "Native" },
      { name: "English", level: "Fluent (professional)" },
    ],
  },
};

export const defaultTheme: ThemeSettings = {
  accent: "#7c5cff",
  accentSecondary: "#00c2a8",
  paper: "#faf9ff",
  ink: "#221b3d",
  texture: "grain",
};

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

export const textureLabels: Record<TextureKey, string> = {
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