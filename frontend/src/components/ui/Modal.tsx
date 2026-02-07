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

      {/* Modal Container - centered with flexbox - NO PADDING to maximize space */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4">
        <div
          className="relative flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all w-full max-w-6xl max-h-[95vh] border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header - Compact */}
          <div className="flex items-center justify-between border-b border-gray-50 px-6 py-3 shrink-0 bg-white z-20">
            <h3 id="modal-title" className="text-lg font-black text-gray-900 tracking-tight">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 focus:outline-none"
              aria-label="Fechar modal"
            >
              <XIcon className="h-5 w-5 stroke-[3px]" />
            </button>
          </div>

          {/* Modal Content - Auto-scroll if needed, but aimed for fit */}
          <div className="overflow-y-auto px-6 py-4 custom-scrollbar flex-1 bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};