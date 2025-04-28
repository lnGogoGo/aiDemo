import React from 'react';
import { usePollinationsImage } from '@pollinations/react';

const AiDemo = ({ text }: { text: string }) => {
  const imageUrl = usePollinationsImage(text, {
    width: 1024,
    height: 1024,
    seed: 42,
    model: 'flux',
    nologo: true,
  });

  return (
    <div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Generated image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AiDemo;
