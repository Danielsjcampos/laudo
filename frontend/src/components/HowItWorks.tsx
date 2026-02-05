import React from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { EditIcon } from './icons/EditIcon';
import { SignatureIcon } from './icons/SignatureIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stepNumber: number;
}

const Step: React.FC<StepProps> = ({ icon, title, description, stepNumber }) => (
  <div className="relative pl-12">
    <div className="absolute left-0 top-0 flex items-center justify-center h-10 w-10 rounded-full bg-brand-blue-600 text-white font-bold text-xl">
      {stepNumber}
    </div>
    <div className="ml-4">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-xl font-bold text-gray-900 ml-3">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900">Simples, Rápido e Eficiente</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Em apenas 4 passos, o exame é laudado e entregue ao paciente com total segurança.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Dashed line connector */}
            <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 border-l-2 border-brand-blue-200 border-dashed"></div>
            <div className="space-y-16">
              <Step 
                stepNumber={1} 
                icon={<UploadIcon className="h-8 w-8 text-brand-blue-600" />} 
                title="Clínica Envia o Exame" 
                description="A clínica cadastra o paciente e faz o upload dos arquivos do exame, selecionando o médico especialista para o laudo." 
              />
              <Step 
                stepNumber={2} 
                icon={<EditIcon className="h-8 w-8 text-brand-blue-600" />} 
                title="Médico Elabora o Laudo" 
                description="O médico recebe uma notificação, acessa o exame na plataforma e utiliza nosso editor para criar o laudo detalhado." 
              />
              <Step 
                stepNumber={3} 
                icon={<SignatureIcon className="h-8 w-8 text-brand-blue-600" />} 
                title="Assinatura Digital" 
                description="Após a elaboração, o laudo é assinado digitalmente pelo médico, garantindo autenticidade e validade jurídica." 
              />
              <Step 
                stepNumber={4} 
                icon={<DownloadIcon className="h-8 w-8 text-brand-blue-600" />} 
                title="Paciente Acessa o Resultado" 
                description="O paciente é notificado e pode acessar e baixar seu laudo finalizado através do portal do paciente, a qualquer hora e lugar." 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
