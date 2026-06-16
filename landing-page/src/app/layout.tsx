import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Competidora Vidros - Vidraçaria no Rio de Janeiro (Penha e Entorno)",
    template: "%s | Competidora Vidros"
  },
  description: "Vidraçaria na Penha, Rio de Janeiro. Especialistas em Box Blindex, Portas e Janelas de Vidro, Cortinas de Vidro e Manutenção. Mais de 30 anos de experiência com qualidade e segurança.",
  keywords: ["Vidraçaria Rio de Janeiro", "Vidraçaria Penha RJ", "Box Blindex RJ", "Cortina de Vidro RJ", "Vidros sob medida", "Instalação de Vidros RJ"],
  openGraph: {
    title: "Competidora Vidros - Soluções em Vidros no Rio de Janeiro",
    description: "Referência em vidraçaria na Penha, RJ. Box Blindex, Portas, Janelas e Cortinas de Vidro com o melhor orçamento do Rio.",
    url: "https://vidroscompetidora.com.br",
    siteName: "Competidora Vidros",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-WWXBN9XXKP"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-WWXBN9XXKP');
        `}
      </Script>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} font-sans antialiased bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
