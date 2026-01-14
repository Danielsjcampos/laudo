import React from 'react';
import { Button } from './Button';

interface HorosButtonProps {
  dicomUrl: string;
}

export const HorosButton: React.FC<HorosButtonProps> = ({ dicomUrl }) => {
  
  const handleOpenHoros = () => {
    // Horos URL Scheme: horos://?methodName=downloadURL&url=<ENCODED_URL>&display=YES
    const horosScheme = `horos://?methodName=downloadURL&url=${encodeURIComponent(dicomUrl)}&display=YES`;
    
    // Attempt to open the custom URL scheme
    window.location.href = horosScheme;
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleOpenHoros}
      className="flex items-center gap-2 border-brand-blue-200 text-brand-blue-700 hover:bg-brand-blue-50"
      title="Abrir exame no visualizador Horos (Requer instalação no macOS)"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.5 13H13V15.5C13 16.05 12.55 16.5 12 16.5C11.45 16.5 11 16.05 11 15.5V13H8.5C7.95 13 7.5 12.55 7.5 12C7.5 11.45 7.95 11 8.5 11H11V8.5C11 7.95 11.45 7.5 12 7.5C12.55 7.5 13 7.95 13 8.5V11H15.5C16.05 11 16.5 11.45 16.5 12C16.5 12.55 16.05 13 15.5 13Z" fill="currentColor"/>
      </svg>
      Abrir no Horos
    </Button>
  );
};
