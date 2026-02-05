import React from 'react';


const BusinessModel: React.FC = () => {
  return (
    <section className="lp-section-pricing">
      <div className="lp-container">
        <div style={{ textAlign: 'center' }}>
            <h2 className="lp-h2" style={{ color: '#0A2540' }}>Planos Flexíveis</h2>
            <p style={{ color: '#64748B' }}>Escolha o modelo ideal para sua necessidade</p>
        </div>

        <div className="lp-pricing-grid">
            {/* Clinics Plan */}
            <div className="lp-pricing-card">
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0A2540' }}>Para Clínicas</h3>
                <div className="lp-price-tag">
                    <span style={{ fontSize: '1rem', color: '#64748B', display: 'block', marginBottom: '5px' }}>Comece com</span>
                    R$ 299<span style={{ fontSize: '1rem', color: '#64748B' }}>/mês</span>
                </div>
                <p style={{ color: '#64748B', marginBottom: '30px' }}>Para clínicas que precisam de agilidade e redução de custos.</p>
                
                <ul className="lp-audience-list" style={{ textAlign: 'left', marginBottom: '30px' }}>
                    <li>Acesso à rede de médicos</li>
                    <li>Gestão completa de laudos</li>
                    <li>Relatórios e Dashboard</li>
                    <li>Suporte prioritário</li>
                </ul>
                <button className="lp-btn lp-btn-primary" style={{ width: '100%' }}>Assinar Agora</button>
            </div>

            {/* Doctors Plan */}
            <div className="lp-pricing-card featured">
                <div style={{ position: 'absolute', top: '0', right: '0', background: '#6A5CFF', color: 'white', padding: '5px 15px', borderBottomLeftRadius: '10px', fontSize: '0.8rem' }}>Recomendado</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0A2540' }}>Para Médicos</h3>
                 <div className="lp-price-tag">
                    <span style={{ fontSize: '1rem', color: '#64748B', display: 'block', marginBottom: '5px' }}>Acesso</span>
                    Gratuito
                </div>
                <p style={{ color: '#64748B', marginBottom: '30px' }}>Junte-se ao marketplace e comece a laudar hoje mesmo.</p>
                
                <ul className="lp-audience-list" style={{ textAlign: 'left', marginBottom: '30px' }}>
                     <li>Acesso a exames ilimitados</li>
                     <li>IA Médica Inclusa</li>
                     <li>Assinatura Digital</li>
                     <li>Recebimento quinzenal</li>
                </ul>
                <button className="lp-btn lp-btn-secondary" style={{ width: '100%', borderColor: '#6A5CFF', color: '#6A5CFF' }}>Cadastrar Grátis</button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModel;
