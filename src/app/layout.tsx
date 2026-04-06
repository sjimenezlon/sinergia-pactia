import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SinergIA: IA y Analitica | Pactia x NODO EAFIT",
  description: "Programa de formacion en Inteligencia Artificial y Analitica de datos para Pactia. Sesion 1: Entender - Fundamentos de IA y Big Data.",
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
