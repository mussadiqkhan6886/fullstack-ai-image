import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image to Text AI generator",
  description: "Image to Text AI generator created in nextjs and expressjs using gemini ai api",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
