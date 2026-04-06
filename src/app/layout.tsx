import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PadraoIAProvider } from "@/context/PadraoIAContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocFlow - Sistema de Documentação",
  description: "Geração de documentação para QA, Suporte e Requisitos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <ThemeProvider>
          <PadraoIAProvider>
            <AuthProvider>
              <Nav />
              <main className="flex min-h-0 flex-1 flex-col bg-slate-50 pb-6 dark:bg-slate-900">{children}</main>
              <Footer />
            </AuthProvider>
          </PadraoIAProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
