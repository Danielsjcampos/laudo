import React from 'react';
import { QuoteIcon } from './icons/QuoteIcon';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role, avatarUrl }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
    <QuoteIcon className="h-10 w-10 text-brand-blue-200 mb-4" />
    <p className="text-gray-600 mb-6 flex-grow">"{quote}"</p>
    <div className="flex items-center">
      <img src={avatarUrl} alt={author} className="h-12 w-12 rounded-full mr-4" />
      <div>
        <p className="font-bold text-gray-900">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900">O que nossos parceiros dizem</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            A confiança de quem usa nossa plataforma é o nosso maior ativo.
          </p>
        </div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          <TestimonialCard 
            quote="A plataforma otimizou nosso fluxo de laudos em mais de 50%. A comunicação com os médicos nunca foi tão ágil e eficiente."
            author="Dra. Ana Costa"
            role="Gestora da Clínica Saúde Plena"
            avatarUrl="https://picsum.photos/id/1027/100/100"
          />
          <TestimonialCard 
            quote="Ter a flexibilidade de laudar de qualquer lugar, com segurança e uma ferramenta completa, transformou minha rotina de trabalho."
            author="Dr. Roberto Martins"
            role="Cardiologista"
            avatarUrl="https://picsum.photos/id/1005/100/100"
          />
          <TestimonialCard 
            quote="Finalmente um sistema que pensa no paciente! Ter acesso aos meus exames online, de forma organizada, me trouxe muita tranquilidade."
            author="Carla Ferreira"
            role="Paciente"
            avatarUrl="https://picsum.photos/id/1011/100/100"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
