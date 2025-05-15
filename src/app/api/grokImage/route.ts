import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import fetch from 'node-fetch'

const openai = new OpenAI({
  apiKey: process.env.Grok_API_KEY,
  baseURL: process.env.Grok_API_BASE
})
console.log('completion', openai, )

async function convertImageUrlToBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl)
  const buffer = await response.buffer()
  const base64 = buffer.toString('base64')
  return `data:image/png;base64,${base64}`
}

export async function POST(req: Request) {
  try {
    const { message, conversationHistory = [] } = await req.json()
    console.log('message', message, );
    const completion = await openai.images.generate({
      model: "grok-2-image",
      prompt: message,
    })
    console.log('completion', completion, )
    
    const imageUrl = completion?.data?.[0].url;
    if (!imageUrl) {
      throw new Error('Image URL is undefined');
    }
    const imageBase64 = await convertImageUrlToBase64(imageUrl);
    
    // 为了保持一致的响应格式，我们返回reply和更新的conversationHistory
    return NextResponse.json({ 
      reply: imageBase64,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: imageBase64, isImage: true }
      ]
    })
  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', detail: error.message }, { status: 500 })
  }
}
