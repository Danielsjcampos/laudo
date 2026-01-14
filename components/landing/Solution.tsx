import React from 'react';
import { BrainIcon } from '../icons/BrainIcon';

const Solution: React.FC = () => {
  return (
    <section className="lp-section-solution">
      <div className="lp-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '80px', alignItems: 'center' }}>
            <div style={{ order: 2 }}>
                 <div style={{ position: 'relative', width: '100%', height: '400px', background: 'var(--lp-color-gray-light)', borderRadius: '30px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(106, 92, 255, 0.1) 0%, transparent 70%)' }}></div>
                     
                     <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 10 }}>
                         <div className="lp-glass" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0A2540' }}>Clínica</div>
                         <div style={{ width: '40px', height: '2px', background: '#ccc' }}></div>
                         <div className="lp-glass" style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(106, 92, 255, 0.9)', color: 'white', border: 'none', boxShadow: '0 10px 30px rgba(106, 92, 255, 0.4)' }}>
                             <BrainIcon className="w-8 h-8 mb-2" />
                             <span>IA</span>
                         </div>
                         <div style={{ width: '40px', height: '2px', background: '#ccc' }}></div>
                         <div className="lp-glass" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0A2540' }}>Médico</div>
                     </div>
                 </div>
            </div>
            
            <div style={{ order: 1 }}>
                <h2 className="lp-h2" style={{ color: '#0A2540' }}>
                    Um ecossistema <span className="lp-text-gradient">inteligente</span> <br /> de laudos médicos
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2rem', lineHeight: '1.7' }}>
                    O Laudo Digital é uma plataforma que conecta clínicas a médicos especialistas disponíveis sob demanda, permitindo laudos rápidos, seguros e escaláveis — com apoio de Inteligência Artificial para garantir precisão e velocidade.
                </p>
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#2DD4BF', fontSize: '1.2rem' }}>✓</span> Laudos em minutos, não dias
                    </li>
                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#2DD4BF', fontSize: '1.2rem' }}>✓</span> Acesso a subespecialistas
                    </li>
                    <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#2DD4BF', fontSize: '1.2rem' }}>✓</span> Correção e pré-laudo via IA
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
