import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { RestaurantSettings } from "@/types/settings";

// This app serves exactly one restaurant, so instead of a full collection
// we use a single fixed document: settings/restaurant. If this ever grows
// into multi-tenant SaaS, this is the one place that would change shape
// (e.g. settings/{restaurantId}) - everything else stays the same.
const SETTINGS_DOC_PATH = ["settings", "restaurant"] as const;

const DEFAULT_SETTINGS: RestaurantSettings = {
  name: "My Restaurant",
  description: { az: "", en: "", ru: "", tr: "" },
  logoUrl: null,
  bannerUrl: null,
  serviceChargeEnabled: false,
  serviceChargePercent: 10,
  address: "",
  mapEmbedUrl: "",
  openingTime: "09:00",
  closingTime: "23:00",
  showWifi: false,
  wifiName: "",
  wifiPassword: "",
  socials: { instagram: "", tiktok: "", whatsapp: "", linkedin: "", facebook: "" },
  titleColor: "#171717",
  productNameColor: "#171717",
  themeColor: "#fafafa",
};

export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  const snapshot = await getDoc(doc(db, ...SETTINGS_DOC_PATH));
  if (!snapshot.exists()) return DEFAULT_SETTINGS;
  return snapshot.data() as RestaurantSettings;
}

export function subscribeToRestaurantSettings(
  onChange: (settings: RestaurantSettings) => void
) {
  return onSnapshot(doc(db, ...SETTINGS_DOC_PATH), (snapshot) => {
    onChange(snapshot.exists() ? (snapshot.data() as RestaurantSettings) : DEFAULT_SETTINGS);
  });
}

export async function updateRestaurantSettings(
  settings: RestaurantSettings
): Promise<void> {
  // setDoc with merge:true creates the document on the very first save
  // and updates it on every save after that - no separate "create" step.
  await setDoc(doc(db, ...SETTINGS_DOC_PATH), settings, { merge: true });
}
