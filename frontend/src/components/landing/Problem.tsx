import React from 'react';
import { WalletIcon } from '../icons/WalletIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { FileTextIcon } from '../icons/FileTextIcon';

const Problem: React.FC = () => {
    
  const problems = [
      {
          icon: <WalletIcon className="" />,
          title: "Alto Custo",
          description: "Manter uma equipe médica interna completa é financeiramente inviável para muitas clínicas."
      },
      {
          icon: <ClockIcon className="" />,
          title: "Gargalos na Entrega",
          description: "Picos de demanda geram atrasos nos laudos, insatisfação dos pacientes e perda de prazos."
      },
      {
          icon: <SettingsIcon className="" />,
          title: "Falta de Flexibilidade",
          description: "Dificuldade em cobrir férias, ausências ou especialidades específicas quando necessário."
      },
      {
          icon: <FileTextIcon className="" />,
          title: "Processos Manuais",
          description: "Sistemas antigos, erros de digitação e falta de segurança nos dados dos pacientes."
      }
  ];

  return (
    <section className="lp-section-problem">
      <div className="lp-container">
        <h2 className="lp-h2" style={{ color: '#0A2540' }}>
            O modelo tradicional de laudos é <br />
            <span style={{ color: '#EF4444' }}>caro, lento e ineficiente</span>
        </h2>
        
        <div className="lp-problem-grid">
            {problems.map((item, index) => (
                <div key={index} className="lp-card-problem">
                    <div className="lp-icon-problem">
                        {item.icon}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '15px', color: '#0A2540' }}>{item.title}</h3>
                    <p style={{ color: '#64748B' }}>{item.description}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
