"use client";

import Link from "next/link";
import { signIn, signOut } from "next-auth/react";

export function SignInView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2effa] px-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-[#e3def0] bg-white p-8 shadow-sm">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-[#7c5cff]">
          Dashboard CV Kreatif
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#221b3d]">
          Masuk untuk mengelola CV
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6b6678]">
          Dashboard hanya dapat diakses oleh administrator yang terotorisasi.
          Masuk dengan akun GitHub yang didaftarkan sebagai administrator untuk
          melanjutkan.
        </p>
        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#221b3d] px-5 text-[14px] font-semibold text-white transition hover:opacity-90"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .31.22.7.83.57A12 12 0 0 0 12 .3Z" />
          </svg>
          Masuk dengan GitHub
        </button>
        <p className="mt-4 text-center text-[12px] text-[#9892a8]">
          Kembali ke{" "}
          <Link href="/" className="font-medium text-[#6d4fc4] hover:underline">
            halaman CV publik
          </Link>
        </p>
      </div>
    </div>
  );
}

export function DeniedView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2effa] px-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-[#f3d9d4] bg-white p-8 shadow-sm">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-[#c0392b]">
          Akses Ditolak
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#221b3d]">
          Bukan administrator
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6b6678]">
          Akun GitHub yang sedang masuk tidak terdaftar sebagai administrator
          CV ini. Pengeditan hanya diperbolehkan untuk satu akun administrator
          yang dikonfigurasi di server.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/dashboard" })}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e3def0] px-5 text-[13px] font-medium text-[#6b6678] transition hover:bg-[#f2effa]"
          >
            Keluar
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#221b3d] px-5 text-[13px] font-semibold text-white transition hover:opacity-90"
          >
            Lihat CV publik
          </Link>
        </div>
      </div>
    </div>
  );
}