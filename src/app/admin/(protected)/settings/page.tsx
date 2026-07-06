"use client";

import { useEffect, useState } from "react";
import {
  getRestaurantSettings,
  updateRestaurantSettings,
} from "@/services/settings.service";
import { RestaurantSettings } from "@/types/settings";
import LocalizedInput from "@/components/ui/LocalizedInput";
import ImageUpload from "@/components/ui/ImageUpload";
import { autoFillLocalizedText } from "@/lib/translate";
import { Locale } from "@/types/common";
import { LOCALES, LOCALE_LABELS } from "@/constants/languages";

const ADMIN_LABELS: Record<Locale, Record<string, string>> = {
  az: {
    heading: "Restoran Ayarları", banner: "Fon Şəkli", logo: "Restoran Loqosu",
    name: "Restoran Adı", nameHint: "Restoran adı bütün dillərdə eynidir.",
    description: "Təsvir", serviceCharge: "Menyuda Servis Haqqını Göstər",
    servicePercent: "Servis Haqqı (%)", address: "Ünvan",
    addressPlaceholder: "məs. Nizami küç. 12, Bakı", mapUrl: "Google Maps Embed URL",
    mapPlaceholder: "Google Maps 'Embed a map' bağlantısını yapışdırın",
openingTime: "Açılış Vaxtı", closingTime: "Bağlanış Vaxtı",
    showWifi: "Wi-Fi Məlumatını Göstər", wifiName: "Wi-Fi Adı", wifiPassword: "Wi-Fi Şifrəsi",
    instagram: "Instagram URL", tiktok: "TikTok URL", whatsapp: "WhatsApp Linki",
    linkedin: "LinkedIn URL", facebook: "Facebook URL", titleColor: "Başlıq Rəngi",
    productNameColor: "Məhsul Adı Rəngi", themeColor: "Tema Fonu",
    save: "Yadda Saxla", saving: "Saxlanılır...", reset: "Defoltu Bərpa Et",
    saved: "Ayarlar saxlanıldı.",
  },
  en: {
    heading: "Restaurant Settings", banner: "Background Banner", logo: "Restaurant Logo",
    name: "Restaurant Name", nameHint: "The restaurant name stays the same across all languages, by design.",
    description: "Description", serviceCharge: "Show Service Charge on menu",
    servicePercent: "Service Charge (%)", address: "Address",
    addressPlaceholder: "e.g. 12 Nizami St, Baku", mapUrl: "Google Maps Embed URL",
    mapPlaceholder: "Paste the src= link from Google Maps 'Embed a map'",
openingTime: "Opening Time", closingTime: "Closing Time",
    showWifi: "Show Wi-Fi Info", wifiName: "Wi-Fi Network Name", wifiPassword: "Wi-Fi Password",
    instagram: "Instagram URL", tiktok: "TikTok URL", whatsapp: "WhatsApp Link",
    linkedin: "LinkedIn URL", facebook: "Facebook URL", titleColor: "Title Color",
    productNameColor: "Product Name Color", themeColor: "Theme Background",
    save: "Save Settings", saving: "Saving...", reset: "Reset to Default",
    saved: "Settings saved.",
  },
  ru: {
    heading: "Настройки ресторана", banner: "Фоновый баннер", logo: "Логотип ресторана",
    name: "Название ресторана", nameHint: "Название ресторана одинаково на всех языках.",
    description: "Описание", serviceCharge: "Показывать сервисный сбор в меню",
    servicePercent: "Сервисный сбор (%)", address: "Адрес",
    addressPlaceholder: "напр. ул. Низами 12, Баку", mapUrl: "Ссылка Google Maps Embed",
    mapPlaceholder: "Вставьте src= ссылку из Google Maps «Embed a map»",
 openingTime: "Время открытия", closingTime: "Время закрытия",
    showWifi: "Показывать данные Wi-Fi", wifiName: "Имя сети Wi-Fi", wifiPassword: "Пароль Wi-Fi",
    instagram: "Instagram URL", tiktok: "TikTok URL", whatsapp: "Ссылка WhatsApp",
    linkedin: "LinkedIn URL", facebook: "Facebook URL", titleColor: "Цвет заголовка",
    productNameColor: "Цвет названия блюда", themeColor: "Фон темы",
    save: "Сохранить", saving: "Сохранение...", reset: "Сбросить по умолчанию",
    saved: "Настройки сохранены.",
  },
  tr: {
    heading: "Restoran Ayarları", banner: "Arkaplan Banner'ı", logo: "Restoran Logosu",
    name: "Restoran Adı", nameHint: "Restoran adı tüm dillerde aynı kalır.",
    description: "Açıklama", serviceCharge: "Menüde Servis Ücretini Göster",
    servicePercent: "Servis Ücreti (%)", address: "Adres",
    addressPlaceholder: "örn. Nizami Cad. 12, Bakü", mapUrl: "Google Maps Embed URL",
    mapPlaceholder: "Google Maps 'Embed a map' bağlantısını yapıştırın",
    openingTime: "Açılış Saati", closingTime: "Kapanış Saati",
    showWifi: "Wi-Fi Bilgisini Göster", wifiName: "Wi-Fi Ağ Adı", wifiPassword: "Wi-Fi Şifresi",
    instagram: "Instagram URL", tiktok: "TikTok URL", whatsapp: "WhatsApp Bağlantısı",
    linkedin: "LinkedIn URL", facebook: "Facebook URL", titleColor: "Başlık Rengi",
    productNameColor: "Ürün Adı Rengi", themeColor: "Tema Arkaplanı",
    save: "Kaydet", saving: "Kaydediliyor...", reset: "Varsayılana Sıfırla",
    saved: "Ayarlar kaydedildi.",
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<Locale>("az");
  const t = ADMIN_LABELS[activeTab];

  useEffect(() => {
    getRestaurantSettings().then(setSettings);
  }, []);

  function handleReset() {
    if (settings) {
      setSettings({ ...settings, titleColor: "#171717", productNameColor: "#262626", themeColor: "#ffffff" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setSavedMessage(false);
    const translatedDescription = await autoFillLocalizedText(settings.description.az);
    await updateRestaurantSettings({ ...settings, description: translatedDescription });
    setIsSaving(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  }

  if (!settings) return <p className="text-sm text-neutral-400">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t.heading}</h1>
        <div className="flex items-center gap-1 bg-white rounded-full border border-neutral-200 p-1">
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setActiveTab(code)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                activeTab === code ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"
              }`}
              aria-label={LOCALE_LABELS[code]}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-lg space-y-4">
        <ImageUpload label={t.banner} value={settings.bannerUrl} onChange={(bannerUrl) => setSettings({ ...settings, bannerUrl })} />
        <ImageUpload label={t.logo} value={settings.logoUrl} onChange={(logoUrl) => setSettings({ ...settings, logoUrl })} />
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.name}</label>
          <input type="text" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
          <p className="mt-1 text-xs text-neutral-400">{t.nameHint}</p>
        </div>

        <LocalizedInput label={t.description} value={settings.description} onChange={(description) => setSettings({ ...settings, description })} multiline />

    <div className="pt-2 border-t border-neutral-100 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.openingTime}</label>
            <input type="time" step="60" value={settings.openingTime || ""} onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
              className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.closingTime}</label>
            <input type="time" step="60" value={settings.closingTime || ""} onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
              className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
          </div>
        {/* </div>

        <div className="pt-2 border-t border-neutral-100">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={settings.serviceChargeEnabled || false} onChange={(e) => setSettings({ ...settings, serviceChargeEnabled: e.target.checked })} className="rounded" />
            {t.serviceCharge}
          </label>
          {settings.serviceChargeEnabled && (
            <div className="mt-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.servicePercent}</label>
              <input type="number" min="0" max="100" value={settings.serviceChargePercent || 0} onFocus={(e) => e.target.select()}
                onChange={(e) => setSettings({ ...settings, serviceChargePercent: Number(e.target.value) })}
                className="mt-1.5 w-24 text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
            </div>
          )}
        </div> */}
        </div>

<div className="pt-2 border-t border-neutral-100">
  <label className="flex items-center gap-2 text-sm font-medium">
    <input type="checkbox" checked={settings.showWifi || false} onChange={(e) => setSettings({ ...settings, showWifi: e.target.checked })} className="rounded" />
    {t.showWifi}
  </label>
  {settings.showWifi && (
    <div className="mt-2 grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.wifiName}</label>
        <input type="text" value={settings.wifiName || ""} onChange={(e) => setSettings({ ...settings, wifiName: e.target.value })}
          className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.wifiPassword}</label>
        <input type="text" value={settings.wifiPassword || ""} onChange={(e) => setSettings({ ...settings, wifiPassword: e.target.value })}
          className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
      </div>
    </div>
  )}
</div>

<div className="pt-2 border-t border-neutral-100">
  <label className="flex items-center gap-2 text-sm font-medium">
    <input type="checkbox" checked={settings.serviceChargeEnabled || false} onChange={(e) => setSettings({ ...settings, serviceChargeEnabled: e.target.checked })} className="rounded" />
    {t.serviceCharge}
  </label>
  {settings.serviceChargeEnabled && (
    <div className="mt-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.servicePercent}</label>
      <input type="number" min="0" max="100" value={settings.serviceChargePercent || 0} onFocus={(e) => e.target.select()}
        onChange={(e) => setSettings({ ...settings, serviceChargePercent: Number(e.target.value) })}
        className="mt-1.5 w-24 text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
    </div>
  )}
</div>

        <div className="pt-2 border-t border-neutral-100">
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.address}</label>
          <input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} placeholder={t.addressPlaceholder}
            className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.mapUrl}</label>
          <input type="text" value={settings.mapEmbedUrl} onChange={(e) => setSettings({ ...settings, mapEmbedUrl: e.target.value })} placeholder={t.mapPlaceholder}
            className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.instagram}</label>
            <input type="text" value={settings.socials.instagram} onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, instagram: e.target.value } })}
              className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.tiktok}</label>
            <input type="text" value={settings.socials.tiktok} onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, tiktok: e.target.value } })}
              className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.whatsapp}</label>
            <input type="text" value={settings.socials.whatsapp} onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, whatsapp: e.target.value } })}
              placeholder="e.g. https://wa.me/994501234567" className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.linkedin}</label>
            <input type="text" value={settings.socials.linkedin} onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, linkedin: e.target.value } })}
              className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.facebook}</label>
            <input type="text" value={settings.socials.facebook} onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, facebook: e.target.value } })}
              className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400" />
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.titleColor}</label>
            <input type="color" value={settings.titleColor || "#171717"} onChange={(e) => setSettings({ ...settings, titleColor: e.target.value })}
              className="mt-1.5 w-full h-9 rounded-lg border border-neutral-200 cursor-pointer" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.productNameColor}</label>
            <input type="color" value={settings.productNameColor || "#262626"} onChange={(e) => setSettings({ ...settings, productNameColor: e.target.value })}
              className="mt-1.5 w-full h-9 rounded-lg border border-neutral-200 cursor-pointer" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t.themeColor}</label>
            <input type="color" value={settings.themeColor || "#ffffff"} onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
              className="mt-1.5 w-full h-9 rounded-lg border border-neutral-200 cursor-pointer" />
          </div>
        </div>

        {savedMessage && <p className="text-xs text-green-600">{t.saved}</p>}

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={isSaving} className="flex-1 bg-neutral-900 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors">
            {isSaving ? t.saving : t.save}
          </button>
          <button type="button" onClick={handleReset} disabled={isSaving} className="border border-neutral-200 text-neutral-600 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-60 transition-colors">
            {t.reset}
          </button>
        </div>
      </form>
    </div>
  );
}