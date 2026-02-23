import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { PlusIcon } from '../../icons/PlusIcon';
import { useToast } from '../../../contexts/ToastContext';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string, cpf: string, email: string, sex?: string }) => Promise<any>;
  onSubmitAndRequest?: (data: { name: string, cpf: string, email: string, sex?: string }) => Promise<void>;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSubmitAndRequest,
}) => {
  // Personal Data
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState('');
  const [motherName, setMotherName] = useState('');

  // Contact
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');

  // Insurance
  const [insuranceName, setInsuranceName] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [insuranceValidity, setInsuranceValidity] = useState('');

  const { addToast } = useToast();

  const handleSaveOnly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && cpf && email) {
      try {
        await onSubmit({ name, cpf, email, sex });
        addToast('Paciente cadastrado com sucesso!', 'success');
        resetAndClose();
      } catch (error) {
        // App.tsx handles alert
      }
    }
  };

  const handleSaveAndRequest = async () => {
    if (name && cpf && email) {
      try {
        if (onSubmitAndRequest) {
          await onSubmitAndRequest({ name, cpf, email, sex });
          // No need for toast here if opening another modal, or we can add it
          resetAndClose();
        }
      } catch (error) {
        // App.tsx handles alert
      }
    } else {
        addToast('Preencha os campos obrigatórios (*)', 'error');
    }
  };

  const resetAndClose = () => {
    onClose();
    // Reset form
    setName(''); setCpf(''); setRg(''); setBirthDate(''); setSex(''); setMotherName('');
    setEmail(''); setPhone(''); setCellphone(''); setCep(''); setAddress(''); setNumber(''); setComplement(''); setNeighborhood(''); setCity(''); setUf('');
    setInsuranceName(''); setInsuranceNumber(''); setInsuranceValidity('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Novo Paciente">
      <form onSubmit={handleSaveOnly} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        
        {/* Dados Pessoais */}
        <section>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-1">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">CPF *</label>
              <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required placeholder="000.000.000-00" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">RG</label>
              <input type="text" value={rg} onChange={(e) => setRg(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Data de Nascimento</label>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Sexo</label>
              <select value={sex} onChange={(e) => setSex(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500">
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Nome da Mãe</label>
              <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
            </div>
          </div>
        </section>

        {/* Contato e Endereço */}
        <section>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-1">Contato e Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">E-mail *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-2">
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Celular</label>
                  <input type="text" value={cellphone} onChange={(e) => setCellphone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Telefone Fixo</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
               </div>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-4 gap-4">
                <div className="col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">CEP</label>
                    <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                </div>
                <div className="col-span-3">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Endereço</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
                 <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Número</label>
                    <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                </div>
                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Complemento</label>
                    <input type="text" value={complement} onChange={(e) => setComplement(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                </div>
            </div>
             
             <div className="grid grid-cols-3 gap-4 md:col-span-2">
                 <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Bairro</label>
                    <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Cidade</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">UF</label>
                    <input type="text" value={uf} onChange={(e) => setUf(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                </div>
            </div>
          </div>
        </section>

        {/* Convênio */}
        <section>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-1">Convênio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Convênio</label>
              <input type="text" value={insuranceName} onChange={(e) => setInsuranceName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nº Carteirinha</label>
                  <input type="text" value={insuranceNumber} onChange={(e) => setInsuranceNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Validade</label>
                  <input type="text" value={insuranceValidity} onChange={(e) => setInsuranceValidity(e.target.value)} placeholder="MM/AA" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500" />
               </div>
            </div>
          </div>
        </section>

        <div className="mt-8 flex justify-end space-y-3 md:space-y-0 md:space-x-4 pt-6 border-t border-gray-100 flex-col md:flex-row">
          <Button type="button" variant="outline" onClick={onClose} className="w-full md:w-auto h-12 uppercase tracking-widest text-[10px] font-black">Cancelar</Button>
          <div className="flex flex-col md:flex-row gap-3">
             <Button type="submit" variant="secondary" className="w-full md:w-auto h-12 px-8 uppercase tracking-widest text-[10px] font-black bg-gray-100 border-gray-200">Apenas Cadastrar</Button>
             <Button 
                type="button" 
                onClick={handleSaveAndRequest} 
                className="w-full md:w-auto h-12 px-8 bg-brand-blue-600 text-white uppercase tracking-widest text-[10px] font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
               <PlusIcon className="w-4 h-4" />
               Salvar e Novo Exame
             </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
