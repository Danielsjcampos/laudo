import React from 'react';


const BusinessModel: React.FC = () => {
  return (
    <section className="lp-section-pricing">
      <div className="lp-container">
        <div style={{ textAlign: 'center' }}>
            <h2 className="lp-h2" style={{ color: '#0A2540' }}>Modelo de Negócio Transparente</h2>
            <p style={{ color: '#64748B' }}>Sem mensalidades fixas. Pague apenas pelo que utilizar.</p>
        </div>

        <div className="lp-pricing-grid">
            {/* Clinics Model */}
            <div className="lp-pricing-card">
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0A2540' }}>Para Clínicas</h3>
                <div className="lp-price-tag">
                    <span style={{ fontSize: '1rem', color: '#64748B', display: 'block', marginBottom: '5px' }}>Custo Fixo</span>
                    Zero<span style={{ fontSize: '1rem', color: '#64748B' }}>/mês</span>
                </div>
                <p style={{ color: '#64748B', marginBottom: '30px' }}>Pague apenas o valor do laudo emitido. Sem taxas de adesão.</p>
                
                <ul className="lp-audience-list" style={{ textAlign: 'left', marginBottom: '30px' }}>
                    <li>Acesso gratuito à plataforma</li>
                    <li>Laudos a partir de R$ 29,90</li>
                    <li>Retorno em até 2 horas</li>
                    <li>Suporte técnico incluso</li>
                </ul>
                <button className="lp-btn lp-btn-primary" style={{ width: '100%' }}>Começar Agora</button>
            </div>

            {/* Doctors Model */}
            <div className="lp-pricing-card featured">
                <div style={{ position: 'absolute', top: '0', right: '0', background: '#6A5CFF', color: 'white', padding: '5px 15px', borderBottomLeftRadius: '10px', fontSize: '0.8rem' }}>Profissionais</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0A2540' }}>Para Médicos</h3>
                 <div className="lp-price-tag">
                    <span style={{ fontSize: '1rem', color: '#64748B', display: 'block', marginBottom: '5px' }}>Ganho Médio</span>
                    85%<span style={{ fontSize: '1rem', color: '#64748B' }}> do valor</span>
                </div>
                <p style={{ color: '#64748B', marginBottom: '30px' }}>Maximize seus ganhos laudando exames de todo o Brasil.</p>
                
                <ul className="lp-audience-list" style={{ textAlign: 'left', marginBottom: '30px' }}>
                     <li>Flexibilidade total de horário</li>
                     <li>Volume constante de exames</li>
                     <li>Pagamento quinzenal garantido</li>
                     <li>IA de suporte ao diagnóstico</li>
                </ul>
                <button className="lp-btn lp-btn-secondary" style={{ width: '100%', borderColor: '#6A5CFF', color: '#6A5CFF' }}>Cadastrar Grátis</button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModel;
