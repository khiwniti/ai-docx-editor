import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI DOCX Editor — MCP-Driven Document Intelligence",
  description:
    "Enterprise-grade AI-powered DOCX editor with autonomous agent capabilities. Edit, review, and automate Microsoft Word documents using MCP-driven AI agents powered by SuperDoc.",
  keywords:
    "DOCX editor, AI document editor, MCP, Model Context Protocol, SuperDoc, document automation, AI agent",
  authors: [{ name: "AI DOCX Editor" }],
  openGraph: {
    title: "AI DOCX Editor — MCP-Driven Document Intelligence",
    description:
      "Edit and automate DOCX documents with AI agents powered by Model Context Protocol.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ai-docx-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-slate-50 dark:bg-dark-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
