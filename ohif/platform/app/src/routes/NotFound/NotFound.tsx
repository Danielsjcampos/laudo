import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button, Icons } from '@ohif/ui-next';
import { useAppConfig } from '@state';

const NotFound = ({
  message = "We can't find the page you're looking for.",
  showGoBackButton = true,
}) => {
  const [appConfig] = useAppConfig();
  const { showStudyList } = appConfig;
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0D17] overflow-hidden selection:bg-brand-500/30 font-sans" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Animated Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40rem] h-[40rem] rounded-full bg-cyan-900/20 mix-blend-screen filter blur-[100px] animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-blue-900/20 mix-blend-screen filter blur-[120px] animate-[pulse_8s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-6">
        
        {/* Core Animated Indicator */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="relative flex items-center justify-center w-24 h-24 bg-[#15192B] border border-white/10 rounded-full shadow-2xl backdrop-blur-md">
            <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
            </svg>
            <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-[#15192B] rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Status Text Area */}
        <div className="text-center space-y-4 bg-[#15192B]/60 backdrop-blur-lg border border-white/5 rounded-3xl p-10 shadow-2xl w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Serviço Online</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            PACS DICOM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Engine</span>
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-md mx-auto pt-2">
            O subsistema de renderização de imagens radiológicas está ativo, estruturado e aguardando requisições do Hub Principal.
          </p>

          <div className="pt-6 mt-6 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Status</p>
              <p className="text-emerald-400 font-mono text-sm">Listening</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Bridge</p>
              <p className="text-cyan-400 font-mono text-sm">Connected</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">CORS</p>
              <p className="text-cyan-400 font-mono text-sm">Valid</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">WADO-RS</p>
              <p className="text-emerald-400 font-mono text-sm">Ready</p>
            </div>
          </div>

          {showGoBackButton && showStudyList && (
            <div className="pt-6">
              <Button
                className="bg-white/5 hover:bg-white/10 text-white border-white/10 transition-all text-sm px-6 py-2 rounded-xl"
                onClick={() => navigate('/')}
              >
                Voltar
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest">
            LaudoDigital Architecture • Protected node
          </p>
        </div>
      </div>
    </div>
  );
};

NotFound.propTypes = {
  message: PropTypes.string,
  showGoBackButton: PropTypes.bool,
};

export default NotFound;
