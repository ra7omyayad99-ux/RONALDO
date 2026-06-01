import React, { useState, useEffect, useRef } from 'react';
import { Camera, UploadCloud } from 'lucide-react';

interface DeveloperImageProps {
  className?: string;
}

export const DeveloperImage: React.FC<DeveloperImageProps> = ({ 
  className = "w-16 h-16" 
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved photo from localStorage on component mount
  useEffect(() => {
    try {
      const savedPhoto = localStorage.getItem('dev_photo');
      if (savedPhoto) {
        setImageSrc(savedPhoto);
      }
    } catch (e) {
      console.warn("Could not read dev_photo from localStorage", e);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      try {
        localStorage.setItem('dev_photo', base64String);
        setImageSrc(base64String);
      } catch (err) {
        console.warn("Failed to save image to localStorage: quota exceeded. Attempting to render directly...", err);
        setImageSrc(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  // Safe gesture to reset if absolutely needed (triple-click)
  const [clickCount, setClickCount] = useState(0);
  const handleTripleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClickCount(prev => prev + 1);
    
    // Reset click count after 1.5 seconds
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 1500);

    if (clickCount >= 2) {
      // Triple click triggered
      try {
        localStorage.removeItem('dev_photo');
        setImageSrc(null);
        setClickCount(0);
        clearTimeout(timer);
      } catch (err) {}
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      className={`group relative overflow-hidden rounded-xl border-2 border-amber-450/75 bg-slate-950 shadow-lg shadow-black/40 flex-shrink-0 cursor-pointer hover:border-amber-400 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 pointer-events-auto select-none ${className}`}
      id="dev-image-container"
      title="انقر هنا لرفع وتثبيت صورتك الشخصية المرفقة / Click here to upload and anchor your attached photo"
    >
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
        id="dev-photo-file-picker" 
      />

      {/* Render the user's permanent uploaded custom picture if present */}
      {imageSrc ? (
        <div className="w-full h-full relative" onDoubleClick={handleTripleClick}>
          <img
            src={imageSrc}
            alt="المهندس عبد الرحمن اياد"
            className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105"
            id="dev-profile-img"
          />
          {/* Subtle elegant vignette shadow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none z-10" />

          {/* Locked status banner on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all duration-300 z-20 text-white p-2 text-center pointer-events-none">
            <Camera className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-black tracking-wide text-amber-300 font-sans">تحديث الصورة الشخصية</span>
            <span className="text-[8px] opacity-75 font-mono">Update Profile Photo</span>
          </div>
        </div>
      ) : (
        /* STUNNING SKETCH FALLBACK: Prompts the user to upload their photo with a beautiful pulsating effect */
        <div className="w-full h-full relative overflow-hidden bg-slate-950" id="dev-avatar-permanent">
          <svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice" className="w-full h-full text-amber-500/90 shrink-0">
            <defs>
              {/* Soft-focus forest/garden background gradient simulating the natural foliage in the photo */}
              <radialGradient id="garden-glow-permanent" cx="50%" cy="35%" r="65%" fx="30%" fy="25%">
                <stop offset="0%" stopColor="#1e3a1e" stopOpacity="0.85" />    {/* Dark Pine Green */}
                <stop offset="40%" stopColor="#14532d" stopOpacity="0.75" />   {/* Forest Green */}
                <stop offset="70%" stopColor="#166534" stopOpacity="0.7" />    {/* Leaf Green */}
                <stop offset="90%" stopColor="#854d0e" stopOpacity="0.2" />    {/* Sunlit Golden Highlight */}
                <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />   {/* Deep Slate Dark */}
              </radialGradient>
              
              {/* Highly realistic aviator sunglass lens metallic-sky reflection gradient */}
              <linearGradient id="lens-permanent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.95" />     {/* Gold Amber reflection */}
                <stop offset="25%" stopColor="#b45309" stopOpacity="0.98" />    {/* Rich Warm Bronze */}
                <stop offset="60%" stopColor="#78350f" stopOpacity="1.0" />     {/* Dark Sienna */}
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.75" />   {/* Crimson horizon gleam */}
              </linearGradient>

              {/* Premium double-plated metallic gold frames for the aviator glasses */}
              <linearGradient id="gold-frame-permanent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* Industrial Navy Blue jumpsuit fabric gradient with subtle directional lighting */}
              <linearGradient id="navy-suit-permanent" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />   {/* Light slate reflection */}
                <stop offset="25%" stopColor="#1e1b4b" />  {/* Deep indigo-navy fabric */}
                <stop offset="100%" stopColor="#0f172a" /> {/* Deep shadow bottom */}
              </linearGradient>

              {/* Safety helmet highlights and shadows */}
              <linearGradient id="helmet-sheen-permanent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#f1f5f9" />
                <stop offset="105%" stopColor="#94a3b8" />
              </linearGradient>

              {/* Skin tone rendering with highlights and shadows */}
              <linearGradient id="skin-tone-permanent" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffeedd" />   {/* Highlighted forehead */}
                <stop offset="60%" stopColor="#fed7aa" />  {/* Mid-tone */}
                <stop offset="100%" stopColor="#fdba74" /> {/* Jaw shadow */}
              </linearGradient>
            </defs>

            {/* 1. NATURAL GARDEN BACKGROUND FOLIAGE WITH SOFT BOKEH CIRCLES */}
            <rect width="100%" height="100%" fill="url(#garden-glow-permanent)" />
            
            {/* Bokeh elements from the photograph */}
            <circle cx="22" cy="25" r="16" fill="#166534" fillOpacity="0.3" filter="blur(5px)" />
            <circle cx="85" cy="38" r="14" fill="#a16207" fillOpacity="0.22" filter="blur(6px)" />
            <circle cx="78" cy="18" r="18" fill="#15803d" fillOpacity="0.35" filter="blur(7px)" />
            <circle cx="12" cy="62" r="12" fill="#22c55e" fillOpacity="0.18" filter="blur(4px)" />
            <circle cx="90" cy="72" r="10" fill="#14532d" fillOpacity="0.28" filter="blur(4px)" />

            {/* Sun flare burst from top-right tree gaps */}
            <ellipse cx="75" cy="10" rx="30" ry="15" fill="#fef08a" fillOpacity="0.1" filter="blur(8px)" />

            {/* 2. THE DEVELOPER FIGURE */}
            {/* Main torso overlaying background */}
            <path d="M10 112 C 16 78, 84 78, 90 112 L 90 130 L 10 130 Z" fill="url(#navy-suit-permanent)" stroke="#1e1b4b" strokeWidth="0.5" />
            
            {/* Grey reflective safety fabric shoulder inserts on the jumpsuit */}
            <path d="M12 94 C 18 84, 31 83, 33 88 L 24 106 C 20 106, 14 100, 12 94 Z" fill="#94a3b8" fillOpacity="0.65" />
            <path d="M88 94 C 82 84, 69 83, 67 88 L 76 106 C 80 106, 86 100, 88 94 Z" fill="#94a3b8" fillOpacity="0.65" />

            {/* Jumpsuit collar layout */}
            <path d="M34 80 L 41 87 L 33 93 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="0.5" />
            <path d="M66 80 L 59 87 L 67 93 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="0.5" />

            {/* Zipper / Center line of the jumpsuit overalls */}
            <line x1="50" y1="88" x2="50" y2="130" stroke="#475569" strokeWidth="1" strokeDasharray="3 1.5" />
            
            {/* White Undershirt Crewneck */}
            <path d="M41 80 C 44 85, 56 85, 59 80 L 50 82 Z" fill="#f8fafc" />

            {/* Clean Red rectangle badge logo on left chest ("Redwing" detail) */}
            <rect x="58" y="93" width="9.5" height="3" rx="0.5" fill="#ef4444" fillOpacity="0.95" />
            <rect x="58.5" y="94.1" width="8.5" height="0.8" fill="#ffffff" fillOpacity="0.65" />

            {/* Neck with anatomical shadow */}
            <rect x="43.5" y="71" width="13" height="11" rx="1.5" fill="#ea580c" fillOpacity="0.22" />
            <path d="M43 71 C 43 71, 44 81, 50 81 C 56 81, 57 71, 57 71" fill="url(#skin-tone-permanent)" />

            {/* Head Silhouette */}
            <ellipse cx="50" cy="55" rx="13.5" ry="16.5" fill="#fde047" fillOpacity="0.2" />
            <ellipse cx="50" cy="55" rx="12" ry="14.8" fill="url(#skin-tone-permanent)" />

            {/* Tailored Short styled black hair */}
            <path d="M37.2 49 C 36.5 35, 63.5 35, 62.8 49 C 64.5 42, 61 33, 50 33 C 39 33, 35.5 42, 37.2 49 Z" fill="#1e293b" />
            <path d="M37.2 49 C 36.5 39, 63.5 39, 62.8 49 L 62.8 52 C 62.8 52, 60.5 48.5, 50 48.5 C 39.5 48.5, 37.2 52, 37.2 52 Z" fill="#0f172a" />

            {/* Sharp trimmed Beard and mustache */}
            <path d="M38 52 C 38 67, 62 67, 62 52 C 60.5 71.5, 39.5 71.5, 38 52 Z" fill="#1e293b" />
            <path d="M42.5 61 C 45 59.5, 55 59.5, 57.5 61 C 56 62.3, 44 62.3, 42.5 61 Z" fill="#0f172a" stroke="#0f172a" strokeWidth="0.5" />

            {/* Gold-Rimmed Double-Bridge Aviator Sunglasses (Exact detail from photo) */}
            <rect x="38.5" y="47.5" width="10.5" height="8.2" rx="3.8" fill="url(#lens-permanent)" stroke="url(#gold-frame-permanent)" strokeWidth="1.2" />
            <rect x="51" y="47.5" width="10.5" height="8.2" rx="3.8" fill="url(#lens-permanent)" stroke="url(#gold-frame-permanent)" strokeWidth="1.2" />
            <line x1="49" y1="49" x2="51" y2="49" stroke="url(#gold-frame-permanent)" strokeWidth="1" />
            <line x1="48" y1="51.2" x2="52" y2="51.2" stroke="url(#gold-frame-permanent)" strokeWidth="0.8" />
            <ellipse cx="41" cy="50" rx="1" ry="2.2" fill="#ffffff" fillOpacity="0.5" transform="rotate(-15 41 50)" />
            <ellipse cx="53.5" cy="50" rx="1" ry="2.2" fill="#ffffff" fillOpacity="0.5" transform="rotate(-15 53.5 50)" />

            {/* 3. HARD HAT HELMET AND HANDS HELD AT CORES WAIST */}
            <g transform="translate(0, 11)">
              {/* White Safety Helmet held high in front */}
              <path d="M32 99 C 32 80, 68 80, 68 99 Z" fill="url(#helmet-sheen-permanent)" stroke="#cbd5e1" strokeWidth="0.5" />
              <path d="M28 99 L 72 99 C 74.5 99, 74.5 101.5, 72 101.5 L 28 101.5 C 25.5 101.5, 25.5 99, 28 99 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
              <path d="M47.5 83.5 L 52.5 83.5 L 52 99 L 48 99 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
            </g>

            {/* Hands holding the helmet */}
            <path d="M28.5 119 C 25.5 116, 31 108, 35 111.5 C 36 112.5, 37.2 116.5, 34 121" fill="url(#skin-tone-permanent)" stroke="#ea580c" strokeWidth="0.4" />
            <path d="M71.5 119 C 74.5 116, 69 108, 65 111.5 C 64 112.5, 62.8 116.5, 66 121" fill="url(#skin-tone-permanent)" stroke="#ea580c" strokeWidth="0.4" />

            {/* Soft ambient frame borders */}
            <rect width="100%" height="100%" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.3" />
          </svg>

          {/* Interactive instruction message banner overlay on hover */}
          <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-3 text-center text-white transition-all duration-300 z-20">
            <UploadCloud className="w-6 h-6 text-amber-400 animate-bounce mb-1" />
            <span className="text-xs font-black tracking-normal text-amber-300 font-sans">انقر هنا لرفع صورتك الشخصية المرفقة لتثبيتها بشكل دائم 📷</span>
            <span className="text-[9px] opacity-75 font-mono mt-0.5">Click to upload and permanently lock your profile photo</span>
          </div>

          {/* Glowing pulse notifier demanding click action */}
          <div className="absolute top-2 left-2 animate-ping w-2.5 h-2.5 rounded-full bg-amber-400 z-10" />
          <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-amber-500 z-10" />
        </div>
      )}

      {/* Aesthetic Golden Tech Frame Corner brackets */}
      <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-amber-400 opacity-60" />
      <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-amber-400 opacity-60" />
      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-amber-400 opacity-60" />
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-amber-400 opacity-60" />
    </div>
  );
};
