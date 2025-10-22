import React, { useState } from 'react'
import LanguageSelector from './components/LanguageSelector.jsx'
import { translateText } from './lib/fetcher.js'

export default function App() {
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('French')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [translation, setTranslation] = useState('')
  const [chat, setChat] = useState([])

  const canTranslate = text.trim().length > 0 && !loading

  async function onSubmit(e) {
    e.preventDefault()
    if (!canTranslate) return
    setError('')
    setLoading(true)
    try {
      const res = await translateText({ text, language })
      setTranslation(res.translation)
      setChat(prev => [...prev, { user: text, ai: res.translation }])
      setText('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err?.message || 'Something went wrong while translating.')
    } finally {
      setLoading(false)
    }
  }

  async function onSendFollowup() {
    if (!text.trim() || loading) return
    setError('')
    setLoading(true)
    try {
      const res = await translateText({ text, language })
      setChat(prev => [...prev, { user: text, ai: res.translation }])
      setText('')
    } catch (err) {
      setError(err?.message || 'Something went wrong while translating.')
    } finally {
      setLoading(false)
    }
  }

  function resetAll() {
    setText('')
    setLanguage('French')
    setTranslation('')
    setChat([])
    setError('')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pg-outer">
        {/* Header image: wrapper + img (separate classes) */}
        <div className="header-wrap">
          <img src="/images/header.png" alt="PollyGlot" className="header-img" />
        </div>

        <div className="pg-outer-body">
          {chat.length === 0 && (
            <section aria-labelledby="input-title" className="pg-card">
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <h2 id="input-title" className="pg-chip">Text to translate 👇</h2>
                  <textarea
                    className="pg-box min-h-[140px]"
                    placeholder="How are you?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading}
                    aria-label="Text to translate"
                  />
                </div>

                <div>
                  <div className="pg-chip">Select language 👇</div>
                  <LanguageSelector selected={language} onChange={setLanguage} disabled={loading} />
                </div>

                {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  className="pg-btn"
                  disabled={!canTranslate}
                  aria-disabled={!canTranslate}
                  aria-busy={loading ? 'true' : 'false'}
                >
                  {loading ? 'Translating…' : 'Translate'}
                </button>
              </form>
            </section>
          )}

          {chat.length > 0 && (
            <section className="pg-card animate-fade-in-up" aria-label="Conversation">
              <div className="space-y-4">
                <div className="bubble-info">
                  Select the language you want me to translate into, type your text and hit send!
                </div>

                {chat.map((turn, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="bubble bubble-user">{turn.user}</div>
                    <div className="bubble bubble-assist">{turn.ai}</div>
                  </div>
                ))}

                <div className="pg-row">
                  <input
                    className="pg-input"
                    type="text"
                    placeholder="Type your next message…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onSendFollowup())}
                    disabled={loading}
                    aria-label="Message input"
                  />
                  <button
                    type="button"
                    className="pg-send"
                    onClick={onSendFollowup}
                    disabled={loading || !text.trim()}
                    aria-label="Send"
                    title="Send"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 11.5l17-8a1 1 0 011.4 1.2l-4.3 16a1 1 0 01-1.7.5l-4.6-4.6-3.7 2.3a1 1 0 01-1.5-1.1l1.2-4.1-4.5-1.5a1 1 0 01-.3-1.7l.1-.1zM10.9 13.1l4.8 4.9 3-11.4-7.8 6.5z"/>
                    </svg>
                  </button>
                </div>

                <div className="pg-flags">
                  {[
                    { v: 'French',  img: '/images/fr.png', alt: 'French'  },
                    { v: 'Spanish', img: '/images/sp.png', alt: 'Spanish' },
                    { v: 'Japanese',img: '/images/jp.png', alt: 'Japanese'},
                  ].map(f => (
                    <button
                      key={f.v}
                      type="button"
                      className={`pg-flag ${language === f.v ? 'active' : ''}`}
                      onClick={() => setLanguage(f.v)}
                      title={f.alt}
                      aria-label={`Switch to ${f.alt}`}
                    >
                      <img src={f.img} alt={f.alt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button type="button" onClick={resetAll} className="pg-btn mt-2">
                  Start Over
                </button>

                {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
