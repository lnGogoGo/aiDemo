'use client'
import { useState, useRef, useEffect } from 'react'
import styles from './index.module.css';
import { marked } from 'marked';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type Model = {
  id: string;
  name: string;
};

const supportedModels: Model[] = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
  { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano' },
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
];

const renderMessageContent = (content: string) => {
  // 使用marked解析Markdown
  const htmlContent = marked(content);

  // 返回处理后的内容
  return <span dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(supportedModels[0].id)
  const [apiKey, setApiKey] = useState('')
  const [menuVisible, setMenuVisible] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [customModel, setCustomModel] = useState('')

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.querySelector(`.${styles.menuContent}`);
      if (menu && !menu.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 清空对话
  const clearChat = () => {
    setMessages([])
  }

  const handleSubmit = async () => {
    if (!input.trim()) return
    
    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      const headers = new Headers({
        'Content-Type': 'application/json',
      })
      if (apiKey) {
        headers.append('Authorization', `Bearer ${apiKey}`)
      }

      const modelToUse = customModel.trim() || selectedModel

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          model: modelToUse
        }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setMessages(prev => [
          ...prev, 
          { role: data.role || 'assistant', content: data.reply }
        ])
      } else {
        setMessages(prev => [
          ...prev, 
          { role: 'assistant', content: `错误: ${data.error || '请求失败'}` }
        ])
      }
    } catch (error) {
      console.error('聊天请求错误:', error)
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: '抱歉，发生了网络错误，请稍后再试。' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={styles.container}>
      <button 
        className={styles.menuButton}
        onClick={() => setMenuVisible(!menuVisible)}
      >
        ☰
      </button>
      <div className={`${styles.menuContent} ${menuVisible ? styles.show : ''}`}>
        <select
          className={styles.select}
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={isLoading}
        >
          {supportedModels.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>
        <input
          className={styles.apiKeyInput}
          type="text"
          placeholder="输入您的API密钥"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <input
          className={styles.apiKeyInput}
          type="text"
          placeholder="输入自定义模型名称"
          value={customModel}
          onChange={(e) => setCustomModel(e.target.value)}
        />
        <button
          className={styles.modelButton}
          onClick={clearChat}
          disabled={isLoading}
        >
          清空对话
        </button>
      </div>
      
      <div className={styles.header}>
        <div>智能助手</div>
      </div>
      
      <div ref={chatContainerRef} className={styles.chatContainer}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', margin: '20px 0' }}>
            发送消息开始对话吧
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`${styles.message} ${
                message.role === 'user' 
                  ? styles.userMessage 
                  : message.role === 'system' 
                    ? styles.systemMessage 
                    : styles.botMessage
              }`}
            >
              {renderMessageContent(message.content)}
            </div>
          ))
        )}
        {isLoading && (
          <div className={`${styles.message} ${styles.botMessage}`}>
            正在思考...
          </div>
        )}
      </div>
      
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入您的问题..."
          disabled={isLoading}
        />
        <button 
          className={styles.sendButton} 
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
        >
          发送
        </button>
      </div>
    </div>
  )
}
