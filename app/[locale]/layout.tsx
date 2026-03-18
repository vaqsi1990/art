import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import PageTransition from "@/components/PageTransition";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";

import "../globals.css";

const locales = ['en', 'ka'] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Art",
  description: "Art gallery"
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  const messages = await getMessages({locale});

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Cursor />
          <PageTransition>
            <Nav />
            {children}
            <Footer />
          </PageTransition>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

