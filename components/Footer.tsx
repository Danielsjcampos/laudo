import React from 'react';
import { StethoscopeIcon } from './icons/StethoscopeIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { FacebookIcon } from './icons/FacebookIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center space-x-2 mb-4">
              <StethoscopeIcon className="h-8 w-8 text-brand-blue-600" />
              <span className="text-2xl font-bold text-gray-800">Laudo<span className="text-brand-blue-600">Digital</span></span>
            </a>
            <p className="text-gray-500">
              Conectando a saúde com tecnologia para um futuro mais eficiente.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Soluções</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-brand-blue-600">Para Clínicas</a></li>
              <li><a href="#" className="text-gray-500 hover:text-brand-blue-600">Para Médicos</a></li>
              <li><a href="#" className="text-gray-500 hover:text-brand-blue-600">Para Pacientes</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-brand-blue-600">Sobre nós</a></li>
              <li><a href="#" className="text-gray-500 hover:text-brand-blue-600">Contato</a></li>
              <li><a href="#" className="text-gray-500 hover:text-brand-blue-600">Carreiras</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-brand-blue-600">Termos de Serviço</a></li>
              <li><a href="#" className="text-gray-500 hover:text-brand-blue-600">Política de Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LaudoDigital. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-brand-blue-600"><TwitterIcon className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-brand-blue-600"><LinkedinIcon className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-brand-blue-600"><FacebookIcon className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
