import type { ReactNode } from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium uppercase tracking-wider text-[#6d4fc4]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#e3def0] bg-white px-3 py-2 text-[14px] text-[#221b3d] outline-none transition focus:border-[#7c5cff] focus:ring-2 focus:ring-[#7c5cff]/20";

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${className ?? ""}`} />;
}

export function TextareaInput({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputClass} resize-y ${className ?? ""}`}
    />
  );
}

export function IconButton({
  onClick,
  disabled,
  danger,
  label,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`flex h-7 w-7 items-center justify-center rounded-full border transition disabled:pointer-events-none disabled:opacity-35 ${
        danger
          ? "border-transparent text-[#c0392b] hover:bg-[#fdecea]"
          : "border-[#e3def0] text-[#6b6678] hover:bg-[#f2effa]"
      }`}
    >
      {children}
    </button>
  );
}

export function ItemCard({
  index,
  title,
  note,
  onMoveUp,
  onMoveDown,
  canUp,
  canDown,
  onRemove,
  children,
}: {
  index: number;
  title: string;
  note?: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canUp?: boolean;
  canDown?: boolean;
  onRemove?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e3def0] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 text-[13px] font-semibold text-[#221b3d]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2effa] text-[11px] font-bold text-[#6d4fc4]">
            {index + 1}
          </span>
          <span className="truncate">{title}</span>
        </p>
        <div className="flex shrink-0 items-center gap-1">
          {onMoveUp && (
            <IconButton label="Naik" onClick={onMoveUp} disabled={!canUp}>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="m5 15 7-7 7 7" />
              </svg>
            </IconButton>
          )}
          {onMoveDown && (
            <IconButton label="Turun" onClick={onMoveDown} disabled={!canDown}>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="m5 9 7 7 7-7" />
              </svg>
            </IconButton>
          )}
          {onRemove && (
            <IconButton label="Hapus" onClick={onRemove} danger>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </IconButton>
          )}
        </div>
      </div>
      {note && (
        <p className="mb-3 text-[12px] italic text-[#9892a8]">{note}</p>
      )}
      {children}
    </div>
  );
}

export function AddButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#cfc6e8] px-4 py-3 text-[13px] font-medium text-[#6d4fc4] transition hover:border-[#7c5cff] hover:bg-white"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
      {label}
    </button>
  );
}

export function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e3def0] bg-white p-4 shadow-sm sm:p-6">
      {title && (
        <h2 className="font-display text-lg font-bold text-[#221b3d]">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-0.5 text-[13px] text-[#9892a8]">{subtitle}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function ActionButtons({
  editing,
  onEdit,
  onSave,
  onCancel,
  saving,
  editLabel = "Edit",
  saveLabel = "Simpan",
  cancelLabel = "Batal",
}: {
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  editLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
}) {
  if (!editing) {
    return (
      <div className="mt-4">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e3def0] px-4 text-[13px] font-semibold text-[#6d4fc4] transition hover:border-[#7c5cff]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
          {editLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-[#e3def0] pt-3">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#7c5cff] px-5 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        {saving ? "Menyimpan…" : saveLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-9 items-center rounded-lg border border-[#e3def0] px-4 text-[13px] font-medium text-[#6b6678] transition hover:bg-[#f2effa]"
      >
        {cancelLabel}
      </button>
    </div>
  );
}

export function SaveResult({ shown }: { shown: boolean }) {
  if (!shown) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Tersimpan di server ✓
    </span>
  );
}