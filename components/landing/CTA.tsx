import React from 'react';

interface CtaProps {
  onNavigateToLogin: () => void;
}

const CTA: React.FC<CtaProps> = ({ onNavigateToLogin }) => {
  return (
    <section style={{ padding: '100px 0', background: 'var(--lp-gradient-hero)', color: 'white', textAlign: 'center' }}>
      <div className="lp-container">
        <h2 className="lp-h2" style={{ color: 'white', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
            Pronto para transformar a gestão de laudos da sua clínica ou carreira médica?
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: 'rgba(255,255,255,0.8)' }}>
            Junte-se a centenas de profissionais que já modernizaram seus processos.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
             <button 
                onClick={onNavigateToLogin} 
                className="lp-btn lp-btn-primary"
                style={{ background: 'white', color: '#0A2540' }}
              >
                Criar Conta Agora
              </button>
              <button className="lp-btn lp-btn-secondary">
                Falar com Especialista
              </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
