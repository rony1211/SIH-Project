export const locales = [
  'en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa',
  'or', 'as', 'ur', 'sa', 'sd', 'ks', 'ne', 'mni', 'sat', 'brx', 'doi', 'mai', 'kok'
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const languageNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ',
  or: 'ଓଡ଼ିଆ',
  as: 'অসমীয়া',
  ur: 'اردو',
  sa: 'संस्कृतम्',
  sd: 'سنڌي',
  ks: 'كٲشُر',
  ne: 'नेपाली',
  mni: 'মৈতৈলোন্',
  sat: 'ᱥᱟᱱᱛᱟᱲᱤ',
  brx: 'बड़ो',
  doi: 'डोगरी',
  mai: 'मैथिली',
  kok: 'कोंकणी'
};

export const rtlLocales: Locale[] = ['ur', 'sd', 'ks'];

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
