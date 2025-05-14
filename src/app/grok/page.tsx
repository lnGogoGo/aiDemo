'use client'
import { useState } from 'react'
import styles from './index.module.css';

export default function HomePage() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')

  const handleSubmit = async () => {
    const res = await fetch('/api/grok', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })
    const data = await res.json()
    setResponse(data.reply)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.text}>grok单次询问问题</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything"
      />
      <button onClick={handleSubmit}>发送</button>
      <div className={styles.result}>结果: {response}</div>
    </div>
  )
}
