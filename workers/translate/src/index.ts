
import type { ExecutionContext } from '@cloudflare/workers-types'

export interface Env {
  OPENAI_API_KEY: string
}

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini' 


type ChatCompletionResponse = {
  choices: Array<{
    message?: { content?: string | null }
  }>
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    // CORS (reflect origin for Pages)
    const origin = request.headers.get('Origin') || '*'
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    } as const

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (url.pathname !== '/api/translate') {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    try {
      // Do NOT use generics with request.json()
      const { text, language } = (await request.json()) as { text?: string; language?: string }

      if (!text || !language) {
        return new Response(JSON.stringify({ error: 'Missing text or language' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
      }

      const sys = `You are a precise translator. Translate the following text into ${language}. Preserve meaning and tone. Do not add commentary.`

      const body = {
        model: MODEL,
        temperature: 0.5,
        max_tokens: 100,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: String(text) },
        ],
      }

      const aiRes = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!aiRes.ok) {
        const errText = await aiRes.text()
        return new Response(JSON.stringify({ error: `OpenAI error: ${errText}` }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
      }

      // Tell TS what the JSON looks like
      const data = (await aiRes.json()) as Partial<ChatCompletionResponse>

      const choice = data?.choices?.[0]?.message?.content?.toString().trim()
      if (!choice) {
        return new Response(JSON.stringify({ error: 'No completion returned' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
      }

      const translation = choice.replace(/^\s+|\s+$/g, '')

      return new Response(JSON.stringify({ translation }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err?.message || 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }
  },
}
