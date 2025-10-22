import React, { useState } from 'react'

export default function ResultPanel({ original, translation, onReset }) {
  const [copied, setCopied] = useState(false)

  async function copyText() {
    try {
      await navigator.clipboard.writeText(translation)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // no-op
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <article className="border border-slate-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-ink-500 mb-2">Original text</h3>
        <p className="prose prose-slate max-w-none whitespace-pre-wrap text-ink-700">{original}</p>
      </article>

      <article className="border border-slate-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-ink-500 mb-2">Your translation</h3>
        <p className="prose prose-slate max-w-none whitespace-pre-wrap text-ink-900">{translation}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={copyText} className="btn btn-secondary" aria-live="polite">
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
          <button type="button" onClick={onReset} className="btn btn-secondary">
            Start over
          </button>
        </div>
      </article>
    </div>
  )
}
