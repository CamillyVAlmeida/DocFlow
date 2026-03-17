import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PadraoIAProvider } from "@/context/PadraoIAContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ModalPadraoIA } from "@/components/ModalPadraoIA";

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
      <body className={inter.className}>
        <ThemeProvider>
          <PadraoIAProvider>
            <Nav />
            <main className="min-h-screen bg-slate-50 pb-12 dark:bg-slate-900">{children}</main>
            <Footer />
            <ModalPadraoIA />
          </PadraoIAProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
