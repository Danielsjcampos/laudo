import React from 'react';

interface HeroProps {
    onNavigateToLogin: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToLogin }) => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            A Revolução Digital na Gestão de <span className="text-brand-blue-600">Laudos Médicos</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Conectamos clínicas, médicos e pacientes com uma plataforma segura, intuitiva e eficiente. Otimize seu fluxo de trabalho e ofereça a melhor experiência.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <button onClick={onNavigateToLogin} className="bg-brand-blue-600 text-white px-8 py-4 rounded-lg shadow-lg text-lg font-semibold hover:bg-brand-blue-700 transition-all duration-300 transform hover:scale-105">
              Comece Agora
            </button>
            <a href="#how-it-works" className="text-brand-blue-600 font-semibold hover:underline text-lg">
              Veja como funciona
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
