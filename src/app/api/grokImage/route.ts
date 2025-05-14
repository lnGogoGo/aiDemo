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
    const completion = await openai.images.generate({
      model: "grok-2-image",
      prompt: message,
    })
    console.log('completion', completion, )
    return NextResponse.json({ reply: completion?.data?.[0].url })
  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', detail: error.message }, { status: 500 })
  }
}
