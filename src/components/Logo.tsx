import React, { useState } from 'react';

import logoAsset from '../assets/images/consistent_experts_logo.png';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ONLINE_LOGO_URL = 'https://i.imgur.com/uppO6KS.png';

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  showTagline = true,
  size = 'md',
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(logoAsset);
  const [hasFailedCompletely, setHasFailedCompletely] = useState(false);
  const isLight = variant === 'light';

  const heights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
  };

  const handleImageError = () => {
    if (currentSrc !== ONLINE_LOGO_URL) {
      setCurrentSrc(ONLINE_LOGO_URL);
    } else {
      setHasFailedCompletely(true);
    }
  };

  if (!hasFailedCompletely) {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <div
          className={`flex items-center transition-transform hover:scale-102 duration-200 ${
            isLight ? 'bg-white rounded-lg px-2.5 py-1.5 shadow-xs' : ''
          }`}
        >
          <img
            src={currentSrc}
            alt="Consistent Experts Logo - Built Right... Delivered Better..."
            className={`${heights[size]} w-auto object-contain max-w-[220px]`}
            onError={handleImageError}
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // Fallback vector representation if image fails to render
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center shrink-0 rounded-lg p-1.5 ${
          isLight
            ? 'bg-white/10 border border-white/20 shadow-sm'
            : 'bg-[#373E0C]/10 border border-[#373E0C]/15 shadow-sm'
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="50" cy="50" r="38" stroke="#E96818" strokeWidth="4" strokeDasharray="6 4" opacity="0.6" />
          <path
            d="M24 64C28 46 42 34 50 34C58 34 72 46 76 64"
            stroke="#E96818"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="46" r="10" fill="#E96818" />
          <path
            d="M20 72L50 50L80 72V80H20V72Z"
            fill={isLight ? '#FFFFFF' : '#373E0C'}
          />
          <rect x="44" y="62" width="12" height="18" fill="#E96818" rx="1.5" />
          <line x1="14" y1="84" x2="86" y2="84" stroke={isLight ? '#FFFFFF' : '#373E0C'} strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight ${titleSizes[size]} ${
              isLight ? 'text-white' : 'text-[#373E0C]'
            }`}
          >
            CONSISTENT
          </span>
          <span className={`font-extrabold tracking-tight ${titleSizes[size]} text-[#E96818]`}>
            EXPERTS
          </span>
        </div>
        {showTagline && (
          <span
            className={`font-medium tracking-wide mt-1 text-[11px] ${
              isLight ? 'text-white/70' : 'text-[#373E0C]/80'
            }`}
          >
            Built Right... Delivered Better...
          </span>
        )}
      </div>
    </div>
  );
};
