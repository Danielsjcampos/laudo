import React from 'react';

interface CtaSectionProps {
    onNavigateToLogin: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ onNavigateToLogin }) => {
  return (
    <section className="bg-brand-blue-700">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Pronto para modernizar a gestão de laudos na sua clínica?
          </h2>
          <p className="text-lg text-brand-blue-100 mb-8">
            Junte-se a centenas de clínicas e médicos que já estão transformando a saúde digital. Cadastre-se e comece a usar hoje mesmo.
          </p>
          <button
            onClick={onNavigateToLogin}
            className="bg-white text-brand-blue-600 px-8 py-4 rounded-lg shadow-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Crie sua Conta
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
