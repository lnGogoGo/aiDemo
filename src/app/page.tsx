'use client'

import React, { useState } from 'react'
import styles from './page.module.css';
import AiDemo from './conponents/aidemo';

export default function Home() {
  const [text, setText] = useState("");

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setText(e.target.value);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>输入场景:</label>
      <input className={styles.input} onBlur={handleChange} />
  
      {text ? <div className={styles.text}>内容：{text}</div> : null}
      {text ? <AiDemo text={text} /> : text}
    </div>
  );
}
