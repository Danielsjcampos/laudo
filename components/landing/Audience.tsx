import React from 'react';
import { ClinicIcon } from '../icons/ClinicIcon';
import { DoctorIcon } from '../icons/DoctorIcon';
import { PatientIcon } from '../icons/PatientIcon';

const Audience: React.FC = () => {
  return (
    <section className="lp-section-audience">
      <div className="lp-container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="lp-h2" style={{ color: 'white' }}>Para quem é a plataforma?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
                Desenvolvemos soluções específicas para cada ponta do ecossistema de saúde.
            </p>
        </div>

        <div className="lp-audience-grid">
            {/* Clinics */}
            <div className="lp-card-audience">
                <div style={{ background: 'rgba(45, 212, 191, 0.2)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: '#2DD4BF' }}>
                    <ClinicIcon className="w-8 h-8" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>Para Clínicas</h3>
                <ul className="lp-audience-list">
                    <li>Solicite laudos sob demanda</li>
                    <li>Rede de especialistas disponível</li>
                    <li>Controle total de prazos</li>
                    <li>Redução de custos fixos</li>
                </ul>
            </div>

            {/* Doctors */}
            <div className="lp-card-audience" style={{ background: 'linear-gradient(180deg, rgba(106, 92, 255, 0.1) 0%, rgba(106, 92, 255, 0.05) 100%)', borderColor: 'rgba(106, 92, 255, 0.3)' }}>
                <div style={{ background: 'rgba(106, 92, 255, 0.2)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: '#6A5CFF' }}>
                    <DoctorIcon className="w-8 h-8" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>Para Médicos</h3>
                <ul className="lp-audience-list">
                    <li>Marketplace de laudos</li>
                    <li>Trabalhe de onde quiser</li>
                    <li>IA para revisão e correção</li>
                    <li>Renda extra recorrente</li>
                </ul>
            </div>

            {/* Patients */}
            <div className="lp-card-audience">
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: '#fff' }}>
                    <PatientIcon className="w-8 h-8" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>Para Pacientes</h3>
                <ul className="lp-audience-list">
                    <li>Acesso online aos exames</li>
                    <li>Histórico médico digital</li>
                    <li>Mais agilidade no diagnóstico</li>
                    <li>Privacidade garantida</li>
                </ul>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Audience;
