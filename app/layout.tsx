import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice Phone Assistant",
  description: "Control your phone with voice commands",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
