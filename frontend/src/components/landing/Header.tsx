import React from 'react';

interface HeaderProps {
  onNavigateToLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToLogin }) => {
  return (
    <header style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 100, padding: '20px 0' }}>
      <div className="lp-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>
            Laudo<span style={{ color: '#2DD4BF' }}>Digital</span>
        </div>
        
        <nav style={{ display: 'none', md: { display: 'flex' } }}>
             {/* Simple nav, hidden on mobile for now as per minimal implementation or add responsive toggle later */}
             {/* For now, just desktop links or none if not requested explicitly beyond "Links" in footer. 
                But a landing needs nav.
             */}
             <div style={{ display: 'flex', gap: '30px' }}>
                 <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, opacity: 0.9 }}>Clínicas</a>
                 <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, opacity: 0.9 }}>Médicos</a>
                 <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, opacity: 0.9 }}>Sobre</a>
                 <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, opacity: 0.9 }}>Contato</a>
             </div>
        </nav>
        
        <div>
            <button 
                onClick={onNavigateToLogin}
                className="lp-btn" 
                style={{ padding: '8px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '0.9rem' }}
            >
                Login
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
