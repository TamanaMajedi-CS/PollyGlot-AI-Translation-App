import React from 'react'

const LANGS = [
  { value: 'French',  label: 'French',  flag: '/images/fr.png', alt: 'France flag'  },
  { value: 'Spanish', label: 'Spanish', flag: '/images/sp.png', alt: 'Spain flag'   },
  { value: 'Japanese',label: 'Japanese',flag: '/images/jp.png', alt: 'Japan flag'   },
]

export default function LanguageSelector({ selected, onChange, disabled }) {
  return (
    <div role="radiogroup" aria-label="Select language" className="space-y-3">
      {LANGS.map((lang) => {
        const id = `lang-${lang.value.toLowerCase()}`
        return (
          <label key={lang.value} htmlFor={id} className="flex items-center gap-3 cursor-pointer">
            <input
              id={id}
              type="radio"
              name="language"
              value={lang.value}
              className="h-4 w-4 text-[#0B5FAE] focus:ring-[#0B5FAE]"
              checked={selected === lang.value}
              onChange={() => onChange(lang.value)}
              disabled={disabled}
            />
            <span className="text-[16px] font-semibold text-slate-900">{lang.label}</span>
            <img src={lang.flag} alt={lang.alt} className="w-6 h-4 rounded-[2px] border border-slate-200 object-cover" />
          </label>
        )
      })}
    </div>
  )
}
