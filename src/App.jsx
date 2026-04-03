import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setImageUrl(null);
    setError(null);

    try {
      const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate image. Please try again.');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      <div className="background-glow blur-1"></div>
      <div className="background-glow blur-2"></div>

      <div className="glass-panel">
        <h1 className="title">AI Image Generator</h1>
        <p className="subtitle">Bring your imagination to life.</p>

        <div className="input-group">
          <input
            type="text"
            className="prompt-input"
            placeholder="A futuristic cyberpunk city at sunset..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGenerate();
            }}
            disabled={isGenerating}
          />
          <button
            className={`generate-btn ${isGenerating ? 'generating' : ''}`}
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="image-display-section">
          {isGenerating && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Crafting your vision...</p>
            </div>
          )}

          {!isGenerating && imageUrl && (
            <div className="image-wrapper">
              <img src={imageUrl} alt="Generated" className="generated-image" />
            </div>
          )}

          {!isGenerating && error && (
            <div className="placeholder">
              <div className="placeholder-icon">⚠️</div>
              <p style={{ color: '#ff6b6b' }}>{error}</p>
            </div>
          )}

          {!isGenerating && !imageUrl && !error && (
            <div className="placeholder">
              <div className="placeholder-icon">✨</div>
              <p>Your generated image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
