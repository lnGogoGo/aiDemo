"use client";
import { useState } from "react";
import styles from "./index.module.css";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isImage, setIsImage] = useState(false);
  const handleSubmit = async () => {
    setIsImage(false);

    const res = await fetch("/api/grok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setResponse(data.reply);
  };

  const handleSubmitImage = async () => {
    const res = await fetch("/api/grokImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setIsImage(true);
    setResponse(data.reply);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.text}>grok单次询问问题</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything"
      />
      <button onClick={handleSubmit}>发送</button>
      <button onClick={handleSubmitImage}>生成图片</button>
      {!isImage ? (
        <div className={styles.result}>结果: {response}</div>
      ) : (
        <img src={response} alt="123" />
      )}
    </div>
  );
}
