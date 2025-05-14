import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.Grok_API_KEY,
  baseURL: process.env.Grok_API_BASE
})
console.log('completion', openai, )

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    console.log('message', message, );
    const completion = await openai.chat.completions.create({
      model: "grok-3-latest",
      messages: [{ role: 'user', content: message }],
    })
    console.log('completion', completion, )
    return NextResponse.json({ reply: completion.choices[0].message.content })
  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', detail: error.message }, { status: 500 })
  }
}
