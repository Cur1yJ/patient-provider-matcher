import './globals.css';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Provider Matcher",
  description: "Matches patients to providers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
