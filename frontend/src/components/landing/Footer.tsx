import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    
    return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-grid">
            <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>Laudo Digital</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Conectando a saúde à tecnologia.</p>
            </div>
            
            <div>
                <h4 style={{ fontWeight: '600', marginBottom: '20px' }}>Para Clínicas</h4>
                <a href="#" className="lp-footer-link">Como funciona</a>
                <a href="#" className="lp-footer-link">Planos e Preços</a>
                <a href="#" className="lp-footer-link">Rede Credenciada</a>
            </div>
            
            <div>
                 <h4 style={{ fontWeight: '600', marginBottom: '20px' }}>Para Médicos</h4>
                <a href="#" className="lp-footer-link">Seja um Laudador</a>
                <a href="#" className="lp-footer-link">Benefícios</a>
                <a href="#" className="lp-footer-link">Tecnologia IA</a>
            </div>
            
             <div>
                 <h4 style={{ fontWeight: '600', marginBottom: '20px' }}>Institucional</h4>
                <a href="#" className="lp-footer-link">Sobre Nós</a>
                <a href="#" className="lp-footer-link">Contato</a>
                <a href="#" className="lp-footer-link">Termos de Uso</a>
                <a href="#" className="lp-footer-link">Privacidade</a>
            </div>
        </div>
        
        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            &copy; {currentYear} Laudo Digital. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
