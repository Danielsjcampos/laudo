import React from 'react';
import { QuoteIcon } from '../icons/QuoteIcon';

const Testimonials: React.FC = () => {
    
    const testimonials = [
        {
            text: "Reduzimos mais de 50% dos custos com laudos e aumentamos nossa capacidade de atendimento.",
            author: "Drª. Ana Clara",
            role: "Gestora da Clínica Vida",
            delay: '0s'
        },
        {
            text: "Consigo laudar de casa com total segurança e ainda uso a IA para revisar meus diagnósticos.",
            author: "Dr. Marcos Silva",
            role: "Radiologista",
            delay: '2s'
        },
        {
            text: "Ter meus exames online e organizados mudou completamente minha experiência.",
            author: "Carlos Eduardo",
            role: "Paciente",
            delay: '1s'
        }
    ];

  return (
    <section style={{ padding: '100px 0', background: 'white', overflow: 'hidden' }}>
      <div className="lp-container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="lp-h2" style={{ color: '#0A2540' }}>Quem usa, recomenda</h2>
        </div>

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {testimonials.map((t, i) => (
                <div key={i} className="lp-glass" style={{ width: '350px', padding: '30px', animation: `floatCard 6s ease-in-out infinite`, animationDelay: t.delay }}>
                    <QuoteIcon className="w-8 h-8 mb-4 text-brand-blue-300" style={{ color: '#cbd5e1' }} />
                    <p style={{ fontStyle: 'italic', marginBottom: '20px', color: '#334155' }}>"{t.text}"</p>
                    <div>
                        <strong style={{ display: 'block', color: '#0A2540' }}>{t.author}</strong>
                        <span style={{ fontSize: '0.9rem', color: '#64748B' }}>{t.role}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
