'use client'
import { useState } from 'react'

export default function HomePage() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')

  const handleSubmit = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })
    const data = await res.json()
    setResponse(data.reply)
  }

  return (
    <div>
      <h1>Chat with GPT</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything"
      />
      <button onClick={handleSubmit}>Send</button>
      <p>Response: {response}</p>
    </div>
  )
}
