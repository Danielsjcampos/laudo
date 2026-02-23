import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button } from '../../ui/Button';
import { CopyIcon } from '../../icons/CopyIcon';
import { WhatsappIcon } from '../../icons/WhatsappIcon';
import { useToast } from '../../../contexts/ToastContext';
import { XIcon } from '../../icons/XIcon';

interface ShareExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId: string;
  patientName: string;
}

export const ShareExamModal: React.FC<ShareExamModalProps> = ({ isOpen, onClose, examId, patientName }) => {
  const { addToast } = useToast();
  const [shareLink, setShareLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate a mock secure link on open
  React.useEffect(() => {
    if (isOpen) {
      setIsGenerating(true);
      // Simulate API call to generate secure token
      setTimeout(() => {
        // Create a robust URL-safe token: base64(examId|timestamp)
        // Verify we replace + and / to avoid URL breaking
        const rawToken = btoa(`${examId}|${Date.now()}`);
        const secureToken = rawToken.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        setShareLink(`${window.location.origin}/share/${secureToken}?ref=dr_collab`);
        setIsGenerating(false);
      }, 800);
    }
  }, [isOpen, examId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    addToast('Link copiado para a área de transferência!', 'success');
  };

  const handleWhatsappShare = () => {
    const text = `Olá! Gostaria de uma segunda opinião sobre o exame do paciente ${patientName}. Segue o link de acesso seguro: ${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                    Segunda Opinião / Compartilhar
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-2 text-sm text-gray-500 mb-6">
                  <p>Um link seguro temporário será gerado para que outro especialista possa visualizar este exame e emitir uma opinião.</p>
                </div>

                {isGenerating ? (
                   <div className="flex flex-col items-center justify-center py-8 space-y-3">
                      <div className="w-8 h-8 border-4 border-brand-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gerando Link Seguro...</p>
                   </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 break-allfont-mono text-xs text-gray-600 break-all">
                      {shareLink}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={handleCopyLink} variant="outline" className="w-full">
                        <CopyIcon className="w-4 h-4 mr-2" />
                        Copiar Link
                      </Button>
                      <Button onClick={handleWhatsappShare} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                        <WhatsappIcon className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
                        <p className="text-[10px] text-blue-800 leading-relaxed">
                            <strong>Nota de Segurança:</strong> Quem acessar este link deverá informar seu CRM para visualizar o exame. O acesso ficará registrado no histórico do paciente (LGPD).
                        </p>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
