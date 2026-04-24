import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SinergIA: IA y Analítica | Pactia x NODO EAFIT · Abril 2026",
  description: "Programa de formación en Inteligencia Artificial y Analítica de datos para Pactia. Sesión 1: Entender — Fundamentos de IA, Big Data y GenAI aplicados al negocio inmobiliario. Actualizado abril 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
