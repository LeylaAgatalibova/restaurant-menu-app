import { LocalizedText } from "./common";

export type SocialLinks = {
  instagram: string;
  tiktok: string;
  whatsapp: string;
  linkedin: string;
  facebook: string;
};

export type RestaurantSettings = {
  name: string;
  description: LocalizedText;
  logoUrl: string | null;
  bannerUrl: string | null;
  serviceChargeEnabled: boolean;
  serviceChargePercent: number;
  address: string;
  mapEmbedUrl: string;
openingTime: string;
  closingTime: string;
  showWifi: boolean;
  wifiName: string;
  wifiPassword: string;
  socials: SocialLinks;
  titleColor: string;
  productNameColor: string;
  themeColor: string;
};
