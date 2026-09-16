import { forwardRef, type CSSProperties } from "react";
import type { CVData, ThemeSettings, UIStrings } from "@/lib/translations";

interface CVContentProps {
  data: CVData;
  ui: UIStrings;
  theme: ThemeSettings;
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className ?? "h-4 w-4"}
    >
      <path d="M12 0c.9 6.6 4.5 10.2 11.1 11.1-6.6.9-10.2 4.5-11.1 11.1C11.1 15.6 7.5 12 .9 11.1 7.5 10.2 11.1 6.6 12 0Z" />
    </svg>
  );
}

function SectionHeading({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <h2
      className="cv-rise flex items-center gap-2 font-display text-lg font-bold tracking-tight sm:text-xl"
      style={{ animationDelay: `${200 + index * 90}ms` }}
    >
      <SparkIcon className="h-4 w-4 shrink-0 text-[var(--accent)]" />
      <span className="text-[var(--ink)]">{children}</span>
      <span
        aria-hidden="true"
        className="ml-1 h-[3px] flex-1 rounded-full bg-[var(--accent)] opacity-60"
      />
    </h2>
  );
}

const CVContent = forwardRef<HTMLDivElement, CVContentProps>(
  function CVContent({ data, ui, theme }, ref) {
    const paperStyle = {
      "--accent": theme.accent,
      "--accent-2": theme.accentSecondary,
      "--paper": theme.paper,
      "--ink": theme.ink,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        data-texture={theme.texture}
        style={paperStyle}
        className="cv-paper relative overflow-hidden font-sans text-[15px] leading-relaxed"
      >
        <div
          aria-hidden="true"
          className="cv-float absolute right-[-90px] top-[-80px] h-64 w-64 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-10 top-32 h-24 w-24 rounded-full border-[3px] opacity-25"
          style={{ borderColor: "var(--accent-2)" }}
        />
        <div
          aria-hidden="true"
          className="absolute right-8 top-40 h-7 w-7 rotate-45 opacity-30"
          style={{ backgroundColor: "var(--accent-2)" }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-24 left-[-40px] h-52 w-52 rotate-12 rounded-[2rem] opacity-10"
          style={{ backgroundColor: "var(--accent)" }}
        />

        <div className="relative z-10 px-6 py-9 sm:px-11 sm:py-12">
          <header className="border-b-2 border-dashed pb-7" style={{ borderColor: "var(--accent)" }}>
            <p
              className="cv-rise font-display text-[11px] font-bold uppercase tracking-[0.4em]"
              style={{ color: "var(--accent)", animationDelay: "0ms" }}
            >
              Creative
            </p>
            <h1
              className="cv-rise mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
              style={{ color: "var(--ink)", animationDelay: "60ms" }}
            >
              {data.name}
            </h1>
            <p
              className="cv-rise mt-3 flex items-center gap-2 text-[14px] font-medium sm:text-base"
              style={{ color: "var(--accent)", animationDelay: "120ms" }}
            >
              <span aria-hidden="true" className="hidden sm:inline">✦</span>
              {data.headline}
            </p>

            <ul
              className="cv-rise mt-6 flex flex-wrap gap-2"
              style={{ animationDelay: "180ms" }}
            >
              <li>
                <a
                  href={`mailto:${data.contact.email}`}
                  className="inline-block rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition hover:shadow-[0_0_0_5px_rgba(0,0,0,0.04)]"
                  style={{
                    borderColor: "var(--accent)",
                    color: "var(--ink)",
                  }}
                >
                  {data.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${data.contact.phone}`}
                  className="inline-block rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition hover:shadow-[0_0_0_5px_rgba(0,0,0,0.04)]"
                  style={{ borderColor: "var(--accent)", color: "var(--ink)" }}
                >
                  {data.contact.phone}
                </a>
              </li>
              <li>
                <span className="inline-block rounded-full border px-3.5 py-1.5 text-[13px] font-medium" style={{ borderColor: "var(--accent)", color: "var(--ink)" }}>
                  {data.contact.location}
                </span>
              </li>
              <li>
                <a
                  href={`https://${data.contact.website}`}
                  className="inline-block rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition hover:shadow-[0_0_0_5px_rgba(0,0,0,0.04)]"
                  style={{ borderColor: "var(--accent)", color: "var(--ink)" }}
                >
                  {data.contact.website}
                </a>
              </li>
            </ul>
          </header>

          <section aria-label={ui.summary}>
            <SectionHeading index={0}>{ui.summary}</SectionHeading>
            <p className="cv-rise mt-4 text-[15px] leading-relaxed" style={{ animationDelay: "240ms", color: "var(--ink)" }}>
              {data.summary}
            </p>
          </section>

          <section aria-label={ui.experience}>
            <SectionHeading index={1}>{ui.experience}</SectionHeading>
            <div className="mt-5 space-y-5">
              {data.experiences.map((job, i) => (
                <article
                  key={i}
                  className="cv-rise overflow-hidden rounded-xl border border-[rgba(0,0,0,0.1)] p-4 transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-5"
                  style={{ borderLeft: `4px solid var(--accent)`, animationDelay: `${280 + i * 80}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-display text-base font-bold sm:text-lg" style={{ color: "var(--ink)" }}>
                      {job.role}
                      <span className="font-sans text-[14px] font-medium text-[rgba(0,0,0,0.55)]">
                        {"  —  "}
                        {job.company}
                      </span>
                    </h3>
                    <p className="font-display text-[13px] font-semibold tabular-nums" style={{ color: "var(--accent)" }}>
                      {job.period}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[13px] text-[rgba(0,0,0,0.45)]">{job.location}</p>
                  <ul className="mt-3 space-y-1.5 text-[14px] leading-relaxed">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section aria-label={ui.education}>
            <SectionHeading index={2}>{ui.education}</SectionHeading>
            <div className="mt-5 space-y-4">
              {data.education.map((edu, i) => (
                <article
                  key={i}
                  className="cv-rise flex flex-col sm:flex-row sm:items-baseline sm:justify-between"
                  style={{ animationDelay: `${280 + i * 80}ms` }}
                >
                  <div>
                    <h3 className="font-display text-base font-bold" style={{ color: "var(--ink)" }}>
                      {edu.degree}
                    </h3>
                    <p className="text-[14px] text-[rgba(0,0,0,0.55)]">
                      {edu.institution}
                      <span style={{ color: "var(--accent)" }}> — {edu.note}</span>
                    </p>
                  </div>
                  <p className="font-display text-[13px] font-semibold tabular-nums" style={{ color: "var(--accent)" }}>
                    {edu.period}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-label={ui.skills}>
            <SectionHeading index={3}>{ui.skills}</SectionHeading>
            <ul className="mt-5 flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <li
                  key={skill}
                  className="cv-rise rounded-lg border px-3 py-1.5 text-[13px] font-medium transition hover:-translate-y-0.5"
                  style={{
                    borderColor: "var(--accent)",
                    color: "var(--ink)",
                    animationDelay: `${300 + i * 50}ms`,
                  }}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          <section aria-label={ui.certificates}>
            <SectionHeading index={4}>{ui.certificates}</SectionHeading>
            <ul className="mt-5 space-y-2 text-[14px]">
              {data.certificates.map((cert, i) => (
                <li
                  key={cert.title}
                  className="cv-rise flex items-start gap-2"
                  style={{ animationDelay: `${300 + i * 70}ms` }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-[5px] h-3.5 w-3.5 shrink-0"
                    style={{ color: "var(--accent)" }}
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>
                    {cert.title}
                    <span className="text-[rgba(0,0,0,0.5)]"> — {cert.issuer}</span>
                    <span style={{ color: "var(--accent)" }}> ({cert.year})</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label={ui.languages}>
            <SectionHeading index={5}>{ui.languages}</SectionHeading>
            <ul className="mt-5 flex flex-wrap gap-2">
              {data.languages.map((ln, i) => (
                <li
                  key={ln.name}
                  className="cv-rise rounded-full px-4 py-1.5 text-[13px] font-medium"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "#ffffff",
                    animationDelay: `${300 + i * 70}ms`,
                  }}
                >
                  {ln.name}
                  <span className="opacity-80"> — {ln.level}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }
);

export default CVContent;