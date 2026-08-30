import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, AlertCircle, Send, Sparkles, Heart, Search } from 'lucide-react';
import { useChoose } from '../Hooks/useChoose';
import { useDispatch } from 'react-redux';
import { setIsBookmarked } from '../Redux/choose.slice';
import PopularModes from './PopularModes';

const POPULAR_MODES = [
  'Romance', 'Sad', 'Motivational', 'Dark', 'Fantasy',
  'Philosophical', 'Anime', 'Custom'
];

const POPULAR_GENRES = [
  "High Fantasy",
  "Sci-Fi & Cyberpunk",
  "Mystery & Thriller",
  "Contemporary Romance",
  "Dark Horror",
  "Historical Fiction",
  "Lyrical Poetry",
  "Free Verse",
  "Dystopian",
  "Action & Adventure",
  "Mythology",
  "Magical Realism"
];

const CreationWorkspace = ({ expectedFormat }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Configuration States (when currentCreation is null)
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedGenres, setselectedGenres] = useState('');
  const [promptText, setPromptText] = useState('');

  // Refinement States (when currentCreation is active)
  const [followUpText, setFollowUpText] = useState('');
  const [copied, setCopied] = useState(false);

  const {
    loading,
    error,
    currentCreation,
    writeFresh,
    refineStory,
    resetChoose
  } = useChoose();

  // Reset the active creation on component mount to ensure a clean workflow when entering the studio
  useEffect(() => {
    resetChoose();
  }, []);

  const handleGenerate = async () => {
    if (!promptText.trim()) return;
    try {
      await writeFresh({
        format: expectedFormat === 'poetry' ? 'poetry' : 'story',
        mood: selectedMode || 'creative',
        genre: selectedGenres || 'freestyle',
        userPrompt: promptText.trim()
      });
    } catch (err) {
      console.error("Generation failed:", err);
    }
  };

  const handleCopy = () => {
    if (!currentCreation?.generatedText) return;
    navigator.clipboard.writeText(currentCreation.generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefine = async () => {
    if (!followUpText.trim() || !currentCreation?._id) return;
    try {
      const refinement = followUpText.trim();
      setFollowUpText('');
      await refineStory(currentCreation._id, refinement);
    } catch (err) {
      console.error("Refinement failed:", err);
    }
  };

  const toggleBookmark = () => {
    if (!currentCreation) return;
    dispatch(setIsBookmarked(!currentCreation.isBookmarked));
  };

  const handleBack = () => {
    resetChoose();
    navigate('/choose');
  };

  const formatTitle = expectedFormat === 'poetry' ? 'Poetry Studio' : 'Story Studio';
  const formatDesc = expectedFormat === 'poetry'
    ? 'Craft elegant stanzas, rhymes, and verses powered by AI.'
    : 'Weave engaging characters, plots, and worlds powered by AI.';

  if (!currentCreation) {
    return (
      <div className="w-full max-w-[1400px] mx-auto p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 animate-fade-in min-h-full">
        {/* Left Column: Concept Drafting */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="mb-2">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-bold text-[#6E6B85] hover:text-violet-600 transition-colors group cursor-pointer mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Choose Another Mode
            </button>
            <h1 className="text-3xl md:text-[2.5rem] font-extrabold text-[#110E2C] mb-2 tracking-tight leading-tight">
              {formatTitle}
            </h1>
            <p className="text-[#6E6B85] text-sm md:text-base font-medium">
              {formatDesc}
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm font-bold leading-relaxed">
                {error}
              </div>
            </div>
          )}

          {/* Prompt card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-purple-100/60 shadow-xl shadow-purple-500/5 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-purple-100/40 pb-4">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h3 className="text-lg font-extrabold text-[#110E2C]">
                Describe your creative concept
              </h3>
            </div>

            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              disabled={loading}
              placeholder={
                expectedFormat === 'story'
                  ? "Once upon a time in a forgotten library on a desolate moon, an astronaut discovers a journal containing coordinates back to Earth..."
                  : "A nostalgic free-verse poem capturing the essence of rain falling on cobblestone streets in a quiet Parisian alley..."
              }
              rows={6}
              className="w-full bg-[#FAFAFE] border border-purple-100/60 rounded-2xl p-4 text-sm font-medium text-[#110E2C] placeholder:text-[#8B88A5] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm resize-none disabled:opacity-50"
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !promptText.trim()}
              className="w-full py-4.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-[#E2DFF0] disabled:to-[#E2DFF0] disabled:text-[#8B88A5] text-white font-extrabold rounded-2xl shadow-xl shadow-violet-500/20 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:cursor-not-allowed text-base"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Weaving masterpiece...
                </span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Weave Masterpiece
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Aesthetics Sidebar */}
        <div className="w-full lg:w-[360px] xl:w-[400px]">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-purple-100/60 shadow-xl shadow-purple-500/5 sticky top-28 flex flex-col gap-8">
            <h3 className="text-xl font-extrabold text-[#110E2C] tracking-tight flex items-center gap-2 border-b border-purple-100/40 pb-4">
              Fine-tune aesthetics <span className="text-xl">✨</span>
            </h3>

            {/* Vibe & Mode Section */}
            <div className="flex flex-col gap-4">
              <label className="block text-xs font-bold text-[#4A4765] uppercase tracking-wider">
                Vibe & Mood
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-[#8B88A5]" />
                </div>
                <input
                  type="text"
                  value={selectedMode}
                  disabled={loading}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  placeholder="Type custom mood..."
                  className="w-full bg-[#FAFAFE] border border-purple-100/60 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-[#110E2C] placeholder:text-[#8B88A5] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm disabled:opacity-50"
                />
              </div>
              <PopularModes
                modes={POPULAR_MODES}
                activeMode={selectedMode}
                onSelect={setSelectedMode}
              />
            </div>

            {/* Genre Section */}
            <div className="flex flex-col gap-4">
              <label className="block text-xs font-bold text-[#4A4765] uppercase tracking-wider">
                Genre & Style
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-[#8B88A5]" />
                </div>
                <input
                  type="text"
                  value={selectedGenres}
                  disabled={loading}
                  onChange={(e) => setselectedGenres(e.target.value)}
                  placeholder="Type custom genre..."
                  className="w-full bg-[#FAFAFE] border border-purple-100/60 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-[#110E2C] placeholder:text-[#8B88A5] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm disabled:opacity-50"
                />
              </div>
              <PopularModes
                modes={POPULAR_GENRES}
                activeMode={selectedGenres}
                onSelect={setselectedGenres}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STAGE 2: Generated Document & Refinement Workspace
  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 animate-fade-in">
      {/* Left Column: Parchment Document Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Action Row */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-bold text-[#6E6B85] hover:text-violet-600 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Studio
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleBookmark}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${currentCreation.isBookmarked
                ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100'
                : 'bg-white border-purple-100/60 text-[#8B88A5] hover:border-purple-200 hover:text-[#110E2C]'
                }`}
              title={currentCreation.isBookmarked ? "Remove Bookmark" : "Bookmark Masterpiece"}
            >
              <Heart className={`w-4.5 h-4.5 ${currentCreation.isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4.5 py-2.5 bg-white border border-purple-100/60 rounded-xl text-xs font-bold text-[#110E2C] hover:border-violet-300 hover:text-violet-600 shadow-sm transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4.5 h-4.5 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4.5 h-4.5 text-[#8B88A5]" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        </div>

        {/* Premium Parchment styled content sheet */}
        <div className="bg-[#FAF8F5] border border-[#E9E4DC] rounded-3xl p-6 md:p-12 shadow-xl shadow-[#2C251C]/5 relative overflow-hidden min-h-[550px]">
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Title & Metadata Header */}
          <div className="border-b border-[#E9E4DC] pb-6 mb-8 relative z-10">
            <h2 className="text-3xl md:text-[2.25rem] font-serif font-extrabold text-[#2C251C] mb-4 tracking-tight leading-tight">
              {currentCreation.title || 'Untitled Masterpiece'}
            </h2>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3 py-1.5 bg-[#8E70FA]/10 text-[#6A4BE0] border border-[#8E70FA]/20 rounded-full text-xs font-bold uppercase tracking-wider">
                ✨ {currentCreation.format}
              </span>
              <span className="px-3 py-1.5 bg-amber-500/10 text-amber-800 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                🎭 {currentCreation.mood}
              </span>
              <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                📚 {currentCreation.genre}
              </span>
            </div>
          </div>

          {/* Generated Document Text */}
          <div className="relative z-10 font-serif leading-relaxed text-[#3C3225] text-lg max-w-none whitespace-pre-line select-text">
            {currentCreation.generatedText}
          </div>
        </div>
      </div>

      {/* Right Sidebar: AI Muse Chat Assistant */}
      <div className="w-full lg:w-[360px] xl:w-[400px]">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-purple-100/60 shadow-xl shadow-purple-500/5 sticky top-28 flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-extrabold text-[#110E2C] mb-2 tracking-tight flex items-center gap-2">
              Refine with AI Muse <span className="text-xl">🔮</span>
            </h3>
            <p className="text-xs text-[#6E6B85] font-medium leading-relaxed">
              Direct the AI Muse to reshape your creation. Describe what to change, expand, or rewrite.
            </p>
          </div>

          {/* Activity Stream / History */}
          <div className="bg-[#FAFAFE] border border-purple-100/40 rounded-2xl p-4 max-h-[220px] overflow-y-auto flex flex-col gap-3.5">
            <div className="text-xs font-bold text-[#8B88A5] uppercase tracking-wider border-b border-purple-100/50 pb-2">
              Project Baseline
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-violet-600">ORIGINAL CONCEPT</span>
              <p className="text-xs font-medium text-[#110E2C] italic">
                "{currentCreation.userPrompt}"
              </p>
            </div>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl flex items-start gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs font-bold leading-relaxed">
                {error}
              </div>
            </div>
          )}

          {/* Refine prompt input */}
          <div className="flex flex-col gap-3 relative">
            <textarea
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              disabled={loading}
              placeholder="e.g. 'Make the tone more dark and gothic', 'Add another stanza focusing on the autumn moon', 'Rewrite with a happier ending'..."
              rows={3}
              className="w-full bg-[#FAFAFE] border border-purple-100/60 rounded-2xl p-4 text-xs font-medium text-[#110E2C] placeholder:text-[#8B88A5] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm resize-none disabled:opacity-50"
            />

            <button
              onClick={handleRefine}
              disabled={loading || !followUpText.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-[#E2DFF0] disabled:to-[#E2DFF0] disabled:text-[#8B88A5] text-white font-bold rounded-xl shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2 text-xs">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refinement In Progress...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Apply Refinement
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreationWorkspace;
