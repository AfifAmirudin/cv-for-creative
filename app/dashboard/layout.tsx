import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard CV Kreatif",
  description: "Kelola isi dan tema Curriculum Vitae kreatif.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}