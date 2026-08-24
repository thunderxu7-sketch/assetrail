import { locale as getRootLocale } from "next/root-params";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const locale = await getRootLocale();
  if (!isLocale(locale)) notFound();
  return locale;
}
