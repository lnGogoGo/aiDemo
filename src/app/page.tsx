'use client'

import React, { useState } from 'react'
import AiDemo from './conponents/aidemo';
import styles from './page.module.css';

export default function Home() {
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className={styles.container}>
      <input className={styles.input} type="text" onBlur={handleChange} />
      {text ? <AiDemo text={text} /> : text}
    </div>
  );
}
