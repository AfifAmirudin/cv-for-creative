"use client";

import { useState } from "react";
import type { CVData, Language } from "@/lib/translations";
import { useDraft } from "@/components/DraftProvider";
import {
  ActionButtons,
  AddButton,
  Card,
  Field,
  ItemCard,
  SaveResult,
  TextInput,
  TextareaInput,
} from "@/components/dashboard/controls";

const smallDanger =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#c0392b] transition hover:bg-[#fdecea]";

function useSaveState() {
  const [applied, setApplied] = useState(false);

  const apply = () => {
    setApplied(true);
    window.setTimeout(() => setApplied(false), 2600);
  };

  return { applied, apply };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#9892a8]">
        {label}
      </dt>
      <dd className="mt-0.5 text-[14px] text-[#221b3d]">{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

interface ProfileForm {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

export function ProfileEditor({ lang }: { lang: Language }) {
  const { draft, setProfileField, setContactField } = useDraft();
  const p = draft[lang];
  const { applied, apply } = useSaveState();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: p.name,
    headline: p.headline,
    email: p.contact.email,
    phone: p.contact.phone,
    location: p.contact.location,
    website: p.contact.website,
  });

  const begin = () => {
    setForm({
      name: p.name,
      headline: p.headline,
      email: p.contact.email,
      phone: p.contact.phone,
      location: p.contact.location,
      website: p.contact.website,
    });
    setEditing(true);
  };

  const save = () => {
    setProfileField(lang, "name", form.name);
    setProfileField(lang, "headline", form.headline);
    setContactField(lang, "email", form.email);
    setContactField(lang, "phone", form.phone);
    setContactField(lang, "location", form.location);
    setContactField(lang, "website", form.website);
    apply();
    setEditing(false);
  };

  return (
    <Card
      title="Profil"
      subtitle="Identitas utama yang tampil paling atas."
    >
      {!editing ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          <InfoRow label="Nama" value={p.name} />
          <InfoRow label="Jabatan / Headline" value={p.headline} />
          <InfoRow label="Email" value={p.contact.email} />
          <InfoRow label="Telepon" value={p.contact.phone} />
          <InfoRow label="Lokasi" value={p.contact.location} />
          <InfoRow label="Website / Portofolio" value={p.contact.website} />
        </dl>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nama">
              <TextInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Jabatan / Headline">
              <TextInput
                value={form.headline}
                onChange={(e) =>
                  setForm({ ...form, headline: e.target.value })
                }
              />
            </Field>
          </div>
          <p className="border-t border-dashed border-[#e3def0] pt-3 text-[12px] font-medium uppercase tracking-wider text-[#6d4fc4]">
            Kontak
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Email">
              <TextInput
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label="Telepon">
              <TextInput
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label="Lokasi">
              <TextInput
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </Field>
            <Field label="Website / Portofolio">
              <TextInput
                value={form.website}
                onChange={(e) =>
                  setForm({ ...form, website: e.target.value })
                }
              />
            </Field>
          </div>
        </div>
      )}

      <ActionButtons
        editing={editing}
        onEdit={begin}
        onSave={save}
        onCancel={() => setEditing(false)}
      />
      <SaveResult shown={applied} />
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Summary                                                             */
/* ------------------------------------------------------------------ */

export function SummaryEditor({ lang }: { lang: Language }) {
  const { draft, setSummary } = useDraft();
  const { applied, apply } = useSaveState();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(draft[lang].summary);

  const begin = () => {
    setText(draft[lang].summary);
    setEditing(true);
  };

  const save = () => {
    setSummary(lang, text);
    apply();
    setEditing(false);
  };

  return (
    <Card title="Ringkasan" subtitle="Paragraf singkat tentang kamu.">
      {editing ? (
        <Field label="Isi ringkasan">
          <TextareaInput
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Field>
      ) : (
        <p className="text-[14px] leading-relaxed text-[#3b3550]">
          {draft[lang].summary}
        </p>
      )}

      <ActionButtons
        editing={editing}
        onEdit={begin}
        onSave={save}
        onCancel={() => setEditing(false)}
      />
      <SaveResult shown={applied} />
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export function SkillsEditor({ lang }: { lang: Language }) {
  const { draft, setList } = useDraft();
  const skills = draft[lang].skills;
  const { applied, apply } = useSaveState();
  const [editing, setEditing] = useState(false);
  const [list, setLocal] = useState<string[]>(skills);
  const [adding, setAdding] = useState("");

  const begin = () => {
    setLocal([...skills]);
    setAdding("");
    setEditing(true);
  };

  const save = () => {
    const clean = list
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setList(lang, "skills", clean);
    apply();
    setEditing(false);
  };

  const addItem = () => {
    const v = adding.trim();
    if (!v) return;
    setLocal([...list, v]);
    setAdding("");
  };

  return (
    <Card
      title="Keahlian"
      subtitle="Keahlian munbul sebagai chip di CV."
    >
      {!editing ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-block rounded-lg border border-[#7c5cff] px-3 py-1.5 text-[13px] font-medium text-[#221b3d]"
            >
              {skill}
            </span>
          ))}
          {skills.length === 0 && (
            <p className="text-[13px] text-[#9892a8]">Belum ada keahlian.</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((skill, i) => (
            <div key={i} className="flex items-center gap-2">
              <TextInput
                value={skill}
                onChange={(e) => {
                  const next = [...list];
                  next[i] = e.target.value;
                  setLocal(next);
                }}
              />
              <button
                type="button"
                aria-label="Hapus keahlian"
                onClick={() => setLocal(list.filter((_, x) => x !== i))}
                className={smallDanger}
              >
                ×
              </button>
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <TextInput
              value={adding}
              onChange={(e) => setAdding(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addItem();
              }}
              placeholder="Tulis keahlian lalu tekan Enter…"
            />
            <button
              type="button"
              onClick={addItem}
              className="shrink-0 rounded-lg border border-[#e3def0] px-4 text-[13px] font-medium text-[#6d4fc4] transition hover:border-[#7c5cff]"
            >
              + Tambah
            </button>
          </div>
        </div>
      )}

      <ActionButtons
        editing={editing}
        onEdit={begin}
        onSave={save}
        onCancel={() => setEditing(false)}
      />
      <SaveResult shown={applied} />
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Experience (per-item edit)                                          */
/* ------------------------------------------------------------------ */

type ExpItem = CVData["experiences"][number];

function ExperienceForm({
  working,
  onChange,
}: {
  working: ExpItem;
  onChange: (item: ExpItem) => void;
}) {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Posisi">
          <TextInput
            value={working.role}
            onChange={(e) => onChange({ ...working, role: e.target.value })}
          />
        </Field>
        <Field label="Perusahaan / Studio">
          <TextInput
            value={working.company}
            onChange={(e) =>
              onChange({ ...working, company: e.target.value })
            }
          />
        </Field>
        <Field label="Lokasi">
          <TextInput
            value={working.location}
            onChange={(e) =>
              onChange({ ...working, location: e.target.value })
            }
          />
        </Field>
        <Field label="Periode">
          <TextInput
            value={working.period}
            onChange={(e) =>
              onChange({ ...working, period: e.target.value })
            }
          />
        </Field>
      </div>
      <div className="mt-4">
        <p className="mb-1.5 text-[12px] font-medium uppercase tracking-wider text-[#6d4fc4]">
          Poin pencapaian
        </p>
        <div className="space-y-2">
          {working.points.map((point, pi) => (
            <div key={pi} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7c5cff]" />
              <TextInput
                value={point}
                onChange={(e) => {
                  const points = [...working.points];
                  points[pi] = e.target.value;
                  onChange({ ...working, points });
                }}
              />
              <button
                type="button"
                aria-label="Hapus poin"
                onClick={() =>
                  onChange({
                    ...working,
                    points: working.points.filter((_, x) => x !== pi),
                  })
                }
                className={smallDanger}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({ ...working, points: [...working.points, ""] })
          }
          className="mt-2 text-[13px] font-medium text-[#6d4fc4] hover:underline"
        >
          + Tambah poin
        </button>
      </div>
    </div>
  );
}

export function ExperienceEditor({ lang }: { lang: Language }) {
  const { draft, addListItem, setListItem, removeListItem, moveItem } =
    useDraft();
  const items = draft[lang].experiences;
  const { applied, apply } = useSaveState();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [working, setWorking] = useState<ExpItem | null>(null);

  const beginEdit = (i: number) => {
    setWorking({ ...items[i], points: [...items[i].points] });
    setEditIndex(i);
  };

  const beginAdd = () => {
    setWorking({
      role: "",
      company: "",
      location: "",
      period: "",
      points: [""],
    });
    setEditIndex(null);
  };

  const cancel = () => {
    setWorking(null);
    setEditIndex(null);
  };

  const saveCurrent = () => {
    if (!working) return;
    if (editIndex === null) {
      addListItem(lang, "experiences", working);
    } else {
      setListItem(lang, "experiences", editIndex, working);
    }
    apply();
    cancel();
  };

  const removeItem = (i: number) => {
    if (!window.confirm("Hapus pengalaman ini?")) return;
    removeListItem(lang, "experiences", i);
  };

  const moveItemBy = (i: number, offset: -1 | 1) => {
    moveItem(lang, "experiences", i, offset);
  };

  return (
    <Card
      title="Pengalaman Kerja"
      subtitle="Klik Edit pada satu pekerjaan untuk mengubah, lalu Simpan untuk konfirmasi."
    >
      <div className="space-y-4">
        {items.map((job, i) =>
          editIndex === i && working ? (
            <ItemCard
              key={i}
              index={i}
              title="Edit pengalaman"
              onRemove={() => {
                cancel();
                removeItem(i);
              }}
            >
              <ExperienceForm
                working={working}
                onChange={setWorking}
              />
              <ActionButtons
                editing
                onEdit={() => {}}
                onSave={saveCurrent}
                onCancel={cancel}
              />
            </ItemCard>
          ) : (
            <ItemCard
              key={i}
              index={i}
              title={`${job.role} — ${job.company}`}
              onMoveUp={() => moveItemBy(i, -1)}
              onMoveDown={() => moveItemBy(i, 1)}
              canUp={i > 0}
              canDown={i < items.length - 1}
              onRemove={() => removeItem(i)}
            >
              <div className="flex flex-col gap-1 text-[14px]">
                <p className="font-semibold text-[#221b3d]">{job.role}</p>
                <p className="text-[#6b6678]">
                  {job.company} · {job.location}
                </p>
                <p className="font-medium text-[#7c5cff]">{job.period}</p>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-[#3b3550]">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <ActionButtons
                editing={false}
                onEdit={() => beginEdit(i)}
                onSave={() => {}}
                onCancel={() => {}}
              />
            </ItemCard>
          )
        )}

        {editIndex === null && working ? (
          <ItemCard index={items.length} title="Pengalaman baru">
            <ExperienceForm working={working} onChange={setWorking} />
            <ActionButtons
              editing
              onEdit={() => {}}
              onSave={saveCurrent}
              onCancel={cancel}
            />
          </ItemCard>
        ) : null}

        <AddButton label="Tambah Pengalaman" onClick={beginAdd} />
      </div>
      <SaveResult shown={applied} />
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Simple list sections (Education / Certificates / Languages)         */
/* ------------------------------------------------------------------ */

function useListEdit<T extends Record<string, string>>() {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [working, setWorking] = useState<T | null>(null);

  const beginEdit = (item: T, i: number) => {
    setWorking({ ...item });
    setEditIndex(i);
  };

  const beginAdd = (blank: T) => {
    setWorking(blank);
    setEditIndex(null);
  };

  const cancel = () => {
    setWorking(null);
    setEditIndex(null);
  };

  return { editIndex, working, setWorking, beginEdit, beginAdd, cancel };
}

function ListFields({
  fields,
  working,
  onChange,
  columns = 2,
}: {
  fields: { key: string; label: string }[];
  working: Record<string, string>;
  onChange: (item: Record<string, string>) => void;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-3 ${
        columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
      }`}
    >
      {fields.map((f) => (
        <Field key={f.key} label={f.label}>
          <TextInput
            value={working[f.key] ?? ""}
            onChange={(e) =>
              onChange({ ...working, [f.key]: e.target.value })
            }
          />
        </Field>
      ))}
    </div>
  );
}

export function EducationEditor({ lang }: { lang: Language }) {
  const { draft, addListItem, setListItem, removeListItem, moveItem } =
    useDraft();
  const items = draft[lang].education;
  const { applied, apply } = useSaveState();
  const { editIndex, working, setWorking, beginEdit, beginAdd, cancel } =
    useListEdit<CVData["education"][number]>();

  const saveCurrent = () => {
    if (!working) return;
    if (editIndex === null) {
      addListItem(lang, "education", working);
    } else {
      setListItem(lang, "education", editIndex, working);
    }
    apply();
    cancel();
  };

  const removeItem = (i: number) => {
    if (!window.confirm("Hapus pendidikan ini?")) return;
    removeListItem(lang, "education", i);
  };

  const moveItemBy = (i: number, offset: -1 | 1) => {
    moveItem(lang, "education", i, offset);
  };

  const fields = [
    { key: "degree", label: "Gelar / Jurusan" },
    { key: "institution", label: "Institusi" },
    { key: "period", label: "Periode" },
    { key: "note", label: "Catatan (opsional)" },
  ];

  return (
    <Card title="Pendidikan" subtitle="Klik Edit lalu Simpan untuk konfirmasi.">
      <div className="space-y-4">
        {items.map((edu, i) =>
          editIndex === i && working ? (
            <ItemCard key={i} index={i} title="Edit pendidikan">
              <ListFields
                fields={fields}
                working={working}
                onChange={(item) => setWorking(item as never)}
              />
              <ActionButtons
                editing
                onEdit={() => {}}
                onSave={saveCurrent}
                onCancel={cancel}
              />
            </ItemCard>
          ) : (
            <ItemCard
              key={i}
              index={i}
              title={edu.degree}
              onMoveUp={() => moveItemBy(i, -1)}
              onMoveDown={() => moveItemBy(i, 1)}
              canUp={i > 0}
              canDown={i < items.length - 1}
              onRemove={() => removeItem(i)}
            >
              <div className="text-[14px]">
                <p className="font-semibold text-[#221b3d]">{edu.degree}</p>
                <p className="text-[#6b6678]">{edu.institution}</p>
                <p className="text-[#3b3550]">
                  <span className="font-medium text-[#7c5cff]">
                    {edu.period}
                  </span>
                  {edu.note ? ` — ${edu.note}` : ""}
                </p>
              </div>
              <ActionButtons
                editing={false}
                onEdit={() => beginEdit(edu, i)}
                onSave={() => {}}
                onCancel={() => {}}
              />
            </ItemCard>
          )
        )}

        {editIndex === null && working ? (
          <ItemCard index={items.length} title="Pendidikan baru">
            <ListFields
              fields={fields}
              working={working}
              onChange={(item) => setWorking(item as never)}
            />
            <ActionButtons
              editing
              onEdit={() => {}}
              onSave={saveCurrent}
              onCancel={cancel}
            />
          </ItemCard>
        ) : null}

        <AddButton
          label="Tambah Pendidikan"
          onClick={() =>
            beginAdd({
              degree: "",
              institution: "",
              period: "",
              note: "",
            })
          }
        />
      </div>
      <SaveResult shown={applied} />
    </Card>
  );
}

export function CertificatesEditor({ lang }: { lang: Language }) {
  const { draft, addListItem, setListItem, removeListItem, moveItem } =
    useDraft();
  const items = draft[lang].certificates;
  const { applied, apply } = useSaveState();
  const { editIndex, working, setWorking, beginEdit, beginAdd, cancel } =
    useListEdit<CVData["certificates"][number]>();

  const saveCurrent = () => {
    if (!working) return;
    if (editIndex === null) {
      addListItem(lang, "certificates", working);
    } else {
      setListItem(lang, "certificates", editIndex, working);
    }
    apply();
    cancel();
  };

  const removeItem = (i: number) => {
    if (!window.confirm("Hapus sertifikasi ini?")) return;
    removeListItem(lang, "certificates", i);
  };

  const moveItemBy = (i: number, offset: -1 | 1) => {
    moveItem(lang, "certificates", i, offset);
  };

  const fields = [
    { key: "title", label: "Judul" },
    { key: "issuer", label: "Penerbit" },
    { key: "year", label: "Tahun" },
  ];

  return (
    <Card title="Sertifikasi" subtitle="Klik Edit lalu Simpan untuk konfirmasi.">
      <div className="space-y-4">
        {items.map((cert, i) =>
          editIndex === i && working ? (
            <ItemCard key={i} index={i} title="Edit sertifikasi">
              <ListFields
                columns={3}
                fields={fields}
                working={working}
                onChange={(item) => setWorking(item as never)}
              />
              <ActionButtons
                editing
                onEdit={() => {}}
                onSave={saveCurrent}
                onCancel={cancel}
              />
            </ItemCard>
          ) : (
            <ItemCard
              key={i}
              index={i}
              title={cert.title}
              onMoveUp={() => moveItemBy(i, -1)}
              onMoveDown={() => moveItemBy(i, 1)}
              canUp={i > 0}
              canDown={i < items.length - 1}
              onRemove={() => removeItem(i)}
            >
              <p className="text-[14px] font-semibold text-[#221b3d]">
                {cert.title}
              </p>
              <p className="text-[13px] text-[#6b6678]">
                {cert.issuer}
                <span className="font-medium text-[#7c5cff]">
                  {"  ·  "}
                  {cert.year}
                </span>
              </p>
              <ActionButtons
                editing={false}
                onEdit={() => beginEdit(cert, i)}
                onSave={() => {}}
                onCancel={() => {}}
              />
            </ItemCard>
          )
        )}

        {editIndex === null && working ? (
          <ItemCard index={items.length} title="Sertifikasi baru">
            <ListFields
              columns={3}
              fields={fields}
              working={working}
              onChange={(item) => setWorking(item as never)}
            />
            <ActionButtons
              editing
              onEdit={() => {}}
              onSave={saveCurrent}
              onCancel={cancel}
            />
          </ItemCard>
        ) : null}

        <AddButton
          label="Tambah Sertifikasi"
          onClick={() => beginAdd({ title: "", issuer: "", year: "" })}
        />
      </div>
      <SaveResult shown={applied} />
    </Card>
  );
}

export function LanguagesEditor({ lang }: { lang: Language }) {
  const { draft, addListItem, setListItem, removeListItem, moveItem } =
    useDraft();
  const items = draft[lang].languages;
  const { applied, apply } = useSaveState();
  const { editIndex, working, setWorking, beginEdit, beginAdd, cancel } =
    useListEdit<CVData["languages"][number]>();

  const saveCurrent = () => {
    if (!working) return;
    if (editIndex === null) {
      addListItem(lang, "languages", working);
    } else {
      setListItem(lang, "languages", editIndex, working);
    }
    apply();
    cancel();
  };

  const removeItem = (i: number) => {
    if (!window.confirm("Hapus bahasa ini?")) return;
    removeListItem(lang, "languages", i);
  };

  const moveItemBy = (i: number, offset: -1 | 1) => {
    moveItem(lang, "languages", i, offset);
  };

  const fields = [
    { key: "name", label: "Nama bahasa" },
    { key: "level", label: "Tingkat" },
  ];

  return (
    <Card title="Bahasa" subtitle="Klik Edit lalu Simpan untuk konfirmasi.">
      <div className="space-y-4">
        {items.map((ln, i) =>
          editIndex === i && working ? (
            <ItemCard key={i} index={i} title="Edit bahasa">
              <ListFields
                fields={fields}
                working={working}
                onChange={(item) => setWorking(item as never)}
              />
              <ActionButtons
                editing
                onEdit={() => {}}
                onSave={saveCurrent}
                onCancel={cancel}
              />
            </ItemCard>
          ) : (
            <ItemCard
              key={i}
              index={i}
              title={ln.name}
              onMoveUp={() => moveItemBy(i, -1)}
              onMoveDown={() => moveItemBy(i, 1)}
              canUp={i > 0}
              canDown={i < items.length - 1}
              onRemove={() => removeItem(i)}
            >
              <p className="text-[14px] text-[#6b6678]">
                {ln.name}
                <span className="font-medium text-[#7c5cff]">
                  {"  —  "}
                  {ln.level}
                </span>
              </p>
              <ActionButtons
                editing={false}
                onEdit={() => beginEdit(ln, i)}
                onSave={() => {}}
                onCancel={() => {}}
              />
            </ItemCard>
          )
        )}

        {editIndex === null && working ? (
          <ItemCard index={items.length} title="Bahasa baru">
            <ListFields
              fields={fields}
              working={working}
              onChange={(item) => setWorking(item as never)}
            />
            <ActionButtons
              editing
              onEdit={() => {}}
              onSave={saveCurrent}
              onCancel={cancel}
            />
          </ItemCard>
        ) : null}

        <AddButton
          label="Tambah Bahasa"
          onClick={() => beginAdd({ name: "", level: "" })}
        />
      </div>
      <SaveResult shown={applied} />
    </Card>
  );
}