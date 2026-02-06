import React from 'react';

interface HeroProps {
  onNavigateToLogin: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToLogin }) => {
  return (
    <section className="lp-hero">
      <div className="lp-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div className="lp-hero-content">
            <h1 className="lp-h1" style={{ marginBottom: '1.5rem' }}>
              A Revolução Digital na Gestão de <br /><span className="lp-text-gradient">Laudos Médicos</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Conectamos clínicas, médicos e pacientes em uma plataforma segura, inteligente e eficiente. Reduza custos, ganhe escala e laude exames de qualquer lugar.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={onNavigateToLogin} 
                className="lp-btn lp-btn-primary"
              >
                Começar Agora
              </button>
              <button className="lp-btn lp-btn-secondary" style={{ color: '#fff' }}>
                Ver como funciona
              </button>
            </div>
          </div>
          
          <div className="lp-hero-visual">
            <div className="lp-dashboard-3d">
                <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Header Mockup */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EAB308' }}></div>
                           <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22C55E' }}></div>
                        </div>
                        <div style={{ width: '120px', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></div>
                    </div>
                    
                    {/* Content Mockup */}
                    <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
                        <div style={{ width: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px', alignItems: 'center' }}>
                            {[1,2,3,4].map(i => (
                                <div key={i} style={{ width: '30px', height: '30px', borderRadius: '8px', background: i === 1 ? 'var(--lp-color-purple-tech)' : 'rgba(255,255,255,0.1)' }}></div>
                            ))}
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                             <div style={{ display: 'flex', gap: '15px' }}>
                                 <div style={{ flex: 1, height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '15px' }}>
                                    <div style={{ width: '30%', height: '8px', background: 'rgba(255,255,255,0.2)', marginBottom: '10px' }}></div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>2,450</div>
                                    <div style={{ fontSize: '12px', color: '#2DD4BF', marginTop: '5px' }}>+15% essa semana</div>
                                 </div>
                                 <div style={{ flex: 1, height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '15px' }}>
                                    <div style={{ width: '30%', height: '8px', background: 'rgba(255,255,255,0.2)', marginBottom: '10px' }}></div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>12m</div>
                                    <div style={{ fontSize: '12px', color: '#6A5CFF', marginTop: '5px' }}>Tempo médio</div>
                                 </div>
                             </div>
                             <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px' }}>
                                 <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(106, 92, 255, 0.2) 0%, rgba(106, 92, 255, 0) 100%)', borderRadius: '8px', borderTop: '2px solid #6A5CFF' }}></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
