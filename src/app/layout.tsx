import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { PadraoIAProvider } from "@/context/PadraoIAContext";
import { ModalPadraoIA } from "@/components/ModalPadraoIA";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocFlow - Sistema de Documentação",
  description: "Geração de documentação para QA, DEVs e Requisitos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <PadraoIAProvider>
          <Nav />
          <main className="min-h-screen pb-16">{children}</main>
          <ModalPadraoIA />
        </PadraoIAProvider>
      </body>
    </html>
  );
}
