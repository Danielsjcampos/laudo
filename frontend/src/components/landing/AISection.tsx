import React from 'react';
import { BrainIcon } from '../icons/BrainIcon';

const AISection: React.FC = () => {
  return (
    <section className="lp-section-ai">
      <div className="lp-container">
        <div className="lp-ai-content">
            <div className="lp-ai-visual">
                {/* 3D Medical Avatar Representation */}
                <div className="lp-ai-avatar" style={{ margin: '0 auto', background: 'radial-gradient(circle, rgba(106,92,255,0.2) 0%, transparent 70%)', borderRadius: '50%', width: '350px', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                     <div className="lp-glass" style={{ width: '280px', height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
                         <BrainIcon className="w-20 h-20 text-brand-blue-600 mb-6" style={{ color: '#6A5CFF' }} />
                         <div style={{ textAlign: 'center', padding: '0 20px' }}>
                             <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '5px' }}>Analisando exame...</div>
                             <div style={{ height: '6px', width: '100%', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                                 <div style={{ height: '100%', width: '80%', background: '#6A5CFF' }}></div>
                             </div>
                             <div style={{ marginTop: '20px', fontSize: '12px', background: 'rgba(45, 212, 191, 0.1)', padding: '5px 10px', borderRadius: '20px', color: '#0F766E' }}>
                                 98% de precisão detectada
                             </div>
                         </div>
                     </div>
                     
                     <div style={{ position: 'absolute', top: '10%', right: '10%', width: '10px', height: '10px', background: '#2DD4BF', borderRadius: '50%' }}></div>
                     <div style={{ position: 'absolute', bottom: '20%', left: '10%', width: '15px', height: '15px', background: '#6A5CFF', borderRadius: '50%' }}></div>
                </div>
            </div>
            
            <div style={{ flex: 1 }}>
                <h2 className="lp-h2" style={{ color: '#0A2540' }}>
                    Inteligência Artificial treinada por médicos, <span className="lp-text-gradient">trabalhando com você</span>
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2rem' }}>
                    Nossa IA não substitui o médico — ela o empodera. Utilize algoritmos avançados para pré-análise, detecção de anomalias e sugestão de textos técnicos, reduzindo o tempo de digitação e aumentando a precisão.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div>
                        <h4 style={{ fontWeight: 'bold', color: '#0A2540', marginBottom: '10px' }}>Pré-laudo Automático</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748B' }}>A IA gera um rascunho baseado na imagem e dados do exame.</p>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 'bold', color: '#0A2540', marginBottom: '10px' }}>Revisão Ortográfica</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Correção terminológica e gramatical em tempo real.</p>
                    </div>
                    <div>
                         <h4 style={{ fontWeight: 'bold', color: '#0A2540', marginBottom: '10px' }}>Padronização</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Modelos de laudos que seguem as melhores práticas.</p>
                    </div>
                    <div>
                         <h4 style={{ fontWeight: 'bold', color: '#0A2540', marginBottom: '10px' }}>Segurança Clínica</h4>
                        <p style={{ fontSize: '0.9rem', color: '#64748B' }}>O médico sempre tem a palavra final e validação.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
