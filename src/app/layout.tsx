import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "복약 알림",
  description: "Twilio 복약 알림 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
