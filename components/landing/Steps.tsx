import React from 'react';

const Steps: React.FC = () => {
  return (
    <section className="lp-section-steps">
      <div className="lp-container">
        <div style={{ textAlign: 'center' }}>
            <h2 className="lp-h2" style={{ color: '#0A2540' }}>Como Funciona</h2>
            <p style={{ color: '#64748B' }}>Fluxo simplificado para agilidade máxima</p>
        </div>

        <div className="lp-steps-container">
            <div className="lp-steps-line">
                 {/* Progress mock */}
                 <div className="lp-steps-line-progress" style={{ width: '60%' }}></div>
            </div>
            
            <div className="lp-step-item">
                <div className="lp-step-number">1</div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '10px', color: '#0A2540' }}>Envio do Exame</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>A clínica faz upload das imagens (DICOM/JPG) na plataforma.</p>
            </div>
            
            <div className="lp-step-item">
                <div className="lp-step-number">2</div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '10px', color: '#0A2540' }}>Laudo Médico</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Um especialista disponível aceita e inicia a análise.</p>
            </div>
             
            <div className="lp-step-item">
                <div className="lp-step-number">3</div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '10px', color: '#0A2540' }}>Apoio da IA</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>A IA sugere correções e melhorias no texto.</p>
            </div>
            
            <div className="lp-step-item">
                <div className="lp-step-number">4</div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '10px', color: '#0A2540' }}>Entrega</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Laudo assinado digitalmente e disponível para o paciente.</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
