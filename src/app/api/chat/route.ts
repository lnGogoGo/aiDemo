import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    })

    return NextResponse.json({ reply: completion.choices[0].message.content })
  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', detail: error.message }, { status: 500 })
  }
}
