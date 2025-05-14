import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.Grok_API_KEY,
  baseURL: process.env.Grok_API_BASE
})
console.log('completion', openai, )

export async function POST(req: Request) {
  try {
    const { message, conversationHistory = [] } = await req.json()
    
    // Prepare messages array with conversation history
    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ]
    
    const completion = await openai.chat.completions.create({
      model: "grok-3-latest",
      messages,
    })
    
    // Get the assistant's response
    const assistantMessage = completion.choices[0].message
    
    // Return both the reply and updated conversation history
    return NextResponse.json({ 
      reply: assistantMessage.content,
      conversationHistory: [
        ...messages,
        { role: assistantMessage.role, content: assistantMessage.content }
      ]
    })
  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', detail: error.message }, { status: 500 })
  }
}
