"use client";
import { useState } from "react";
import styles from "./index.module.css";

type Message = {
  role: string;
  content: string;
  isImage?: boolean;
};

export default function HomePage() {
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [isImage, setIsImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setIsImage(false);

    try {
      const res = await fetch("/api/grok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          conversationHistory
        }),
      });
      const data = await res.json();
      setConversationHistory(data.conversationHistory);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
      setConversationHistory([
        ...conversationHistory,
        { role: "user", content: input },
        { role: "assistant", content: "请求出错，请稍后再试" }
      ]);
      setInput("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitImage = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/grokImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          conversationHistory 
        }),
      });
      const data = await res.json();
      setIsImage(true);
      setConversationHistory(data.conversationHistory);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
      setConversationHistory([
        ...conversationHistory,
        { role: "user", content: input },
        { role: "assistant", content: "生成图片失败，请稍后再试" }
      ]);
      setInput("");
      setIsImage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grok AI 助手</h1>
      
      <div className={styles.chatContainer}>
        {conversationHistory.length > 0 ? (
          <>
            <div className={styles.messages}>
              {conversationHistory.map((message, index) => (
                <div 
                  key={index} 
                  className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                >
                  {message.isImage ? (
                    <img className={styles.image} src={message.content} alt="生成的图片" />
                  ) : (
                    <div>{message.content}</div>
                  )}
                </div>
              ))}
            </div>
            <button 
              className={styles.clearButton} 
              onClick={clearConversation}
            >
              清除对话
            </button>
          </>
        ) : (
          <div className={styles.emptyChat}>开始新的对话...</div>
        )}
      </div>
      
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题或描述..."
          disabled={isLoading}
        />
        
        <div className={styles.buttonContainer}>
          <button 
            className={`${styles.button} ${styles.primaryButton}`} 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && !isImage ? "处理中..." : "发送问题"}
          </button>
          
          <button 
            className={`${styles.button} ${styles.secondaryButton}`} 
            onClick={handleSubmitImage}
            disabled={isLoading}
          >
            {isLoading && isImage ? "生成中..." : "生成图片"}
          </button>
        </div>
      </div>
    </div>
  );
}
