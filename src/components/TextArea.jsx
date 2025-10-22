import React from 'react'

export default function TextArea({ id, label, value, onChange, disabled, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <textarea
        id={id}
        name={id}
        aria-label={label}
        className="block w-full rounded-lg border-slate-300 focus:border-brand-500 focus:ring-brand-500 placeholder-slate-400
                   min-h-[140px] text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      <p className="subtle mt-2">Max ~5000 chars recommended.</p>
    </div>
  )
}
