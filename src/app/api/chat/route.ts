import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
  // apiKey: process.env.OPENAI_API_KEY_FORWARD,
  // baseURL: process.env.OPENAI_API_BASE
})
console.log('completion', openai, )


export async function POST(req: Request) {
  try {
    const { messages, model = 'gpt-3.5-turbo' } = await req.json()

    const completion = await openai.chat.completions.create({
      model,
      messages,
    })
    console.log('completion', completion, )
    return NextResponse.json({ 
      reply: completion.choices[0].message.content,
      role: completion.choices[0].message.role 
    })
  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', detail: error.message }, { status: 500 })
  }
}
