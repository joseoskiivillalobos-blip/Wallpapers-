import React, { useState } from 'react';
import { Download, Sparkles, Smartphone, Monitor, Square, Loader2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { generateWallpaper, AspectRatio } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

const STYLES = [
  { id: 'none', name: 'No Style', prompt: '' },
  { id: 'realistic', name: 'Realistic', prompt: ', photorealistic, 8k, highly detailed, cinematic lighting' },
  { id: 'anime', name: 'Anime', prompt: ', anime style, studio ghibli, vibrant colors' },
  { id: 'cyberpunk', name: 'Cyberpunk', prompt: ', cyberpunk, neon lights, futuristic, high tech, dark atmosphere' },
  { id: 'fantasy', name: 'Fantasy', prompt: ', fantasy art, magical, ethereal, digital painting, concept art' },
  { id: 'minimalist', name: 'Minimalist', prompt: ', minimalist, clean lines, simple, flat design, vector art' },
  { id: 'abstract', name: 'Abstract', prompt: ', abstract, geometric shapes, fluid forms, modern art' },
  { id: 'nature', name: 'Nature', prompt: ', nature photography, national geographic, scenic, landscape' },
];

const RATIOS: { id: AspectRatio; name: string; icon: React.ElementType }[] = [
  { id: '9:16', name: 'Mobile', icon: Smartphone },
  { id: '16:9', name: 'Desktop', icon: Monitor },
  { id: '1:1', name: 'Square', icon: Square },
];

export default function WallpaperGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const fullPrompt = `${prompt}${selectedStyle.prompt}`;
      const imageBase64 = await generateWallpaper({
        prompt: fullPrompt,
        aspectRatio,
      });
      setGeneratedImage(imageBase64);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `wallpaper-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 grid lg:grid-cols-[400px_1fr] gap-8 h-full">
        
        {/* Controls Sidebar */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Wallpaper AI
            </h1>
            <p className="text-neutral-400 text-sm">
              Create stunning wallpapers for your devices in seconds.
            </p>
          </div>

          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Describe your wallpaper
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city in the clouds at sunset..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-32 transition-all placeholder:text-neutral-600"
              />
            </div>

            {/* Style Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Art Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left border ${
                      selectedStyle.id === style.id
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      aspectRatio === ratio.id
                        ? 'bg-neutral-800 border-indigo-500 text-indigo-400'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    <ratio.icon className="w-5 h-5" />
                    <span className="text-[10px] uppercase font-medium">{ratio.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm uppercase tracking-wide hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Wallpaper
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="relative bg-neutral-900/50 rounded-3xl border border-neutral-800 overflow-hidden flex items-center justify-center min-h-[500px] lg:min-h-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {generatedImage ? (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex items-center justify-center p-8"
              >
                <img
                  src={generatedImage}
                  alt="Generated Wallpaper"
                  className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl ${
                    aspectRatio === '9:16' ? 'h-full' : 'w-full'
                  }`}
                />
                <div className="absolute bottom-8 right-8 flex gap-2">
                  <button
                    onClick={handleGenerate}
                    className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-3 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors shadow-lg"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-8 max-w-sm"
              >
                <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                  <ImageIcon className="w-8 h-8 text-neutral-600" />
                </div>
                <h3 className="text-lg font-medium text-neutral-300 mb-2">Ready to Create</h3>
                <p className="text-neutral-500 text-sm">
                  Enter a prompt and choose your style to generate a unique wallpaper for your device.
                </p>
                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
