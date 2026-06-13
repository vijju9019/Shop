import React from 'react';

const Loading = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-discord-darkest/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-discord-blurple/25 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-discord-blurple border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-discord-blurple font-bold tracking-widest text-xs uppercase animate-pulse">
          Connecting to Discord...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-3 border-discord-blurple/20 rounded-full"></div>
        <div className="absolute inset-0 border-3 border-discord-blurple border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-400 text-xs tracking-wider animate-pulse">Loading items...</p>
    </div>
  );
};

export default Loading;
