import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { APP_CONFIG } from '../../utils/constants';

const Logo = ({ size = "md", showTagline = false, to = "/", className = "" }) => {
  const sizeClasses = {
    sm: "h-7 w-7 rounded-lg p-1.5",
    md: "h-9 w-9 rounded-xl p-2",
    lg: "h-12 w-12 rounded-2xl p-2.5"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Green rounded icon container matching screenshot */}
      <div className={`bg-forest-800 flex items-center justify-center text-white shadow-sm shrink-0 ${sizeClasses[size] || sizeClasses.md}`}>
        <Zap className={`${iconSizes[size] || iconSizes.md} fill-white text-white stroke-[2.5]`} />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${textSizes[size] || textSizes.md}`}>
          {APP_CONFIG.brandName}
        </span>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-wide text-forest-700 dark:text-emerald-400 uppercase -mt-0.5">
            {APP_CONFIG.tagline}
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
