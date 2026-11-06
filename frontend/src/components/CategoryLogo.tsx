import React from 'react';

interface CategoryLogoProps {
  category: 'MotoGP' | 'Moto2' | 'Moto3';
  className?: string;
}

export const CategoryLogo: React.FC<CategoryLogoProps> = ({ category, className = 'h-8' }) => {
  if (category === 'MotoGP') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <span className="font-racing italic font-black text-2xl sm:text-3xl tracking-tighter text-white mr-1.5 uppercase drop-shadow-sm">
          Moto
        </span>
        <div className="border-[2.5px] border-white rounded-lg px-2 py-0.5 flex items-center justify-center bg-white/5 backdrop-blur-xs">
          <span className="font-racing italic font-black text-xl sm:text-2xl text-white tracking-tight uppercase">
            GP
          </span>
        </div>
      </div>
    );
  }

  if (category === 'Moto2') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <span className="font-racing italic font-black text-2xl sm:text-3xl tracking-tighter text-white mr-1.5 uppercase drop-shadow-sm">
          Moto
        </span>
        <div className="border-[2.5px] border-white rounded-lg px-2.5 py-0.5 flex items-center justify-center bg-white/5 backdrop-blur-xs">
          <span className="font-racing italic font-black text-xl sm:text-2xl text-white tracking-tight">
            2.
          </span>
        </div>
      </div>
    );
  }

  // Moto3
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <span className="font-racing italic font-black text-2xl sm:text-3xl tracking-tighter text-white mr-1.5 uppercase drop-shadow-sm">
        Moto
      </span>
      <div className="border-[2.5px] border-white rounded-lg px-2.5 py-0.5 flex items-center justify-center bg-white/5 backdrop-blur-xs">
        <span className="font-racing italic font-black text-xl sm:text-2xl text-white tracking-tight">
          3.
        </span>
      </div>
    </div>
  );
};
