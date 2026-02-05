import React from 'react';
import { XIcon } from '../icons/XIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop with proper z-index */}
      <div 
        className="fixed inset-0 bg-gray-900/75 transition-opacity z-[100]" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Container - centered with flexbox */}
      <div className="fixed inset-0 z-[110] flex min-h-full items-center justify-center p-4">
        <div 
          className="relative transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
            <h3 id="modal-title" className="text-2xl font-black text-gray-900 tracking-tight">
              {title}
            </h3>
            <button 
              onClick={onClose} 
              className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-brand-blue-600 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
              aria-label="Fechar modal"
            >
              <XIcon className="h-6 w-6 stroke-[3px]" />
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-8 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};