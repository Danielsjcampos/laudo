import React from 'react';
import { ClinicIcon } from './icons/ClinicIcon';
import { DoctorIcon } from './icons/DoctorIcon';
import { PatientIcon } from './icons/PatientIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  features: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, features }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
    <div className="flex items-center mb-6">
      <div className="bg-brand-blue-100 p-3 rounded-full mr-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
    </div>
    <ul className="space-y-4 text-gray-600 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <CheckCircleIcon className="h-6 w-6 text-brand-teal-500 mr-3 flex-shrink-0 mt-1" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Features: React.FC = () => {
  const clinicFeatures = [
    'Cadastre pacientes e requisite exames com facilidade.',
    'Selecione médicos especialistas em nossa rede credenciada.',
    'Monitore o status dos laudos em tempo real.',
    'Aumente a eficiência e reduza custos operacionais.'
  ];
  const doctorFeatures = [
    'Receba exames diretamente na plataforma, onde estiver.',
    'Emita laudos digitais com um editor de texto completo.',
    'Assine digitalmente com validade jurídica e segurança.',
    'Gerencie sua agenda e defina sua disponibilidade.'
  ];
  const patientFeatures = [
    'Acesse seus resultados e laudos de forma rápida e segura.',
    'Baixe e compartilhe seus exames com um clique.',
    'Mantenha um histórico de saúde digital e organizado.',
    'Receba notificações sobre a liberação dos seus laudos.'
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900">Uma Plataforma Completa para Todos</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Soluções personalizadas para otimizar a rotina de cada perfil, garantindo agilidade e segurança no processo.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={<ClinicIcon className="h-8 w-8 text-brand-blue-600" />} title="Para Clínicas" features={clinicFeatures} />
          <FeatureCard icon={<DoctorIcon className="h-8 w-8 text-brand-blue-600" />} title="Para Médicos" features={doctorFeatures} />
          <FeatureCard icon={<PatientIcon className="h-8 w-8 text-brand-blue-600" />} title="Para Pacientes" features={patientFeatures} />
        </div>
      </div>
    </section>
  );
};

export default Features;
