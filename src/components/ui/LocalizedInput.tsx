"use client";

import { LocalizedText } from "@/types/common";

type Props = {
  label: string;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
  required?: boolean;
  isMultiLang?: boolean;
};

// Single-language mode (default) shows one Azerbaijani-only input, matching
// the previous behavior. Multi-language mode expands into three separate
// inputs so the admin can type distinct AZ/EN/RU values directly.
const LOCALES: { key: keyof LocalizedText; label: string }[] = [
  { key: "az", label: "Azerbaijani" },
  { key: "en", label: "English" },
  { key: "ru", label: "Russian" },
  { key: "tr", label: "Turkish" },
];

export default function LocalizedInput({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
  isMultiLang = false,
}: Props) {
  function handleChange(locale: keyof LocalizedText, text: string) {
    onChange({ ...value, [locale]: text });
  }

  if (!isMultiLang) {
    return (
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {label}
        </label>
        <div className="mt-1.5">
          {/* {multiline ? (
            <textarea
              value={value.az}
              onChange={(e) => handleChange("az", e.target.value)}
              rows={2}
              required={required}
              className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400 resize-none"
            />
          ) : (
            <input
              type="text"
              value={value.az}
              onChange={(e) => handleChange("az", e.target.value)}
              required={required}
              className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400"
            />
          )} */}
          {multiline ? (
            <textarea
              value={value.az || value.en || value.ru || value.tr || ""}
              onChange={(e) => {
                const txt = e.target.value;
                onChange({ az: txt, en: txt, ru: txt, tr: txt });
              }}
              rows={2}
              required={required}
              className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400 resize-none"
            />
          ) : (
            <input
              type="text"
              value={value.az || value.en || value.ru || value.tr || ""}
              onChange={(e) => {
                const txt = e.target.value;
                onChange({ az: txt, en: txt, ru: txt, tr: txt });
              }}
              required={required}
              className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {label}
      </label>
      <div className="mt-1.5 space-y-2">
        {LOCALES.map(({ key, label: localeLabel }) => (
          <div key={key}>
            <span className="text-[11px] font-medium text-neutral-400">
              {localeLabel}
            </span>
            {multiline ? (
              <textarea
                value={value[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                rows={2}
                required={required && key === "az"}
                className="mt-1 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400 resize-none"
              />
            ) : (
              <input
                type="text"
                value={value[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                required={required && key === "az"}
                className="mt-1 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
